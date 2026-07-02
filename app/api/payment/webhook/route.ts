import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.json();
  const object = body.object;

  if (object?.status !== "succeeded") {
    return NextResponse.json({ ok: true });
  }

  const yookassaId = object?.id;
  if (!yookassaId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "WEBHOOK_SECRET not configured" }, { status: 500 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data, error } = await supabase.rpc("confirm_yookassa_payment", {
    p_yookassa_id: yookassaId,
    p_webhook_secret: webhookSecret,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}
