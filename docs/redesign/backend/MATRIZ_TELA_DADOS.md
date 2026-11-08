# Matriz tela × dados × ações × backend — T4.1 a T4.8

Lote 1 · Persona — Dados e Backend · 04/11/2026 · base `8da08c6` (branch `wt/backend-lote1`).
Somente leitura do código e das migrações; nenhum banco foi consultado, nenhuma migração aplicada.

**Fontes lidas:** `supabase/migrations/*.sql` (7 arquivos), `apps/web/app/**/actions.ts`, `apps/web/app/**/page.tsx` (leituras), `apps/web/lib/**`, `app/api/export/route.ts`, `app/auth/callback/route.ts`, e o protótipo `docs/design/approved/2026-11-03-t4/fonte/t4/*.jsx` (rótulos, estados e botões; o protótipo usa dados sintéticos, vale como especificação visual, não como contrato).

**Legenda de estado:** `EXISTE` = tabela/RPC/lib/action presente no código e nas migrações; `PARCIAL` = existe, mas falta leitura, filtro ou campo que a tela T4 pede; `INEXISTENTE` = sem backend; `DERIVADO` = calculado em código a partir de colunas existentes (sem coluna própria). "Aplicado no banco real" **não** é afirmado em nenhuma linha: só o código foi lido.

## 0. Contratos transversais (valem para todas as telas)

| Item | Backend real |
|---|---|
| Sessão | `createClient()` (`lib/supabase/server.ts`) + `supabase.auth.getClaims()`; sem sessão → `redirect("/entrar")`. Perfil/onboarding: `lib/auth/current-profile.ts` (`profiles`). |
| Isolamento | RLS `(select auth.uid()) = user_id` em todas as tabelas; RPCs `security definer` filtram por `auth.uid()`. As actions ainda repetem `.eq("user_id", userId)`. |
| Escrita direta permitida | `profiles` (select/insert/update), `daily_logs` (CRUD), `evidence_suggestions` (select/insert/update, nunca para `confirmed`), `evidences` (select/insert só `source_log_id`/`suggestion_id` nulos/update), `evidence_sources` (CRUD), `narrative_diagnostics` (rascunho), `live_sessions` (select/insert `preparing`). |
| Somente leitura direta (escrita só por RPC) | `narrative_score_snapshots`, `live_session_evidences`, `live_questions`, `live_draft_versions`, `artifacts`, `artifact_sources`, `artifact_versions`. |
| Fechada ao cliente | `sensitive_action_authorizations` (RLS ligada, zero políticas, `REVOKE ALL`); acessível só por `authorize_sensitive_action` / `delete_own_account`. |
| IA | Groq (servidor): `lib/groq/structure-evidence.ts` (Diário), `lib/score/coherence.ts` (Score), `lib/groq/generate-artifact.ts` (Artefatos). Persona Live: `lib/live/generate-live-response.ts` (NVIDIA, sem inferência real comprovada, ver `AGENTS.md` §5). |
| Erros | Actions registram só `error.code`; mensagens ao usuário são fixas em português. Estados de erro T4 ("indisponível", "Tentar de novo") mapeiam para esses retornos, não para falhas de rede do cliente. |
| Níveis de evidência | `DERIVADO` em `evidencias/page.tsx:58`: `evidence_sources` com ≥1 linha ⇒ Documentada, senão Registrada. **Certificada** e **Validada** não têm coluna, tabela nem fluxo (protótipo as mostra como "indisponível nesta versão" — coerente). |
| Ausente em todas | Painel/Agente Persona (T4.8) e o botão "Pedir ao Agente" de cada tela; "Rastreabilidade" como painel unificado (existe como dados: `evidences.source_log_id`, `live_draft_versions.evidence_ids`, `artifact_versions.source_map`, `narrative_score_snapshots.evidence_ids`/`explanation`, mas não há leitura agregada pronta). |

## T4.1 · Início — rota real `/app/inicio` (`app/app/inicio/page.tsx`)

