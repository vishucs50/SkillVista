"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import useResultStore from "@/store/useResultStore";

function getDotColor(value) {
  if (value >= 70) return "#22c55e"; // green
  if (value >= 40) return "#facc15"; // amber
  return "#ef4444"; // red
}

export default function SkillAptitudeRadar() {
  const aptitudeScore = useResultStore((s) => s.aptitude?.score ?? 60);
  const skillsCount = useResultStore(
    (s) => s.basicDetails?.skills?.length ?? 3,
  );

  const values = {
    technical: Math.min(skillsCount * 15, 100),
    logic: aptitudeScore,
    quantitative: aptitudeScore * 0.9,
    communication: 55,
    problemSolving: aptitudeScore * 0.95,
  };

  const scale = (v) => (v / 100) * 160;

  const points = [
    {
      label: "Technical Skills",
      value: values.technical,
      x: 200,
      y: 200 - scale(values.technical),
    },
    {
      label: "Logical Reasoning",
      value: values.logic,
      x: 200 + scale(values.logic),
      y: 200,
    },
    {
      label: "Quantitative Aptitude",
      value: values.quantitative,
      x: 200 + scale(values.quantitative) * 0.7,
      y: 200 + scale(values.quantitative) * 0.7,
    },
    {
      label: "Communication",
      value: values.communication,
      x: 200 - scale(values.communication) * 0.7,
      y: 200 + scale(values.communication) * 0.7,
    },
    {
      label: "Problem Solving",
      value: values.problemSolving,
      x: 200 - scale(values.problemSolving),
      y: 200,
    },
  ];

  const path = [...points, points[0]]
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Skill vs Aptitude Map</CardTitle>
        <p className="text-sm text-muted-foreground">
          Relative balance across core employability dimensions
        </p>
      </CardHeader>

      <CardContent className="flex justify-center items-center min-h-105">
        <svg viewBox="-60 0 487  400" className="w-full max-w-lg">
          {/* Grid */}
          {[40, 80, 120, 160].map((r) => (
            <circle
              key={r}
              cx="200"
              cy="200"
              r={r}
              fill="none"
              stroke="#2a2a2a"
              strokeWidth="1"
            />
          ))}

          {/* Axes */}
          <line x1="200" y1="40" x2="200" y2="360" stroke="#2a2a2a" />
          <line x1="40" y1="200" x2="360" y2="200" stroke="#2a2a2a" />
          <line x1="90" y1="90" x2="310" y2="310" stroke="#2a2a2a" />
          <line x1="310" y1="90" x2="90" y2="310" stroke="#2a2a2a" />

          {/* Radar line */}
          <motion.path
            d={path}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          />

          {/* Color-coded dots */}
          {points.map((p, idx) => (
            <motion.circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r="4.5"
              fill={getDotColor(p.value)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + idx * 0.05 }}
            />
          ))}

          {/* Labels */}
          <text
            x="200"
            y="28"
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            Technical Skills
          </text>
          <text x="372" y="205" className="fill-muted-foreground text-xs">
            Reasoning
          </text>
          <text
            x="280"
            y="382"
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            Quantitative Aptitude
          </text>
          <text
            x="120"
            y="382"
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            Communication
          </text>
          <text
            x="28"
            y="205"
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
