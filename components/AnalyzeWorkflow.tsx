"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnalysisForm } from "@/components/AnalysisForm";
import { PaymentGate } from "@/components/PaymentGate";
import { StageChat } from "@/components/StageChat";
import { Button } from "@/components/ui/Button";
import { MAX_STAGE, countUserRepliesOnStage } from "@/lib/analysis";
import type { Analysis, AnalysisMessage, ProjectInputData } from "@/lib/types";

function hasAssistantMessageForStage(
  messages: AnalysisMessage[],
  stage: number,
): boolean {
  return messages.some((m) => m.role === "assistant" && m.stage === stage);
}

type Props = {
  initialAnalysis: Analysis | null;
  initialMessages: AnalysisMessage[];
  isVip?: boolean;
};

export function AnalyzeWorkflow({
  initialAnalysis,
  initialMessages,
  isVip = false,
}: Props) {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<Analysis | null>(initialAnalysis);
  const [messages, setMessages] = useState<AnalysisMessage[]>(initialMessages);
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [error, setError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [replyLoading, setReplyLoading] = useState(false);
  const resumeAttempted = useRef(false);

  const showForm = !analysis || analysis.status === "draft";

  const showPayment = analysis?.status === "awaiting_payment" && !isVip;
  const showChat =
    analysis &&
    !showForm &&
    !showPayment &&
    analysis.status !== "completed";

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const currentStage = analysis?.current_stage ?? 0;
  const needsStageResume =
    !!analysis &&
    !!showChat &&
    !hasAssistantMessageForStage(messages, currentStage);

  const canContinue =
    !!lastAssistant &&
    !streaming &&
    !needsStageResume &&
    currentStage < MAX_STAGE &&
    lastAssistant.stage === currentStage;

  const repliesUsed = countUserRepliesOnStage(messages, currentStage);

  const runStream = useCallback(
    async (
      analysisId: string,
      stage: number,
      options: { continueStage?: boolean; reply?: string } = {},
    ) => {
      const { continueStage = false, reply } = options;
      const isReply = !!reply?.trim();

      setStreaming(true);
      if (isReply) {
        setReplyLoading(true);
      }
      setStreamContent("");
      setError("");

      const res = await fetch("/api/analyze/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          stage,
          continue: continueStage,
          ...(reply ? { reply } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Ошибка анализа");
        setStreaming(false);
        setReplyLoading(false);
        return;
      }

      const reader = res.body?.getReader();
      if (!reader) {
        setError("Нет потока ответа");
        setStreaming(false);
        setReplyLoading(false);
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          try {
            const payload = JSON.parse(part.slice(6));
            if (payload.type === "chunk") {
              full += payload.text;
              setStreamContent(full);
            }
            if (payload.type === "done") {
              setAnalysis(payload.analysis);
              setMessages(payload.messages);
              setStreamContent("");
              setError("");
            }
            if (payload.type === "error") {
              setError(payload.message);
            }
          } catch {
            /* skip */
          }
        }
      }
      setStreaming(false);
      setReplyLoading(false);
    },
    [],
  );

  async function handleFormSubmit(data: ProjectInputData) {
    setFormLoading(true);
    setError("");
    try {
      const res = await fetch("/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputData: data }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Ошибка");
      setAnalysis(json.analysis);
      await runStream(json.analysis.id, 0, { continueStage: false });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleContinue() {
    if (!analysis) return;
    const nextStage = currentStage + 1;
    await runStream(analysis.id, nextStage, { continueStage: true });
  }

  async function handleReply(text: string) {
    if (!analysis) return;
    setError("");
    await runStream(analysis.id, currentStage, { reply: text });
  }

  async function handleRetryStage() {
    if (!analysis) return;
    setError("");
    await runStream(analysis.id, currentStage, { continueStage: false });
  }

  async function refreshAnalysis() {
    if (!analysis) return;
    const res = await fetch(`/api/analysis?id=${analysis.id}`);
    const json = await res.json();
    if (json.analysis) {
      setAnalysis(json.analysis);
      setMessages(json.messages ?? []);
      setError("");
    }
  }

  useEffect(() => {
    if (searchParams.get("payment") === "success" && analysis) {
      refreshAnalysis();
    }
  }, [searchParams, analysis?.id]);

  useEffect(() => {
    resumeAttempted.current = false;
  }, [analysis?.id]);

  useEffect(() => {
    if (!analysis?.id || messages.length > 0) return;
    refreshAnalysis();
  }, [analysis?.id]);

  useEffect(() => {
    if (!analysis || !needsStageResume || streaming || formLoading) return;
    if (resumeAttempted.current) return;
    resumeAttempted.current = true;
    runStream(analysis.id, currentStage, { continueStage: false });
  }, [analysis, currentStage, needsStageResume, streaming, formLoading, runStream]);

  function handleNewIdea() {
    setAnalysis(null);
    setMessages([]);
    setStreamContent("");
    setError("");
  }

  if (analysis?.status === "completed") {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Анализ завершён</h2>
        <p className="text-mc-text-second mb-6">Все 15 этапов пройдены.</p>
        <div className="flex flex-col gap-3 max-w-xs mx-auto">
          <Button onClick={handleNewIdea} className="w-full">
            Начать новую идею
          </Button>
          <a
            href={`/api/analysis/${analysis.id}/pdf`}
            className="inline-block w-full py-2.5 px-4 rounded-md border border-mc-border text-sm font-medium hover:bg-mc-bg"
          >
            Скачать PDF
          </a>
          <a href="/dashboard/history" className="text-mc-primary font-medium text-sm">
            Смотреть в истории →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-4 p-3 bg-mc-error/10 text-mc-error text-sm rounded-md">
          {error}
        </div>
      )}
      {showForm && (
        <AnalysisForm onSubmit={handleFormSubmit} loading={formLoading || streaming} />
      )}
      {showPayment && analysis && (
        <PaymentGate analysisId={analysis.id} onPaid={refreshAnalysis} />
      )}
      {showChat && analysis && (
        <StageChat
          analysisId={analysis.id}
          stage={currentStage}
          messages={messages}
          streaming={streaming}
          streamContent={streamContent}
          onContinue={handleContinue}
          onReply={handleReply}
          continueLoading={streaming}
          replyLoading={replyLoading}
          canContinue={canContinue}
          repliesUsed={repliesUsed}
          needsResume={needsStageResume}
          onRetryStage={handleRetryStage}
        />
      )}
    </div>
  );
}
