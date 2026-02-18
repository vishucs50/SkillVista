export default function ProfessionalStage(){
    return(
        <section className="bg-[#181818] py-32 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold mb-4 text-off-white">
                  For Every Professional Stage
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: "school",
                    title: "Students",
                    desc: "Bridge the gap between graduation and your first high-paying tech role.",
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
    )
}