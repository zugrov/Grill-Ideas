"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  MAX_REPLIES_PER_STAGE,
  stageLabel,
} from "@/lib/analysis";
import type { AnalysisMessage } from "@/lib/types";
import { StreamingMarkdown } from "@/components/StreamingMarkdown";
import { Button } from "@/components/ui/Button";

type StageChatProps = {
  analysisId: string;
  stage: number;
  messages: AnalysisMessage[];
  streaming: boolean;
  streamContent: string;
  onContinue: () => void;
  onReply: (text: string) => void;
  continueLoading?: boolean;
  replyLoading?: boolean;
  canContinue: boolean;
  repliesUsed: number;
  needsResume?: boolean;
  onRetryStage?: () => void;
};

export function StageChat({
  stage,
  messages,
  streaming,
  streamContent,
  onContinue,
  onReply,
  continueLoading,
  replyLoading,
  canContinue,
  repliesUsed,
  needsResume,
  onRetryStage,
}: StageChatProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent, streaming]);

  const stageThread = messages
    .filter((m) => m.stage === stage && m.role !== "system")
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

  const hasAssistantOnStage = stageThread.some((m) => m.role === "assistant");
  const repliesLeft = MAX_REPLIES_PER_STAGE - repliesUsed;
  const canReply =
    hasAssistantOnStage &&
    !needsResume &&
    !streaming &&
    repliesLeft > 0 &&
    !replyLoading;

  const isEmpty =
    stageThread.length === 0 && !streamContent && !streaming;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = replyText.trim();
    if (!text || !canReply) return;
    setReplyText("");
    onReply(text);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">
            Этап {stage}: {stageLabel(stage)}
          </h2>
          {needsResume && !streaming && (
            <p className="text-xs text-mc-text-muted mt-1">
              Запускаем анализ этапа...
            </p>
          )}
        </div>
        {streaming && (
          <span className="text-xs text-mc-primary animate-pulse">Генерация...</span>
        )}
      </div>
      {streaming && (
        <p className="text-xs text-mc-text-muted -mt-4">
          Генерация может занять несколько минут — не закрывайте страницу.
        </p>
      )}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
        {isEmpty && needsResume && (
          <p className="text-sm text-mc-text-muted">Подготовка ответа модели...</p>
        )}
        {stageThread.map((m) => (
          <div
            key={m.id}
            className={
              m.role === "user"
                ? "ml-8 bg-mc-primary/10 border border-mc-primary/20 rounded-lg p-4"
                : "bg-mc-card border border-mc-border rounded-lg p-5"
            }
          >
            <p className="text-xs text-mc-text-muted mb-3">
              {m.role === "user" ? "Вы" : `GRILL · этап ${m.stage}`}
            </p>
            {m.role === "user" ? (
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            ) : (
              <StreamingMarkdown content={m.content} />
            )}
          </div>
        ))}
        {streaming && streamContent && (
          <div className="bg-mc-card border border-mc-primary/30 rounded-lg p-5">
            <StreamingMarkdown content={streamContent} />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {hasAssistantOnStage && !needsResume && (
        <div className="space-y-3 border-t border-mc-border pt-4">
          {canReply ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block text-sm font-medium">
                Ваш ответ или уточнение
              </label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Дополните данные, исправьте факты, ответьте на вопросы модели..."
                rows={4}
                disabled={!canReply}
                className="w-full rounded-md border border-mc-border bg-mc-card px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-mc-primary/30 disabled:opacity-50"
              />
              <p className="text-xs text-mc-text-muted">
                На каждом этапе можно отправить до {MAX_REPLIES_PER_STAGE}{" "}
                уточнений. Осталось: {repliesLeft}
              </p>
              <Button
                type="submit"
                disabled={!canReply || !replyText.trim()}
                className="w-full"
              >
                {replyLoading ? "Отправляем..." : "Отправить уточнение"}
              </Button>
            </form>
          ) : repliesLeft <= 0 ? (
            <p className="text-sm text-mc-text-muted">
              Лимит ответов на этом этапе исчерпан ({MAX_REPLIES_PER_STAGE} из{" "}
              {MAX_REPLIES_PER_STAGE}). Нажмите «Продолжить», чтобы перейти дальше.
            </p>
          ) : null}
        </div>
      )}

      {canContinue && !streaming && (
        <Button onClick={onContinue} disabled={continueLoading} className="w-full">
          {continueLoading ? "Запуск..." : "Продолжить → следующий этап"}
        </Button>
      )}
      {needsResume && !streaming && !canContinue && onRetryStage && (
        <Button onClick={onRetryStage} variant="secondary" className="w-full">
          Запустить этап заново
        </Button>
      )}
    </div>
  );
}
