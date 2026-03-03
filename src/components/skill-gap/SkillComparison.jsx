"use client";

import { useState, useMemo } from "react";
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
    <div className="relative flex size-32 items-center justify-center">
      <svg
        className="-rotate-90"
        width="120"
        height="120"
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
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold">{score}%</div>
        <div className="text-xs text-muted-foreground">Match</div>
      </div>
    </div>
  );
}

function GapStatusBadge({ status }) {
  const config = {
    "No Gap": { icon: Check, color: "text-green-400" },
    "Critical Gap": { icon: X, color: "text-red-400" },
    "Moderate Gap": { icon: AlertTriangle, color: "text-yellow-400" },
    "Optional Enhancement": { icon: Minus, color: "text-muted-foreground" },
  };

  const { icon: Icon, color } = config[status] || config["No Gap"];

  return (
    <span className={`flex items-center gap-1 text-xs font-medium ${color}`}>
      <Icon size={14} />
      {status}
    </span>
  );
}

export default function SkillComparison({ matchPercentage, comparison }) {
  const [filter, setFilter] = useState("Critical Gap");

  const filteredData = useMemo(() => {
    if (filter === "All") return comparison;
    return comparison.filter((item) => item.gapStatus === filter);
  }, [comparison, filter]);
  if (!comparison || comparison.length === 0) return null;


  const filters = ["Critical Gap", "Moderate Gap", "No Gap", "All"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare size={22} className="text-primary" />
          Skill Gap Comparison
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Match Score */}
          <div className="flex flex-col items-center">
            <MatchScoreRing score={matchPercentage || 0} />
            <span className="text-xs text-muted-foreground mt-2">
              Overall Match Score
            </span>
          </div>

          {/* Skills Section */}
          <div className="flex-1 w-full">
            {/* Filters */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs rounded-md border transition ${
                    filter === f
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Scrollable Table */}
            <div className="max-h-64 overflow-y-auto border rounded-md custom-scroll">  
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-background border-b">
                  <tr className="text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="p-3 text-left">Skill</th>
                    <th className="p-3 text-center">Required</th>
                    <th className="p-3 text-center">You</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, idx) => (
                    <motion.tr
                      key={item.skill}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b last:border-0 align-middle"
                    >
                      {/* Skill */}
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {item.skill}
                      </td>

                      {/* Required */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center">
                          {item.required ? (
                            <Check size={16} />
                          ) : (
                            <Minus
                              size={16}
                              className="text-muted-foreground"
                            />
                          )}
                        </div>
                      </td>

                      {/* You */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center">
                          {item.userHas ? (
                            <Check size={16} className="text-green-400" />
                          ) : (
                            <X size={16} className="text-red-400" />
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center">
                          <GapStatusBadge status={item.gapStatus} />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
