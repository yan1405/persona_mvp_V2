import assert from "node:assert/strict";
import test from "node:test";

import { describeLiveFailure, generateLiveResponse, LiveGenerationError } from "./nvidia-chat.ts";

const KEY = "nvapi-chave-sintetica-de-teste";
const evidences = [{ id: "11111111-1111-1111-1111-111111111111", title: "Automação de atendimento", context: "Projeto em consultoria", action: "Estruturei um fluxo de IA", result: "Reduzi o trabalho manual", learning: null, competencies: ["Comunicação"] }];
const input = { question: "Fale de uma experiência com automação", targetRole: "Analista", company: "Acme", description: null, evidences, mode: "initial" as const };
const valid = { intent: "behavioral", supported: true, primary_evidence_id: evidences[0].id, draft: "ignorado", target_duration_seconds: 30, gap: null,
  arguments: [{ text: "Estruturei um fluxo de IA", evidence_id: evidences[0].id, source_field: "action", source_excerpt: "Estruturei um fluxo de IA" }] };
const completion = (content: unknown) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });

type Call = { url: string; init: RequestInit };
type Outcome = { value?: Awaited<ReturnType<typeof generateLiveResponse>>; error?: unknown };
// Simula o provedor: cada item é uma Response ou um erro lançado; nenhuma rede é usada.
async function run(steps: (Response | Error)[], env: string | null = KEY) {
  const calls: Call[] = [];
  const realFetch = globalThis.fetch, realKey = process.env.NVIDIA_API_KEY;
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const step = steps[Math.min(calls.length, steps.length) - 1];
    if (step instanceof Error) throw step;
    return step.clone();
  }) as typeof fetch;
  if (env === null) delete process.env.NVIDIA_API_KEY; else process.env.NVIDIA_API_KEY = env;
  try {
    const result = await generateLiveResponse(input).then((value): Outcome => ({ value }), (error: unknown): Outcome => ({ error }));
    return { calls, ...result };
  } finally {
    globalThis.fetch = realFetch;
    if (realKey === undefined) delete process.env.NVIDIA_API_KEY; else process.env.NVIDIA_API_KEY = realKey;
  }
}
const code = (r: { error?: unknown }) => (r.error instanceof LiveGenerationError ? r.error.code : `outro:${String(r.error)}`);
const named = (name: string) => Object.assign(new Error(name), { name });

test("sucesso: JSON válido, uma chamada, chave só no cabeçalho Authorization", async () => {
  const r = await run([completion(JSON.stringify(valid))]);
  assert.equal(r.calls.length, 1);
  assert.equal(r.value?.response.supported, true);
  assert.equal(r.value?.model, "z-ai/glm-5.3-flash");
  const { init, url } = r.calls[0];
  assert.equal(url, "https://integrate.api.nvidia.com/v1/chat/completions");
  assert.equal((init.headers as Record<string, string>).Authorization, `Bearer ${KEY}`);
  assert.ok(!String(init.body).includes(KEY));
});

test("sem NVIDIA_API_KEY: not_configured sem chamar fetch", async () => {
  const r = await run([completion("{}")], null);
  assert.equal(code(r), "not_configured");
  assert.equal(r.calls.length, 0);
});

test("timeout (AbortError/TimeoutError): duas tentativas e code=timeout", async () => {
  for (const name of ["AbortError", "TimeoutError"]) {
    const r = await run([named(name)]);
    assert.equal(code(r), "timeout");
    assert.equal(r.calls.length, 2);
  }
});

test("429: duas tentativas e rate_limit; 429 seguido de sucesso recupera", async () => {
  const limited = await run([new Response("", { status: 429 })]);
  assert.equal(code(limited), "rate_limit");
  assert.equal(limited.calls.length, 2);
  const recovered = await run([new Response("", { status: 429 }), completion(JSON.stringify(valid))]);
  assert.equal(recovered.calls.length, 2);
  assert.equal(recovered.value?.response.supported, true);
});

test("5xx e erro de rede: duas tentativas e provider_error", async () => {
  const server = await run([new Response("", { status: 503 })]);
  assert.equal(code(server), "provider_error");
  assert.equal(server.calls.length, 2);
  const network = await run([new TypeError("fetch failed")]);
  assert.equal(code(network), "provider_error");
  assert.equal(network.calls.length, 2);
});

test("4xx diferente de 429: provider_error sem repetir", async () => {
  for (const status of [400, 401, 403, 404]) {
    const r = await run([new Response("", { status })]);
    assert.equal(code(r), "provider_error");
    assert.equal(r.calls.length, 1);
  }
});

test("saída sem choices, content vazio ou nulo: invalid_output", async () => {
  for (const response of [new Response("{}", { status: 200 }), completion(""), completion(null), new Response(JSON.stringify({ choices: [] }), { status: 200 })]) {
    assert.equal(code(await run([response])), "invalid_output");
  }
});

test("corpo 200 que não é JSON: provider_error (sem vazar a chave)", async () => {
  const r = await run([new Response("<html>", { status: 200 })]);
  assert.equal(code(r), "provider_error");
  assert.ok(!String((r.error as Error).message).includes(KEY));
});

test("conteúdo reprovado pelo parser: invalid_output", async () => {
  const bad = [
    "texto livre", "[]", JSON.stringify({ ...valid, intent: "x" }),
    JSON.stringify({ ...valid, arguments: [{ ...valid.arguments[0], source_excerpt: "trecho inventado" }] }),
    JSON.stringify({ ...valid, arguments: [{ ...valid.arguments[0], evidence_id: "outro-id" }] }),
    JSON.stringify({ ...valid, supported: false }),
  ];
  for (const content of bad) {
    const r = await run([completion(content)]);
    assert.equal(code(r), "invalid_output", content);
    assert.equal(r.calls.length, 1);
    assert.ok(!(r.error as Error).message.includes(KEY));
  }
});

test("describeLiveFailure: mensagem por código e fail_live_question só no modo inicial", () => {
  const timeout = describeLiveFailure("initial", new LiveGenerationError("timeout"));
  assert.equal(timeout.code, "timeout");
  assert.match(timeout.message, /demorou além do limite/);
  for (const c of ["not_configured", "rate_limit", "invalid_output", "provider_error"] as const) {
    const f = describeLiveFailure("initial", new LiveGenerationError(c));
    assert.equal(f.code, c);
    assert.match(f.message, /Não foi possível gerar com segurança/);
  }
  assert.equal(describeLiveFailure("initial", new Error("boom")).code, "provider_error");
  assert.equal(describeLiveFailure("initial", "x").markQuestionFailed, true);
  for (const mode of ["shorter", "deeper", "alternative"] as const) assert.equal(describeLiveFailure(mode, new LiveGenerationError("timeout")).markQuestionFailed, false);
});
