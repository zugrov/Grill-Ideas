type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type StreamEvent = {
  delta?: string;
  done?: boolean;
  error?: boolean;
  error_code?: string;
};

// llm-router — общий сервис маршрутизации LLM для нескольких MVP (cfo-autopilot, grill,
// maxima consulting). Выбор конкретной модели — на стороне llm-router (task_type=chat),
// здесь модель не задаётся.
const LLM_ROUTER_URL = process.env.LLM_ROUTER_URL ?? "http://llm-router:8000";
const LLM_ROUTER_INTERNAL_SECRET = process.env.LLM_ROUTER_INTERNAL_SECRET ?? "";

export async function streamChatCompletion(
  messages: ChatMessage[],
  onChunk: (text: string) => void,
): Promise<string> {
  const res = await fetch(`${LLM_ROUTER_URL}/v1/complete/stream`, {
    method: "POST",
    headers: {
      "X-Internal-Secret": LLM_ROUTER_INTERNAL_SECRET,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      project: "grill",
      task_type: "chat",
      messages,
      max_tokens: 8000,
    }),
    signal: AbortSignal.timeout(9 * 60 * 1000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`llm-router error: ${res.status} ${err}`);
  }

  const reader = res.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  let full = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const data = trimmed.slice(6);

      let event: StreamEvent;
      try {
        event = JSON.parse(data);
      } catch {
        continue; // skip malformed SSE chunk
      }

      if (event.error) {
        throw new Error(`llm-router: ${event.error_code ?? "STREAM_INTERRUPTED"}`);
      }
      if (event.delta) {
        full += event.delta;
        onChunk(event.delta);
      }
    }
  }

  return full;
}
