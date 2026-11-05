# Lote 1 — diffs congelados para a Verificação (rodada 2)

Congelado pelo Orquestrador. Rodada 2 em 05/11/2026, após as correções dos escritores, por instrução de Yan. Base: `8da08c698a74aeb4d95c70123eba61fc921a591c`. Os branches compartilham o repositório Git, então `git diff 8da08c6..<SHA>` funciona de qualquer checkout. Um SHA é imutável: nova correção gera novo SHA e novo registro.

## SHAs vigentes — rodada 3 (substituem os da rodada 2)

Congelados pelo Orquestrador em 05/11/2026 após as correções da rodada 3 (`LOTE-1_CORRECOES.md`). Cada SHA é o **topo do branch** do escritor, conferido por mim: HEAD igual ao SHA, worktree limpo, caminhos dentro do escopo, nenhum arquivo proibido, `git diff --check 8da08c6..<SHA>` limpo, trailer de coautoria, sem push. Os SHAs da rodada 2 viram histórico e os relatórios deles **não aprovam** estes.

| Entrega | Branch | SHA congelado | Commits desde a base | Arquivos | Linhas (vs. base) |
|---|---|---|---:|---:|---|
| 01 Interface | `wt/interface-lote1` | `8240cf3df08161d0888ec61535de46cd0100fbcd` | 4 | 2 | +169 / −13 |
| 02 Backend | `wt/backend-lote1` | `ee6ac3f43ad10523b71f3f2924e71750db6f8490` | 5 | 5 | +560 / −68 |
| 03 Agente NVIDIA | `wt/agente-nvidia-lote1` | `f4edecf6fac422e6980d0e045ea30e29e22aa3e8` | 5 | 5 | +446 / −13 |

- Interface: correções em `d88f2f2`; `8240cf3` só registra o SHA no STATUS.
- Backend: um commit de correção sobre `4a37131`; entra também `docs/redesign/backend/HANDOFF_LOTE1.md`, novo e dentro de `docs/redesign/backend/**`.
- Agente: o código está em `56afc7c99344c87c53e2e83719c8f0b83ac12741`; o topo `f4edecf` só registra o SHA no STATUS. Congelei o topo para que a revisão cubra também o handoff escrito.

Comando de diff para cada um: `git diff 8da08c6..<SHA>` a partir de qualquer checkout.

### Checkout isolado da Verificação (reposicionado)

`C:\Users\yansi\Projetos\persona-wt\verificacao-489ec0d` agora está **desanexado em `f4edecf6fac422e6980d0e045ea30e29e22aa3e8`** (o nome da pasta é histórico), limpo, com `next typegen` refeito; `node_modules` e lockfile inalterados. Mesma regra: só executar, sem editar arquivo versionado nem `npm install`. Comandos em `apps\web`:

```text
node --experimental-strip-types --test lib/agent/*.test.ts
npm test
npm run lint
npm run typecheck
```

### Pedidos dos escritores já registrados

- `apps/web/lib/live/response-schema.ts` (parser compartilhado, sem dono) tem os mesmos defeitos A-1/A-7 e serve o Persona Live: **decisão de dono e correção pendentes**, fora desta rodada.
- Incluir `lib/agent/*.test.ts` no `npm test`: Orquestrador, em commit próprio **depois** da aprovação.
- Decisão de produto do Agente: o limiar `score > 0` pode cortar evidência relevante (recall não medido).
- O Agente declara como **não coberto**: limites de tamanho das entradas, `updated_at` inválido, paráfrases de meta-comando e escopo sintático da negação.

## Rodada 2 (superada por esta)

## SHAs da rodada 2 (histórico)

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
