import assert from "node:assert/strict";
import test from "node:test";

import { recommendEvidences } from "./recommendation.ts";
import { parseLiveResponse } from "./response-schema.ts";

const evidences = [
  { id: "11111111-1111-1111-1111-111111111111", title: "Automação de atendimento", context: "Projeto em consultoria", action: "Estruturei um fluxo de IA", result: "Reduzi o trabalho manual", learning: null, competencies: ["Inteligência artificial", "Comunicação"], updated_at: "2026-08-10T00:00:00Z" },
  { id: "22222222-2222-2222-2222-222222222222", title: "Organização interna", context: "Rotina de equipe", action: "Organizei documentos", result: null, learning: null, competencies: ["Organização"], updated_at: "2026-08-11T00:00:00Z" },
];

test("recomendação prioriza correspondência temática antes de recência", () => {
  const ranked = recommendEvidences({ targetRole: "Consultoria em inteligência artificial", company: "Crescitech", description: null }, evidences);
  assert.equal(ranked[0].id, evidences[0].id);
  assert.match(ranked[0].reasons[0], /Competência relacionada/);
});

test("recomendação desempata por recência", () => {
  const ranked = recommendEvidences({ targetRole: "Vaga geral", company: "Empresa X", description: null }, evidences);
  assert.equal(ranked[0].id, evidences[1].id);
});

test("resposta rejeita evidência não autorizada", () => {
  const raw = JSON.stringify({ intent: "objective", supported: true, primary_evidence_id: "33333333-3333-3333-3333-333333333333", arguments: [{ text: "Argumento", evidence_id: "33333333-3333-3333-3333-333333333333", source_field: "action", source_excerpt: "fato" }], draft: "Resposta", target_duration_seconds: 20, gap: null });
  assert.throws(() => parseLiveResponse(raw, evidences), /invalid_output/);
});

test("resposta rejeita trecho que não existe na fonte", () => {
  const raw = JSON.stringify({ intent: "objective", supported: true, primary_evidence_id: evidences[0].id, arguments: [{ text: "Argumento", evidence_id: evidences[0].id, source_field: "result", source_excerpt: "aumentei em 80%" }], draft: "Resposta", target_duration_seconds: 20, gap: null });
  assert.throws(() => parseLiveResponse(raw, evidences), /invalid_output/);
});

test("resposta rejeita número inventado no rascunho", () => {
  const raw = JSON.stringify({ intent: "objective", supported: true, primary_evidence_id: evidences[0].id, arguments: [{ text: "Reduzi o trabalho manual", evidence_id: evidences[0].id, source_field: "result", source_excerpt: "Reduzi o trabalho manual" }], draft: "Eu reduzi o trabalho manual em 80%.", target_duration_seconds: 20, gap: null });
  assert.throws(() => parseLiveResponse(raw, evidences), /invalid_output/);
});

test("lacuna válida não cria rascunho genérico", () => {
  const raw = JSON.stringify({ intent: "behavioral", supported: false, primary_evidence_id: null, arguments: [], draft: null, target_duration_seconds: 40, gap: { missing_facts: ["Um conflito real e sua ação"], registration_suggestion: "Registre uma situação de conflito no Diário." } });
  assert.equal(parseLiveResponse(raw, evidences).draft, null);
});

test("resposta persistida usa somente trechos literais das fontes", () => {
  const raw = JSON.stringify({ intent: "objective", supported: true, primary_evidence_id: evidences[0].id, arguments: [{ text: "Implementei uma solução completa", evidence_id: evidences[0].id, source_field: "action", source_excerpt: "Estruturei um fluxo de IA" }], draft: "Implementei uma solução completa sem falhas.", target_duration_seconds: 20, gap: null });
  const response = parseLiveResponse(raw, evidences);
  assert.equal(response.arguments[0].text, "Estruturei um fluxo de IA");
  assert.equal(response.draft, "Na minha experiência: Estruturei um fluxo de IA.");
});

// ---- Rodada 4: A-1/A-7/A-10 no parser compartilhado (regressão do Persona Live) ----
const liveEvidence = (over: Record<string, unknown> = {}) => ({ id: "44444444-4444-4444-4444-444444444444", title: "Entrega", context: "Consultoria", action: "Estruturei um fluxo", result: "Reduzi o trabalho manual em 30%", learning: null, competencies: ["Liderança", "Dados"], ...over }) as typeof evidences[number];
const liveParse = (e: typeof evidences[number], source_field: string, source_excerpt: string) => parseLiveResponse(JSON.stringify({ intent: "objective", supported: true, primary_evidence_id: e.id, arguments: [{ text: "Argumento válido", evidence_id: e.id, source_field, source_excerpt }], draft: "Resposta", target_duration_seconds: 20, gap: null }), [e]);
const rejects = (e: typeof evidences[number], field: string, excerpt: string) => assert.throws(() => liveParse(e, field, excerpt), /invalid_output/, JSON.stringify(excerpt));

test("parser compartilhado: excerto sem conteúdo efetivo (espaços, invisíveis, pontuação) é rejeitado", () => {
  const e = liveEvidence();
  for (const excerpt of ["  ", "\t\n", " ", "​​", ".."]) rejects(e, "result", excerpt);
  assert.equal(liveParse(e, "result", " Reduzi o trabalho manual em 30% ").draft, "Na minha experiência: Reduzi o trabalho manual em 30%.");
});

test("parser compartilhado: 30% não vira 3, 1.000 não vira 1 e palavra não é cortada", () => {
  const e = liveEvidence(), k = liveEvidence({ result: "Atendi 1.000 clientes" }), c = liveEvidence({ title: "Coordenação de projetos" });
  rejects(e, "result", "Reduzi o trabalho manual em 3");
  rejects(e, "result", "Reduzi o trabalho manual em 30");
  rejects(k, "result", "Atendi 1");
  rejects(k, "result", "000 clientes");
  rejects(c, "title", "ordenação");
  assert.ok(liveParse(k, "result", "atendi 1.000 clientes"));
});

test("parser compartilhado: negação anterior na mesma oração não pode ser removida", () => {
  const n = liveEvidence({ result: "Não reduzi o custo, nem liderei a equipe. Estruturei o relatório" });
  rejects(n, "result", "reduzi o custo");
  rejects(n, "result", "liderei a equipe");
  assert.ok(liveParse(n, "result", "Não reduzi o custo"));
  assert.ok(liveParse(n, "result", "Estruturei o relatório"));
});

test("parser compartilhado: ponto decimal e abreviação não encerram a oração (A-10)", () => {
  rejects(liveEvidence({ result: "Não lancei a versão v2.0 pelo cliente Acme" }), "result", "pelo cliente Acme");
  rejects(liveEvidence({ result: "Não falei com o Sr. Silva sobre o preço" }), "result", "Silva sobre o preço");
  assert.ok(liveParse(liveEvidence({ result: "Não lancei a v2.0. Atendi o cliente Acme" }), "result", "Atendi o cliente Acme")); // fim de oração real
});

test("parser compartilhado: excerto não cruza duas competências", () => {
  const e = liveEvidence();
  rejects(e, "competencies", "Liderança Dados");
  assert.ok(liveParse(e, "competencies", "Dados"));
});
