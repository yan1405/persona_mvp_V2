export const DAILY_LOG_MIN = 40;
export const DAILY_LOG_MAX = 2000;
export const CONTEXT_MAX = 160;

const STRUCTURED_LIMITS = {
  title: 100,
  context: 600,
  challenge: 600,
  action: 800,
  result: 600,
  learning: 600,
} as const;

export type DailyLogInput = {
  content: string;
  context: string | null;
  occurredOn: string;
};

export type SuggestionInput = {
  title: string;
  context: string;
  challenge: string | null;
  action: string;
  result: string | null;
  competencies: string[];
  learning: string | null;
};

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors: Record<string, string> };

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isIsoDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().startsWith(value);
}

export function validateDailyLog(formData: FormData): ValidationResult<DailyLogInput> {
  const content = text(formData, "content");
  const context = text(formData, "context");
  const occurredOn = text(formData, "occurredOn");
  const fieldErrors: Record<string, string> = {};

  if (content.length < DAILY_LOG_MIN || content.length > DAILY_LOG_MAX) {
    fieldErrors.content = `Escreva entre ${DAILY_LOG_MIN} e ${DAILY_LOG_MAX} caracteres.`;
  }

  if (context.length > CONTEXT_MAX) {
    fieldErrors.context = `Use no máximo ${CONTEXT_MAX} caracteres.`;
  }

  if (!isIsoDate(occurredOn)) {
    fieldErrors.occurredOn = "Informe uma data válida.";
  }

  if (Object.keys(fieldErrors).length) return { success: false, fieldErrors };

  return {
    success: true,
    data: { content, context: context || null, occurredOn },
  };
}

export function validateSuggestion(
  formData: FormData,
  requireConfirmation = false,
): ValidationResult<SuggestionInput> {
  const values = {
    title: text(formData, "title"),
    context: text(formData, "structuredContext"),
    challenge: text(formData, "challenge"),
    action: text(formData, "structuredAction"),
    result: text(formData, "result"),
    learning: text(formData, "learning"),
  };
  const competencies = text(formData, "competencies")
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .filter((item, index, all) =>
      all.findIndex((candidate) => candidate.toLocaleLowerCase("pt-BR") === item.toLocaleLowerCase("pt-BR")) === index,
    );
  const fieldErrors: Record<string, string> = {};

  for (const [name, limit] of Object.entries(STRUCTURED_LIMITS)) {
    const value = values[name as keyof typeof values];
    if (value.length > limit) fieldErrors[name] = `Use no máximo ${limit} caracteres.`;
  }

  if (values.title && values.title.length < 4) fieldErrors.title = "Use pelo menos 4 caracteres.";
  if (competencies.length > 8 || competencies.some((item) => item.length < 2 || item.length > 60)) {
    fieldErrors.competencies = "Informe até 8 competências, cada uma com 2 a 60 caracteres.";
  }

  if (requireConfirmation) {
    if (values.title.length < 4) fieldErrors.title = "Dê um título específico à evidência.";
    if (values.context.length < 4) fieldErrors.context = "Confirme o contexto da experiência.";
    if (values.action.length < 4) fieldErrors.action = "Descreva a ação realizada.";
    if (!competencies.length) fieldErrors.competencies = "Confirme pelo menos uma competência.";
  }

  if (Object.keys(fieldErrors).length) return { success: false, fieldErrors };

  return {
    success: true,
    data: {
      title: values.title,
      context: values.context,
      challenge: values.challenge || null,
      action: values.action,
      result: values.result || null,
      competencies,
      learning: values.learning || null,
    },
  };
}
