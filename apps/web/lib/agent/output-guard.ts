import type { LiveEvidenceInput, LiveResponse } from "../live/response-schema.ts";

// Barreiras determinísticas em volta de parseLiveResponse (lib/live é somente leitura neste lote).

const fold = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("pt-BR");

// shortcut: heurística lexical pt/en, não cobre paráfrases nem outros idiomas; evoluir junto com os evals reais.
const META_COMMANDS = [
  // formas verbais fechadas (não prefixo livre): "ignorância" e "desconsiderei as regras de negócio" não casam
  /\b(?:ignor(?:e|em|a|ar|ando)|desconsider(?:e|em|a|ar|ando)|esquec(?:a|am|er|endo)|disregard|override)\b.{0,40}\b(?:regras?|instruc\w*|prompt|anterior\w*|acima|antes|ordens|diretrizes|rules?|instructions?)\b/,
  /\bpasse a (?:afirmar|dizer)\b/,
  /\bsiga (?:estas|essas|as) (?:novas )?(?:ordens|instruc\w*)\b/,
  /\b(afirme|declare|finja|pretenda|diga)\s+que\b/,
  /\b(revele|mostre|exiba|reveal|show)\b.{0,30}\b(prompt|instruc\w*|system)\b/,
  /\b(system prompt|developer message|voce agora e|you are now|aja como|act as)\b/,
];

// Quebras de linha e caracteres invisíveis viram espaço/nada antes do teste: "." não atravessa "\n".
const flat = (value: string) => value.replace(/[​-‍⁠﻿]/g, "").replace(/\s+/g, " ");
export const hasMetaCommand = (value: string) => META_COMMANDS.some((pattern) => pattern.test(fold(flat(value))));

const len = (value: string) => [...value].length; // JSON Schema conta pontos de código
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const exactKeys = (value: Record<string, unknown>, keys: string[]) => Object.keys(value).length === keys.length && keys.every((key) => key in value);
const str = (value: unknown, min: number, max: number): value is string => typeof value === "string" && len(value.trim()) >= min && len(value) <= max; // mínimo após trim: espaços não contam

const WORD = /[\p{L}\p{N}]/u;
const FIELDS = ["title", "context", "action", "result", "learning", "competencies"];

const NEGATOR = /(?:^|[^\p{L}\p{N}])(?:nao|nunca|sem|nem|jamais|nenhum|nenhuma)(?![\p{L}\p{N}])/u;
const isDigit = (char: string | undefined) => char !== undefined && /\p{N}/u.test(char);
const isWord = (char: string | undefined) => char !== undefined && WORD.test(char);

// Uma ocorrência só vale se for uma unidade inteira da fonte: sem cortar palavra/número e sem remover negação.
// shortcut: negação = negador na mesma oração (. ; : ! ?) antes do trecho; não entende escopo sintático nem negação posposta, nem sinônimos ("jamais" listado, "tampouco" não).
function groundedAt(source: string, excerpt: string, start: number): boolean {
  const end = start + excerpt.length;
  const prev = source[start - 1], next = source[end];
  if (isWord(prev) && isWord(excerpt[0])) return false;
  if (isWord(next) && isWord(excerpt[excerpt.length - 1])) return false;
  const last = excerpt[excerpt.length - 1];
  if (isDigit(last) && (next === "%" || ((next === "." || next === ",") && isDigit(source[end + 1])))) return false; // 30% -> 30; 1.000 -> 1
  if (isDigit(excerpt[0]) && (prev === "." || prev === ",") && isDigit(source[start - 2])) return false; // 1.000 -> 000
  const before = source.slice(Math.max(source.slice(0, start).search(/[.;:!?][^.;:!?]*$/) + 1, 0), start);
  return !NEGATOR.test(fold(before)) || NEGATOR.test(fold(excerpt));
}

/** Pós-parse: cada excerto precisa casar com ao menos uma ocorrência íntegra do campo citado; argumentos repetidos são rejeitados. Lança "invalid_output". */
export function guardGrounding(response: LiveResponse, evidences: LiveEvidenceInput[]): void {
  const byId = new Map(evidences.map((evidence) => [evidence.id, evidence]));
  const seen = new Set<string>();
  for (const argument of response.arguments) {
    const evidence = byId.get(argument.evidence_id);
    if (!evidence) throw new Error("invalid_output");
    const excerpt = argument.source_excerpt.toLocaleLowerCase("pt-BR");
    const key = `${argument.evidence_id}|${argument.source_field}|${excerpt}`;
    if (seen.has(key)) throw new Error("invalid_output");
    seen.add(key);
    // competências são checadas uma a uma: o parser as junta com espaço e um excerto poderia cruzar duas
    const sources = argument.source_field === "competencies" ? evidence.competencies : [evidence[argument.source_field as "title"] ?? ""];
    const ok = sources.some((raw) => {
      const source = raw.toLocaleLowerCase("pt-BR");
      for (let index = source.indexOf(excerpt); index >= 0; index = source.indexOf(excerpt, index + 1)) if (groundedAt(source, excerpt, index)) return true;
      return false;
    });
    if (!ok) throw new Error("invalid_output");
  }
}

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
    if (!str(argument.text, 4, 280) || typeof argument.evidence_id !== "string" || !FIELDS.includes(String(argument.source_field)) || !str(argument.source_excerpt, 2, 240) || !WORD.test(argument.source_excerpt)) return fail();
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