| Elemento T4 | Dado | Backend | Estado |
|---|---|---|---|
| Narrative Score (anel, Declarada/Observada, Coerência, Consistência) | último `narrative_score_snapshots`; `total_state`, `*_origin` | `lib/score/data.ts` → `getNarrativeScoreData`; página já renderiza | EXISTE |
| Credibilidade ("Ainda não avaliada") | — | nenhuma coluna ou cálculo (o texto é fixo e o protótipo também diz que não entra no cálculo) | INEXISTENTE (aceito: sem número nesta versão) |
| Score "aguardando" / "dados insuficientes" | elegibilidade: conta com ≥21 dias, ≥6 registros ativos em ≥3 semanas (consistência), ≥5 evidências, 2 contextos, 3 competências (coerência) | `lib/score/consistency.ts`, `lib/score/coherence.ts` (`coherenceEligibility`) | DERIVADO |
| Score "erro / Análise indisponível" + "Atualizar análise" | falha ao chamar Groq; último snapshot permanece | `app/app/score/actions.ts` `updateCoherence` → RPC `record_narrative_score_snapshot` (já redireciona com `notice`) | EXISTE (estado de erro vem de `notice`, não de componente) |
| Jornada focal (Diagnóstico → Primeiro registro → 5 evidências → Score observado) | `narrative_diagnostics.status`, contagem de `daily_logs`, contagem de `evidences` confirmadas, `total_state` | leituras de `lib/score/data.ts`; página monta passos 01–04 | DERIVADO |
| "Para revisar" (sugestões da IA) | `evidence_suggestions` com `status='for_review'`, título/contexto do `daily_logs` | **página atual não lê** `evidence_suggestions`; tabela, índice `evidence_suggestions_user_log_idx` e RLS existem | PARCIAL (leitura nova, sem migração) |
| "Atividade recente" (registros + evidências + status) | `daily_logs` (últimos) e `evidences`; "Em análise" = `evidence_suggestions.status='generating'`; "Ver origem" = `evidences.source_log_id` | página lê só `daily_logs` (limit 4); feed unificado não existe — são 2–3 consultas ordenadas e mescladas em código | PARCIAL |
| Competências / "Lacuna" | contagem por `evidences.competencies[]` (a página já conta) | "Lacuna" (competência pedida e sem prova) **sem fonte**: não há tabela de competências-alvo | PARCIAL (contagem) / INEXISTENTE (lacuna) |
| Selos nos destinos (ex.: "2 sugestões para revisar") | contagens de `evidence_suggestions` e outros | agregações novas sobre tabelas existentes | PARCIAL |
| Painel/prompt do Agente, "Agente em protótipo" | — | ver §T4.8 | INEXISTENTE |

## T4.2 · Diário — rota real `/app/diario`, `/app/diario/[id]`

