  "use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useStudentStore from "@/store/useStudentStore";
import { getSkillQuestions } from "@/data/skillAssessmentConfig";

export default function SkillAssessment({ onNext, onBack }) {
  const basicDetails = useStudentStore((state) => state.basicDetails);
  const questions = getSkillQuestions(basicDetails);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  if (!basicDetails) {
    return (
      <Card className="border border-border bg-card shadow-lg">
        <CardContent className="p-8">
          <p className="text-muted-foreground text-center">
            Loading your profile...
          </p>
        </CardContent>
      </Card>
    );
  }
  const q = questions[current];

  const selectOption = (idx) => {
    setAnswers({ ...answers, [q.id]: idx });
  };

  const next = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      onNext({ skillAnswers: answers });
    }
  };

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-6">
        <h2 className="text-2xl font-bold">Skill Assessment</h2>

        <p className="text-muted-foreground text-sm">Based on your profile</p>

        <p className="font-medium">{q.question}</p>

        {q.options.map((opt, idx) => (
          <button
            key={idx}
            onClick={() => selectOption(idx)}
            className={`w-full text-left p-3 rounded border ${
              answers[q.id] === idx
                ? "border-primary bg-primary/10"
                : "border-border"
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
            {current === questions.length - 1
              ? "Finish Skill Assessment"
              : "Next"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
