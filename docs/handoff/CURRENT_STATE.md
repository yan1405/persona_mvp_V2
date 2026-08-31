# Estado atual verificável

> Snapshot: 31/08/2026
> Pasta: `C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2`  
> Próximo gate: teste RLS com dois usuários, aplicação da migração `20260818200000_phase_9_settings.sql` e Sessão de Avaliação Visual da Fase 9 — todos exigem ação direta de Yan

## 1. Resumo executivo

O projeto possui autenticação Microsoft real, onboarding persistente e os ciclos completos das Fases 4–7. A Fase 7 está publicada na Vercel em `https://persona-mvp-v2.vercel.app`. Em 16/08/2026, o segredo Groq foi rotacionado na origem e na Vercel, o hardening `e09aa37` foi publicado e o fluxo autenticado de produção foi validado: Microsoft → `/app/inicio` → sessão Live → evidência autorizada → pergunta → resposta sustentada com argumentos e rascunho separados.

Em 18/08/2026, a Fase 8 foi implementada, publicada e validada tecnicamente em produção. STAR, Pitch pessoal, Currículo ATS e Portfólio por casos foram gerados com uma evidência fictícia; autosave, fontes, IA por seção, versões, restauração, filtros, PDF e a ação opcional do Persona Live foram exercitados. Em 30/08/2026, Yan aprovou visualmente a Fase 8, autorizou o início da Fase 9 e aprovou o contrato da Fase 9 (commit `78db42e`). Em 31/08/2026, o rascunho local de Configurações foi auditado e completado conforme esse contrato: perfil e preferências, exportação completa e fail-closed, e exclusão permanente com reautenticação Microsoft, autorização curta de uso único e RPC transacional. Lint, TypeScript, 32/32 testes e build passam localmente; a migração ainda não foi aplicada ao Supabase real e faltam o teste RLS com dois usuários e a Sessão de Avaliação Visual, todos pendentes de ação direta de Yan. Revisão técnica: `docs/reviews/fase-9-configuracoes-privacidade.md`.

| Fase | Estado | Evidência |
|---|---|---|
| 0 — governança e arquitetura | aprovada | `AGENTS.md`, briefings e arquitetura |
| 1 — fundação e entrada | aprovada | `docs/reviews/fase-1-fundacao.md` |
| 2 — autenticação Microsoft | aprovada | `docs/reviews/fase-2-autenticacao.md` |
| 3 — onboarding funcional | aprovada para avanço | `docs/reviews/fase-3-onboarding.md` |
| 4 — Diário e estruturação assistida | aprovada em 11/08/2026 | `docs/reviews/fase-4-diario-evidencias.md` |
| 5 — Biblioteca de Evidências | aprovada em 11/08/2026 | `docs/reviews/fase-5-biblioteca-evidencias.md` |
| 6 — Início e Narrative Score | aprovada por Yan em 12/08/2026 | `docs/reviews/fase-6-narrative-score.md` |
| 7 — Persona Live manual | implementada, publicada e validada de ponta a ponta em produção | `docs/reviews/fase-7-persona-live.md` |
| 8 — Artefatos profissionais | aprovada visualmente por Yan em 30/08/2026 | `docs/reviews/fase-8-artefatos-profissionais.md` |
| 9 — Configurações, privacidade e controle de dados | contrato aprovado e implementada localmente; migração, teste RLS e aprovação visual pendentes | `docs/reviews/fase-9-configuracoes-privacidade.md` |

## 2. Aplicação existente

### Rotas públicas e técnicas implementadas

- `/` — decide entrada e redirecionamento;
- `/entrar` — tela de entrada e botão Microsoft;
- `/auth/iniciar` — inicia OAuth Microsoft;
- `/auth/callback` — troca o código PKCE por sessão;
- `/auth/erro` — erro seguro de autenticação/configuração;
- `/termos` — termos provisórios;
- `/privacidade` — política provisória.

### Rotas autenticadas implementadas

- `/onboarding` — quatro etapas e persistência final;
- `/app/inicio` — visão operacional, Score, origem, dimensões e próximo movimento;
- `/app/diario` — captura, busca, filtros e histórico;
- `/app/diario/[id]` — registro, sugestões, revisão e confirmação.
- `/app/evidencias` — biblioteca, registro manual, busca e filtros combinados;
- `/app/evidencias/[id]` — Resumo editável, Provas por link e Uso futuro.
- `/app/diagnostico` — diagnóstico versionado de três etapas com rascunho;
- `/app/score` — Resumo, Histórico e Como é calculado.
- `/app/live` — preparação, recomendação de evidências e histórico de sessões;
- `/app/live/[id]` — autorização, perguntas, argumentos, rascunhos, versões e encerramento.
- `/app/artefatos` — biblioteca, busca e filtros;
- `/app/artefatos/novo` — criação dos quatro tipos obrigatórios;
- `/app/artefatos/[id]` — conteúdo, evidências, versões, revisão, cópia e PDF;
- `/app/configuracoes` — Perfil e preferências (nome, momento profissional, objetivo, lembrete, comunicação opcional);
- `/app/configuracoes/dados` — exportação completa em JSON e exclusão permanente com reautenticação Microsoft;
- `/app/configuracoes/conta` — conta Microsoft conectada e encerramento de sessão;
- `/api/export` — rota autenticada que gera o JSON de exportação.

