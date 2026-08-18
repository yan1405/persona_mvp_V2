import { generatedBlockKeys, type ArtifactCitation, type ArtifactEvidenceInput, type ArtifactSourceMap, type ArtifactType } from "./artifact.ts";

export const ARTIFACT_SELECTION_SCHEMA = {
  type: "object", additionalProperties: false, required: ["supported", "claims", "gap"],
  properties: {
    supported: { type: "boolean" },
    claims: { type: "array", maxItems: 48, items: {
      type: "object", additionalProperties: false, required: ["block_key", "evidence_id", "source_field", "source_excerpt"],
      properties: {
        block_key: { type: "string", enum: ["star", "pitch_30", "pitch_60", "pitch_90", "summary", "experience", "skills", "profile", "cases"] },
        evidence_id: { type: "string" },
        source_field: { type: "string", enum: ["title", "context", "challenge", "action", "result", "learning", "competencies"] },
        source_excerpt: { type: "string", minLength: 2, maxLength: 360 },
      },
    } },
    gap: { anyOf: [
      { type: "null" },
      { type: "object", additionalProperties: false, required: ["missing_facts", "registration_suggestion"], properties: {
        missing_facts: { type: "array", minItems: 1, maxItems: 6, items: { type: "string", minLength: 4, maxLength: 180 } },
        registration_suggestion: { type: "string", minLength: 8, maxLength: 260 },
      } },
    ] },
  },
} as const;

function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }

export function parseArtifactSelection(raw: string, evidences: ArtifactEvidenceInput[], type: ArtifactType, sectionKey?: string | null) {
  let value: unknown;
  try { value = JSON.parse(raw); } catch { throw new Error("invalid_output"); }
  if (!record(value) || typeof value.supported !== "boolean" || !Array.isArray(value.claims)) throw new Error("invalid_output");
  const allowed = new Set(generatedBlockKeys(type));
  const byId = new Map(evidences.map((item) => [item.id, item]));
  const sourceMap: ArtifactSourceMap = {};
  for (const claim of value.claims) {
    if (!record(claim) || typeof claim.block_key !== "string" || !allowed.has(claim.block_key)
      || (sectionKey && claim.block_key !== sectionKey) || typeof claim.evidence_id !== "string"
      || typeof claim.source_field !== "string" || typeof claim.source_excerpt !== "string") throw new Error("invalid_output");
    const evidence = byId.get(claim.evidence_id);
    if (!evidence || !["title", "context", "challenge", "action", "result", "learning", "competencies"].includes(claim.source_field)) throw new Error("invalid_output");
    const field = claim.source_field as ArtifactCitation["source_field"];
    const source = field === "competencies" ? evidence.competencies.join(" · ") : evidence[field];
    const excerpt = claim.source_excerpt.trim();
    if (!source || !source.toLocaleLowerCase("pt-BR").includes(excerpt.toLocaleLowerCase("pt-BR"))) throw new Error("invalid_output");
    const citation = { evidence_id: evidence.id, source_field: field, source_excerpt: excerpt } satisfies ArtifactCitation;
    sourceMap[claim.block_key] = [...(sourceMap[claim.block_key] ?? []), citation];
  }
  const gap = record(value.gap) && Array.isArray(value.gap.missing_facts) && typeof value.gap.registration_suggestion === "string"
    ? { missingFacts: value.gap.missing_facts.filter((item): item is string => typeof item === "string"), suggestion: value.gap.registration_suggestion.trim() }
    : null;
  if (value.supported ? (!Object.keys(sourceMap).length || gap) : (Object.keys(sourceMap).length || !gap)) throw new Error("invalid_output");
  return { supported: value.supported, sourceMap, gap };
}
