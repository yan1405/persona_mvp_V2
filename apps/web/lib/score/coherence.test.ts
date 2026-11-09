import assert from "node:assert/strict";
import test from "node:test";

import { COHERENCE_RESPONSE_SCHEMA, COHERENCE_RUBRIC_VERSION } from "./coherence-schema.ts";
import { analyzeCoherence, CoherenceAnalysisError } from "./coherence.ts";

const KEY = "nvapi-chave-sintetica-de-teste";
const E1 = "11111111-1111-4111-8111-111111111111", E2 = "22222222-2222-4222-8222-222222222222";
const evidence = (id: string, title: string) => ({ id, title, context: "Projeto em consultoria", action: "Estruturei um fluxo de IA", result: "Reduzi o trabalho manual", learning: null, competencies: ["Comunicação"] });
const input = { objective: "Atuar com automação de processos", evidences: [evidence(E1, "Automação de atendimento"), evidence(E2, "Organização interna")] };
const criterion = (score: number, ids: string[] = [E1]) => ({ score, explanation: "Explicação objetiva do critério.", evidence_ids: ids });
const output = (over: Record<string, unknown> = {}) => ({ summary: "Narrativa coerente com o objetivo.", criteria: { alignment: criterion(75), connection: criterion(50, [E1, E2]), specificity: criterion(100), recurrence: criterion(25, [E2]) }, ...over });
const ok = (content: unknown) => new Response(JSON.stringify({ choices: [{ message: { content: typeof content === "string" || content === null ? content : JSON.stringify(content) } }] }), { status: 200 });
const named = (name: string) => Object.assign(new Error(name), { name });

