"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

import EmployabilityIndex from "@/components/dashboard/EmployabilityIndex";
import NextBestAction from "@/components/dashboard/NextBestAction";
import SkillAptitudeRadar from "@/components/dashboard/SkillAptitudeRadar";
import CriticalSkillGaps from "@/components/dashboard/CriticalSkillGap";
import HiringReadiness from "@/components/dashboard/HiringReadiness";

import RevealOnScroll from "@/components/common/RevealOnScroll";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import useResultStore from "@/store/useResultStore";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  //  Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const setBasicDetails = useAssessmentStore((s) => s.setBasicDetails);
  const setResults = useResultStore((s) => s.setResults);

  useEffect(() => {
    if (status !== "authenticated") return;

    const hydrate = async () => {
      // Load assessment data
      const assessmentRes = await fetch("/api/assessment/me");
      if (assessmentRes.ok) {
        const assessmentData = await assessmentRes.json();
        if (assessmentData.assessment?.basicDetails) {
          setBasicDetails(assessmentData.assessment.basicDetails);
        }
      }

      // Load results data
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

  const result = useResultStore((state) => state.result);

  //  Loading state
  if (status === "loading") {
    return <p>Loading...</p>;
  }

  // HARD STOP — do not render dashboard
  if (!session) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* ===== MOBILE TOP BAR ===== */}
      <div className="flex items-center justify-between lg:hidden px-4 py-3 bg-card border-b border-border">
        <h1 className="text-sm font-semibold">Dashboard</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-8 lg:px-10">
            {/* ===== ROW 1: OVERVIEW ===== */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start mb-16 mt-14 lg:mb-24">
              {/* LEFT COLUMN */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 self-start">
                <RevealOnScroll>
                  <EmployabilityIndex />
                </RevealOnScroll>

                <RevealOnScroll delay={0.05}>
                  <NextBestAction />
                </RevealOnScroll>
              </div>

              {/* RIGHT COLUMN */}
              <div className="col-span-12 lg:col-span-8 self-start">
                <RevealOnScroll delay={0.1}>
                  <SkillAptitudeRadar />
                </RevealOnScroll>
              </div>
            </div>

            {/* ===== ROW 2: ANALYSIS ===== */}
            <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
              <div className="col-span-12 lg:col-span-5">
                <RevealOnScroll delay={0.15}>
                  <CriticalSkillGaps />
                </RevealOnScroll>
              </div>

              <div className="col-span-12 lg:col-span-7">
                <RevealOnScroll delay={0.2}>
                  <HiringReadiness />
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );

}
