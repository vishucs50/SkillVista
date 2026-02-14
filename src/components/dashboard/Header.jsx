import LogoutButton from "@/components/auth/LogoutButton";

export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between border-b border-border bg-card px-8 sticky top-0 z-50">
      {/* LEFT */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-3 cursor-pointer select-none">
          {/* Premium Icon Container */}
          <div
            className="w-9 h-9 rounded-lg
            bg-[radial-gradient(circle_at_30%_30%,#1a1a1a,#000)]
            border border-white/10
            flex items-center justify-center
            shadow-[0_0_12px_rgba(0,0,0,0.6)]
            transition-all duration-300"
          >
            <span
              className="material-icons text-[22px] leading-none
              bg-[linear-gradient(120deg,#ff0080,#ff8c00,#40e0d0,#7b2ff7)]
              bg-clip-text text-transparent"
            >
              insights
            </span>
          </div>

          {/* Brand Name */}
          <h1 className="text-xl font-semibold tracking-tight text-white/90">
            SkillVista
          </h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 cursor-pointer">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
