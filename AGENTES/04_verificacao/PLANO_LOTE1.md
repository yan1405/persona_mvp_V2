# Plano de verificação — Lote 1

Papel: Persona — Verificação Independente. Somente leitura. Base: `8da08c698a74aeb4d95c70123eba61fc921a591c`.
Estado: `PENDING` — plano publicado; nenhuma revisão feita. Revisão só começa com **diff congelado** (SHA + patch) do Orquestrador.

## Regras de revisão

- Revisar `git diff 8da08c6..<SHA>` e `git -C <worktree> show/log`; nunca editar, instalar, buildar nos worktrees dos escritores.
- Achado = arquivo:linha + reprodução mínima (comando e saída) + impacto + recomendação. Sem reprodução, vira `HYPOTHESIS`.
- Severidade: S1 bloqueia o lote (vazamento, escrita fora do escopo, SQL destrutivo, mutação no agente); S2 corrigir antes da integração; S3 melhoria. Só reduzir com evidência anotada.
- Estados: `VERIFIED`, `HYPOTHESIS`, `PENDING`, `BLOCKER`. Aprovação visual, Preview e Production ficam com Yan.
- Nunca copiar segredos, `.env`, dados pessoais ou prompts completos para os relatórios.

## Checagens comuns às três entregas (C1–C6)

