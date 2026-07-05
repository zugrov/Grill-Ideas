"use client";

import {
  STAGE_NUMBERS,
  getStageNavStatus,
  isStageNavClickable,
  stageLabel,
} from "@/lib/analysis";
import type { Analysis, AnalysisMessage } from "@/lib/types";

type StageSidebarProps = {
  analysis: Analysis;
  messages: AnalysisMessage[];
  currentStage: number;
  viewingStage: number;
  isVip: boolean;
  mobileOpen: boolean;
  onSelectStage: (stage: number) => void;
  onMobileClose: () => void;
};

function StageList({
  analysis,
  messages,
  currentStage,
  viewingStage,
  isVip,
  onSelectStage,
}: Omit<StageSidebarProps, "mobileOpen" | "onMobileClose">) {
  return (
    <nav aria-label="Этапы анализа">
      <p className="text-xs font-semibold uppercase tracking-widest text-mc-text-muted mb-3">
        Этапы анализа
      </p>
      <ul className="space-y-1">
        {STAGE_NUMBERS.map((stage) => {
          const status = getStageNavStatus(stage, analysis, messages, isVip);
          const clickable = isStageNavClickable(status, messages, stage);
          const isViewing = viewingStage === stage;
          const isCurrent = currentStage === stage;

          return (
            <li key={stage}>
              <button
                type="button"
                disabled={!clickable}
                onClick={() => clickable && onSelectStage(stage)}
                className={[
                  "w-full text-left rounded-md px-3 py-2 text-sm transition-colors",
                  isViewing
                    ? "bg-mc-primary/15 border border-mc-primary/30 text-mc-text"
                    : "border border-transparent",
                  clickable
                    ? "hover:bg-mc-bg cursor-pointer"
                    : "cursor-default opacity-60",
                  isCurrent && !isViewing ? "ring-1 ring-mc-primary/40" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="flex items-start gap-2">
                  <span className="shrink-0 w-5 text-xs font-mono text-mc-text-muted pt-0.5">
                    {status === "locked"
                      ? "🔒"
                      : status === "current"
                        ? "●"
                        : status === "done"
                          ? "✓"
                          : "○"}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs text-mc-text-muted">
                      Этап {stage}
                    </span>
                    <span className="block leading-snug">{stageLabel(stage)}</span>
                    {status === "locked" && (
                      <span className="block text-[0.65rem] text-mc-text-muted mt-0.5">
                        после оплаты
                      </span>
                    )}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function StageSidebar({
  analysis,
  messages,
  currentStage,
  viewingStage,
  isVip,
  mobileOpen,
  onSelectStage,
  onMobileClose,
}: StageSidebarProps) {
  const listProps = {
    analysis,
    messages,
    currentStage,
    viewingStage,
    isVip,
    onSelectStage,
  };

  return (
    <>
      <aside className="hidden md:block w-60 shrink-0">
        <div className="sticky top-4 max-h-[calc(100vh-6rem)] overflow-y-auto pr-1">
          <StageList {...listProps} />
        </div>
      </aside>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Закрыть меню этапов"
            className="absolute inset-0 bg-black/40"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-mc-card border-r border-mc-border shadow-xl overflow-y-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-sm">Этапы</p>
              <button
                type="button"
                onClick={onMobileClose}
                className="text-sm text-mc-text-muted hover:text-mc-text px-2 py-1"
              >
                Закрыть
              </button>
            </div>
            <StageList {...listProps} />
          </aside>
        </div>
      )}
    </>
  );
}
