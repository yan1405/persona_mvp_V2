// A galeria do Design System é só para desenvolvimento local: em produção a rota responde 404.
// Mesma disciplina do gate de QA (lib/auth/qa-login-gate.ts): qualquer sinal de produção ou de Vercel desliga.
export function isDsGalleryEnabled(env: Record<string, string | undefined>): boolean {
  return env.NODE_ENV !== "production" && !env.VERCEL && !env.VERCEL_ENV;
}
