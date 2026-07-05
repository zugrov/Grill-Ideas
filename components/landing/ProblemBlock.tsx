import { PROBLEM_STATS, PROBLEMS } from "@/lib/landing-content";

export function ProblemBlock() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Знакомо?
        </h2>
        <p className="text-center text-grill-text text-lg max-w-3xl mx-auto mb-10 leading-relaxed">
          {PROBLEM_STATS}
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          {PROBLEMS.map((text) => (
            <div
              key={text}
              className="bg-grill-surface rounded-xl p-6 border border-white/5"
            >
              <p className="text-grill-muted leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
