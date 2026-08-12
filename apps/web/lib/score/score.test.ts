import assert from "node:assert/strict";
import test from "node:test";

import { calculateDeclaredScore, validateDiagnosticCompletion } from "./diagnostic.ts";
import { calculateObservedConsistency } from "./consistency.ts";
import { parseCoherenceOutput } from "./coherence-schema.ts";

test("calcula a base declarada com pesos 60/40", () => {
  const answers = Object.fromEntries(Array.from({ length: 10 }, (_, index) => [`q${index + 1}`, index < 6 ? 75 : 50])) as Parameters<typeof calculateDeclaredScore>[0];
  assert.deepEqual(calculateDeclaredScore(answers), { coherence: 75, consistency: 50, total: 65 });
});

test("exige objetivo e dez respostas válidas", () => {
  const form = new FormData();
  form.set("objective", "Curto");
  form.set("q1", "30");
  const result = validateDiagnosticCompletion(form);
  assert.equal(result.success, false);
  if (!result.success) assert.equal(Object.keys(result.fieldErrors).length, 11);
});

test("observa consistência depois de 21 dias, seis registros e três semanas", () => {
  const logs = ["2026-07-01", "2026-07-04", "2026-07-09", "2026-07-12", "2026-07-17", "2026-07-20"].map((occurred_on) => ({ occurred_on, status: "raw" }));
  const result = calculateObservedConsistency({ diagnosticCompletedOn: "2026-07-01", today: "2026-07-22", logs });
  assert.equal(result.eligible, true);
  assert.equal(result.activeWeeks, 3);
  assert.equal(result.distinctDays, 6);
  assert.equal(result.score, 75);
});

test("ignora registros arquivados e não duplica dias na frequência", () => {
  const result = calculateObservedConsistency({
    diagnosticCompletedOn: "2026-07-01",
    today: "2026-07-22",
    logs: [
      { occurred_on: "2026-07-01", status: "raw" },
      { occurred_on: "2026-07-01", status: "structured" },
      { occurred_on: "2026-07-09", status: "archived" },
    ],
  });
  assert.equal(result.eligible, false);
  assert.equal(result.distinctDays, 1);
});

test("recalcula coerência e rejeita evidência fora do conjunto permitido", () => {
  const allowed = "c8ed92b1-74fe-4e19-9b16-7c5712566345";
  const response = JSON.stringify({
    summary: "Narrativa alinhada ao objetivo informado.",
    criteria: Object.fromEntries(["alignment", "connection", "specificity", "recurrence"].map((name, index) => [name, {
      score: [100, 75, 50, 25][index], explanation: "Explicação sustentada pela evidência.", evidence_ids: [allowed],
    }])),
  });
  assert.equal(parseCoherenceOutput(response, [allowed]).score, 70);
  assert.throws(() => parseCoherenceOutput(response, []), /invalid_output/);
});
