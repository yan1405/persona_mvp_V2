import assert from "node:assert/strict";
import test from "node:test";

import { callNvidiaChat, NVIDIA_DEFAULT_MODEL, NVIDIA_MAX_ATTEMPTS, NVIDIA_TIMEOUT_MS, NvidiaError, type NvidiaMessage } from "./nvidia-client.ts";

const KEY = "nvapi-chave-sintetica-de-teste";
const messages: NvidiaMessage[] = [{ role: "system", content: "sistema" }, { role: "user", content: "usuário" }];
const ok = (content: unknown) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });
const named = (name: string) => Object.assign(new Error(name), { name });

type Call = { url: string; init: RequestInit; signalLive: boolean };
// Provedor simulado: cada passo é uma Response, um erro lançado ou "hang" (só rejeita quando o signal aborta). Nenhuma rede é usada.
async function run(steps: (Response | Error | "hang")[], opts: { key?: string | null; model?: string; call?: Partial<Parameters<typeof callNvidiaChat>[0]>; fastTimeoutMs?: number } = {}) {
  const calls: Call[] = [], timeouts: number[] = [];
  const real = { fetch: globalThis.fetch, timeout: AbortSignal.timeout, key: process.env.NVIDIA_API_KEY, model: process.env.NVIDIA_MODEL };
  AbortSignal.timeout = (ms: number) => { timeouts.push(ms); return real.timeout.call(AbortSignal, opts.fastTimeoutMs ?? ms); };
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    const signal = init.signal;
    calls.push({ url, init, signalLive: signal instanceof AbortSignal && !signal.aborted });
    const step = steps[Math.min(calls.length, steps.length) - 1];
    if (step === "hang") {
      if (!(signal instanceof AbortSignal)) throw new Error("sem signal: a chamada ficaria pendurada");
      return new Promise<Response>((_, reject) => signal.addEventListener("abort", () => reject(signal.reason), { once: true }));
    }
    if (step instanceof Error) throw step;
    return step.clone();
  }) as typeof fetch;
  if (opts.key === null) delete process.env.NVIDIA_API_KEY; else process.env.NVIDIA_API_KEY = opts.key ?? KEY;
  if (opts.model === undefined) delete process.env.NVIDIA_MODEL; else process.env.NVIDIA_MODEL = opts.model;
  try {
    const outcome = await callNvidiaChat({ messages, temperature: 0.1, maxTokens: 321, ...opts.call }).then((value) => ({ value, error: undefined as unknown }), (error: unknown) => ({ value: undefined, error }));
    return { calls, timeouts, ...outcome };
  } finally {
    globalThis.fetch = real.fetch; AbortSignal.timeout = real.timeout;
    if (real.key === undefined) delete process.env.NVIDIA_API_KEY; else process.env.NVIDIA_API_KEY = real.key;
    if (real.model === undefined) delete process.env.NVIDIA_MODEL; else process.env.NVIDIA_MODEL = real.model;
  }
}
const code = (r: { error?: unknown }) => (r.error instanceof NvidiaError ? r.error.code : `outro:${String(r.error)}`);

test("parâmetros chegam ao corpo: mensagens, temperatura, max_tokens e modelo; chave só no cabeçalho", async () => {
  const r = await run([ok("{}")]);
  assert.deepEqual(r.value, { content: "{}", model: NVIDIA_DEFAULT_MODEL });
  assert.equal(r.calls.length, 1);
  const { init, url } = r.calls[0];
  assert.equal(url, "https://integrate.api.nvidia.com/v1/chat/completions");
  assert.equal(init.method, "POST");
  assert.equal((init.headers as Record<string, string>).Authorization, `Bearer ${KEY}`);
  assert.deepEqual(JSON.parse(String(init.body)), { model: NVIDIA_DEFAULT_MODEL, temperature: 0.1, top_p: 1, max_tokens: 321, stream: false, messages });
  assert.ok(!String(init.body).includes(KEY));
});

test("NVIDIA_MODEL substitui o modelo padrão", async () => {
  const r = await run([ok("{}")], { model: "outro/modelo" });
  assert.equal(r.value?.model, "outro/modelo");
  assert.equal(JSON.parse(String(r.calls[0].init.body)).model, "outro/modelo");
});

test("timeout: padrão de 15 s por tentativa, ou o valor da chamada; signal não abortado em toda tentativa", async () => {
  const padrao = await run([named("TimeoutError")]);
  assert.equal(code(padrao), "timeout");
  assert.equal(padrao.calls.length, NVIDIA_MAX_ATTEMPTS);
  assert.deepEqual(padrao.timeouts, [NVIDIA_TIMEOUT_MS, NVIDIA_TIMEOUT_MS]);
  assert.ok(padrao.calls.every((c) => c.signalLive));
  assert.equal(NVIDIA_TIMEOUT_MS, 15_000);
  assert.equal(NVIDIA_MAX_ATTEMPTS, 2);
  const custom = await run([named("AbortError")], { call: { timeoutMs: 4_000 } });
  assert.deepEqual(custom.timeouts, [4_000, 4_000]);
});

test("aborto real: chamada pendurada rejeita quando o signal dispara e vira timeout", async () => {
  const r = await run(["hang"], { fastTimeoutMs: 5 });
  assert.equal(code(r), "timeout");
  assert.equal(r.calls.length, NVIDIA_MAX_ATTEMPTS);
  assert.deepEqual(r.timeouts, [NVIDIA_TIMEOUT_MS, NVIDIA_TIMEOUT_MS]);
});

test("sem NVIDIA_API_KEY: not_configured sem chamar fetch", async () => {
  const r = await run([ok("{}")], { key: null });
  assert.equal(code(r), "not_configured");
  assert.equal(r.calls.length, 0);
});

test("429: duas tentativas e rate_limit; recupera se a segunda der certo", async () => {
  const limited = await run([new Response("", { status: 429 })]);
  assert.equal(code(limited), "rate_limit");
  assert.equal(limited.calls.length, NVIDIA_MAX_ATTEMPTS);
  const recovered = await run([new Response("", { status: 429 }), ok("{}")]);
  assert.equal(recovered.value?.content, "{}");
  assert.equal(recovered.calls.length, 2);
});

test("5xx e erro de rede: duas tentativas e provider_error; 4xx ≠ 429 não repete", async () => {
  for (const step of [new Response("", { status: 503 }), new TypeError("fetch failed")]) {
    const r = await run([step]);
    assert.equal(code(r), "provider_error");
    assert.equal(r.calls.length, NVIDIA_MAX_ATTEMPTS);
  }
  for (const status of [400, 401, 403, 404]) {
    const r = await run([new Response("", { status })]);
    assert.equal(code(r), "provider_error");
    assert.equal(r.calls.length, 1);
  }
});

test("sem choices, conteúdo vazio ou nulo: invalid_output; corpo não-JSON: provider_error; nenhum erro carrega a chave", async () => {
  for (const response of [new Response("{}", { status: 200 }), new Response(JSON.stringify({ choices: [] }), { status: 200 }), ok(""), ok(null)]) {
    assert.equal(code(await run([response])), "invalid_output");
  }
  const bad = await run([new Response("<html>", { status: 200 })]);
  assert.equal(code(bad), "provider_error");
  assert.ok(!(bad.error as Error).message.includes(KEY));
});
