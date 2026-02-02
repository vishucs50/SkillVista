// components/dashboard/HiringReadiness.tsx

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const readinessData = [
  { label: "Skill Readiness", value: 78 },
  { label: "Aptitude Strength", value: 62 },
  { label: "Interview Performance", value: 55 },
  { label: "Resume & Profile Quality", value: 70 },
];

export default function HiringReadiness() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hiring Readiness Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Job readiness for your selected role
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {readinessData.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span>{item.label}</span>
              <span className="font-semibold">{item.value}%</span>
            </div>
            <Progress value={item.value} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
