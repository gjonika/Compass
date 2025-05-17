
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectStatus, ProjectType, UsefulnessRating } from "@/lib/data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export interface FilterOptions {
  search: string;
  status: ProjectStatus | 'all';
  type: ProjectType | 'all';
  usefulness: UsefulnessRating | 'all';
  showMonetizedOnly: boolean;
}

interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (newFilters: FilterOptions) => void;
  onAddProject: (project: any) => void;
}

const Filters = ({ filters, onFilterChange, onAddProject }: FiltersProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    type: 'personal' as ProjectType,
    status: 'idea' as ProjectStatus,
    usefulness: 3 as UsefulnessRating,
    isMonetized: false,
    githubUrl: '',
    websiteUrl: '',
    nextAction: '',
    lastUpdated: new Date().toISOString().split('T')[0]
  });

  const handleAddProject = () => {
    // Validate required fields
    if (!newProject.name.trim()) {
      toast.error("Project name is required");
      return;
    }

    onAddProject({
      ...newProject,
      id: Date.now().toString(), // Simple ID generation
    });
    
    // Reset form & close dialog
    setNewProject({
      name: '',
      description: '',
      type: 'personal',
      status: 'idea',
      usefulness: 3,
      isMonetized: false,
      githubUrl: '',
      websiteUrl: '',
      nextAction: '',
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    setIsAddDialogOpen(false);
    toast.success("Project added successfully!");
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="col-span-1 lg:col-span-2">
          <Input
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full"
          />
        </div>
        <div>
          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange({ ...filters, status: value as ProjectStatus | 'all' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="idea">Idea</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="live">Live</SelectItem>
              <SelectItem value="abandoned">Abandoned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.type}
            onValueChange={(value) => onFilterChange({ ...filters, type: value as ProjectType | 'all' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="sell">For Sale</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.usefulness.toString()}
            onValueChange={(value) => onFilterChange({ ...filters, usefulness: value === 'all' ? 'all' : parseInt(value) as UsefulnessRating })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Usefulness" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="1">1 ⭐</SelectItem>
              <SelectItem value="2">2 ⭐</SelectItem>
              <SelectItem value="3">3 ⭐</SelectItem>
              <SelectItem value="4">4 ⭐</SelectItem>
              <SelectItem value="5">5 ⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="monetized" 
            checked={filters.showMonetizedOnly}
            onCheckedChange={(checked) => 
              onFilterChange({ ...filters, showMonetizedOnly: !!checked })
            }
          />
          <Label htmlFor="monetized">Show monetized only</Label>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a new project to track in your dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name*
                </Label>
                <Input
                  id="name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={newProject.type}
                  onValueChange={(value: ProjectType) => setNewProject({ ...newProject, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="sell">For Sale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newProject.status}
                  onValueChange={(value: ProjectStatus) => setNewProject({ ...newProject, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="abandoned">Abandoned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usefulness" className="text-right">
                  Usefulness
                </Label>
                <Select
                  value={newProject.usefulness.toString()}
                  onValueChange={(value) => setNewProject({ ...newProject, usefulness: parseInt(value) as UsefulnessRating })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 ⭐</SelectItem>
                    <SelectItem value="2">2 ⭐</SelectItem>
                    <SelectItem value="3">3 ⭐</SelectItem>
                    <SelectItem value="4">4 ⭐</SelectItem>
                    <SelectItem value="5">5 ⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="monetized" className="text-right">
                  Monetized
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Checkbox 
                    id="new-monetized" 
                    checked={newProject.isMonetized}
                    onCheckedChange={(checked) => 
                      setNewProject({ ...newProject, isMonetized: !!checked })
                    }
                  />
                  <Label htmlFor="new-monetized">Yes 💰</Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="github" className="text-right">
                  GitHub URL
                </Label>
                <Input
                  id="github"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="website" className="text-right">
                  Website URL
                </Label>
                <Input
                  id="website"
                  value={newProject.websiteUrl}
                  onChange={(e) => setNewProject({ ...newProject, websiteUrl: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nextAction" className="text-right">
                  Next Action
                </Label>
                <Input
                  id="nextAction"
                  value={newProject.nextAction}
                  onChange={(e) => setNewProject({ ...newProject, nextAction: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Filters;
