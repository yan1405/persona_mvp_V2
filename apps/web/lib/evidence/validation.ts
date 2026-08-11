export const EVIDENCE_LINK_TITLE_MAX = 100;
export const EVIDENCE_LINK_URL_MAX = 2048;

export type EvidenceLinkInput = {
  title: string | null;
  url: string;
};

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors: Record<string, string> };

function text(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export function evidenceLevel(sourceCount: number) {
  return sourceCount > 0 ? "Documentada" : "Registrada";
}

export function validateEvidenceLink(formData: FormData): ValidationResult<EvidenceLinkInput> {
  const title = text(formData, "sourceTitle");
  const rawUrl = text(formData, "sourceUrl");
  const fieldErrors: Record<string, string> = {};

  if (title.length === 1 || title.length > EVIDENCE_LINK_TITLE_MAX) {
    fieldErrors.sourceTitle = `Use entre 2 e ${EVIDENCE_LINK_TITLE_MAX} caracteres ou deixe vazio.`;
  }

  if (!rawUrl || rawUrl.length > EVIDENCE_LINK_URL_MAX) {
    fieldErrors.sourceUrl = `Informe uma URL com até ${EVIDENCE_LINK_URL_MAX} caracteres.`;
  }

  let normalizedUrl = rawUrl;
  try {
    const parsed = new URL(rawUrl);
    if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) {
      throw new Error("unsupported_url");
    }
    normalizedUrl = parsed.href;
  } catch {
    fieldErrors.sourceUrl = "Use um link completo iniciado por http:// ou https://, sem credenciais.";
  }

  if (Object.keys(fieldErrors).length) return { success: false, fieldErrors };
  return { success: true, data: { title: title || null, url: normalizedUrl } };
}
