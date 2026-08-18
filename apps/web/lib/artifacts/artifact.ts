export const ARTIFACT_TYPES = ["star", "pitch", "resume", "portfolio"] as const;
export type ArtifactType = (typeof ARTIFACT_TYPES)[number];
export type ArtifactMode = "initial" | "shorter" | "deeper" | "adapted" | "alternative";
export type ArtifactBlock = { key: string; label: string; body: string };
export type ArtifactContent = { blocks: ArtifactBlock[] };
export type SupplementaryData = { contact: string; education: string; languages: string; links: string };
export type ArtifactEvidenceInput = {
  id: string;
  title: string;
  context: string;
  challenge: string | null;
  action: string;
  result: string | null;
  learning: string | null;
  competencies: string[];
};
export type ArtifactCitation = {
  evidence_id: string;
  source_field: "title" | "context" | "challenge" | "action" | "result" | "learning" | "competencies";
  source_excerpt: string;
};
export type ArtifactSourceMap = Record<string, ArtifactCitation[]>;

export const artifactTypeLabel: Record<ArtifactType, string> = {
  star: "Resposta STAR",
  pitch: "Pitch pessoal",
  resume: "Currículo",
  portfolio: "Portfólio profissional",
};

const definitions: Record<ArtifactType, { key: string; label: string; generated: boolean }[]> = {
  star: [{ key: "star", label: "Resposta STAR", generated: true }],
  pitch: [
    { key: "pitch_30", label: "Pitch de 30 segundos", generated: true },
    { key: "pitch_60", label: "Pitch de 60 segundos", generated: true },
    { key: "pitch_90", label: "Pitch de 90 segundos", generated: true },
  ],
  resume: [
    { key: "header", label: "Identificação e contato", generated: false },
    { key: "objective", label: "Objetivo profissional", generated: false },
    { key: "summary", label: "Resumo", generated: true },
    { key: "experience", label: "Experiências e projetos", generated: true },
    { key: "education", label: "Formação", generated: false },
    { key: "skills", label: "Competências e idiomas", generated: true },
  ],
  portfolio: [
    { key: "cover", label: "Capa", generated: false },
    { key: "profile", label: "Apresentação profissional", generated: true },
    { key: "skills", label: "Competências em destaque", generated: true },
    { key: "cases", label: "Casos selecionados", generated: true },
    { key: "links", label: "Links e contato", generated: false },
  ],
};

export function blockDefinitions(type: ArtifactType) { return definitions[type]; }
export function generatedBlockKeys(type: ArtifactType) { return definitions[type].filter((item) => item.generated).map((item) => item.key); }
export function isArtifactType(value: unknown): value is ArtifactType { return ARTIFACT_TYPES.includes(value as ArtifactType); }

type ValidationResult<T> = { success: true; data: T } | { success: false; fieldErrors: Record<string, string> };
function text(formData: FormData, name: string) { const value = formData.get(name); return typeof value === "string" ? value.trim() : ""; }

export function validateArtifactCreation(formData: FormData): ValidationResult<{
  type: ArtifactType; title: string; objective: string; context: string | null; supplementary: SupplementaryData; evidenceIds: string[];
}> {
  const typeValue = text(formData, "type");
  const title = text(formData, "title");
  const objective = text(formData, "objective");
  const context = text(formData, "context");
  const supplementary = { contact: text(formData, "contact"), education: text(formData, "education"), languages: text(formData, "languages"), links: text(formData, "links") };
  const evidenceIds = [...new Set(formData.getAll("evidenceId").filter((value): value is string => typeof value === "string" && /^[0-9a-f-]{36}$/i.test(value)))];
  const fieldErrors: Record<string, string> = {};
  if (!isArtifactType(typeValue)) fieldErrors.type = "Escolha um dos quatro tipos disponíveis.";
  if (title.length < 2 || title.length > 120) fieldErrors.title = "Use entre 2 e 120 caracteres.";
  if (objective.length < 2 || objective.length > 240) fieldErrors.objective = "Use entre 2 e 240 caracteres.";
  if (context.length > 2000) fieldErrors.context = "Use até 2.000 caracteres.";
  for (const [key, value] of Object.entries(supplementary)) if (value.length > 1200) fieldErrors[key] = "Use até 1.200 caracteres.";
  if (evidenceIds.length < 1 || evidenceIds.length > 12) fieldErrors.evidenceId = "Selecione entre 1 e 12 evidências.";
  if (Object.keys(fieldErrors).length || !isArtifactType(typeValue)) return { success: false, fieldErrors };
  return { success: true, data: { type: typeValue, title, objective, context: context || null, supplementary, evidenceIds } };
}

