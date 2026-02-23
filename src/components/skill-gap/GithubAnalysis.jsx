"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

function ContributionLevel({ level }) {
  const config = {
    high: { value: 90, color: "#22c55e", label: "High" },
    medium: { value: 55, color: "#facc15", label: "Medium" },
    low: { value: 25, color: "#ef4444", label: "Low" },
  };

  const { value, label } = config[level] || config.low;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Contribution Score</span>
        <span className="font-semibold">{label}</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
}

export default function GitHubAnalysis({ data }) {
  if (!data) return null;

  return (
    <Card>
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
          GitHub Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Skills and activity detected from your GitHub profile
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Top Languages */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Top Languages
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.topLanguages?.map((lang, idx) => (
              <motion.div
                key={lang}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Badge variant="secondary" className="px-3 py-1 text-xs">
                  {lang}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Frameworks */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Detected Frameworks
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.detectedFrameworks?.map((fw, idx) => (
              <motion.div
                key={fw}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Badge
                  variant="outline"
                  className="border-primary/30 max-w-full px-4 sm:px-4 py-4 text-[11px] sm:text-xs text-foreground wrap-break-word whitespace-normal"
                >
                  {fw}
                </Badge>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contribution Score */}
        <ContributionLevel level={data.contributionLevel} />

        {/* Strength Areas */}
        {data.strengthAreas && data.strengthAreas.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Strength Areas
            </h4>
            <div className="space-y-2">
              {data.strengthAreas.map((area, idx) => (
                <motion.div
                  key={area}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-2 text-sm text-foreground"
                >
                  <span className="inline-block size-1.5 rounded-full bg-primary" />
                  {area}
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
