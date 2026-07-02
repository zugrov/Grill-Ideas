import type { SupabaseClient } from "@supabase/supabase-js";
import { MAX_FREE_STAGE } from "@/lib/analysis";
import { isVipEmail } from "@/lib/vip";
import type { Analysis, AnalysisStatus } from "@/lib/types";

export function isPaidAnalysisStatus(status: AnalysisStatus): boolean {
  return status === "paid_in_progress" || status === "completed";
}

export async function syncAnalysisPaymentState(
  supabase: SupabaseClient,
  analysis: Analysis,
  userEmail?: string | null,
): Promise<{ analysis: Analysis; paymentSucceeded: boolean }> {
  if (isVipEmail(userEmail)) {
    if (
      analysis.status === "awaiting_payment" ||
      (analysis.current_stage >= MAX_FREE_STAGE &&
        !isPaidAnalysisStatus(analysis.status))
    ) {
      const updates: { status: AnalysisStatus } = { status: "paid_in_progress" };
      await supabase.from("analyses").update(updates).eq("id", analysis.id);
      return {
        analysis: { ...analysis, ...updates },
        paymentSucceeded: true,
      };
    }
    return { analysis, paymentSucceeded: true };
  }
  const { data: payments } = await supabase
    .from("payments")
    .select("id, status")
    .eq("analysis_id", analysis.id)
    .order("created_at", { ascending: false });

  const succeededPayment = payments?.find((p) => p.status === "succeeded");
  const paymentSucceeded = !!succeededPayment;

  if (paymentSucceeded && !isPaidAnalysisStatus(analysis.status)) {
    const updates: { status: AnalysisStatus; payment_id?: string } = {
      status: "paid_in_progress",
    };
    if (succeededPayment && analysis.payment_id !== succeededPayment.id) {
      updates.payment_id = succeededPayment.id;
    }

    await supabase.from("analyses").update(updates).eq("id", analysis.id);
    return {
      analysis: { ...analysis, ...updates },
      paymentSucceeded: true,
    };
  }

  let paymentSucceededFromLink = false;
  if (analysis.payment_id) {
    const linked = payments?.find((p) => p.id === analysis.payment_id);
    paymentSucceededFromLink = linked?.status === "succeeded";
  }

  return {
    analysis,
    paymentSucceeded: paymentSucceeded || paymentSucceededFromLink,
  };
}
