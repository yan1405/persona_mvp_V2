# Backend — propostas para decisão de Yan (nada aplicado, nenhum SQL executado)

Base: Backend `4a37131865586be802f25511ce8f6969ad09109e`, migração `20260818200000_phase_9_settings.sql` (não aplicada). Preparado pelo Orquestrador em 05/11/2026 a partir do código e do relatório do Backend; é proposta, não aprovação.

## 1. Proposta de decisão B-1 — `EXECUTE` para `anon`

**Fato lido no código.** A migração revoga `EXECUTE` só de `public` (`revoke all on function … from public`) e concede a `authenticated`. Ela **não** revoga de `anon` nominalmente. No Supabase, funções novas no esquema `public` costumam receber `EXECUTE` para `anon`, `authenticated` e `service_role` por privilégios padrão do esquema; se isso vale neste projeto, `anon` herda `EXECUTE` apesar do revoke de `public`. **Não verificado no banco real.**

**Impacto.** Baixo, não zero: as duas funções são `security definer` e começam com `auth.uid() is null → raise … 42501`, então um chamador anônimo é barrado. O problema é de menor privilégio: a superfície exposta pela API REST (`/rpc/…`) não deveria incluir uma função de exclusão de conta para `anon`.

**Opções.**

| Opção | O que faz | Custo |
|---|---|---|
| A (recomendada) | Nova migração corretiva com `revoke all on function public.authorize_sensitive_action(text) from anon;` e idem para `delete_own_account(text)`, e o teste passa a checar `has_function_privilege('anon', …, 'execute') = false` | uma migração pequena, gate de migração |
| B | Aceitar o risco porque `auth.uid()` barra `anon` | zero código; deixa o privilégio excessivo documentado |
| C | Editar a migração da Fase 9 antes de aplicá-la | só serve se ela ainda não foi aplicada no banco real; hoje é o caso, mas altera arquivo já versionado |

**Pedido de decisão:** A, B ou C. Antes de decidir, o QA do item 2 mostra o estado real (consulta ao catálogo, sem alterar nada).

## 2. Plano de QA com duas contas descartáveis

Pré-condições (todas gate de Yan): projeto Supabase de QA ou o real com autorização explícita; duas contas Microsoft **descartáveis** criadas só para isto (nunca conta pessoal ou principal); nenhuma credencial é dada ao Orquestrador nem ao Backend; quem executa é Yan, no SQL Editor.

1. **Antes** de aplicar a migração: rodar a consulta de catálogo abaixo (somente leitura) para registrar o estado de `anon` nas funções existentes, se já houver, e a lista de privilégios padrão do esquema `public`.
2. Aplicar `20260818200000_phase_9_settings.sql` (gate). Registrar a saída.
3. Repetir a consulta de catálogo: `has_function_privilege('anon', 'public.authorize_sensitive_action(text)', 'execute')` e `…delete_own_account(text)`; para `authenticated` o esperado é `true`.
4. Criar as duas contas descartáveis e anotar os dois UUIDs de `auth.users`.
5. Colar os UUIDs no `docs/qa/fase-9/teste-rls-dois-usuarios.sql` e executar o arquivo **inteiro** numa única execução. Ele semeia dados, simula a exclusão e termina em `rollback`.
6. Colar os `NOTICE` (esperados: seis `OK (esperado)`, quatro `OK (conferido)` e o resultado do passo 8) em `docs/reviews/fase-9-configuracoes-privacidade.md`.
7. Conferir que **nada persistiu**: contagem de linhas das contas de teste igual à de antes, e `auth.users` intacto.
8. Apagar as contas descartáveis ao fim.

## 3. Como R1 será confirmado pelo SQLSTATE real

R1 (HYPOTHESIS, severidade alta): `delete_own_account` pode falhar para quem tem evidências, sessões Live, Artefatos ou diagnóstico, porque cinco chaves estrangeiras `on delete restrict` (conferidas por `grep` nas migrações) podem barrar a cascata que parte de `auth.users`: `evidences.source_log_id → daily_logs` (fase 4), `narrative_score_snapshots.diagnostic_id → narrative_diagnostics` (fase 6), `live_session_evidences.evidence_id` e `live_questions.primary_evidence_id → evidences` (fase 7) e `artifact_sources.evidence_id → evidences` (fase 8). Se a ordem interna de exclusão do PostgreSQL as satisfaz ou não é o que só o banco real responde.

O passo 8 do script semeia dados dependentes para a conta de teste e chama a exclusão dentro de um bloco com `exception`. Ele **imprime o `SQLSTATE` e a mensagem reais**; não aborta.

| Saída do passo 8 | Leitura |
|---|---|
| `OK:` (exclusão concluída com dados dependentes) | R1 **refutada**: a ordem da cascata não é violada |
| `ACHADO BLOQUEANTE … [23503] …` (`foreign_key_violation`) **ou** `[23001]` (`restrict_violation`), com a restrição citada | R1 **confirmada**; a mensagem nomeia a tabela e a restrição que bloqueou. Os dois códigos são aceitos porque a `MATRIZ_TELA_DADOS.md` e a Verificação dizem `23001` para `ON DELETE RESTRICT`, enquanto minha leitura anterior dizia `23503`; só o banco real decide qual vem |
| `ACHADO BLOQUEANTE … [outro SQLSTATE]` (ex.: `42501` permissão, `42883` função inexistente) | **não** é R1: é falha de ambiente ou de privilégio; registrar e repetir após corrigir a causa |

Só `23503` ou `23001` com a restrição `on delete restrict` de uma tabela das fases 4–8 confirma R1 (corrigido em 05/11/2026 após o achado BK-2 da Verificação). Se confirmada, a correção é uma migração nova (excluir em ordem ou tornar as FKs adiáveis/`cascade`), com decisão de Yan sobre o que o produto deve fazer com evidências ao excluir a conta.

## 4. Rollback e evidências esperadas

**Rollback.** O script roda em `begin … rollback`: seed e exclusão simulada são desfeitos. A migração da Fase 9, **se aplicada**, é aditiva (uma tabela e duas funções); desfazê-la exige SQL de reversão próprio (`drop function` ×2 e `drop table public.sensitive_action_authorizations`), que só deve existir com decisão de Yan. Sem migração aplicada, não há o que reverter. Contas descartáveis são removidas ao fim (item 2.8).

**Evidências esperadas (anexar em `docs/reviews/fase-9-configuracoes-privacidade.md`).**

1. Saída da consulta de catálogo antes e depois da migração (privilégios de `anon` e `authenticated`).
2. Todos os `NOTICE` do script, sem alterar o texto.
3. O resultado literal do passo 8 com o `SQLSTATE`.
4. Contagens antes/depois provando que o `rollback` não deixou resíduo.
5. Data, projeto (QA ou real), quem executou e a versão do PostgreSQL (o teste cobre 15/16/17).

**Limites desta proposta.** Nenhuma parte foi executada. O comportamento de `auth.uid()` no SQL Editor, a persistência de `set_config` local e FKs de outros esquemas para `auth.users` são verificados somente no banco real (itens 3–5 do relatório do Backend).
