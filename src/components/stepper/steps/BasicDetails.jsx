"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function BasicDetails({ onNext }) {
  const { basicDetails, setBasicDetails } = useAssessmentStore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicDetails({ [name]: value });
  };

  // ✅ Step-level validation ONLY
  const isValid = ["name", "college", "degree", "year"].every(
    (key) => basicDetails?.[key],
  );

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-8 space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Profile Context</h2>
          <p className="text-muted-foreground text-sm mt-1">
            This helps us understand your academic background
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
          <label className="text-sm font-medium">Degree & Program</label>
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
            <option>Graduated</option> {/* ✅ important */}
          </select>
        </div>

        {/* CTA */}
        <Button onClick={onNext} className="w-full" disabled={!isValid}>
          Continue →
        </Button>
      </CardContent>
    </Card>
  );
}
