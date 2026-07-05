import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/brand";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

function LegalLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="h-1.5 bg-gradient-to-r from-mc-primary from-40% to-mc-invert-bg to-40%" />
      <SiteHeader ctaHref="/register" showAuth={false} />
      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-sm prose-headings:text-mc-text">
        <h1>{title}</h1>
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

export default function OfferPage() {
  return (
    <LegalLayout title="Публичная оферта">
      <p>
        Настоящая оферта определяет условия оказания услуги сервиса {PRODUCT_NAME} —
        поэтапная валидация бизнес-идеи с использованием AI-анализа.
      </p>
      <h2>1. Предмет</h2>
      <p>
        Исполнитель (maxima consulting) предоставляет доступ к сервису анализа
        бизнес-идей. Этапы 0–1 предоставляются бесплатно после регистрации.
        Полный анализ (этапы 2–14) — 999 ₽ за одну бизнес-идею.
      </p>
      <h2>2. Порядок оплаты</h2>
      <p>Оплата через ЮKassa. Услуга считается оплаченной после подтверждения платежа.</p>
      <h2>3. Возврат</h2>
      <p>
        Условия возврата — см.{" "}
        <Link href="/refunds">страницу возвратов</Link>.
      </p>
    </LegalLayout>
  );
}
