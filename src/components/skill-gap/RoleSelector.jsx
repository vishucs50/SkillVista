"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { Sparkles, Loader2 } from "lucide-react";

const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Advanced"];

export default function RoleSelector({ onAnalyze, isLoading }) {
  const basicDetails = useAssessmentStore((s) => s.basicDetails);
  const selectedRole = basicDetails?.targetRole;
  const [selectedLevel, setSelectedLevel] = useState("");

  return (
    <Card>
      <CardContent>
        {/* 🔥 Responsive container */}
        <div className="flex flex-col gap-6 md:flex-row md:flex-wrap lg:flex-nowrap lg:items-end">
          {/* Target Role */}
          <div className="w-full lg:flex-1 space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Target Job Role
            </label>
            <div className="rounded-lg border border-border bg-muted px-4 py-3 text-sm text-foreground">
              {selectedRole || "No role selected"}
            </div>
          </div>

          {/* Experience Level */}
          <div className="w-full md:w-auto space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Experience Level
            </label>

            {/* Wrap buttons automatically on small screens */}
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setSelectedLevel(level)}
                  className={`rounded-lg border px-4 py-3 text-sm font-medium transition-all ${
                    selectedLevel === level
                      ? "border-primary/50 bg-primary/10 text-foreground"
                      : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <div className="w-full md:w-auto">
            <Button
              onClick={() => onAnalyze(selectedRole, selectedLevel)}
              disabled={!selectedRole || !selectedLevel || isLoading}
              className="sea-green-gradient h-12 w-full md:w-auto px-6 text-sm font-semibold shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="ml-2">Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span className="ml-2">Analyze Skill Gap</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
