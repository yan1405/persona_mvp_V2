# Status — Persona — Dados e Backend

Estado: WAITING_APPROVAL

Atribuição: `AGENTES/ATRIBUICOES/LOTE-2.md` (linha 02 e Rodada 2) · branch `wt/backend-lote2` · base `acc1f44`.
SHA anterior (congelado, não reescrito): `4b4650d34f3a748078dcb5b7c6c351eade7ad7eb`. SHA novo da Rodada 2: informado no handoff (um commit não contém o próprio SHA).

| Entrega do Lote 2 | Estado | Evidência |
|---|---|---|
| Migração B-1 (`revoke execute` de `anon`, bloco `DO` que falha) | escrita, sem `begin`/`commit` (BK2-1), **não aplicada** | `supabase/migrations/20261108120000_b1_revoke_anon_execute.sql` |
| Rollback e método de aplicação | escrito; comportamento do executor rotulado `HYPOTHESIS` | `docs/redesign/backend/ROLLBACK_B1.md` |
| Verificação e teste | escritos, **não executados** | `docs/qa/fase-9/verificacao-b1-anon-execute.sql`; passo 1b de `teste-rls-dois-usuarios.sql` reprova |
| Textos alinhados à opção A (BK2-2) | feito | `RELATORIO_TESTE_RLS.md` §4/§4b; nota de histórico em `docs/redesign/backend/HANDOFF_LOTE1.md` |

Aceite pendente: parecer da Verificação sobre o SHA novo e gates de Yan (aplicar migração, rodar verificação e teste no QA). Nada marcado VERIFIED por este papel.

## Lote 2 — B-1 opção A (`wt/backend-lote2`, base `acc1f44`)
- Estado: WAITING_APPROVAL. SHA anterior `4b4650d`; SHA novo: informado no handoff.
- Rodada 2: removidos `begin`/`commit` da migração (BK2-1); textos operacionais alinhados à opção A (BK2-2); este arquivo reorganizado (BK2-3).
- Rodada 5: BK3-1/BK3-2 saneados em documentação e comentários; CLI/SQL Editor permanecem `HYPOTHESIS`, e toda falha exige a verificação de catálogo antes de nova ação. O SQL executável não mudou.
- Entregue: `supabase/migrations/20261108120000_b1_revoke_anon_execute.sql` (`revoke execute … from anon` nas duas funções, sem `begin`/`commit`, bloco final falha se `anon` tiver `EXECUTE` ou `authenticated` perder); `docs/redesign/backend/ROLLBACK_B1.md`; `docs/qa/fase-9/verificacao-b1-anon-execute.sql` (somente leitura); passo 1b de `teste-rls-dois-usuarios.sql` agora reprova (`FALHOU B-1`).
- Decisões: `authenticated` e `service_role` não tocados; `alter default privileges` fora do escopo (funções futuras seguem abertas a `anon` se o default do Supabase valer; decisão de Yan).
- Validação: leitura contra a migração da Fase 9 (assinaturas, ordem das timestamps), `git diff --check`, varredura de segredo. Nada executado: sem SQL, sem banco, sem migração aplicada.
- HYPOTHESIS (só o banco real confirma): `anon` hoje tem `EXECUTE` por default do Supabase; `has_function_privilege` e `aclexplode`/`acldefault` na verificação se comportam como lido; CLI e SQL Editor agrupam os comandos como esperado. Após qualquer falha, o estado deve ser medido por `verificacao-b1-anon-execute.sql`.
- `LOTE-1_BACKEND_DECISOES.md` é do Orquestrador (corrigido por ele).
- Gates de Yan: aplicar a migração (após a Fase 9), rodar verificação e teste no QA.

---

# Histórico — Lote 1 (superado, não canônico)

Estado do Lote 1 em `wt/backend-lote1`, base `8da08c6`; mantido para rastreio.

Atribuição: `AGENTES/ATRIBUICOES/LOTE-1.md`, seção 02 · branch `wt/backend-lote1` · base `8da08c6`.

