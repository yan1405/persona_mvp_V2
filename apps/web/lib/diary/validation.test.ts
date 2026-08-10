import assert from "node:assert/strict";
import test from "node:test";

import { validateDailyLog, validateSuggestion } from "./validation.ts";

test("valida um Daily Log textual e preserva campos opcionais", () => {
  const formData = new FormData();
  formData.set("content", "Conduzi uma conversa com o cliente e organizei os próximos passos do projeto.");
  formData.set("context", "Estágio — reunião semanal");
  formData.set("occurredOn", "2026-08-10");

  const result = validateDailyLog(formData);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.context, "Estágio — reunião semanal");
});

test("rejeita Daily Log curto e data inválida", () => {
  const formData = new FormData();
  formData.set("content", "Texto curto");
  formData.set("occurredOn", "2026-02-30");

  const result = validateDailyLog(formData);
  assert.equal(result.success, false);
  if (!result.success) {
    assert.ok(result.fieldErrors.content);
    assert.ok(result.fieldErrors.occurredOn);
  }
});

test("exige contexto, ação e competência somente ao confirmar", () => {
  const formData = new FormData();
  formData.set("title", "Atendimento consultivo");

  assert.equal(validateSuggestion(formData).success, true);
  const confirmation = validateSuggestion(formData, true);
  assert.equal(confirmation.success, false);
  if (!confirmation.success) {
    assert.ok(confirmation.fieldErrors.context);
    assert.ok(confirmation.fieldErrors.action);
    assert.ok(confirmation.fieldErrors.competencies);
  }
});

test("normaliza competências duplicadas na revisão", () => {
  const formData = new FormData();
  formData.set("title", "Organização da entrega");
  formData.set("structuredContext", "Projeto interno");
  formData.set("structuredAction", "Organizei tarefas e alinhei responsáveis.");
  formData.set("competencies", "Organização, Comunicação, organização");

  const result = validateSuggestion(formData, true);
  assert.equal(result.success, true);
  if (result.success) assert.deepEqual(result.data.competencies, ["Organização", "Comunicação"]);
});
