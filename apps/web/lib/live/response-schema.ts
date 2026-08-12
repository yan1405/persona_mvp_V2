export const LIVE_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["intent", "supported", "primary_evidence_id", "arguments", "draft", "target_duration_seconds", "gap"],
  properties: {
    intent: { type: "string", enum: ["objective", "behavioral", "complex"] },
    supported: { type: "boolean" },
    primary_evidence_id: { type: ["string", "null"] },
    arguments: { type: "array", maxItems: 5, items: {
      type: "object", additionalProperties: false, required: ["text", "evidence_id", "source_field", "source_excerpt"],
      properties: {
        text: { type: "string", minLength: 4, maxLength: 280 },
        evidence_id: { type: "string" },
        source_field: { type: "string", enum: ["title", "context", "action", "result", "learning", "competencies"] },
        source_excerpt: { type: "string", minLength: 2, maxLength: 240 },
      },
    } },
    draft: { type: ["string", "null"], maxLength: 1200 },
    target_duration_seconds: { type: "integer", minimum: 10, maximum: 60 },
    gap: { anyOf: [
      { type: "null" },
      { type: "object", additionalProperties: false, required: ["missing_facts", "registration_suggestion"], properties: {
        missing_facts: { type: "array", minItems: 1, maxItems: 4, items: { type: "string", minLength: 4, maxLength: 160 } },
        registration_suggestion: { type: "string", minLength: 8, maxLength: 240 },
      } },
    ] },
  },
} as const;

export type LiveEvidenceInput = {
  id: string; title: string; context: string; action: string; result: string | null; learning: string | null; competencies: string[];
};
export type LiveArgument = { text: string; evidence_id: string; source_field: "title" | "context" | "action" | "result" | "learning" | "competencies"; source_excerpt: string };
export type LiveResponse = {
  intent: "objective" | "behavioral" | "complex"; supported: boolean; primary_evidence_id: string | null;
  arguments: LiveArgument[]; draft: string | null; target_duration_seconds: number;
  gap: null | { missing_facts: string[]; registration_suggestion: string };
};

function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }

export function parseLiveResponse(raw: string, evidences: LiveEvidenceInput[]): LiveResponse {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error("invalid_output"); }
  if (!record(value) || !["objective", "behavioral", "complex"].includes(String(value.intent)) || typeof value.supported !== "boolean"
    || !Array.isArray(value.arguments) || !Number.isInteger(value.target_duration_seconds)
    || Number(value.target_duration_seconds) < 10 || Number(value.target_duration_seconds) > 60) throw new Error("invalid_output");
  const byId = new Map(evidences.map((evidence) => [evidence.id, evidence]));
  const fields = new Set(["title", "context", "action", "result", "learning", "competencies"]);
  const args = value.arguments.map((argument): LiveArgument => {
    if (!record(argument) || typeof argument.text !== "string" || typeof argument.evidence_id !== "string"
      || typeof argument.source_field !== "string" || !fields.has(argument.source_field) || typeof argument.source_excerpt !== "string") throw new Error("invalid_output");
    const evidence = byId.get(argument.evidence_id);
    if (!evidence) throw new Error("invalid_output");
    const source = argument.source_field === "competencies" ? evidence.competencies.join(" ") : evidence[argument.source_field as keyof Omit<LiveEvidenceInput, "id" | "competencies">];
    if (!source || !source.toLocaleLowerCase("pt-BR").includes(argument.source_excerpt.trim().toLocaleLowerCase("pt-BR"))) throw new Error("invalid_output");
    return { text: argument.text.trim(), evidence_id: argument.evidence_id, source_field: argument.source_field as LiveArgument["source_field"], source_excerpt: argument.source_excerpt.trim() };
  });
  const primary = typeof value.primary_evidence_id === "string" ? value.primary_evidence_id : null;
  if (primary && !byId.has(primary)) throw new Error("invalid_output");
  const draft = typeof value.draft === "string" && value.draft.trim() ? value.draft.trim() : null;
  const sourceNumbers = new Set(evidences.flatMap((evidence) => [evidence.title, evidence.context, evidence.action, evidence.result ?? "", evidence.learning ?? "", ...evidence.competencies].flatMap((field) => field.match(/\d+(?:[.,]\d+)?%?/g) ?? [])));
  if (draft && (draft.match(/\d+(?:[.,]\d+)?%?/g) ?? []).some((number) => !sourceNumbers.has(number))) throw new Error("invalid_output");
  const gap = record(value.gap) && Array.isArray(value.gap.missing_facts) && typeof value.gap.registration_suggestion === "string"
    ? { missing_facts: value.gap.missing_facts.filter((item): item is string => typeof item === "string"), registration_suggestion: value.gap.registration_suggestion.trim() }
    : null;
  if (value.supported ? (!draft || gap || !args.length || !primary) : (draft || !gap || args.length > 0 || primary)) throw new Error("invalid_output");
  return { intent: value.intent as LiveResponse["intent"], supported: value.supported, primary_evidence_id: primary, arguments: args, draft, target_duration_seconds: Number(value.target_duration_seconds), gap };
}
