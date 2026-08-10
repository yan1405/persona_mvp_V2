# Estado atual verificável

> Snapshot: 10/08/2026  
> Pasta: `C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2`  
> Próximo gate: configurar e validar Groq, concluir QA visual e avaliar a Fase 4

## 1. Resumo executivo

O projeto possui autenticação Microsoft real, onboarding persistente e o núcleo do Diário com revisão manual de evidências. A fronteira Groq está implementada no servidor, mas nenhuma chave foi configurada e nenhuma chamada real foi realizada.

| Fase | Estado | Evidência |
|---|---|---|
| 0 — governança e arquitetura | aprovada | `AGENTS.md`, briefings e arquitetura |
| 1 — fundação e entrada | aprovada | `docs/reviews/fase-1-fundacao.md` |
| 2 — autenticação Microsoft | aprovada | `docs/reviews/fase-2-autenticacao.md` |
| 3 — onboarding funcional | aprovada para avanço | `docs/reviews/fase-3-onboarding.md` |
| 4 — Diário e estruturação assistida | em execução; núcleo manual validado | `docs/reviews/fase-4-diario-evidencias.md` |

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
- `/app/inicio` — entrada autenticada e acesso ao Diário;
- `/app/diario` — captura, busca, filtros e histórico;
- `/app/diario/[id]` — registro, sugestões, revisão e confirmação.

As outras rotas presentes no mapa de informação ainda são planejamento e não existem no código.

## 3. Dados existentes no Supabase

Projeto: `persona-mvp-v2`. Referência pública do projeto: `pnztzmobiwlblzxcqjna`.

Migrações aplicadas:

```text
supabase/migrations/20260810190000_phase_3_onboarding.sql
supabase/migrations/20260810230000_phase_4_diary_evidences.sql
```

Objetos criados:

- `public.profiles`;
- `public.daily_logs`;
- `public.evidence_suggestions`;
- `public.evidences`;
- função `public.complete_onboarding(...)`;
- função `public.confirm_evidence_suggestion(uuid)`;
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
- o SDK Groq e o schema estrito estão implementados somente no servidor;
- Groq não foi configurada e nenhuma chamada real foi realizada.

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

Executada após o primeiro bloco da Fase 4:

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           11/11 testes aprovados
npm.cmd run build      aprovado
```

Fluxos validados:

```text
Microsoft → /onboarding → função transacional no Supabase → /app/inicio
SQL transacional com rollback → log → sugestão manual → confirmação → evidência → isolamento RLS
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
- Biblioteca de Evidências, Persona Live, Artefatos e Configurações ainda não existem;
- Narrative Score ainda não é calculado;
- não há chamada real de IA até a configuração da chave Groq;
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

1. solicitar que Yan configure `GROQ_API_KEY` diretamente em `apps/web/.env.local`, sem enviar a chave no chat;
2. reiniciar o servidor e validar uma chamada real com schema estrito;
3. concluir o fluxo autenticado `log → sugestão → revisão → evidência` no navegador;
4. capturar as larguras obrigatórias e executar as revisões visual e Ponytail;
5. atualizar o log, criar o commit final da Fase 4, enviar ao GitHub e apresentar o gate a Yan.
