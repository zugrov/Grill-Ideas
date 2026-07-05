import { AUDIENCE_PERSONAS } from "@/lib/landing-content";

export function AudienceBlock() {
  return (
    <section className="px-6 py-16 md:py-20 bg-grill-surface/40">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Для кого это
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {AUDIENCE_PERSONAS.map((persona) => (
            <div
              key={persona.title}
              className="bg-grill-surface rounded-xl p-6 border border-white/5 text-center md:text-left"
            >
              <span className="text-3xl mb-4 block" aria-hidden>
                {persona.icon}
              </span>
              <h3 className="font-semibold text-lg mb-2">{persona.title}</h3>
              <p className="text-sm text-grill-muted leading-relaxed">
                {persona.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
