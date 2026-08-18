import assert from "node:assert/strict";
import test from "node:test";

import { buildArtifactContent, reorderBlocks, validateArtifactContent } from "./artifact.ts";
import { parseArtifactSelection } from "./selection-schema.ts";

const evidence = {
  id: "11111111-1111-1111-1111-111111111111",
  title: "Automação de atendimento",
  context: "Projeto em consultoria",
  challenge: "Reduzir trabalho manual",
  action: "Estruturei um fluxo de IA",
  result: "Reduzi o trabalho manual",
  learning: "Validar antes de automatizar",
  competencies: ["Inteligência artificial", "Comunicação"],
};

test("seleção rejeita trecho ausente da evidência", () => {
  const raw = JSON.stringify({ supported: true, blocks: [{ key: "star", claims: [{ evidence_id: evidence.id, source_field: "result", source_excerpt: "Aumentei 80%" }] }], gap: null });
  assert.throws(() => parseArtifactSelection(raw, [evidence], "star"), /invalid_output/);
});

test("STAR persistido usa trechos literais com estrutura explícita", () => {
  const raw = JSON.stringify({ supported: true, blocks: [{ key: "star", claims: [
    { evidence_id: evidence.id, source_field: "context", source_excerpt: evidence.context },
    { evidence_id: evidence.id, source_field: "challenge", source_excerpt: evidence.challenge },
    { evidence_id: evidence.id, source_field: "action", source_excerpt: evidence.action },
    { evidence_id: evidence.id, source_field: "result", source_excerpt: evidence.result },
  ] }], gap: null });
  const selection = parseArtifactSelection(raw, [evidence], "star");
  const content = buildArtifactContent({ type: "star", title: "Resposta", objective: "Entrevista", supplementary: { contact: "", education: "", languages: "", links: "" }, sourceMap: selection.sourceMap, evidences: [evidence] });
  assert.match(content.blocks[0].body, /Situação: Projeto em consultoria\./);
  assert.match(content.blocks[0].body, /Resultado: Reduzi o trabalho manual\./);
  assert.doesNotMatch(content.blocks[0].body, /80%/);
});

test("conteúdo rejeita bloco estranho e preserva reordenação válida", () => {
  assert.throws(() => validateArtifactContent({ blocks: [{ key: "unknown", label: "X", body: "Y" }] }, "star"), /invalid_content/);
  const content = buildArtifactContent({ type: "resume", title: "Currículo", objective: "Consultoria", supplementary: { contact: "Yan", education: "Senac", languages: "Inglês A2", links: "" }, sourceMap: { summary: [{ evidence_id: evidence.id, source_field: "action", source_excerpt: evidence.action }], experience: [{ evidence_id: evidence.id, source_field: "result", source_excerpt: evidence.result }], skills: [{ evidence_id: evidence.id, source_field: "competencies", source_excerpt: "Comunicação" }] }, evidences: [evidence] });
  const moved = reorderBlocks(content, "summary", "up");
  assert.equal(moved.blocks[1].key, "summary");
  assert.equal(validateArtifactContent(moved, "resume").blocks.length, 6);
});
