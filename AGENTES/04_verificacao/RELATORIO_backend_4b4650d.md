# Relatório de Verificação — Backend — Lote 2

- SHA revisado: `4b4650d34f3a748078dcb5b7c6c351eade7ad7eb` (`wt/backend-lote2`, 1 commit sobre `acc1f4443939cdaf1d57d13b67fe8f929adf1e97`).
- Verificador: Persona — Verificação Independente (não corrigi nada; não revisei trabalho meu).
- Data: 08/11/2026. Base do diff: `git diff acc1f44..4b4650d`.
- Este relatório vale só para este SHA. Relatórios do Lote 1 (`7aeb658` etc.) são histórico e não aprovam este SHA.

## 1. Resumo e gate sugerido

**Gate sugerido: liberar com ressalvas** (arquivos SQL e documentação, para integração local). **Não aprova**: aplicar a migração, o estado real de `anon` no Supabase, R1, RLS das Fases 3–8, Preview ou Production. Nenhum S1, nenhum S2. Quatro achados S3/S4 (BK2-1 a BK2-4). A migração nunca foi executada por ninguém; tudo que depende do banco real continua `HYPOTHESIS`.

## 2. Checagens C1–C6

| # | Checagem | Resultado | Evidência |
|---|---|---|---|
| C1 | Escopo (só os caminhos da linha 02 de `LOTE-2.md`) | **OK** | 5 arquivos: `supabase/migrations/20261108120000_b1_revoke_anon_execute.sql` (novo), `docs/redesign/backend/ROLLBACK_B1.md` (novo), `docs/qa/fase-9/teste-rls-dois-usuarios.sql` e `verificacao-b1-anon-execute.sql` (`docs/qa/fase-9/**`), `AGENTES/02_backend/STATUS.md`. `git diff --name-only acc1f44..4b4650d` |
| C2 | Arquivos proibidos | **OK** | Nenhum `apps/**`, `package*.json`, lockfile, outra migração, `AGENTES/` de outro papel, `.env`. A migração da Fase 9 (`20260818200000`) não foi tocada |
| C3 | `git diff --check` | **OK** | exit 0, sem saída |
| C4 | Segredos nas linhas adicionadas | **OK** | varredura (`sk-`, `nvapi-`, `gsk_`, JWT `eyJ…`, `secret`, `password`, `api_key`, chave privada, `postgres://`) sem ocorrências; nenhum e-mail nem UUID de conta |
| C5 | Commit e coautoria | **OK** | 1 commit, pai = `acc1f44`; autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`; mensagem diz "migração não aplicada" |
| C6 | `STATUS.md` do papel | **OK com ressalva (BK2-3)** | `Estado: WAITING_APPROVAL`; seção "Lote 2 — B-1 opção A" declara o que é `HYPOTHESIS` e o que é leitura; nada marcado `VERIFIED` |

## 3. Revisão por leitura (o SQL não foi executado)

Fonte comparada: `git show acc1f44:supabase/migrations/20260818200000_phase_9_settings.sql` e a opção A de `AGENTES/ATRIBUICOES/LOTE-1_BACKEND_DECISOES.md` §1.

| Ponto | Resultado | Status |
|---|---|---|
| Assinaturas | `authorize_sensitive_action(text)` e `delete_own_account(text)` são exatamente as da Fase 9 (linhas 13, 49; `revoke`/`grant` nas 87–90). A assinatura antiga `delete_own_account()` é removida na Fase 9 (`drop function if exists`, linha 47), então não há sobrecarga a mais | VERIFIED (leitura) |
| Conteúdo | só `revoke execute … from anon` nas duas funções; não toca `authenticated`, `service_role`, `public`, tabelas nem `alter default privileges`. Corresponde à opção A | VERIFIED (leitura) |
| Ordem das timestamps | `20261108120000` > `20260818200000`, e é a última da pasta (7 migrações anteriores listadas em `acc1f44`) | VERIFIED |
| Bloco final | `has_function_privilege('anon', f, 'execute')` verdadeiro → `raise exception`; `authenticated` sem `EXECUTE` → `raise exception`. Usa privilégio **efetivo** (direto, herdado ou via `PUBLIC`), então também reprova se alguém reconceder a `PUBLIC` | VERIFIED (leitura); comportamento no PostgreSQL: HYPOTHESIS |
| Transação | `begin … commit`; erro no bloco aborta e desfaz os `revoke` | VERIFIED (leitura); ver BK2-1 |
| Idempotência | `REVOKE` repetido não falha; o bloco final repete a mesma checagem | VERIFIED (leitura) |
| Dependência | se as funções não existem (Fase 9 não aplicada), o `REVOKE` falha com erro e a transação aborta; o cabeçalho e o `ROLLBACK_B1.md` dizem isso | VERIFIED (leitura) |
| Rollback | `grant execute … to anon` nas duas funções, como `postgres`, em transação; texto explica quando não desfazer e que "passar" o passo 1b não é motivo | VERIFIED (leitura) |
| Chamadores | só dois: `app/auth/callback/route.ts:47` (`authorize_sensitive_action`, depois de `exchangeCodeForSession`) e `lib/settings/actions.ts:87` (`delete_own_account`, depois de `getClaims`). Ambos usam o cliente com sessão (`authenticated`). A afirmação "o app só chama as duas funções com sessão" procede | VERIFIED (leitura de `acc1f44`) |
| `verificacao-b1-anon-execute.sql` | só `SELECT`; consulta 1 usa `has_function_privilege` e `aclexplode(coalesce(proacl, acldefault('f', proowner)))` (PUBLIC = `grantee 0`; `proacl` nulo conta como PUBLIC corretamente); consulta 2 conta 2; consulta 3 lista `pg_default_acl` | VERIFIED (leitura); sintaxe e resultado: PENDING |
| Passo 1b de `teste-rls-dois-usuarios.sql` | agora `raise exception 'FALHOU B-1: …'` se `anon` tiver `EXECUTE`; segue dentro de `begin` (linha 52) … `rollback` (linha 262); cabeçalho e rodapé atualizados (dois `OK (conferido) B-1`) | VERIFIED (leitura); reprova de fato num banco sem a B-1: HYPOTHESIS |

`HYPOTHESIS` (só o banco real prova): `anon` tem `EXECUTE` por privilégio padrão do Supabase (premissa de B-1); `has_function_privilege`/`aclexplode`/`acldefault` se comportam como lido; a sintaxe do SQL passa; `begin`/`commit` é aceito pelo método de aplicação; o `401/403 + 42501` anônimo descrito no rollback.

## 4. Achados

| ID | Sev. | Status | Achado |
|---|---|---|---|
| BK2-1 | S3 | HYPOTHESIS | **`begin;`/`commit;` dentro de arquivo de migração destoa do padrão do repositório.** Nenhuma das 7 migrações anteriores tem `begin`/`commit` (contagem 0 em todas: `git show acc1f44:<arq> \| grep -ci -E '^\s*(begin\|commit);'`). Se a migração for aplicada por `supabase db push`/CLI (que já envolve o arquivo), o `begin` interno gera aviso e o `commit` encerra a transação do CLI antes do registro da migração; no SQL Editor funciona. O efeito de segurança não muda (o bloco `DO` ainda aborta), mas o comportamento depende do método de aplicação e o escritor já o declara `HYPOTHESIS`. **Recomendação:** o Orquestrador/Yan escolhe o método de aplicação; se for o CLI, remover `begin`/`commit` (a transação já existe); se for o SQL Editor, manter. **Reprodução mínima:** a contagem acima; aplicar em QA descartável com o método escolhido e conferir `supabase_migrations.schema_migrations`. |
| BK2-2 | S3 | VERIFIED | **Documentos de outros caminhos ainda descrevem o passo 1b como não abortante e B-1 como pendente.** O escritor listou `RELATORIO_TESTE_RLS.md` (linhas 41 e 51) e `LOTE-1_BACKEND_DECISOES.md` §1, mas há mais: `docs/redesign/backend/HANDOFF_LOTE1.md` (linhas 44 e 50), `AGENTES/02_backend/HANDOFF_LOTE1.md` (linhas 50, 53 e 60) e as linhas 61–69 do próprio `STATUS.md` (rodada 3). Pior: o roteiro de QA de `LOTE-1_BACKEND_DECISOES.md` §2 (passos 2–5) e a seção "Como rodar" de `RELATORIO_TESTE_RLS.md` mandam aplicar só a Fase 9 e rodar o teste; quem seguir esse roteiro vai levar `FALHOU B-1` no passo 1b e **não chega ao passo 8 (R1)**. Falha fechada (seguro), mas o roteiro engana. Esses arquivos estão fora da linha do Backend; o Backend corretamente não os editou. **Recomendação:** nova atribuição ao Backend (ou ao Orquestrador) para alinhar os textos antes de qualquer QA. **Reprodução:** `git grep -n -E 'não abort\|ACHADO B-1' 4b4650d -- docs AGENTES/02_backend AGENTES/ATRIBUICOES`. |
| BK2-3 | S3 | VERIFIED | **`STATUS.md` do Backend mistura Lote 1 e Lote 2.** O cabeçalho ainda cita `AGENTES/ATRIBUICOES/LOTE-1.md`, branch `wt/backend-lote1`, base `8da08c6`; a tabela de pesos é do Lote 1 ("aguarda Verificação da rodada 3") e o campo `SHA:` da seção Lote 2 diz "HEAD do branch" em vez do SHA literal. Sem efeito de segurança. **Recomendação:** cabeçalho do Lote 2 e SHA literal no próximo commit. |
| BK2-4 | S4 | observação | **Acoplamento entre B-1 e R1.** Com o passo 1b abortante, a evidência de R1 (passo 8/9) só existe depois que a migração B-1 for aplicada. Está documentado ("nessa ordem") e é falha fechada; registro só para o planejamento do QA (duas contas descartáveis, ambiente isolado, gates de Yan). |

Nenhuma severidade foi reduzida. Nenhum achado do Lote 1 foi reaberto por este SHA; B-1 passa de "decisão pendente" para "implementada, não aplicada".

## 5. Execução independente

Checkout isolado `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado em `4b4650d34f3a748078dcb5b7c6c351eade7ad7eb` (`git checkout --detach`), `git status` limpo antes e depois. Node v26.13.0, npm 12.0.2. Sem `.env` (só `.env.example`), sem variáveis `SUPABASE`/`GROQ`/`NVIDIA` no ambiente, sem rede de provedor.