| Elemento T4 | Dado | Backend | Estado |
|---|---|---|---|
| Histórico + filtros (`q`, `state`, `from`, `to`) | `daily_logs` (`occurred_on`, `status`, `context`, `content`) | `diario/page.tsx` (já aceita `q/state/from/to`); índice `daily_logs_user_occurred_on_idx` | EXISTE |
| Estados carregando / vazio / "Histórico indisponível" / "Tentar carregar de novo" | erro de consulta | página trata `error`; "tentar de novo" = recarregar rota | EXISTE |
| Criar registro ("Registro salvo / não salvo") | `daily_logs` (`content` 40–2000, `context` 2–160, `occurred_on`) | `createDailyLog` (+ `recordConsistencyIfChanged` → RPC `record_narrative_score_snapshot`) | EXISTE |
| Editar registro ("Alterações não salvas", "Versão salva na outra aba") | idem | `updateDailyLog` — **sem controle de revisão/concorrência** (última escrita vence); T4 mostra conflito entre abas | PARCIAL (conflito entre abas exige coluna/RPC de revisão, não existe para `daily_logs`) |
| Excluir registro ("Tentar excluir de novo") | `daily_logs`; bloqueado se há `evidences.source_log_id` (FK `restrict`) | `deleteDailyLog` (checa contagem antes; `notice=delete-blocked`) | EXISTE |
| Gerar sugestões (IA), "Gerar de novo", "Tentar gerar de novo" | `evidence_suggestions` (`origin='ai'`, `status` generating/for_review/no_suggestion/failed) | `generateSuggestion` → `structureEvidence` (Groq); índice único impede duas gerações simultâneas (`23505` → `generation-running`) | EXISTE |
| Estruturar manualmente | `evidence_suggestions` (`origin='manual'`) | `createManualSuggestion` | EXISTE |
| Revisar / confirmar sugestão (nível ao confirmar = Registrada) | `evidence_suggestions` → `evidences` | `reviewSuggestion` + RPC `confirm_evidence_suggestion` (atômica, marca o log `structured`) | EXISTE |
| Descartar / "Desfazer" descarte | `status='rejected'` | `rejectSuggestion`; **"Desfazer" não existe**: a política de update exige `status <> 'confirmed'`, então reabrir `rejected` é possível por RLS, mas não há action | PARCIAL |
| Rastreabilidade (log → sugestão → evidência) | `evidence_suggestions.daily_log_id`, `evidences.source_log_id`/`suggestion_id` | `diario/[id]/page.tsx` já lê as três | EXISTE |
| Voz (`source='voice'`) | coluna existe (`daily_logs.source`) | nenhuma captura/ação grava `voice` | INEXISTENTE (só o campo) |

## T4.3 · Evidências — rota real `/app/evidencias`, `/app/evidencias/[id]`

| Elemento T4 | Dado | Backend | Estado |
|---|---|---|---|
| Biblioteca + filtros (q, view, competência, período, nível, situação) | `evidences` + `evidence_sources(id)` | `evidencias/page.tsx` (filtros já no servidor); índice `evidences_user_created_at_idx` | EXISTE |
| Níveis Registrada / Documentada | `DERIVADO` de `evidence_sources` | idem | EXISTE |
| Níveis Certificada / Validada | — | nada | INEXISTENTE (rotulado "indisponível" no T4) |
| Registrar evidência (sem Diário) | `evidences` com `source_log_id` e `suggestion_id` nulos | `createEvidence`; política `evidences_insert_own` só aceita `confirmed` + ambos nulos | EXISTE |
| Editar ("Revisar antes de salvar", "Nível ao salvar") | `evidences` | `updateEvidence` — sem controle de revisão (mesma limitação do Diário para "outra aba") | PARCIAL |
| Provas: adicionar / remover link | `evidence_sources` (`url` http(s), único por evidência) | `addEvidenceLink` (`23505` → "já vinculado"), `removeEvidenceLink` | EXISTE |
| Arquivar / restaurar | `evidences.status` | `archiveEvidence`, `restoreEvidence` | EXISTE |
| "Ainda não usada" / usos | `live_session_evidences`, `artifact_sources` por `evidence_id` | tabelas existem; **a página de detalhe não lê usos** | PARCIAL (leitura nova) |
| Rastreabilidade → registro de origem | `evidences.source_log_id` → `daily_logs` | `evidencias/[id]/page.tsx:57` | EXISTE |
| Excluir evidência | — | não há política `delete` em `evidences` nem action; FKs `restrict` de Live/Artefatos/Diário a protegem | INEXISTENTE (T4 não pede) |

## T4.4 · Persona Live — rota real `/app/live`, `/app/live/[id]`