type Call = { url: string; init: RequestInit };
// Provedor simulado: sem rede, sem chave real. Registra chamadas e o timeout pedido ao AbortSignal.
async function run(steps: (Response | Error)[], opts: { nvidiaKey?: string | null; groqKey?: string } = {}) {
  const calls: Call[] = [], timeouts: number[] = [];
  const real = { fetch: globalThis.fetch, timeout: AbortSignal.timeout, nvidia: process.env.NVIDIA_API_KEY, groq: process.env.GROQ_API_KEY };
  AbortSignal.timeout = (ms: number) => { timeouts.push(ms); return real.timeout.call(AbortSignal, ms); };
  globalThis.fetch = (async (url: string, init: RequestInit) => {
    calls.push({ url, init });
    const step = steps[Math.min(calls.length, steps.length) - 1];
    if (step instanceof Error) throw step;
    return step.clone();
  }) as typeof fetch;
  if (opts.nvidiaKey === null) delete process.env.NVIDIA_API_KEY; else process.env.NVIDIA_API_KEY = opts.nvidiaKey ?? KEY;
  if (opts.groqKey === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = opts.groqKey;
  try {
    const outcome = await analyzeCoherence(input).then((value) => ({ value, error: undefined as unknown }), (error: unknown) => ({ value: undefined, error }));
    return { calls, timeouts, ...outcome };
  } finally {
    globalThis.fetch = real.fetch; AbortSignal.timeout = real.timeout;
    if (real.nvidia === undefined) delete process.env.NVIDIA_API_KEY; else process.env.NVIDIA_API_KEY = real.nvidia;
    if (real.groq === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = real.groq;
  }
}
const code = (r: { error?: unknown }) => (r.error instanceof CoherenceAnalysisError ? r.error.code : `outro:${String(r.error)}`);

test("rubrica coherence-v1 e discretização 0/25/50/75/100 inalteradas", () => {
  assert.equal(COHERENCE_RUBRIC_VERSION, "coherence-v1");
  const score = COHERENCE_RESPONSE_SCHEMA.properties.criteria.properties.alignment.properties.score;
  assert.deepEqual(score.enum, [0, 25, 50, 75, 100]);
});

test("sucesso: nota ponderada 35/25/25/15, pedido NVIDIA com esquema no prompt, sem response_format, chave só no cabeçalho", async () => {
  const r = await run([ok(output())]);
  assert.equal(r.calls.length, 1);
  assert.equal(r.value?.score, Math.round(75 * 0.35 + 50 * 0.25 + 100 * 0.25 + 25 * 0.15));
  assert.deepEqual([...(r.value?.evidenceIds ?? [])].sort(), [E1, E2]);
  const { url, init } = r.calls[0];
  assert.equal(url, "https://integrate.api.nvidia.com/v1/chat/completions");
  assert.equal((init.headers as Record<string, string>).Authorization, `Bearer ${KEY}`);
  const body = JSON.parse(String(init.body));
  assert.equal(body.temperature, 0.1);
  assert.equal(body.max_tokens, 1_600);
  assert.equal("response_format" in body, false);
  assert.ok(body.messages[0].content.includes(JSON.stringify(COHERENCE_RESPONSE_SCHEMA)));
  assert.equal(JSON.parse(body.messages[1].content).objetivo, input.objective);
  assert.ok(!String(init.body).includes(KEY));
  assert.deepEqual(r.timeouts, [12_000]);
});

test("sem NVIDIA_API_KEY: not_configured sem chamar fetch, mesmo com GROQ_API_KEY (sem fallback entre provedores)", async () => {
  const r = await run([ok(output())], { nvidiaKey: null, groqKey: "gsk_chave_sintetica" });
  assert.equal(code(r), "not_configured");
  assert.equal(r.calls.length, 0);
});

test("timeout: duas tentativas de 12 s e code=timeout", async () => {
  for (const name of ["AbortError", "TimeoutError"]) {
    const r = await run([named(name)]);
    assert.equal(code(r), "timeout");
    assert.equal(r.calls.length, 2);
    assert.deepEqual(r.timeouts, [12_000, 12_000]);
  }
});

test("429: rate_limit; 5xx e rede: provider_error; 4xx não repete", async () => {
  const limited = await run([new Response("", { status: 429 })]);
  assert.equal(code(limited), "rate_limit");
  assert.equal(limited.calls.length, 2);
  for (const step of [new Response("", { status: 503 }), new TypeError("fetch failed")]) {
    const r = await run([step]);
    assert.equal(code(r), "provider_error");
    assert.equal(r.calls.length, 2);
  }
  const client = await run([new Response("", { status: 401 })]);
  assert.equal(code(client), "provider_error");
  assert.equal(client.calls.length, 1);
});

test("saída inválida vira invalid_output e não carrega a chave", async () => {
  const c = output().criteria;
  const bad: unknown[] = [
    "texto livre", "[]", "{}",
    output({ summary: "curto" }),
    output({ criteria: { ...c, alignment: criterion(60) } }), // fora de 0/25/50/75/100
    output({ criteria: { ...c, alignment: criterion(75.5) } }),
    output({ criteria: { alignment: c.alignment, connection: c.connection, specificity: c.specificity } }), // falta recurrence
    output({ criteria: { ...c, alignment: { score: 75, explanation: "ok", evidence_ids: [E1] } } }), // explicação curta
    output({ criteria: { ...c, alignment: criterion(75, ["33333333-3333-4333-8333-333333333333"]) } }), // ID fora da entrada
    output({ criteria: { ...c, alignment: criterion(75, ["nao-e-uuid"]) } }),
    output({ criteria: { alignment: criterion(75, []), connection: criterion(50, []), specificity: criterion(100, []), recurrence: criterion(25, []) } }), // nenhuma evidência citada
  ];
  for (const content of bad) {
    const r = await run([ok(content)]);
    assert.equal(code(r), "invalid_output", JSON.stringify(content));
    assert.equal(r.calls.length, 1);
    assert.ok(!(r.error as Error).message.includes(KEY));
  }
  for (const response of [new Response("{}", { status: 200 }), new Response(JSON.stringify({ choices: [] }), { status: 200 }), ok(null), ok("")]) {
    assert.equal(code(await run([response])), "invalid_output");
  }
  assert.equal(code(await run([new Response("<html>", { status: 200 })])), "provider_error");
});
