
import { useState, useEffect, useMemo } from 'react';
import ProjectCard from "@/components/ProjectCard";
import TableView from "@/components/TableView";
import Filters from "@/components/Filters";
import ViewToggle from "@/components/ViewToggle";
import ExportButton from "@/components/ExportButton";
import ImportModal from "@/components/ImportModal";
import ProjectInsights from "@/components/ProjectInsights";
import HeaderIcon from "@/components/HeaderIcon";
import TagFilter from "@/components/TagFilter";
import { projectsData } from "@/lib/data";
import { toast } from "sonner";
import { FilterOptions, Project } from "@/types/project";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    status: 'all',
    type: 'all',
    usefulness: 'all',
    showMonetizedOnly: false
  });
  const [view, setView] = useState<'card' | 'table'>('card');
  const [showInsights, setShowInsights] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Extract unique tags from all projects
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    projects.forEach(project => {
      project.tags?.forEach(tag => {
        if (tag) tagSet.add(tag);
      });
    });
    return Array.from(tagSet);
  }, [projects]);
  
  // Load initial data
  useEffect(() => {
    // Check if projects are stored in localStorage
    const storedProjects = localStorage.getItem('dashboard_projects');
    if (storedProjects) {
      try {
        setProjects(JSON.parse(storedProjects));
      } catch (error) {
        console.error('Failed to parse stored projects:', error);
        setProjects(projectsData);
      }
    } else {
      setProjects(projectsData);
    }
  }, []);
  
  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('dashboard_projects', JSON.stringify(projects));
    }
  }, [projects]);
  
  // Apply filters
  useEffect(() => {
    let result = [...projects];
    
    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchLower) || 
        (project.summary?.toLowerCase().includes(searchLower)) ||
        project.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply status filter
    if (filters.status !== 'all') {
      result = result.filter(project => project.status === filters.status);
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter(project => project.type === filters.type);
    }
    
    // Apply usefulness filter
    if (filters.usefulness !== 'all') {
      // Convert string usefulness to number for comparison
      const usefulnessValue = parseInt(filters.usefulness.toString());
      result = result.filter(project => project.usefulness === usefulnessValue);
    }
    
    // Apply monetized filter
    if (filters.showMonetizedOnly) {
      result = result.filter(project => project.isMonetized);
    }
    
    // Apply tag filters
    if (selectedTags.length > 0) {
      result = result.filter(project => 
        project.tags && selectedTags.every(tag => project.tags?.includes(tag))
      );
    }
    
    setFilteredProjects(result);
  }, [projects, filters, selectedTags]);
  
  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };
  
  const handleUpdateProject = (updatedProject: Project) => {
    const updatedProjects = projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    );
    setProjects(updatedProjects);
  };
  
  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(p => p.id !== projectId);
    setProjects(updatedProjects);
    toast.success("Project deleted successfully");
  };
  
  const handleAddProject = (newProject: Project) => {
    setProjects([...projects, newProject]);
    toast.success("Project added successfully");
  };

  const handleSort = (sortBy: string) => {
    const sorted = [...projects];
    
    switch (sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'status':
        sorted.sort((a, b) => a.status.localeCompare(b.status));
        break;
      case 'usefulness':
        sorted.sort((a, b) => b.usefulness - a.usefulness); // Sort by descending usefulness
        break;
      case 'type':
        sorted.sort((a, b) => a.type.localeCompare(b.type));
        break;
      case 'progress':
        sorted.sort((a, b) => (b.progress || 0) - (a.progress || 0)); // Sort by descending progress
        break;
      default:
        break;
    }
    
    setProjects(sorted);
    toast.info(`Sorted projects by ${sortBy}`);
  };

  const handleTableEdit = (project: Project) => {
    setEditProject(project);
  };

  const handleImportProjects = (importedProjects: Project[]) => {
    // Generate new IDs for imported projects to avoid conflicts
    const projectsWithNewIds = importedProjects.map(project => ({
      ...project,
      id: project.id || crypto.randomUUID()
    }));
    
    setProjects([...projects, ...projectsWithNewIds]);
    toast.success(`Imported ${projectsWithNewIds.length} projects`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              <HeaderIcon className="flex-shrink-0" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Project Dashboard
                </h1>
                <p className="text-gray-500 mt-1">Track and manage your side projects</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowInsights(!showInsights)}
              className="transition-colors"
            >
              {showInsights ? "Hide Insights" : "Show Insights"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
              Import CSV
            </Button>
            <ViewToggle view={view} onViewChange={setView} />
            <ExportButton projects={filteredProjects} />
          </div>
        </div>
        
        <AnimatePresence>
          {showInsights && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProjectInsights projects={projects} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <Filters 
            filters={filters}
            onFilterChange={handleFilterChange}
            onAddProject={handleAddProject}
          />
          
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={() => handleSort('name')}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Sort by Name
            </Button>
            <Button 
              onClick={() => handleSort('status')}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Sort by Status
            </Button>
            <Button 
              onClick={() => handleSort('usefulness')}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Sort by Usefulness
            </Button>
            <Button 
              onClick={() => handleSort('progress')}
              variant="outline"
              size="sm"
              className="text-sm"
            >
              Sort by Progress
            </Button>
          </div>
        </div>
        
        {/* Tag filter section */}
        <div className="mb-4">
          <TagFilter 
            allTags={allTags} 
            selectedTags={selectedTags} 
            onTagsChange={setSelectedTags} 
          />
        </div>
        
        <AnimatePresence mode="wait">
          {filteredProjects.length === 0 ? (
            <motion.div 
              className="text-center py-20"
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h2 className="text-2xl font-medium text-gray-600">No projects found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your filters or add a new project</p>
            </motion.div>
          ) : view === 'card' ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              key="card-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProjects.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="table-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TableView 
                projects={filteredProjects} 
                onUpdateProject={handleUpdateProject}
                onEdit={handleTableEdit}
                onDeleteProject={handleDeleteProject}
              />
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div 
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Showing {filteredProjects.length} of {projects.length} projects
        </motion.div>
      </div>
      
      {/* Project Edit Dialog for Table View */}
      {editProject && (
        <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
              <DialogDescription>Make changes to your project details below.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <ProjectCard 
                project={editProject} 
                onUpdateProject={(updated) => {
                  handleUpdateProject(updated);
                  setEditProject(null);
                }}
                onDeleteProject={(id) => {
                  handleDeleteProject(id);
                  setEditProject(null);
                }}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditProject(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Import Modal */}
      <ImportModal 
        open={showImportModal}
        onOpenChange={setShowImportModal}
        onImport={handleImportProjects}
      />
    </div>
  );
};

export default Dashboard;
