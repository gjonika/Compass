
import { Button } from "@/components/ui/button";
import { SquareStack, LayoutList } from "lucide-react";
import { motion } from "framer-motion";

interface ViewToggleProps {
  view: 'card' | 'table';
  onViewChange: (view: 'card' | 'table') => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <motion.div 
      className="flex border rounded-md overflow-hidden"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={view === 'card' ? 'default' : 'ghost'}
          onClick={() => onViewChange('card')}
          size="sm"
          className="rounded-r-none"
        >
          <LayoutList className="h-4 w-4 mr-2" />
          Cards
        </Button>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant={view === 'table' ? 'default' : 'ghost'}
          onClick={() => onViewChange('table')}
          size="sm"
          className="rounded-l-none"
        >
          <SquareStack className="h-4 w-4 mr-2" />
          Table
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ViewToggle;
