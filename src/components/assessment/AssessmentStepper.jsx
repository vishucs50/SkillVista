"use client";

import { Stepper } from "./stepper";
import StepperControls from "./StepperControls";
import { motion, AnimatePresence } from "framer-motion";

export default function AssessmentStepper({ children }) {
  return (
    <Stepper.Provider variant="horizontal" tracking>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground">
          SkillVista Assessment
        </h1>
        <p className="text-sm text-muted-foreground">
          Answer carefully. Your progress is saved automatically.
        </p>
      </div>

      {/* Step Navigation */}
      <div className="rounded-2xl border border-border bg-card/70 backdrop-blur p-6 shadow-lg">
        <Stepper.Navigation />

        {/* Animated Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key="step-content"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mt-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>

        <StepperControls />
      </div>
    </Stepper.Provider>
  );
}
