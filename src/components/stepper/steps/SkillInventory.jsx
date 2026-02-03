"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function SkillInventory({ onNext, onBack }) {
  const { basicDetails, addSkill, removeSkill } = useAssessmentStore();

  const [skillInput, setSkillInput] = useState("");

  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (!skill) return;

    addSkill(skill);
    setSkillInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const isValid = basicDetails?.skills?.length > 0;

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Skill Inventory</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Add the skills you already know. Don’t worry about being perfect.
          </p>
        </div>

        {/* Skill bubbles */}
        {basicDetails?.skills?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {basicDetails.skills.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-1 hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a skill and press Enter"
            className="flex-1 rounded-md bg-background border border-border p-3 text-sm"
          />
          <Button type="button" variant="secondary" onClick={handleAddSkill}>
            Add
          </Button>
        </div>

        {/* Helper text */}
        <p className="text-xs text-muted-foreground">
          Examples: HTML, CSS, JavaScript, React, SQL, Python, DSA
        </p>

        {/* CTA */}
        <div className="flex justify-between pt-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button onClick={onNext} disabled={!isValid} >
            Continue →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
