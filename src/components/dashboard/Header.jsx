"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit2, LogOut, Settings } from "lucide-react";
import { signOut } from "next-auth/react";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import ProfileEditForm from "./ProfileEditForm";

export default function Header() {
  const basicDetails = useAssessmentStore((s) => s.basicDetails);
  const [showEditForm, setShowEditForm] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <>
      <ProfileEditForm
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
      />

      <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
        {/* LEFT - Logo / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg  bg-[radial-gradient(circle_at_30%_30%,#1a1a1a,#000)]  border border-white/10  flex items-center justify-center  shadow-[0_0_12px_rgba(0,0,0,0.6)]  transition-all duration-300">
            <span className="material-icons text-[22px] leading-none  bg-[linear-gradient(120deg,#ff0080,#ff8c00,#40e0d0,#7b2ff7)]  bg-clip-text text-transparent">
              insights
            </span>
          </div>
          <h1 className="text-sm font-semibold tracking-wide">
            SkillVista
          </h1>
        </div>

        {/* RIGHT - Profile */}
        <div className="relative">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-border">
              <Image
                src={basicDetails?.profileImage || "/download.jpeg"}
                alt="Profile"
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-medium">
                {basicDetails?.name || "User"}
              </p>
            </div>
          </div>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-3 w-48 rounded-xl border border-border bg-card shadow-lg p-2 space-y-1 z-100">
              <button
                onClick={() => {
                  setShowEditForm(true);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm"
              >
                <Edit2 size={14} />
                Edit Profile
              </button>

              

              <button
                onClick={() => signOut()}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted text-sm text-red-500"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
