// Cliente NVIDIA compartilhado (M1 do ADR). Sem "server-only" para rodar em `node --test`: só o servidor pode importá-lo (regra do ESLint).
// A chave sai de NVIDIA_API_KEY e vai apenas no cabeçalho Authorization; nenhuma mensagem de erro carrega corpo ou chave.
const NVIDIA_CHAT_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
export const NVIDIA_DEFAULT_MODEL = "z-ai/glm-5.3-flash";
export const NVIDIA_TIMEOUT_MS = 15_000;
export const NVIDIA_MAX_ATTEMPTS = 2;

export type NvidiaErrorCode = "not_configured" | "timeout" | "rate_limit" | "invalid_output" | "provider_error";
export class NvidiaError extends Error {
  readonly code: NvidiaErrorCode;
  constructor(code: NvidiaErrorCode) { super(code); this.code = code; }
}

export type NvidiaMessage = { role: "system" | "user" | "assistant"; content: string };
type NvidiaCompletion = { choices?: { message?: { content?: string | null } }[] };

/** Uma chamada de chat: até NVIDIA_MAX_ATTEMPTS tentativas (429, 5xx e rede/timeout), 4xx ≠ 429 não repete. Devolve o texto bruto e o modelo usado. */
export async function callNvidiaChat(input: { messages: NvidiaMessage[]; temperature: number; maxTokens: number; timeoutMs?: number }): Promise<{ content: string; model: string }> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new NvidiaError("not_configured");
  const model = process.env.NVIDIA_MODEL || NVIDIA_DEFAULT_MODEL;
  const timeoutMs = input.timeoutMs ?? NVIDIA_TIMEOUT_MS;
  const body = { model, temperature: input.temperature, top_p: 1, max_tokens: input.maxTokens, stream: false, messages: input.messages };

  try {
    let response: Response | null = null;
    for (let attempt = 0; attempt < NVIDIA_MAX_ATTEMPTS; attempt += 1) {
      try {
        response = await fetch(NVIDIA_CHAT_URL, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(timeoutMs),
        });
      } catch (error) {
        if (attempt < NVIDIA_MAX_ATTEMPTS - 1) continue;
        throw error;
      }
      if (response.ok || (response.status !== 429 && response.status < 500)) break;
    }
    if (!response) throw new NvidiaError("provider_error");
    if (response.status === 429) throw new NvidiaError("rate_limit");
    if (!response.ok) throw new NvidiaError("provider_error");
    const completion = await response.json() as NvidiaCompletion;
    const content = completion.choices?.[0]?.message?.content;
    if (!content) throw new NvidiaError("invalid_output");
    return { content, model };
  } catch (error) {
    if (error instanceof NvidiaError) throw error;
    if (error instanceof Error && ["AbortError", "TimeoutError"].includes(error.name)) throw new NvidiaError("timeout");
    throw new NvidiaError("provider_error");
  }
}
