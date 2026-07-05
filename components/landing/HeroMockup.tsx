import Image from "next/image";

export function HeroMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0 lg:ml-auto">
      <div className="rounded-xl border border-white/10 bg-grill-surface shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-grill-bg/80">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[0.65rem] text-grill-muted truncate">
            grillmyidea.ru/dashboard/analyze
          </span>
        </div>
        <div className="relative">
          <Image
            src="/landing/hero-form.png"
            alt="Форма ввода данных бизнес-идеи"
            width={800}
            height={600}
            priority
            className="w-full h-auto border-b border-white/5"
          />
          <div className="relative -mt-8 mx-3 mb-3 rounded-lg border border-white/10 shadow-xl overflow-hidden">
            <Image
              src="/landing/hero-report.png"
              alt="Фрагмент AI-отчёта с таблицами GTM и unit economics"
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
