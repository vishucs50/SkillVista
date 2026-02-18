import Link from "next/link";
export default function Navbar(){
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-gray-bg-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Icon Container */}
            <div className="w-9 h-9 rounded-lg  bg-[linear-gradient(135deg,#0a0a0a,#111)]  border border-white/10   flex items-center justify-center shadow-[0_0_12px_rgba(0,0,0,0.6)]    group-hover:shadow-[0_0_18px_rgba(99,102,241,0.4)]    transition-all duration-300">
              <span className="material-icons text-[22px] leading-none      bg-[linear-gradient(120deg,#ff0080,#ff8c00,#40e0d0,#7b2ff7)]      bg-clip-text text-transparent">
                insights
              </span>
            </div>

            {/* Brand Name */}
            <span className="text-xl font-semibold tracking-tight text-white/90 group-hover:text-white transition-colors">
              SkillVista
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="text-sm font-medium text-slate-muted hover:text-off-white transition-colors">
                Log in
              </button>
            </Link>

            <Link href="/register">
              <button className="sea-green-gradient hover:opacity-90 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-primary/20">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </nav>
    );
}