// components/dashboard/Sidebar.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Edit2 } from "lucide-react";
import { useAssessmentStore } from "@/store/useAssessmentStore";
import ProfileEditForm from "./ProfileEditForm";

const navItems = [
  { label: "Overview", active: true },
  { label: "Assessments", active: false },
  { label: "Skill Gaps", active: false },
  { label: "Career Fit", active: false },
  { label: "Learning Path", active: false },
];

export default function Sidebar({ isOpen = true, onClose = () => {} }) {
  const basicDetails = useAssessmentStore((s) => s.basicDetails);
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <>
      <ProfileEditForm isOpen={showEditForm} onClose={() => setShowEditForm(false)} />

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-card border-r border-border p-6 flex flex-col z-50 transform transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:transform-none lg:w-64 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* PROFILE CARD */}
        <div className="mb-8">
          <div className="rounded-xl border border-border bg-muted p-4 flex items-center gap-3 group cursor-pointer hover:bg-muted/80 transition-colors relative">
            {/* Profile Image */}
            <div className="relative size-10 rounded-md overflow-hidden border border-border bg-background shrink-0">

              <Image
                key={basicDetails.profileImage}
                src={basicDetails.profileImage || "/download.jpeg"}
                alt="Candidate profile"
                fill
                className="object-cover"
              />
            </div>
            {/* Text */}
            <div className="flex-1">
              <p className="text-xs font-semibold">{basicDetails.name || "User Profile"}</p>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setShowEditForm(true)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md hover:bg-background/50"
              title="Edit profile"
            >
              <Edit2 size={16} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* NAV */}
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
          Core Navigation
        </p>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={item.active ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={onClose}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </aside>
    </>
  );
}
