

export default function FeaturesGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 hover:border-primary/30 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          <span className="material-icons text-primary">auto_graph</span>
        </div>
        <h3 className="text-lg font-bold mb-3">AI Intelligence</h3>
        <p className="text-slate-muted text-sm leading-relaxed">
          Neural analysis of your career trajectory.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 hover:border-primary/30 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          <span className="material-icons text-primary">radar</span>
        </div>
        <h3 className="text-lg font-bold mb-3">Skill Mapping</h3>
        <p className="text-slate-muted text-sm leading-relaxed">
          Visualize your proficiency across critical domain and soft-skill
          clusters.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 hover:border-primary/30 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          <span className="material-icons text-primary">warning_amber</span>
        </div>
        <h3 className="text-lg font-bold mb-3">Gap Detection</h3>
        <p className="text-slate-muted text-sm leading-relaxed">
          Instantly identify missing skills needed for your target dream
          position.
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-[#1E1E1E] border border-white/5 hover:border-primary/30 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          <span className="material-icons text-primary">rocket_launch</span>
        </div>
        <h3 className="text-lg font-bold mb-3">Career Velocity</h3>
        <p className="text-slate-muted text-sm leading-relaxed">
          Actionable roadmaps designed to accelerate your salary growth path.
        </p>
      </div>
    </section>
  );
}
