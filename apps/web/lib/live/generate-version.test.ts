import assert from "node:assert/strict";
import test from "node:test";

import { runGenerateVersion, type GenerateVersionDeps, type LiveMode } from "./generate-version.ts";
import { describeLiveFailure, LIVE_PROMPT_VERSION, LiveGenerationError } from "./nvidia-chat.ts";

const E1 = "11111111-1111-1111-1111-111111111111", E2 = "22222222-2222-2222-2222-222222222222";
const evidence = (id: string, title: string) => ({ id, title, context: "Projeto em consultoria", action: "Estruturei um fluxo de IA", result: "Reduzi o trabalho manual", learning: null, competencies: ["Comunicação"], updated_at: "2026-08-10T00:00:00Z" });
const question = (status = "active") => ({ id: "q1", session_id: "s1", question_text: "Fale de automação com IA", primary_evidence_id: E1, live_sessions: { target_role: "Analista", company: "Acme", opportunity_description: null, status } });
const response = (over: Record<string, unknown> = {}) => ({ intent: "behavioral", supported: true, primary_evidence_id: E1, target_duration_seconds: 30, gap: null, draft: "Na minha experiência: Estruturei um fluxo de IA.",
  arguments: [{ text: "a", evidence_id: E1, source_field: "action", source_excerpt: "Estruturei um fluxo de IA" }, { text: "b", evidence_id: E1, source_field: "result", source_excerpt: "Reduzi o trabalho manual" }, { text: "c", evidence_id: E2, source_field: "action", source_excerpt: "Estruturei um fluxo de IA" }], ...over });

type Setup = { question?: unknown; links?: { evidence_id: string; recommendation_score: number }[]; evidences?: unknown[]; rpcErrors?: Record<string, unknown>; generate?: () => Promise<unknown> };
type Query = { table: string; filters: { method: "eq" | "is" | "in"; column: string; value: unknown }[] };
// Fakes sem rede, chave ou banco: o builder devolve o dado da tabela em maybeSingle() ou ao ser aguardado.
function setup(o: Setup = {}) {
  const rpcs: { fn: string; args: Record<string, unknown> }[] = [];
  const generated: Record<string, unknown>[] = [];
  const queries: Query[] = [];
  const tables: Record<string, unknown> = {
    live_questions: "question" in o ? o.question : question(),
    live_session_evidences: o.links ?? [{ evidence_id: E1, recommendation_score: 5 }, { evidence_id: E2, recommendation_score: 3 }],
    evidences: o.evidences ?? [evidence(E1, "Automação de atendimento"), evidence(E2, "Organização interna")],
  };
  const builder = (table: string) => {
    const query: Query = { table, filters: [] };
    queries.push(query);
    const b: Record<string, unknown> = {};
    b.select = () => b;
    for (const method of ["eq", "is", "in"] as const) b[method] = (column: string, value: unknown) => {
      query.filters.push({ method, column, value });
      return b;
    };
    b.maybeSingle = async () => ({ data: tables[table] });
    b.then = (resolve: (v: unknown) => unknown) => resolve({ data: tables[table] });
    return b;
  };
  const supabase = { from: builder, rpc: async (fn: string, args: Record<string, unknown>) => { rpcs.push({ fn, args }); return { error: o.rpcErrors?.[fn] ?? null }; } };
  const generate = async (input: Record<string, unknown>) => { generated.push(input); return o.generate ? o.generate() : { response: response(), model: "modelo-simulado" }; };
  const deps = { supabase, userId: "u1", generate } as unknown as GenerateVersionDeps;
  return { deps, rpcs, generated, queries, run: (mode: LiveMode = "initial") => runGenerateVersion(deps, "q1", mode) };
}
const quiet = (t: { mock: { method: (o: object, m: "error") => unknown } }) => t.mock.method(console, "error");
const failing = (code: LiveGenerationError["code"]) => async () => { throw new LiveGenerationError(code); };

test("(a) sessão não ativa ou pergunta inexistente: erro e generate não é chamado", async () => {
  for (const q of [question("paused"), question("closed"), null]) {
    const s = setup({ question: q });
    assert.deepEqual(await s.run(), { error: "A sessão precisa estar ativa." });
    assert.equal(s.generated.length, 0);
    assert.equal(s.rpcs.length, 0);
  }
});

test("(b) sem evidências autorizadas: erro e generate não é chamado", async () => {
  const s = setup({ links: [] });
  assert.deepEqual(await s.run(), { error: "Nenhuma evidência está autorizada." });
  assert.equal(s.generated.length, 0);
  assert.equal(s.rpcs.length, 0);
});

test("(c) alternative sem outra evidência: erro sem chamar generate", async () => {
  const s = setup({ links: [{ evidence_id: E1, recommendation_score: 5 }], evidences: [evidence(E1, "Automação de atendimento")] });
  assert.deepEqual(await s.run("alternative"), { error: "Não há outra experiência autorizada para esta pergunta." });
  assert.equal(s.generated.length, 0);
  assert.equal(s.rpcs.length, 0);
});

test("alternative com outra evidência: generate recebe a alternativa como preferida e primeira", async () => {
  const s = setup();
  assert.deepEqual(await s.run("alternative"), {});
  const input = s.generated[0] as { preferredEvidenceId: string; evidences: { id: string }[]; mode: string };
  assert.equal(input.preferredEvidenceId, E2);
  assert.equal(input.evidences[0].id, E2);
  assert.equal(input.mode, "alternative");
});

