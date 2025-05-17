
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Tag, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";

interface TagManagerProps {
  tags?: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagManager = ({ tags = [], onTagsChange }: TagManagerProps) => {
  const [newTag, setNewTag] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (!trimmedTag) return;
    
    if (tags.includes(trimmedTag)) {
      toast.error("Tag already exists");
      return;
    }
    
    const updatedTags = [...tags, trimmedTag];
    onTagsChange(updatedTags);
    setNewTag("");
    toast.success("Tag added");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    onTagsChange(updatedTags);
    toast.success("Tag removed");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <Badge key={index} variant="outline" className="text-xs px-2 py-0 gap-1">
            {tag}
            <X 
              className="h-3 w-3 cursor-pointer hover:text-red-500" 
              onClick={() => handleRemoveTag(tag)} 
            />
          </Badge>
        ))}
        
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-5 px-2 text-xs rounded-full"
            >
              <Plus className="h-3 w-3 mr-1" /> Add tag
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-2">
            <div className="flex space-x-2">
              <Input 
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter tag name"
                className="h-8 text-sm"
              />
              <Button 
                size="sm" 
                onClick={handleAddTag}
                className="h-8"
              >
                Add
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default TagManager;
