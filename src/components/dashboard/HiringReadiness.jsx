"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useResultStore from "@/store/useResultStore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

  const data = [
    { name: "Skill Progress", value: readiness.skills },
    { name: "Aptitude Strength", value: readiness.aptitude },
    { name: "Project Experience", value: readiness.experience },
    { name: "Learning Consistency", value: readiness.consistency },
  ];

  const COLORS = ["#22c55e", "#3b82f6", "#facc15", "#ef4444"];

  const overall =
    Math.round(
      (readiness.skills +
        readiness.aptitude +
        readiness.experience +
        readiness.consistency) /
        4,
    ) || 0;

  return (
    <Card className="shadow-sm border border-muted">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Hiring Readiness
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Recruiter evaluation overview
        </p>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row items-center gap-6">
        {/* Chart Section */}
        <div className="relative w-full md:w-1/2 h-67.5 bg-black/40 rounded-2xl backdrop-blur-md flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {/* Neon glow filter */}
                <filter id="neon">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Soft dark track ring */}
              <Pie
                data={[{ value: 100 }]}
                dataKey="value"
                innerRadius={70}
                outerRadius={100}
                fill="hsl(var(--border))"
                opacity={0.15}
                isAnimationActive={false}
              />

              {/* Main neon donut */}
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                animationDuration={900}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index]}
                    filter="url(#neon)"
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #1f2937",
                  backgroundColor: "#0f172a",
                  color: "white",
                  fontSize: "12px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Score */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold">{overall}%</span>
            <span className="text-xs text-muted-foreground">Overall Score</span>
          </div>
        </div>

        {/* Legend Section */}
        <div className="w-full md:w-1/2 space-y-6">
          {data.map((item, index) => (
            <div
              key={item.name}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-semibold">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
