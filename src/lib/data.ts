
import { Project, ProjectStatus, ProjectType, UsefulnessRating, ProjectStage } from "@/types/project";

// Export the types for backwards compatibility
export type { ProjectType, ProjectStatus, UsefulnessRating, ProjectStage };

// Mock data for initial development
export const projectsData: Project[] = [
  {
    id: '1',
    name: 'Project Dashboard',
    summary: 'Track all side projects in one place',
    description: 'Track progress across side projects',
    type: 'personal',
    usefulness: 5,
    status: 'in_progress',
    stage: 'Build',
    isMonetized: false,
    githubUrl: 'https://github.com/username/project-dashboard',
    lastUpdated: '2023-05-10',
    progress: 75,
    activityLog: [
      '2023-05-10: Added filtering functionality',
      '2023-05-08: Created initial project structure',
      '2023-05-05: Brainstormed UI design'
    ],
    tags: ['React', 'Personal']
  },
  {
    id: '2',
    name: 'Recipe Manager',
    summary: 'Simple recipe organizer app',
    description: 'App to store and organize recipes',
    type: 'sell',
    usefulness: 4,
    status: 'live',
    stage: 'Market',
    isMonetized: true,
    githubUrl: 'https://github.com/username/recipe-manager',
    websiteUrl: 'https://recipe-app.example.com',
    lastUpdated: '2023-05-01',
    progress: 100,
    activityLog: [
      '2023-05-01: Deployed to production',
      '2023-04-28: Completed user testing',
      '2023-04-20: Implemented recipe search'
    ],
    tags: ['React', 'Commercial', 'Food']
  },
  {
    id: '3',
    name: 'Budget Tracker',
    summary: 'Keep track of personal finances',
    description: 'Personal finance tool',
    type: 'personal',
    usefulness: 3,
    status: 'abandoned',
    stage: 'Launch',
    isMonetized: false,
    githubUrl: 'https://github.com/username/budget-tracker',
    lastUpdated: '2023-03-15',
    progress: 30,
    activityLog: [
      '2023-03-15: Decided to pause development',
      '2023-03-10: Added expense categories',
      '2023-03-01: Started project setup'
    ],
    tags: ['Finance']
  },
  {
    id: '4',
    name: 'AI Writing Assistant',
    summary: 'AI-powered content creation',
    description: 'Tool to help with content creation',
    type: 'sell',
    usefulness: 5,
    status: 'idea',
    stage: 'Idea',
    isMonetized: false,
    nextAction: 'Research NLP libraries',
    progress: 5,
    activityLog: [
      '2023-04-15: Initial concept documented',
      '2023-04-10: Market research completed'
    ],
    tags: ['AI', 'Writing', 'Commercial']
  },
  {
    id: '5',
    name: 'Fitness Tracker',
    summary: 'Track workouts and progress',
    description: 'App to track workouts and progress',
    type: 'personal',
    usefulness: 2,
    status: 'in_progress',
    stage: 'Build',
    isMonetized: false,
    githubUrl: 'https://github.com/username/fitness-tracker',
    websiteUrl: 'https://fitness-app.example.com',
    nextAction: 'Implement workout timer',
    lastUpdated: '2023-04-20',
    progress: 45,
    activityLog: [
      '2023-04-20: Added workout logging feature',
      '2023-04-15: Created UI mockups',
      '2023-04-10: Project setup'
    ],
    tags: ['Health', 'Personal']
  },
];

export const usefulnessEmoji = (rating: UsefulnessRating): string => {
  switch (rating) {
    case 1: return '😐';
    case 2: return '🙂';
    case 3: return '😊';
    case 4: return '😄';
    case 5: return '🤩';
    default: return '😐';
  }
};

export const statusEmoji = (status: ProjectStatus): string => {
  switch (status) {
    case 'idea': return '💡';
    case 'in_progress': return '🚧';
    case 'live': return '✅';
    case 'abandoned': return '⚠️';
    default: return '❓';
  }
};

export const stageEmoji = (stage: ProjectStage): string => {
  switch (stage) {
    case 'Idea': return '💡';
    case 'Build': return '🛠️';
    case 'Launch': return '🚀';
    case 'Market': return '📊';
    default: return '❓';
  }
};

export const getStageColor = (stage?: ProjectStage): string => {
  switch (stage) {
    case 'Idea': return 'bg-purple-100 text-purple-800';
    case 'Build': return 'bg-blue-100 text-blue-800';
    case 'Launch': return 'bg-green-100 text-green-800';
    case 'Market': return 'bg-amber-100 text-amber-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
