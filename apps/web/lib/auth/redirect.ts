export function getSafeNextPath(
  value: string | null,
  fallback = "/onboarding",
) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    value.includes("\\")
  ) {
    return fallback;
  }

  return value;
}
