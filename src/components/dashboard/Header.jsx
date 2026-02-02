
export default function Header() {
  return (
    <header className="h-16 flex items-center justify-between border-b border-border bg-card px-8 sticky top-0 z-50">
      {/* LEFT */}
      <div className="flex items-center gap-10">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-md bg-primary" />
          <h1 className="text-xl font-semibold tracking-tight">SkillVista</h1>
        </div>

        <div className="relative hidden md:block w-72">
          <input
            placeholder="Search insights, skills, roles…"
            className="w-full rounded-md border border-border bg-background px-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
      
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="size-9 rounded-full bg-muted" />
          <div className="hidden lg:block leading-tight">
            <p className="text-sm font-semibold">Vishu Jain</p>
          </div>
        </div>
      </div>
    </header>
  );
}
