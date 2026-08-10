# Revisão da Fase 2 — Autenticação

> Status: aprovado  
> Data: 2026-08-10

## Escopo desta fase

Implementar a entrada exclusiva com conta Microsoft usando Supabase Auth, com fluxo OAuth Authorization Code + PKCE e sessão validada no servidor.

## Implementado

- rota `GET /auth/iniciar` para iniciar o OAuth da Microsoft;
- rota `GET /auth/callback` para trocar o código pela sessão;
- escopo `email` solicitado ao provedor Azure;
- clientes Supabase separados para navegador, servidor e Route Handlers;
- propagação explícita dos cookies PKCE nos redirects de início e callback;
- renovação dos cookies de autenticação no `proxy.ts`;
- proteção inicial de `/onboarding` e `/app` por validação de claims no servidor;
- bloqueio de redirecionamentos externos no parâmetro `next`;
- página de erro segura para falhas de configuração, provedor e sessão;
- estado protegido provisório em `/onboarding`, sem antecipar o onboarding completo;
- arquivo `.env.example` somente com as variáveis públicas necessárias;
- teste automatizado do redirecionamento interno seguro.

## Configuração externa concluída

- projeto `persona-mvp-v2` confirmado no Supabase;
- URL e chave pública legada `anon` configuradas no `.env.local`;
- novo Client Secret criado no Microsoft Entra com validade até 06/02/2027;
- `Secret Value` salvo diretamente no provedor Azure do Supabase;
- consentimento individual autorizado sem consentimento para toda a organização;
- chave `service_role` não revelada nem utilizada;
- credencial antiga preservada, conforme autorizado.

## Validação concluída

- `npm test`: aprovado;
- `npm run lint`: aprovado;
- `npm run typecheck`: aprovado;
- `npm run build`: aprovado;
- OAuth Microsoft real concluído;
- callback PKCE concluído com criação da sessão;
- recarregamento de `/onboarding` manteve a sessão autenticada;
- identidade confirmada no servidor para a conta conectada;
- console do navegador sem erros ou avisos;
- porta de desenvolvimento mantida em `3100`, sem conflito com a porta `3000`.

Evidências visuais:

- [configuracao-necessaria.png](./fase-2-autenticacao/configuracao-necessaria.png)
- [onboarding-autenticado.png](./fase-2-autenticacao/onboarding-autenticado.png)

## Diagnósticos resolvidos

1. O Microsoft Entra retornou `AADSTS7000215` porque o Supabase possuía um Client Secret inválido. Foi criado e configurado um novo `Secret Value`.
2. O callback local recebeu o código, mas perdeu o verificador PKCE. Os cookies agora são anexados explicitamente aos redirects.
3. O servidor local inicialmente não podia acessar o Supabase pela rede. A validação final foi executada com o servidor autorizado na porta `3100`.

## Fora do escopo desta fase

- persistência completa do onboarding;
- tabelas e políticas RLS do produto;
- chave `service_role` do Supabase;
- integração e chave de API da Groq.

## Decisão

A Fase 2 foi aprovada por Yan em 10/08/2026. O avanço para a Fase 3 foi autorizado na mesma data.
