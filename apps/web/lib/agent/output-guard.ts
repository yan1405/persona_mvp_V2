import type { LiveResponse } from "../live/response-schema.ts";

// Barreiras determinísticas em volta de parseLiveResponse. Fronteira de palavra/número, negação e conteúdo efetivo do excerto
// vivem no parser compartilhado (lib/live/response-schema.ts), para valer igual no Persona Live e no Agente.

// Homóglifos cirílicos/gregos mais comuns → latino. shortcut: mapa mínimo; outros (ex.: "ı" U+0131) escapam, ampliar com os evals reais.
const HOMOGLYPHS: Record<string, string> = {
  "а": "a", "е": "e", "о": "o", "р": "p", "с": "c", "х": "x", "у": "y",
  "і": "i", "ј": "j", "ѕ": "s", "ο": "o", "ι": "i", "ν": "v",
};
// NFKC antes de tudo: largura total ("ｉｇｎｏｒｅ") e formas de compatibilidade viram ASCII.
const fold = (value: string) => value.normalize("NFKC").toLocaleLowerCase("pt-BR").replace(/[аеорсхуіјѕοιν]/g, (char) => HOMOGLYPHS[char]).normalize("NFD").replace(/[̀-ͯ]/g, "");

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
const INVISIBLE = /[​-‍⁠﻿]/g;
const flat = (value: string) => value.replace(INVISIBLE, "").replace(/\s+/g, " ");
export const hasMetaCommand = (value: string) => META_COMMANDS.some((pattern) => pattern.test(fold(flat(value))));

const len = (value: string) => [...value].length; // JSON Schema conta pontos de código
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const exactKeys = (value: Record<string, unknown>, keys: string[]) => Object.keys(value).length === keys.length && keys.every((key) => key in value);
// mínimo após remover invisíveis e trim: espaços e zero-width não contam
const str = (value: unknown, min: number, max: number): value is string => typeof value === "string" && len(value.replace(INVISIBLE, "").trim()) >= min && len(value) <= max;

const FIELDS = ["title", "context", "action", "result", "learning", "competencies"];

/** Pós-parse: argumentos repetidos (mesma evidência, campo e excerto) são rejeitados. Lança "invalid_output". */
export function guardRepeatedArguments(response: LiveResponse): void {
  const seen = new Set<string>();
  for (const argument of response.arguments) {
    const key = `${argument.evidence_id}|${argument.source_field}|${argument.source_excerpt.toLocaleLowerCase("pt-BR")}`;
    if (seen.has(key)) throw new Error("invalid_output");
    seen.add(key);
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
