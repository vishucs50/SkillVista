"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check, X, AlertTriangle, Minus, GitCompare } from "lucide-react";

const CIRCUMFERENCE = 264;

function MatchScoreRing({ score }) {
  const dashOffset = (1 - score / 100) * CIRCUMFERENCE;

  const getColor = (s) => {
    if (s >= 70) return "#22c55e";
    if (s >= 40) return "#facc15";
    return "#ef4444";
  };

  const color = getColor(score);

  return (
    <div className="relative flex size-36 items-center justify-center">
      <svg
        className="-rotate-90"
        width="144"
        height="144"
        viewBox="0 0 100 100"
      >
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="6"
        />
        <motion.circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          initial={{ strokeDashoffset: CIRCUMFERENCE }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="text-3xl font-bold text-foreground"
        >
          {score}%
        </motion.span>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Match
        </span>
      </div>
    </div>
  );
}

function GapStatusBadge({ status }) {
  const config = {
    "No Gap": {
      icon: Check,
      className: "text-green-400",
    },
    "Critical Gap": {
      icon: X,
      className: "text-red-400",
    },
    "Moderate Gap": {
      icon: AlertTriangle,
      className: "text-yellow-400",
    },
    "Optional Enhancement": {
      icon: Minus,
      className: "text-muted-foreground",
    },
  };

  const { icon: Icon, className } = config[status] || config["No Gap"];

  return (
    <span
      className={`flex items-center gap-1.5 text-xs font-medium ${className}`}
    >
      <Icon size={14} />
      {status}
    </span>
  );
}

export default function SkillComparison({ matchPercentage, comparison }) {
  if (!comparison || comparison.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare size={24} className="text-primary" />
          Skill Gap Comparison
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          How your current skills stack up against the role requirements
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start">
          {/* Match Score */}
          <div className="flex flex-col items-center gap-2">
            <MatchScoreRing score={matchPercentage || 0} />
            <span className="text-xs text-muted-foreground">
              Overall Match Score
            </span>
          </div>

          {/* Comparison Table */}
          <div className="flex-1 w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 text-left font-semibold">Skill</th>
                  <th className="pb-3 text-center font-semibold">Required</th>
                  <th className="pb-3 text-center font-semibold">You Have</th>
                  <th className="pb-3 text-right font-semibold">Gap Status</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((item, idx) => (
                  <motion.tr
                    key={item.skill}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-3 text-foreground font-medium">
                      {item.skill}
                    </td>
                    <td className="py-3 text-center">
                      {item.required ? (
                        <Check size={16} className="mx-auto text-foreground" />
                      ) : (
                        <Minus
                          size={16}
                          className="mx-auto text-muted-foreground"
                        />
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {item.userHas ? (
                        <Check size={16} className="mx-auto text-green-400" />
                      ) : (
                        <X size={16} className="mx-auto text-red-400" />
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <GapStatusBadge status={item.gapStatus} />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
