"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function RevealOnScroll({
  children,
  delay = 0,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-80px", // reveal slightly before visible
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
