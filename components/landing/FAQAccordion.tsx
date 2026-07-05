"use client";

import { FAQ_ITEMS } from "@/lib/landing-content";

export function FAQAccordion() {
  return (
    <section className="px-6 py-16 md:py-20 bg-grill-surface/40">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
          Частые вопросы
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group bg-grill-surface rounded-xl border border-white/5 overflow-hidden"
            >
              <summary className="cursor-pointer px-5 py-4 font-medium text-grill-text list-none flex justify-between items-center gap-4 [&::-webkit-details-marker]:hidden">
                {item.question}
                <span className="text-grill-muted group-open:rotate-45 transition-transform text-xl leading-none">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-grill-muted leading-relaxed border-t border-white/5 pt-4">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
