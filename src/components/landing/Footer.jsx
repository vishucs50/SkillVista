export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-gray-bg-base">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center justify-center text-center">

        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-lg  bg-[linear-gradient(135deg,#0a0a0a,#111)]  border border-white/10   flex items-center justify-center shadow-[0_0_12px_rgba(0,0,0,0.6)]    group-hover:shadow-[0_0_18px_rgba(99,102,241,0.4)]    transition-all duration-300">
            <span className="material-icons text-[22px] leading-none      bg-[linear-gradient(120deg,#ff0080,#ff8c00,#40e0d0,#7b2ff7)]      bg-clip-text text-transparent">
              insights
            </span>
          </div>

          <span className="text-lg font-semibold tracking-tight text-off-white">
            SkillVista
          </span>
        </div>

        <p className="text-slate-muted text-sm max-w-md">
          AI-powered career intelligence built for the future workforce.
        </p>

        <p className="mt-6 text-[11px] tracking-widest uppercase text-slate-600">
          © 2026 SkillVista Inc.
        </p>
      </div>
    </footer>
  );
}
    