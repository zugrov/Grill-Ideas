import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/brand";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/5 py-10 text-center text-xs text-grill-muted">
      <p className="mb-3">
        <strong className="text-grill-green font-semibold">maxima consulting</strong>
        {` · ${PRODUCT_NAME}`}
      </p>
      <p>
        <Link href="/blog" className="hover:text-grill-text transition-colors">
          Блог
        </Link>
        {" · "}
        <Link href="/offer" className="hover:text-grill-text transition-colors">
          Оферта
        </Link>
        {" · "}
        <Link href="/privacy" className="hover:text-grill-text transition-colors">
          Конфиденциальность
        </Link>
        {" · "}
        <Link href="/refunds" className="hover:text-grill-text transition-colors">
          Возвраты
        </Link>
      </p>
    </footer>
  );
}
