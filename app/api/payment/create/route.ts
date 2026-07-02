import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabase/route-auth";
import { createYooKassaPayment, getYooKassaPayment } from "@/lib/yookassa";

export async function POST(request: Request) {
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
      const existing = await getYooKassaPayment(pendingPayment.yookassa_id);
      if (existing.confirmUrl && existing.status === "pending") {
        return NextResponse.json({ confirmUrl: existing.confirmUrl });
      }
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
    const returnUrl = `${appUrl}/dashboard/analyze?payment=success`;

    const { paymentId: yookassaId, confirmUrl } = await createYooKassaPayment(
      user.id,
      analysisId,
      returnUrl,
    );

    const { data: payment, error } = await supabase
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase
      .from("analyses")
      .update({ payment_id: payment.id })
      .eq("id", analysisId);

    return NextResponse.json({ confirmUrl });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Ошибка создания платежа";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
