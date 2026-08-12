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
