"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useResultStore from "@/store/useResultStore";

function getProgressColor(value) {
  if (value >= 70) return "#22c55e"; // green
  if (value >= 45) return "#facc15"; // yellow
  return "#ef4444"; // red
}

export default function HiringReadiness() {
  const readiness = useResultStore((s) => s.readinessBreakdown);

  if (!readiness) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hiring Readiness Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Generating readiness insights...
        </CardContent>
      </Card>
    );
  }

  const readinessData = [
    { label: "Skill Progress", value: readiness.skills },
    { label: "Aptitude Strength", value: readiness.aptitude },
    { label: "Project Experience", value: readiness.experience },
    { label: "Learning Consistency", value: readiness.consistency },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring Readiness Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          How recruiters may evaluate your profile
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {readinessData.map((item) => (
          <div key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>{item.label}</span>
              <span className="font-semibold">{item.value}%</span>
            </div>

            <Progress
              value={item.value}
              style={{
                "--progress-color": getProgressColor(item.value),
              }}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
