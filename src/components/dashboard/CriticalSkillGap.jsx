"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useResultStore from "@/store/useResultStore";

export default function CriticalSkillGaps() {
  const gaps = useResultStore((s) => s.criticalSkillGaps);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Critical Gaps</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {gaps && gaps.length > 0 ? (
          gaps.map((gap, index) => <Gap key={index} title={gap} />)
        ) : (
          <div className="p-4 border border-border rounded-xl">
            <p className="text-sm text-muted-foreground">
              No critical gaps identified in your current assessment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Gap({ title }) {
  return (
    <div className="flex justify-between items-center p-4 border border-border rounded-xl">
      <p className="text-sm font-semibold">{title}</p>
    </div>
  );
}