| Tarefa | Peso | Estado | Evidência |
|---|---:|---|---|
| Matriz tela × dados × ações | 25 | entregue e revisada no fechamento do Lote 1 | `docs/redesign/backend/MATRIZ_TELA_DADOS.md`: T4.1–T4.8 ligadas a tabela/RPC/action/lib ou marcadas INEXISTENTE; nomes conferidos por `grep` nas migrações e em `apps/web` |
| Adaptação de contratos | 25 | PENDING | sem atribuição neste lote (nenhuma action/lib alterada) |
| Auth, ownership e RLS | 25 | PENDING | script revisado e corrigido por leitura (`RELATORIO_TESTE_RLS.md`); **não executado** — o peso só conta com o teste rodando em banco liberado por Yan |
| Regressão e falhas | 25 | PENDING | sem código de produto alterado; lint/typecheck/testes não se aplicam |

Concluído: 25% (conforme contrato; a matriz só conta como VERIFIED após o parecer da Verificação)
Faltante: 75%
Lote 1 (aceite da atribuição): matriz completa + relatório RLS + script corrigido, todos entregues; execução no banco é gate de Yan.

## Arquivos alterados

- `docs/redesign/backend/MATRIZ_TELA_DADOS.md` (novo)
- `docs/redesign/backend/RELATORIO_TESTE_RLS.md` (novo)
- `docs/qa/fase-9/teste-rls-dois-usuarios.sql` (reescrito; continua em `begin … rollback`)
- `AGENTES/02_backend/STATUS.md`

Nenhum arquivo de `supabase/`, `apps/web/`, `package.json`, `.env*` foi tocado.

## Comandos e resultados

- `git diff --check` → limpo (apenas aviso de LF→CRLF do Git no `.sql`).
- Ajustes finais (commit seguinte a `1e7ad02`): script exige duas contas descartáveis de QA (sem recomendar conta principal); passo 1 verifica também TRUNCATE, REFERENCES e TRIGGER para `anon` e `authenticated` (as chaves do JSON esperado não mudaram). Não executado.
- Compatibilidade PostgreSQL 15/16/17: o passo 1 inclui `maintain` na verificação de privilégios da tabela só se `server_version_num >= 170000`; em 15/16 não é passado. Assertions, transação e rollback preservados. Não executado.
- Passos 1, 5, 6 e 9 do script agora reprovam sozinhos via `pg_temp.confere` (compara jsonb obtido × esperado); não executado.
- `grep` dos nomes de tabelas/RPCs citados na matriz contra `supabase/migrations` e `apps/web` → todos encontrados (só "não encontrados": os termos genéricos `max_rows` e `select_own`, que não são objetos).
- Não executados: SQL (sem banco), `npm run lint/typecheck/test/build` (sem código alterado).

## Achados (detalhe em `MATRIZ_TELA_DADOS.md`, "Riscos")

1. **Teste RLS original nunca reprovava** (o `raise 'FALHOU'` estava dentro do `exception when others`) e o "isolamento" não testava o banco. Corrigido.
2. **R1 · ALTA · HYPOTHESIS:** `delete_own_account` pode falhar para usuários com evidências/Live/Artefatos/diagnóstico, por FKs `on delete restrict` (fases 4–8) na cascata de `auth.users`. O script agora semeia esses dados e imprime `ACHADO BLOQUEANTE` se confirmar. Correção exige migração (gate).
3. **R2 · MÉDIA:** ausência de paginação em `/api/export` é fato no código; o teto de linhas (`max_rows`) do projeto Supabase segue PENDING (sem `supabase/config.toml` no repositório).
4. **R3:** conflito "outra aba" de T4.2/T4.3 sem `revision` em `daily_logs`/`evidences`.
5. Agente (T4.8), Credibilidade, níveis Certificada/Validada, envio de lembretes: INEXISTENTES.

## Decisões pendentes para Yan / Orquestrador

- Aplicar a migração da Fase 9 e rodar o script no projeto de QA (gate Supabase) e devolver os `NOTICE`.
- Se R1 se confirmar: aprovar migração corretiva (ordem de exclusão ou FKs deferíveis).
- Aceitar ou não migração para `revision` em Diário/Evidências (R3).

