"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function QuestionCard({ question, number, total, selectedAnswer, onSelectAnswer }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Question {number} of {total}</CardTitle>
          <Badge variant="outline" className="capitalize">
            {question.category?.replace(/_/g, " ")}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-base leading-relaxed">{question.question}</p>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => onSelectAnswer(option)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAnswer === option
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 hover:bg-accent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option
                      ? "border-primary bg-primary"
                      : "border-border"
                  }`}
                >
                  {selectedAnswer === option && (
                    <div className="w-3 h-3 rounded-full bg-white" />
                  )}
                </div>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
