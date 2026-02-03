"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import useResultStore from "@/store/useResultStore";

export default function CriticalSkillGaps() {
  const { basicDetails } = useAssessmentStore();
  const { aptitudeScore } = useResultStore();

  const gaps = [];

  // --- GAP RULES ---
  if (aptitudeScore < 50) {
    gaps.push({
      title: "Logical Reasoning",
      level: "CRITICAL",
    });
  }

  if (basicDetails.projectExperience !== "End-to-end projects") {
    gaps.push({
      title: "Project Experience",
      level: "CRITICAL",
    });
  }

  if (basicDetails.resumeStatus === "No resume yet") {
    gaps.push({
      title: "Resume Quality",
      level: "MEDIUM",
    });
  }

  if (basicDetails.interviewExperience === "0 interviews") {
    gaps.push({
      title: "Interview Readiness",
      level: "MEDIUM",
    });
  }

  if ((basicDetails.skills?.length || 0) < 5) {
    gaps.push({
      title: "Skill Breadth",
      level: "LOW",
    });
  }

  // Fallback (important)
  if (gaps.length === 0) {
    gaps.push({
      title: "No critical gaps detected",
      level: "LOW",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Gaps</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {gaps.map((gap, index) => (
          <Gap key={index} title={gap.title} level={gap.level} />
        ))}
      </CardContent>
    </Card>
  );
}

function Gap({ title, level }) {
  const variant =
    level === "CRITICAL"
      ? "destructive"
      : level === "MEDIUM"
        ? "secondary"
        : "outline";

  return (
    <div className="flex justify-between items-center p-4 border border-border rounded-xl">
      <p className="text-sm font-semibold">{title}</p>
      <Badge variant={variant}>{level}</Badge>
    </div>
  );
}
