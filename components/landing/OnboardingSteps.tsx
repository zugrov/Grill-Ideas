import { ONBOARDING_STEPS } from "@/lib/landing-content";

export function OnboardingSteps() {
  return (
    <div className="w-full max-w-md mx-auto lg:mx-0 mb-6">
      <p className="text-xs text-grill-muted mb-3 text-center lg:text-left">
        Что будет после нажатия «Начать бесплатно»
      </p>
      <div className="flex items-center justify-between gap-1">
        {ONBOARDING_STEPS.map((item, index) => (
          <div key={item.step} className="flex items-center gap-1 flex-1 min-w-0">
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 shrink-0 ${
                  index === 0
                    ? "bg-grill-green text-white"
                    : "bg-grill-surface border border-white/10 text-grill-muted"
                }`}
              >
                {item.step}
              </div>
              <span className="text-[0.65rem] sm:text-xs text-grill-muted leading-tight text-center">
                {item.label}
              </span>
            </div>
            {index < ONBOARDING_STEPS.length - 1 && (
              <span className="text-grill-muted/50 text-xs shrink-0 pb-5">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
