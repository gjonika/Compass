
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Project, ProjectStage } from "@/types/project";
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

interface ProjectInsightsProps {
  projects: Project[];
}

const ProjectInsights = ({ projects }: ProjectInsightsProps) => {
  const [stageData, setStageData] = useState<Array<{name: string, value: number, color: string}>>([]);
  const [progressData, setProgressData] = useState<Array<{date: string, progress: number}>>([]);

  // Colors for the pie chart
  const stageColors: Record<ProjectStage, string> = {
    'Idea': '#FEC6A1', // Soft orange
    'Build': '#D3E4FD', // Soft blue
    'Launch': '#E5DEFF', // Soft purple
    'Market': '#F2FCE2'  // Soft green
  };

  useEffect(() => {
    // Calculate data for the pie chart
    const stages = projects.reduce((acc: Record<string, number>, project) => {
      const stage = project.stage || 'Idea';
      acc[stage] = (acc[stage] || 0) + 1;
      return acc;
    }, {});

    const formattedStageData = Object.entries(stages).map(([name, value]) => ({
      name,
      value,
      color: stageColors[name as ProjectStage] || '#CCCCCC'
    }));
    
    setStageData(formattedStageData);

    // Calculate data for the line chart
    // Group by month and calculate average progress
    const progressByDate = projects
      .filter(p => p.lastUpdated && p.progress !== undefined)
      .reduce((acc: Record<string, {total: number, count: number}>, project) => {
        if (!project.lastUpdated) return acc;
        
        // Format date to YYYY-MM
        const date = new Date(project.lastUpdated);
        const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!acc[formattedDate]) {
          acc[formattedDate] = { total: 0, count: 0 };
        }
        
        acc[formattedDate].total += project.progress || 0;
        acc[formattedDate].count += 1;
        
        return acc;
      }, {});
    
    const formattedProgressData = Object.entries(progressByDate)
      .map(([date, data]) => ({
        date,
        progress: Math.round(data.total / data.count)
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    setProgressData(formattedProgressData);
  }, [projects]);

  const chartConfig = {
    idea: { 
      label: "Idea", 
      theme: { light: stageColors.Idea, dark: stageColors.Idea }
    },
    build: {
      label: "Build",
      theme: { light: stageColors.Build, dark: stageColors.Build }
    },
    launch: {
      label: "Launch",
      theme: { light: stageColors.Launch, dark: stageColors.Launch }
    },
    market: {
      label: "Market",
      theme: { light: stageColors.Market, dark: stageColors.Market }
    },
    progress: {
      label: "Progress",
      theme: { light: "#9b87f5", dark: "#9b87f5" }
    }
  };

  return (
    <motion.div 
      className="grid gap-6 md:grid-cols-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Projects by Stage</CardTitle>
          <CardDescription>Distribution of projects across different stages</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ChartContainer className="h-[300px]" config={chartConfig}>
            <PieChart>
              <Pie
                data={stageData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {stageData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress Over Time</CardTitle>
          <CardDescription>Average project progress by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[300px]" config={chartConfig}>
            <LineChart data={progressData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="progress" 
                name="Progress" 
                stroke="#9b87f5" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProjectInsights;
