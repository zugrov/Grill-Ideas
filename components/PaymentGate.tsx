"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type PaymentGateProps = {
  analysisId: string;
  onPaid: () => void;
};

async function readJsonResponse(res: Response): Promise<Record<string, unknown>> {
  const text = await res.text();
  if (!text.trim()) return {};
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error("Сервер вернул некорректный ответ. Попробуйте позже.");
  }
}

const isDevSkipPayment =
  process.env.NEXT_PUBLIC_DEV_SKIP_PAYMENT === "true";

export function PaymentGate({ analysisId, onPaid }: PaymentGateProps) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [devSkipping, setDevSkipping] = useState(false);
  const [error, setError] = useState("");

  async function handlePay() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });
      const data = await readJsonResponse(res);
      if (!res.ok) {
        throw new Error(String(data.error ?? "Ошибка оплаты"));
      }
      const confirmUrl = data.confirmUrl;
      if (typeof confirmUrl !== "string" || !confirmUrl) {
        throw new Error("Не получена ссылка на оплату");
      }
      window.location.href = confirmUrl;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
      setLoading(false);
    }
  }

  async function handleDevSkip() {
    setDevSkipping(true);
    setError("");
    try {
      const res = await fetch("/api/payment/dev-confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId }),
      });
      const data = await readJsonResponse(res);
      if (!res.ok) {
        throw new Error(String(data.error ?? "Dev-подтверждение не удалось"));
      }
      if (data.paid) onPaid();
      else throw new Error("Платёж не подтверждён");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setDevSkipping(false);
    }
  }

  async function checkPayment() {
    setChecking(true);
    setError("");
    try {
      const res = await fetch(`/api/payment/status?analysisId=${analysisId}`);
      const data = await readJsonResponse(res);
      if (!res.ok) {
        throw new Error(String(data.error ?? "Не удалось проверить статус"));
      }
      if (data.paid) onPaid();
      else setError("Платёж ещё не подтверждён. Подождите или попробуйте снова.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось проверить статус");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="text-center py-12">
      <div className="inline-block bg-mc-invert-bg text-mc-invert-text rounded-2xl px-8 py-8 max-w-md w-full">
        <div className="text-4xl mb-4">🔥</div>
        <h2 className="text-xl font-bold mb-2">Продолжить анализ</h2>
        <p className="text-mc-text-muted text-sm mb-6">
          Этапы 0–1 завершены. Полный разбор этапов 2–14
        </p>
        <div className="text-3xl font-bold text-mc-primary mb-1">999 ₽</div>
        <p className="text-xs text-mc-text-muted mb-6">одна бизнес-идея</p>
        <Button onClick={handlePay} disabled={loading} className="w-full mb-3">
          {loading ? "Переход к оплате..." : "Оплатить и продолжить"}
        </Button>
        <Button
          variant="secondary"
          onClick={checkPayment}
          disabled={checking}
          className="w-full bg-transparent border-mc-text-muted text-mc-invert-text"
        >
          {checking ? "Проверяем..." : "Уже оплатил — проверить"}
        </Button>
        {isDevSkipPayment && (
          <Button
            variant="secondary"
            onClick={handleDevSkip}
            disabled={devSkipping}
            className="w-full mt-3 bg-transparent border-dashed border-mc-text-muted text-mc-text-muted text-xs"
          >
            {devSkipping ? "Подтверждаем..." : "Dev: пропустить оплату"}
          </Button>
        )}
        {error && <p className="text-sm text-mc-error mt-4">{error}</p>}
        <p className="text-xs text-mc-text-muted mt-4">
          Оплачивая, вы принимаете{" "}
          <a href="/offer" className="underline">
            оферту
          </a>
        </p>
      </div>
    </div>
  );
}
