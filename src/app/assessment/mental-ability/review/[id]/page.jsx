"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowLeft, Loader2 } from "lucide-react";

export default function ReviewAttempt() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated" && params.id) {
      fetchAttempt();
    }
  }, [status, params.id]);

  const fetchAttempt = async () => {
    try {
      const response = await fetch(`/api/attempts/${params.id}`);
      const data = await response.json();

      if (response.ok) {
        setAttempt(data.attempt);
      }
    } catch (error) {
      console.error("Error fetching attempt:", error);
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

  if (!attempt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Attempt Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push("/assessment/hub")}>
              Back to Hub
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Review Answers</h1>
            <p className="text-muted-foreground">
              Score: {attempt.score}/{attempt.totalQuestions} ({attempt.percentage}%)
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/assessment/hub")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Hub
          </Button>
        </div>

        <div className="space-y-4">
          {attempt.answers.map((answer, index) => {
            const question = answer.questionId;
            
            return (
              <Card
                key={answer._id || index}
                className={answer.isCorrect ? "border-green-500/50" : "border-red-500/50"}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Question {index + 1}
                    </CardTitle>
                    <Badge
                      variant={answer.isCorrect ? "default" : "destructive"}
                      className="flex items-center gap-1"
                    >
                      {answer.isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Correct
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          Wrong
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-base leading-relaxed">
                    {question?.question || "Question not available"}
                  </p>

                  <div className="space-y-2">
                    {question?.options?.map((option, optIndex) => {
                      const isSelected = option === answer.selectedAnswer;
                      const isCorrect = option === answer.correctAnswer;

                      return (
                        <div
                          key={optIndex}
                          className={`p-3 rounded-lg border-2 ${
                            isCorrect
                              ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                              : isSelected
                              ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                              : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                            {isSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-red-600" />
                            )}
                            <span>{option}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!answer.isCorrect && (
                    <div className="p-3 bg-accent rounded-lg text-sm">
                      <span className="font-semibold">Your answer: </span>
                      {answer.selectedAnswer || "Not answered"}
                      <br />
                      <span className="font-semibold text-green-600">
                        Correct answer:{" "}
                      </span>
                      {answer.correctAnswer}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

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
      </div>
    </div>
  );
}
