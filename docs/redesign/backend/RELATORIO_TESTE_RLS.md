# Relatório — revisão do teste RLS da Fase 9

Lote 1 · 04/11/2026 · script: `docs/qa/fase-9/teste-rls-dois-usuarios.sql` · contra `supabase/migrations/20260818200000_phase_9_settings.sql` e as demais migrações.
Nada foi executado: sem conexão, credencial ou service role. A migração da Fase 9 **não foi aplicada**.

## 0. Escopo real do script (BK-1)

O script roda no SQL Editor como `postgres`, que **ignora RLS e privilégios de tabela**. Prova somente: (a) a lógica de `authorize_sensitive_action` e `delete_own_account`, chaveada por `auth.uid()` simulado (finalidade, sem identidade, sem autorização, confirmação errada, expirada, isolamento A×B); (b) o catálogo da Fase 9 (RLS ligada, ACLs da tabela, `EXECUTE` de `authenticated`, assinatura antiga removida); (c) a cascata de exclusão com dados semeados (R1). **Não prova** nenhuma política RLS das Fases 3–8 (`*_select_own`, `*_update_own`…), nem acesso às tabelas como `authenticated` ou `anon`. Passar não significa "RLS aprovada"; nenhum documento deste lote afirma isso.

## 1. Checado por leitura (VERIFIED no texto das migrações)

- `sensitive_action_authorizations`: PK `(user_id, purpose)`, `purpose in ('delete_account')`, RLS ligada, zero políticas, `REVOKE ALL` de `public/anon/authenticated`.
- `authorize_sensitive_action(text)`: `security definer`, `search_path` fixo, `42501` sem `auth.uid()`, `22023` para finalidade diferente de `delete_account`, upsert com validade de 5 minutos.
- `delete_own_account(text)`: remove a assinatura antiga `delete_own_account()`; `42501` sem identidade; `22023` se a confirmação ≠ `EXCLUIR` (**checada antes** de consumir a autorização, logo uma confirmação errada não gasta a autorização); consome a linha com `expires_at > now()` (`42501` se não houver); `delete from auth.users`; `P0002` se a conta não existe.
- `EXECUTE` revogado de `public` e concedido só a `authenticated`.
- O `app/auth/callback/route.ts` só chama `authorize_sensitive_action` com nonce válido; `lib/settings/actions.ts` traduz `42501` em "confirmação Microsoft expirou".

## 2. Defeitos encontrados no script original e corrigidos

| # | Defeito | Efeito | Correção |
|---|---|---|---|
| D1 | Cada passo negativo fazia `raise exception 'FALHOU…'` **dentro** do bloco com `exception when others`. O handler capturava o próprio `FALHOU` e imprimia "OK (esperado)". | O teste **nunca reprovava**: um bug que deixasse a exclusão passar seria relatado como sucesso. | Helper `pg_temp.espera_erro(sqlstate, sql, rótulo)`: a falha fica fora do bloco protegido e o SQLSTATE é conferido (`22023`/`42501`), não só "algum erro". |
| D2 | O passo 6 ("isolamento") comparava `auth.uid()` com os UUIDs: testava o próprio `set_config` do script, não o banco. | Nenhuma prova de isolamento entre usuários. | Passo 5: A se autoriza; B tenta excluir com confirmação correta e deve receber `42501`; confere que a autorização de A segue (1), a de B não existe (0) e a conta de B segue intacta. |
| D3 | O passo 7 contava só `auth.users`, `profiles`, `daily_logs`. A cascata nunca era exercitada com dados dependentes. | Não detectaria o risco **R1** (FKs `on delete restrict` das Fases 4–8; ver `MATRIZ_TELA_DADOS.md`). | Passo 8 semeia, como `postgres` e dentro da transação, `daily_logs → evidences → live_session_evidences/live_questions/artifact_sources` e `narrative_diagnostics → narrative_score_snapshots`. A exclusão roda num bloco que **não aborta**: imprime `OK:` ou `ACHADO BLOQUEANTE [sqlstate] mensagem`. O passo 9 conta o que sobrou em 7 tabelas e confirma que B ficou. |
| D4 | O passo 3 usava só B; não havia caso sem identidade; o comentário prometia "seis OK" mas só imprimia quatro. | Cobertura menor que a declarada. | Passo 3 cobre `auth.uid()` nulo (`claims='{}'`); contagem do rodapé corrigida (seis). |
| D5 | Os objetos eram checados só por existência; privilégios eram "garantidos pela definição". | Se a migração fosse aplicada parcialmente (ex.: `REVOKE` perdido), o teste passaria. | Passo 1 lê o catálogo: RLS ligada, tabela fechada para `anon`/`authenticated` (SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES e TRIGGER, mais MAINTAIN no PostgreSQL ≥ 17, comprovando o `REVOKE ALL`; ver §6), `EXECUTE` só para `authenticated`, assinatura antiga removida. |
| D6 | Sem proteção contra UUIDs de exemplo não substituídos. | Falha confusa no meio da transação. | Passo 0 exige dois usuários distintos e existentes em `auth.users`. |

