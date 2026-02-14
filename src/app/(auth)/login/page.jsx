"use client";

import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import { useEffect, useState } from "react";

/* === SKILL PARTICLE === */
const SkillParticle = ({ label, startX, startY, delay, hide }) => (
  <motion.div
    className="absolute text-xs px-2 py-1 rounded-full  bg-zinc-900/80 border border-white/10 text-zinc-300 backdrop-blur-md"
    initial={{ x: startX, y: startY, opacity: 0 }}
    animate={{
      x: 0,
      y: 0,
      opacity: hide ? 0 : 1,
      scale: hide ? 0.5 : 1,
    }}
    transition={{ delay, duration: 1.5, ease: "easeOut" }}
  >
    {label}
  </motion.div>
);

/* === DARK PREMIUM RADAR RING === */
const RadarRing = () => (
  <motion.div
    className="absolute inset-0 rounded-full border border-white/10 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.6)_100%)]"
    animate={{ scale: [0.85, 1.25], opacity: [0.6, 0] }}
    transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut" }}
  />
);

export default function LoginPage() {
  const [progress, setProgress] = useState(0);
  const [rotate3D, setRotate3D] = useState(false);
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    let p = 0;
    const interval = setInterval(() => {
      p += 1;
      if (p > 82) {
        clearInterval(interval);

        setTimeout(() => setRotate3D(true), 500);
        setTimeout(() => setShowLogo(true), 1700);
        return;
      }
      setProgress(p);
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 overflow-hidden">
      {/* ===== LEFT VISUAL ===== */}
      <div className="hidden lg:flex items-center justify-center relative">
        {/* Premium background glow */}
        <div className="absolute w-115 h-115 rounded-full  bg-[radial-gradient(circle,rgba(99,102,241,0.18),transparent_70%)]  blur-3xl" />

        {/* PERSPECTIVE WRAPPER */}
        <div
          className="relative w-80 h-80 flex items-center justify-center"
          style={{ perspective: 1000 }}
        >
          <RadarRing />
          <RadarRing />

          {/* Skill particles collapse + hide */}
          <SkillParticle
            label="HTML"
            startX={-160}
            startY={-80}
            delay={0.2}
            hide={showLogo}
          />
          <SkillParticle
            label="CSS"
            startX={-120}
            startY={120}
            delay={0.4}
            hide={showLogo}
          />
          <SkillParticle
            label="JavaScript"
            startX={140}
            startY={-100}
            delay={0.6}
            hide={showLogo}
          />
          <SkillParticle
            label="React"
            startX={160}
            startY={60}
            delay={0.8}
            hide={showLogo}
          />
          <SkillParticle
            label="Node.js"
            startX={0}
            startY={-160}
            delay={1}
            hide={showLogo}
          />

          {/* === CORE (3D ROTATION) === */}
          <motion.div
            className="relative z-10 w-44 h-44 rounded-full  bg-[radial-gradient(circle_at_30%_30%,#0a0a0a,#000)]  shadow-[0_0_80px_rgba(0,0,0,0.9),inset_0_0_30px_rgba(255,255,255,0.05)]    border border-white/10       flex items-center justify-center"
            style={{ transformStyle: "preserve-3d" }}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              rotateY: rotate3D ? 360 : 0,
            }}
            transition={{
              scale: { delay: 1.2, type: "spring" },
              rotateY: { duration: 1.2, ease: "easeInOut" },
            }}
          >
            <AnimatePresence mode="wait">
              {!showLogo ? (
                <motion.div
                  key="target"
                  className="text-white font-bold flex flex-col items-center"
                  style={{ backfaceVisibility: "hidden" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="text-sm tracking-wide">TARGET ROLE</span>
                  <span className="text-lg">Frontend Dev</span>
                  <span className="text-2xl mt-1">{progress}%</span>
                  <span className="text-xs font-medium">Job Ready</span>
                </motion.div>
              ) : (
                <motion.div
                  key="logo"
                  className="absolute inset-0 flex items-center justify-center rounded-full"
                  style={{ backfaceVisibility: "hidden" }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Glow layer */}
                  <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />

                  {/* Rainbow Insights Icon */}
                  <span className="material-icons text-[150px]! leading-none  bg-[linear-gradient(120deg,#ff0080,#ff8c00,#40e0d0,#7b2ff7,#ff0080)]  bg-size-[300%_300%]  bg-clip-text text-transparent  drop-shadow-[0_0_25px_rgba(0,255,255,0.6)]  animate-[gradientShift_5s_linear_infinite]">
                    insights
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="absolute bottom-20 text-center"
        >
          <h1 className="text-4xl font-bold text-white">SkillVista</h1>
          <p className="text-zinc-400 mt-2">
            Assess • Improve • Become Job-Ready
          </p>
        </motion.div>
      </div>

      {/* ===== RIGHT LOGIN ===== */}
      <div className="flex items-center justify-center px-6 z-10">
        <LoginForm />
      </div>
    </div>
  );
}
