"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { syncAssessmentToBackend } from "@/lib/syncAssessment";

export default function ReviewConfirm({ onBack, onFinish }) {
  const { status } = useSession();
  const { basicDetails, aptitudeAnswers } = useAssessmentStore();

  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async () => {
    if (status !== "authenticated") return;

    try {
      setSubmitting(true);
      
      // Step 1: Sync assessment data to backend
      await syncAssessmentToBackend();
      
      // Step 2: Generate AI results
      const generateRes = await fetch("/api/results/generate", {
        method: "POST",
        credentials: "include",
      });
      
      if (!generateRes.ok) {
        const errorData = await generateRes.json().catch(() => ({}));
        console.error("[ReviewConfirm] Generate error response:", errorData);
        throw new Error(errorData.error || "Failed to generate results");
      }
      
      // Step 3: Navigate to dashboard
      onFinish();
    } catch (error) {
      console.error("[ReviewConfirm] Error:", error.message);
      alert(`Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Review & Confirm</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Please review your details before generating insights
          </p>
        </div>

        {/* Profile */}
        <div>
          <h3 className="font-semibold text-sm">Profile</h3>
          <p className="text-sm text-muted-foreground">
            {basicDetails.name} · {basicDetails.degree} · {basicDetails.year}
          </p>
        </div>

        {/* Role & Goal */}
        <div>
          <h3 className="font-semibold text-sm">Role & Goal</h3>
          <p className="text-sm text-muted-foreground">
            {basicDetails.targetRole} · {basicDetails.goalType} ·{" "}
            {basicDetails.timeline}
          </p>
        </div>

        {/* Skills */}
        <div>
          <h3 className="font-semibold text-sm">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {basicDetails.skills?.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Experience */}
        <div>
          <h3 className="font-semibold text-sm">Experience & Readiness</h3>
          <p className="text-sm text-muted-foreground">
            {basicDetails.projectExperience} ·{" "}
            {basicDetails.interviewExperience} · {basicDetails.weeklyHours} ·{" "}
            {basicDetails.resumeStatus}
          </p>
        </div>

        {/* Aptitude */}
        <div>
          <h3 className="font-semibold text-sm">Aptitude</h3>
          <p className="text-sm text-muted-foreground">
            {Object.keys(aptitudeAnswers || {}).length} questions answered
          </p>
        </div>

        {/* Confirmation */}
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
          />
          <label className="text-sm text-muted-foreground">
            I confirm that the above information is accurate.
          </label>
        </div>

        {/* CTA */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            onClick={handleFinish}
            disabled={!confirmed || submitting || status !== "authenticated"}
          >
            {submitting ? "Saving..." : "Generate Dashboard →"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
