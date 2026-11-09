import assert from "node:assert/strict";
import test from "node:test";

import { EVIDENCE_RESPONSE_SCHEMA } from "./evidence-schema.ts";
import { StructureEvidenceError, structureEvidence } from "./structure-evidence.ts";

const KEY = "nvapi-chave-sintetica-de-teste";
const input = { content: "Reorganizei a fila de atendimento do time e documentei o fluxo.", context: "Consultoria" };
const suggestion = (over: Record<string, unknown> = {}) => ({
  title: "Reorganização da fila de atendimento", context: "Consultoria", challenge: null, action: "Reorganizei a fila e documentei o fluxo.",
  result: null, competencies: ["Organização", "Documentação"], learning: null, unsupported_fields: ["challenge", "result", "learning"], ...over,
});
const output = (over: Record<string, unknown> = {}) => ({ useful: true, reason: null, suggestions: [suggestion()], ...over });
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
    const outcome = await structureEvidence(input).then((value) => ({ value, error: undefined as unknown }), (error: unknown) => ({ value: undefined, error }));
    return { calls, timeouts, ...outcome };
  } finally {
    globalThis.fetch = real.fetch; AbortSignal.timeout = real.timeout;
    if (real.nvidia === undefined) delete process.env.NVIDIA_API_KEY; else process.env.NVIDIA_API_KEY = real.nvidia;
    if (real.groq === undefined) delete process.env.GROQ_API_KEY; else process.env.GROQ_API_KEY = real.groq;
  }
}
const code = (r: { error?: unknown }) => (r.error instanceof StructureEvidenceError ? r.error.code : `outro:${String(r.error)}`);

test("sucesso: pedido NVIDIA com esquema no prompt, sem response_format, chave só no cabeçalho; campos sem sustentação ficam null", async () => {
  const r = await run([ok(output())]);
  assert.equal(r.calls.length, 1);
  assert.equal(r.value?.useful, true);
  const [first] = r.value?.suggestions ?? [];
  assert.equal(first.challenge, null);
  assert.equal(first.result, null);
  assert.equal(first.learning, null);
  assert.deepEqual(first.unsupported_fields, ["challenge", "result", "learning"]);
  const { url, init } = r.calls[0];
  assert.equal(url, "https://integrate.api.nvidia.com/v1/chat/completions");
  assert.equal((init.headers as Record<string, string>).Authorization, `Bearer ${KEY}`);
  const body = JSON.parse(String(init.body));
  assert.equal(body.temperature, 0.1);
  assert.equal(body.max_tokens, 1_400);
  assert.equal("response_format" in body, false);
  assert.ok(body.messages[0].content.includes(JSON.stringify(EVIDENCE_RESPONSE_SCHEMA)));
  assert.deepEqual(JSON.parse(body.messages[1].content), { contexto_declarado: "Consultoria", relato_original: input.content });
  assert.ok(!String(init.body).includes(KEY));
  assert.deepEqual(r.timeouts, [12_000]);
});

test("relato sem ação profissional: useful=false com suggestions=[] é aceito; useful incoerente com a lista é inválido", async () => {
  const none = await run([ok({ useful: false, reason: "Sem ação profissional identificável.", suggestions: [] })]);
  assert.deepEqual(none.value, { useful: false, reason: "Sem ação profissional identificável.", suggestions: [] });
  assert.equal(code(await run([ok({ useful: false, reason: null, suggestions: [suggestion()] })])), "invalid_output");
  assert.equal(code(await run([ok({ useful: true, reason: null, suggestions: [] })])), "invalid_output");
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
  const bad: unknown[] = [
    "texto livre", "[]", "{}",
    output({ suggestions: [suggestion({ title: "ab" })] }),
    output({ suggestions: [suggestion({ result: 42 })] }),
    output({ suggestions: [suggestion({ unsupported_fields: ["inventado"] })] }),
    output({ suggestions: [suggestion({ competencies: "Organização" })] }),
    output({ suggestions: [suggestion(), suggestion(), suggestion(), suggestion()] }),
    output({ suggestions: [suggestion({ action: "x".repeat(801) })] }),
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

test("cerca Markdown: JSON dentro de uma cerca inteira dá o mesmo resultado do JSON puro; texto fora da cerca continua inválido", async () => {
  const json = JSON.stringify(output());
  const plain = await run([ok(json)]);
  for (const fenced of ["```json\n" + json + "\n```", "```\n" + json + "\n```", "  ```JSON\r\n" + json + "\r\n```\n\n", "```json\n" + JSON.stringify(output(), null, 2) + "```"]) {
    const r = await run([ok(fenced)]);
    assert.deepEqual(r.value, plain.value, fenced);
    assert.equal(r.calls.length, 1);
  }
  const bad = [
    "Aqui está:\n```json\n" + json + "\n```",
    "```json\n" + json + "\n```\nEspero ter ajudado.",
    "```json\n" + json + "\n```\n```json\n" + json + "\n```",
    "```json\n" + json,
    "```json\n```",
    "```js\n" + json + "\n```",
    "```json\n" + JSON.stringify(output({ suggestions: [suggestion({ title: "ab" })] })) + "\n```", // conteúdo continua estrito
  ];
  for (const content of bad) {
    const r = await run([ok(content)]);
    assert.equal(code(r), "invalid_output", content);
    assert.equal(r.calls.length, 1);
  }
});
