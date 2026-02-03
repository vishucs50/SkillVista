"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";

const QUESTIONS = [
  {
    id: "q1",
    question:
      "If a project takes 10 days and is delayed by 20%, how many days will it take?",
    options: ["10 days", "11 days", "12 days", "14 days"],
    correct: 2,
  },
  {
    id: "q2",
    question: "A train travels 60 km in 1.5 hours. What is its average speed?",
    options: ["30 km/h", "35 km/h", "40 km/h", "45 km/h"],
    correct: 2,
  },
  {
    id: "q3",
    question:
      "If all developers are engineers and some engineers are designers, which is true?",
    options: [
      "All developers are designers",
      "Some developers may be designers",
      "No developer is a designer",
      "All designers are engineers",
    ],
    correct: 1,
  },
];

export default function AptitudeTest({ onNext, onBack }) {
  const { aptitudeAnswers, setAptitudeAnswers } = useAssessmentStore();
  const [current, setCurrent] = useState(0);

  const q = QUESTIONS[current];
  const selected = aptitudeAnswers[q.id];

  const selectOption = (idx) => {
    setAptitudeAnswers({ [q.id]: idx });
  };

  const isLast = current === QUESTIONS.length - 1;

  const isStepValid = Object.keys(aptitudeAnswers).length === QUESTIONS.length;

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Aptitude Snapshot</h2>
          <p className="text-muted-foreground text-sm">
            Question {current + 1} of {QUESTIONS.length}
          </p>
        </div>

        {/* Question */}
        <p className="font-medium">{q.question}</p>

        {/* Options */}
        <div className="space-y-2">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => selectOption(idx)}
              className={`w-full text-left p-3 rounded border transition ${
                selected === idx
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/40"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={() =>
              current === 0 ? onBack() : setCurrent((c) => c - 1)
            }
          >
            Back
          </Button>

          {!isLast ? (
            <Button
              onClick={() => setCurrent((c) => c + 1)}
              disabled={selected === undefined}
            >
              Next →
            </Button>
          ) : (
            <Button onClick={onNext} disabled={!isStepValid}>
              Continue →
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
