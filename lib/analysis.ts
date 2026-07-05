import { STAGE_TITLES } from "@/lib/form-fields";
import { isPaidAnalysisStatus } from "@/lib/payment-state";
import type { Analysis, AnalysisMessage, AnalysisStatus } from "@/lib/types";

export const MAX_FREE_STAGE = 1;
export const MAX_STAGE = 14;
export const MAX_REPLIES_PER_STAGE = 5;
export const PAYMENT_AMOUNT = 999;

export function canRunStage(
  analysis: Analysis,
  stage: number,
  paymentSucceeded: boolean,
): { ok: boolean; error?: string } {
  if (stage < 0 || stage > MAX_STAGE) {
    return { ok: false, error: "Неверный этап" };
  }

  if (stage <= MAX_FREE_STAGE) {
    return { ok: true };
  }

  if (!paymentSucceeded) {
    return { ok: false, error: "Требуется оплата для этапов 2–14" };
  }

  if (!isPaidAnalysisStatus(analysis.status)) {
    return { ok: false, error: "Анализ не в оплаченном статусе" };
  }

  return { ok: true };
}

export function nextStatusAfterStage(
  stage: number,
  current: AnalysisStatus,
  isVip = false,
): AnalysisStatus {
  if (stage === MAX_STAGE) return "completed";

  if (isPaidAnalysisStatus(current)) {
    return current === "completed" ? "completed" : "paid_in_progress";
  }

  if (stage === MAX_FREE_STAGE && current === "free_in_progress") {
    return isVip ? "paid_in_progress" : "awaiting_payment";
  }

  if (stage <= MAX_FREE_STAGE) return "free_in_progress";
  return "paid_in_progress";
}

export function countUserRepliesOnStage(
  messages: AnalysisMessage[],
  stage: number,
): number {
  return messages.filter((m) => m.role === "user" && m.stage === stage).length;
}

export function getStageMessages(
  messages: AnalysisMessage[],
  stage: number,
): AnalysisMessage[] {
  return messages.filter((m) => m.stage === stage);
}

export function buildStageReplyMessages(
  systemPrompt: string,
  stageHistory: AnalysisMessage[],
  replyInstruction: string,
): { role: "system" | "user" | "assistant"; content: string }[] {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [{ role: "system", content: systemPrompt }];

  for (let i = 0; i < stageHistory.length; i++) {
    const msg = stageHistory[i];
    if (msg.role === "system") continue;

    const isLastUser =
      i === stageHistory.length - 1 && msg.role === "user";
    messages.push({
      role: msg.role,
      content: isLastUser
        ? `${msg.content}\n\n${replyInstruction}`
        : msg.content,
    });
  }

  return messages;
}

export function buildOpenRouterMessages(
  systemPrompt: string,
  history: AnalysisMessage[],
  userContent: string,
): { role: "system" | "user" | "assistant"; content: string }[] {
  const messages: { role: "system" | "user" | "assistant"; content: string }[] =
    [{ role: "system", content: systemPrompt }];

  for (const msg of history) {
    if (msg.role === "system") continue;
    messages.push({ role: msg.role, content: msg.content });
  }

  messages.push({ role: "user", content: userContent });
  return messages;
}

export function stageLabel(stage: number): string {
  return STAGE_TITLES[stage] ?? `Этап ${stage}`;
}

export function hasAssistantMessageForStage(
  messages: AnalysisMessage[],
  stage: number,
): boolean {
  return messages.some((m) => m.role === "assistant" && m.stage === stage);
}

export function hasPaidStageAccess(analysis: Analysis, isVip: boolean): boolean {
  return isVip || isPaidAnalysisStatus(analysis.status);
}

export type StageNavStatus = "done" | "current" | "locked" | "upcoming";

export function getStageNavStatus(
  stage: number,
  analysis: Analysis,
  messages: AnalysisMessage[],
  isVip: boolean,
): StageNavStatus {
  if (stage > MAX_FREE_STAGE && !hasPaidStageAccess(analysis, isVip)) {
    return "locked";
  }

  if (stage === analysis.current_stage) {
    return "current";
  }

  if (hasAssistantMessageForStage(messages, stage)) {
    return "done";
  }

  return "upcoming";
}

export function isStageNavClickable(
  status: StageNavStatus,
  messages: AnalysisMessage[],
  stage: number,
): boolean {
  return status === "done" && hasAssistantMessageForStage(messages, stage);
}

export function countCompletedStages(messages: AnalysisMessage[]): number {
  let count = 0;
  for (let stage = 0; stage <= MAX_STAGE; stage++) {
    if (hasAssistantMessageForStage(messages, stage)) {
      count++;
    }
  }
  return count;
}

export const STAGE_NUMBERS = Array.from({ length: MAX_STAGE + 1 }, (_, i) => i);
