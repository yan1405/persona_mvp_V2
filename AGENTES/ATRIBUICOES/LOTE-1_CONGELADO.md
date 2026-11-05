# Lote 1 — diffs congelados para a Verificação (rodada 2)

Congelado pelo Orquestrador. Rodada 2 em 05/11/2026, após as correções dos escritores, por instrução de Yan. Base: `8da08c698a74aeb4d95c70123eba61fc921a591c`. Os branches compartilham o repositório Git, então `git diff 8da08c6..<SHA>` funciona de qualquer checkout. Um SHA é imutável: nova correção gera novo SHA e novo registro.

## SHAs vigentes (substituem os da rodada 1)

| Entrega | Branch | SHA congelado | Commits | Arquivos | Linhas |
|---|---|---|---:|---:|---|
| 01 Interface | `wt/interface-lote1` | `d4a1e3bb1390b8061838f7a0ad8ef98e90f0d304` | 2 | 2 | +169 / −13 |
| 02 Backend | `wt/backend-lote1` | `4a37131865586be802f25511ce8f6969ad09109e` | 4 | 4 | +411 / −68 |
| 03 Agente NVIDIA | `wt/agente-nvidia-lote1` | `489ec0d89b43d47bb858ba95ea44ab8cecc3351a` | 3 | 5 | +317 / −13 |

**Candidato congelado de Dados e Backend:** `4a37131865586be802f25511ce8f6969ad09109e` (branch `wt/backend-lote1`, worktree `C:\Users\yansi\Projetos\persona-wt\backend`, base `8da08c6`, 4 arquivos, +411/−68; reconferido: HEAD igual ao SHA, worktree limpo, merge-base igual à base). Comando de diff para a Verificação: `git -C C:\Users\yansi\Projetos\persona-wt\backend diff 8da08c6..4a37131865586be802f25511ce8f6969ad09109e`. Pontos de revisão pedidos por Yan: fidelidade da matriz ao código real; validade do SQL por leitura e compatibilidade PostgreSQL 15/16/17; isolamento, privilégios e falsos positivos; R1 (HYPOTHESIS) e o que só o banco real prova; preservação de `begin`, transação única e `rollback`. Migração e teste no projeto de QA seguem como gate posterior e separado de Yan.

Caminhos alterados (todos dentro dos caminhos de escrita de `LOTE-1.md`, nenhum arquivo proibido):

- 01: `AGENTES/01_interface/STATUS.md`, `docs/redesign/interface/MAPA_TELAS.md`.
- 02: `AGENTES/02_backend/STATUS.md`, `docs/qa/fase-9/teste-rls-dois-usuarios.sql`, `docs/redesign/backend/MATRIZ_TELA_DADOS.md`, `docs/redesign/backend/RELATORIO_TESTE_RLS.md`.
- 03: `AGENTES/03_agente_nvidia/STATUS.md`, `apps/web/lib/agent/agent.ts`, `agent.test.ts`, `output-guard.ts` (novo), `docs/redesign/agent/CONTRATO_AGENTE.md`.

## Conferido pelo Orquestrador (não substitui a Verificação)

- `git diff --check 8da08c6..<SHA>` limpo nos três; nenhum padrão de segredo, chave, e-mail ou `service_role` nas linhas adicionadas; todos os commits têm o trailer de coautoria; os três branches sem upstream e sem push.
- Os SHAs congelados são exatamente o HEAD de cada worktree, e os três estão limpos.
- Não reexecutei testes nesta rodada: a execução independente é da Verificação (ver abaixo).

## Checkout isolado para a Verificação

`C:\Users\yansi\Projetos\persona-wt\verificacao-489ec0d`: worktree **desanexado** em `489ec0d89b43d47bb858ba95ea44ab8cecc3351a`, limpo, com `npm ci` (código 0) e `npx next typegen` já feitos. Uso exclusivo da Verificação, somente para executar, sem editar arquivo versionado:

```text
cd apps\web
node --experimental-strip-types --test lib/agent/*.test.ts
npm test
npm run lint
npm run typecheck
```

Não rodar `npm install`, não editar nem commitar ali. Para outros SHAs a execução continua fora do escopo e deve ser pedida ao Orquestrador. Sem chave NVIDIA, sem `.env*`, sem rede de modelo.

## Relatórios

A Verificação cria ou atualiza relatórios **específicos para estes três SHAs**, em `AGENTES/04_verificacao/`. Os relatórios dos SHAs antigos (`8c5ef15`, `ffd4289`, `6a6b8f0`) ficam como histórico e **não aprovam** os substitutos.

## Histórico — rodada 1 (superada)

| Entrega | SHA |
|---|---|
| 01 Interface | `8c5ef15877afac9837522c16c83d3f86ffbe2a98` |
| 02 Backend | `ffd4289e1c7efaa46ae52734962e5d371e1ee491` |
| 03 Agente NVIDIA | `6a6b8f0011aa340a0efaf5862c837d72ab530777` |

## Itens já conhecidos (não são achado novo)

- `lib/agent/*.test.ts` entra no `npm test` em commit próprio do Orquestrador, **depois** da nova revisão.
- O validador do agente aceita número já presente na evidência, inclusive plantado (risco declarado).
- R1 do Backend é HYPOTHESIS e só um banco real confirma; as propostas B-1/QA/R1 estão em `LOTE-1_BACKEND_DECISOES.md`.
