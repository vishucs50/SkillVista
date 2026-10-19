"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { skillCatalog, skillTierDescriptions } from "@/lib/skillCatalog";

export default function SkillInventory({ onNext, onBack }) {
  const { basicDetails, addSkill, removeSkill } = useAssessmentStore();

  const isValid = basicDetails?.skills?.length > 0;
  const tiers = skillCatalog[basicDetails?.targetRole] || {};

  const toggleSkill = (skill) => {
    if (basicDetails.skills?.includes(skill)) {
      removeSkill(skill);
    } else {
      addSkill(skill);
    }
  };

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="space-y-4 p-4 sm:p-6">
        <div>
          <h2 className="text-xl font-bold sm:text-2xl">Skill Inventory</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Select the skills you already know for your selected profession.
          </p>
        </div>

        {basicDetails?.skills?.length > 0 && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium">Selected skills</p>
              <span className="text-xs text-muted-foreground">
                {basicDetails.skills.length} selected
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {basicDetails.skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-medium text-primary hover:bg-destructive/10 hover:text-destructive"
                  title={`Remove ${skill}`}
                >
                  {skill} ×
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-3 md:grid-cols-3">
          {Object.entries(tiers).map(([tier, skills]) => (
            <section key={tier} className="rounded-xl border border-border p-3">
              <div className="mb-2">
                <h3 className="text-sm font-semibold">{tier}</h3>
                <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                  {skillTierDescriptions[tier]}
                </p>
              </div>
              <div className="grid gap-1.5">
                {skills.map((skill) => {
                  const selected = basicDetails.skills?.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggleSkill(skill)}
                      className={`flex min-h-9 items-center justify-between rounded-md border px-2.5 py-2 text-left text-xs transition-colors ${
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-background hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <span>{skill}</span>
                      {selected && <Check className="size-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="flex justify-between pt-1">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button onClick={onNext} disabled={!isValid}>
            Continue →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
