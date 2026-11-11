import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { closeHref, DIARY_FILTERS, EVIDENCE_FILTERS, listHref, openHref } from "./panel-href.ts";

test("abrir preserva os filtros e acrescenta o painel", () => {
  assert.equal(openHref("/app/diario", "x1", { q: "ia", state: "confirmed" }, DIARY_FILTERS), "/app/diario?q=ia&state=confirmed&abrir=x1");
  assert.equal(openHref("/app/evidencias", "e1", {}, EVIDENCE_FILTERS), "/app/evidencias?abrir=e1");
});

test("rota direta sem filtros e lista limpa", () => {
  assert.equal(listHref("/app/diario", {}, DIARY_FILTERS), "/app/diario");
  assert.equal(listHref("/app/diario", { q: "" }, DIARY_FILTERS), "/app/diario");
});

test("fechar volta com os filtros e descarta abrir, notice e suggestion", () => {
  const params = new URLSearchParams("q=ia&from=2026-01-01&abrir=x1&notice=ok&suggestion=s1");
  assert.equal(closeHref("/app/diario", params, DIARY_FILTERS), "/app/diario?q=ia&from=2026-01-01");
  assert.equal(closeHref("/app/evidencias", new URLSearchParams("abrir=e1"), EVIDENCE_FILTERS), "/app/evidencias");
});

test("painéis devolvem o foco sem temporizador fixo", () => {
  for (const file of ["diario/diary-panel.tsx", "evidencias/evidence-panel.tsx", "score/score-panel.tsx"]) {
    const source = readFileSync(new URL(file, import.meta.url), "utf8");
    assert.ok(!source.includes("setTimeout"), file + " usa setTimeout");
    assert.ok(source.includes("returnFocusTo"), file + " não declara o retorno do foco");
  }
});
