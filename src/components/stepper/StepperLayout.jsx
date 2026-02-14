"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import StepperHeader from "./StepperHeader";
import BasicDetails from "./steps/BasicDetails";
import RoleGoalAlignment from "./steps/RoleGoalAlignment";
import SkillInventory from "./steps/SkillInventory";
import AptitudeTest from "./steps/AptitudeTest";
import ExperienceReadiness from "./steps/ExperienceReadiness";
import ReviewConfirm from "./steps/ReviewConfirm";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import useResultStore from "@/store/useResultStore";
import { calculateResults } from "@/lib/gemini/calculateResults";
import Header from "../dashboard/Header";

const TOTAL_STEPS = 6;

export default function StepperLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const assessment = useAssessmentStore();
  const setResults = useResultStore((s) => s.setResults);
  const resetAll = useAssessmentStore((s) => s.resetAll);
  const setBasicDetails = useAssessmentStore((s) => s.setBasicDetails);
  const setAptitudeAnswers = useAssessmentStore((s) => s.setAptitudeAnswers);

  const finishAssessment = () => {
    const results = calculateResults(assessment);
    setResults(results);

    localStorage.removeItem("skillvista-step");
    router.replace("/dashboard");
  };

  /* ===== LOAD USER'S ASSESSMENT DATA ===== */
  useEffect(() => {
    if (!session?.user?.id) return;

    const loadAssessmentData = async () => {
      try {
        const res = await fetch("/api/assessment/me");
        const data = await res.json();

        if (data.assessment) {
          // User has existing assessment data, load it
          if (data.assessment.basicDetails) {
            setBasicDetails(data.assessment.basicDetails);
          }
          if (data.assessment.aptitudeAnswers) {
            setAptitudeAnswers(data.assessment.aptitudeAnswers);
          }
        } else {
          // New user, reset the store
          resetAll();
          localStorage.removeItem("skillvista-assessment");
        }
      } catch (error) {
        console.error("Failed to load assessment data:", error);
        resetAll();
        localStorage.removeItem("skillvista-assessment");
      }
    };

    loadAssessmentData();
  }, [session?.user?.id, setBasicDetails, setAptitudeAnswers, resetAll]);

  /* ===== HYDRATION ===== */
  useEffect(() => {
    const saved = localStorage.getItem("skillvista-step");
    const step = Number(saved);

    if (!Number.isNaN(step) && step >= 0 && step < TOTAL_STEPS) {
      setCurrentStep(step);
    }
    setHydrated(true);
  }, []);

  /* ===== STEP PERSIST ===== */
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("skillvista-step", currentStep);
  }, [currentStep, hydrated]);

  const nextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicDetails onNext={nextStep} />;
      case 1:
        return <RoleGoalAlignment onNext={nextStep} onBack={prevStep} />;
      case 2:
        return <SkillInventory onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <AptitudeTest onNext={nextStep} onBack={prevStep} />;
      case 4:
        return <ExperienceReadiness onNext={nextStep} onBack={prevStep} />;
      case 5:
        return (
          <ReviewConfirm
            onBack={prevStep}
            onFinish={finishAssessment} 
          />
        );
      default:
        return null;
    }
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-3xl px-6 py-10 flex flex-col">
          <StepperHeader currentStep={currentStep} />

          <div className="flex-1 flex justify-center mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
