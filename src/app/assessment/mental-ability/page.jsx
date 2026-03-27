"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import QuestionCard from "@/components/mental-ability/QuestionCard";
import ProgressBar from "@/components/mental-ability/ProgressBar";
import ResultSummary from "@/components/mental-ability/ResultSummary";
import Timer from "@/components/mental-ability/Timer";
import { ChevronLeft, ChevronRight, Send, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function MentalAbilityTest() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [improvement, setImprovement] = useState(null);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchQuestions();
    }
  }, [status]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(
        "/api/questions?type=mental_ability&limit=15",
      );
      const data = await response.json();

      if (response.ok) {
        setQuestions(data.questions);
      } else {
        toast.error("Failed to load questions");
      }
    } catch (error) {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentIndex]._id]: answer,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(answers).length;

    if (answeredCount < questions.length) {
      const unanswered = questions.length - answeredCount;
      if (
        !confirm(
          `You have ${unanswered} unanswered question(s). Submit anyway?`,
        )
      ) {
        return;
      }
    }

    setSubmitting(true);

    try {
      const timeTaken = Math.floor((Date.now() - startTime) / 1000);

      const formattedAnswers = questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] || "",
      }));

      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          answers: formattedAnswers,
          timeTaken,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.attempt);
        setImprovement(data.improvement);
        toast.success("Test submitted successfully!");
      } else {
        toast.error(data.error || "Failed to submit test");
      }
    } catch (error) {
      toast.error("Failed to submit test");
    } finally {
      setSubmitting(false);
    }
  };

  // 🔄 Loading
  if (status === "loading" || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // 📊 Result
  if (result) {
    return (
      <div className="h-screen flex items-center justify-center">
        <ResultSummary result={result} improvement={improvement} />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Button onClick={() => router.push("/assessment")}>
          Back to Assessment
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="h-screen flex flex-col max-w-6xl mx-auto px-4">
      {/* 🔝 HEADER */}
      <div className="flex items-center justify-between border-b pb-3 pt-3">
        <div>
          <h1 className="text-xl font-bold">Mental Ability Test</h1>
          <Timer startTime={startTime} />
        </div>

        <Button
          variant="outline"
          onClick={() => router.push("/assessment/hub")}
        >
          Exit
        </Button>
      </div>

      {/* 🧠 MAIN AREA */}
      <div className="flex flex-1 gap-4 overflow-hidden mt-4">
        {/* LEFT - QUESTION */}
        <div className="flex-1 flex flex-col">
          <ProgressBar
            current={currentIndex + 1}
            total={questions.length}
            answered={answeredCount}
          />

          <div className="flex-1 overflow-hidden mt-4">
            <QuestionCard
              question={currentQuestion}
              number={currentIndex + 1}
              total={questions.length}
              selectedAnswer={answers[currentQuestion._id]}
              onSelectAnswer={handleSelectAnswer}
            />
          </div>
        </div>

        {/* RIGHT - NAVIGATOR */}
        <div className="w-52 border rounded-lg p-3 overflow-y-auto">
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, index) => (
              <button
                key={q._id}
                onClick={() => setCurrentIndex(index)}
                className={`aspect-square rounded-lg border-2 text-sm font-medium ${
                  index === currentIndex
                    ? "border-primary bg-primary text-white"
                    : answers[q._id]
                      ? "border-green-500 bg-green-50 text-green-700"
                      : "border-border hover:border-primary/50"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🔻 FOOTER */}
      <div className="flex gap-3 border-t pt-3 pb-3">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex-1"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        {currentIndex < questions.length - 1 ? (
          <Button onClick={handleNext} className="flex-1">
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Test
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
