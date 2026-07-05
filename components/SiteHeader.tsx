import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/brand";

type SiteHeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
  showAuth?: boolean;
};

export function SiteHeader({
  ctaHref = "/register",
  ctaLabel = "Начать →",
  showAuth = true,
}: SiteHeaderProps) {
  return (
    <nav className="max-w-[1100px] mx-auto px-6 py-5 flex justify-between items-center">
      <Link href="/" className="font-bold text-lg text-mc-text">
        <span className="block text-[0.6rem] tracking-[0.18em] uppercase text-mc-text-second font-normal">
          maxima consulting
        </span>
        {PRODUCT_NAME}
      </Link>
      <div className="flex items-center gap-4">
        {showAuth && (
          <Link href="/login" className="text-sm text-mc-text-second hover:text-mc-text">
            Войти
          </Link>
        )}
        <Link
          href={ctaHref}
          className="bg-mc-primary text-mc-invert-text px-5 py-2.5 rounded-md text-sm font-semibold hover:brightness-105"
        >
          {ctaLabel}
        </Link>
      </div>
    </nav>
  );
}
