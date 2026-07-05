import { CTAButton } from "@/components/landing/CTAButton";
import { PromoCountdown } from "@/components/landing/PromoCountdown";
import {
  FUTURE_PRICE,
  PRICING,
  PROMO_PRICE,
  URGENCY_PRICE_TEXT,
} from "@/lib/landing-content";

export function PricingCard() {
  return (
    <section id="pricing" className="px-6 py-16 md:py-20 bg-grill-surface/40 scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
          Тарифы
        </h2>
        <PromoCountdown variant="full" />
        <div className="grid md:grid-cols-2 gap-5 mb-8">
          <div className="bg-grill-surface rounded-xl p-6 border border-white/5">
            <p className="text-xs uppercase tracking-widest text-grill-muted mb-2">
              {PRICING.freeTitle}
            </p>
            <p className="text-3xl font-bold text-grill-green mb-2">
              {PRICING.freePrice}
            </p>
            <p className="text-sm text-grill-muted">{PRICING.freeDesc}</p>
          </div>
          <div className="bg-grill-surface rounded-xl p-6 border border-grill-green/30 ring-1 ring-grill-green/20">
            <p className="text-xs uppercase tracking-widest text-grill-muted mb-2">
              {PRICING.paidTitle}
            </p>
            <p className="mb-2">
              <span className="text-grill-muted line-through text-lg mr-2">
                {FUTURE_PRICE.toLocaleString("ru-RU")} ₽
              </span>
              <span className="text-3xl font-bold text-grill-text">
                {PROMO_PRICE.toLocaleString("ru-RU")} ₽
              </span>
            </p>
            <p className="text-sm text-grill-muted">{PRICING.paidDesc}</p>
          </div>
        </div>
        <p className="text-center text-sm text-grill-muted mb-6">
          {URGENCY_PRICE_TEXT}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <CTAButton href="/register" variant="primary">
            Начать бесплатно
          </CTAButton>
          <CTAButton href="/register" variant="secondary">
            Полный разбор — 999 ₽
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
