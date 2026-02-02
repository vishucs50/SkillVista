"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useState } from "react";
export default function BasicDetails({ onNext }) {
  const { basicDetails, setBasicDetails, addSkill, removeSkill } =
    useAssessmentStore();
  const [skillInput, setSkillInput] = useState("");
  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;

    if (!basicDetails.skills?.includes(trimmed)) {
      addSkill(trimmed);
    }

    setSkillInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicDetails({ [name]: value });
  };

  const isValid =
    [
      "name",
      "college",
      "degree",
      "year",
      "targetRole",
      "goalType",
      "timeline",
      "weeklyHours",
    ].every((key) => basicDetails?.[key]) && basicDetails?.skills?.length > 0;


  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Student Profile</h2>
          <p className="text-muted-foreground text-sm mt-1">
            This helps us assess your placement & internship readiness
          </p>
        </div>

        {/* Full Name */}
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input
            name="name"
            value={basicDetails?.name || ""}
            onChange={handleChange}
            placeholder="e.g. Vishu Jain"
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          />
        </div>

        {/* College */}
        <div>
          <label className="text-sm font-medium">College / University</label>
          <input
            name="college"
            value={basicDetails?.college || ""}
            onChange={handleChange}
            placeholder="e.g. ABC Institute of Technology"
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          />
        </div>

        {/* Degree */}
        <div>
          <label className="text-sm font-medium">Degree & Branch</label>
          <select
            name="degree"
            value={basicDetails?.degree || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          >
            <option value="">Select</option>
            <option>B.Tech / B.E</option>
            <option>BCA</option>
            <option>MCA</option>
            <option>B.Sc (CS / IT)</option>
            <option>M.Tech</option>
            <option>Other</option>
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="text-sm font-medium">Current Year of Study</label>
          <select
            name="year"
            value={basicDetails?.year || ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-md bg-background border border-border p-3"
          >
            <option value="">Select</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>Final Year</option>
          </select>
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
          </select>
        </div>
        {/* Skills */}
        <div>
          <label className="text-sm font-medium">Skills You Already Know</label>

          <div className="mt-2 flex flex-wrap gap-2">
            {basicDetails?.skills?.map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-primary hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="mt-3 flex gap-2">
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

          <p className="mt-1 text-xs text-muted-foreground">
            Example: HTML, CSS, JavaScript, SQL, Python, DSA
          </p>
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

        {/* Weekly Hours */}
        <div>
          <label className="text-sm font-medium">
            Weekly Hours You Can Commit
          </label>
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

        {/* CTA */}
        <Button onClick={onNext} className="w-full" disabled={!isValid}>
          Start Employability Assessment →
        </Button>
      </CardContent>
    </Card>
  );
}
