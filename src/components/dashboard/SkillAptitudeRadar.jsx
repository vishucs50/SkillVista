import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SkillAptitudeRadar() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Skill vs Aptitude Map</CardTitle>
        <p className="text-sm text-muted-foreground">
          Balanced employability analysis
        </p>
      </CardHeader>

      <CardContent className="flex justify-center items-center min-h-105">
        {/* SVG stays – values will become dynamic later */}
        <svg viewBox="0 0 400 400" className="max-w-sm w-full">
          <circle
            cx="200"
            cy="200"
            r="160"
            fill="none"
            stroke="var(--border)"
          />
          <polygon
            points="200,70 300,170 260,300 140,300 100,170"
            fill="var(--primary)"
            opacity="0.15"
            stroke="var(--primary)"
            strokeWidth="2"
          />
          <text
            x="200"
            y="30"
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            Technical Skills
          </text>
          <text x="360" y="180" className="fill-muted-foreground text-xs">
            Logical Reasoning
          </text>
          <text
            x="280"
            y="360"
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            Quantitative Aptitude
          </text>
          <text
            x="120"
            y="360"
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            Communication
          </text>
          <text
            x="40"
            y="180"
            textAnchor="end"
            className="fill-muted-foreground text-xs"
          >
            Problem Solving
          </text>
        </svg>
      </CardContent>
    </Card>
  );
}
