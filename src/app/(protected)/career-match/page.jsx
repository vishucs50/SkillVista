"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BriefcaseBusiness, Loader2 } from "lucide-react";

export default function CareerMatchPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/career-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText, jobDescription }),
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
      <div className="grid gap-6 lg:grid-cols-2">
        <Card><CardHeader><CardTitle>Your resume</CardTitle></CardHeader><CardContent><textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} className="min-h-72 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Paste your resume text here..." /></CardContent></Card>
        <Card><CardHeader><CardTitle>Job description</CardTitle></CardHeader><CardContent><textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} className="min-h-72 w-full rounded-lg border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Paste the job description here..." /></CardContent></Card>
      </div>
      {error && <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
      <Button onClick={analyze} disabled={loading || !resumeText.trim() || !jobDescription.trim()} className="mt-6">{loading ? <><Loader2 className="mr-2 animate-spin" size={16} />Analyzing...</> : "Analyze match"}</Button>
      {result && <Card className="mt-8"><CardHeader><CardTitle>{result.matchPercentage}% match</CardTitle></CardHeader><CardContent className="grid gap-6 md:grid-cols-2"><Insight title="Strengths" items={result.strengths} /><Insight title="Missing skills" items={result.missingSkills} /><Insight title="Keywords to add" items={result.keywordsToAdd} /><Insight title="Recommendations" items={result.recommendations} /></CardContent></Card>}
    </div>
  );
}

function Insight({ title, items = [] }) {
  return <div><h3 className="mb-2 font-semibold">{title}</h3><ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">{items.map((item) => <li key={item}>{item}</li>)}</ul></div>;
}
