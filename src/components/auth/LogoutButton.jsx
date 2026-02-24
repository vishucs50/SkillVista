"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import { useSkillGapStore } from "@/store/useSkillGapStore";
import useResultStore from "@/store/useResultStore";

export default function LogoutButton() {
  const resetAll = useAssessmentStore((s) => s.resetAll);
  const clearAnalysis = useSkillGapStore((s) => s.clearAnalysis);
  const resetResults = useResultStore((s) => s.resetResults);

  const handleLogout = async () => {
    // ✅ Clear all user data from Zustand stores
    resetAll();
    clearAnalysis();
    resetResults();

    await signOut({
      callbackUrl: "/login",
    });
  };

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="outline"
        className="border-red-500/40 text-red-400 hover:bg-red-500/10"
        onClick={handleLogout}
      >
        Logout
      </Button>
    </motion.div>
  );
}
