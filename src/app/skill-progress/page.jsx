"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";
import ConnectGithub from "@/components/dashboard/ConnectGithub";
import GitHubAnalysis from "@/components/skill-gap/GithubAnalysis";
import RevealOnScroll from "@/components/common/RevealOnScroll";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SkillProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [githubConnected, setGithubConnected] = useState(false);
  const [isCheckingGithub, setIsCheckingGithub] = useState(false);
  const [githubData, setGithubData] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);

  // Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  // Check GitHub connection status and fetch data
  useEffect(() => {
    if (status !== "authenticated") return;

    const checkGitHubStatus = async () => {
      setIsCheckingGithub(true);
      try {
        const res = await fetch("/api/github/connect");
        if (res.ok) {
          const data = await res.json();
          setGithubConnected(data.githubConnected || false);
          if (data.githubConnected && data.githubData) {
            setGithubData(data.githubData);
            // Pass username from API response
            if (data.githubUsername) {
              fetchTopRepositories(data.githubUsername);
            }
          }
        }
      } catch (err) {
        console.error("Failed to check GitHub status:", err);
      } finally {
        setIsCheckingGithub(false);
      }
    };

    checkGitHubStatus();
  }, [status]);

  // Fetch top repositories from GitHub
  const fetchTopRepositories = async (username) => {
    setIsLoadingRepos(true);
    try {
      // Use provided username or fall back to session
      const finalUsername = username || session?.user?.githubUsername;

      console.log("GitHub Username:", finalUsername);

      if (!finalUsername) {
        console.error("GitHub username not found");
        return;
      }

      const url = `https://api.github.com/users/${finalUsername}/repos?sort=stars&direction=desc&per_page=6`;
      console.log("Fetching repos from:", url);

      const response = await fetch(url, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        console.error(`Failed to fetch repos: ${response.status} ${response.statusText}`);
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const repos = await response.json();
      console.log("Fetched repos:", repos);
      setRepositories(repos);
    } catch (err) {
      console.error("Failed to fetch repositories:", err);
    } finally {
      setIsLoadingRepos(false);
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
        <h1 className="text-sm font-semibold">Skill Progress</h1>
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
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:px-10">
            {/* HERO HEADER */}
            <div className="mt-14 mb-10 flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Skill Progress
              </h1>
              <p className="text-sm text-muted-foreground">
                Track your growth, analyze GitHub activity, and discover your
                strengths.
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    githubConnected
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {githubConnected
                    ? "GitHub Connected"
                    : "GitHub Not Connected"}
                </span>
              </div>
            </div>

            {/* CONNECT GITHUB */}
            {!githubConnected && !isCheckingGithub && (
              <RevealOnScroll>
                <div className="mb-10">
                  <ConnectGithub
                    onConnected={async () => {
                      setGithubConnected(true);
                      const res = await fetch("/api/github/connect");
                      if (res.ok) {
                        const data = await res.json();
                        if (data.githubData) setGithubData(data.githubData);
                        if (data.githubUsername)
                          fetchTopRepositories(data.githubUsername);
                      }
                    }}
                  />
                </div>
              </RevealOnScroll>
            )}

            {githubConnected && githubData && (
              <div className="space-y-10">
                {/* PROFILE + SKILLS GRID */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* GitHub Analysis (Wide) */}
                  <div className="xl:col-span-2">
                    <RevealOnScroll>
                      <GitHubAnalysis data={githubData} />
                    </RevealOnScroll>
                  </div>

                  {/* Skill Insights Sidebar */}
                  <RevealOnScroll delay={0.1}>
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Skill Insights</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Based on your GitHub activity
                        </p>
                      </CardHeader>

                      <CardContent className="space-y-6">
                        {/* Primary Skills */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3">
                            Primary Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {githubData.topLanguages?.map((lang) => (
                              <span
                                key={lang}
                                className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                              >
                                {lang}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Frameworks */}
                        <div>
                          <h4 className="text-sm font-semibold mb-3">
                            Frameworks & Tools
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {githubData.detectedFrameworks?.map((fw) => (
                              <span
                                key={fw}
                                className="px-3 py-1 rounded-full bg-secondary/10 text-secondary-foreground text-xs font-medium"
                              >
                                {fw}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Strength Areas */}
                        {githubData.strengthAreas && (
                          <div>
                            <h4 className="text-sm font-semibold mb-3">
                              Your Strengths
                            </h4>
                            <ul className="space-y-2">
                              {githubData.strengthAreas.map((area) => (
                                <li
                                  key={area}
                                  className="text-sm text-muted-foreground flex items-center gap-2"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </RevealOnScroll>
                </div>

                {/* TOP REPOSITORIES */}
                <RevealOnScroll delay={0.2}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Repositories</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Your most starred projects
                      </p>
                    </CardHeader>

                    <CardContent>
                      {isLoadingRepos ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={i}
                              className="h-32 rounded-lg bg-muted animate-pulse"
                            />
                          ))}
                        </div>
                      ) : repositories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                          {repositories.map((repo) => (
                            <a
                              key={repo.id}
                              href={repo.html_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group rounded-xl border border-border bg-muted/30 p-5 transition-all hover:-translate-y-1 hover:shadow-md hover:border-primary/50"
                            >
                              <div className="space-y-3">
                                <div className="flex justify-between gap-2">
                                  <h3 className="font-semibold truncate group-hover:text-primary">
                                    {repo.name}
                                  </h3>

                                  {repo.private && (
                                    <span className="text-[10px] px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-600">
                                      Private
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {repo.description ||
                                    "No description provided"}
                                </p>

                                <div className="flex justify-between text-xs text-muted-foreground pt-1">
                                  <div className="flex items-center gap-3">
                                    {repo.language && (
                                      <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-primary" />
                                        {repo.language}
                                      </span>
                                    )}
                                    <span>⭐ {repo.stargazers_count}</span>
                                  </div>

                                  {repo.forks_count > 0 && (
                                    <span>🔀 {repo.forks_count}</span>
                                  )}
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                          <p className="text-muted-foreground">
                            No public repositories found
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Create your first repository to get started
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </RevealOnScroll>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
