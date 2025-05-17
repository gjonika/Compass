
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress?: number;
  onProgressChange?: (progress: number) => void;
  readOnly?: boolean;
  className?: string;
}

const ProgressBar = ({ 
  progress = 0, 
  onProgressChange, 
  readOnly = false,
  className 
}: ProgressBarProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(progress.toString());
  
  const handleProgressClick = () => {
    if (readOnly || !onProgressChange) return;
    setIsEditing(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleInputBlur = () => {
    const newValue = Math.min(100, Math.max(0, parseInt(inputValue) || 0));
    if (onProgressChange) {
      onProgressChange(newValue);
    }
    setInputValue(newValue.toString());
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(progress.toString());
    }
  };
  
  const getProgressColor = (percent: number) => {
    if (percent < 25) return "bg-red-400";
    if (percent < 50) return "bg-yellow-400";
    if (percent < 75) return "bg-blue-400";
    return "bg-green-400";
  };
  
  return (
    <div className={cn("w-full space-y-1", className)}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium">Progress</span>
        {isEditing ? (
          <Input
            type="number"
            min="0"
            max="100"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            autoFocus
            className="h-6 w-16 text-xs px-2 py-0"
          />
        ) : (
          <span 
            className={`text-xs font-medium ${readOnly ? '' : 'cursor-pointer'}`}
            onClick={handleProgressClick}
          >
            {progress}%
          </span>
        )}
      </div>
      <Progress 
        value={progress} 
        className="h-2"
      />
    </div>
  );
};

export default ProgressBar;
