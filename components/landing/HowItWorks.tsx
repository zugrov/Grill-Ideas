import { HOW_IT_WORKS } from "@/lib/landing-content";

export function HowItWorks() {
  return (
    <section className="px-6 py-16 md:py-20 bg-grill-surface/40">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Как это работает
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((item) => (
            <div key={item.step} className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-grill-green/20 text-grill-green font-bold mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-grill-muted text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
