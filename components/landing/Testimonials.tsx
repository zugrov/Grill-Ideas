import { TESTIMONIALS } from "@/lib/landing-content";

const VERDICT_COLORS: Record<string, string> = {
  GREEN: "text-grill-green bg-grill-green/20",
  YELLOW: "text-yellow-400 bg-yellow-400/20",
  RED: "text-red-400 bg-red-400/20",
};

const AVATAR_RING: Record<string, string> = {
  GREEN: "ring-grill-green/40",
  YELLOW: "ring-yellow-400/40",
  RED: "ring-red-400/40",
};

export function Testimonials() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Что говорят основатели
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((item) => (
            <div
              key={item.name}
              className="bg-grill-surface rounded-xl p-6 border border-white/5 flex flex-col"
            >
              <div className="flex items-start gap-3 mb-4">
                <div
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ring-2 ${VERDICT_COLORS[item.verdict] ?? "text-grill-muted bg-white/10"} ${AVATAR_RING[item.verdict] ?? ""}`}
                >
                  {item.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm">{item.name}</p>
                  <p className="text-xs text-grill-muted">{item.role}</p>
                  <p className="text-xs text-grill-muted">{item.city}</p>
                </div>
                <span
                  className={`ml-auto text-xs font-bold uppercase tracking-wider ${VERDICT_COLORS[item.verdict]?.split(" ")[0] ?? "text-grill-muted"}`}
                >
                  {item.verdict}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.resultMetrics.map((metric) => (
                  <span
                    key={metric}
                    className="text-xs font-semibold px-2 py-1 rounded-md bg-grill-green/15 text-grill-green"
                  >
                    {metric}
                  </span>
                ))}
              </div>
              <p className="text-grill-muted text-sm leading-relaxed flex-1 mb-4">
                «{item.quote}»
              </p>
              <p className="text-xs text-grill-muted border-t border-white/5 pt-3 leading-relaxed">
                {item.beforeAfter}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
