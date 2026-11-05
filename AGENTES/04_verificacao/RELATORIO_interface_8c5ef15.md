# Relatório — Entrega 01 · Migração de Interface

SHA revisado: `8c5ef15877afac9837522c16c83d3f86ffbe2a98` (branch `wt/interface-lote1`). Base `8da08c6`. Patch: `git diff 8da08c6..8c5ef15` (2 arquivos, +166/−13).
Método: leitura estática e conferência por script de hashes e nomes de estado. Nenhuma tela foi aberta; **fidelidade visual não avaliada** (decisão de Yan).
Gate (decidido pelo Orquestrador em 05/11/2026): **liberar com ressalvas**: corrigir I-1, I-2 e I-3. Só há S3, então a fórmula é coerente com o `PLANO_LOTE1.md`. I-4 é observação contextual e I-5 é PENDING; nenhum dos dois é achado.

## 1. Checagens comuns

| # | Resultado | Evidência |
|---|---|---|
| C1 escopo | VERIFIED | só `docs/redesign/interface/MAPA_TELAS.md` e `AGENTES/01_interface/STATUS.md` |
| C2 proibidos | VERIFIED | nenhum (`globals.css`, navegação e `package.json` só listados) |
| C3 `diff --check` | VERIFIED | vazio |
| C4 segredos | VERIFIED | nenhuma ocorrência |
| C5 commit | VERIFIED | `docs(interface): …` com trailer |
| C6 handoff | VERIFIED | STATUS declara 0% do plano de implementação e não pontua o mapa |

## 2. Verificado

- **Hashes.** O documento cita 62 prefixos de 12 caracteres. Recalculei `sha256sum` dos 8 HTML, 14 `.jsx` e 2 `manifest.json` de T4 e todos coincidem com os citados; os 62 prefixos aparecem em `MANIFEST.json` (script: nenhum ausente). Cobre também os componentes do DS da seção 5.
- **Rotas e arquivos.** Todos os caminhos de `apps/web` citados existem (incluindo `app/app/layout.tsx`, `app-navigation.tsx`, `diary-forms.tsx`, `evidence-forms.tsx`, `live-forms.tsx`, `artifact-forms.tsx`, `diagnostic-form.tsx`, `profile-form.tsx`, `data-form.tsx`, `settings-navigation.tsx`, `lib/settings/actions.ts`, `lib/artifacts/artifact.ts`, `lib/groq/generate-artifact.ts`, `app/api/export/route.ts`). Nenhuma rota para o Agente existe.
- **Afirmações sobre o app.** Confere: `apps/web/components` não existe; `globals.css` tem 3002 linhas; Geist por `next/font/local` em `layout.tsx`; `@carbon/icons-react` em `package.json`; sem `loading.tsx` em `app/`; tipo `resume` no app contra `curriculo` no protótipo; Credibilidade "Indisponível nesta fase" em `inicio/page.tsx:45`; sem inventário de contagens em `configuracoes/dados/page.tsx`; sem exportação de Artefato.
- **Estados do protótipo.** Para T4.1-T4.7, todos os 132 nomes de estado listados existem como chave nos `.jsx` (script `estados.py`, saída "ausentes: []" em todas as telas).
- **T4.6 e T4.8 não são páginas.** Os `<script src>` do HTML de T4.6 carregam `inicio-screen.jsx` e `score-panel.jsx`; o de T4.8 carrega `inicio-screen`, `evidencias-*`, `live-screen`, `agente-core`, `agente-surfaces`. Confere.
- **Decisões para Yan.** Estão as quatro exigidas (fonte, ícones, Agente sem backend, dados sintéticos) mais cinco; o documento não aprova visual, não manda instalar fonte e não propõe código.
- **Ordem de fatias e arquivos compartilhados** presentes, com `globals.css` e `app/app/layout.tsx`/`app-navigation.tsx` apontados para dono único.

## 3. Achados

### I-1 · S3 · VERIFIED — T4.2 diz que "exclusao-bloqueada" não foi localizado, mas existe no app
`MAPA_TELAS.md`, T4.2, "Lacunas". O app trata a exclusão bloqueada: `app/app/diario/actions.ts:134` redireciona com `notice=delete-blocked` e `diario/[id]/page.tsx:55` exibe a mensagem. A matriz do Backend marca o mesmo item como `EXISTE`. Impacto: o planejador da fatia T4.2 superestima o trabalho e as duas entregas se contradizem. Correção: trocar por "existe (`delete-blocked`)"; `conflito` continua ausente (sem `revision` em `daily_logs`).

### I-2 · S3 · VERIFIED — contagens de estado inconsistentes
T4.3 cita "(`ESC`, 28)" e lista 25 nomes (mais "variantes de link"); T4.5 cita "~40" e lista 28. Os nomes listados existem, o total declarado não bate. Corrigir o número ou listar o que falta.

### I-3 · S3 · VERIFIED — pendências deixadas como instrução no texto do contrato
Há frases como "conferir o protótipo" (Credibilidade em T4.1) e "conferir que o protótipo não a soma" (T4.6), e "não verificado a fundo" (T4.2). O critério de aceite pede lacunas conclusivas. A Credibilidade já está resolvida na matriz do Backend ("sem número nesta versão"). Resolver ou marcar `PENDING` explicitamente.

### Observação O-1 (antes I-4, não é achado) — contexto para a decisão 4.1, fora do escopo do lote
`apps/web/app/layout.tsx:5-7` carrega Geist de `../node_modules/next/dist/next-devtools/server/font/geist-latin.woff2`, um arquivo interno do Next. Uma atualização do Next pode quebrar a fonte. O mapa cita Geist via `next/font/local` mas não registra essa fragilidade. Incluir na decisão de fonte.

## 4. PENDING

- (antes I-5) Fidelidade ao protótipo é de leitura de código: o mapa declara que nenhum screenshot foi reaberto e eu também não verifiquei capturas. A aprovação visual é de Yan.
- Comparação com as capturas em `docs/design/approved/2026-11-03-t4/capturas` e abertura dos HTML no navegador (exige navegador; é decisão do Orquestrador se entra nesta rodada).
- Acessibilidade, teclado e leitor de tela: sem UI implementada.

## 5. Decisão de gate sugerida

Liberar com ressalvas: corrigir I-1 a I-3 no texto e pedir nova revisão só desses trechos. Nenhum achado S1/S2. O-1 e as capturas ficam como contexto/PENDING. Aceite visual e as decisões 4.1-4.9 ficam com Yan.
