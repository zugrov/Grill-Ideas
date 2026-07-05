import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { PRODUCT_NAME } from "@/lib/brand";

export default function ConsentPage() {
  return (
    <>
      <div className="h-1.5 bg-gradient-to-r from-mc-primary from-40% to-mc-invert-bg to-40%" />
      <SiteHeader ctaHref="/register" showAuth={false} />
      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-sm">
        <h1>Согласие на обработку персональных данных</h1>
        <p>
          Регистрируясь в сервисе {PRODUCT_NAME}, вы даёте согласие maxima consulting на
          обработку персональных данных: email, данные профиля, содержание
          бизнес-идей и результатов анализа.
        </p>
        <p>Цель: оказание услуги валидации бизнес-идей и поддержка пользователя.</p>
        <p>Срок: до удаления аккаунта или отзыва согласия.</p>
      </main>
      <SiteFooter />
    </>
  );
}
