"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Check, Clock, ExternalLink, ArrowRight } from "lucide-react";

export default function ActionPlan({ actions, roadmap, projectIdea }) {
  const [expanded, setExpanded] = useState(false);

  if (!actions || actions.length === 0) return null;

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
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border p-4 bg-muted/30"
            >
              <h4 className="text-sm font-semibold">{action.title}</h4>
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
