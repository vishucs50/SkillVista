"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BrainCircuit, Loader2 } from "lucide-react";
import { useAssessmentStore } from "@/store/useAssessmentStore";

export default function InterviewPrepPage() {
  const { basicDetails } = useAssessmentStore();
  const [role, setRole] = useState(basicDetails?.targetRole || "");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/interview/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, skills: basicDetails?.skills }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Generation failed");
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-8">
      <div className="mb-8 flex items-center gap-3"><div className="rounded-lg bg-primary p-2 text-primary-foreground"><BrainCircuit size={20} /></div><div><h1 className="text-2xl font-bold">Interview Preparation</h1><p className="text-sm text-muted-foreground">Practice role-specific questions based on your current profile.</p></div></div>
      <Card><CardContent className="flex flex-col gap-4 p-6 sm:flex-row"><input value={role} onChange={(e) => setRole(e.target.value)} className="h-10 flex-1 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary" placeholder="Target role, e.g. Frontend Developer" /><Button onClick={generate} disabled={loading || !role.trim()}>{loading ? <><Loader2 className="mr-2 animate-spin" size={16} />Generating...</> : "Generate practice set"}</Button></CardContent></Card>
      {error && <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
      {result && <div className="mt-8 space-y-6"><Card><CardHeader><CardTitle>Practice questions</CardTitle></CardHeader><CardContent className="space-y-4">{result.questions?.map((item, index) => <details key={item.question} className="rounded-lg border p-4"><summary className="cursor-pointer font-medium">{index + 1}. {item.question}</summary><p className="mt-3 text-xs font-semibold uppercase text-primary">{item.category}</p><ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">{item.whatToCover?.map((point) => <li key={point}>{point}</li>)}</ul></details>)}</CardContent></Card><div className="grid gap-6 md:grid-cols-2"><ListCard title="Interview tips" items={result.tips} /><ListCard title="Mock interview plan" items={result.mockPlan} /></div></div>}
    </div>
  );
}

function ListCard({ title, items = [] }) {
  return <Card><CardHeader><CardTitle className="text-lg">{title}</CardTitle></CardHeader><CardContent><ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">{items.map((item) => <li key={item}>{item}</li>)}</ul></CardContent></Card>;
}