function record(value: unknown): value is Record<string, unknown> { return typeof value === "object" && value !== null && !Array.isArray(value); }

export function validateArtifactContent(value: unknown, type: ArtifactType): ArtifactContent {
  if (!record(value) || !Array.isArray(value.blocks)) throw new Error("invalid_content");
  const allowed = new Map(definitions[type].map((item) => [item.key, item.label]));
  const seen = new Set<string>();
  const blocks = value.blocks.map((block): ArtifactBlock => {
    if (!record(block) || typeof block.key !== "string" || typeof block.label !== "string" || typeof block.body !== "string"
      || !allowed.has(block.key) || seen.has(block.key) || block.body.length > 6000) throw new Error("invalid_content");
    seen.add(block.key);
    return { key: block.key, label: allowed.get(block.key) as string, body: block.body };
  });
  if (blocks.length !== definitions[type].length) throw new Error("invalid_content");
  return { blocks };
}

function manualBody(key: string, title: string, objective: string, supplementary: SupplementaryData) {
  if (key === "header") return [supplementary.contact, supplementary.links].filter(Boolean).join("\n");
  if (key === "objective") return objective;
  if (key === "education") return supplementary.education;
  if (key === "cover") return [title, objective, supplementary.contact].filter(Boolean).join("\n");
  if (key === "links") return [supplementary.links, supplementary.contact].filter(Boolean).join("\n");
  return "";
}

function sentence(value: string) { const clean = value.trim().replace(/[.]+$/, ""); return clean ? `${clean}.` : ""; }

function renderClaims(key: string, claims: ArtifactCitation[], evidences: Map<string, ArtifactEvidenceInput>, supplementary: SupplementaryData) {
  const unique = [...new Map(claims.map((claim) => [`${claim.evidence_id}:${claim.source_field}:${claim.source_excerpt}`, claim])).values()];
  if (key === "star") {
    const labels: Record<ArtifactCitation["source_field"], string> = { title: "Situação", context: "Situação", challenge: "Tarefa", action: "Ação", result: "Resultado", learning: "Aprendizado", competencies: "Competências" };
    return unique.map((claim) => `${labels[claim.source_field]}: ${sentence(claim.source_excerpt)}`).join("\n\n");
  }
  if (key === "experience" || key === "cases") {
    const grouped = new Map<string, ArtifactCitation[]>();
    for (const claim of unique) grouped.set(claim.evidence_id, [...(grouped.get(claim.evidence_id) ?? []), claim]);
    return [...grouped].map(([id, items]) => {
      const evidence = evidences.get(id);
      return `${evidence?.title ?? "Experiência"}\n${items.filter((item) => item.source_field !== "title").map((item) => sentence(item.source_excerpt)).join(" ")}`.trim();
    }).join("\n\n");
  }
  if (key === "skills") {
    const skills = [...new Set(unique.flatMap((claim) => claim.source_field === "competencies" ? claim.source_excerpt.split(/[,;·]/).map((item) => item.trim()).filter(Boolean) : []))];
    return [...skills, supplementary.languages].filter(Boolean).join(" · ");
  }
  const joined = unique.map((claim) => sentence(claim.source_excerpt)).join(" ");
  return key.startsWith("pitch_") && joined ? `Na minha experiência, ${joined.charAt(0).toLocaleLowerCase("pt-BR")}${joined.slice(1)}` : joined;
}

export function buildArtifactContent(input: {
  type: ArtifactType; title: string; objective: string; supplementary: SupplementaryData; sourceMap: ArtifactSourceMap;
  evidences: ArtifactEvidenceInput[]; current?: ArtifactContent; sectionKey?: string | null;
}): ArtifactContent {
  const evidenceMap = new Map(input.evidences.map((item) => [item.id, item]));
  const current = new Map(input.current?.blocks.map((item) => [item.key, item.body]) ?? []);
  return { blocks: definitions[input.type].map((definition) => {
    const preserve = input.sectionKey && definition.key !== input.sectionKey;
    const body = preserve ? current.get(definition.key) ?? "" : definition.generated
      ? renderClaims(definition.key, input.sourceMap[definition.key] ?? [], evidenceMap, input.supplementary)
      : manualBody(definition.key, input.title, input.objective, input.supplementary);
    return { key: definition.key, label: definition.label, body };
  }) };
}

export function reorderBlocks(content: ArtifactContent, key: string, direction: "up" | "down") {
  const blocks = [...content.blocks];
  const index = blocks.findIndex((item) => item.key === key);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= blocks.length) return content;
  [blocks[index], blocks[target]] = [blocks[target], blocks[index]];
  return { blocks };
}
