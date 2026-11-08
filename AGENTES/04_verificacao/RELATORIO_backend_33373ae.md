# Relatório de Verificação — Backend — Lote 2, Rodada 2

- SHA revisado: `33373ae2f0d909da0dfad67584ed0ab8db654ec1` (`wt/backend-lote2`; filho direto de `4b4650d34f3a748078dcb5b7c6c351eade7ad7eb`).
- Verificador: Persona — Verificação Independente. Data: 08/11/2026. Diff: `git diff 4b4650d 33373ae` (5 arquivos, +47/−18).
- `RELATORIO_backend_4b4650d.md` vira histórico e **não aprova** este SHA.
- Regras: verificação **por leitura**. Nenhum SQL, banco, migração, chave, `.env`, push, merge ou correção. Nada nos worktrees dos escritores.

## 1. Resumo e gate sugerido

**Gate sugerido: liberar para integração local.** BK2-1, BK2-2 e BK2-3 estão resolvidos nos caminhos pedidos. Restam apenas observações S4 e a incerteza de banco, que continua `HYPOTHESIS`. **Não aprova** aplicar a migração, o estado real de `anon`, R1, RLS das Fases 3–8, Preview ou Production; a aplicação segue gate de Yan e a sintaxe do SQL segue `PENDING` (nunca foi executada). Nenhum S1, S2 ou S3 aberto.

## 2. Checagens

