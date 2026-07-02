import { STAGE_TITLES } from "@/lib/form-fields";
import type { Analysis, AnalysisMessage, ProjectInputData } from "@/lib/types";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function mdToHtml(md: string): string {
  let html = escapeHtml(md);
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\n/g, "<br>");
  return html;
}

function renderMessage(m: AnalysisMessage): string {
  if (m.role === "user") {
    return `
    <div class="user-msg">
      <p class="msg-label">Уточнение пользователя</p>
      <p>${escapeHtml(m.content).replace(/\n/g, "<br>")}</p>
    </div>`;
  }

  return `
    <div class="assistant-msg">
      <p class="msg-label">GRILL</p>
      <div class="content">${mdToHtml(m.content)}</div>
    </div>`;
}

export function buildReportHtml(
  analysis: Analysis,
  messages: AnalysisMessage[],
): string {
  const input = analysis.input_data as ProjectInputData;
  const title = input?.name?.trim() || "Анализ GRILL";
  const completed = analysis.completed_at
    ? new Date(analysis.completed_at).toLocaleDateString("ru-RU")
    : "—";

  const sorted = [...messages]
    .filter((m) => m.role !== "system")
    .sort((a, b) => {
      if (a.stage !== b.stage) return a.stage - b.stage;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  const stages = Array.from(new Set(sorted.map((m) => m.stage)))
    .sort((a, b) => a - b)
    .map((stageNum) => {
      const stageMessages = sorted.filter((m) => m.stage === stageNum);
      const body = stageMessages.map(renderMessage).join("");
      return `
    <section class="stage">
      <h2>Этап ${stageNum}: ${escapeHtml(STAGE_TITLES[stageNum] ?? "")}</h2>
      ${body}
    </section>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8"/>
  <title>${escapeHtml(title)} — GRILL IDEAS</title>
  <style>
    @page { margin: 20mm; }
    body {
      font-family: Inter, -apple-system, sans-serif;
      color: #111827;
      font-size: 11pt;
      line-height: 1.5;
    }
    .header {
      border-bottom: 3px solid #0d9488;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .brand { color: #0d9488; font-size: 10pt; text-transform: uppercase; letter-spacing: 0.05em; }
    h1 { font-size: 22pt; margin: 8px 0 4px; }
    .meta { color: #6b7280; font-size: 10pt; }
    .stage { page-break-inside: avoid; margin-bottom: 24px; }
    .stage h2 { color: #0d9488; font-size: 13pt; border-bottom: 1px solid #d1d5db; padding-bottom: 6px; }
    .user-msg {
      margin: 12px 0;
      padding: 10px 12px;
      background: #f0fdfa;
      border-left: 3px solid #0d9488;
    }
    .assistant-msg { margin: 12px 0; }
    .msg-label { font-size: 9pt; color: #6b7280; margin: 0 0 6px; text-transform: uppercase; }
    .content { margin-top: 4px; }
    .footer { margin-top: 32px; font-size: 9pt; color: #9ca3af; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">GRILL IDEAS · maxima consulting</div>
    <h1>${escapeHtml(title)}</h1>
    <p class="meta">Завершён: ${completed} · ${sorted.length} сообщений</p>
  </div>
  ${stages}
  <div class="footer">Сгенерировано GRILL IDEAS · maxima consulting</div>
</body>
</html>`;
}
