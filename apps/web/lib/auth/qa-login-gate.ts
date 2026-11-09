// Login por senha só para QA local: tudo precisa valer, qualquer outra combinação desliga.
// O host vem do cabeçalho Host; X-Forwarded-Host nunca é lido. Na Vercel o gate já cai em VERCEL/VERCEL_ENV.
const LOCAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/;

export function isQaPasswordLoginEnabled(
  env: Record<string, string | undefined>,
  host: string | null | undefined,
): boolean {
  return (
    env.PERSONA_QA_PASSWORD_LOGIN === "1" &&
    env.NODE_ENV !== "production" &&
    !env.VERCEL &&
    !env.VERCEL_ENV &&
    typeof host === "string" &&
    LOCAL_HOST.test(host)
  );
}
