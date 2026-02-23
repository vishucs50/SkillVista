"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function RoleGoalAlignment({ onNext, onBack }) {
  const { basicDetails, setBasicDetails } = useAssessmentStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicDetails({ [name]: value });
  };

  const isValid = ["targetRole", "goalType", "timeline"].every(
    (key) => basicDetails?.[key],
  );

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Role & Goal Alignment</h2>
          <p className="text-muted-foreground text-sm mt-1">
            This helps us benchmark your readiness correctly
          </p>
        </div>

        {/* Target Role */}
        <div>
          <label className="text-sm font-medium">Target Role</label>
          <select
            name="targetRole"
            value={basicDetails?.targetRole || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          >
            <option value="">Select</option>
            <option>Software Developer</option>
            <option>Frontend Developer</option>
            <option>Backend Developer</option>
            <option>Data Analyst</option>
            <option>ML Engineer</option>
            <option>UI/UX Designer</option>
          </select>
        </div>

        {/* Goal Type */}
        <div>
          <label className="text-sm font-medium">Primary Goal</label>
          <select
            name="goalType"
            value={basicDetails?.goalType || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          >
            <option value="">Select</option>
            <option>Internship</option>
            <option>Placement</option>
            <option>Both</option>
          </select>
        </div>

        {/* Timeline */}
        <div>
          <label className="text-sm font-medium">Target Timeline</label>
          <select
            name="timeline"
            value={basicDetails?.timeline || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          >
            <option value="">Select</option>
            <option>0–3 months</option>
            <option>3–6 months</option>
            <option>6–12 months</option>
          </select>
        </div>


        {isValid && (
          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm">
            You’ll be assessed for{" "}
            <span className="font-semibold">{basicDetails.targetRole}</span>{" "}
            targeting{" "}
            <span className="font-semibold">{basicDetails.goalType}</span>{" "}
            within{" "}
            <span className="font-semibold">{basicDetails.timeline}</span>.
          </div>
        )}

        {/* CTA */}
        <div className="flex justify-between pt-2">
          {onBack && (
            <Button variant="outline" onClick={onBack}>
              Back
            </Button>
          )}
          <Button onClick={onNext} disabled={!isValid} >
            Next →
          </Button>
          
        </div>
      </CardContent>
    </Card>
  );
}
