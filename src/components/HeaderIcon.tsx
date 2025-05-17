
import { motion } from "framer-motion";
import { RotateCw } from "lucide-react";

interface HeaderIconProps {
  className?: string;
}

const HeaderIcon = ({ className }: HeaderIconProps) => {
  return (
    <motion.div
      className={className}
      animate={{ rotate: 360 }}
      transition={{ 
        duration: 10, 
        ease: "linear", 
        repeat: Infinity 
      }}
    >
      <RotateCw className="h-6 w-6 text-primary" />
    </motion.div>
  );
};

export default HeaderIcon;
