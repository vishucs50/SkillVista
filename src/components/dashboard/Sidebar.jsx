// components/dashboard/Sidebar.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { useAssessmentStore } from "@/store/useAssessmentStore";
const navItems = [
  { label: "Overview", active: true },
  { label: "Assessments", active: false },
  { label: "Skill Gaps", active: false },
  { label: "Career Fit", active: false },
  { label: "Learning Path", active: false },
];

export default function Sidebar() {
  const basicDetails = useAssessmentStore((s) => s.basicDetails);
  console.log(basicDetails);
  return (
    <aside className="hidden lg:flex w-65 bg-card border-r border-border p-6 flex-col">
      {/* PROFILE CARD */}

      <div className="mb-8">
        <div className="rounded-xl border border-border bg-muted p-4 flex items-center gap-3">
          {/* Profile Image */}
          <div className="relative size-10 rounded-md overflow-hidden border border-border bg-background">
              <Image
                src="/download.jpeg"
                alt="Candidate profile"
                fill
                className="object-cover"
              />
          </div>

          {/* Text */}
          <div>
            <p className="text-xs font-semibold">{basicDetails.name}</p>
          </div>
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
          >
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
