import Image from "next/image";
import Link from "next/link";
import { DEMO_CALLOUT } from "@/lib/landing-content";

export function DemoCallout() {
  return (
    <section className="px-6 py-12 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 items-center bg-grill-surface rounded-2xl border border-grill-green/20 p-6 md:p-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {DEMO_CALLOUT.title}
            </h2>
            <p className="text-grill-muted mb-6 leading-relaxed">
              {DEMO_CALLOUT.subtitle}
            </p>
            <Link
              href="#demo"
              className="inline-flex items-center justify-center bg-grill-blue text-white font-semibold px-6 py-3 rounded-xl hover:brightness-110 transition-colors"
            >
              {DEMO_CALLOUT.cta} →
            </Link>
          </div>
          <div className="rounded-xl border border-white/10 overflow-hidden shadow-xl">
            <Image
              src="/landing/hero-report.png"
              alt="Превью AI-отчёта с таблицами и вердиктом"
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
