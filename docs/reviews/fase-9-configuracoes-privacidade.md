# Revisão da Fase 9 — Configurações, privacidade e controle de dados

> Data: 31/08/2026
> Estado: implementada, tecnicamente validada e **validada visualmente por Yan em ambiente local**; migração e teste RLS com dois usuários pendentes de execução direta por Yan no Supabase

## Entrega

- `/app/configuracoes` — Perfil e preferências: nome, momento profissional, objetivo, lembrete opcional com horário e comunicação opcional, com validação HTML e revalidação idêntica no servidor;
- `/app/configuracoes/dados` — Dados e privacidade: exportação completa e exclusão permanente;
- `/app/configuracoes/conta` — Conta Microsoft conectada (e-mail do provedor) e encerramento de sessão;
- navegação secundária estável entre as três áreas, já ligada ao item existente de Configurações no rodapé da navegação principal;
- exportação (`GET /api/export`) devolve um JSON versionado (`schemaVersion`, `exportDate`) com perfil, Diário, sugestões de evidência, evidências e fontes, diagnósticos e snapshots do Narrative Score, sessões/evidências autorizadas/perguntas/versões do Persona Live e Artefatos/fontes/versões — todas as 14 consultas filtradas por `user_id`/`id` do usuário autenticado; qualquer falha de consulta interrompe a exportação inteira (fail-closed), sem entregar arquivo parcial;
- exclusão permanente segue o fluxo aprovado: reautenticação Microsoft com `prompt=login`, nonce de estado validado via cookie `httpOnly` de uso único, autorização curta gravada no banco (`authorize_sensitive_action`), confirmação textual exata `EXCLUIR` e RPC transacional `delete_own_account` que remove `auth.users` e deixa as chaves estrangeiras `on delete cascade` removerem todos os dados relacionados nas oito tabelas privadas do produto.

## Segurança e dados

- migração `supabase/migrations/20260818200000_phase_9_settings.sql` cria `sensitive_action_authorizations` com RLS habilitada e todo acesso direto revogado de `public`/`anon`/`authenticated` — a tabela só é tocada pelas duas funções `security definer`;
- `authorize_sensitive_action` e `delete_own_account` fixam `search_path = pg_catalog, public, auth`, exigem `auth.uid()` não nulo e usam `errcode` específico (`42501`, `22023`, `P0002`) para cada falha;
- a autorização de exclusão expira em 5 minutos, é de uso único (`delete ... returning` a consome dentro da própria transação de `delete_own_account`) e é reemitida a cada reautenticação bem-sucedida;
- confirmei que todas as tabelas privadas referenciadas pela exportação e pela exclusão (`profiles`, `daily_logs`, `evidence_suggestions`, `evidences`, `evidence_sources`, `narrative_diagnostics`, `narrative_score_snapshots`, `live_sessions`, `live_session_evidences`, `live_questions`, `live_draft_versions`, `artifacts`, `artifact_sources`, `artifact_versions`) têm `user_id`/`id` referenciando `auth.users (id) on delete cascade`, confirmado nas migrações das Fases 3–8;
- nenhum segredo, token ou client secret foi lido, exibido ou registrado durante a revisão.

## Validação técnica

```text
npm.cmd test           32/32 aprovados
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd run build      aprovado
```

Auditoria `design-sem-cara-de-ia` (`auditar_tells_ia.py`) sobre `app/app/configuracoes`: nenhum dos nove sinais monitorados encontrado. O CSS novo reaproveita os tokens e o padrão de cor de sucesso/erro já usados no restante de `globals.css` (mesmos `#6ee7b7`/`#fca5a5` sobre `var(--color-success)`/`var(--color-error)` das telas de Diário, Evidências, Score, Live e Artefatos); nenhuma dependência, abstração ou componente novo foi adicionado.

## Revisão visual

Yan validou a interface localmente em `http://localhost:3100/app/configuracoes` em 31/08/2026 (perfil e preferências, dados e privacidade, conta e acesso).

## O que ainda não foi feito nesta rodada

- **Teste SQL com dois usuários** para RLS, autorização expirada, finalidade incorreta e confirmação incorreta (exigido pelo contrato, seção 7): requer acesso direto ao banco Postgres do Supabase (SQL Editor ou `service_role`), que esta sessão não possui — `apps/web/.env.local` só tem a chave `anon` pública. Script pronto para colar entregue a Yan.
- **Migração `20260818200000_phase_9_settings.sql` não foi aplicada** ao Supabase do projeto `persona-mvp-v2` pelo mesmo motivo: exige acesso ao SQL Editor ou à CLI vinculada, que só Yan tem. Nenhuma tabela ou função desta fase existe hoje no banco real.
- Revisão Ponytail `full` automatizada não está disponível neste ambiente; a revisão de código foi feita manualmente linha a linha (reuso de validação do onboarding, sem serviço, store ou abstração nova) seguindo os mesmos princípios.

## Gate

Fluxo principal, validação, segurança de servidor e revisão visual estão concluídos. Falta, na ordem do contrato (seção 9): Yan aplicar a migração e rodar o teste RLS com dois usuários diretamente no Supabase (esta sessão não tem credenciais de banco). A Fase 9 só é encerrada como aprovada depois dessa confirmação.
