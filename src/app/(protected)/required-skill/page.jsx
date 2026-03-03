"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSkillGapStore } from "@/store/useSkillGapStore";
import RequiredSkills from "@/components/skill-gap/RequiredSkills";
import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";

export default function RequiredSkillsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const analysis = useSkillGapStore((s) => s.analysis);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold">No Analysis Found</h2>
          <p className="mt-2 text-muted-foreground">
            Please run skill gap analysis first.
          </p>

          <Button
            className="mt-6 w-full"
            onClick={() => router.push("/skill-gap")}
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <div className="px-6 py-3 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10">
            <ClipboardList className="text-primary" size={22} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">Required Skills</h1>
            <p className="text-sm text-muted-foreground">
              Skills needed for your selected role
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-6">
        <RequiredSkills data={analysis.requiredSkills} />
      </div>
    </div>
  );
}
