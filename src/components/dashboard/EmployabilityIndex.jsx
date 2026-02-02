"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import useResultStore from "@/store/useResultStore";
export default function EmployabilityIndex() {
  const result = useResultStore((state) => state.result);
  const score = result?.aptitude?.score ?? 0;


  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wider">
          Employability Index
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Overall job readiness score
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center py-6">
          <div className="size-40 rounded-full border border-border flex items-center justify-center">
            <div className="text-center">
              <p className="text-5xl font-semibold">{score}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                / 100
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs text-muted-foreground mb-2">
            Job Readiness Progress
          </p>
          <Progress value={score} />
        </div>
      </CardContent>
    </Card>
  );
}
