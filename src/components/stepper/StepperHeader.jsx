"use client";

import { Check } from "lucide-react";
import { steps } from "./steps";

export default function StepperHeader({ currentStep }) {
  return (
    <div className="mb-12">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.id}
              className={`flex items-center ${!isLast ? "flex-1" : ""}`}
            >
              {/* Step circle + label */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all
                    ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isActive
                          ? "border-primary text-primary scale-110"
                          : "border-border text-muted-foreground"
                    }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </div>

                <span
                  className={`mt-2 text-xs text-center transition-colors
                    ${
                      isActive
                        ? "text-primary font-semibold"
                        : isCompleted
                          ? "text-primary/80"
                          : "text-muted-foreground"
                    }`}
                >
                  {step.title}
                </span>
              </div>

              {/* Connector (NOT for last step) */}
              {!isLast && (
                <div
                  className={`flex-1 h-px mx-2 transition-colors
                    ${isCompleted ? "bg-primary" : "bg-border"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
