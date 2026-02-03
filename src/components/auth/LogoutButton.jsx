"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useAssessmentStore } from "@/store/useAssessmentStore";
export default function LogoutButton() {
  const resetAll = useAssessmentStore((s) => s.resetAll);
  const handleLogout = async () => {
    resetAll();

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
