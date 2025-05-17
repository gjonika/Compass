
import { Download } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Project } from "@/types/project";
import { toast } from "sonner";
import { exportProjectsToCSV } from "@/lib/csv";
import { motion } from "framer-motion";

interface ExportButtonProps {
  projects: Project[];
}

const ExportButton = ({ projects }: ExportButtonProps) => {
  const exportAsJSON = () => {
    const dataStr = JSON.stringify(projects, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `projects-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast.success("Projects exported as JSON");
  };

  const exportAsCSV = () => {
    exportProjectsToCSV(projects);
  };

  return (
    <motion.div 
      className="flex space-x-2"
      whileHover={{ scale: 1.02 }}
    >
      <Button 
        onClick={exportAsJSON} 
        variant="outline" 
        size="sm"
        className="flex items-center"
      >
        <Download className="h-4 w-4 mr-1" />
        JSON
      </Button>
      <Button 
        onClick={exportAsCSV} 
        variant="outline" 
        size="sm"
        className="flex items-center"
      >
        <Download className="h-4 w-4 mr-1" />
        CSV
      </Button>
    </motion.div>
  );
};

export default ExportButton;
