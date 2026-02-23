"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") return;

    if (session.user.hasAssessment) {
      router.replace("/dashboard");
    } else {
      router.replace("/assessment");
    }
  }, [status, session, router]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <div className="sea-green-gradient size-10 animate-spin rounded-lg" />
        <p className="text-sm text-muted-foreground">Preparing your workspace…</p>
      </div>
    </div>
  );
}
