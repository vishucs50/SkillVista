"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Clock, ExternalLink, ArrowRight } from "lucide-react";

function PriorityIndicator({ priority }) {
  const config = {
    high: { color: "bg-red-500", label: "High" },
    medium: { color: "bg-yellow-500", label: "Medium" },
    low: { color: "bg-green-500", label: "Low" },
  };

  const { color, label } = config[priority] || config.medium;

  return (
    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={`inline-block size-2 rounded-full ${color}`} />
      {label} Priority
    </span>
  );
}

export default function ActionPlan({ actions, roadmap, projectIdea }) {
  const [completedActions, setCompletedActions] = useState(() => {
    if (typeof window === "undefined") return new Set();
    const saved = localStorage.getItem("completed-actions");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  if (!actions || actions.length === 0) return null;

  const toggleComplete = (idx) => {
    setCompletedActions((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      localStorage.setItem("completed-actions", JSON.stringify([...next]));
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Action Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="material-icons text-xl text-primary">
              rocket_launch
            </span>
            Action Plan
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Recommended next steps to close your skill gaps
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {actions.map((action, idx) => {
            const isComplete = completedActions.has(idx);

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className={`rounded-xl border p-4 transition-all ${
                  isComplete
                    ? "border-green-500/20 bg-green-500/5"
                    : "border-border bg-muted/30 hover:bg-muted/50"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step number */}
                  <div
                    className={`flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                      isComplete
                        ? "bg-green-500/20 text-green-400"
                        : "sea-green-gradient text-white"
                    }`}
                  >
                    {isComplete ? <Check size={14} /> : idx + 1}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h4
                        className={`text-sm font-semibold ${
                          isComplete
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {action.title}
                      </h4>
                      <PriorityIndicator priority={action.priority} />
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 pt-1">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock size={12} />
                        {action.estimatedTime}
                      </span>

                      {action.resourceUrl && (
                        <a
                          href={action.resourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          <ExternalLink size={12} />
                          Resource
                        </a>
                      )}

                      <Button
                        variant={isComplete ? "outline" : "ghost"}
                        size="sm"
                        onClick={() => toggleComplete(idx)}
                        className="ml-auto h-7 text-xs"
                      >
                        {isComplete ? "Undo" : "Mark Complete"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* 30-Day Roadmap */}
      {roadmap && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-xl text-primary">
                calendar_month
              </span>
              30-Day Improvement Roadmap
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(roadmap).map(([week, focus], idx) => (
                <motion.div
                  key={week}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="rounded-xl border border-border bg-muted/30 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <span className="sea-green-gradient flex size-6 items-center justify-center rounded-md text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Week {idx + 1}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">
                    {focus}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Idea */}
      {projectIdea && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="material-icons text-xl text-primary">
                lightbulb
              </span>
              Suggested Project
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Build this project to close your major skill gaps
            </p>
          </CardHeader>

          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-primary/20 bg-primary/5 p-6"
            >
              <h4 className="mb-2 text-base font-semibold text-foreground">
                {projectIdea.title}
              </h4>
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                {projectIdea.description}
              </p>

              {projectIdea.skillsCovered &&
                projectIdea.skillsCovered.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Skills Covered
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {projectIdea.skillsCovered.map((skill) => (
                        <span
                          key={skill}
                          className="flex items-center gap-1 rounded-lg border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-foreground"
                        >
                          <ArrowRight size={10} className="text-primary" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </motion.div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
