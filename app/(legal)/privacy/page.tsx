import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function PrivacyPage() {
  return (
    <>
      <div className="h-1.5 bg-gradient-to-r from-mc-primary from-40% to-mc-invert-bg to-40%" />
      <SiteHeader ctaHref="/register" showAuth={false} />
      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-sm">
        <h1>Политика конфиденциальности</h1>
        <p>
          maxima consulting обрабатывает персональные данные пользователей GRILL
          IDEAS в целях регистрации, оказания услуги анализа и обработки платежей.
        </p>
        <h2>Какие данные собираем</h2>
        <ul>
          <li>Email и данные аккаунта</li>
          <li>Введённые данные о бизнес-идее</li>
          <li>Результаты анализа</li>
          <li>Данные о платежах (через ЮKassa)</li>
        </ul>
        <h2>Хранение</h2>
        <p>Данные хранятся в Supabase (PostgreSQL) с RLS. Доступ только у владельца аккаунта.</p>
      </main>
      <SiteFooter />
    </>
  );
}
