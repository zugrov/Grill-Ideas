import Link from "next/link";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function LandingPage() {
  return (
    <>
      <div className="h-1.5 bg-gradient-to-r from-mc-primary from-40% to-mc-invert-bg to-40%" />
      <SiteHeader />
      <main className="max-w-[1100px] mx-auto px-6">
        <section className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 py-12 items-start">
          <div>
            <h1 className="font-bold text-4xl md:text-5xl leading-tight tracking-tight mb-5">
              <span className="block text-mc-text-muted line-through text-xl md:text-2xl font-medium mb-2">
                Красивый бизнес-план
              </span>
              Не упакуем слабую идею
            </h1>
            <p className="text-mc-text-second leading-relaxed mb-7 max-w-lg">
              GRILL IDEAS найдёт, где модель ломается, и даст go / no-go до
              сжигания бюджета.
            </p>
            <Link
              href="/register"
              className="inline-block bg-mc-primary text-mc-invert-text px-7 py-4 rounded-md font-bold text-sm tracking-wide hover:brightness-105"
            >
              НАЧАТЬ БЕСПЛАТНО
            </Link>
            <p className="text-sm text-mc-text-second mt-4">
              <strong className="text-mc-success font-semibold">
                Этапы 0–1 free
              </strong>{" "}
              · полный разбор 999 ₽
            </p>
          </div>
          <div>
            <VerdictCard label="GREEN" hint="→ идти дальше" className="bg-mc-success" />
            <VerdictCard label="YELLOW" hint="→ с оговорками" className="bg-mc-primary" />
            <VerdictCard label="RED" hint="→ нужны данные" className="bg-mc-error" />
            <VerdictCard
              label="BLACK"
              hint="→ stop"
              className="bg-mc-invert-bg text-mc-text-muted border border-mc-text-alt"
            />
            <div className="bg-mc-invert-bg text-mc-invert-text rounded-lg p-7 mt-3">
              <div className="text-[0.7rem] uppercase tracking-widest text-mc-text-muted">
                Полный анализ
              </div>
              <div className="text-5xl font-bold text-mc-primary my-1">999₽</div>
              <div className="text-sm text-mc-text-second">этапы 2–14 · одна идея</div>
            </div>
          </div>
        </section>
        <section className="grid md:grid-cols-3 gap-5 py-10 border-t border-mc-border">
          <Bullet title="15 этапов" text="От JTBD до unit economics и validation backlog." />
          <Bullet title="Skeptical operator" text="Факты отдельно от гипотез. Уровень уверенности на каждую." />
          <Bullet title="Resume anytime" text="Прогресс сохраняется в личном кабинете." />
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function VerdictCard({
  label,
  hint,
  className,
}: {
  label: string;
  hint: string;
  className: string;
}) {
  return (
    <div
      className={`flex justify-between items-center rounded-md px-4 py-3.5 mb-2.5 text-sm font-semibold text-mc-invert-text ${className}`}
    >
      <span>{label}</span>
      <span className="font-normal opacity-90">{hint}</span>
    </div>
  );
}

function Bullet({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-mc-card border border-mc-border rounded-lg p-5">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-mc-text-second leading-relaxed">{text}</p>
    </div>
  );
}
