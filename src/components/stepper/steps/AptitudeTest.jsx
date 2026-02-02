"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import useResultStore from "@/store/useResultStore";

const QUESTIONS = [
  {
    id: 1,
    question:
      "If a project takes 10 days and is delayed by 20%, how many days will it take?",
    options: ["10 days", "11 days", "12 days", "14 days"],
    correct: 2,
  },
  {
    id: 2,
    question: "A train travels 60 km in 1.5 hours. What is its average speed?",
    options: ["30 km/h", "35 km/h", "40 km/h", "45 km/h"],
    correct: 2,
  },
  {
    id: 3,
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

export default function AptitudeTest({ onBack }) {
  const router = useRouter();

  const { setAptitudeAnswers } = useAssessmentStore();
  const setResult = useResultStore((state) => state.setResult);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const q = QUESTIONS[current];

  const selectOption = (idx) => {
    setAnswers({ ...answers, [q.id]: idx });
  };

  const calculateResult = () => {
    let correct = 0;

    QUESTIONS.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correct++;
      }
    });

    const scorePercent = Math.round((correct / QUESTIONS.length) * 100);

    return {
      aptitude: {
        score: scorePercent,
        correct,
        attempted: Object.keys(answers).length,
        total: QUESTIONS.length,
      },
      completedAt: new Date().toISOString(),
    };
  };

  const next = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      // ✅ Save raw answers
      setAptitudeAnswers(answers);

      // ✅ Calculate & store result
      const result = calculateResult();
      setResult(result);
      console.log(result);
      // 🚀 Go to dashboard
      router.replace("/dashboard");
    }
  };

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Aptitude Assessment</h2>
          <p className="text-muted-foreground text-sm">
            Question {current + 1} of {QUESTIONS.length}
          </p>
        </div>

        <p className="font-medium">{q.question}</p>

        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => selectOption(idx)}
            className={`w-full text-left p-3 rounded border transition ${
              answers[q.id] === idx
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/40"
            }`}
          >
            {opt}
          </button>
        ))}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>

          <Button onClick={next} disabled={answers[q.id] === undefined}>
            {current === QUESTIONS.length - 1 ? "Finish Assessment" : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
