import assert from "node:assert/strict";
import test from "node:test";

import { EVIDENCE_RESPONSE_SCHEMA, parseEvidenceStructure } from "./evidence-schema.ts";

test("mantém o schema compatível com os recursos aceitos pela Groq", () => {
  assert.equal(JSON.stringify(EVIDENCE_RESPONSE_SCHEMA).includes('"uniqueItems"'), false);
});

test("aceita e normaliza uma sugestão estruturada", () => {
  const result = parseEvidenceStructure(JSON.stringify({
    useful: true,
    reason: null,
    suggestions: [{
      title: "Organização de uma entrega",
      context: "Projeto interno",
      challenge: null,
      action: "Organizou tarefas e responsáveis.",
      result: null,
      competencies: ["Organização", "organização", "Comunicação"],
      learning: null,
      unsupported_fields: ["result"],
    }],
  }));

  assert.equal(result.suggestions.length, 1);
  assert.deepEqual(result.suggestions[0]?.competencies, ["Organização", "Comunicação"]);
  assert.deepEqual(result.suggestions[0]?.unsupported_fields, ["result"]);
});

test("aceita resposta sem sugestão útil", () => {
  const result = parseEvidenceStructure(JSON.stringify({
    useful: false,
    reason: "O texto não descreve uma ação profissional verificável.",
    suggestions: [],
  }));

  assert.equal(result.useful, false);
});

test("rejeita JSON inválido ou incompatível", () => {
  assert.throws(() => parseEvidenceStructure("não é json"), /invalid_output/);
  assert.throws(() => parseEvidenceStructure(JSON.stringify({
    useful: true,
    reason: null,
    suggestions: [],
  })), /invalid_output/);
});
