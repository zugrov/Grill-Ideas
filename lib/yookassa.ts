import { randomUUID } from "crypto";

const YOOKASSA_API = "https://api.yookassa.ru/v3/payments";

function getYooKassaAuth(): { shopId: string; secret: string; auth: string } {
  const shopId = process.env.YOOKASSA_SHOP_ID?.trim();
  const secret = process.env.YOOKASSA_SECRET_KEY?.trim();
  if (!shopId || !secret) {
    throw new Error(
      "ЮKassa не настроена: заполните YOOKASSA_SHOP_ID и YOOKASSA_SECRET_KEY в .env.local",
    );
  }
  const auth = Buffer.from(`${shopId}:${secret}`).toString("base64");
  return { shopId, secret, auth };
}

function mapYooKassaError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as { code?: string; description?: string };
    if (parsed.code === "invalid_credentials") {
      return "Неверный shopId или секретный ключ ЮKassa. Проверьте YOOKASSA_* в .env.local и перевыпустите ключ в кабинете.";
    }
    if (parsed.description) return parsed.description;
  } catch {
    /* use fallback */
  }
  return `Ошибка ЮKassa (${status})`;
}

export async function getYooKassaPayment(paymentId: string): Promise<{
  confirmUrl: string | null;
  status: string;
}> {
  const { auth } = getYooKassaAuth();

  const res = await fetch(`${YOOKASSA_API}/${paymentId}`, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(mapYooKassaError(res.status, err));
  }

  const data = await res.json();
  return {
    confirmUrl: data.confirmation?.confirmation_url ?? null,
    status: data.status,
  };
}

export async function createYooKassaPayment(
  userId: string,
  analysisId: string,
  returnUrl: string,
): Promise<{ paymentId: string; confirmUrl: string }> {
  const { auth } = getYooKassaAuth();

  const res = await fetch(YOOKASSA_API, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      "Idempotence-Key": randomUUID(),
    },
    body: JSON.stringify({
      amount: { value: "999.00", currency: "RUB" },
      confirmation: { type: "redirect", return_url: returnUrl },
      capture: true,
      description: "GRILL IDEAS — валидация бизнес-идеи",
      metadata: { userId, analysisId },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(mapYooKassaError(res.status, err));
  }

  const data = await res.json();
  const confirmUrl = data.confirmation?.confirmation_url;
  if (!data.id || !confirmUrl) {
    throw new Error("ЮKassa не вернула ссылку на оплату");
  }

  return {
    paymentId: data.id,
    confirmUrl,
  };
}
