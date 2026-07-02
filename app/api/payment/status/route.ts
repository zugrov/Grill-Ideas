import { NextResponse } from "next/server";
import { syncAnalysisPaymentState } from "@/lib/payment-state";
import { createRouteClient } from "@/lib/supabase/route-auth";
import type { Analysis } from "@/lib/types";

export async function GET(request: Request) {
  const supabase = await createRouteClient(request);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const analysisId = new URL(request.url).searchParams.get("analysisId");
  if (!analysisId) {
    return NextResponse.json({ error: "Missing analysisId" }, { status: 400 });
  }

  const { data: analysisRow } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (!analysisRow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { analysis, paymentSucceeded } = await syncAnalysisPaymentState(
    supabase,
    analysisRow as Analysis,
    user.email,
  );

  const paid =
    analysis.status === "paid_in_progress" ||
    analysis.status === "completed" ||
    paymentSucceeded;

  return NextResponse.json({ paid, status: analysis.status });
}
