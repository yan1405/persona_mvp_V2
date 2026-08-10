# Estado atual verificável

> Snapshot: 10/08/2026  
> Pasta: `C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2`  
> Próximo gate: implementação e avaliação da Fase 4

## 1. Resumo executivo

O projeto saiu da fundação e já possui autenticação Microsoft real, onboarding persistente e uma primeira tela autenticada. O ciclo completo de IA ainda não foi iniciado.

| Fase | Estado | Evidência |
|---|---|---|
| 0 — governança e arquitetura | aprovada | `AGENTS.md`, briefings e arquitetura |
| 1 — fundação e entrada | aprovada | `docs/reviews/fase-1-fundacao.md` |
| 2 — autenticação Microsoft | aprovada | `docs/reviews/fase-2-autenticacao.md` |
| 3 — onboarding funcional | aprovada para avanço | `docs/reviews/fase-3-onboarding.md` |
| 4 — Diário e estruturação assistida | autorizada; design registrado | `docs/plans/2026-08-10-fase-4-diario-estruturacao-design.md` |

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
- `/app/inicio` — confirmação do primeiro registro e score insuficiente.

As outras rotas presentes no mapa de informação ainda são planejamento e não existem no código.

## 3. Dados existentes no Supabase

Projeto: `persona-mvp-v2`. Referência pública do projeto: `pnztzmobiwlblzxcqjna`.

Migração aplicada:

```text
supabase/migrations/20260810190000_phase_3_onboarding.sql
```

Objetos criados:

- `public.profiles`;
- `public.daily_logs`;
- função `public.complete_onboarding(...)`;
- políticas de seleção, inserção e atualização do próprio perfil;
- políticas de seleção, inserção, atualização e exclusão dos próprios logs;
- RLS habilitada nas duas tabelas.

O fluxo real gravou um perfil e um primeiro Daily Log para a conta de teste. Não apagar, exportar ou alterar esse dado por SQL sem autorização de Yan. O produto pode sobrescrever o primeiro log de onboarding de forma idempotente pelo `entry_key = 'onboarding-first'`.

## 4. Autenticação e credenciais

- Supabase Auth com provedor Microsoft Azure está funcional;
- OAuth Authorization Code + PKCE foi validado de ponta a ponta;
- `tenant = common` atende contas pessoais, profissionais e educacionais;
- o Client Secret atual fica no painel do Supabase, nunca no repositório;
- validade registrada do secret atual: 06/02/2027;
- `.env.local` contém apenas configuração local e está ignorado pelo Git;
- `service_role` não foi usada;
- Groq não foi configurada e nenhuma chave foi solicitada.

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
| Gerenciador | npm |
| Porta local | 3100 |

Não há shadcn/ui instalado, biblioteca de ícones, Groq SDK, Vitest ou Playwright como dependência neste snapshot. O plano técnico cita essas ferramentas, mas apenas as dependências presentes em `package.json` são fatos atuais.

## 6. Validação mais recente

Executada após a Fase 3:

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           4/4 testes aprovados
npm.cmd run build      aprovado
```

Fluxo real validado:

```text
Microsoft → /onboarding → função transacional no Supabase → /app/inicio
```

O servidor foi reiniciado em `http://localhost:3100`. Esse processo é efêmero; uma IA futura deve verificar a porta antes de afirmar que o app está rodando.

## 7. Evidências visuais existentes

- Fase 1: quatro larguras em `docs/reviews/fase-1-fundacao/`;
- Fase 2: configuração e estado autenticado em `docs/reviews/fase-2-autenticacao/`;
- Fase 3: contexto, primeiro Daily Log e Início em `docs/reviews/fase-3-onboarding/`.

Na Fase 3, 1280×720 foi capturado de forma automatizada. Yan ainda precisa avaliar manualmente 1024, 1440 e 1920px.

As capturas podem conter o e-mail profissional usado no teste e texto do Daily Log. Antes de publicar o repositório ou compartilhar as imagens externamente, revisar e redigir dados que não sejam necessários para a evidência.

## 8. Limitações e pendências reais

- avaliação visual complementar da Fase 3 em 1024/1440/1920px não foi registrada;
- o lembrete é persistido, mas não envia notificação;
- `/app/inicio` ainda é o estado mínimo pós-onboarding, não o dashboard completo;
- Diário, Evidências, Persona Live, Artefatos e Configurações ainda não existem;
- Narrative Score ainda não é calculado;
- não há chamada de IA;
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

1. implementar a Fase 4 conforme o design técnico versionado;
2. fechar a fronteira server-only e os testes sem incluir segredo;
3. solicitar a chave da Groq apenas imediatamente antes de configurar a primeira chamada real;
4. validar o ciclo `log → sugestão → revisão → evidência`;
5. apresentar screenshots, testes e limitações a Yan antes da Fase 5.