test("(d) sucesso supported: finish_live_question com parâmetros exatos, evidence_ids sem duplicatas", async () => {
  const s = setup();
  assert.deepEqual(await s.run("initial"), {});
  assert.deepEqual(s.rpcs.map((r) => r.fn), ["finish_live_question"]);
  const r = response();
  assert.deepEqual(s.rpcs[0].args, {
    p_question_id: "q1", p_intent: "behavioral", p_status: "answered", p_primary_evidence_id: E1, p_mode: "initial", p_target_duration_seconds: 30,
    p_draft_text: r.draft, p_arguments: r.arguments, p_evidence_ids: [E1, E2], p_gap: null, p_model: "modelo-simulado", p_prompt_version: LIVE_PROMPT_VERSION,
  });
});

test("(d) sucesso sem sustentação: p_status gap, sem argumentos e com lacuna", async () => {
  const gap = { missing_facts: ["fato específico"], registration_suggestion: "Registre o resultado com números." };
  const s = setup({ generate: async () => ({ response: response({ supported: false, primary_evidence_id: null, arguments: [], draft: null, gap }), model: "outro-modelo" }) });
  assert.deepEqual(await s.run("deeper"), {});
  const args = s.rpcs[0].args;
  assert.equal(args.p_status, "gap");
  assert.equal(args.p_mode, "deeper");
  assert.equal(args.p_model, "outro-modelo");
  assert.deepEqual(args.p_evidence_ids, []);
  assert.deepEqual(args.p_gap, gap);
  assert.equal(args.p_draft_text, null);
});

test("generate recebe a pergunta, o contexto e no máximo 5 evidências", async () => {
  const many = Array.from({ length: 7 }, (_, i) => evidence(`e${i}`, `Automação ${i}`));
  const s = setup({ links: many.map((e) => ({ evidence_id: e.id, recommendation_score: 1 })), evidences: many });
  await s.run();
  const input = s.generated[0] as { question: string; targetRole: string; company: string; evidences: unknown[] };
  assert.equal(input.question, "Fale de automação com IA");
  assert.equal(input.targetRole, "Analista");
  assert.equal(input.company, "Acme");
  assert.equal(input.evidences.length, 5);
});

test("consultas preservam ownership e somente evidências confirmadas e não removidas", async () => {
  const s = setup();
  await s.run();
  assert.deepEqual(s.queries, [
    { table: "live_questions", filters: [
      { method: "eq", column: "id", value: "q1" },
      { method: "eq", column: "user_id", value: "u1" },
    ] },
    { table: "live_session_evidences", filters: [
      { method: "eq", column: "session_id", value: "s1" },
      { method: "eq", column: "user_id", value: "u1" },
      { method: "is", column: "removed_at", value: null },
    ] },
    { table: "evidences", filters: [
      { method: "in", column: "id", value: [E1, E2] },
      { method: "eq", column: "status", value: "confirmed" },
    ] },
  ]);
});

test("(e) falha do adaptador no modo inicial: fail_live_question com o código e a mensagem de describeLiveFailure", async (t) => {
  quiet(t);
  for (const code of ["timeout", "rate_limit", "provider_error", "invalid_output", "not_configured"] as const) {
    const s = setup({ generate: failing(code) });
    assert.deepEqual(await s.run("initial"), { error: describeLiveFailure("initial", new LiveGenerationError(code)).message });
    assert.deepEqual(s.rpcs, [{ fn: "fail_live_question", args: { p_question_id: "q1", p_error_code: code } }]);
  }
  const s = setup({ generate: async () => { throw new Error("rede caiu"); } });
  assert.match((await s.run("initial")).error ?? "", /Não foi possível gerar com segurança/);
  assert.deepEqual(s.rpcs[0].args, { p_question_id: "q1", p_error_code: "provider_error" });
});

test("(f) falha do rpc finish_live_question: tratada como invalid_output (mesmo caminho de (e))", async (t) => {
  quiet(t);
  const s = setup({ rpcErrors: { finish_live_question: { code: "XX000" } } });
  assert.deepEqual(await s.run("initial"), { error: describeLiveFailure("initial", new LiveGenerationError("invalid_output")).message });
  assert.deepEqual(s.rpcs.map((r) => r.fn), ["finish_live_question", "fail_live_question"]);
  assert.deepEqual(s.rpcs[1].args, { p_question_id: "q1", p_error_code: "invalid_output" });
});

test("(g) falha em regeneração: devolve o erro e NÃO chama fail_live_question", async (t) => {
  quiet(t);
  for (const mode of ["shorter", "deeper", "alternative"] as const) {
    const s = setup({ generate: failing("timeout") });
    assert.deepEqual(await s.run(mode), { error: describeLiveFailure(mode, new LiveGenerationError("timeout")).message });
    assert.equal(s.generated.length, 1);
    assert.deepEqual(s.rpcs, []);
  }
  const s = setup({ rpcErrors: { finish_live_question: { code: "XX000" } } });
  assert.ok((await s.run("shorter")).error);
  assert.deepEqual(s.rpcs.map((r) => r.fn), ["finish_live_question"]);
});

test("a falha registra só o código no log, sem pergunta nem dados do usuário", async (t) => {
  const log = quiet(t) as { mock: { calls: { arguments: unknown[] }[] } };
  await setup({ generate: failing("timeout") }).run("initial");
  assert.deepEqual(log.mock.calls[0].arguments, ["Live generation failed", { code: "timeout" }]);
});
