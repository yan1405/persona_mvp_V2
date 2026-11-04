# Status — Persona — Dados e Backend

Estado: Lote 1 entregue para revisão (somente documentos e script de teste; nenhuma execução em banco).

Atribuição: `AGENTES/ATRIBUICOES/LOTE-1.md`, seção 02 · branch `wt/backend-lote1` · base `8da08c6`.

| Tarefa | Peso | Estado | Evidência |
|---|---:|---|---|
| Matriz tela × dados × ações | 25 | VERIFIED | `docs/redesign/backend/MATRIZ_TELA_DADOS.md`: T4.1–T4.8 ligadas a tabela/RPC/action/lib ou marcadas INEXISTENTE; nomes conferidos por `grep` nas migrações e em `apps/web` |
| Adaptação de contratos | 25 | PENDING | sem atribuição neste lote (nenhuma action/lib alterada) |
| Auth, ownership e RLS | 25 | PENDING | script revisado e corrigido por leitura (`RELATORIO_TESTE_RLS.md`); **não executado** — o peso só conta com o teste rodando em banco liberado por Yan |
| Regressão e falhas | 25 | PENDING | sem código de produto alterado; lint/typecheck/testes não se aplicam |

Concluído: 25%
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
- `grep` dos nomes de tabelas/RPCs citados na matriz contra `supabase/migrations` e `apps/web` → todos encontrados (só "não encontrados": os termos genéricos `max_rows` e `select_own`, que não são objetos).
- Não executados: SQL (sem banco), `npm run lint/typecheck/test/build` (sem código alterado).

## Achados (detalhe em `MATRIZ_TELA_DADOS.md`, "Riscos")

1. **Teste RLS original nunca reprovava** (o `raise 'FALHOU'` estava dentro do `exception when others`) e o "isolamento" não testava o banco. Corrigido.
2. **R1 · ALTA · HYPOTHESIS:** `delete_own_account` pode falhar para usuários com evidências/Live/Artefatos/diagnóstico, por FKs `on delete restrict` (fases 4–8) na cascata de `auth.users`. O script agora semeia esses dados e imprime `ACHADO BLOQUEANTE` se confirmar. Correção exige migração (gate).
3. **R2 · MÉDIA · HYPOTHESIS:** `/api/export` sem paginação pode truncar em 1000 linhas por tabela (`supabase/config.toml` não está no repositório).
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