| Comando (em `apps\web`) | Exit | Resultado |
|---|---:|---|
| `npm ci` (feito uma vez; lockfile idêntico nos três SHAs) | 0 | 2 min 17 s; só avisos `install-scripts` |
| `npx next typegen` | 0 | "Types generated successfully" |
| testes do papel | n/a | o Backend não alterou código; não há teste de SQL executável sem banco |
| `npm test` | 0 | tests 32 · pass 32 · fail 0 · cancelled 0 · skipped 0 |
| `npm run lint` | 0 | sem diagnósticos |
| `npm run typecheck` | 0 | sem erros |
| `npm run build` (sem `.env`) | 0 | compilou, 24 páginas |

Como o diff não toca `apps/`, estes resultados são os da base `acc1f44` e servem de regressão, não de prova do SQL. SQL, banco, migração e credenciais: **não executados**.

## 6. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | escopo, arquivos proibidos, `diff --check`, segredos, coautoria; assinaturas contra a Fase 9; ordem da timestamp; conteúdo exato da opção A; chamadores só com sessão; estrutura `begin`…`rollback` do teste; lint/typecheck/test/build da base |
| HYPOTHESIS | `anon` tem `EXECUTE` hoje; semântica de `has_function_privilege`/`aclexplode` no banco; `begin`/`commit` conforme o método (BK2-1); comportamento da API anônima após a B-1 |
| PENDING | sintaxe do SQL; aplicação em QA (gate de Yan); `alter default privileges` (fora do escopo, decisão de Yan); R1; RLS das Fases 3–8; alinhamento dos documentos (BK2-2) |

## 7. Decisões pendentes

Yan: aplicar a migração B-1 depois da Fase 9, em QA isolado com contas descartáveis; decidir `alter default privileges`. Orquestrador: método de aplicação (BK2-1); atribuir o alinhamento dos documentos (BK2-2) e do `STATUS.md` (BK2-3).
