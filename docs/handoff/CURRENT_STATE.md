# Estado atual verificável

> Snapshot: 12/08/2026
> Pasta: `C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2`  
> Próximo gate: deploy autorizado da Fase 7 na Vercel e validação autenticada no endereço publicado

## 1. Resumo executivo

O projeto possui autenticação Microsoft real, onboarding persistente e os ciclos completos das Fases 4–7. Yan autorizou o deploy da Fase 7 na Vercel em 12/08/2026. Persona Live é manual, baseado em evidências autorizadas, com argumentos e rascunho separados.

| Fase | Estado | Evidência |
|---|---|---|
| 0 — governança e arquitetura | aprovada | `AGENTS.md`, briefings e arquitetura |
| 1 — fundação e entrada | aprovada | `docs/reviews/fase-1-fundacao.md` |
| 2 — autenticação Microsoft | aprovada | `docs/reviews/fase-2-autenticacao.md` |
| 3 — onboarding funcional | aprovada para avanço | `docs/reviews/fase-3-onboarding.md` |
| 4 — Diário e estruturação assistida | aprovada em 11/08/2026 | `docs/reviews/fase-4-diario-evidencias.md` |
| 5 — Biblioteca de Evidências | aprovada em 11/08/2026 | `docs/reviews/fase-5-biblioteca-evidencias.md` |
| 6 — Início e Narrative Score | aprovada por Yan em 12/08/2026 | `docs/reviews/fase-6-narrative-score.md` |
| 7 — Persona Live manual | implementada e tecnicamente validada; deploy autorizado | `docs/reviews/fase-7-persona-live.md` |

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
```

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

Executada após a conclusão técnica da Fase 7:

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           26/26 testes aprovados
npm.cmd run build      aprovado
```

Fluxos validados:

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

Na Fase 3, 1280×720 foi capturado de forma automatizada. Yan ainda precisa avaliar manualmente 1024, 1440 e 1920px.

As capturas podem conter o e-mail profissional usado no teste e texto do Daily Log. Antes de publicar o repositório ou compartilhar as imagens externamente, revisar e redigir dados que não sejam necessários para a evidência.

## 8. Limitações e pendências reais

- avaliação visual complementar da Fase 3 em 1024/1440/1920px não foi registrada;
- o lembrete é persistido, mas não envia notificação;
- Artefatos e Configurações ainda não existem;
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

1. publicar a Fase 7 na Vercel com as variáveis server-only corretas;
2. registrar o endereço em Supabase Auth e validar Microsoft OAuth;
3. repetir o fluxo autenticado completo no endereço publicado;
4. registrar URL, resultado e limitações no handoff.