| Elemento T4 | Dado | Backend | Estado |
|---|---|---|---|
| Lista de sessões | `live_sessions` + `live_questions(count)` | `live/page.tsx` | EXISTE |
| Busca / "Limpar filtros" / "Nenhum resultado para esta busca ou estado" | — | `live/page.tsx` não lê `searchParams`; sem filtro | PARCIAL (filtro novo; tabela serve) |
| Nova sessão (Vaga e empresa, Descrição da vaga) | `live_sessions` (`target_role` 4–120, `company` 2–120, `opportunity_description` ≤2000) | `createLiveSession` | EXISTE |
| Evidências autorizadas (1–8, recomendação) | `live_session_evidences` (`recommendation_score`, `recommendation_reasons`, `removed_at`) | `lib/live/recommendation.ts` + RPC `set_live_evidences`; "Zero evidências elegíveis" = `evidences` confirmadas = 0 | EXISTE |
| Iniciar / Pausar / Retomar / Encerrar | `live_sessions.status` | `authorizeAndActivate`, `pauseLiveSession`, `closeLiveSession` → RPC `change_live_session_status` (máquina de estados no banco) | EXISTE |
| Pergunta atual → "Montar argumentos" | `live_questions`, `live_draft_versions` (`arguments`, `draft_text`, `evidence_ids`, `gap`, `model`, `prompt_version`) | `askLiveQuestion` → RPC `create_live_question` → `generateLiveResponse` → RPC `finish_live_question` / `fail_live_question` | EXISTE (inferência real não comprovada) |
| Encurtar / Aprofundar / Outra experiência | `live_draft_versions.mode` (`shorter`/`deeper`/`alternative`) | `regenerateLiveQuestion` | EXISTE |
| "Sustentada" vs lacuna ("Lacuna encaminhada ao Diário") | `live_questions.status` `answered`/`gap`, `live_draft_versions.gap` | gravado por `finish_live_question`; "Ir ao Diário" é só link | EXISTE (sem vínculo persistido lacuna→Diário) |
| "IA indisponível · pergunta e seleção preservadas" | `live_questions.status='failed'`, `error_code` | `fail_live_question`; retry reaproveita a pergunta falhada | EXISTE |
| Histórico da sessão / "Somente leitura" | `live_questions` + `live_draft_versions` | `live/[id]/page.tsx` | EXISTE |
| Duplicar sessão ("Cópia em criação…") | nova linha + evidências ativas | RPC `duplicate_live_session` (só sessão `closed`) | EXISTE |
| "Salvar nos Artefatos" ("Salvo como Rascunho", "Tentar salvar de novo") | `artifacts` com `origin_type='live_question'` (único por pergunta) | `saveLiveAsArtifact` → RPC `create_artifact_from_live` (idempotente) | EXISTE |
| Transcrição / áudio | — | contrato do produto: não persistir; nenhuma tabela | INEXISTENTE (correto) |

## T4.5 · Artefatos — rota real `/app/artefatos`, `/novo`, `/[id]`

| Elemento T4 | Dado | Backend | Estado |
|---|---|---|---|
| Biblioteca + filtros (`q`, `state`, `type`, `from`, `to`) | `artifacts` + `artifact_sources(count)` | `artefatos/page.tsx` | EXISTE |
| Criar (tipo, objetivo, fontes autorizadas 1–12) | `artifacts`, `artifact_sources` | `createArtifact` → RPC `create_artifact`; geração opcional `generate-artifact.ts` (Groq) + RPC `apply_artifact_version` | EXISTE |
| "Pré-preenchido pelo Agente Persona", objetivo declarado | `profiles.main_objective` (objetivo declarado existe); Agente não | leitura de `profiles` possível; pré-preenchimento pelo Agente | PARCIAL / INEXISTENTE (Agente) |
| "Declaração manual · não são evidências" (e-mail, empresa fictícia) | `artifacts.supplementary_data` (jsonb) | gravado por `create_artifact`/`autosave_artifact` | EXISTE |
| Editar com autosave ("Salvando…", "Alterações não salvas") | `artifacts.working_content`, `revision` | `saveArtifactContent` → RPC `autosave_artifact` | EXISTE |
| "Conflito de versão" / "Manter versão salva" | `artifacts.revision` | RPCs devolvem `40001` quando `revision` diverge | EXISTE |
| Ações de IA por seção (Encurtar/Aprofundar/Adaptar/Alternativa), "Tentar de novo" | `artifact_versions` (`trigger`, `section_key`, `source_map`, `model`, `prompt_version`) | `regenerateArtifact` → RPC `apply_artifact_version` | EXISTE |
| Marcar como Revisado / "Reabrir como rascunho" | `artifacts.status`, `reviewed_at` | `markArtifactReviewed` → RPC `mark_artifact_reviewed`; **reabrir**: qualquer autosave/versão volta a `draft`, mas não há action explícita "Reabrir" | PARCIAL |
| Versões / "Restaurar versão N" | `artifact_versions` | `restoreArtifactVersion` → RPC `restore_artifact_version` | EXISTE |
| "Este artefato não cita fonte" / Fontes mantidas | `artifact_sources.removed_at`, `evidences.status` | leitura em `artefatos/[id]/page.tsx:23` | EXISTE |
| "Copiar / exportar / impressão" | — | ação no cliente; sem persistência nem rota de exportação por artefato | PARCIAL (cliente) |
| Excluir Artefato | — | sem política `delete` nem action | INEXISTENTE (T4 não pede) |

