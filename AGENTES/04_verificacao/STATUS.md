# Status — Persona — Verificação Independente

Estado: rodada 2 do Lote 1 revisada (05/11/2026): relatórios para `d4a1e3b`, `4a37131` e `489ec0d` publicados; execução independente da suíte do Agente concluída no checkout isolado. A rodada 1 (seção "Rodada 1", abaixo) permanece como histórico e não aprova os substitutos.

## Rodada 2 (base `8da08c6`)

| Entrega | SHA | Relatório | Achados abertos | Gate sugerido |
|---|---|---|---|---|
| 01 Interface | `d4a1e3b` | `RELATORIO_interface_d4a1e3b.md` | S3: IF-1 (I-1 persiste), IF-2 (I-3 persiste), IF-3 (STATUS auto-rotulado VERIFIED) | liberar com ressalvas |
| 02 Backend | `4a37131` | `RELATORIO_backend_4a37131.md` | S2: BK-1 (VERIFIED, teste não exercita RLS por papel), BK-2 (HYPOTHESIS, SQLSTATE 23001 × 23503), BK-5 (HYPOTHESIS, B-1 pode abortar o passo 1 antes de R1); S3: BK-3, BK-4 | bloquear integração até correção textual; depois liberar com ressalvas. B-1 pendente de Yan; R1 HYPOTHESIS; sem banco real |
| 03 Agente NVIDIA | `489ec0d` | `RELATORIO_agente-nvidia_489ec0d.md` | S2: A-1 residual (excerto de espaços, VERIFIED), A-7 (excerto sem fronteira distorce número/negação, VERIFIED); S3: A-8, A-5/A-6, carregados da rodada 1 | bloquear integração |

Nenhum S1. Nenhuma severidade reduzida.

### Execução independente (Agente; checkout `C:\Users\yansi\Projetos\persona-wt\verificacao-489ec0d`, HEAD `489ec0d`, `git status` limpo antes e depois)

| Comando (em `apps\web`) | Exit | Contagens |
|---|---:|---|
| `node --experimental-strip-types --test lib/agent/*.test.ts` | 0 | 13 tests, 13 pass, 0 fail |
| `npm test` | 0 | 32 tests, 32 pass, 0 fail (não inclui `lib/agent`) |
| `npm run lint` | 0 | sem diagnósticos |
| `npm run typecheck` | 0 | sem erros |

Sondas adicionais por scripts no scratchpad (fora do repositório) que importam o módulo por URL `file:`; nenhum arquivo versionado alterado.

### Handoff da rodada 2

- Escopo: pedido de Yan via Orquestrador (rodada 2); escrita só em `AGENTES/04_verificacao/**`.
- Arquivos alterados por mim: `RELATORIO_interface_d4a1e3b.md`, `RELATORIO_backend_4a37131.md`, `RELATORIO_agente-nvidia_489ec0d.md` (novos) e este `STATUS.md`. `PLANO_LOTE1.md` e os três relatórios da rodada 1 intactos. Sem `git add`/commit.
- Comandos: `git diff --name-only|--check 8da08c6..<SHA>`, `git show`, `git log`, `git grep`, `git ls-tree`, `git archive` (para o scratchpad), scripts Python de leitura sobre `MANIFEST.json`, `.jsx` e migrações, `verificar.py` (285/285), os quatro comandos acima. Nenhum SQL, banco, credencial, `.env`, rede de modelo, `npm install` ou build; nada rodado nos worktrees dos escritores.
- Riscos: A-1 residual e A-7 atingem a garantia central do Agente (fato verdadeiro); B-1/R1 dependem de banco real; o teste da Fase 9 não cobre RLS por papel.
- Limitações: Backend e Interface só por leitura; sintaxe SQL não executada; capturas, acessibilidade e aceite visual não avaliados; A-7/A-8 sondados contra o módulo do checkout, não contra modelo real.
- Decisões pendentes: Yan (B-1 A/B/C, QA com duas contas descartáveis, 9 decisões de Interface, aceite visual); Orquestrador (dono do parser compartilhado `lib/live/response-schema.ts`, inclusão de `lib/agent/*.test.ts` no `npm test`).
- Bloqueio: integração do Agente e do Backend; nenhum bloqueio para a Verificação.
- Próximo passo: novos SHAs com as correções; reexecutar os quatro comandos e atualizar os relatórios.
- Percentual comprovado do plano ponderado: 0% (nenhum eixo completo).

