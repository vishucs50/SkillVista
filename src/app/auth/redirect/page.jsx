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
    <div className="h-screen flex items-center justify-center text-zinc-400">
      Preparing your workspace…
    </div>
  );
}