| # | Checagem pedida | Resultado | Evidência |
|---|---|---|---|
| 1 | Migração sem `begin`/`commit`, ainda abortando via `DO` | **OK (leitura)** | `git show 33373ae:<migração> \| grep -c -i -E '^\s*(begin\|commit);'` → **0**. O único `begin` do arquivo é o do bloco `DO $$ … $$` (plpgsql). O diff da migração é só: −`begin;`, −`commit;`, +4 linhas de comentário. O bloco final é idêntico: para cada uma das duas funções, `raise exception 'B-1 FALHOU: anon ainda tem EXECUTE em %'` se `has_function_privilege('anon', f, 'execute')`, e `'B-1 FALHOU: authenticated perdeu EXECUTE …'` se `authenticated` perdeu. Os dois `revoke … from anon` ficam antes do bloco |
| 2 | Nenhum texto operacional contradiz a opção A | **OK**, com ressalvas S4 abaixo | Ver seção 3 |
| 3 | `ROLLBACK_B1.md` descreve CLI × SQL Editor | **OK na coerência interna; o comportamento do método é `HYPOTHESIS`** | Ver BK3-1 |
| 4 | `STATUS.md` só do Lote 2 | **OK com ressalva S4** | Abre com o Lote 2 (tabela de entregas, "Estado: WAITING_APPROVAL", SHA anterior `4b4650d`, "SHA novo informado no handoff"). O Lote 1 vem **depois** de `# Histórico — Lote 1 (superado, não canônico)`. A mistura de BK2-3 saiu do topo. Ver BK3-2 |
| 5a | Escopo | **OK** | 5 arquivos: `AGENTES/02_backend/STATUS.md`, `docs/redesign/backend/{HANDOFF_LOTE1,RELATORIO_TESTE_RLS,ROLLBACK_B1}.md`, a migração. Todos na linha do Backend + `docs/redesign/backend/**` autorizado pela Rodada 2. Nenhum `apps/**`, `package*.json`, lockfile, `.env`, `docs/qa/**` |
| 5b | `git diff --check` | **OK** | exit 0 |
| 5c | Segredos | **OK** | nenhuma linha adicionada com `nvapi`, `sk-`, `eyJ`, `service_role`, `password`, `secret`, `postgres://` |
| 5d | Commit | **OK** | pai = `4b4650d`; autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` |

## 3. Detalhe do item 2 (textos operacionais)

Varredura com `git grep` em `33373ae` sobre `docs/redesign/backend`, `docs/qa/fase-9`, `AGENTES/02_backend`, a migração e, no checkout principal (`7108259`), `LOTE-1_BACKEND_DECISOES.md`:

| Arquivo | Estado | Observação |
|---|---|---|
| `docs/redesign/backend/RELATORIO_TESTE_RLS.md` §4 | **corrigido** | agora dá a ordem Fase 9 → B-1 → `verificacao-b1-anon-execute.sql` → teste; diz que sem B-1 o teste para no passo 1b com `FALHOU B-1` e não chega ao passo 8; as duas linhas do passo 1b esperadas são `OK (conferido) B-1`; "ACHADO B-1 não reprova" foi removido |
| `docs/redesign/backend/RELATORIO_TESTE_RLS.md` §4b BK-5 | **corrigido** | "Superado no Lote 2 … o passo 1b agora reprova" |
| `docs/qa/fase-9/teste-rls-dois-usuarios.sql` (cabeçalho e passo 1b) | **já coerente** | sem mudança neste commit; diz que aborta com `FALHOU B-1` |
| `docs/qa/fase-9/verificacao-b1-anon-execute.sql` | sem mudança | a linha 7 cita "ACHADO B-1" como nome do achado, não como comportamento do teste |
| `docs/redesign/backend/HANDOFF_LOTE1.md` | **histórico com aviso (novo)** | faixa no topo: "HISTÓRICO — não canônico, superado … onde diz que B-1 está pendente ou que o passo 1b não aborta, vale o Lote 2" |
| `AGENTES/02_backend/HANDOFF_LOTE1.md` | **histórico com aviso (pré-existente)** | as linhas 50 e 78 ("B-1 aborta o passo 1…") ficam sob a faixa "HISTÓRICO — NÃO CANÔNICO — SUPERADO" |
| `AGENTES/02_backend/STATUS.md` (parte Lote 1) | **histórico com aviso**, com a ressalva BK3-2 | BK-5 e "B-1 pendente" têm colchete "[superado no Lote 2 …]" |
| `AGENTES/ATRIBUICOES/LOTE-1_BACKEND_DECISOES.md` | **histórico com aviso (Orquestrador)** | faixa de atualização no topo, ordem nova do QA (Fase 9 → B-1 → verificação → teste) e "sem B-1 o teste para no passo 1b" |
| `AGENTES/ATRIBUICOES/LOTE-1_CORRECOES.md` L23 | **fora dos caminhos pedidos**; instrução histórica de BK-5 | registrado só por completude, ver BK3-2 |

Reprodução: `git grep -n -i -E 'não abort|ACHADO B-1|não abortante|B-1 .*pendente' 33373ae -- docs AGENTES/02_backend`.

## 4. Achados desta rodada

| ID | Sev. | Status | Achado |
|---|---|---|---|
| BK2-1 | (era S3) | **resolvido** (leitura) | `begin`/`commit` removidos; o `DO` abortante permanece. Falta o efeito no banco real: `HYPOTHESIS`. |
| BK2-2 | (era S3) | **resolvido** | roteiros operacionais alinhados; o resto é histórico com aviso (seção 3). |
| BK2-3 | (era S3) | **resolvido** | `STATUS.md` abre só com o Lote 2. O SHA literal não pode estar dentro do próprio commit; o handoff e o congelamento do Orquestrador o registram. |
| BK2-4 | S4 | inalterado | B-1 antes de R1; agora documentado na ordem do QA. |
| **BK3-1** | S4 | `HYPOTHESIS` | `ROLLBACK_B1.md` afirma como fato dois comportamentos de método: (a) o CLI envolve o arquivo numa transação e desfaz os `revoke` se o `DO` falhar; (b) no SQL Editor "cada `revoke` vale sozinho" e, se o `DO` falhar, os `revoke` **ficam aplicados**. O `STATUS.md` do Backend já marca isso como `HYPOTHESIS`, mas o `ROLLBACK_B1.md` não. Em Postgres, uma cadeia de comandos enviada numa única mensagem de consulta simples roda numa transação implícita; se o SQL Editor enviar o script assim, (b) é falso e tudo é desfeito. Não verifiquei nem o CLI nem o Editor. **Segurança:** o estado parcial documentado é sempre "`anon` com menos privilégio", e a migração é idempotente; a orientação "corrija a causa e rode de novo" vale nos dois casos. **Recomendação:** marcar (a) e (b) como `HYPOTHESIS` em `ROLLBACK_B1.md` e mandar rodar `verificacao-b1-anon-execute.sql` depois de qualquer falha, qualquer que seja o método. Efeito: documentação. |
| **BK3-2** | S4 | VERIFIED | Restos de redação: (i) `STATUS.md`, parte histórica do Lote 1, última linha ("Continuam pendentes: B-1 (decisão A/B/C de Yan, não escolhida) …") sem colchete de "superado" (está sob a faixa de histórico); (ii) cabeçalho da migração (linhas 3–4) ainda diz "a transação aborta" e o banner de `LOTE-1_BACKEND_DECISOES.md` cita "Backend `4b4650d`" em vez do SHA novo; (iii) `LOTE-1_CORRECOES.md` L23 (instrução histórica). Nenhum muda o que o QA faria. |

Nenhuma severidade foi reduzida sem evidência. BK2-1 a BK2-3 saem de S3 por evidência de leitura do diff e da varredura.

## 5. Execução

Não reexecutei `npm`: `git diff --quiet 4b4650d 33373ae -- apps package.json package-lock.json` é verdadeiro (a árvore executável é idêntica à de `4b4650d`), então typegen/`npm test` 32/32/lint/typecheck/build com exit 0 do relatório anterior valem por identidade de entrada. Isso é inferência, não nova execução. Nenhum SQL foi executado.

## 6. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED (leitura) | migração sem `begin`/`commit` e com o `DO` abortante; textos operacionais alinhados; STATUS do Lote 2; escopo, `diff --check`, segredos, coautoria |
| HYPOTHESIS | `anon` ter `EXECUTE` hoje no banco real; comportamento do CLI e do SQL Editor (BK3-1); `has_function_privilege`/`aclexplode` como lido; R1 |
| PENDING | sintaxe e execução do SQL; aplicar B-1 em QA (gate de Yan); `alter default privileges`; RLS das Fases 3–8; Preview/Production |

## 7. Decisões pendentes

Orquestrador: aceitar BK3-1/BK3-2 como S4 (próxima passagem do Backend) ou pedir ajuste curto. Yan: método de aplicação e aplicar B-1 em QA isolado, `alter default privileges`.
