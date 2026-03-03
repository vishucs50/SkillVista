"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import EmployabilityIndex from "@/components/dashboard/EmployabilityIndex";
import NextBestAction from "@/components/dashboard/NextBestAction";
import SkillAptitudeRadar from "@/components/dashboard/SkillAptitudeRadar";
import CriticalSkillGaps from "@/components/dashboard/CriticalSkillGap";
import HiringReadiness from "@/components/dashboard/HiringReadiness";

import { useAssessmentStore } from "@/store/useAssessmentStore";
import useResultStore from "@/store/useResultStore";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");

  const setBasicDetails = useAssessmentStore((s) => s.setBasicDetails);
  const setResults = useResultStore((s) => s.setResults);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    const hydrate = async () => {
      const assessmentRes = await fetch("/api/assessment/me");
      if (assessmentRes.ok) {
        const assessmentData = await assessmentRes.json();
        if (assessmentData.assessment?.basicDetails) {
          setBasicDetails(assessmentData.assessment.basicDetails);
        }
      }

      const resultsRes = await fetch("/api/results/me");
      if (resultsRes.ok) {
        const resultsData = await resultsRes.json();
        if (resultsData && Object.keys(resultsData).length > 0) {
          setResults(resultsData);
        }
      }
    };

    hydrate();
  }, [status, setBasicDetails, setResults]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="sea-green-gradient size-10 animate-spin rounded-lg" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

return (
  <div className="w-full px-6 md:px-10 py-10">
    {/* Toggle */}
    <div className="flex justify-center mb-6">
      <div className="relative flex bg-muted/40 backdrop-blur-md border border-border rounded-full p-1 shadow-sm">
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-1 bottom-1 w-1/2 rounded-full bg-background shadow"
          style={{
            left: activeSection === "overview" ? "4px" : "50%",
          }}
        />

        <button
          onClick={() => setActiveSection("overview")}
          className={`relative z-10 px-6 py-2 text-sm font-medium transition ${
            activeSection === "overview"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveSection("analysis")}
          className={`relative z-10 px-6 py-2 text-sm font-medium transition ${
            activeSection === "analysis"
              ? "text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Analysis
        </button>
      </div>
    </div>

    {/* Content */}
    <AnimatePresence mode="wait">
      {activeSection === "overview" && (
        <motion.div
          key="overview"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full"
        >
          <div className="xl:col-span-4 flex flex-col gap-8">
            <EmployabilityIndex />
            <NextBestAction />
          </div>

          <div className="xl:col-span-8">
            <SkillAptitudeRadar />
          </div>
        </motion.div>
      )}

      {activeSection === "analysis" && (
        <motion.div
          key="analysis"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -25 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 xl:grid-cols-12 gap-8 w-full mt-12"
        >
          <div className="xl:col-span-5">
            <CriticalSkillGaps />
          </div>

          <div className="xl:col-span-7">
            <HiringReadiness />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);
}