## T4.6 · Narrative Score — rota real `/app/score`, `/app/diagnostico`

| Elemento T4 | Dado | Backend | Estado |
|---|---|---|---|
| Resumo (total, Coerência, Consistência, origem) | `narrative_score_snapshots` | `lib/score/data.ts` | EXISTE |
| "Como é calculado" / fórmula | `method_version='narrative-score-v1'`, pesos 60/40 no banco (`complete_narrative_diagnostic`, `record_narrative_score_snapshot`), `explanation` jsonb, `evidence_ids` | RPCs + `lib/score/score.test.ts` | EXISTE |
| Histórico ("Nenhum snapshot ainda") | `narrative_score_snapshots` por `created_at` | `score/page.tsx` | EXISTE |
| "Atualizar Coerência" ("Calculando…", "Cálculo concluído", "Coerência não atualizada", "Dados insuficientes") | elegibilidade + IA | `updateCoherence` → `lib/score/coherence.ts` (Groq) → RPC `record_narrative_score_snapshot` | EXISTE |
| Diagnóstico (3 etapas, rascunho) | `narrative_diagnostics` | `saveDiagnostic`, RPC `complete_narrative_diagnostic` (10 respostas 0/25/50/75/100) | EXISTE |
| Credibilidade | — | sem dado nem cálculo; T4 diz "sem número nesta versão" | INEXISTENTE (aceito) |
| "Com os seus valores" (simulação) | — | cálculo puro no cliente seria possível; hoje não existe tela/ação | INEXISTENTE |
| "Pedir explicação ao Agente" | — | Agente | INEXISTENTE |

## T4.7 · Configurações — rota real `/app/configuracoes`, `/conta`, `/dados`

| Elemento T4 | Dado | Backend | Estado |
|---|---|---|---|
| Perfil (nome, momento, objetivo) | `profiles.display_name/professional_moment/main_objective` | `lib/settings/actions.ts` `updateProfile` | EXISTE |
| Lembrete + comunicações opcionais | `profiles.daily_log_reminder_enabled/_time`, `communications_consent` | `updateProfile`; **nenhum envio** (sem job, e-mail ou push) — só preferência gravada | PARCIAL (preferência sem entrega) |
| "Como você entra" (Conectada, e-mail, sessão) | claims do Supabase Auth (Microsoft) | `auth/iniciar`, `auth/callback`; `signOut` | EXISTE |
| Exportar dados ("Preparando o arquivo…") | 14 tabelas | `GET /api/export`: `select("*")` por tabela, JSON, `Cache-Control: private, no-store`; falha em qualquer tabela ⇒ 500 | EXISTE (ver risco R2: sem paginação) |
| Reautenticar com Microsoft ("Autorização válida por…") | `sensitive_action_authorizations` (5 min) | `/auth/iniciar?reauth=delete_account` → callback com nonce em cookie → RPC `authorize_sensitive_action`; página mostra só `notice=reauthenticated` | EXISTE (**tempo restante** da autorização não é lido: tabela fechada ao cliente) |
| Excluir conta (digitar `EXCLUIR`) | `auth.users` e cascata | `deleteAccount` → RPC `delete_own_account` (`42501` → "confirmação Microsoft expirou") | EXISTE no código; **cascata não comprovada** (ver risco R1) |
| "Sessão expirada / encerrada" | claims | `updateProfile`/`deleteAccount` devolvem "Sessão expirada" | EXISTE |
| Descartar alterações / "Não salvo" | — | estado local do formulário | cliente |

