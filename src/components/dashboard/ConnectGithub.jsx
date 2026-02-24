"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function ConnectGithub({ onConnected }) {
  const [isLoading, setIsLoading] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleGitHubLogin = async () => {
    // Trigger GitHub OAuth signin
    await signIn("github", { redirect: false });
  };

  const handleManualConnect = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!githubUsername || !githubToken) {
      setError("Please enter both GitHub username and personal access token");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/github/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubUsername, githubToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to connect GitHub");
      }

      setSuccessMessage("GitHub connected successfully! Analyzing your profile...");
      setGithubToken("");
      setGithubUsername("");

      setTimeout(() => {
        if (onConnected) onConnected();
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            className="fill-foreground"
          >
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Connect GitHub to Analyze Skills
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Connect your GitHub account to automatically detect your programming skills and frameworks
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3">
            <p className="text-sm text-green-600">{successMessage}</p>
          </div>
        )}

        {/* OAuth Login Option */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Connect
          </p>
          <Button
            onClick={handleGitHubLogin}
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="ml-2">Connecting...</span>
              </>
            ) : (
              <>
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  className="fill-current"
                >
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                <span className="ml-2">Login with GitHub</span>
              </>
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        {/* Manual Token Option */}
        <form onSubmit={handleManualConnect} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Manual Connection
          </p>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              GitHub Username
            </label>
            <Input
              placeholder="e.g., johndoe"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-foreground">
              GitHub Personal Access Token
            </label>
            <Input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground"
              >
                Generate a token →
              </a>{" "}
              with public_repo scope
            </p>
          </div>

          <Button
            type="submit"
            disabled={isLoading || !githubUsername || !githubToken}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span className="ml-2">Connecting...</span>
              </>
            ) : (
              "Connect GitHub Account"
            )}
          </Button>
        </form>

        {/* Info Box */}
        <div className="rounded-lg border border-border bg-muted p-3">
          <p className="text-xs text-muted-foreground">
             <strong>Why connect GitHub?</strong> We analyze your repositories to detect your programming languages, frameworks, and skills automatically.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