Bloqueio: execução do teste em Supabase real (gate de Yan). Sem bloqueio para a revisão da Verificação.
Próximo passo: Orquestrador congela SHA do commit e envia à Verificação; após liberação de Yan, rodar o teste.
Decisões do usuário: migrações remotas e RLS exigem aprovação específica.
Validação: leitura e `git diff --check`; nada comprovado em banco real.

## Rodada 3 — correções BK-1…BK-5 (liberadas pelo Orquestrador, `LOTE-1_CORRECOES.md` §02)
Commits novos sobre `4a37131865586be802f25511ce8f6969ad09109e` (imutável, sem amend/rebase/reset). Novo SHA: ver `git log` do branch (registrado na mensagem ao Orquestrador).
- **BK-1:** cabeçalho do script e `RELATORIO_TESTE_RLS.md` §0: roda como `postgres`, não prova RLS das Fases 3–8; teste futuro descrito em §7 (não implementado).
- **BK-2:** R1 aceita `23001` e `23503`, sem afirmar qual vem (script, matriz, relatório).
- **BK-3:** matriz corrigida: não há `ilike`; filtro em memória.
- **BK-4:** `profiles` semeado; passo 9 com 11 contagens zero; limites restantes justificados em §4b.
- **BK-5:** B-1 virou passo 1b não abortante (`ACHADO B-1`); opção A/B/C segue decisão de Yan, não escolhida. [Superado no Lote 2: opção A decidida; passo 1b reprova.]
- Não executado: SQL, banco, migração. Mantidos `begin`, transação única e `rollback`; sem `commit` nem DDL persistente.
- B-1 pendente de Yan [superado no Lote 2: opção A]; R1 HYPOTHESIS; nada marcado VERIFIED antes da Verificação.

## Fechamento do Lote 1 (prompt 07)
- Estado: WAITING_APPROVAL. SHA anterior ao fechamento: `ee6ac3f43ad10523b71f3f2924e71750db6f8490`; o commit de fechamento é o HEAD do branch `wt/backend-lote1` (entregue ao Orquestrador na mensagem de conclusão, `git rev-parse HEAD`).
- BK-6 (relatório §4 alinhado às 12 chaves do passo 9 e às mensagens do passo 1b), BK-7 (`HANDOFF_LOTE1.md` reescrito como snapshot único) e BK-8 (cabeçalho do SQL sem e-mails; "contas descartáveis existentes no QA") corrigidos em texto. Nada marcado VERIFIED antes da Verificação.
- Gate da rodada 3: aguarda parecer da Verificação sobre o commit de fechamento e aprovação de Yan.
- Registro histórico superado: B-1 ainda aparecia como decisão A/B/C. No Lote 2, Yan escolheu a opção A; continuam pendentes R1 (`HYPOTHESIS`) e qualquer execução em banco, migração ou QA.

## Lote 8 — BK4-1 (S3 QL7-2, redirect aberto)
- `getSafeNextPath` (`apps/web/lib/auth/redirect.ts`) agora rejeita caracteres de controle (U+0000–U+001F, U+007F), `\`, equivalentes codificados `%00 %09 %0a %0d %5c` (sem diferenciar maiúsculas), `//` inicial, espaço inicial e qualquer valor que, resolvido contra origem fixa, mude de origem; tudo cai no `fallback`.
- `redirect.test.ts`: 6 testes. Na base falham 3 (controle, variantes codificadas/espaço, fallback informado); no topo 6/6.
- `auth/iniciar`, `auth/callback` e `auth/qa-entrar` só consomem o helper: sem mudança. O `next` do `reauth=delete_account` passa pelo mesmo helper em `iniciar` e `callback`.
- `npm test` 115/115, lint, typecheck e build com saída 0. Estado: WAITING_APPROVAL; nada VERIFIED antes da Verificação (forma por forma). Sem banco, SQL, push ou `.env`.
