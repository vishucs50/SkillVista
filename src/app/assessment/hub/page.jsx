"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const latestAttempt = attempts[0];
  const averageScore = attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
    : 0;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Assessment Center</h1>
          <p className="text-muted-foreground">
            Test your skills and track your progress
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Mental Ability Test</CardTitle>
                  <CardDescription>
                    Logical reasoning, aptitude & pattern recognition
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestAttempt && (
                <div className="p-4 bg-accent rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Latest Score</span>
                    <span className="text-2xl font-bold">{latestAttempt.percentage}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Average Score</span>
                    <span className="font-semibold">{averageScore}%</span>
                  </div>
                </div>
              )}

              <Button
                onClick={() => router.push("/assessment/mental-ability")}
                className="w-full"
                size="lg"
              >
                {attempts.length > 0 ? "Retake Test" : "Start Test"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                15 questions • ~10 minutes
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Assessment</CardTitle>
              <CardDescription>
                Complete profile & skill evaluation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push("/assessment")}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Go to Career Assessment
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {attempts.length > 0 && (
          <>
            <Analytics analytics={analytics} />
            <AttemptHistory attempts={attempts} />
          </>
        )}
      </div>
    </div>
  );
}