## Rodada 1 (histórico, superada)

A tabela de pesos acima e as seções seguintes são da rodada 1.

| Tarefa | Peso | Estado | Evidência |
|---|---:|---|---|
| Funcional e regressão | 25 | PENDING | revisão estática feita; suíte, lint e typecheck não executados por mim (resultados do escritor/Orquestrador não contam) |
| Segurança e privacidade | 30 | PENDING | ownership, rede, mutação, segredos e SQL revisados por leitura; A-1 reproduzido em execução externamente (Codex); RLS em banco real não autorizado |
| UX e acessibilidade | 25 | PENDING | sem UI no lote; estados do protótipo conferidos por nome; capturas, teclado e leitor de tela não avaliados |
| Performance e release | 20 | PENDING | sem build; escopo, arquivos proibidos e `diff --check` limpos nos 3 SHAs |

Concluído (ponderado): 0%. Nenhum eixo está completo.
Faltante: 100%

## Relatórios e gate (base `8da08c6`)

| Entrega | SHA | Relatório | Achados abertos | Gate |
|---|---|---|---|---|
| 01 Interface | `8c5ef15` | `RELATORIO_interface_8c5ef15.md` | S3: I-1, I-2, I-3 (O-1 observação; capturas PENDING) | **liberar com ressalvas**: corrigir I-1 a I-3 |
| 02 Backend | `ffd4289` | `RELATORIO_backend_ffd4289.md` | S2: B-1 (hipótese), B-2, B-4 (hipótese); S3: B-3, B-5 | **bloquear integração** |
| 03 Agente NVIDIA | `6a6b8f0` | `RELATORIO_agente-nvidia_6a6b8f0.md` | S2: A-1 (VERIFIED em execução, por Codex; a minha segue PENDING); S3: A-2 a A-6 | **bloquear integração** |

Nenhum S1. Nenhuma severidade foi reduzida.

## O que cada bloqueio exige (novo SHA congelado e nova revisão)

- **Backend:** B-2 corrigido com duas contas sintéticas sacrificáveis criadas por fluxo suportado do Supabase Auth, preferencialmente em ambiente isolado, sem conta principal e sem inserção manual em `auth.users`; B-1 decidido (hardening explícito de `EXECUTE` para `anon` antes de aplicar a migração; mudar a migração é gate de Yan). B-4/R1 segue HYPOTHESIS e gate operacional da Fase 9.
- **Agente:** correção do parser compartilhado `parseLiveResponse` (usado também pelo Persona Live) pelo dono definido pelo Orquestrador, com regressão que cubra Live e Agente.
- **Interface:** corrigir I-1, I-2 e I-3 no texto.

## Handoff

- Escopo: `LOTE-1.md` §04 e `LOTE-1_CONGELADO.md`. Escrita só em `AGENTES/04_verificacao/**`; sem `git add`/commit/merge/troca de branch; nada executado nos worktrees dos escritores.
- Arquivos alterados: `PLANO_LOTE1.md`, `STATUS.md`, os 3 `RELATORIO_*.md`. Nenhum arquivo do produto. Auxiliares no scratchpad, fora do repositório.
- Comandos (só leitura): `git diff --stat|--name-only|--check 8da08c6..<SHA>`, `git show <SHA>:<arquivo>`, `git log`, `grep`, `sha256sum`, `ls`, `wc -l`, dois scripts Python com `-I` que leem o documento e os `.jsx`.
- Execução independente: **PENDING**. O Orquestrador autorizou um checkout/worktree isolado da Verificação somente para executar a suíte do novo SHA do Agente (`node --experimental-strip-types --test lib/agent/*.test.ts`, `npm test`, `npm run lint`, `npm run typecheck`). Ainda não há caminho informado nem novo SHA; não criei nada.
- Riscos: A-1 atinge o Persona Live em uso; B-4/R1 pode impedir exclusão de conta; B-1 é questão de menor privilégio.
- Decisões pendentes: Orquestrador, dono da correção do parser, caminho do checkout isolado, novos SHAs; Yan, mudança de migração (B-1), execução em banco real e aceite visual.
- Bloqueio: não há bloqueio para a Verificação; há bloqueio de integração do Backend e do Agente.
- Próximo passo: receber novos SHAs, revisar o patch, executar a suíte do Agente no checkout autorizado e atualizar os relatórios.
- Fora de autorização por este gate: merge, banco real, aprovação visual, Preview e Production.
