import assert from "node:assert/strict";
import test from "node:test";

import { evidenceLevel, validateEvidenceLink } from "./validation.ts";

test("deriva o nível pela existência de prova", () => {
  assert.equal(evidenceLevel(0), "Registrada");
  assert.equal(evidenceLevel(1), "Documentada");
});

test("aceita e normaliza links HTTP e HTTPS", () => {
  const formData = new FormData();
  formData.set("sourceTitle", "Apresentação final");
  formData.set("sourceUrl", "https://example.com/prova");

  const result = validateEvidenceLink(formData);
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.url, "https://example.com/prova");
});

test("rejeita esquemas perigosos e credenciais embutidas", () => {
  for (const url of ["javascript:alert(1)", "data:text/plain,prova", "https://user:secret@example.com/"]) {
    const formData = new FormData();
    formData.set("sourceUrl", url);
    const result = validateEvidenceLink(formData);
    assert.equal(result.success, false);
    if (!result.success) assert.ok(result.fieldErrors.sourceUrl);
  }
});
