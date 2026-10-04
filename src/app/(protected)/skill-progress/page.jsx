"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Activity } from "lucide-react";
import ConnectGithub from "@/components/dashboard/ConnectGithub";
import GitHubAnalysis from "@/components/skill-gap/GithubAnalysis";
import RevealOnScroll from "@/components/common/RevealOnScroll";

export default function SkillProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubData, setGithubData] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [error, setError] = useState(null);

  const loadGithub = useCallback(async (refresh = false) => {
    setIsChecking(true);
    setError(null);
    try {
      const response = await fetch("/api/github/analyze", refresh ? { method: "POST" } : undefined);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load GitHub analysis");
      setGithubConnected(result.githubConnected || false);
      if (result.githubData) {
        setGithubData({
          ...result.githubData,
          username: result.githubUsername || result.githubData.username,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    if (status === "authenticated") loadGithub();
  }, [status, router, loadGithub]);

  if (status === "loading" || isChecking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="sea-green-gradient size-10 animate-spin rounded-lg" />
          <p className="text-sm text-muted-foreground">Loading your GitHub profile...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:px-10">
      <div className="mb-8 mt-10">
        <div className="mb-2 flex items-center gap-3">
          <div className="sea-green-gradient rounded-lg p-2 text-white"><Activity size={20} /></div>
          <h1 className="text-3xl font-bold tracking-tight">Skill Progress</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Track your growth and explore the project evidence behind your skills.
        </p>
      </div>

      {error && <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">{error}</div>}

      {!githubConnected ? (
        <RevealOnScroll>
          <ConnectGithub onConnected={loadGithub} />
        </RevealOnScroll>
      ) : (
        <RevealOnScroll>
          <GitHubAnalysis data={githubData} onRefresh={() => loadGithub(true)} isRefreshing={isChecking} />
        </RevealOnScroll>
      )}
    </div>
  );
}
