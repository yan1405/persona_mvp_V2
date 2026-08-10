# Fase 2 — Autenticação Microsoft

Status: autorizada após aprovação final da Fase 1 em 10/08/2026.

## Objetivo

Transformar o acesso visual de `/entrar` em um fluxo real de autenticação Microsoft por meio do Supabase Auth, com OAuth Authorization Code + PKCE, sessão em cookies e validação no servidor.

## Escopo mínimo

- instalar apenas `@supabase/supabase-js` e `@supabase/ssr`;
- criar clientes Supabase de navegador e servidor;
- iniciar o OAuth com o provedor `azure` e escopo `email`;
- concluir a troca do código em `/auth/callback`;
- renovar a sessão por `proxy.ts` e validar identidade com `getClaims()`;
- criar `/auth/erro` com mensagens seguras e recuperáveis;
- preservar a tela aprovada e adicionar somente estados carregando, configuração ausente e falha;
- redirecionar uma autenticação bem-sucedida para `/onboarding`.

## Limites

Esta fase não cria login por senha, outro provedor, banco de dados de perfil, onboarding persistente, service role, painel administrativo ou integração com Groq. A chave da Groq não é necessária nesta fase.

## Configuração necessária

O app recebe somente valores públicos em `.env.local`:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

O client secret do Azure permanece exclusivamente no painel do Supabase. Nenhum segredo será copiado para o código, documentação, navegador ou logs.

## Estados e recuperação

- ambiente sem Supabase: acesso permanece visível e encaminha para erro de configuração, sem quebrar o build;
- retorno sem código ou falha na troca: `/auth/erro` oferece retorno a `/entrar`;
- rota privada sem sessão válida: redireciona para `/entrar`;
- retorno autenticado: segue para `/onboarding`.

## Verificação

- lint, typecheck e build;
- teste do redirecionamento relativo seguro no callback;
- inspeção visual da tela de erro e do botão de entrada;
- teste real com Microsoft somente depois de configurar a URL e a chave publicável do projeto Supabase.
