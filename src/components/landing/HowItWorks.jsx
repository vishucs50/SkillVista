export default function HowItWorks()
{
    return (
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
          </div>

          <div className="text-center relative">
            <div className="w-20 h-20 rounded-full bg-[#1E1E1E] border border-primary/40 mx-auto mb-8 flex items-center justify-center text-primary text-2xl font-black shadow-xl shadow-primary/10">
              2
            </div>
            <h5 className="text-lg font-bold mb-3 text-off-white">
              AI Analysis
            </h5>
          </div>

          <div className="text-center relative">
            <div className="w-20 h-20 rounded-full bg-[#1E1E1E] border border-primary/40 mx-auto mb-8 flex items-center justify-center text-primary text-2xl font-black shadow-xl shadow-primary/10">
              3
            </div>
            <h5 className="text-lg font-bold mb-3 text-off-white">
              Optimization
            </h5>
          </div>
        </div>
      </section>
    );
}