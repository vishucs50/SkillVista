import { Card, CardContent } from "@/components/ui/card";

export default function NextBestAction() {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="space-y-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Next Best Action
        </p>

        <p className="text-sm leading-relaxed">
          <span className="font-semibold text-foreground">
            Focus on Logical Reasoning:
          </span>{" "}
          Improving your aptitude score by 10% can increase your shortlisting
          probability by <span className="font-semibold text-primary">22%</span>
          .
        </p>

        <p className="text-xs text-muted-foreground italic">
          Recommendation based on current assessment insights.
        </p>
      </CardContent>
    </Card>
  );
}
