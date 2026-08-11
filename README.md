# Persona MVP v2

O Persona é um sistema de evidências profissionais: registra experiências reais, ajuda o usuário a estruturá-las e recupera os fatos certos para entrevistas e materiais de carreira sem inventar trajetória, resultado ou número.

## Continuidade para outra IA

Comece obrigatoriamente por [`docs/handoff/START_HERE.md`](docs/handoff/START_HERE.md). Esse arquivo aponta para o estado atual, fases, rotas, arquitetura, design, auditoria e histórico de execução.

Fontes principais:

1. [`AGENTS.md`](AGENTS.md) — regras obrigatórias e limites do projeto;
2. [`docs/handoff/CURRENT_STATE.md`](docs/handoff/CURRENT_STATE.md) — ponto exato de parada;
3. [`log_execução.md`](log_execução.md) — histórico cumulativo do que foi realmente executado;
4. [`docs/handoff/PHASES.md`](docs/handoff/PHASES.md) — entregas e gates de todas as fases;
5. [`docs/PRODUCT_BRIEF.md`](docs/PRODUCT_BRIEF.md) — definição do produto;
6. [`docs/architecture/INFORMATION_ARCHITECTURE.md`](docs/architecture/INFORMATION_ARCHITECTURE.md) — mapa de páginas e fluxos;
7. [`docs/architecture/TECHNICAL_ARCHITECTURE.md`](docs/architecture/TECHNICAL_ARCHITECTURE.md) — stack e princípios técnicos.

## Estado resumido em 10/08/2026

- Fase 1 — fundação e entrada: aprovada;
- Fase 2 — autenticação Microsoft: aprovada;
- Fase 3 — onboarding funcional: implementada, validada e aprovada para avanço;
- Fase 4 — Diário, estruturação assistida e revisão: implementada e tecnicamente validada; aprovação de Yan pendente;
- Groq: integração real validada com `openai/gpt-oss-20b`; chave somente no `.env.local`, nunca no Git;
- aplicação local: `http://localhost:3100`;
- banco: Supabase Postgres com `profiles`, `daily_logs`, `evidence_suggestions`, `evidences`, RLS e confirmação atômica aplicados.

O estado acima é um snapshot. Antes de continuar, confirme o estado vivo conforme o checklist do handoff.

## Desenvolvimento local

```powershell
cd C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2\apps\web
npm.cmd install
npm.cmd run dev
```

Validações:

```powershell
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

A porta oficial deste projeto é `3100`. A porta `3000` pertence a outro projeto local e não deve ser usada.
