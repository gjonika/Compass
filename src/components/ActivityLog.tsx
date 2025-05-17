
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { toast } from "sonner";

interface ActivityLogProps {
  activityLog?: string[];
  onUpdateActivityLog: (activityLog: string[]) => void;
}

const ActivityLog = ({ activityLog = [], onUpdateActivityLog }: ActivityLogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newEntry, setNewEntry] = useState("");

  const handleAddEntry = () => {
    if (!newEntry.trim()) {
      return;
    }
    
    const date = new Date().toISOString().split('T')[0];
    const newLogEntry = `${date}: ${newEntry}`;
    const updatedLog = [newLogEntry, ...activityLog];
    onUpdateActivityLog(updatedLog);
    setNewEntry("");
    toast.success("Activity logged");
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="flex w-full justify-between p-2">
          <span>Activity Log ({activityLog.length})</span>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2">
        <div className="flex gap-2">
          <Textarea 
            placeholder="What did you accomplish?"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            className="text-sm"
          />
          <Button size="sm" onClick={handleAddEntry} className="self-end">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="max-h-40 overflow-y-auto space-y-1">
          {activityLog.map((entry, index) => (
            <div key={index} className="text-sm p-2 bg-gray-50 rounded">
              {entry}
            </div>
          ))}
          {activityLog.length === 0 && (
            <div className="text-sm text-gray-500 italic p-2">No activity logged yet</div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ActivityLog;
