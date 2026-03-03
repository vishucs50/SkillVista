"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, BookOpen, AlertCircle } from "lucide-react";
import RevealOnScroll from "@/components/common/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { useSkillGapStore } from "@/store/useSkillGapStore";
import ActionPlan from "@/components/skill-gap/ActionPlan";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function LearningPathPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const analysis = useSkillGapStore((s) => s.analysis);
  const setAnalysis = useSkillGapStore((s) => s.setAnalysis);
  const [error, setError] = useState(null);

  const basicDetails = useAssessmentStore((s) => s.basicDetails);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const triggerAnalysis = async () => {
    if (!basicDetails?.targetRole) {
      setError("Please complete the skill gap analysis first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/skill-gap/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: basicDetails.targetRole,
          experienceLevel: basicDetails.year || "0",
          userSkills: basicDetails?.skills || [],
          githubData: {
            skills: basicDetails?.skills || [],
            targetRole: basicDetails?.targetRole || "",
          },
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="sea-green-gradient size-10 animate-spin rounded-lg" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto w-full max-w-8xl px-4 py-6 md:px-8 lg:px-10">
      {/* TITLE */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="sea-green-gradient p-2 rounded-lg">
            <BookOpen size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold">Your Learning Path</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          A personalized roadmap to master skills for your target role
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
          <AlertCircle size={18} className="text-destructive" />
          <div>
            <p className="text-sm font-medium text-destructive">Error</p>
            <p className="text-sm">{error}</p>
            {!analysis && (
              <Button
                size="sm"
                variant="outline"
                onClick={triggerAnalysis}
                className="mt-3"
              >
                Run Analysis
              </Button>
            )}
          </div>
        </div>
      )}

      {/* EMPTY */}
      {!analysis && !isLoading && !error && (
        <div className="max-w-md mx-auto text-center py-10 border border-dashed rounded-xl">
          <BookOpen className="mx-auto mb-3 text-primary" size={28} />
          <p className="text-sm text-muted-foreground mb-4">
            Generate your AI learning roadmap
          </p>
          <Button onClick={triggerAnalysis}>Generate Learning Path</Button>
        </div>
      )}

      {/* LOADING */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="sea-green-gradient flex size-14 animate-pulse items-center justify-center rounded-xl">
            <BookOpen size={26} className="text-white" />
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Designing your roadmap...
          </p>
        </div>
      )}

      {/* CONTENT */}
      {analysis && !isLoading && (
        <div className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr] items-start">
            <div className="h-full">
              <RevealOnScroll delay={0.05}>
                <ActionPlan actions={analysis.actionPlan} />
              </RevealOnScroll>
            </div>

            {analysis.roadmap && (
              <div className="h-full flex items-start justify-center">
                <div className="w-full max-w-md rounded-xl border border-border bg-muted/30 p-4">
                  <h3 className="font-semibold mb-3 text-center">
                    30-Day Roadmap
                  </h3>

                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(analysis.roadmap).map(
                      ([week, focus], idx) => (
                        <div
                          key={week}
                          className="rounded-lg border bg-background p-3"
                        >
                          <span className="text-xs font-semibold text-muted-foreground">
                            Week {idx + 1}
                          </span>
                          <p className="text-sm mt-1">{focus}</p>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {analysis.projectIdea && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <h3 className="font-semibold mb-2">Suggested Project</h3>

              <h4 className="text-base font-semibold">
                {analysis.projectIdea.title}
              </h4>

              <p className="text-sm text-muted-foreground mt-1">
                {analysis.projectIdea.description}
              </p>

              {analysis.projectIdea.skillsCovered?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {analysis.projectIdea.skillsCovered.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs px-3 py-1 rounded-md border bg-background"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
