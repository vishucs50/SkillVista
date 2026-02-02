// components/dashboard/Sidebar.tsx
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { label: "Overview", active: true },
  { label: "Assessments", active: false },
  { label: "Skill Gaps", active: false },
  { label: "Career Fit", active: false },
  { label: "Learning Path", active: false },
];

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex w-65 bg-card border-r border-border p-6 flex-col">
      {/* PROFILE CARD */}
      <div className="mb-8">
        <div className="rounded-xl border border-border bg-muted p-4 flex items-center gap-3">
          <div className="size-10 rounded-md bg-background border border-border" />
          <div>
            <p className="text-xs font-semibold">Candidate Profile</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Employability Level 2
            </p>
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