## T4.8 · Agente Persona — sem rota real

| Elemento T4 | Dado | Backend | Estado |
|---|---|---|---|
| Painel lateral, conversa, "Limpar conversa", "Só nesta sessão" | conversa efêmera | nenhuma rota, action, tabela, prompt ou lib de produto. `lib/agent/` é trabalho do papel Agente NVIDIA (Lote 1, sem rede) | INEXISTENTE |
| Busca "Nenhum resultado em registros e evidências" | recuperação sobre `daily_logs`/`evidences` do próprio usuário | não há busca no banco (nenhum `ilike`, `.or(`, `textSearch` ou `.like(` em `apps/web`); os filtros das páginas são em memória sobre até 100 registros (`evidencias/page.tsx:55`); sem índice de texto, embeddings ou RPC | INEXISTENTE |
| Origem ("Esta origem não existe ou não é sua") | resolução de ID de evidência/registro/snapshot sob RLS | possível por RLS (retorna vazio para IDs alheios); ainda sem contrato | PARCIAL (primitivo existe) |
| Pré-preenchimento de Artefato, explicação de Score, briefing do Início | — | dependem do Agente | INEXISTENTE |
| Provedor | NVIDIA `z-ai/glm-5.3-flash` (decisão do Live); Groq nas demais | sem inferência real comprovada | decisão pendente de ADR |

## Riscos e lacunas para o Orquestrador (por severidade)

- **R1 · ALTA · HYPOTHESIS — exclusão de conta pode falhar para quem tem dados.** `delete_own_account` apaga `auth.users` e depende da cascata. Há FKs `on delete restrict` que apontam para linhas que a própria cascata remove: `evidences.source_log_id → daily_logs` (fase 4), `narrative_score_snapshots.diagnostic_id → narrative_diagnostics` (6), `live_session_evidences.evidence_id`, `live_questions.primary_evidence_id` (7), `artifact_sources.evidence_id` (8). `RESTRICT` não é adiável; se o PostgreSQL executar a cascata de `daily_logs` antes da de `evidences` (ordem de criação das FKs), a exclusão falha com `23001` (`restrict_violation`) ou `23503` (`foreign_key_violation`); qual código vem só o banco real decide, e ambos são tratados como sinal de R1 quando a mensagem nomeia uma FK `restrict` das fases 4–8. O teste RLS original (sem dados semeados) não detectaria isso. **Só um banco real prova**; o script revisado semeia esses dados e imprime `ACHADO BLOQUEANTE` se falhar. Correção (migração com `NO ACTION` deferível, ou apagar dependentes antes na função) é gate de Yan: fora do escopo deste lote.
- **R2 · MÉDIA — exportação sem paginação (FATO no código); limite do projeto PENDING.** `/api/export` usa `select("*")` por tabela, sem `range`/paginação e sem checar contagem (`app/api/export/route.ts:30-43`). Isso é verificável no código. O que permanece pendente é o teto efetivo de linhas por consulta (`max_rows` do PostgREST, comumente 1000): o repositório não contém `supabase/config.toml`, então só a configuração do projeto Supabase confirma se a exportação trunca silenciosamente e a partir de quantas linhas.
- **R3 · MÉDIA — edição concorrente ("Versão salva na outra aba") só existe para Artefatos.** T4.2 e T4.3 desenham o conflito; `daily_logs` e `evidences` não têm `revision`. Exige coluna/RPC nova (migração, gate de Yan) ou aceitar que o estado fique só no cliente.
- **R4 · BAIXA — leituras novas sem migração:** "Para revisar", atividade recente, usos da evidência, filtro de sessões do Live. Todas cabem nas políticas `select_own` atuais.
- **R5 · INFO — nada de T4 exige service role.** Todas as leituras e mutações acima passam por sessão do usuário + RLS/RPC; o Agente (T4.8) também deve rodar assim.
