
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Project, ProjectStage, ProjectStatus, ProjectType, UsefulnessRating } from "@/types/project";
import { ExternalLink, Trash2 } from 'lucide-react';
import { toast } from "sonner";
import ProgressBar from './ProgressBar';
import ActivityLog from './ActivityLog';
import TagManager from './TagManager';
import { usefulnessEmoji, statusEmoji, stageEmoji, getStageColor } from "@/lib/data";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProjectCardProps {
  project: Project;
  onUpdateProject: (updatedProject: Project) => void;
  onDeleteProject?: (projectId: string) => void;
}

const ProjectCard = ({ project, onUpdateProject, onDeleteProject }: ProjectCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState<Project>({ ...project });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEditSubmit = () => {
    onUpdateProject(editedProject);
    setIsEditing(false);
    toast.success("Project updated successfully!");
  };

  const handleProgressChange = (progress: number) => {
    const updatedProject = { ...project, progress };
    onUpdateProject(updatedProject);
  };
  
  const handleActivityLogUpdate = (activityLog: string[]) => {
    const updatedProject = { ...project, activityLog };
    onUpdateProject(updatedProject);
  };
  
  const handleTagsChange = (tags: string[]) => {
    const updatedProject = { ...project, tags };
    onUpdateProject(updatedProject);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (onDeleteProject) {
      onDeleteProject(project.id);
      setShowDeleteConfirm(false);
      toast.success("Project deleted successfully!");
    }
  };

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'idea': return 'bg-purple-100 text-purple-800';
      case 'abandoned': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: ProjectType) => {
    return type === 'personal' ? 'Personal' : 'For Sale';
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5 }}
        className="h-full"
      >
        <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg font-semibold">{project.name}</CardTitle>
              <div className="flex space-x-2">
                {project.isMonetized && (
                  <span className="text-lg" title="Monetized">💰</span>
                )}
                <span className="text-lg" title={`Usefulness: ${project.usefulness}/5`}>
                  {usefulnessEmoji(project.usefulness)}
                </span>
              </div>
            </div>
            {project.summary && (
              <p className="text-sm font-medium mt-1">{project.summary}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">{project.description}</p>
          </CardHeader>
          <CardContent className="pb-2 flex-grow">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getStatusColor(project.status)}`}>
                  {statusEmoji(project.status)} {project.status.replace('_', ' ')}
                </span>
                {project.stage && (
                  <span className={`text-xs px-2 py-1 rounded-full flex items-center ${getStageColor(project.stage)}`}>
                    {stageEmoji(project.stage)} {project.stage}
                  </span>
                )}
                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                  {getTypeLabel(project.type)}
                </span>
              </div>
              
              {/* Progress Bar */}
              <ProgressBar 
                progress={project.progress} 
                onProgressChange={handleProgressChange}
              />
              
              {/* Tags */}
              {project.tags && project.tags.length > 0 && (
                <div className="mt-2">
                  <TagManager 
                    tags={project.tags} 
                    onTagsChange={handleTagsChange}
                  />
                </div>
              )}

              {project.nextAction && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-500">Next action:</p>
                  <p className="text-sm">{project.nextAction}</p>
                </div>
              )}
              
              {/* Activity Log */}
              {project.activityLog && project.activityLog.length > 0 && (
                <div className="mt-2">
                  <ActivityLog 
                    activityLog={project.activityLog}
                    onUpdateActivityLog={handleActivityLogUpdate}
                  />
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2 flex flex-col items-start">
            <div className="w-full flex flex-wrap gap-2 mb-2">
              {project.githubUrl && (
                <a 
                  href={project.githubUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
                >
                  GitHub <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
              {project.websiteUrl && (
                <a 
                  href={project.websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-gray-500 hover:text-gray-700"
                >
                  Website <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              )}
            </div>
            <div className="w-full flex justify-between items-center">
              {project.lastUpdated && (
                <span className="text-xs text-gray-500">
                  Updated: {project.lastUpdated}
                </span>
              )}
              <div className="flex space-x-2">
                {onDeleteProject && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Name</label>
              <Input
                className="col-span-3"
                value={editedProject.name}
                onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Summary</label>
              <Input
                className="col-span-3"
                value={editedProject.summary || ''}
                onChange={(e) => setEditedProject({ ...editedProject, summary: e.target.value || undefined })}
                placeholder="Brief summary of the project"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Description</label>
              <Textarea
                className="col-span-3"
                value={editedProject.description}
                onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Type</label>
              <Select
                value={editedProject.type}
                onValueChange={(value: ProjectType) => setEditedProject({ ...editedProject, type: value })}
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
              <label className="text-right text-sm">Status</label>
              <Select
                value={editedProject.status}
                onValueChange={(value: ProjectStatus) => setEditedProject({ ...editedProject, status: value })}
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
              <label className="text-right text-sm">Stage</label>
              <Select
                value={editedProject.stage || ''}
                onValueChange={(value: string) => setEditedProject({ 
                  ...editedProject, 
                  stage: value ? value as ProjectStage : undefined 
                })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Idea">Idea {stageEmoji('Idea')}</SelectItem>
                  <SelectItem value="Build">Build {stageEmoji('Build')}</SelectItem>
                  <SelectItem value="Launch">Launch {stageEmoji('Launch')}</SelectItem>
                  <SelectItem value="Market">Market {stageEmoji('Market')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Usefulness</label>
              <Select
                value={editedProject.usefulness.toString()}
                onValueChange={(value) => setEditedProject({ ...editedProject, usefulness: parseInt(value) as UsefulnessRating })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 {usefulnessEmoji(1)}</SelectItem>
                  <SelectItem value="2">2 {usefulnessEmoji(2)}</SelectItem>
                  <SelectItem value="3">3 {usefulnessEmoji(3)}</SelectItem>
                  <SelectItem value="4">4 {usefulnessEmoji(4)}</SelectItem>
                  <SelectItem value="5">5 {usefulnessEmoji(5)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Monetized</label>
              <Select
                value={editedProject.isMonetized ? "true" : "false"}
                onValueChange={(value) => setEditedProject({ ...editedProject, isMonetized: value === "true" })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes 💰</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Progress</label>
              <div className="col-span-3">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editedProject.progress || 0}
                  onChange={(e) => setEditedProject({ ...editedProject, progress: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">GitHub URL</label>
              <Input
                className="col-span-3"
                value={editedProject.githubUrl || ''}
                onChange={(e) => setEditedProject({ ...editedProject, githubUrl: e.target.value || undefined })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Website URL</label>
              <Input
                className="col-span-3"
                value={editedProject.websiteUrl || ''}
                onChange={(e) => setEditedProject({ ...editedProject, websiteUrl: e.target.value || undefined })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Next Action</label>
              <Input
                className="col-span-3"
                value={editedProject.nextAction || ''}
                onChange={(e) => setEditedProject({ ...editedProject, nextAction: e.target.value || undefined })}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right text-sm">Last Updated</label>
              <Input
                className="col-span-3"
                type="date"
                value={editedProject.lastUpdated || ''}
                onChange={(e) => setEditedProject({ ...editedProject, lastUpdated: e.target.value || undefined })}
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right text-sm pt-2">Tags</label>
              <div className="col-span-3">
                <TagManager 
                  tags={editedProject.tags || []} 
                  onTagsChange={(tags) => setEditedProject({ ...editedProject, tags })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button onClick={handleEditSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and remove it from your dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ProjectCard;
