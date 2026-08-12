export type LiveContext = { targetRole: string; company: string; description: string | null };

type ValidationResult<T> = { success: true; data: T } | { success: false; fieldErrors: Record<string, string> };

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}
export function validateLiveContext(formData: FormData): ValidationResult<LiveContext> {
  const targetRole = text(formData, "targetRole");
  const company = text(formData, "company");
  const description = text(formData, "description");
  const fieldErrors: Record<string, string> = {};
  if (targetRole.length < 4 || targetRole.length > 120) fieldErrors.targetRole = "Use entre 4 e 120 caracteres.";
  if (company.length < 2 || company.length > 120) fieldErrors.company = "Use entre 2 e 120 caracteres.";
  if (description.length > 2_000) fieldErrors.description = "Use no máximo 2.000 caracteres.";
  return Object.keys(fieldErrors).length
    ? { success: false, fieldErrors }
    : { success: true, data: { targetRole, company, description: description || null } };
}

export function validateEvidenceSelection(formData: FormData) {
  const ids = [...new Set(formData.getAll("evidenceId").filter((value): value is string => typeof value === "string"))];
  return ids.length >= 1 && ids.length <= 8 ? { success: true as const, ids } : { success: false as const };
}

export function validateLiveQuestion(value: FormDataEntryValue | null) {
  const question = typeof value === "string" ? value.trim() : "";
  return question.length >= 8 && question.length <= 500 ? question : null;
}
