import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { STAGE_TITLES } from "@/lib/form-fields";
import { StreamingMarkdown } from "@/components/StreamingMarkdown";
import type { Analysis, AnalysisMessage } from "@/lib/types";

export default async function HistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .eq("status", "completed")
    .single();

  if (!analysis) notFound();

  const { data: active } = await supabase
    .from("analyses")
    .select("id")
    .eq("user_id", user!.id)
    .neq("status", "completed")
    .maybeSingle();

  const { data: messages } = await supabase
    .from("analysis_messages")
    .select("*")
    .eq("analysis_id", id)
    .neq("role", "system")
    .order("created_at", { ascending: true });

  const a = analysis as Analysis;
  const msgs = (messages ?? []) as AnalysisMessage[];
  const stages = Array.from(new Set(msgs.map((m) => m.stage))).sort((x, y) => x - y);

  return (
    <div>
      <Link href="/dashboard/history" className="text-sm text-mc-primary mb-4 inline-block">
        ← История
      </Link>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">
          {(a.input_data as { name?: string })?.name ?? "Анализ"}
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href={`/api/analysis/${id}/pdf`}
            className="inline-block px-4 py-2 rounded-md border border-mc-border text-sm font-medium hover:bg-mc-bg"
          >
            Скачать PDF
          </a>
          {active ? (
            <span className="text-sm text-mc-text-muted py-2">
              Завершите текущий анализ перед новым
            </span>
          ) : (
            <Link
              href="/dashboard/analyze"
              className="inline-block px-4 py-2 rounded-md bg-mc-primary text-white text-sm font-medium"
            >
              Новый анализ
            </Link>
          )}
        </div>
      </div>
      <div className="space-y-8">
        {stages.map((stageNum) => (
          <section key={stageNum} className="space-y-4">
            <h3 className="text-lg font-bold text-mc-primary">
              Этап {stageNum}: {STAGE_TITLES[stageNum] ?? ""}
            </h3>
            {msgs
              .filter((m) => m.stage === stageNum)
              .map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "user"
                      ? "ml-8 bg-mc-primary/10 border border-mc-primary/20 rounded-lg p-4"
                      : "bg-mc-card border border-mc-border rounded-lg p-6"
                  }
                >
                  <p className="text-xs text-mc-text-muted mb-3">
                    {m.role === "user" ? "Ваше уточнение" : "GRILL"}
                  </p>
                  {m.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <StreamingMarkdown content={m.content} />
                  )}
                </div>
              ))}
          </section>
        ))}
      </div>
    </div>
  );
}
