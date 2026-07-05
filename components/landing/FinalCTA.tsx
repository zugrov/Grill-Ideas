import { ConversionStrip } from "@/components/landing/ConversionStrip";
import { FINAL_CTA } from "@/lib/landing-content";

export function FinalCTA() {
  return (
    <section className="px-6 py-20 md:py-28 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{FINAL_CTA.title}</h2>
        <p className="text-grill-muted mb-8">{FINAL_CTA.subtitle}</p>
        <ConversionStrip align="center" />
      </div>
    </section>
  );
}
