# Relatório — revisão do teste RLS da Fase 9

Lote 1 · 04/11/2026 · script: `docs/qa/fase-9/teste-rls-dois-usuarios.sql` · contra `supabase/migrations/20260818200000_phase_9_settings.sql` e as demais migrações.
Nada foi executado: sem conexão, credencial ou service role. A migração da Fase 9 **não foi aplicada**.

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
| D5 | Os objetos eram checados só por existência; privilégios eram "garantidos pela definição". | Se a migração fosse aplicada parcialmente (ex.: `REVOKE` perdido), o teste passaria. | Passo 1 lê o catálogo: RLS ligada, tabela fechada para `anon`/`authenticated`, `EXECUTE` só para `authenticated`, assinatura antiga removida. |
| D6 | Sem proteção contra UUIDs de exemplo não substituídos. | Falha confusa no meio da transação. | Passo 0 exige dois usuários distintos e existentes em `auth.users`. |

Mantido: tudo em **uma** transação terminada em `rollback` (inclusive o seed e a exclusão). Nenhuma outra política, função ou migração foi alterada.

## 3. Só um banco real prova (gate de Yan)

1. Que a migração da Fase 9 aplica sem erro sobre o estado real do projeto.
2. O resultado do passo 8 (**R1**): se o PostgreSQL executa a cascata de `auth.users` sem violar as FKs `restrict`. Se imprimir `ACHADO BLOQUEANTE`, a exclusão de conta não funciona para quem tem evidências, sessões Live, Artefatos ou diagnóstico — correção exige migração nova (gate).
3. Que `auth.uid()` lê `request.jwt.claims` na versão do Supabase do projeto (padrão em versões atuais; o script usa `set_config('request.jwt.claims', …, true)`).
4. Que `set_config` local sobrevive às chamadas de função na transação do SQL Editor (esperado, mas não observado).
5. Comportamento real do `delete_own_account` quando outros esquemas do Supabase (Storage, identidades) têm FKs para `auth.users` — o app não usa Storage nesta versão.

## 4. Como rodar (quando Yan liberar)

Aplicar a migração `20260818200000_phase_9_settings.sql` no projeto de QA, substituir os dois UUIDs, executar o arquivo inteiro e colar os `NOTICE` (seis `OK (esperado)`, quatro `OK (conferido)` e o resultado do passo 8) em `docs/reviews/fase-9-configuracoes-privacidade.md`. Os passos 1, 5, 6 e 9 se autoverificam (`pg_temp.confere`): divergência de qualquer booleano ou contagem aborta com `FALHOU … obtido … esperado …`; quando passam, imprimem `OK (conferido)`. Esperado: passo 1 todo `true`; passo 5 = `1, 0, 1`; passo 6 = `1`; passo 9 = `0,0,0,0,0,0,0,1`. O passo 8 segue sem abortar; se a exclusão falhar, o passo 9 reprova.

## 5. Validação desta revisão

- `git diff --check`: limpo.
- Revisão do SQL por leitura: blocos `do $$`/`$q$` balanceados, todos os nomes de tabela e coluna do seed conferidos com as migrações (colunas obrigatórias e `check`s de tamanho), `begin` … `rollback` presente.
- **Não executado** (sem Postgres local no lote e sem banco liberado): erros de sintaxe que só o parser acusa não estão descartados.
