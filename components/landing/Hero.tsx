import Link from "next/link";
import { ConversionStrip } from "@/components/landing/ConversionStrip";
import { HeroMockup } from "@/components/landing/HeroMockup";
import { OnboardingSteps } from "@/components/landing/OnboardingSteps";
import { PromoCountdown } from "@/components/landing/PromoCountdown";
import { HERO } from "@/lib/landing-content";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-16 md:py-24">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(46, 204, 113, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 204, 113, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-grill-fire/5 via-transparent to-transparent"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="mb-10 md:mb-12 text-center">
          <p className="text-grill-fire text-sm uppercase tracking-widest mb-4">
            {HERO.eyebrow}
          </p>
          <h1 className="w-full text-4xl md:text-5xl lg:text-6xl font-bold text-grill-text leading-tight">
            {HERO.title}
          </h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          <div className="text-center lg:text-left">
            <p className="text-base text-grill-text mb-4 leading-relaxed">
              {HERO.tldr}
            </p>
            <p className="text-grill-muted text-sm mb-6">{HERO.subtitle}</p>

            <div className="flex justify-center lg:justify-start mb-6">
              <PromoCountdown variant="compact" />
            </div>

            <ConversionStrip align="left" />

            <div className="mt-6">
              <OnboardingSteps />
            </div>

            <p className="text-xs text-grill-muted mt-4 mb-2">{HERO.freeNote}</p>
            <Link
              href="#demo"
              className="text-grill-blue text-sm underline underline-offset-4 hover:brightness-125"
            >
              {HERO.demoLink}
            </Link>
          </div>

          <HeroMockup />
        </div>
      </div>
    </section>
  );
}
