# Ajuste do PKCE — propagação de cookies

> Data: 2026-08-10  
> Fase: 2 — Autenticação

## Problema confirmado

O Supabase recebeu o código de autorização da Microsoft, mas o callback local não encontrou o verificador PKCE. O OAuth é iniciado por uma Route Handler e os cookies produzidos nesse primeiro redirecionamento não estavam sendo anexados explicitamente à resposta.

## Opções consideradas

1. iniciar o OAuth no navegador, transferindo a responsabilidade dos cookies para o client;
2. abandonar PKCE em favor de um fluxo menos seguro;
3. manter o fluxo atual e aplicar explicitamente os cookies nos redirects de início e callback.

## Decisão

Foi escolhida a terceira opção. Ela mantém Authorization Code + PKCE, preserva a interface aprovada e não adiciona dependências. Um cliente específico para Route Handlers coleta os cookies e cabeçalhos privados gerados pelo Supabase e os aplica à resposta final.

## Verificação

- lint, typecheck, testes e build;
- OAuth Microsoft real;
- callback com criação de sessão;
- acesso autenticado ao `/onboarding`;
- acesso privado sem sessão continua redirecionando para `/entrar`.
