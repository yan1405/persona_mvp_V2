# Persona Web

Aplicação Next.js do Persona MVP v2.

Antes de alterar o código, leia:

1. `../../AGENTS.md`;
2. `../../docs/handoff/START_HERE.md`;
3. `AGENTS.md` deste diretório para regras específicas do Next.js 16.

## Comandos

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

O servidor de desenvolvimento usa `http://localhost:3100`. Não alterar para a porta 3000, que está reservada para outro projeto local.

## Estrutura atual

- `app/` — páginas, Route Handlers e Server Actions;
- `lib/auth/` — segurança de redirects;
- `lib/onboarding/` — validação do primeiro uso;
- `lib/supabase/` — configuração, sessão e clientes;
- `public/brand/` — logos oficiais aprovados.

O estado completo, as fases e o runbook estão em `../../docs/handoff/`.
