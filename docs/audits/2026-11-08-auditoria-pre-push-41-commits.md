# Auditoria pré-push — 41 commits de `origin/main..b989c9f`

Data: 08/11/2026. Escopo: `git log origin/main..b989c9f` (41 commits; base `06de045`, Production) mais o commit `939e228` (handoffs históricos, só documentação, sem segredos). Somente leitura; nada foi enviado. Parecer: **não fazer push de `main` como está** (achados P-1 e P-2).

## Resumo do diff

379 arquivos, +31.736 / −104. 349 adicionados, 12 modificados, 18 renomeados. 2 merges. Autor único (Yan); 4 commits (`45379b8`, `78cb904`, `9c5ce5c`, `96e5028`) vêm da branch `codex/persona-preview-20261028` e não têm trailer de coautoria.

| Área | Arquivos | Natureza |
|---|---:|---|
| `docs/design/approved/2026-11-03-t4` | 285 | pacote visual congelado (HTML/JS/JSON, 17 PNG) |
| `AGENTES/**` | ~45 | governança, status, relatórios da Verificação, prompts |
| `docs/**` restante | ~20 | redesign, handoff, planos, QA, arquivo legado |
| raiz (`AGENTS.md`, `CLAUDE.md`, `README.md`, `log_execução.md`, `.claude/`) | 8 | instruções e Ponytail |
| `apps/web` | 6 | **código de produto** (abaixo) |

Não mudaram: `package.json`, lockfile, `supabase/`, `next.config`, `proxy.ts`, `tsconfig`, ESLint, `.gitignore`, CI. Nenhuma migração.

## Código de produto no diff

1. `45379b8` — **Persona Live passa de Groq para NVIDIA**: `lib/groq/generate-live-response.ts` → `lib/live/generate-live-response.ts` (R058), `actions.ts` (import), `.env.example` (`NVIDIA_API_KEY`, `NVIDIA_MODEL`). `LIVE_PROMPT_VERSION` vira `persona-live-nvidia-v1`; temperatura 0,1 → 0,5; saída `json_schema strict` do provedor → schema só no prompt, validado depois por `parseLiveResponse`; duas tentativas, 15 s cada.
2. `b989c9f` — `lib/agent/**` (3 arquivos), sem rota, sem chamada de rede, sem importação por nenhuma rota.
3. `lib/live/response-schema.ts` (parser): **inalterado** em relação a `06de045`.

## Achados

| ID | Sev. | Achado |
|---|---|---|
| P-1 | **Alta** | O push de `main` dispara deploy: o projeto Vercel `persona-mvp-v2` tem domínio `git-main`. As variáveis do projeto são só `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`, `GROQ_MODEL`. **`NVIDIA_API_KEY` não existe.** Com o código novo, `generateLiveResponse` lança `not_configured` e o Persona Live deixa de funcionar em Production. O Live é o fluxo central da demonstração. |
| P-2 | **Alta** | O repositório `yan1405/persona_mvp_V2` é **público** (verificado em 08/11/2026). O push publicaria `AGENTES/**` (relatórios, prompts, status internos, incluindo menção a credencial NVIDIA anteriormente exposta), o pacote visual completo e 30 arquivos com o caminho local `C:\Users\yansi\…` (42 ocorrências). Não há segredo, mas há informação interna e de ambiente. Decisão de Yan: publicar ou não. |
| P-3 | Média | A troca do Live não tem teste: nenhum teste cobre `generate-live-response.ts` (`live.test.ts` cobre só validação, recomendação e parser). A chamada real à NVIDIA nunca foi comprovada em produto; o registro do Orquestrador cita respostas que expiraram em até 90 s com o endpoint trial. Pior caso de duas tentativas: 30 s mais o tempo da ação no servidor. HYPOTHESIS: o limite da função na Vercel pode ser menor. |
| P-4 | Média | A troca muda o comportamento do Live sem decisão registrada no cofre: temperatura 0,5 (era 0,1) e perda do JSON Schema estrito do provedor. O ADR Groq→NVIDIA (Diário, Score, Artefatos) continua pendente; só o Live foi trocado, e `groq-sdk` segue em uso nos outros três módulos. |
| P-5 | Baixa | `45379b8` e os 3 commits seguintes não têm trailer de coautoria; procedem da branch de Preview e não foram revisados pela Verificação Independente. |
| P-6 | Baixa | `docs/design/approved` duplica `_ds_bundle.js` (5.625 linhas) e `_adherence.oxlintrc.json` em dois diretórios; só ruído de tamanho. |
| P-7 | Baixa | O `STATUS.md` do Agente em `main` segue desatualizado; `lib/agent/*.test.ts` fora do `npm test`. Já registrados. |

## Verificado limpo

- Segredos nas 31.736 linhas adicionadas (`nvapi-`, `gsk_`, `sb_secret_`, `sk-`, `AKIA`, `ghp_`, JWT, chave privada, atribuições `chave/senha/token = valor`): **0**. As cinco ocorrências de `service_role` são texto de relatório sobre a própria varredura.
- E-mails: só `@exemplo.com` / `@exemplo.invalid`. URLs: só `persona-mvp-v2.vercel.app` (domínio público do produto).
- `git diff --check origin/main..HEAD`: limpo. Sem submódulos, sem binários além dos 17 PNG do pacote visual.
- Quarentena de comandos legados: 17 renomeações 100% idênticas para `docs/archive/agent-legacy/`; `.claude/settings.json` só tem regras `deny` para `claude-flow`, `agentic-flow` e `ruflo`.
- Execução em checkout limpo de `b989c9f` (`npm ci`, sem `.env`): testes do agente 20/20, `npm test` 32/32, lint 0, typecheck 0, `next build` 0 (24 páginas).

## Opções antes de qualquer push (decisão de Yan)

A. Não enviar `main`. Enviar só o necessário a uma branch (por exemplo `baseline/…`), sem tocar Production.
B. Separar o código: reverter `45379b8` (Live) em `main` antes do push, ou enviar só `docs`/`AGENTES` e tratar o Live em branch própria até haver chave na Vercel e teste real.
C. Se for enviar à `main`: antes, definir `NVIDIA_API_KEY` na Vercel (chave rotacionada, feita pelo titular) e provar o Live em Preview; decidir se o repositório continua público ou se `AGENTES/` e os caminhos locais saem.
