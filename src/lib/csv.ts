
import { Project } from "@/types/project";
import { toast } from "sonner";

export const exportProjectsToCSV = (projects: Project[]): void => {
  // Get all possible fields from all projects
  const fields = new Set<string>();
  projects.forEach(project => {
    Object.keys(project).forEach(key => fields.add(key));
  });
  
  // Handle nested fields like arrays
  const processValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join('; ');
    }
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    return value !== undefined && value !== null ? String(value) : '';
  };
  
  // Create CSV header and rows
  const fieldsArray = Array.from(fields);
  let csv = fieldsArray.join(',') + '\n';
  
  projects.forEach(project => {
    const row = fieldsArray.map(field => {
      const value = project[field as keyof Project];
      return `"${processValue(value).replace(/"/g, '""')}"`;
    });
    csv += row.join(',') + '\n';
  });
  
  const dataUri = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
  const exportFileDefaultName = `projects-${new Date().toISOString().slice(0, 10)}.csv`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  toast.success("Projects exported as CSV");
};

export const getCSVTemplate = (): string => {
  return 'id,name,summary,description,type,usefulness,status,stage,isMonetized,githubUrl,websiteUrl,nextAction,lastUpdated,progress,activityLog,tags\n' +
    '"1","Example Project","Short summary here","Longer description","personal","5","in_progress","Build","false","https://github.com/example/project","https://example.com","Next step to take","2023-05-10","75","Update 1; Update 2","Tag1; Tag2"';
};

export interface CSVImportResult {
  successful: Project[];
  failed: number;
  errors: string[];
}

export const parseCSVToProjects = (csvContent: string): CSVImportResult => {
  const rows = csvContent.split('\n');
  if (rows.length < 2) {
    return { successful: [], failed: 1, errors: ['CSV file has no data rows'] };
  }

  const headers = parseCSVRow(rows[0]);
  const result: CSVImportResult = {
    successful: [],
    failed: 0,
    errors: []
  };

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].trim();
    if (!row) continue;
    
    try {
      const values = parseCSVRow(row);
      const project: Partial<Project> = {};
      
      headers.forEach((header, index) => {
        if (index < values.length) {
          const value = values[index].trim();
          
          if (header === 'id') {
            project.id = value || crypto.randomUUID();
          } else if (header === 'isMonetized') {
            project.isMonetized = value.toLowerCase() === 'true' || value.toLowerCase() === 'yes';
          } else if (header === 'usefulness') {
            const num = parseInt(value);
            project.usefulness = (num >= 1 && num <= 5) ? num as 1|2|3|4|5 : 3;
          } else if (header === 'progress') {
            project.progress = value ? parseInt(value) : 0;
          } else if (header === 'activityLog' || header === 'tags') {
            project[header] = value ? value.split(';').map(item => item.trim()) : [];
          } else if (header === 'stage') {
            // Ensure stage is one of the allowed values
            project.stage = ['Idea', 'Build', 'Launch', 'Market'].includes(value) 
              ? value as 'Idea' | 'Build' | 'Launch' | 'Market'
              : 'Idea';
          } else {
            // @ts-ignore - Generic assignment
            project[header] = value || undefined;
          }
        }
      });

      // Ensure required fields
      if (!project.name || !project.description || !project.type || !project.status) {
        result.failed++;
        result.errors.push(`Row ${i}: Missing required fields (name, description, type, status)`);
        continue;
      }

      result.successful.push(project as Project);
    } catch (error) {
      result.failed++;
      result.errors.push(`Row ${i}: ${error}`);
    }
  }

  return result;
};

// Helper function to parse CSV row accounting for quoted values
function parseCSVRow(row: string): string[] {
  const result: string[] = [];
  let currentValue = '';
  let insideQuotes = false;
  
  for (let i = 0; i < row.length; i++) {
    const char = row[i];
    
    if (char === '"') {
      if (insideQuotes && i + 1 < row.length && row[i + 1] === '"') {
        // Double quotes inside quotes represent a single quote
        currentValue += '"';
        i++;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      // End of field
      result.push(currentValue);
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  
  // Add the last field
  result.push(currentValue);
  return result;
}
