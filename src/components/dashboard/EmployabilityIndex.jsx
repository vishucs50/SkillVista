"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useResultStore from "@/store/useResultStore";

const CIRCUMFERENCE = 264; // 2 * π * 42

function getScoreStyles(score) {
  if (score >= 70) {
    return {
      color: "#22c55e", // green-500
      glow: "drop-shadow-[0_0_10px_rgba(34,197,94,0.45)]",
      label: "Competitive",
    };
  }

  if (score >= 40) {
    return {
      color: "#facc15", // yellow-400
      glow: "drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]",
      label: "Developing",
    };
  }

  return {
    color: "#ef4444", // red-500
    glow: "drop-shadow-[0_0_10px_rgba(239,68,68,0.45)]",
    label: "Early Stage",
  };
}

export default function EmployabilityIndex() {
  const employabilityIndex =
    useResultStore((state) => state.employabilityIndex) ?? 0;

  const score = Math.max(0, Math.min(100, employabilityIndex));
  const dashOffset = (1 - score / 100) * CIRCUMFERENCE;

  const { color, glow, label } = getScoreStyles(score);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm uppercase tracking-wider">
          Employability Index
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          A consolidated measure of your current employability
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex justify-center py-8">
          <div className="relative size-48 flex items-center justify-center">
            <svg
              className="-rotate-90"
              width="192"
              height="192"
              viewBox="0 0 100 100"
            >
              {/* Background ring */}
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="8"
              />

              {/* Animated progress ring */}
              <motion.circle
                key={score} // animate on change
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={color}      // explicit color (SVG-safe)
                className={glow}    // dynamic glow
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                initial={{ strokeDashoffset: CIRCUMFERENCE }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                key={score}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="text-4xl font-bold"
              >
                {score}
              </motion.span>

              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                / 100
              </span>

              <span
                className="mt-1 text-xs font-semibold uppercase tracking-widest"
                style={{ color }}
              >
                {label}
              </span>
            </div>
          </div>
        </div>


      </CardContent>
    </Card>
  );
}