| # | Critério | Comando de revisão |
|---|---|---|
| C1 | Só tocou caminhos de escrita da sua seção em `ATRIBUICOES/LOTE-1.md` | `git diff --name-only 8da08c6..<SHA>` comparado à seção |
| C2 | Nenhum arquivo proibido (`package.json`, lockfile, `next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `proxy.ts`, `globals.css`, `supabase/migrations/**`, `.env*`) | mesmo diff, filtrando esses nomes |
| C3 | `git diff --check` limpo | `git diff --check 8da08c6..<SHA>` |
| C4 | Sem segredo/dado pessoal/chave NVIDIA | `git diff 8da08c6..<SHA>` + `rg -i "nvapi-|secret|service_role|password|eyJ"` sobre o patch |
| C5 | Commit com prefixo `docs/test/feat(...)`, trailer de coautoria, sem push/upstream | `git log --format=%B 8da08c6..<SHA>`; `git branch -vv` |
| C6 | `STATUS.md` do papel traz o handoff completo (estado, arquivos, comandos/resultados, riscos, decisões, bloqueio, próximo passo, % comprovada) e a % só conta tarefas com evidência | leitura |

## Entrega 01 — Interface (`wt/interface-lote1`, `docs/redesign/interface/MAPA_TELAS.md`)

Pergunta: o mapa é fiel ao protótipo e ao app?

1. Cobre T4.1–T4.8, cada uma com: rota real existente/ausente, componentes protótipo → TSX proposto/reutilizado, estados, lacunas, arquivos compartilhados, ordem de fatias.
2. Toda rota/componente citado existe: `ls`/`Glob` em `apps/web/app/**` (hoje: `inicio`, `diario`, `evidencias`, `live`, `artefatos`, `score`, `configuracoes`, `diagnostico`, sem rota para Agente) e em `apps/web/components`.
3. Toda afirmação sobre o protótipo cita arquivo de `docs/design/approved/2026-11-03-t4/fonte/**` e hash do `MANIFEST.json`; conferir amostra com `sha256sum` e `python docs/design/approved/2026-11-03-t4/verificar.py` (somente leitura).
4. Estados citados existem de fato nos `.jsx` (grep por estado/variante); apontar estados inventados ou omitidos.
5. Decisões para Yan presentes: Plus Jakarta Sans + Inter vs Geist; Lucide vs Carbon (`AGENTS.md` §8); T4.8 sem backend; dados sintéticos de T4.
6. Não declara aprovação visual nem implementação; não instrui instalar fonte.
7. Arquivos compartilhados listados (`globals.css`, navegação `app-navigation.tsx`, `package.json`) sem tocá-los.

## Entrega 02 — Dados e Backend (`wt/backend-lote1`, `docs/redesign/backend/**`, `docs/qa/fase-9/**`)

Pergunta: a matriz bate com as migrações e o teste RLS é seguro?

1. Cada tabela, coluna, função, política e action citada existe: `rg` em `supabase/migrations/*.sql`, `apps/web/app/**/actions.ts`, `apps/web/lib/**`. Itens sem lastro devem estar marcados "inexistente".
2. Cobertura T4.1–T4.8: cada leitura, mutação e estado ligado a algo real ou marcado inexistente (Agente).
3. `teste-rls-dois-usuarios.sql`: `git diff` contra o baseline; continua em transação e termina em `rollback`; nenhum `commit`; nada de `service_role`, DDL persistente ou `DROP`; usa só dados sintéticos; assertivas coerentes com `20260818200000_phase_9_settings.sql` e demais políticas (dono lê/escreve o seu; outro usuário não lê nem escreve).
4. Relatório separa "checado por leitura" de "só banco real prova"; não afirma RLS aprovada.
5. Zero migração nova e nenhum arquivo em `supabase/` alterado (C2).
6. Revisão manual do SQL (não executar): sintaxe, nomes de políticas, `set local role`/claims, ordem.

## Entrega 03 — Agente NVIDIA (`wt/agente-nvidia-lote1`, `apps/web/lib/agent/**`, `docs/redesign/agent/**`)

Pergunta: respeita ownership, schema e zero mutações?

1. Sem rede: `rg -n "fetch\(|http|https|nvidia|XMLHttpRequest|node:net|node:http" apps/web/lib/agent` sem chamada real; sem SDK novo; `lib/live/generate-live-response.ts` intacto.
2. Zero mutações: nenhum import de Supabase client com escrita, `insert|update|delete|upsert|rpc` fora de teste simulado; a matriz de ferramentas lista proibidas e o código não as expõe.
3. Ownership: recuperação filtra por usuário; teste com evidência de outro usuário nunca entra no contexto nem na resposta.
4. Validação pós-resposta cobre ID inexistente, excerto não literal, número não presente, evidência alheia, schema inválido; falha fecha (rejeita), não repara silenciosamente.
5. Adversariais presentes e significativos: prompt injection na pergunta e na evidência, timeout, rate limit, resposta malformada. Tentar ao menos dois casos adicionais próprios (ex.: ID com variação de caixa, número formatado "1.000" vs "1000") e registrar se passam.
6. Prompt versionado; logs sem prompt completo nem dado pessoal (`rg "console\."`).
7. Contrato declara o que não está comprovado (nenhuma inferência real) e não promete nada além.
8. Execução da suíte no checkout do Orquestrador sobre o SHA congelado, somente se o Orquestrador autorizar um worktree de verificação; senão registrar `PENDING` e revisar por leitura. Comandos: `node --experimental-strip-types --test lib/agent/*.test.ts`, depois `npm run lint`, `npm run typecheck` (após `npx next typegen`), `npm test` (32 existentes verdes).
9. Pedido de incluir `lib/agent/*.test.ts` no script `test` registrado no handoff (tarefa do Orquestrador).

## Matriz de verificação (pesos de `AGENTES/04_verificacao/AGENTS.md`)

| Eixo | Peso | O que será verificado neste lote | Fora do lote (PENDING) |
|---|---:|---|---|
| Funcional e regressão | 25 | C1–C3, testes do agente, 32 testes existentes, fidelidade doc↔código | jornada no navegador (sem código de produto alterado) |
| Segurança e privacidade | 30 | C4, ownership, zero mutações, prompt injection, SQL RLS em transação, sem chave/dado real | RLS em banco real, Auth, pentest/Strix (exige alvo e autorização) |
| UX e acessibilidade | 25 | decisões visuais pendentes sinalizadas, estados do protótipo cobertos no mapa | foco, teclado, leitor de tela, 1024/1280/1440/1920 px (sem UI implementada) |
| Performance e release | 20 | limites do agente (timeout, 5–8 evidências), diff sem arquivos proibidos | build, bundle, Preview/Production (gates de Yan) |

## Formato do relatório por entrega

`AGENTES/04_verificacao/RELATORIO_<entrega>_<SHA7>.md`: SHA e patch revisados; comandos com saída; achados por S1/S2/S3 (arquivo:linha, reprodução, impacto, recomendação); itens `VERIFIED`/`PENDING`; decisão de gate sugerida ao Orquestrador (liberar / liberar com ressalvas / bloquear).

## Pré-requisito aberto

Worktrees observados com um commit cada (`interface 8c5ef15`, `backend ffd4289`, `agente-nvidia 6a6b8f0`), todos sobre o baseline. São apenas referência; só vale o SHA congelado entregue pelo Orquestrador.
