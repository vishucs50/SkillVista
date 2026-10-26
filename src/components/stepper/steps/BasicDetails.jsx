"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import {
  Sparkles,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function BasicDetails({ onNext }) {
  const { basicDetails, setBasicDetails } = useAssessmentStore();
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [extractSuccess, setExtractSuccess] = useState(null);
  const [savedResumes, setSavedResumes] = useState([]);
  const [showSavedSelector, setShowSavedSelector] = useState(false);

  // Fetch saved resumes if user already has any in S3/DB
  useEffect(() => {
    fetch("/api/resumes")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.resumes?.length) {
          setSavedResumes(data.resumes);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBasicDetails({ [name]: value });
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExtracting(true);
    setExtractError("");
    setExtractSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/assessment/extract-resume", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to extract details from resume");
      }

      applyExtractedData(json.data, file.name);
    } catch (err) {
      setExtractError(err.message || "Could not read resume. You can fill details manually.");
    } finally {
      setExtracting(false);
      e.target.value = "";
    }
  };

  const handleSelectSavedResume = async (resumeId, resumeName) => {
    setExtracting(true);
    setExtractError("");
    setExtractSuccess(null);
    setShowSavedSelector(false);

    try {
      const res = await fetch("/api/assessment/extract-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to extract details from saved resume");
      }

      applyExtractedData(json.data, resumeName);
    } catch (err) {
      setExtractError(err.message || "Could not load saved resume.");
    } finally {
      setExtracting(false);
    }
  };

  const applyExtractedData = (data, sourceName) => {
    const updates = {};
    if (data.name) updates.name = data.name;
    if (data.college) updates.college = data.college;
    if (data.degree) updates.degree = data.degree;
    if (data.year) updates.year = data.year;
    if (data.targetRole) updates.targetRole = data.targetRole;
    if (data.skills?.length) updates.skills = data.skills;
    if (data.projectExperience) updates.projectExperience = data.projectExperience;
    if (data.resumeStatus) updates.resumeStatus = data.resumeStatus;

    setBasicDetails(updates);
    setExtractSuccess({
      source: sourceName,
      targetRole: data.targetRole,
      skillsCount: data.skills?.length || 0,
    });
  };

  // Step-level validation
  const isValid = ["name", "college", "degree", "year"].every(
    (key) => basicDetails?.[key],
  );

  return (
    <Card className="border border-border bg-card shadow-lg">
      <CardContent className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Profile Context</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Tell us about yourself, or upload your resume to auto-fill your details instantly.
          </p>
        </div>

        {/* AI Resume Auto-fill Banner */}
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-background p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-primary/20 p-1.5 text-primary">
                  <Sparkles size={18} />
                </div>
                <h3 className="font-semibold text-sm sm:text-base">
                  Fast-Track with Your Resume
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Upload your resume (PDF, DOCX, TXT) and AI will automatically fill your
                name, college, degree, target role, and skills.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <label
                className={`inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition hover:bg-primary/90 cursor-pointer ${
                  extracting ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {extracting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Upload Resume
                  </>
                )}
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                  disabled={extracting}
                  className="hidden"
                />
              </label>

              {savedResumes.length > 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={extracting}
                  onClick={() => setShowSavedSelector(!showSavedSelector)}
                  className="text-xs"
                >
                  <FileText size={14} className="mr-1" />
                  Use Saved Resume ({savedResumes.length})
                </Button>
              )}
            </div>
          </div>

          {/* Saved Resumes Quick Selector */}
          {showSavedSelector && savedResumes.length > 0 && (
            <div className="mt-4 pt-3 border-t border-border/60">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                Select one of your saved resumes:
              </p>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {savedResumes.map((resume) => (
                  <button
                    key={resume._id}
                    type="button"
                    onClick={() => handleSelectSavedResume(resume._id, resume.name)}
                    className="w-full flex items-center justify-between rounded-md border border-border bg-card p-2 text-left text-xs hover:bg-accent transition"
                  >
                    <span className="font-medium truncate mr-2">{resume.name}</span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      Use this &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Extraction Success Notification */}
          {extractSuccess && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-xs sm:text-sm text-green-700 dark:text-green-300">
              <CheckCircle2 size={18} className="shrink-0 mt-0.5 text-green-600 dark:text-green-400" />
              <div>
                <p className="font-semibold">Auto-fill complete!</p>
                <p className="mt-0.5 text-xs text-green-600/90 dark:text-green-300/90">
                  Extracted from <span className="font-medium">{extractSuccess.source}</span>:
                  profile details, target role (
                  <span className="font-medium">{extractSuccess.targetRole}</span>), and{" "}
                  <span className="font-medium">{extractSuccess.skillsCount}</span> technical skills.
                  Review and edit the fields below if needed.
                </p>
              </div>
            </div>
          )}

          {/* Extraction Error Notification */}
          {extractError && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs sm:text-sm text-destructive">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p>{extractError}</p>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4 pt-2">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="name"
              value={basicDetails?.name || ""}
              onChange={handleChange}
              placeholder="e.g. Vishu Jain"
              className="mt-1 w-full rounded-md bg-background border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
              className="mt-1 w-full rounded-md bg-background border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Degree */}
          <div>
            <label className="text-sm font-medium">Degree & Program</label>
            <select
              name="degree"
              value={basicDetails?.degree || ""}
              onChange={handleChange}
              className="mt-1 w-full rounded-md bg-background border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select degree</option>
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
              className="mt-1 w-full rounded-md bg-background border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>Final Year</option>
              <option>Graduated</option>
            </select>
          </div>
        </div>

        {/* CTA */}
        <Button onClick={onNext} className="w-full" disabled={!isValid}>
          Continue →
        </Button>
      </CardContent>
    </Card>
  );
}
