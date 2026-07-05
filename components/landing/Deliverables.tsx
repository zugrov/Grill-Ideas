import { DELIVERABLES } from "@/lib/landing-content";

export function Deliverables() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Что вы получаете
        </h2>
        <ul className="space-y-4">
          {DELIVERABLES.map((item) => (
            <li
              key={item}
              className="flex gap-3 bg-grill-surface rounded-xl p-4 border border-white/5"
            >
              <span className="text-grill-fire shrink-0" aria-hidden>
                🔥
              </span>
              <span className="text-grill-muted leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
