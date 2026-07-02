import { NextResponse } from "next/server";
import {
  buildOpenRouterMessages,
  buildStageReplyMessages,
  canRunStage,
  countUserRepliesOnStage,
  MAX_REPLIES_PER_STAGE,
  nextStatusAfterStage,
} from "@/lib/analysis";
import { formatProjectInput } from "@/lib/form-fields";
import { streamChatCompletion } from "@/lib/openrouter";
import { syncAnalysisPaymentState } from "@/lib/payment-state";
import {
  buildStageSystemPrompt,
  stageInstruction,
  stageReplyInstruction,
} from "@/lib/prompts/master";
import { createRouteClient, getRouteUser } from "@/lib/supabase/route-auth";
import { isVipEmail } from "@/lib/vip";
import type { Analysis, AnalysisMessage, ProjectInputData } from "@/lib/types";

/** Длинные ответы модели (до ~10 мин) — без этого Next обрывает stream на ~5 мин */
export const maxDuration = 600;

export async function POST(request: Request) {
  const user = await getRouteUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createRouteClient(request);

  const body = await request.json();
  const { analysisId, stage, continue: isContinue, reply } = body;
  const replyText = typeof reply === "string" ? reply.trim() : "";
  const isReply = replyText.length > 0;

  const { data: analysisRow } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", analysisId)
    .eq("user_id", user.id)
    .single();

  if (!analysisRow) {
    return NextResponse.json({ error: "Анализ не найден" }, { status: 404 });
  }

  let analysis = analysisRow as Analysis;

  const { analysis: syncedAnalysis, paymentSucceeded } =
    await syncAnalysisPaymentState(supabase, analysis, user.email);
  analysis = syncedAnalysis;
  const isVip = isVipEmail(user.email);

  const gate = canRunStage(analysis, stage, paymentSucceeded);
  if (!gate.ok) {
    return NextResponse.json({ error: gate.error }, { status: 403 });
  }

  const { data: historyRows } = await supabase
    .from("analysis_messages")
    .select("*")
    .eq("analysis_id", analysisId)
    .order("created_at", { ascending: true });

  const history = (historyRows ?? []) as AnalysisMessage[];

  if (isReply) {
    if (stage !== analysis.current_stage) {
      return NextResponse.json({ error: "Неверный этап для ответа" }, { status: 400 });
    }

    const hasAssistant = history.some(
      (m) => m.role === "assistant" && m.stage === stage,
    );
    if (!hasAssistant) {
      return NextResponse.json(
        { error: "Сначала дождитесь ответа модели на этапе" },
        { status: 400 },
      );
    }

    const repliesUsed = countUserRepliesOnStage(history, stage);
    if (repliesUsed >= MAX_REPLIES_PER_STAGE) {
      return NextResponse.json(
        { error: `Достигнут лимит ${MAX_REPLIES_PER_STAGE} ответов на этап` },
        { status: 403 },
      );
    }

    const { error: insertUserError } = await supabase
      .from("analysis_messages")
      .insert({
        analysis_id: analysisId,
        stage,
        role: "user",
        content: replyText,
      });

    if (insertUserError) {
      return NextResponse.json({ error: insertUserError.message }, { status: 500 });
    }

    const { data: updatedHistoryRows } = await supabase
      .from("analysis_messages")
      .select("*")
      .eq("analysis_id", analysisId)
      .order("created_at", { ascending: true });

    const updatedHistory = (updatedHistoryRows ?? []) as AnalysisMessage[];
    const stageHistory = updatedHistory.filter((m) => m.stage === stage);

    const messages = buildStageReplyMessages(
      buildStageSystemPrompt(stage),
      stageHistory,
      stageReplyInstruction(stage),
    );

    return streamAssistantResponse(supabase, analysisId, stage, messages, {
      updateAnalysis: false,
    });
  }

  if (isContinue && stage !== analysis.current_stage + 1) {
    return NextResponse.json({ error: "Нельзя пропускать этапы" }, { status: 400 });
  }

  if (!isContinue && stage !== analysis.current_stage && stage !== 0) {
    return NextResponse.json({ error: "Неверный этап" }, { status: 400 });
  }

  const inputData = analysis.input_data as ProjectInputData;
  const projectText = formatProjectInput(inputData);

  let userContent: string;
  if (stage === 0 && history.length === 0) {
    userContent = `${projectText}\n\n${stageInstruction(0, false)}`;
  } else if (isContinue) {
    userContent = stageInstruction(stage, true);
  } else {
    userContent = stageInstruction(stage, false);
  }

  const messages = buildOpenRouterMessages(
    buildStageSystemPrompt(stage),
    history,
    userContent,
  );

  return streamAssistantResponse(supabase, analysisId, stage, messages, {
    updateAnalysis: true,
    analysis,
    isVip,
  });
}

type StreamOptions =
  | { updateAnalysis: false }
  | { updateAnalysis: true; analysis: Analysis; isVip: boolean };

async function streamAssistantResponse(
  supabase: Awaited<ReturnType<typeof createRouteClient>>,
  analysisId: string,
  stage: number,
  messages: { role: "system" | "user" | "assistant"; content: string }[],
  options: StreamOptions,
) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (obj: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
      };

      try {
        let fullContent = "";
        fullContent = await streamChatCompletion(messages, (chunk) => {
          send({ type: "chunk", text: chunk });
        });

        await supabase.from("analysis_messages").insert({
          analysis_id: analysisId,
          stage,
          role: "assistant",
          content: fullContent,
        });

        if (options.updateAnalysis) {
          const newStatus = nextStatusAfterStage(
            stage,
            options.analysis.status,
            options.isVip,
          );
          const updates: Record<string, unknown> = {
            current_stage: stage,
            status: newStatus,
          };
          if (stage === 14) {
            updates.completed_at = new Date().toISOString();
          }

          await supabase.from("analyses").update(updates).eq("id", analysisId);
        }

        const { data: updatedAnalysis } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", analysisId)
          .single();

        const { data: allMessages } = await supabase
          .from("analysis_messages")
          .select("*")
          .eq("analysis_id", analysisId)
          .order("created_at", { ascending: true });

        send({
          type: "done",
          analysis: updatedAnalysis,
          messages: allMessages ?? [],
        });
      } catch (e) {
        send({
          type: "error",
          message: e instanceof Error ? e.message : "Stream error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
