
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Project } from "@/types/project";
import { toast } from "sonner";
import { parseCSVToProjects, getCSVTemplate, CSVImportResult } from "@/lib/csv";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Download } from "lucide-react";

interface ImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (projects: Project[]) => void;
}

const ImportModal = ({ open, onOpenChange, onImport }: ImportModalProps) => {
  const [csvContent, setCsvContent] = useState<string>(getCSVTemplate());
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [importResult, setImportResult] = useState<CSVImportResult | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setFileUploadError('Please upload a CSV file');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
    };
    reader.onerror = () => {
      setFileUploadError('Error reading the file');
    };
    reader.readAsText(file);
  };
  
  const handleImport = () => {
    try {
      const result = parseCSVToProjects(csvContent);
      setImportResult(result);
      
      if (result.successful.length > 0) {
        setShowConfirmDialog(true);
      } else {
        toast.error(`Import failed: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      toast.error('Error parsing CSV file');
    }
  };
  
  const confirmImport = () => {
    if (importResult && importResult.successful.length > 0) {
      onImport(importResult.successful);
      setShowConfirmDialog(false);
      onOpenChange(false);
      toast.success(`Successfully imported ${importResult.successful.length} projects`);
      
      if (importResult.failed > 0) {
        toast.warning(`Failed to import ${importResult.failed} projects. Check console for details.`);
        console.error("Import errors:", importResult.errors);
      }
    }
  };

  const downloadTemplate = () => {
    const template = getCSVTemplate();
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'projects-template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Template downloaded successfully");
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Import Projects from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with your projects or edit the template below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 hover:bg-gray-100"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <span>Choose CSV File</span>
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  aria-label="Upload CSV file"
                />
                {fileUploadError && (
                  <p className="text-red-500 text-sm mt-1">{fileUploadError}</p>
                )}
              </div>
              <Button 
                variant="outline" 
                onClick={downloadTemplate}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>Download Template</span>
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-medium">CSV Content</label>
              <Textarea
                value={csvContent}
                onChange={(e) => setCsvContent(e.target.value)}
                className="font-mono text-sm h-[200px]"
              />
              <p className="text-xs text-gray-500 mt-1">
                First row should contain headers. Use semicolons (;) to separate items within array fields like tags and activity log.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Import</AlertDialogTitle>
            <AlertDialogDescription>
              This will import {importResult?.successful.length || 0} projects.
              {importResult?.failed ? ` ${importResult.failed} rows could not be imported.` : ''}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport}>Import Projects</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ImportModal;
