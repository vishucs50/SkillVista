"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import RevealOnScroll from "@/components/common/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { useSkillGapStore } from "@/store/useSkillGapStore";
import RoleSelector from "@/components/skill-gap/RoleSelector";
import RequiredSkills from "@/components/skill-gap/RequiredSkills";
import GitHubAnalysis from "@/components/skill-gap/GithubAnalysis";
import SkillComparison from "@/components/skill-gap/SkillComparison";
import ActionPlan from "@/components/skill-gap/ActionPlan";
import EmptyState from "@/components/skill-gap/EmptyState";

import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function SkillGapPage() {
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

const handleAnalyze = async (targetRole, experienceLevel) => {
  if (analysis) return; // 🔥 avoid re-fetch if already exists

  setIsLoading(true);
  setError(null);

  try {
    const res = await fetch("/api/skill-gap/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetRole,
        experienceLevel,
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
        <h1 className="text-sm font-semibold">Skill Gap Analysis</h1>
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
              <h1 className="text-2xl font-bold text-foreground">
                Skill Gap Analysis
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover where you stand and what to learn next for your dream
                role
              </p>
            </div>

            {/* Section 1: Role Selection */}
            <RevealOnScroll>
              <div className="mb-8">
                <RoleSelector onAnalyze={handleAnalyze} isLoading={isLoading} />
              </div>
            </RevealOnScroll>

            {/* Error State */}
            {error && (
              <div className="mb-8 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Empty State - before analysis */}
            {!analysis && !isLoading && !error && (
              <RevealOnScroll delay={0.1}>
                <EmptyState />
              </RevealOnScroll>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative mb-6">
                  <div className="sea-green-gradient flex size-16 animate-pulse items-center justify-center rounded-2xl">
                    <span className="material-icons text-3xl text-white">
                      psychology
                    </span>
                  </div>
                  <div className="absolute -inset-4 -z-10 animate-ping rounded-3xl bg-primary/10" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  Analyzing Your Skill Profile
                </h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is comparing your skills against role requirements...
                </p>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && !isLoading && (
              <div className="space-y-8">
                {/* Section 2: Required Skills */}
                <RevealOnScroll>
                  <RequiredSkills data={analysis.requiredSkills} />
                </RevealOnScroll>

                {/* Section 3: GitHub Analysis */}
                <RevealOnScroll delay={0.05}>
                  <GitHubAnalysis data={analysis.githubInsights} />
                </RevealOnScroll>

                {/* Section 4: Skill Gap Comparison */}
                <RevealOnScroll delay={0.1}>
                  <SkillComparison
                    matchPercentage={analysis.matchPercentage}
                    comparison={analysis.skillComparison}
                  />
                </RevealOnScroll>

                {/* Navigation Footer to Learning Path */}
                <RevealOnScroll delay={0.2}>
                  <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-primary/20 bg-primary/5 p-6">
                    <div>
                      <h4 className="font-semibold text-foreground">Ready to follow your learning path?</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        View your personalized roadmap and track your progress towards mastery
                      </p>
                    </div>
                    <Button
                      onClick={() => router.push("/learning-path")}
                      className="bg-primary hover:bg-primary/90"
                    >
                      View Learning Path →
                    </Button>
                  </div>
                </RevealOnScroll>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
