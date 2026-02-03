"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function ExperienceReadiness({ onNext, onBack }) {
  const { basicDetails, setBasicDetails } = useAssessmentStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicDetails({ [name]: value });
  };

  const isValid = [
    "projectExperience",
    "interviewExperience",
    "weeklyHours",
    "resumeStatus",
  ].every((key) => basicDetails?.[key]);

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-3">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Experience & Readiness</h2>
          <p className="text-muted-foreground text-sm mt-1">
            This helps us understand how close you are to hiring scenarios
          </p>
        </div>

        {/* Project Experience */}
        <div>
          <label className="text-sm font-medium">Project Experience</label>
          <select
            name="projectExperience"
            value={basicDetails?.projectExperience || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          >
            <option value="">Select</option>
            <option>None yet</option>
            <option>Mini / tutorial projects</option>
            <option>End-to-end projects</option>
          </select>
        </div>

        {/* Interview Exposure */}
        <div>
          <label className="text-sm font-medium">Interview Experience</label>
          <select
            name="interviewExperience"
            value={basicDetails?.interviewExperience || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          >
            <option value="">Select</option>
            <option>0 interviews</option>
            <option>1–3 interviews</option>
            <option>4+ interviews</option>
          </select>
        </div>

        {/* Weekly Hours */}
        <div>
          <label className="text-sm font-medium">Weekly Time Commitment</label>
          <select
            name="weeklyHours"
            value={basicDetails?.weeklyHours || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          >
            <option value="">Select</option>
            <option>5–7 hours</option>
            <option>8–12 hours</option>
            <option>13–20 hours</option>
            <option>20+ hours</option>
          </select>
        </div>

        {/* Resume Status */}
        <div>
          <label className="text-sm font-medium">Resume Status</label>
          <select
            name="resumeStatus"
            value={basicDetails?.resumeStatus || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          >
            <option value="">Select</option>
            <option>No resume yet</option>
            <option>Basic resume</option>
            <option>ATS-ready resume</option>
          </select>
        </div>

        {/* CTA */}
        <div className="flex justify-between pt-4">
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
