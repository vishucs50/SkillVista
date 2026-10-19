"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import {
  assessmentQuestionVersion,
  getQuestionsForRole,
} from "@/lib/assessmentQuestions";

function stableShuffle(questions, seed) {
  return [...questions].sort((a, b) => {
    const score = (id) =>
      [...`${seed}:${id}`].reduce(
        (total, character) => (total * 31 + character.charCodeAt(0)) % 1000003,
        7,
      );
    return score(a.id) - score(b.id);
  });
}

export default function AptitudeTest({ onNext, onBack }) {
  const {
    basicDetails,
    aptitudeAnswers,
    aptitudeQuestionIds,
    aptitudeQuestionVersion,
    setAptitudeAnswers,
    setAptitudeQuestionSet,
  } = useAssessmentStore();
  const availableQuestions = useMemo(
    () => getQuestionsForRole(basicDetails?.targetRole),
    [basicDetails?.targetRole],
  );
  const [current, setCurrent] = useState(0);
  const randomizedQuestions = useMemo(
    () => stableShuffle(availableQuestions, basicDetails?.targetRole || "default"),
    [availableQuestions, basicDetails?.targetRole],
  );
  const questions = useMemo(() => {
    if (
      aptitudeQuestionVersion !== assessmentQuestionVersion ||
      !aptitudeQuestionIds.length
    ) {
      return randomizedQuestions;
    }

    const questionMap = new Map(
      availableQuestions.map((question) => [question.id, question]),
    );
    const savedQuestions = aptitudeQuestionIds
      .map((id) => questionMap.get(id))
      .filter(Boolean);
    return savedQuestions.length === aptitudeQuestionIds.length
      ? savedQuestions
      : randomizedQuestions;
  }, [
    aptitudeQuestionIds,
    aptitudeQuestionVersion,
    availableQuestions,
    randomizedQuestions,
  ]);

  useEffect(() => {
    const savedIds =
      aptitudeQuestionVersion === assessmentQuestionVersion
        ? aptitudeQuestionIds
        : [];
    if (!savedIds.length || questions.length !== savedIds.length) {
      setAptitudeQuestionSet(
        questions.map((question) => question.id),
        assessmentQuestionVersion,
      );
    }
  }, [
    aptitudeQuestionIds,
    aptitudeQuestionVersion,
    questions,
    setAptitudeQuestionSet,
  ]);

  const q = questions[current];
  if (!q) return null;

  const selected = aptitudeAnswers[q.id];
  const selectOption = (idx) => setAptitudeAnswers({ [q.id]: idx });
  const isLast = current === questions.length - 1;
  const isStepValid = questions.every(
    (question) => aptitudeAnswers[question.id] !== undefined,
  );

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Aptitude Snapshot</h2>
          <p className="text-muted-foreground text-sm">
            {q.category} · {q.difficulty} · Question {current + 1} of{" "}
            {questions.length}
          </p>
        </div>

        <p className="font-medium">{q.question}</p>

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
