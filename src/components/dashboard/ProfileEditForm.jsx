"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { X, Upload } from "lucide-react";
import { syncAssessmentToBackend } from "@/lib/syncAssessment";
import Image from "next/image";
import useResultStore from "@/store/useResultStore";
export default function ProfileEditForm({ isOpen, onClose }) {
  const basicDetails = useAssessmentStore((s) => s.basicDetails);
  const setBasicDetails = useAssessmentStore((s) => s.setBasicDetails);
  const setResults = useResultStore((s) => s.setResults);
  const [formData, setFormData] = useState(basicDetails);
  const [profileImage, setProfileImage] = useState(
    basicDetails.profileImage || null,
  );
  const [imagePreview, setImagePreview] = useState(
    basicDetails.profileImage || "/download.jpeg",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const updatedData = {
        ...formData,
        profileImage: profileImage,
      };

      setBasicDetails(updatedData);
      await syncAssessmentToBackend();
      const resultsRes = await fetch("/api/results/generate", {
        method: "POST",
        credentials: "include",
      });

      if (resultsRes.ok) {
        const resultsData = await resultsRes.json();
        setResults(resultsData);
      }

      // Refetch assessment data
      const res = await fetch("/api/assessment/me", {
        method:"POST",
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.assessment?.basicDetails) {
          setBasicDetails(data.assessment.basicDetails);
        }
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="flex flex-row items-center justify-between  bg-card border-b ">
            <CardTitle >Edit Your Profile</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X size={20} />
            </Button>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {saveSuccess && (
              <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
                ✓ Profile updated successfully!
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-4">
                Profile Picture
              </label>
              <div className="flex gap-4 items-start">
                <div className="relative w-24 h-24 rounded-lg border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center">
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Profile preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <Upload size={32} className="text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <input
                    type="file"
                    id="profileImageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("profileImageInput").click()
                    }
                    className="w-full"
                  >
                    <Upload size={16} className="mr-2" />
                    Choose Image
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 5MB.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4" />

            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                College / University
              </label>
              <input
                type="text"
                name="college"
                value={formData.college || ""}
                onChange={handleChange}
                placeholder="Enter your institution name"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Degree & Program
              </label>
              <select
                name="degree"
                value={formData.degree || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
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

            <div>
              <label className="block text-sm font-semibold mb-2">
                Current Year of Study
              </label>
              <select
                name="year"
                value={formData.year || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select year</option>
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>Final Year</option>
                <option>Graduated</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Target Role
              </label>
              <input
                type="text"
                name="targetRole"
                value={formData.targetRole || ""}
                onChange={handleChange}
                placeholder="e.g., Software Engineer, Product Manager"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Career Goal
              </label>
              <select
                name="goalType"
                value={formData.goalType || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select goal</option>
                <option>Internship</option>
                <option>Full-time Job</option>
                <option>Skill Enhancement</option>
                <option>Career Switch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Target Timeline
              </label>
              <select
                name="timeline"
                value={formData.timeline || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select timeline</option>
                <option>0–3 months</option>
                <option>3–6 months</option>
                <option>6–12 months</option>
                <option>12+ months</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Weekly Learning Hours
              </label>
              <select
                name="weeklyHours"
                value={formData.weeklyHours || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select hours</option>
                <option>5–7 hours</option>
                <option>8–10 hours</option>
                <option>11–15 hours</option>
                <option>15+ hours</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Project Experience
              </label>
              <select
                name="projectExperience"
                value={formData.projectExperience || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select experience</option>
                <option>No projects</option>
                <option>1–2 small projects</option>
                <option>3–5 medium projects</option>
                <option>End-to-end projects</option>  
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Interview Experience
              </label>
              <select
                name="interviewExperience"
                value={formData.interviewExperience || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select experience</option>
                <option>0 interviews</option>
                <option>1–3 interviews</option>
                <option>4–6 interviews</option>
                <option>7+ interviews</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Resume Status
              </label>
              <select
                name="resumeStatus"
                value={formData.resumeStatus || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select status</option>
                <option>No resume</option>
                <option>Basic resume</option>
                <option>Professional resume</option>
                <option>ATS-ready resume</option>
              </select>
            </div>

            <div className="flex gap-3 pt-6 border-t">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
