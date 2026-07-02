import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-auth";

function isDevSkipEnabled(): boolean {
  return (
    process.env.NODE_ENV !== "production" &&
    process.env.DEV_SKIP_PAYMENT === "true"
  );
}

export async function POST(request: Request) {
  if (!isDevSkipEnabled()) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const supabase = await createRouteClient(request);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let analysisId: string;
    try {
      const body = await request.json();
      analysisId = body.analysisId;
    } catch {
      return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
    }

    if (!analysisId) {
      return NextResponse.json({ error: "Missing analysisId" }, { status: 400 });
    }

    const { data: analysis } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", analysisId)
      .eq("user_id", user.id)
      .single();

    if (!analysis || analysis.status !== "awaiting_payment") {
      return NextResponse.json({ error: "Оплата недоступна" }, { status: 403 });
    }

    const webhookSecret = process.env.WEBHOOK_SECRET?.trim();
    if (!webhookSecret) {
      return NextResponse.json(
        { error: "WEBHOOK_SECRET не настроен в .env.local" },
        { status: 500 },
      );
    }

    let yookassaId: string;

    const { data: pendingPayment } = await supabase
      .from("payments")
      .select("*")
      .eq("analysis_id", analysisId)
      .eq("user_id", user.id)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (pendingPayment) {
      yookassaId = pendingPayment.yookassa_id;
    } else {
      yookassaId = `dev-${randomUUID()}`;
      const { data: payment, error: insertError } = await supabase
        .from("payments")
        .insert({
          user_id: user.id,
          analysis_id: analysisId,
          yookassa_id: yookassaId,
          status: "pending",
          amount: 999,
        })
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      await supabase
        .from("analyses")
        .update({ payment_id: payment.id })
        .eq("id", analysisId);
    }

    const { data, error } = await supabase.rpc("confirm_yookassa_payment", {
      p_yookassa_id: yookassaId,
      p_webhook_secret: webhookSecret,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ paid: true, data });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка подтверждения";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
