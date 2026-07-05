"use client";

import { useEffect, useState } from "react";
import {
  FUTURE_PRICE,
  PROMO_END_ISO,
  PROMO_PRICE,
  PROMO_SAVINGS,
} from "@/lib/landing-content";

type PromoCountdownProps = {
  variant?: "compact" | "full";
};

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

function calcTimeLeft(): TimeLeft {
  const diff = new Date(PROMO_END_ISO).getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function PromoCountdown({ variant = "compact" }: PromoCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTimeLeft(calcTimeLeft());
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!timeLeft) return null;

  if (timeLeft.expired) {
    return (
      <p className="text-sm text-grill-muted">
        Акционная цена {PROMO_PRICE.toLocaleString("ru-RU")} ₽ завершена
      </p>
    );
  }

  const timer = (
    <span className="font-mono tabular-nums text-grill-fire">
      {pad(timeLeft.days)}:{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:
      {pad(timeLeft.seconds)}
    </span>
  );

  if (variant === "compact") {
    return (
      <p className="text-sm text-grill-muted mb-6">
        До конца акции: {timer}
      </p>
    );
  }

  return (
    <div className="text-center mb-8 space-y-3">
      <p className="text-sm text-grill-muted">
        До конца акции (31 октября 2026): {timer}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-grill-muted line-through text-lg">
          {FUTURE_PRICE.toLocaleString("ru-RU")} ₽
        </span>
        <span className="text-3xl font-bold text-grill-text">
          {PROMO_PRICE.toLocaleString("ru-RU")} ₽
        </span>
        <span className="inline-block bg-grill-fire/20 text-grill-fire text-xs font-semibold px-3 py-1 rounded-full">
          Экономия {PROMO_SAVINGS.toLocaleString("ru-RU")} ₽
        </span>
      </div>
    </div>
  );
}
