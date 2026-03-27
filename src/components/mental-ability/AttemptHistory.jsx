"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Award,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AttemptHistory({ attempts, compact = false }) {
  const router = useRouter();

  if (!attempts || attempts.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground text-sm text-center">
            No attempts yet 🚀
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
    });
  };

  const getImprovement = (current, previous) => {
    if (!previous) return null;
    return current - previous;
  };

  return (
    <Card className="h-full flex flex-col overflow-hidden">
      <CardHeader className={compact ? "pb-2" : ""}>
        <CardTitle
          className={`flex items-center gap-2 ${compact ? "text-sm" : ""}`}
        >
          <Award className="w-4 h-4" />
          Attempts
        </CardTitle>
      </CardHeader>

      {/* 🔥 FIXED HEIGHT LIST */}
      <CardContent className="flex-1 overflow-hidden">
        <div
          className={`h-full ${
            compact ? "space-y-2" : "space-y-3"
          } overflow-hidden`}
        >
          {attempts
            .slice(0, compact ? 5 : attempts.length)
            .map((attempt, index) => {
              const improvement =
                index < attempts.length - 1
                  ? getImprovement(
                      attempt.percentage,
                      attempts[index + 1].percentage,
                    )
                  : null;

              return (
                <div
                  key={attempt._id}
                  className={`flex items-center justify-between border rounded-lg transition ${
                    compact ? "p-2 text-xs" : "p-4 hover:bg-accent"
                  }`}
                >
                  {/* LEFT */}
                  <div className="flex items-center gap-3">
                    {/* SCORE */}
                    <div className="text-center">
                      <div
                        className={`font-bold ${
                          compact ? "text-sm" : "text-2xl"
                        }`}
                      >
                        {attempt.percentage}%
                      </div>
                      {!compact && (
                        <div className="text-xs text-muted-foreground">
                          {attempt.score}/{attempt.totalQuestions}
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                        <Calendar className="w-3 h-3" />
                        {formatDate(attempt.createdAt)}
                      </div>

                      {improvement !== null && (
                        <div className="flex items-center gap-1">
                          {improvement > 0 ? (
                            <>
                              <TrendingUp className="w-3 h-3 text-green-600" />
                              <span className="text-green-600 text-[10px]">
                                +{improvement}%
                              </span>
                            </>
                          ) : improvement < 0 ? (
                            <>
                              <TrendingDown className="w-3 h-3 text-red-600" />
                              <span className="text-red-600 text-[10px]">
                                {improvement}%
                              </span>
                            </>
                          ) : (
                            <>
                              <Minus className="w-3 h-3 text-gray-600" />
                              <span className="text-gray-600 text-[10px]">
                                0%
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="flex items-center gap-2">
                    {!compact && (
                      <Badge
                        variant={
                          attempt.percentage >= 80
                            ? "default"
                            : attempt.percentage >= 60
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {attempt.percentage >= 80
                          ? "Excellent"
                          : attempt.percentage >= 60
                            ? "Good"
                            : "Practice"}
                      </Badge>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      className={compact ? "px-2 py-1 h-7 text-xs" : ""}
                      onClick={() =>
                        router.push(
                          `/assessment/mental-ability/review/${attempt._id}`,
                        )
                      }
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {!compact && "Review"}
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
