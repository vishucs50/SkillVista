"use client";

import { motion } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";


const RadarRing = () => (
  <motion.div
    className="absolute inset-0 rounded-full border border-white/10   bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.6)_100%)]"
    animate={{ scale: [0.85, 1.25], opacity: [0.6, 0] }}
    transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
  />
);

export default function LoginPage() {
  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 overflow-hidden">
      <div className="hidden lg:flex items-center justify-center relative">
        <div
          className="absolute w-115 h-115 rounded-full      bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_70%)]      blur-3xl"
        />

        <div
          className="relative w-80 h-80 flex items-center justify-center"
          style={{ perspective: 1000 }}
        >
          <RadarRing />
          <RadarRing />

          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 w-44 h-44 rounded-full  bg-[radial-gradient(circle_at_30%_30%,#0a0a0a,#000)]  border border-white/10  flex items-center justify-center  shadow-[0_0_80px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(255,255,255,0.05)]"
          >
            <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />

            <span
              className="material-icons text-[150px]! leading-none   bg-[linear-gradient(120deg,#ff0080,#ff8c00,#40e0d0,#7b2ff7,#ff0080)]  bg-size-[300%_300%]  bg-clip-text text-transparent  drop-shadow-[0_0_25px_rgba(0,255,255,0.6)]    animate-[gradientShift_5s_linear_infinite]"
            >
              insights
            </span>
          </motion.div>
        </div>

        <div className="absolute bottom-20 text-center">
          <h1 className="text-4xl font-bold text-white">SkillVista</h1>
          <p className="text-zinc-400 mt-2">
            Assess • Improve • Become Job-Ready
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 z-10">
        <LoginForm />
      </div>
    </div>
  );
}
