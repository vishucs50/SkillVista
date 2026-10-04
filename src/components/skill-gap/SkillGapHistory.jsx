"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, Loader2 } from "lucide-react";

export default function SkillGapHistory({ onSelect }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skill-gap/history")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setAnalyses(data.analyses || []))
      .catch(() => setAnalyses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <History size={17} /> Analysis history
        </CardTitle>
        {loading && <Loader2 size={16} className="animate-spin text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        {!loading && analyses.length === 0 ? (
          <p className="text-sm text-muted-foreground">Your completed analyses will appear here.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {analyses.map((analysis) => (
              <Button
                key={`${analysis.role}-${analysis.createdAt}`}
                variant="outline"
                className="h-auto justify-between p-3 text-left"
                onClick={() => onSelect?.(analysis.fullAnalysis)}
              >
                <span>
                  <span className="block text-sm font-medium">{analysis.role}</span>
                  <span className="block text-xs text-muted-foreground">
                    {analysis.level} · {new Date(analysis.createdAt).toLocaleDateString()}
                  </span>
                </span>
                <span className="text-primary">{analysis.matchPercentage}%</span>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
