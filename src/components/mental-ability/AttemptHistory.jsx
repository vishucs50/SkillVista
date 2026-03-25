"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Minus, Calendar, Award, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AttemptHistory({ attempts }) {
  const router = useRouter();
  if (!attempts || attempts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Previous Attempts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No previous attempts yet. Take your first test!
          </p>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getImprovement = (current, previous) => {
    if (!previous) return null;
    return current - previous;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
          Previous Attempts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {attempts.map((attempt, index) => {
            const improvement = index < attempts.length - 1
              ? getImprovement(attempt.percentage, attempts[index + 1].percentage)
              : null;

            return (
              <div
                key={attempt._id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{attempt.percentage}%</div>
                    <div className="text-xs text-muted-foreground">
                      {attempt.score}/{attempt.totalQuestions}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {formatDate(attempt.createdAt)}
                    </div>
                    {improvement !== null && (
                      <div className="flex items-center gap-1">
                        {improvement > 0 ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">
                              +{improvement}%
                            </span>
                          </>
                        ) : improvement < 0 ? (
                          <>
                            <TrendingDown className="w-4 h-4 text-red-600" />
                            <span className="text-sm text-red-600 font-medium">
                              {improvement}%
                            </span>
                          </>
                        ) : (
                          <>
                            <Minus className="w-4 h-4 text-gray-600" />
                            <span className="text-sm text-gray-600 font-medium">
                              No change
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      attempt.percentage >= 80
                        ? "default"
                        : attempt.percentage >= 60
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {attempt.percentage >= 80
                      ? "Excellent"
                      : attempt.percentage >= 60
                      ? "Good"
                      : "Practice"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/assessment/mental-ability/review/${attempt._id}`)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    Review
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
