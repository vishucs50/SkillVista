"use client";

import { Progress } from "@/components/ui/progress";

export default function ProgressBar({ current, total, answered }) {
  const progress = (current / total) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress: {current}/{total}</span>
        <span>Answered: {answered}/{total}</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
