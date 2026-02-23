"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, BookOpen, AlertCircle } from "lucide-react";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import RevealOnScroll from "@/components/common/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { useSkillGapStore } from "@/store/useSkillGapStore";
import ActionPlan from "@/components/skill-gap/ActionPlan";
import RequiredSkills from "@/components/skill-gap/RequiredSkills";
import SkillComparison from "@/components/skill-gap/SkillComparison";

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
    // Get the target role from basicDetails or ask user
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
      setAnalysis(data); // ✅ Zustand persists it
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
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between lg:hidden px-4 py-3 bg-card border-b border-border">
        <h1 className="text-sm font-semibold">Learning Path</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-0.7 md:px-8 lg:px-10">
            {/* Page Title */}
            <div className="mb-7 mt-14">
              <div className="flex items-center gap-3 mb-2">
                <div className="sea-green-gradient p-2 rounded-lg">
                  <BookOpen size={24} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  Your Learning Path
                </h1>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                A personalized roadmap to master the skills for your target role
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4 flex items-start gap-3">
                <AlertCircle size={18} className="text-destructive mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-destructive">Error</p>
                  <p className="text-sm text-destructive mt-1">{error}</p>
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

            {/* Empty State - before analysis */}
            {!analysis && !isLoading && !error && (
              <RevealOnScroll delay={0.1}>
                <div className="rounded-xl border border-dashed border-border bg-muted/30 p-12 text-center">
                  <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
                    <BookOpen size={32} className="text-primary" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-foreground">
                    No Learning Path Yet
                  </h3>
                  <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                    Complete the skill gap analysis to get your personalized learning path
                  </p>
                  <Button onClick={triggerAnalysis} disabled={isLoading}>
                    {isLoading ? "Generating..." : "Generate Learning Path"}
                  </Button>
                </div>
              </RevealOnScroll>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-6">
                  <div className="sea-green-gradient flex size-16 animate-pulse items-center justify-center rounded-2xl">
                    <BookOpen size={32} className="text-white" />
                  </div>
                  <div className="absolute -inset-4 -z-10 animate-ping rounded-3xl bg-primary/10" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  Creating Your Learning Path
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is designing a personalized roadmap for you...
                </p>
              </div>
            )}

            {/* Learning Path Content */}
            {analysis && !isLoading && (
              <div className="space-y-8">


                {/* Section 1: Required Skills Reference */}
                <RevealOnScroll delay={0.05}>
                  <RequiredSkills data={analysis.requiredSkills} />
                </RevealOnScroll>

                {/* Section 2: Action Plan (Main Focus) */}
                <RevealOnScroll delay={0.1}>
                  <ActionPlan
                    actions={analysis.actionPlan}
                    roadmap={analysis.roadmap}
                    projectIdea={analysis.projectIdea}
                  />
                </RevealOnScroll>

                {/* Navigation Footer */}
                <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border bg-muted/30 p-6">
                  <div>
                    <h4 className="font-semibold text-foreground">Ready to start learning?</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Follow the roadmap above and track your progress
                    </p>
                  </div>
                  <Button
                    onClick={() => router.push("/skill-gap")}
                    variant="outline"
                  >
                    View Skill Gap Analysis
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
