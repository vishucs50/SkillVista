"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

import EmployabilityIndex from "@/components/dashboard/EmployabilityIndex";
import NextBestAction from "@/components/dashboard/NextBestAction";
import SkillAptitudeRadar from "@/components/dashboard/SkillAptitudeRadar";
import CriticalSkillGaps from "@/components/dashboard/CriticalSkillGap";
import HiringReadiness from "@/components/dashboard/HiringReadiness";

import RevealOnScroll from "@/components/common/RevealOnScroll";
import { syncAssessmentToBackend } from "@/lib/syncAssessment";
import useResultStore from "@/store/useResultStore";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();

  //  Redirect unauthenticated users
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  //  Prevent multiple syncs
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (status === "authenticated" && session && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      syncAssessmentToBackend();
    }
  }, [status, session]);

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
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* ===== ROW 1: OVERVIEW ===== */}
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-12 lg:col-span-4 space-y-6">
                <RevealOnScroll>
                  <EmployabilityIndex />
                </RevealOnScroll>

                <RevealOnScroll delay={0.05}>
                  <NextBestAction />
                </RevealOnScroll>
              </div>

              <div className="col-span-12 lg:col-span-8 mt-10">
                <RevealOnScroll delay={0.1}>
                  <SkillAptitudeRadar />
                </RevealOnScroll>
              </div>
            </div>

            {/* ===== ROW 2: ANALYSIS ===== */}
            <div className="grid grid-cols-12 gap-8">
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
