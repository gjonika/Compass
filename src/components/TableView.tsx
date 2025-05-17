
import { Project } from "@/types/project";
import { usefulnessEmoji, statusEmoji, stageEmoji, getStageColor } from "@/lib/data";
import ProgressBar from "@/components/ProgressBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Trash2 } from 'lucide-react';
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
import { useState } from "react";

interface TableViewProps {
  projects: Project[];
  onUpdateProject: (updatedProject: Project) => void;
  onEdit: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

const TableView = ({ projects, onUpdateProject, onEdit, onDeleteProject }: TableViewProps) => {
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

  const handleDelete = (projectId: string) => {
    setProjectToDelete(projectId);
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      onDeleteProject(projectToDelete);
      setProjectToDelete(null);
    }
  };

  return (
    <motion.div 
      className="overflow-x-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4 font-medium">Name</th>
            <th className="text-left py-3 px-4 font-medium">Status</th>
            <th className="text-left py-3 px-4 font-medium">Stage</th>
            <th className="text-left py-3 px-4 font-medium">Type</th>
            <th className="text-left py-3 px-4 font-medium">Usefulness</th>
            <th className="text-left py-3 px-4 font-medium">Progress</th>
            <th className="text-left py-3 px-4 font-medium">Tags</th>
            <th className="text-left py-3 px-4 font-medium">Links</th>
            <th className="text-left py-3 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <motion.tr 
              key={project.id} 
              className="border-b hover:bg-gray-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <td className="py-3 px-4">
                <div className="font-medium">{project.name}</div>
                <div className="text-xs text-gray-500">{project.summary || project.description}</div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-1">
                  <span>{statusEmoji(project.status)}</span>
                  <span>{project.status.replace('_', ' ')}</span>
                  {project.isMonetized && <span className="ml-1">💰</span>}
                </div>
              </td>
              <td className="py-3 px-4">
                {project.stage && (
                  <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center ${getStageColor(project.stage)}`}>
                    {stageEmoji(project.stage)} {project.stage}
                  </div>
                )}
              </td>
              <td className="py-3 px-4">
                {project.type === 'personal' ? 'Personal' : 'For Sale'}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  {project.usefulness} {usefulnessEmoji(project.usefulness)}
                </div>
              </td>
              <td className="py-3 px-4">
                <ProgressBar 
                  progress={project.progress} 
                  readOnly={true}
                  className="w-20"
                />
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {project.tags?.map((tag, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {project.websiteUrl && (
                    <a 
                      href={project.websiteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit(project)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
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
    </motion.div>
  );
};

export default TableView;
