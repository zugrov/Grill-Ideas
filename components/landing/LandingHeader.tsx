import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/brand";

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-grill-bg/90 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg text-grill-text">
          <span className="block text-[0.6rem] tracking-[0.18em] uppercase text-grill-muted font-normal">
            maxima consulting
          </span>
          {PRODUCT_NAME}
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/blog"
            className="text-sm text-grill-muted hover:text-grill-text transition-colors hidden sm:inline"
          >
            Блог
          </Link>
          <Link
            href="/login"
            className="text-sm text-grill-muted hover:text-grill-text transition-colors"
          >
            Войти
          </Link>
          <Link
            href="/register"
            className="bg-grill-green text-white px-4 py-2 rounded-lg text-sm font-semibold hover:brightness-110 transition-colors"
          >
            Начать бесплатно
          </Link>
        </div>
      </nav>
    </header>
  );
}
