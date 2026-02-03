"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useResultStore from "@/store/useResultStore";
import { useAssessmentStore } from "@/store/useAssessmentStore";

function getProgressColor(value) {
  if (value >= 70) return "#22c55e"; // green
  if (value >= 45) return "#facc15"; // yellow
  return "#ef4444"; // red
}

export default function HiringReadiness() {
  const aptitudeScore = useResultStore((s) => s.result?.aptitude?.score ?? 0);

  const skillsCount = useAssessmentStore(
    (s) => s.basicDetails?.skills?.length ?? 0,
  );

  const readinessData = [
    {
      label: "Skill Readiness",
      value: Math.min(skillsCount * 15, 100),
    },
    {
      label: "Aptitude Strength",
      value: aptitudeScore,
    },
    {
      label: "Interview Readiness",
      value: Math.round((aptitudeScore + skillsCount * 10) / 2),
    },
    {
      label: "Resume & Profile Quality",
      value: skillsCount >= 5 ? 75 : 55,
    },
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

            {/* ✅ NO indicatorClassName here */}
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