Mantido: tudo em **uma** transação terminada em `rollback` (inclusive o seed e a exclusão). Nenhuma outra política, função ou migração foi alterada.

## 3. Só um banco real prova (gate de Yan)

1. Que a migração da Fase 9 aplica sem erro sobre o estado real do projeto.
2. O resultado do passo 8 (**R1**): se o PostgreSQL executa a cascata de `auth.users` sem violar as FKs `restrict`. Se imprimir `ACHADO BLOQUEANTE`, a exclusão de conta não funciona para quem tem evidências, sessões Live, Artefatos ou diagnóstico — correção exige migração nova (gate).
3. Que `auth.uid()` lê `request.jwt.claims` na versão do Supabase do projeto (padrão em versões atuais; o script usa `set_config('request.jwt.claims', …, true)`).
4. Que `set_config` local sobrevive às chamadas de função na transação do SQL Editor (esperado, mas não observado).
5. Comportamento real do `delete_own_account` quando outros esquemas do Supabase (Storage, identidades) têm FKs para `auth.users` — o app não usa Storage nesta versão.

## 4. Como rodar (quando Yan liberar)

Ordem (cada passo é gate de Yan): (1) aplicar `20260818200000_phase_9_settings.sql` no projeto de QA; (2) aplicar `20261108120000_b1_revoke_anon_execute.sql` (B-1, opção A, decidida); (3) rodar `docs/qa/fase-9/verificacao-b1-anon-execute.sql` (somente leitura); (4) rodar o teste. Sem a B-1 o teste para no passo 1b com `FALHOU B-1` e não chega ao passo 8 (R1). No teste, substituir os dois UUIDs (duas contas descartáveis de QA, nunca conta pessoal ou principal), executar o arquivo inteiro e colar os `NOTICE` (seis `OK (esperado)` dos passos 2–7; quatro `OK (conferido)` dos passos 1, 5, 6 e 9; duas linhas do passo 1b, cada uma `OK (conferido) B-1: anon sem EXECUTE em …`; e o resultado do passo 8) em `docs/reviews/fase-9-configuracoes-privacidade.md`. Os passos 1, 5, 6 e 9 se autoverificam (`pg_temp.confere`); o passo 1b (`anon`/B-1) também reprova, com `FALHOU B-1: anon tem EXECUTE em …`: divergência de qualquer booleano ou contagem aborta com `FALHOU … obtido … esperado …`; quando passam, imprimem `OK (conferido)`. Esperado: passo 1 = 9 chaves `true` (`tabela_existe`, `authorize_existe`, `delete_existe`, `assinatura_antiga_removida`, `rls_ligada`, `tabela_fechada_authenticated`, `tabela_fechada_anon`, `delete_exec_authenticated`, `authorize_exec_authenticated`); passo 5 = `1, 0, 1`; passo 6 = `1`; passo 9 = 12 chaves, as 11 primeiras `0` (`auth_users`, `profiles`, `daily_logs`, `evidences`, `live_evidences`, `artifact_sources`, `snapshots`, `live_sessions`, `live_questions`, `artifacts`, `diagnostics`, sufixo `_restante`) e `conta_b_intacta = 1`. O passo 8 segue sem abortar; se a exclusão falhar, o passo 9 reprova.

