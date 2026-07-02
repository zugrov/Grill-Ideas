import { Suspense } from "react";
import { AnalyzeWorkflow } from "@/components/AnalyzeWorkflow";
import { syncAnalysisPaymentState } from "@/lib/payment-state";
import { isVipEmail } from "@/lib/vip";
import type { Analysis, AnalysisMessage } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

const MESSAGE_FETCH_TIMEOUT_MS = 15000;

async function fetchAnalysisMessages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  analysisId: string,
): Promise<AnalysisMessage[]> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), MESSAGE_FETCH_TIMEOUT_MS);
  try {
    const { data: msgs } = await supabase
      .from("analysis_messages")
      .select("*")
      .eq("analysis_id", analysisId)
      .order("created_at", { ascending: true })
      .abortSignal(controller.signal);
    return (msgs ?? []) as AnalysisMessage[];
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

async function AnalyzeContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let analysis: Analysis | null = null;
  let messages: AnalysisMessage[] = [];

  if (user) {
    const { data: existing } = await supabase
      .from("analyses")
      .select("*")
      .eq("user_id", user.id)
      .neq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    analysis = existing as Analysis | null;

    if (analysis) {
      const synced = await syncAnalysisPaymentState(supabase, analysis, user.email);
      analysis = synced.analysis;

      messages = await fetchAnalysisMessages(supabase, analysis.id);
    }
  }

  const isVip = isVipEmail(user?.email);

  return (
    <AnalyzeWorkflow
      initialAnalysis={analysis}
      initialMessages={messages}
      isVip={isVip}
    />
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<p className="text-mc-text-muted">Загрузка...</p>}>
      <AnalyzeContent />
    </Suspense>
  );
}
