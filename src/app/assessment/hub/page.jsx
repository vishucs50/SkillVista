"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import AttemptHistory from "@/components/mental-ability/AttemptHistory";
import Analytics from "@/components/mental-ability/Analytics";
import { Brain, Loader2, ArrowRight } from "lucide-react";

export default function AssessmentHub() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [attempts, setAttempts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      const [attemptsRes, analyticsRes] = await Promise.all([
        fetch(`/api/attempts?userId=${session.user.id}`),
        fetch(`/api/attempts/analytics?userId=${session.user.id}`),
      ]);

      const attemptsData = await attemptsRes.json();
      const analyticsData = await analyticsRes.json();

      if (attemptsRes.ok) {
        setAttempts(attemptsData.attempts || []);
      }

      if (analyticsRes.ok) {
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const latestAttempt = attempts[0];
  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length,
        )
      : 0;

  return (
    <div className="h-screen flex flex-col bg-background px-4 py-4">
      {/*  HEADER */}
      <div className="max-w-5xl mx-auto w-full mb-4 text-center">
        <h1 className="text-3xl font-bold">Mental Ability Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Practice, track progress, and improve your reasoning skills
        </p>
      </div>

      {/*  MAIN CONTENT */}
      <div className="flex-1 max-w-5xl mx-auto w-full flex flex-col md:flex-row gap-6 overflow-hidden">
        {/*  MAIN TEST CARD */}
        <Card className="flex-1 flex flex-col border-2 border-primary/20 hover:border-primary/40 transition-all">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Brain className="w-6 h-6 text-primary" />
                </div>

                <div>
                  <CardTitle className="text-xl">Mental Ability Test</CardTitle>
                  <CardDescription className="text-sm">
                    Logical reasoning, aptitude & pattern recognition
                  </CardDescription>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-lg">15</p>
                  <p className="text-muted-foreground text-xs">Questions</p>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-lg">15 min</p>
                  <p className="text-muted-foreground text-xs">Duration</p>
                </div>

                <div className="text-center">
                  <p className="font-semibold text-lg">MCQ</p>
                  <p className="text-muted-foreground text-xs">Type</p>
                </div>
              </div>
            </div>
            
          </CardHeader>

          <CardContent className="flex flex-col flex-1 gap-4">
            {/* 📊 SCORE BOX */}
            {latestAttempt && (
              <div className="p-4 bg-accent rounded-lg">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Latest Score
                  </span>
                  <span className="text-2xl font-bold">
                    {latestAttempt.percentage}%
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Average Score</span>
                  <span className="font-semibold">{averageScore}%</span>
                </div>
              </div>
            )}

            {/* 🚀 BUTTON (BOTTOM STICK) */}
            <Button
              onClick={() => router.push("/assessment/mental-ability")}
              className="w-full mt-auto"
              size="lg"
            >
              {attempts.length > 0 ? "Retake Test" : "Start Test"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              15 questions • ~10 minutes
            </div>
          </CardContent>
          
        </Card>

        {/* 📈 SIDE PANEL (ANALYTICS PREVIEW) */}
        <div className="w-full md:w-80 flex flex-col gap-4 overflow-hidden">
          {attempts.length > 0 ? (
            <>
              <div className="flex-1 overflow-hidden">
                <Analytics analytics={analytics} compact />
              </div>

              <div className="flex-1 overflow-hidden">
                <AttemptHistory attempts={attempts} compact />
              </div>
            </>
          ) : (
            <Card className="flex-1 flex items-center justify-center text-center">
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  No attempts yet. Start your first test 🚀
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
