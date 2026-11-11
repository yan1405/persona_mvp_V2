// Origem do redirecionamento do login de QA: protocolo da requisição e host do cabeçalho Host (o gate do Lote 7
// já garante que é local). Antes usava request.url, que podia devolver sempre "localhost".
export function qaRedirectOrigin(requestUrl: string, host: string | null | undefined): string {
  const url = new URL(requestUrl);
  const value = typeof host === "string" && host.length > 0 ? host : url.host;
  return `${url.protocol}//${value}`;
}

// Login de QA termina no mesmo ponto do fluxo Microsoft: /onboarding decide entre o primeiro uso e /app/inicio.
export const QA_LOGIN_DESTINATION = "/onboarding";
