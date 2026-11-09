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

const HAS_CONTENT = /[\p{L}\p{N}]/u;
const isWordChar = (char: string | undefined) => char !== undefined && HAS_CONTENT.test(char);
const isDigit = (char: string | undefined) => char !== undefined && /\p{N}/u.test(char);
const fold = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("pt-BR");
const NEGATOR = /(?:^|[^\p{L}\p{N}])(?:nao|nunca|sem|nem|jamais|nenhum|nenhuma)(?![\p{L}\p{N}])/u;
// Fim de oração: . , ; : ! ? e quebra de linha; "." e "," entre dígitos (2.0, 1,5) fazem parte do número.
const CLAUSE_END = /(?<!\d)[.,]|[.,](?!\d)|[;:!?\n]/g;

// A-1/A-7/L-1: o excerto precisa ser uma unidade íntegra do campo (sem cortar palavra ou número) e não pode ter perdido uma negação
// que o precede na mesma oração. Cada competência é checada isolada. shortcut: negação léxica por oração, sem escopo sintático
// ("Nunca perdi um prazo e entreguei 12 relatórios" rejeita "entreguei…"); evoluir só com medição em evidências reais.
function isGrounded(rawSource: string, rawExcerpt: string): boolean {
  const source = rawSource.toLocaleLowerCase("pt-BR"), excerpt = rawExcerpt.toLocaleLowerCase("pt-BR");
  for (let start = source.indexOf(excerpt); start >= 0; start = source.indexOf(excerpt, start + 1)) {
    const end = start + excerpt.length, prev = source[start - 1], next = source[end], last = excerpt[excerpt.length - 1];
    if (isWordChar(prev) && isWordChar(excerpt[0])) continue;
    if (isWordChar(next) && isWordChar(last)) continue;
    if (isDigit(last) && (next === "%" || ((next === "." || next === ",") && isDigit(source[end + 1])))) continue; // 30% -> 3; 1.000 -> 1
    if (isDigit(excerpt[0]) && (prev === "." || prev === ",") && isDigit(source[start - 2])) continue; // 1.000 -> 000
    const before = source.slice(0, start);
    const clauseStart = [...before.matchAll(CLAUSE_END)].at(-1);
    const clause = clauseStart ? before.slice((clauseStart.index ?? 0) + 1) : before;
    if (!NEGATOR.test(fold(clause)) || NEGATOR.test(fold(excerpt))) return true;
  }
  return false;
}

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
    const excerpt = argument.source_excerpt.trim();
    const sources = argument.source_field === "competencies" ? evidence.competencies : [evidence[argument.source_field as keyof Omit<LiveEvidenceInput, "id" | "competencies">]];
    if (!HAS_CONTENT.test(excerpt) || !sources.some((source) => source && isGrounded(source, excerpt))) throw new Error("invalid_output");
    return { text: excerpt, evidence_id: argument.evidence_id, source_field: argument.source_field as LiveArgument["source_field"], source_excerpt: excerpt };
  });
  const primary = typeof value.primary_evidence_id === "string" ? value.primary_evidence_id : null;
  if (primary && !byId.has(primary)) throw new Error("invalid_output");
  const requestedDraft = typeof value.draft === "string" && value.draft.trim() ? value.draft.trim() : null;
  const sourceNumbers = new Set(evidences.flatMap((evidence) => [evidence.title, evidence.context, evidence.action, evidence.result ?? "", evidence.learning ?? "", ...evidence.competencies].flatMap((field) => field.match(/\d+(?:[.,]\d+)?%?/g) ?? [])));
  if (requestedDraft && (requestedDraft.match(/\d+(?:[.,]\d+)?%?/g) ?? []).some((number) => !sourceNumbers.has(number))) throw new Error("invalid_output");
  const gap = record(value.gap) && Array.isArray(value.gap.missing_facts) && typeof value.gap.registration_suggestion === "string"
    ? { missing_facts: value.gap.missing_facts.filter((item): item is string => typeof item === "string"), registration_suggestion: value.gap.registration_suggestion.trim() }
    : null;
  if (value.supported ? (!requestedDraft || gap || !args.length || !primary) : (requestedDraft || !gap || args.length > 0 || primary)) throw new Error("invalid_output");
  const draft = value.supported ? `Na minha experiência: ${[...new Set(args.map((argument) => argument.source_excerpt.replace(/[.]+$/, "")))].join(". ")}.` : null;
  return { intent: value.intent as LiveResponse["intent"], supported: value.supported, primary_evidence_id: primary, arguments: args, draft, target_duration_seconds: Number(value.target_duration_seconds), gap };
}
