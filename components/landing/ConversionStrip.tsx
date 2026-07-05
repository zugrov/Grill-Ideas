import Link from "next/link";
import { CTAButton } from "@/components/landing/CTAButton";
import { HERO, SOCIAL_PROOF_SAVINGS } from "@/lib/landing-content";

type ConversionStripProps = {
  align?: "center" | "left";
};

export function ConversionStrip({ align = "center" }: ConversionStripProps) {
  const alignClass =
    align === "left"
      ? "items-center lg:items-start text-center lg:text-left"
      : "items-center text-center";

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      <CTAButton href="/register" variant="primary">
        Начать бесплатно
      </CTAButton>
      <Link
        href="/register"
        className="text-grill-blue text-sm hover:brightness-125 transition-colors"
      >
        {HERO.ghostCta}
      </Link>
      <div
        className={`flex flex-wrap gap-x-3 gap-y-1 text-xs text-grill-muted ${align === "left" ? "justify-center lg:justify-start" : "justify-center"}`}
      >
        <span>{HERO.trustNoCard}</span>
        <span aria-hidden>·</span>
        <Link href="/refunds" className="text-grill-blue hover:underline">
          {HERO.trustRefund} →
        </Link>
      </div>
      <p className="text-sm text-grill-green font-medium">{SOCIAL_PROOF_SAVINGS}</p>
    </div>
  );
}
