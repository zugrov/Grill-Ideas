import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function RefundsPage() {
  return (
    <>
      <div className="h-1.5 bg-gradient-to-r from-mc-primary from-40% to-mc-invert-bg to-40%" />
      <SiteHeader ctaHref="/register" showAuth={false} />
      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-sm">
        <h1>Условия возврата</h1>
        <p>
          Оплата 999 ₽ даёт доступ к этапам 2–14 анализа одной бизнес-идеи.
        </p>
        <h2>Когда возможен возврат</h2>
        <ul>
          <li>Технический сбой: оплата прошла, доступ не открылся</li>
          <li>Двойное списание по одной идее</li>
        </ul>
        <h2>Когда возврат не производится</h2>
        <ul>
          <li>Анализ этапов 2–14 уже начат или завершён</li>
          <li>Недовольство содержанием AI-выводов (субъективная оценка)</li>
        </ul>
        <p>Запрос: support@maxima-consulting.ru (замените на реальный email).</p>
      </main>
      <SiteFooter />
    </>
  );
}