As outras rotas presentes no mapa de informação ainda são planejamento e não existem no código.

## 3. Dados existentes no Supabase

Projeto: `persona-mvp-v2`. Referência pública do projeto: `pnztzmobiwlblzxcqjna`.

Migrações aplicadas:

```text
supabase/migrations/20260810190000_phase_3_onboarding.sql
supabase/migrations/20260810230000_phase_4_diary_evidences.sql
supabase/migrations/20260811120000_phase_5_evidence_library.sql
supabase/migrations/20260811180000_phase_6_narrative_score.sql
supabase/migrations/20260812150000_phase_7_persona_live.sql
supabase/migrations/20260817120000_phase_8_artifacts.sql
```

Migração pronta e **ainda não aplicada** ao banco real (existe só no repositório, pendente de autorização de Yan):

```text
supabase/migrations/20260818200000_phase_9_settings.sql
```

Cria `public.sensitive_action_authorizations` (RLS habilitada, sem acesso direto de `public`/`anon`/`authenticated`) e as funções `security definer` `public.authorize_sensitive_action(text)` e `public.delete_own_account(text)`.

Objetos criados:

- `public.profiles`;
- `public.daily_logs`;
- `public.evidence_suggestions`;
- `public.evidences`;
- `public.evidence_sources`;
- `public.narrative_diagnostics`;
- `public.narrative_score_snapshots`;
- `public.live_sessions`;
- `public.live_session_evidences`;
- `public.live_questions`;
- `public.live_draft_versions`;
- `public.artifacts`;
- `public.artifact_sources`;
- `public.artifact_versions`;
- função `public.complete_onboarding(...)`;
- função `public.confirm_evidence_suggestion(uuid)`;
- funções `public.complete_narrative_diagnostic(...)` e `public.record_narrative_score_snapshot(...)`;
- políticas por proprietário para perfil, logs, sugestões, evidências e fontes;
- RLS habilitada em todas as tabelas privadas.

O fluxo real gravou um perfil e um primeiro Daily Log para a conta de teste. Não apagar, exportar ou alterar esse dado por SQL sem autorização de Yan. O produto pode sobrescrever o primeiro log de onboarding de forma idempotente pelo `entry_key = 'onboarding-first'`.

## 4. Autenticação e credenciais

- Supabase Auth com provedor Microsoft Azure está funcional;
- OAuth Authorization Code + PKCE foi validado de ponta a ponta;
- `tenant = common` atende contas pessoais, profissionais e educacionais;
- o Client Secret atual fica no painel do Supabase, nunca no repositório;
- validade registrada do secret atual: 06/02/2027;
- `.env.local` contém apenas configuração local e está ignorado pelo Git;
- `service_role` não foi usada;
- o SDK Groq e o schema estrito estão implementados somente no servidor;
- `GROQ_API_KEY` está configurada somente no `.env.local` ignorado, sem ter sido exibida ou registrada;
- uma chamada real com `openai/gpt-oss-20b` foi validada de ponta a ponta.

Não presuma que credenciais continuam válidas: verifique o fluxo sem revelar valores.

## 5. Stack real instalada

| Item | Versão/estado |
|---|---|
| Next.js | 16.3.0 |
| React / React DOM | 19.2.8 |
| TypeScript | estrito, compilando |
| Tailwind CSS | 4.x |
| Supabase JS | 2.112.2 |
| Supabase SSR | 0.12.4 |
| Groq SDK | 1.5.0; server-only |
| Carbon Icons React | 11.85.0 |
| Gerenciador | npm |
| Porta local | 3100 |

Não há shadcn/ui, Vitest ou Playwright local. O projeto usa o runner nativo do Node e automação externa do navegador para evitar dependências desnecessárias.

## 6. Validação mais recente

Executada localmente em 31/08/2026 sobre a implementação da Fase 9:

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           32/32 testes aprovados
npm.cmd run build      aprovado
```

Auditoria `design-sem-cara-de-ia` (`auditar_tells_ia.py`) sobre `app/app/configuracoes`: nenhum dos nove sinais monitorados encontrado. Nenhum fluxo autenticado da Fase 9 foi exercitado no navegador nesta rodada — depende de login Microsoft real, que só Yan pode concluir. Fluxos validados nas fases anteriores:

```text
Microsoft → /onboarding → função transacional no Supabase → /app/inicio
SQL transacional com rollback → log → sugestão manual → confirmação → evidência → isolamento RLS
Navegador autenticado → novo log → falha preservada → Groq → revisão → rejeição → regeneração → confirmação → exclusão bloqueada
Navegador autenticado → registro manual → edição → link → Documentada → arquivamento → restauração
SQL autenticado → insert próprio → leitura própria → identidade alheia sem acesso → rollback
Navegador autenticado → rascunho do diagnóstico → conclusão → Score 65 → histórico e método
Supabase real → tabelas da Fase 6 presentes → RLS habilitada → quatro políticas mínimas verificadas
```

O servidor foi reiniciado em `http://localhost:3100`. Esse processo é efêmero; uma IA futura deve verificar a porta antes de afirmar que o app está rodando.