## 4b. Achados da Verificação (rodada 3) e tratamento

| Achado | Tratamento |
|---|---|
| BK-1 | Escopo real explícito no cabeçalho do script e em §0; teste futuro descrito em §7 (sem script novo). |
| BK-2 | O passo 8 imprime `ACHADO BLOQUEANTE (sinal de R1)` para `23001` **e** `23503`, sem afirmar qual vem; outro SQLSTATE sai como "fora de R1; investigar ambiente". Conferir sempre se a mensagem nomeia uma FK `restrict` das fases 4–8. |
| BK-3 | Corrigido na matriz: não há `ilike`; filtros em memória (até 100 registros). |
| BK-4 | `profiles` passa a ser semeado (`on conflict do nothing`), então `profiles_restante = 0` deixa de passar trivialmente; o passo 9 agora conta também `live_sessions`, `live_questions`, `artifacts` e `narrative_diagnostics` (11 contagens zero + conta B = 1). Mantido por justificativa: as contagens do passo 5 são lidas como `postgres` (provam a lógica da função, não RLS); o passo 8 classifica o SQLSTATE em vez de tratar todo erro como R1. |
| BK-5 | A checagem de `anon` com `EXECUTE` saiu do passo 1 (que aborta) e virou o passo 1b, então não abortante. **Superado no Lote 2:** Yan decidiu a opção A; o passo 1b agora **reprova** (`FALHOU B-1`) e a migração `20261108120000_b1_revoke_anon_execute.sql` (não aplicada) faz o revoke. Ver `ROLLBACK_B1.md`. |

## 5. Validação desta revisão

- `git diff --check`: limpo.
- Revisão do SQL por leitura: blocos `do $$`/`$q$` balanceados, todos os nomes de tabela e coluna do seed conferidos com as migrações (colunas obrigatórias e `check`s de tamanho), `begin` … `rollback` presente.
- **Não executado** (sem Postgres local no lote e sem banco liberado): erros de sintaxe que só o parser acusa não estão descartados.

## 6. Compatibilidade PostgreSQL 15 / 16 / 17

`has_table_privilege` rejeita nomes de privilégio desconhecidos. O PostgreSQL 15 e o 16 aceitam `SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER`; o 17 acrescenta `MAINTAIN`, que também faz parte de `REVOKE ALL`. O passo 1 monta a lista em tempo de execução: os sete privilégios sempre, e `,maintain` só quando `current_setting('server_version_num')::int >= 170000`. Em 15/16 `MAINTAIN` nunca é passado (evita erro de privilégio desconhecido); em 17 é conferido para `anon` e `authenticated`. As chaves do JSON esperado não mudam. A versão do servidor do projeto de QA não foi consultada.

## 7. Teste futuro com papel `authenticated` (descrição; NÃO implementado)

Para provar as políticas RLS das Fases 3–8 seria preciso um teste separado, também em transação com `rollback`, que: (1) semeia dados de A e de B como `postgres`; (2) faz `set local role authenticated` e `set_config('request.jwt.claims', …sub = A…)`; (3) tenta `select`/`update`/`delete` em `profiles`, `daily_logs`, `evidences`, `evidence_suggestions`, `evidence_sources`, `narrative_*`, `live_*`, `artifacts*` sobre linhas de B e espera zero linhas visíveis ou erro de política; (4) confirma que `insert` com `user_id = B` é rejeitado pelo `with check`; (5) tenta ler `sensitive_action_authorizations` e espera `42501`; (6) repete com `set local role anon` esperando zero acesso; (7) `reset role`. Exige decisão de Yan e fica fora do Lote 1.
