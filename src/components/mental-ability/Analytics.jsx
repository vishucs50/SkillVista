"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Award, BarChart3 } from "lucide-react";

export default function Analytics({ analytics, compact = false }) {
  if (!analytics || analytics.totalAttempts === 0) return null;

  const improvement =
    analytics.trend.length >= 2
      ? analytics.trend[analytics.trend.length - 1].score -
        analytics.trend[0].score
      : null;

  const stats = [
    {
      label: "Total Attempts",
      value: analytics.totalAttempts,
      icon: BarChart3,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/20",
    },
    {
      label: "Average Score",
      value: `${analytics.averageScore}%`,
      icon: Target,
      color: "text-purple-600",
      bg: "bg-purple-50 dark:bg-purple-950/20",
    },
    {
      label: "Highest Score",
      value: `${analytics.highestScore}%`,
      icon: Award,
      color: "text-green-600",
      bg: "bg-green-50 dark:bg-green-950/20",
    },
    {
      label: "Improvement",
      value:
        improvement !== null
          ? `${improvement > 0 ? "+" : ""}${improvement}%`
          : "N/A",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className={compact ? "pb-2" : ""}>
        <CardTitle className={compact ? "text-base" : ""}>
          Performance Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col justify-center">
        <div
          className={`grid ${
            compact ? "grid-cols-2 gap-3" : "grid-cols-2 md:grid-cols-4 gap-4"
          }`}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className={`rounded-xl p-3 ${stat.bg} flex flex-col justify-between`}
              >
                {/* TOP */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>

                {/* VALUE */}
                <div
                  className={`font-bold mt-2 ${
                    compact ? "text-lg" : "text-2xl"
                  } ${stat.color}`}
                >
                  {stat.value}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
