"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import useResultStore from "@/store/useResultStore";

export default function NextBestAction() {
  const nextBestActions = useResultStore((state) => state.nextBestActions);

  const actions =
    nextBestActions && nextBestActions.length > 0
      ? nextBestActions
      : [
          "Continue strengthening your skills and experience to boost your employability.",
        ];

  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  // AUTO SLIDE EVERY 5s
  useEffect(() => {
    if (actions.length <= 1) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % actions.length);
    }, 5000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [actions.length]);

  // DOT CLICK
  const goToIndex = (i) => {
    setIndex(i);
  };

  return (
    <Card className="border-primary/30 bg-primary/5 min-h-37.5 overflow-hidden">
      <CardContent className="flex flex-col h-full">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">
            Next Best Action
          </p>

          <div className="text-sm leading-relaxed text-muted-foreground line-clamp-3 overflow-hidden transition-all duration-500">
            <span className="font-semibold text-primary mr-2">
              {index + 1}.
            </span>
            {actions[index]}
          </div>
        </div>

        {/* CLICKABLE DOTS */}
        <div className="flex justify-center gap-1 mt-auto pt-3">
          {actions.map((_, i) => (
            <span
              key={i}
              onClick={() => goToIndex(i)}
              className={`h-1.5 w-1.5 rounded-full cursor-pointer transition-all duration-300 ${
                i === index ? "bg-primary w-4" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
