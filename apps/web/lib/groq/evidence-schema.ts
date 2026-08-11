export const EVIDENCE_RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["useful", "reason", "suggestions"],
  properties: {
    useful: { type: "boolean" },
    reason: { type: ["string", "null"], maxLength: 160 },
    suggestions: {
      type: "array",
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "title",
          "context",
          "challenge",
          "action",
          "result",
          "competencies",
          "learning",
          "unsupported_fields",
        ],
        properties: {
          title: { type: "string", minLength: 4, maxLength: 100 },
          context: { type: ["string", "null"], maxLength: 600 },
          challenge: { type: ["string", "null"], maxLength: 600 },
          action: { type: ["string", "null"], maxLength: 800 },
          result: { type: ["string", "null"], maxLength: 600 },
          competencies: {
            type: "array",
            maxItems: 8,
            items: { type: "string", minLength: 2, maxLength: 60 },
          },
          learning: { type: ["string", "null"], maxLength: 600 },
          unsupported_fields: {
            type: "array",
            items: {
              type: "string",
              enum: ["context", "challenge", "action", "result", "competencies", "learning"],
            },
          },
        },
      },
    },
  },
} as const;

const FIELD_LIMITS = {
  context: 600,
  challenge: 600,
  action: 800,
  result: 600,
  learning: 600,
} as const;
const SUPPORTED_FIELDS = new Set(Object.keys(FIELD_LIMITS).concat("competencies"));

export type EvidenceSuggestionOutput = {
  title: string;
  context: string | null;
  challenge: string | null;
  action: string | null;
  result: string | null;
  competencies: string[];
  learning: string | null;
  unsupported_fields: string[];
};

export type EvidenceStructureOutput = {
  useful: boolean;
  reason: string | null;
  suggestions: EvidenceSuggestionOutput[];
};

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalText(value: unknown, max: number) {
  if (value === null) return null;
  if (typeof value !== "string") throw new Error("invalid_output");
  const normalized = value.trim();
  if (!normalized) return null;
  if (normalized.length > max) throw new Error("invalid_output");
  return normalized;
}

export function parseEvidenceStructure(raw: string): EvidenceStructureOutput {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error("invalid_output");
  }

  if (!record(parsed) || typeof parsed.useful !== "boolean" || !Array.isArray(parsed.suggestions)) {
    throw new Error("invalid_output");
  }

  const reason = optionalText(parsed.reason, 160);
  if (parsed.suggestions.length > 3) throw new Error("invalid_output");

  const suggestions = parsed.suggestions.map((item): EvidenceSuggestionOutput => {
    if (!record(item) || typeof item.title !== "string") throw new Error("invalid_output");
    const title = item.title.trim();
    if (title.length < 4 || title.length > 100) throw new Error("invalid_output");

    if (!Array.isArray(item.competencies) || item.competencies.length > 8) {
      throw new Error("invalid_output");
    }
    const competencies = item.competencies.map((competency) => {
      if (typeof competency !== "string") throw new Error("invalid_output");
      const normalized = competency.trim();
      if (normalized.length < 2 || normalized.length > 60) throw new Error("invalid_output");
      return normalized;
    }).filter((item, index, all) =>
      all.findIndex((candidate) => candidate.toLocaleLowerCase("pt-BR") === item.toLocaleLowerCase("pt-BR")) === index,
    );

    if (!Array.isArray(item.unsupported_fields)) throw new Error("invalid_output");
    const unsupportedFields = item.unsupported_fields.map((field) => {
      if (typeof field !== "string" || !SUPPORTED_FIELDS.has(field)) throw new Error("invalid_output");
      return field;
    });

    return {
      title,
      context: optionalText(item.context, FIELD_LIMITS.context),
      challenge: optionalText(item.challenge, FIELD_LIMITS.challenge),
      action: optionalText(item.action, FIELD_LIMITS.action),
      result: optionalText(item.result, FIELD_LIMITS.result),
      competencies,
      learning: optionalText(item.learning, FIELD_LIMITS.learning),
      unsupported_fields: [...new Set(unsupportedFields)],
    };
  });

  if (parsed.useful !== (suggestions.length > 0)) throw new Error("invalid_output");

  return { useful: parsed.useful, reason, suggestions };
}
