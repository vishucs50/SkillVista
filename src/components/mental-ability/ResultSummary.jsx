"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ResultSummary({ result, improvement }) {
  const router = useRouter();
  
  const getPerformanceMessage = (percentage) => {
    if (percentage >= 80) return { text: "Excellent!", color: "text-green-600" };
    if (percentage >= 60) return { text: "Good Job!", color: "text-blue-600" };
    if (percentage >= 40) return { text: "Keep Practicing!", color: "text-yellow-600" };
    return { text: "Need More Practice", color: "text-red-600" };
  };

  const performance = getPerformanceMessage(result.percentage);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">Test Completed!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${performance.color}`}>
              {result.percentage}%
            </div>
            <p className={`text-xl font-semibold ${performance.color}`}>
              {performance.text}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Correct</span>
              </div>
              <div className="text-3xl font-bold">{result.score}</div>
            </div>

            <div className="text-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <XCircle className="w-5 h-5" />
                <span className="font-semibold">Wrong</span>
              </div>
              <div className="text-3xl font-bold">
                {result.totalQuestions - result.score}
              </div>
            </div>
          </div>

          {improvement !== null && (
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                {improvement > 0 ? (
                  <>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-600">Improved!</span>
                  </>
                ) : improvement < 0 ? (
                  <>
                    <TrendingDown className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-600">Needs Improvement</span>
                  </>
                ) : (
                  <>
                    <Minus className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold text-gray-600">Same Score</span>
                  </>
                )}
              </div>
              <div className="text-2xl font-bold">
                {improvement > 0 ? "+" : ""}{improvement}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Compared to previous attempt
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={() => router.push("/assessment/mental-ability")}
              className="flex-1"
            >
              Retake Test
            </Button>
            <Button
              onClick={() => router.push("/assessment/hub")}
              variant="outline"
              className="flex-1"
            >
              Back to Hub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
