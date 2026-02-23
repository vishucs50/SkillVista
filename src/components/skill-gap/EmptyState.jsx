"use client";

import { motion } from "framer-motion";

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="relative mb-6">
        <div className="sea-green-gradient flex size-20 items-center justify-center rounded-2xl opacity-80">
          <span className="material-icons text-4xl text-white">route</span>
        </div>
        <div className="absolute -inset-4 -z-10 rounded-3xl bg-primary/10 blur-xl" />
      </div>

      <h3 className="mb-2 text-lg font-semibold text-foreground">
        Your Career GPS Dashboard
      </h3>
      <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
        Select a target role and experience level above, then click
        &quot;Analyze Skill Gap&quot; to get a personalized breakdown of your
        skills, identify gaps, and receive an actionable improvement roadmap.
      </p>

      <div className="mt-8 grid grid-cols-3 gap-6">
        {[
          { icon: "search", label: "Identify Gaps" },
          { icon: "trending_up", label: "Track Progress" },
          { icon: "school", label: "Learn & Grow" },
        ].map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + idx * 0.1 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <span className="material-icons text-lg text-muted-foreground">
                {item.icon}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
