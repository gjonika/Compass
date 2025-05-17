
export type ProjectType = 'personal' | 'sell';
export type ProjectStatus = 'idea' | 'in_progress' | 'live' | 'abandoned';
export type UsefulnessRating = 1 | 2 | 3 | 4 | 5;
export type ProjectStage = 'Idea' | 'Build' | 'Launch' | 'Market';

export interface Project {
  id: string;
  name: string;
  description: string;
  summary?: string;
  type: ProjectType;
  usefulness: UsefulnessRating;
  status: ProjectStatus;
  stage?: ProjectStage;
  isMonetized: boolean;
  githubUrl?: string;
  websiteUrl?: string;
  nextAction?: string;
  lastUpdated?: string;
  progress?: number; // 0-100 progress percentage
  activityLog?: string[]; // Array of activity log entries
  tags?: string[]; // Array of custom tags
}

export interface FilterOptions {
  search: string;
  status: ProjectStatus | 'all';
  type: ProjectType | 'all';
  usefulness: UsefulnessRating | 'all';
  showMonetizedOnly: boolean;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ProgressDataPoint {
  date: string;
  progress: number;
}

