export const DIAGNOSTIC_VERSION = 1;

export const DIAGNOSTIC_OPTIONS = [
  { value: 0, label: "Ainda não consigo responder" },
  { value: 25, label: "Consigo responder com muita dificuldade" },
  { value: 50, label: "Consigo responder parcialmente" },
  { value: 75, label: "Consigo responder com clareza" },
  { value: 100, label: "Consigo responder com clareza e exemplos" },
] as const;

export const DIAGNOSTIC_QUESTIONS = [
  { id: "q1", dimension: "coherence", text: "Sei explicar qual direção profissional quero construir agora." },
  { id: "q2", dimension: "coherence", text: "Consigo relacionar minhas escolhas atuais ao meu objetivo profissional." },
  { id: "q3", dimension: "coherence", text: "Reconheço as competências que mais aparecem nas minhas experiências." },
  { id: "q4", dimension: "coherence", text: "Consigo explicar como experiências diferentes se conectam entre si." },
  { id: "q5", dimension: "coherence", text: "Tenho exemplos concretos para sustentar o que digo sobre meu trabalho." },
  { id: "q6", dimension: "coherence", text: "Minha apresentação profissional tem uma mensagem central clara." },
  { id: "q7", dimension: "consistency", text: "Registro experiências profissionais relevantes com frequência." },
  { id: "q8", dimension: "consistency", text: "Reviso meus registros para transformar acontecimentos em aprendizados." },
  { id: "q9", dimension: "readiness", text: "Minhas evidências estão organizadas para serem consultadas quando preciso." },
  { id: "q10", dimension: "readiness", text: "Consigo indicar fontes ou resultados que sustentam minhas principais experiências." },
] as const;

export type DiagnosticQuestionId = (typeof DIAGNOSTIC_QUESTIONS)[number]["id"];
export type DiagnosticAnswers = Partial<Record<DiagnosticQuestionId, number>>;

const acceptedValues = new Set<number>(DIAGNOSTIC_OPTIONS.map((option) => option.value));
const coherenceIds = DIAGNOSTIC_QUESTIONS.filter((question) => question.dimension === "coherence").map((question) => question.id);
const consistencyIds = DIAGNOSTIC_QUESTIONS.filter((question) => question.dimension === "consistency").map((question) => question.id);

export function parseDiagnosticAnswers(formData: FormData): DiagnosticAnswers {
  return Object.fromEntries(DIAGNOSTIC_QUESTIONS.flatMap(({ id }) => {
    const raw = formData.get(id);
    if (typeof raw !== "string" || raw === "") return [];
    const value = Number(raw);
    return acceptedValues.has(value) ? [[id, value]] : [];
  }));
}

export function calculateDeclaredScore(answers: Record<DiagnosticQuestionId, number>) {
  const average = (ids: readonly DiagnosticQuestionId[]) =>
    Math.round(ids.reduce((total, id) => total + answers[id], 0) / ids.length);
  const coherence = average(coherenceIds);
  const consistency = average(consistencyIds);

  return {
    coherence,
    consistency,
    total: Math.round(coherence * 0.6 + consistency * 0.4),
  };
}

export type DiagnosticCompletion =
  | { success: true; data: { objective: string; answers: Record<DiagnosticQuestionId, number>; score: ReturnType<typeof calculateDeclaredScore> } }
  | { success: false; fieldErrors: Record<string, string> };

export function validateDiagnosticCompletion(formData: FormData): DiagnosticCompletion {
  const objectiveValue = formData.get("objective");
  const objective = typeof objectiveValue === "string" ? objectiveValue.trim() : "";
  const answers = parseDiagnosticAnswers(formData);
  const fieldErrors: Record<string, string> = {};

  if (objective.length < 8 || objective.length > 240) {
    fieldErrors.objective = "Descreva seu objetivo em 8 a 240 caracteres.";
  }

  for (const { id } of DIAGNOSTIC_QUESTIONS) {
    if (answers[id] === undefined) fieldErrors[id] = "Escolha uma resposta.";
  }

  if (Object.keys(fieldErrors).length) return { success: false, fieldErrors };
  const completeAnswers = answers as Record<DiagnosticQuestionId, number>;
  return { success: true, data: { objective, answers: completeAnswers, score: calculateDeclaredScore(completeAnswers) } };
}
