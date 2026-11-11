const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/;

export function isQaPasswordLoginEnabled(
  env: Record<string, string | undefined>,
  host: string | null | undefined,
): boolean {
  if (env.VERCEL_ENV === "preview") {
    return (
      env.PERSONA_QA_PREVIEW_LOGIN === "1" &&
      Boolean(env.PERSONA_QA_PREVIEW_EMAIL?.trim()) &&
      Boolean(env.VERCEL_URL) &&
      host === env.VERCEL_URL
    );
  }

  return (
    env.PERSONA_QA_PASSWORD_LOGIN === "1" &&
    env.NODE_ENV !== "production" &&
    !env.VERCEL &&
    !env.VERCEL_ENV &&
    typeof host === "string" &&
    LOCAL_HOST.test(host)
  );
}
