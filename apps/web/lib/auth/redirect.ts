const TEST_ORIGIN = "https://persona.invalid";

// Controle (tab, CR, LF, NUL, DEL...) e seus equivalentes codificados, e `\`:
// o parser de URL remove ou converte esses caracteres e pode trocar o destino.
const FORBIDDEN = /[\u0000-\u001f\u007f\\]|%(?:00|09|0a|0d|5c)/i;

export function getSafeNextPath(
  value: string | null,
  fallback = "/onboarding",
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    FORBIDDEN.test(value)
  ) {
    return fallback;
  }

  try {
    if (new URL(value, TEST_ORIGIN).origin !== TEST_ORIGIN) return fallback;
  } catch {
    return fallback;
  }

  return value;
}
