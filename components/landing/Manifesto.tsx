import { MANIFESTO } from "@/lib/landing-content";

export function Manifesto() {
  return (
    <section className="px-6 py-20 md:py-24 bg-grill-bg">
      <blockquote className="max-w-3xl mx-auto text-center">
        <p className="text-xl md:text-2xl font-medium text-grill-text leading-relaxed italic">
          «{MANIFESTO}»
        </p>
      </blockquote>
    </section>
  );
}
