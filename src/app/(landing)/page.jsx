'use client';
import Link from 'next/link';
import './landing.css';
import Hero from '@/components/landing/Hero';
import FeaturesGrid from '@/components/landing/FeatureGrid';
import ScrollReveal from '@/components/landing/ScrollReveal';
export default function Page() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-gray-bg-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Icon Container */}
            <div
              className="w-9 h-9 rounded-lg  bg-[linear-gradient(135deg,#0a0a0a,#111)]  border border-white/10   flex items-center justify-center shadow-[0_0_12px_rgba(0,0,0,0.6)]    group-hover:shadow-[0_0_18px_rgba(99,102,241,0.4)]    transition-all duration-300"
            >
              <span
                className="material-icons text-[22px] leading-none      bg-[linear-gradient(120deg,#ff0080,#ff8c00,#40e0d0,#7b2ff7)]      bg-clip-text text-transparent"
              >
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

      {/* MAIN */}
      <main className="relative pt-32  overflow-hidden">
        {/* BACKGROUND GRADIENT */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-150 bg-linear-to-b from-primary/20 to-transparent blur-[120px] pointer-events-none opacity-40"></div>

        {/* HERO SECTION */}
        <ScrollReveal className="relative z-10">
          <Hero />
        </ScrollReveal>

        {/* FEATURES SECTION */}
        <ScrollReveal delay={100}>
          <FeaturesGrid />
        </ScrollReveal>

        {/* FEATURES DETAILED SECTION */}
        <ScrollReveal delay={150}>
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-off-white">
                Engineered for Success
              </h2>
              <p className="text-slate-muted max-w-2xl mx-auto">
                A comprehensive suite of tools designed to give you an unfair
                advantage in the job market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: "shutter_speed",
                  title: "Real-time Score",
                  desc: "Monitor your employability index in real-time as you gain certifications and experience.",
                },
                {
                  icon: "query_stats",
                  title: "Market Trend Feed",
                  desc: "Stay ahead of the curve with predictive analysis on emerging technologies and roles.",
                },
                {
                  icon: "description",
                  title: "Resume Optimizer",
                  desc: "AI-driven rewriting to ensure your profile passes through ATS filters with a high score.",
                },
                {
                  icon: "hub",
                  title: "Skill Radar",
                  desc: "Interactive visualization of your technical ecosystem compared to industry benchmarks.",
                },
                {
                  icon: "psychology",
                  title: "Career Simulator",
                  desc: "Predict future earnings and role titles based on potential learning paths you choose.",
                },
                {
                  icon: "diversity_3",
                  title: "Peer Benchmarking",
                  desc: "Anonymously compare your skill set with professionals in similar roles worldwide.",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group p-8 rounded-2xl bg-[#1E1E1E] border border-white/5 hover:bg-[#2A2A2A] hover:border-primary/40 transition-all"
                >
                  <span className="material-icons text-primary text-3xl mb-6">
                    {feature.icon}
                  </span>
                  <h4 className="text-xl font-bold mb-4">{feature.title}</h4>
                  <p className="text-slate-muted text-sm mb-6 leading-relaxed">
                    {feature.desc}
                  </p>
                  <a
                    className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all"
                    href="#"
                  >
                    Learn more{" "}
                    <span className="material-icons text-sm">
                      arrow_forward
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        </ScrollReveal>

        {/* HOW IT WORKS */}
        <ScrollReveal delay={150}>
          <section className="max-w-5xl mx-auto px-6 py-32 relative">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold mb-4 text-off-white">
                How it Works
              </h2>
              <p className="text-slate-muted">
                Three simple steps to unlock your professional future.
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>

              <div className="text-center relative">
                <div className="w-20 h-20 rounded-full bg-[#1E1E1E] border border-primary/40 mx-auto mb-8 flex items-center justify-center text-primary text-2xl font-black shadow-xl shadow-primary/10">
                  1
                </div>
                <h5 className="text-lg font-bold mb-3 text-off-white">
                  Profile Sync
                </h5>
                <p className="text-sm text-slate-muted">
                  Connect LinkedIn or upload your CV for instant data
                  extraction.
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 rounded-full bg-[#1E1E1E] border border-primary/40 mx-auto mb-8 flex items-center justify-center text-primary text-2xl font-black shadow-xl shadow-primary/10">
                  2
                </div>
                <h5 className="text-lg font-bold mb-3 text-off-white">
                  AI Analysis
                </h5>
                <p className="text-sm text-slate-muted">
                  Our neural engine benchmarks you against real-time global
                  demand.
                </p>
              </div>

              <div className="text-center relative">
                <div className="w-20 h-20 rounded-full bg-[#1E1E1E] border border-primary/40 mx-auto mb-8 flex items-center justify-center text-primary text-2xl font-black shadow-xl shadow-primary/10">
                  3
                </div>
                <h5 className="text-lg font-bold mb-3 text-off-white">
                  Optimization
                </h5>
                <p className="text-sm text-slate-muted">
                  Receive custom skill roadmaps and resume upgrades to land the
                  role.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* PROFESSIONAL STAGES */}
        <ScrollReveal delay={150}>
          <section className="bg-[#181818] py-32 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-off-white">
                  For Every Professional Stage
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: "school",
                    title: "Students",
                    desc: "Bridge the gap between graduation and your first high-paying tech role.",
                  },
                  {
                    icon: "shuffle",
                    title: "Career Switchers",
                    desc: "Map your transferable skills to new industries with surgical precision.",
                  },
                  {
                    icon: "terminal",
                    title: "Developers",
                    desc: "Master the tech stack that's actually in demand, not just trending.",
                  },
                  {
                    icon: "person_search",
                    title: "Job Seekers",
                    desc: "Optimize your presence and reach the top 1% of the applicant pool.",
                  },
                ].map((stage, idx) => (
                  <div
                    key={idx}
                    className="p-8 rounded-2xl bg-[#222222] border border-white/5 hover:border-primary/40 hover:-translate-y-1 transition-all"
                  >
                    <span className="material-icons text-primary/60 mb-6 text-4xl">
                      {stage.icon}
                    </span>
                    <h4 className="font-bold text-xl mb-3 text-off-white">
                      {stage.title}
                    </h4>
                    <p className="text-slate-muted text-sm leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* CTA SECTION */}
        <ScrollReveal delay={150}>
          <section className="max-w-7xl mx-auto px-6 py-20 pb-40">
            <div className="bg-[#1E1E1E] rounded-3xl p-12 md:p-20 text-center relative overflow-hidden border border-white/5 shadow-2xl">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/5 blur-[120px]"></div>
              <h2 className="text-4xl md:text-6xl font-black text-off-white mb-8 relative z-10">
                Start Your SkillVista Journey
              </h2>
              <p className="text-slate-muted text-lg md:text-xl max-w-2xl mx-auto mb-12 relative z-10">
                Join 100,000+ professionals using AI to navigate their careers
                with absolute confidence.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                <Link href="/assessment">
                  <button className="sea-green-gradient hover:opacity-90 text-white px-10 py-5 rounded-xl text-xl font-black transition-all shadow-xl shadow-primary/30">
                    Create Free Account
                  </button>
                </Link>
                <button className="bg-white/5 text-off-white border border-white/10 backdrop-blur-md px-10 py-5 rounded-xl text-xl font-black hover:bg-white/10 transition-all">
                  Talk to Sales
                </button>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>

      {/* FOOTER */}
      <ScrollReveal delay={150}>
        <footer className="border-t border-white/5 bg-gray-bg-base">
          <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col items-center justify-center text-center">
            {/* BRAND */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 sea-green-gradient rounded flex items-center justify-center">
                <span className="material-icons text-white text-xl">
                  insights
                </span>
              </div>

              <span className="text-lg font-semibold tracking-tight text-off-white">
                SkillVista
              </span>
            </div>

            {/* TAGLINE (optional) */}
            <p className="text-slate-muted text-sm max-w-md">
              AI-powered career intelligence built for the future workforce.
            </p>

            {/* COPYRIGHT */}
            <p className="mt-6 text-[11px] tracking-widest uppercase text-slate-600">
              © 2026 SkillVista Inc.
            </p>
          </div>
        </footer>
      </ScrollReveal>
    </>
  );
}
