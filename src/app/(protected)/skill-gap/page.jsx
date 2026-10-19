"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import RevealOnScroll from "@/components/common/RevealOnScroll";
import { useSkillGapStore } from "@/store/useSkillGapStore";
import RoleSelector from "@/components/skill-gap/RoleSelector";
import SkillComparison from "@/components/skill-gap/SkillComparison";
import EmptyState from "@/components/skill-gap/EmptyState";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import SkillGapHistory from "@/components/skill-gap/SkillGapHistory";
import { syncAssessmentToBackend } from "@/lib/syncAssessment";
export default function SkillGapPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const analysis = useSkillGapStore((s) => s.analysis);
  const setAnalysis = useSkillGapStore((s) => s.setAnalysis);
  const clearAnalysis = useSkillGapStore((s) => s.clearAnalysis);
  const [error, setError] = useState(null);
  const previousUserId = useRef(null);

  const basicDetails = useAssessmentStore((s) => s.basicDetails);
  const addSkill = useAssessmentStore((s) => s.addSkill);
  const [pendingSkill, setPendingSkill] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Prevent persisted analysis from leaking between authenticated users.
  useEffect(() => {
    const userId = session?.user?.id;
    if (userId && previousUserId.current && previousUserId.current !== userId) {
      clearAnalysis();
    }
    if (userId) previousUserId.current = userId;
  }, [session?.user?.id, clearAnalysis]);

  const handleAnalyze = async (targetRole, experienceLevel) => {
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
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || `Analysis failed (${res.status})`);
      }

      if (
        typeof data.matchPercentage !== "number" ||
        !Array.isArray(data.skillComparison)
      ) {
        throw new Error("The analysis response was incomplete. Please try again.");
      }

      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = (skill) => {
    if (
      !skill ||
      basicDetails?.skills?.some(
        (existingSkill) =>
          existingSkill.toLowerCase() === skill.toLowerCase(),
      )
    ) {
      return;
    }

    addSkill(skill);
    setPendingSkill(skill);

    // Do not await this request: local state is updated immediately and
    // keepalive allows the browser to finish syncing during navigation.
    syncAssessmentToBackend()
      .catch((syncError) => {
        console.error("Background skill sync failed:", syncError);
        setError(`"${skill}" was added locally but could not be saved.`);
      })
      .finally(() => setPendingSkill(null));

    setAnalysis((currentAnalysis) => {
      if (!currentAnalysis) return currentAnalysis;

      const updatedComparison = currentAnalysis.skillComparison.map((item) =>
        item.skill.toLowerCase() === skill.toLowerCase()
          ? { ...item, userHas: true, gapStatus: "No Gap" }
          : item,
      );
      const requiredSkills = updatedComparison.filter((item) => item.required);
      const matchedSkills = requiredSkills.filter((item) => item.userHas);

      return {
        ...currentAnalysis,
        matchPercentage: requiredSkills.length
          ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
          : currentAnalysis.matchPercentage,
        skillComparison: updatedComparison,
      };
    });
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

      <SkillGapHistory onSelect={setAnalysis} />

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
          <RevealOnScroll delay={0.1}>
            <SkillComparison
              matchPercentage={analysis.matchPercentage}
              comparison={analysis.skillComparison}
              onAddSkill={handleAddSkill}
              pendingSkill={pendingSkill}
            />
          </RevealOnScroll>


        </div>
      )}
    </div>
  );
}
