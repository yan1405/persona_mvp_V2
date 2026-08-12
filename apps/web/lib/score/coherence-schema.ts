export const COHERENCE_RUBRIC_VERSION = "coherence-v1";

export const COHERENCE_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "criteria"],
  properties: {
    summary: { type: "string", minLength: 8, maxLength: 480 },
    criteria: {
      type: "object",
      additionalProperties: false,
      required: ["alignment", "connection", "specificity", "recurrence"],
      properties: Object.fromEntries(["alignment", "connection", "specificity", "recurrence"].map((name) => [name, {
        type: "object",
        additionalProperties: false,
        required: ["score", "explanation", "evidence_ids"],
        properties: {
          score: { type: "integer", enum: [0, 25, 50, 75, 100] },
          explanation: { type: "string", minLength: 4, maxLength: 280 },
          evidence_ids: { type: "array", maxItems: 12, items: { type: "string" } },
        },
      }])),
    },
  },
} as const;

const CRITERIA = ["alignment", "connection", "specificity", "recurrence"] as const;
const WEIGHTS = { alignment: 0.35, connection: 0.25, specificity: 0.25, recurrence: 0.15 } as const;
const SCORES = new Set([0, 25, 50, 75, 100]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type Criterion = { score: number; explanation: string; evidence_ids: string[] };
export type CoherenceOutput = { summary: string; criteria: Record<(typeof CRITERIA)[number], Criterion>; score: number; evidenceIds: string[] };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseCoherenceOutput(raw: string, permittedEvidenceIds: readonly string[]): CoherenceOutput {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error("invalid_output"); }
  if (!isRecord(value) || typeof value.summary !== "string" || !isRecord(value.criteria)) throw new Error("invalid_output");
  const summary = value.summary.trim();
  if (summary.length < 8 || summary.length > 480) throw new Error("invalid_output");
  const permitted = new Set(permittedEvidenceIds);
  const criteria = {} as CoherenceOutput["criteria"];

  for (const name of CRITERIA) {
    const item = value.criteria[name];
    if (!isRecord(item) || typeof item.score !== "number" || !SCORES.has(item.score) || typeof item.explanation !== "string" || !Array.isArray(item.evidence_ids)) throw new Error("invalid_output");
    const explanation = item.explanation.trim();
    if (explanation.length < 4 || explanation.length > 280 || item.evidence_ids.length > 12) throw new Error("invalid_output");
    const evidenceIds = item.evidence_ids.map((id) => {
      if (typeof id !== "string" || !UUID.test(id) || !permitted.has(id)) throw new Error("invalid_output");
      return id;
    });
    criteria[name] = { score: item.score, explanation, evidence_ids: [...new Set(evidenceIds)] };
  }

  const score = Math.round(CRITERIA.reduce((total, name) => total + criteria[name].score * WEIGHTS[name], 0));
  const evidenceIds = [...new Set(CRITERIA.flatMap((name) => criteria[name].evidence_ids))];
  if (!evidenceIds.length) throw new Error("invalid_output");
  return { summary, criteria, score, evidenceIds };
}
