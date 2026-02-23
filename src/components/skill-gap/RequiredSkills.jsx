"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const CATEGORY_LABELS = {
  frontend: "Frontend",
  backend: "Backend",
  tools: "Tools",
  softSkills: "Soft Skills",
};

const CATEGORY_ICONS = {
  frontend: "web",
  backend: "dns",
  tools: "build",
  softSkills: "groups",
};

function StatusDot({ status }) {
  const config = {
    strong: { color: "#22c55e", label: "Strong" },
    basic: { color: "#facc15", label: "Basic" },
    missing: { color: "#ef4444", label: "Missing" },
  };

  const { color, label } = config[status] || config.missing;

  return (
    <span className="flex items-center gap-1.5">
      <span
        className="inline-block size-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-muted-foreground">{label}</span>
    </span>
  );
}

export default function RequiredSkills({ data }) {
  if (!data) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="material-icons text-xl text-primary">checklist</span>
          Required Skills
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Skills categorized by domain with your current proficiency status
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
            const skills = data[key];
            if (!skills || skills.length === 0) return null;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl border border-border bg-muted/30 p-4"
              >
                <div className="mb-3 flex items-center gap-2">
                  <span className="material-icons text-base text-muted-foreground">
                    {CATEGORY_ICONS[key]}
                  </span>
                  <h3 className="text-sm font-semibold">{label}</h3>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.03, duration: 0.2 }}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                        skill.status === "strong"
                          ? "border-green-500/20 bg-green-500/5"
                          : skill.status === "basic"
                            ? "border-yellow-500/20 bg-yellow-500/5"
                            : "border-red-500/20 bg-red-500/5"
                      }`}
                    >
                      <span className="text-foreground">{skill.name}</span>
                      <StatusDot status={skill.status} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center gap-6 border-t border-border pt-4">
          <span className="text-xs text-muted-foreground">Status:</span>
          <StatusDot status="strong" />
          <StatusDot status="basic" />
          <StatusDot status="missing" />
        </div>
      </CardContent>
    </Card>
  );
}
 