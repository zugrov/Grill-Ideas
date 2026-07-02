import { NextResponse } from "next/server";
import { syncAnalysisPaymentState } from "@/lib/payment-state";
import { createClient } from "@/lib/supabase/server";
import type { Analysis, ProjectInputData } from "@/lib/types";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!analysis) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { analysis: syncedAnalysis } = await syncAnalysisPaymentState(
    supabase,
    analysis as Analysis,
    user.email,
  );

  const { data: messages } = await supabase
    .from("analysis_messages")
    .select("*")
    .eq("analysis_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ analysis: syncedAnalysis, messages: messages ?? [] });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const inputData = body.inputData as ProjectInputData;

  const { data: active } = await supabase
    .from("analyses")
    .select("id")
    .eq("user_id", user.id)
    .neq("status", "completed")
    .maybeSingle();

  if (active) {
    return NextResponse.json(
      { error: "У вас уже есть активный анализ. Завершите его перед новым." },
      { status: 409 },
    );
  }

  const { data: analysis, error } = await supabase
    .from("analyses")
    .insert({
      user_id: user.id,
      status: "free_in_progress",
      current_stage: 0,
      input_data: inputData,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ analysis });
}
