"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Clock, ExternalLink, ArrowRight } from "lucide-react";

export default function ActionPlan({ actions, roadmap, projectIdea }) {
  const [expanded, setExpanded] = useState(false);
  const [completed, setCompleted] = useState({});

  useEffect(() => {
    fetch("/api/learning-path/progress")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setCompleted(Object.fromEntries(
        (data.progress || []).map((item) => [item.actionKey, item.completed]),
      )))
      .catch(() => {});
  }, []);

  if (!actions || actions.length === 0) return null;

  const actionKey = (action) => `${action.title}|${action.description || ""}`;
  const toggleAction = async (action) => {
    const key = actionKey(action);
    const next = !completed[key];
    setCompleted((current) => ({ ...current, [key]: next }));
    const response = await fetch("/api/learning-path/progress", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actionKey: key, completed: next }),
    });
    if (!response.ok) setCompleted((current) => ({ ...current, [key]: !next }));
  };

  const visibleActions = expanded ? actions : actions.slice(0, 2);

  return (
    <div className="space-y-6">
      {/* ACTION PLAN */}
      <Card>
        <CardHeader>
          <CardTitle >Action Plan</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {visibleActions.map((action, idx) => (
            <motion.div
              key={actionKey(action) || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border p-4 bg-muted/30"
            >
              <button
                type="button"
                onClick={() => toggleAction(action)}
                className="flex w-full items-center gap-2 text-left"
              >
                <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                  completed[actionKey(action)] ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"
                }`}>
                  {completed[actionKey(action)] && <Check size={13} />}
                </span>
                <h4 className={`text-sm font-semibold ${completed[actionKey(action)] ? "text-muted-foreground line-through" : ""}`}>
                  {action.title}
                </h4>
              </button>
              <p className="text-xs text-muted-foreground mt1">
                {action.description}
              </p>

              <div className="flex items-center gap-3 mt-6 text-xs text-muted-foreground">
                <Clock size={12} />
                {action.estimatedTime}
                {action.resourceUrl && (
                  <a
                    href={action.resourceUrl}
                    target="_blank"
                    className="flex items-center gap-1 text-primary"
                  >
                    <ExternalLink size={12} />
                    Resource
                  </a>
                )}
              </div>
            </motion.div>
          ))}

          {actions.length > 2 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? "Show Less" : "View Full Plan"}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* ROADMAP */}
      {roadmap && (
        <Card>
          <CardHeader>
            <CardTitle>30-Day Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {Object.entries(roadmap).map(([week, focus], idx) => (
                <div
                  key={week}
                  className="min-w-55 rounded-lg border p-4 bg-muted/30"
                >
                  <span className="text-xs font-semibold text-muted-foreground">
                    Week {idx + 1}
                  </span>
                  <p className="text-sm mt-1">{focus}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PROJECT IDEA */}
      {projectIdea && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Project</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
              <h4 className="font-semibold">{projectIdea.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {projectIdea.description}
              </p>

              {projectIdea.skillsCovered?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {projectIdea.skillsCovered.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 text-xs px-3 py-1 rounded-md border"
                    >
                      <ArrowRight size={10} />
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
