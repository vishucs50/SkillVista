"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Award, BarChart3 } from "lucide-react";

export default function Analytics({ analytics }) {
  if (!analytics || analytics.totalAttempts === 0) {
    return null;
  }

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
      value: analytics.trend.length >= 2
        ? `${analytics.trend[analytics.trend.length - 1].score - analytics.trend[0].score > 0 ? "+" : ""}${analytics.trend[analytics.trend.length - 1].score - analytics.trend[0].score}%`
        : "N/A",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50 dark:bg-orange-950/20",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`p-4 rounded-lg ${stat.bg}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>
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
