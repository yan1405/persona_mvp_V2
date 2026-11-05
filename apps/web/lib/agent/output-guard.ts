// Barreiras determinísticas aplicadas ANTES de parseLiveResponse (lib/live é somente leitura neste lote).

const fold = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("pt-BR");

// shortcut: heurística lexical pt/en, não cobre paráfrases nem outros idiomas; evoluir junto com os evals reais.
const META_COMMANDS = [
  /\b(ignor\w*|desconsider\w*|esquec\w*|disregard|override)\b.{0,40}\b(regras?|instruc\w*|prompt|anterior\w*|acima|rules?|instructions?)\b/,
  /\b(afirme|declare|finja|pretenda|diga)\s+que\b/,
  /\b(revele|mostre|exiba|reveal|show)\b.{0,30}\b(prompt|instruc\w*|system)\b/,
  /\b(system prompt|developer message|voce agora e|you are now|aja como|act as)\b/,
];

export const hasMetaCommand = (value: string) => META_COMMANDS.some((pattern) => pattern.test(fold(value)));

const len = (value: string) => [...value].length; // JSON Schema conta pontos de código
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const exactKeys = (value: Record<string, unknown>, keys: string[]) => Object.keys(value).length === keys.length && keys.every((key) => key in value);
const str = (value: unknown, min: number, max: number): value is string => typeof value === "string" && len(value) >= min && len(value) <= max;

const FIELDS = ["title", "context", "action", "result", "learning", "competencies"];

/** Aplica integralmente LIVE_RESPONSE_SCHEMA (additionalProperties, obrigatórios, tamanhos, gap) e a barreira de meta-comandos. Lança "invalid_output". */
export function guardRawOutput(raw: string): void {
  const fail = (): never => { throw new Error("invalid_output"); };
  let value: unknown;
  try { value = JSON.parse(raw); } catch { return fail(); }
  if (!isRecord(value) || !exactKeys(value, ["intent", "supported", "primary_evidence_id", "arguments", "draft", "target_duration_seconds", "gap"])) return fail();
  if (!["objective", "behavioral", "complex"].includes(String(value.intent)) || typeof value.supported !== "boolean") return fail();
  if (value.primary_evidence_id !== null && typeof value.primary_evidence_id !== "string") return fail();
  if (!Number.isInteger(value.target_duration_seconds) || Number(value.target_duration_seconds) < 10 || Number(value.target_duration_seconds) > 60) return fail();
  if (value.draft !== null && !str(value.draft, 0, 1_200)) return fail();
  if (!Array.isArray(value.arguments) || value.arguments.length > 5) return fail();
  for (const argument of value.arguments) {
    if (!isRecord(argument) || !exactKeys(argument, ["text", "evidence_id", "source_field", "source_excerpt"])) return fail();
    if (!str(argument.text, 4, 280) || typeof argument.evidence_id !== "string" || !FIELDS.includes(String(argument.source_field)) || !str(argument.source_excerpt, 2, 240)) return fail();
    if (hasMetaCommand(argument.text) || hasMetaCommand(argument.source_excerpt)) return fail();
  }
  if (typeof value.draft === "string" && hasMetaCommand(value.draft)) return fail();
  if (value.gap !== null) {
    const gap = value.gap;
    if (!isRecord(gap) || !exactKeys(gap, ["missing_facts", "registration_suggestion"]) || !str(gap.registration_suggestion, 8, 240)) return fail();
    if (!Array.isArray(gap.missing_facts) || gap.missing_facts.length < 1 || gap.missing_facts.length > 4 || !gap.missing_facts.every((fact) => str(fact, 4, 160))) return fail();
    // gap é devolvido ao usuário sem reconstrução: também precisa passar pela barreira
    if (gap.missing_facts.some((fact) => hasMetaCommand(fact as string)) || hasMetaCommand(gap.registration_suggestion as string)) return fail();
  }
}