## 7. Evidências visuais existentes

- Fase 1: quatro larguras em `docs/reviews/fase-1-fundacao/`;
- Fase 2: configuração e estado autenticado em `docs/reviews/fase-2-autenticacao/`;
- Fase 3: contexto, primeiro Daily Log e Início em `docs/reviews/fase-3-onboarding/`.
- Fase 4: Diário, sugestão e evidência confirmada em `docs/reviews/fase-4-diario-evidencias/`.
- Fase 5: Biblioteca em 1024/1280/1440/1920 e detalhe Provas em `docs/reviews/fase-5-biblioteca-evidencias/`.
- Fase 6: Início em 1024/1280/1440/1920 e Score em `docs/qa/fase-6/`.
- Fase 8: Biblioteca e Currículo em produção em `docs/qa/fase-8/`.
- Fase 9: nenhuma captura ainda; depende de Yan autenticar com Microsoft para gerar as evidências em 1024/1280/1440/1920px.

Na Fase 3, 1280×720 foi capturado de forma automatizada. Yan ainda precisa avaliar manualmente 1024, 1440 e 1920px.

As capturas podem conter o e-mail profissional usado no teste e texto do Daily Log. Antes de publicar o repositório ou compartilhar as imagens externamente, revisar e redigir dados que não sejam necessários para a evidência.

## 8. Limitações e pendências reais

- avaliação visual complementar da Fase 3 em 1024/1440/1920px não foi registrada;
- o lembrete é persistido, mas não envia notificação;
- Artefatos está publicado e aprovado; a Fase 9 (Configurações) está implementada e validada tecnicamente em local, mas a migração não foi aplicada ao Supabase real, falta o teste RLS com dois usuários e falta a Sessão de Avaliação Visual — ainda não é uma fase concluída;
- Credibilidade permanece indisponível e fora do Score;
- Coerência assistida exige 5 evidências, 2 contextos e 3 competências e só roda sob demanda;
- provas por arquivo e Supabase Storage foram deliberadamente adiadas; a Fase 5 aceita somente links HTTP/HTTPS;
- o nível Validada/Certificada permanece indisponível sem mecanismo externo real;
- Termos e Privacidade são provisórios e precisam de revisão jurídica antes de uso externo real;
- o Xisto/mascote não tem linguagem final aprovada;
- o repositório Git local acompanha `origin/main` no GitHub;

## 9. Diagnósticos já resolvidos

1. Porta `3000` estava ocupada por outro projeto; Persona usa `3100`.
2. O Microsoft Entra retornou secret inválido; um novo Secret Value foi configurado no Supabase.
3. O callback perdia o verificador PKCE; cookies passaram a ser propagados nos redirects de Route Handlers.
4. Next.js 16 rejeitou um objeto exportado por arquivo `"use server"`; o estado inicial foi movido para o componente cliente.

Evite reabrir esses problemas sem evidência atual.

## 10. Estado do Git

- repositório local inicializado em 10/08/2026;
- branch: `main`;
- autor usa a configuração Git global já existente de Yan;
- primeiro snapshot inclui as Fases 1–3 e a rede de handoff;
- primeiro commit: `d47fde0 docs: establish project handoff and execution log`;
- remoto `origin`: `https://github.com/yan1405/persona_mvp_V2.git`;
- branch local `main` acompanha `origin/main`;
- primeiro push concluído em 10/08/2026;
- repositório de destino: `https://github.com/yan1405/persona_mvp_V2`.

Para confirmar sincronização, execute `git status --short --branch` e `git log -1 --oneline`. Não trocar o remoto sem autorização explícita de Yan.

## 11. Próxima ação permitida

1. Yan autentica localmente (`http://localhost:3100`, porta `3100`) e percorre `/app/configuracoes`, `/app/configuracoes/dados` e `/app/configuracoes/conta` para a Sessão de Avaliação Visual em 1024/1280/1440/1920px;
2. com autorização explícita e imediatamente antes da ação, aplicar `supabase/migrations/20260818200000_phase_9_settings.sql` ao projeto `persona-mvp-v2` e executar o teste SQL com dois usuários exigido pelo contrato (seção 7 de `docs/plans/2026-08-30-fase-9-configuracoes-privacidade-design.md`);
3. só depois da migração aplicada é possível testar a exclusão permanente ponta a ponta — usar exclusivamente uma conta descartável explicitamente autorizada, nunca a conta principal de Yan nem os registros `QA Fase 8`;
4. não remover os registros fictícios `QA Fase 8` sem confirmação explícita;
5. atualizar `apps/web/.env.local` manualmente antes de testes locais que dependam da Groq; a produção está configurada;
6. não publicar a Fase 9 em produção nem iniciar a Fase 10 antes da aprovação visual explícita de Yan.
