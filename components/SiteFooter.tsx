import Link from "next/link";
import { PRODUCT_NAME } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="bg-mc-invert-bg text-mc-text-muted text-center py-8 text-xs">
      <strong className="text-mc-primary font-semibold">maxima consulting</strong>
      {` · ${PRODUCT_NAME} · `}
      <Link href="/offer" className="hover:text-mc-invert-text">
        Оферта
      </Link>
      {" · "}
      <Link href="/privacy" className="hover:text-mc-invert-text">
        Конфиденциальность
      </Link>
      {" · "}
      <Link href="/refunds" className="hover:text-mc-invert-text">
        Возвраты
      </Link>
    </footer>
  );
}
