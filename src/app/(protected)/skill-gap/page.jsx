"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RevealOnScroll from "@/components/common/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { useSkillGapStore } from "@/store/useSkillGapStore";
import RoleSelector from "@/components/skill-gap/RoleSelector";
import RequiredSkills from "@/components/skill-gap/RequiredSkills";
import SkillComparison from "@/components/skill-gap/SkillComparison";
import EmptyState from "@/components/skill-gap/EmptyState";
import { useAssessmentStore } from "@/store/useAssessmentStore";
export default function SkillGapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const analysis = useSkillGapStore((s) => s.analysis);
  const setAnalysis = useSkillGapStore((s) => s.setAnalysis);
  const clearAnalysis = useSkillGapStore((s) => s.clearAnalysis);
  const [error, setError] = useState(null);

  const basicDetails = useAssessmentStore((s) => s.basicDetails);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Clear analysis if user session changes (new user logged in)
  useEffect(() => {
    if (session?.user?.id && analysis) {
      // If we have a cached analysis, verify it's for current user
      // If not, clear it to prevent showing old user's data to new user
      clearAnalysis();
    }
  }, [session?.user?.id, clearAnalysis]);

const handleAnalyze = async (targetRole, experienceLevel) => {
  setIsLoading(true);
  setError(null);

  try {
    // Fetch GitHub data if available
    let githubData = null;
    try {
      const githubRes = await fetch("/api/github/analyze");
      if (githubRes.ok) {
        const githubInfo = await githubRes.json();
        if (githubInfo.githubConnected && githubInfo.githubData) {
          githubData = {
            topLanguages: githubInfo.githubData.topLanguages || [],
            detectedFrameworks: githubInfo.githubData.detectedFrameworks || [],
            repositories: githubInfo.githubData.repositories || 0,
            followers: githubInfo.githubData.followers || 0,
            strengthAreas: githubInfo.githubData.strengthAreas || [],
            contributionLevel: githubInfo.githubData.contributionLevel || "low",
          };
        }
      }
    } catch (err) {
      console.warn("Could not fetch GitHub data:", err);
    }

    const res = await fetch("/api/skill-gap/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetRole,
        experienceLevel,
        userSkills: basicDetails?.skills || [],
        githubData: githubData || {
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
    <div className="mx-auto w-full max-w-8xl px-4  md:px-8 lg:px-10">
      {/* Page Title */}
      <div className="mb-7 mt-10">
        <h1 className="text-2xl font-bold text-foreground">
          Skill Gap Analysis
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover where you stand and what to learn next for your dream role
        </p>
      </div>

      {/* Role Selection */}
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

      {/* Empty State */}
      {!analysis && !isLoading && !error && (
        <RevealOnScroll delay={0.1}>
          <EmptyState />
        </RevealOnScroll>
      )}

      {/* Loading */}
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

      {/* Results */}
      {analysis && !isLoading && (
        <div className="space-y-8 mb-5">
          {/* <RevealOnScroll>
            <RequiredSkills data={analysis.requiredSkills} />
          </RevealOnScroll> */}

          <RevealOnScroll delay={0.1}>
            <SkillComparison
              matchPercentage={analysis.matchPercentage}
              comparison={analysis.skillComparison}
            />
          </RevealOnScroll>


        </div>
      )}
    </div>
  );
}
