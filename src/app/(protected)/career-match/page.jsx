"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseBusiness, Loader2, Trash2, Upload } from "lucide-react";

export default function CareerMatchPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [storageError, setStorageError] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");

  const loadResumes = async () => {
    const response = await fetch("/api/resumes");
    if (response.ok) {
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { error: await response.text() };
      setResumes(data.resumes || []);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  const uploadResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStorageError("");
    try {
      const prepare = await fetch("/api/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: file.name,
          contentType: file.type,
          size: file.size,
        }),
      });
      const data = await prepare.json();
      if (!prepare.ok) throw new Error(data.error || "Could not prepare upload");

      const upload = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!upload.ok) throw new Error("Could not upload resume to S3");
      await loadResumes();
    } catch (err) {
      setStorageError(err.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const deleteResume = async (id) => {
    const response = await fetch("/api/resumes", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setResumes((current) => current.filter((resume) => resume._id !== id));
    }
  };

  const analyze = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/career-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: selectedResumeId ? "" : resumeText,
          resumeId: selectedResumeId || undefined,
          jobDescription,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Analysis failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-3">
        <div className="rounded-lg bg-primary p-2 text-primary-foreground"><BriefcaseBusiness size={20} /></div>
        <div><h1 className="text-2xl font-bold">Resume & Job Match</h1><p className="text-sm text-muted-foreground">Compare your experience with a target job and find what to improve.</p></div>
      </div>
      <Card className="mb-6"><CardHeader><CardTitle>Saved resumes</CardTitle></CardHeader><CardContent>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
            <Upload size={16} className="mr-2" />
            {uploading ? "Uploading..." : "Upload resume"}
            <input type="file" accept=".pdf,.docx,.txt" onChange={uploadResume} disabled={uploading} className="hidden" />
          </label>
          <span className="text-xs text-muted-foreground">PDF, DOCX, or TXT up to 5 MB. Files are private.</span>
        </div>
        {storageError && <p className="mt-3 text-sm text-destructive">{storageError}</p>}
        {resumes.length > 0 && <div className="mt-4 space-y-2">{resumes.map((resume) => <div key={resume._id} className="flex items-center justify-between rounded-lg border p-3 text-sm"><label className="flex items-center gap-2"><input type="radio" name="selectedResume" checked={selectedResumeId === resume._id} onChange={() => { setSelectedResumeId(resume._id); setResumeText(""); }} />{resume.name}</label><Button variant="ghost" size="icon" onClick={() => deleteResume(resume._id)} aria-label={`Delete ${resume.name}`}><Trash2 size={16} /></Button></div>)}</div>}
      </CardContent></Card>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Your resume</CardTitle></CardHeader><CardContent><textarea value={resumeText} onChange={(e) => { setResumeText(e.target.value); setSelectedResumeId(""); }} disabled={Boolean(selectedResumeId)} className="min-h-72 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary disabled:opacity-50" placeholder={selectedResumeId ? "Using selected saved resume" : "Paste your resume text here..."} /></CardContent></Card>
        <Card><CardHeader><CardTitle>Job description</CardTitle></CardHeader><CardContent><textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="min-h-72 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Paste the job description here..." /></CardContent></Card>
      </div>
      {error && <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
      <Button onClick={analyze} disabled={loading || (!resumeText.trim() && !selectedResumeId) || !jobDescription.trim()} className="mt-6">{loading ? <><Loader2 className="mr-2 animate-spin" size={16} />Analyzing...</> : "Analyze match"}</Button>
      {result && <Card className="mt-8"><CardHeader><CardTitle>{result.matchPercentage}% match</CardTitle></CardHeader><CardContent className="grid gap-6 md:grid-cols-2"><Insight title="Strengths" items={result.strengths} /><Insight title="Missing skills" items={result.missingSkills} /><Insight title="Keywords to add" items={result.keywordsToAdd} /><Insight title="Recommendations" items={result.recommendations} /></CardContent></Card>}
    </div>
  );
}

function Insight({ title, items = [] }) {
  return <div><h3 className="mb-2 font-semibold">{title}</h3><ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}
