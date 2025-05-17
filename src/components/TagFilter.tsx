
import { useState, useMemo, useEffect } from 'react';
import { Check, Search, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagFilter = ({ allTags, selectedTags, onTagsChange }: TagFilterProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  // Sorted tags for display
  const sortedTags = useMemo(() => 
    [...allTags].sort((a, b) => a.localeCompare(b)), 
    [allTags]
  );

  // Filtered tags based on search query
  const filteredTags = useMemo(() => 
    sortedTags.filter(tag => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [sortedTags, searchQuery]
  );

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter(t => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearSelectedTags = () => {
    onTagsChange([]);
  };

  // Clear search when dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center">
            <Tag className="mr-2 h-4 w-4" />
            Filter by Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-background" align="start">
          <div className="p-2">
            <div className="flex items-center px-2 pb-2">
              <Search className="mr-2 h-4 w-4 opacity-50" />
              <Input
                placeholder="Search tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-full text-sm"
              />
            </div>
            {selectedTags.length > 0 && (
              <div className="flex justify-end px-2 pb-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 px-2 text-xs"
                  onClick={clearSelectedTags}
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
          <DropdownMenuSeparator />
          <div className="max-h-[300px] overflow-y-auto p-1">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <DropdownMenuCheckboxItem
                  key={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                >
                  {tag}
                </DropdownMenuCheckboxItem>
              ))
            ) : (
              <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                No tags found
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selected tags display */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedTags.map(tag => (
            <Badge key={tag} variant="secondary" className="gap-1 text-xs">
              {tag}
              <X 
                className="ml-1 h-3 w-3 cursor-pointer" 
                onClick={() => toggleTag(tag)} 
              />
            </Badge>
          ))}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 px-2 text-xs"
            onClick={clearSelectedTags}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
};

export default TagFilter;
