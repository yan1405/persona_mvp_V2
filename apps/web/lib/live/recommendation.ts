export type RecommendableEvidence = {
  id: string;
  title: string;
  context: string;
  action: string;
  result: string | null;
  learning: string | null;
  competencies: string[];
  updated_at: string;
};

export type EvidenceRecommendation = RecommendableEvidence & {
  score: number;
  reasons: string[];
};

const STOP_WORDS = new Set([
  "a", "ao", "aos", "as", "com", "da", "das", "de", "do", "dos", "e", "em", "empresa",
  "na", "nas", "no", "nos", "o", "os", "para", "por", "que", "uma", "um",
]);

export function normalizedTokens(value: string) {
  return [...new Set(value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR")
    .split(/[^a-z0-9]+/).filter((token) => token.length >= 2 && !STOP_WORDS.has(token)))];
}
export function recommendEvidences(
  context: { targetRole: string; company: string; description: string | null },
  evidences: RecommendableEvidence[],
): EvidenceRecommendation[] {
  const targetTokens = normalizedTokens([context.targetRole, context.company, context.description ?? ""].join(" "));

  return evidences.map((evidence) => {
    const matches = (value: string | null) => normalizedTokens(value ?? "").filter((token) => targetTokens.includes(token));
    const competencyMatches = evidence.competencies.flatMap(matches);
    const titleMatches = matches(evidence.title);
    const contextMatches = matches(evidence.context);
    const actionMatches = matches(evidence.action);
    const outcomeMatches = [...matches(evidence.result), ...matches(evidence.learning)];
    const score = new Set(competencyMatches).size * 5
      + new Set(titleMatches).size * 4
      + new Set(contextMatches).size * 3
      + new Set(actionMatches).size * 2
      + new Set(outcomeMatches).size;
    const reasons = [
      competencyMatches.length ? `Competência relacionada: ${[...new Set(competencyMatches)].slice(0, 2).join(", ")}` : null,
      titleMatches.length ? `Tema em comum: ${[...new Set(titleMatches)].slice(0, 2).join(", ")}` : null,
      !competencyMatches.length && !titleMatches.length && (contextMatches.length || actionMatches.length)
        ? `Contexto relacionado: ${[...new Set([...contextMatches, ...actionMatches])].slice(0, 2).join(", ")}`
        : null,
    ].filter((reason): reason is string => Boolean(reason));
    return { ...evidence, score, reasons: reasons.length ? reasons : ["Disponível no seu repertório confirmado"] };
  }).sort((a, b) => b.score - a.score || Date.parse(b.updated_at) - Date.parse(a.updated_at));
}
