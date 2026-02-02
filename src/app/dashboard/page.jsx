"use client"
import Header from "@/components/dashboard/Header";
import Sidebar from "@/components/dashboard/Sidebar";

import EmployabilityIndex from "@/components/dashboard/EmployabilityIndex";
import NextBestAction from "@/components/dashboard/NextBestAction";
import SkillAptitudeRadar from "@/components/dashboard/SkillAptitudeRadar";
import CriticalSkillGaps from "@/components/dashboard/CriticalSkillGap";
import HiringReadiness from "@/components/dashboard/HiringReadiness";
import useResultStore from "@/store/useResultStore";
export default function Page() {
  const result=useResultStore((state)=>state.result);
  console.log(result);
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <EmployabilityIndex />
              <NextBestAction />
            </div>

            <div className="col-span-12 lg:col-span-8">
              <SkillAptitudeRadar />
            </div>

            <div className="col-span-12 lg:col-span-5">
              <CriticalSkillGaps />
            </div>

            <div className="col-span-12 lg:col-span-7 space-y-6">
              <HiringReadiness />
             
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
