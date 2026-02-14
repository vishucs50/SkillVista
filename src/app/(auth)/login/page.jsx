"use client";

import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import { useEffect, useState } from "react";
import Image from "next/image";
/* === SKILL PARTICLE === */
const SkillParticle = ({ label, startX, startY, delay }) => (
  <motion.div
    className="absolute text-xs px-2 py-1 rounded-full bg-zinc-900 border border-cyan-400/40 text-cyan-300"
    initial={{ x: startX, y: startY, opacity: 0 }}
    animate={{ x: 0, y: 0, opacity: 1 }}
    transition={{ delay, duration: 1.5, ease: "easeOut" }}
  >
    {label}
  </motion.div>
);

/* === RADAR RING === */
const RadarRing = () => (
  <motion.div
    className="absolute inset-0 rounded-full border border-cyan-400/30"
    animate={{ scale: [0.9, 1.2], opacity: [0.6, 0] }}
    transition={{ duration: 2.5, repeat: Infinity }}
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

        setTimeout(() => setRotate3D(true), 500); // start 3D spin
        setTimeout(() => setShowLogo(true), 1700); // show logo mid-spin
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
        <div className="absolute w-[420px] h-[420px] rounded-full bg-cyan-500/20 blur-3xl" />

        {/* PERSPECTIVE WRAPPER */}
        <div
          className="relative w-[320px] h-[320px] flex items-center justify-center"
          style={{ perspective: 1000 }}
        >
          <RadarRing />
          <RadarRing />

          <SkillParticle label="HTML" startX={-160} startY={-80} delay={0.2} />
          <SkillParticle label="CSS" startX={-120} startY={120} delay={0.4} />
          <SkillParticle
            label="JavaScript"
            startX={140}
            startY={-100}
            delay={0.6}
          />
          <SkillParticle label="React" startX={160} startY={60} delay={0.8} />
          <SkillParticle label="Node.js" startX={0} startY={-160} delay={1} />

          {/* === TARGET / LOGO (3D ROTATION) === */}
          <motion.div
            className="relative z-10 w-44 h-44 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 shadow-2xl flex items-center justify-center"
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
                  className="text-black font-bold flex flex-col items-center"
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
                  className="flex items-center justify-center absolute inset-0 rounded-full overflow-hidden"
                  style={{ backfaceVisibility: "hidden" }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Image
                    src="/logo.png"
                    alt="SkillVista Logo"
                    fill
                    sizes="176px"
                    className="object-cover"
                    priority
                  />
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
