"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepperHeader from "./StepperHeader";

import BasicDetails from "./steps/BasicDetails";
import SkillAssessment from "./steps/SkillAssessment";
import AptitudeTest from "./steps/AptitudeTest";

const TOTAL_STEPS = 3;

export default function StepperLayout() {
  const [currentStep, setCurrentStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);

  // ✅ SAFE RESTORE
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem("skillvista-step");
    const step = Number(saved);

    if (!Number.isNaN(step) && step >= 0 && step < TOTAL_STEPS) {
      setCurrentStep(step);
    }

    setHydrated(true);
  }, []);

  // ✅ SAFE PERSIST
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;

    window.localStorage.setItem("skillvista-step", currentStep);
  }, [currentStep, hydrated]);

  const nextStep = () =>
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));

  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 0));

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicDetails onNext={nextStep} />;
      case 1:
        return <SkillAssessment onNext={nextStep} onBack={prevStep} />;
      case 2:
        return <AptitudeTest onBack={prevStep} />;
      default:
        return null;
    }
  };

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-3xl px-6 py-10 flex flex-col">
        <StepperHeader currentStep={currentStep} />

        <div className="flex-1 flex justify-center mt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
