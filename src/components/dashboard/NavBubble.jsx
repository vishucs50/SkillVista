"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  ClipboardList,
  TrendingUp,
  Target,
  BookOpen,
  X,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Skill Progress", href: "/skill-progress", icon: TrendingUp },
  { label: "Assessments", href: "/assessments", icon: ClipboardList },
  { label: "Skill Gaps", href: "/skill-gap", icon: Target },
  { label: "Career Fit", href: "/career-fit", icon: BarChart3 },
  { label: "Learning Path", href: "/learning-path", icon: BookOpen },
  { label: "Req Skills", href: "/required-skill", icon: ClipboardList },
];

export default function NavBubble() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const bubbleRef = useRef(null);

  const activeItem =
    navItems.find((item) => pathname.startsWith(item.href)) || navItems[0];

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (bubbleRef.current && !bubbleRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <>
      {/* Background Blur when open */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <div ref={bubbleRef} className="fixed bottom-6 right-6 z-50">
        {/* Expanded Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mb-3 flex flex-col gap-3"
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      router.push(item.href);
                      setOpen(false);
                    }}
                    className={`flex items-center gap-3 px-4 py-2 rounded-full shadow-lg border border-border transition-all
                      ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-foreground hover:bg-muted"
                      }
                    `}
                  >
                    <Icon size={16} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-4 py-3 rounded-full shadow-xl border border-border bg-primary text-primary-foreground hover:scale-105 transition-transform"
        >
          {open ? <X size={18} /> : <activeItem.icon size={18} />}
          <span className="text-sm font-medium">{activeItem.label}</span>
        </button>
      </div>
    </>
  );
}
