# Handoff do Orquestrador Central do Persona — 11/11/2026

Documento para outra IA assumir o papel de **Persona — Orquestrador Central** exatamente de onde o anterior parou. Escrito às ~11/11/2026 (tarde). Leia inteiro antes de agir. Idioma de trabalho: **português do Brasil**. Usuário: **Yan** (yansilva@crescitech.com.br), coordena o Persona (produto do concurso Senac). Pronomes de Yan: use "você" ao falar com ele; para terceiros, neutro.

---

## 0. Como começar (ordem)

1. `git pull --ff-only` em `C:\Users\yansi\OneDrive\persona-contexto` (cofre/memória de longo prazo). Ler `00 COMECE AQUI.md` e, se existir, o `CLAUDE.md`/`AGENTS.md` do cofre; ler `40-Projects/2026/Persona/Log de Sessoes.md` (última entrada: 11/11/2026).
2. Ler no repositório `C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2`: `AGENTES/PROTOCOLO.md`, `AGENTES/STATUS.md`, `AGENTES/00_orquestrador/STATUS.md`, `AGENTES/00_orquestrador/AUDITORIA_DESIGN_SYSTEM.md`, `AGENTES/ATRIBUICOES/LOTE-2_CONGELADO.md` (SHAs congelados por rodada), `AGENTES/ATRIBUICOES/LOTE-10.md`, `LOTE-11.md`, `LOTE-12.md`, e o relatório mais recente em `AGENTES/04_verificacao/`.
3. Confirmar o estado **real** do Git antes de qualquer decisão (secção 3). A memória não é prova de implementação.
4. Falar com Yan sempre em português, curto, e **informar o percentual de cada agente** em toda resposta de status (secção 9).

## 1. Papel e regras permanentes (valem acima de qualquer sugestão)

Você é o Orquestrador: coordena 4 agentes, congela SHAs, aciona a Verificação, pede autorização a Yan e integra. **Nunca aprova o próprio resultado; nunca corrige o trabalho da Verificação; não edita `AGENTES/` de outro papel** (exceto registros de coordenação do Orquestrador: `AGENTES/00_orquestrador/**`, `AGENTES/ATRIBUICOES/**`, `LOTE-2_CONGELADO.md`, relatórios da Verificação que ela deixou na `main`).

Regras de Yan, permanentes:
- **Sem push** para `main` ou qualquer branch, **exceto** a exceção abaixo; sem merge em `main` além de **fast-forward local autorizado por Yan**; **sem deploy/Preview/Production por conta própria**; sem migração; **nenhum SQL executado por você** (Yan roda no painel); **nunca colar chave/segredo** em chat ou arquivo (Yan coloca chaves direto no painel da Vercel/Supabase).
- **Exceção autorizada (11/11/2026):** Yan autorizou enviar a `main` local **somente** para a branch **`preview/reconstrucao-ds`** (`git push origin main:refs/heads/preview/reconstrucao-ds`) para gerar Preview na Vercel; interpretação: "você manda o commit e a Vercel atualiza". **Nunca para `origin/main`** (push em `main` = Production; Production não tem `NVIDIA_API_KEY`; repositório GitHub público `yan1405/persona_mvp_V2`). Avise Yan a cada envio; em dúvida, pergunte. (Está também na memória automática do Claude: `project-preview-vercel-branch.md`.)
- **Sempre pedir autorização explícita de Yan antes de integrar cada lote na `main` local.**
- Banco: só o **QA isolado** (`nzzqxbpmrmozlamdmxva`), contas descartáveis; nunca conta pessoal; sem chamada a provedor real (LLM) pelos agentes de código.
- **Todo uso de LLM passa a ser a API NVIDIA** (ADR "NVIDIA único", G0 aceito). Exceção temporária: **Artefatos ainda usa Groq** (M4); não alterar aqui.
- Commits: trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` (ajuste ao seu modelo se a plataforma disser outro); sessões dos agentes recebem `/ponytail full` na primeira linha da mensagem.
- Push do **cofre** (`persona-contexto`) só quando Yan pedir, e só do cofre. Em conflito/falha de autenticação: preserve os dois lados, não force, avise Yan.
- Lembrar Yan das pendências (secção 7). Sempre informar percentual por agente (secção 9).
- Não commitar `docs/qa/fase-9/qa-1-schema-fases-3-a-9.sql`, `qa-2-…`, `qa-3-…`, `qa-4-teste-rls-preenchido.sql` (**untracked de propósito**; `qa-4` contém os UUIDs das contas de QA). Nunca `git add -A` na `main` sem olhar `git status`.

## 2. Equipe de agentes (sessões do app, "segundas conversas")

| Papel | Nome | Session ID | Worktree / branch |
|---|---|---|---|
| 01 Interface | `p2-interface` | `local_9f4ecc8f-66e2-4616-8b4b-326120fa6968` | `C:\Users\yansi\Projetos\persona-wt\lote2-interface` · `wt/interface-lote2` |
| 02 Backend | `p2-backend` | `local_b98615f9-4696-4ad0-8b86-25ffe89dd746` | `…\lote2-backend` · `wt/backend-lote2` (`173a265`) |
| 03 Agente NVIDIA | `p2-agente` | `local_a8770f11-14fc-4da8-88fa-25d7797eb5be` | `…\lote2-agente` · `wt/agente-lote2` (`b5ba5149216ceff1f29359356be43958448a8798`) |
| 04 Verificação | `p2-verificacao` | `local_d4c3f754-f189-49fd-8ff1-d4c6b5a5f9cf` | `…\verificacao-lote2` (desanexado; **devolver sempre a `a5a18aa`**) |
| Integração | — | — | `…\integracao-lote2` · `integracao/lote2` (`488cfab`) |

(Existem também sessões antigas `lote2-*`; ignore.) Enviar mensagem: `mcp__ccd_session_mgmt__send_message` (`session_id`, `message`). Às vezes "queued/undelivered" (sessão ocupada ou limite de uso): a mensagem é entregue depois; confira com `list_events`. Ler resultado: `list_events` / `get_session`. Quando uma sessão termina, chega um aviso automático.

## 3. Estado do Git (conferir de novo antes de agir)

- Repositório: `C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2` (monorepo; app em `apps/web`, Next.js 16 + Supabase). A sessão do Orquestrador anterior tinha `cwd` no worktree `…\.claude\worktrees\audit-new-agent-project-bea2dd` (branch `claude/audit-new-agent-project-bea2dd`, antigo, em `06de045`); **escreva na checkout principal** (`…\persona_mvp_v2`) para docs de coordenação. Heredoc grande com aspas já quebrou no bash: use Write em um arquivo temporário e `cp`.
- **`main` local:** `880e5f1` ("docs(verificacao): relatorio do Lote 10 rodada A (I10-1 e I10-2 retidos)"), ~188 commits à frente de `origin/main`. Conteúdo de código na `main` = até o **Lote 9 integrado** (`014ccaa`); depois só commits de documentação (atribuições, congelamentos, relatório).
- **`origin/main`:** `06de045` = **Production** (app antigo, Groq). **Nunca tocar.**
- **`origin/preview/reconstrucao-ds`:** `c88f304` (Preview enviado 11/11; deploy `dpl_ByozSDmkx3yTq4G2BMLHq1xTnKee`, READY, URL `https://persona-mvp-v2-51dme8b6b-yanguiilhermed42-1689s-projects.vercel.app`). Contém Lote 9 integrado + atribuição do Lote 10; **não** contém Lotes 10–12.
- **Branch da Interface `wt/interface-lote2`:** HEAD `0c96ed0` (M-2) + arquivos **não commitados** `app/error.tsx`, `app/app/error.tsx`, `app/not-found.tsx` (M-3 em andamento). Já tem merges de `main` (`2ec0b61`, `32493a3`).
- Fluxo de integração (modelo: merges `aa09eaf`/`488cfab` do Lote 9): no worktree `integracao-lote2` fazer merge `--no-ff` **por SHA verificado** da branch do escritor (não do topo, se o topo tiver trabalho não verificado), rodar os gates (`npm test`, lint, `npx tsc --noEmit`, `npm run build`, `git diff --check`, varredura de segredo), e só então `--ff-only` na `main` (no checkout principal, `git merge --ff-only integracao/lote2`). Inspecione `git log` de `integracao/lote2` e como ela se relaciona com a `main` atual (a `main` está à frente com docs; pode ser necessário `git merge main` em `integracao/lote2` antes). **Peça "sim" a Yan antes.**

## 4. O que já foi feito (cronologia resumida)

1. Lotes 1–6 integrados (fundação, Live na NVIDIA, parser, barreira ESLint contra núcleo LLM no cliente, etc.). Lote 6 integrado a pedido de Yan ("Sim autorizo…").
2. Itens de Yan 5/6/7/8/11/12 ("vamos finalizar"): item **6 — banco de QA** criado (`nzzqxbpmrmozlamdmxva`); scripts `docs/qa/fase-9/qa-1..4`; B-1 aplicado no QA.
3. **Login de QA local (Lote 7):** gate `lib/auth/qa-login-gate.ts` (só `PERSONA_QA_PASSWORD_LOGIN==="1"`, `NODE_ENV!=="production"`, sem `VERCEL*`, host exatamente `localhost`/`127.0.0.1`/`[::1]`); rota `POST /auth/qa-entrar` (destino `/onboarding`, origem do redirect vinda do Host). Usar sempre `http://localhost:3100`.
4. **Yan exigiu exclusão total do design antigo e reconstrução sobre o Design System do Claude Design** ("Sim, reconstruir"). Auditoria em `AGENTES/00_orquestrador/AUDITORIA_DESIGN_SYSTEM.md`; cópia do DS em `docs/redesign/design-system/` (`b16a8b0`).
5. **Lote 8** integrado: núcleo do DS (`apps/web/components/ds/`, `app/ds.css`, galeria `/dev/ds` com 404 em produção, gate de aderência) + correção do redirect aberto S3 (`getSafeNextPath`, BK4-1).
6. **Lote 9** integrado (main `014ccaa`): casca (`AppShell/Sidebar/AppHeader`), `/entrar`, `/onboarding`, `/auth/erro`, `/termos`, `/privacidade`; rodadas 2 e 3 por contraste/gaveta/regressões. Resíduo C9-12 (2 títulos de painel do Diário) aceito até Lotes 10–12 (**fechado no Lote 10**).
7. **Item 7 (verificação B-1):** QA — `authorize_sensitive_action(text)` e `delete_own_account(text)`: `anon=false`, `authenticated=true`, `public=false`, `conforme=true`; 2 funções. `qa-4` voltou "confere" (relato de Yan; NOTICEs e passo 8/R1 não vistos). `pg_default_acl` do `postgres` em `public` ainda concede `anon=X` (funções futuras nascem abertas; **decisão de Yan pendente**). **Produção** (`pnztzmobiwlblzxcqjna`): as 15 tabelas das fases 3–9 existem; `delete_own_account` não executável por `anon` (checado só por nomes, não coluna a coluna).
8. **Item 8 (NVIDIA):** modelo `z-ai/glm-5.3-flash` (default em `lib/live/nvidia-client.ts`, aprovado só para o Live; qualidade para Score/Diário **PENDING**, teste G2 pendente). Yan revogou a chave antiga e colocou a nova só em **Preview** (sensitive). `NVIDIA_MODEL` não existe (opcional). Production **sem** `NVIDIA_API_KEY` (de propósito).
9. **Preview na Vercel (11/11):** Yan decidiu que o aceite visual é pela Vercel (reta final). Banco do Preview = **produção** (envs de Preview apontam para ele; único com login Microsoft). Yan adicionou o domínio do Preview em Redirect URLs do Supabase de produção ("Feito, confere").
10. **Lote 10** (Início, Diário, Evidências): entregue em duas rodadas e congelado; **Rodada A verificada** (relatório `RELATORIO_interface_lote10A_d0d3225.md`): ver secção 5.
11. **Lote 11** (Live, Score, Artefatos): entregue em duas rodadas e congelado; **aguardando verificação**.
12. **Cofre:** entrada de 11/11/2026 em `Log de Sessoes.md` (commit `f864aff`, **local, sem push**).

## 5. O que está em andamento AGORA

### 5.1 SHAs congelados (Interface, branch `wt/interface-lote2`)
Ver `LOTE-2_CONGELADO.md`. Resumo:
- **Lote 10 A:** I-1 `e65813b9ada150b426708b8ea15c1e371569210e`, I-2 `5ac6dcfc2cb349745d71d354dd6eeef6dd1d8c08`, I-3 `bdec7b34e57938b580b0cfd8b191446da6e133a7`, STATUS `d0d32257410e5ee76b94ebea728b4287ad85f421`.
- **Lote 10 B:** I-4 `8846441967e59d04eb50a9c8b2a03d8bbc05a4ff`, I-5 `d6501a610cb6c1e2c074f7f32a4564559631f478`, I-6 `e0e97d0c395ac1c56a475ec80a794d79d366f410`, STATUS `7e40a777ec52bd817ad86159b920b804bb02dfd1`.
- **Lote 11 A:** L-1 `4fc0f3b8d5b66e0bccf2c7fb1c8bea37fce8f6a4`, L-2 `0fa2555467960174a3147bc27608831f8c304d98`, L-3 `a480ae131f45f51878f5f18a3c1295676ce5d360`, STATUS `6827d8697e123a8fb1c1150ba7a9f86dcded08d6`.
- **Lote 11 B:** L-4 `d165933b64ce0e69a7f5313a5f335d86afb18464`, L-5 `6f2ecbcc3f88ef68e3ad50607d73e77d44509e75`, STATUS `4ae44bb89cd143ec53ec42830218ff485c9a9264`.
- **Lote 12 (NÃO congelado ainda):** M-1 `c8ab536` (Diagnóstico com `StepFlow`), M-2 `0c96ed0` (Configurações), M-3 em curso (não commitado), M-4 (remover legado) e M-5 (varredura final) pendentes. Copie os SHAs completos de `git log` antes de congelar.

### 5.2 Verificação (`p2-verificacao`)
- **Lote 10 A — relatório pronto e commitado** (`880e5f1`): gate sugerido: I-1 e I-2 "liberar com ressalvas"; **I-3 "reter até corrigir"**; veredito: **não integrar ainda**. Achados: **I10-1 (S3)** o foco não volta ao cartão ao fechar o painel com Esc (falha em 5 de 7; `diary-panel.tsx` usa `router.replace` + `setTimeout(50)`); **I10-2 (S3)** abrir/fechar painel a partir de lista filtrada perde os filtros; S4: I10-3 (classes legadas até o I-6), I10-4 (checkbox 13×13), I10-5 (Início sem "Para revisar"/"Atividade recente"), I10-6 (painel sem `SectionIndex`/`TraceLine`/"Texto original"), I10-7 (sem `aria-modal`), I10-8 (sem testes novos). Execução independente: 50/50 saídas 0; `npm test` 149/149.
- **Importante:** a Verificação **não usou** o login de QA nem o servidor de Yan; subiu um **Supabase fictício local** (stub). Logo, I10-1/I10-2 e as ações reais com RLS **precisam ser repetidos por quem tem a conta de QA (Yan)** no banco real.
- **Fila da Verificação (mensagens já enviadas, ainda não entregues/concluídas):** Lote 10 B (I-4, I-5, I-6) → Lote 11 A → Lote 11 B. Depois, Lote 12 (M-4/M-5 = auditoria de remoção do legado com grep independente e capturas de todas as telas). Ela estava terminando os gates do I-6.
- Relatórios aparecem **não rastreados na `main`** (`AGENTES/04_verificacao/RELATORIO_*.md`, `STATUS.md` modificado): commite-os (docs) como fiz no `880e5f1`, sem usar `-A`.

### 5.3 Interface (`p2-interface`)
- Mensagem enviada e **na fila** (entrega quando o turno atual acabar): **correção prioritária C10-1 e C10-2** (foco determinístico no fechamento do painel, sem `setTimeout` fixo, nos painéis do Diário **e** das Evidências; preservar filtros ao abrir/fechar nas duas listas; testes automáticos; corrigir I10-4 se barato), em **commits novos**, sem alterar SHAs congelados. Depois seguir o Lote 12 (M-3, M-4, M-5). L-C1 (logotipo oficial da Microsoft no botão "Entrar com Microsoft", C9-6) e L-C2 (`Count` com texto escuro sobre fundo claro, DS8-5) estão **condicionais**: só mandar aplicar quando Yan responder "seguir recomendações".
- Interface já aviou limite de uso apertado: pode parar no meio; entregar por rodadas.

### 5.4 Backend e Agente NVIDIA
Sem item aberto. Agente NVIDIA aguarda o teste real (G2) que **Yan** fará no Preview; qualquer ajuste de prompt/validação vem por você. Backend: reativar só se a Interface apontar dado faltante.

## 6. Próximos passos recomendados (ordem)

1. Garantir que a Interface recebeu e executou **C10-1/C10-2**; congelar a correção (SHAs completos + `LOTE-2_CONGELADO.md`) e pedir **re-verificação** (Lote 10 A reteste de I10-1/I10-2 e I-5, que usa o mesmo padrão).
2. Receber os relatórios do Lote 10 B, 11 A e 11 B (Verificação); para cada retenção S1–S3 enviar correção à Interface; S4 só registrar.
3. Quando Lotes 10 e 11 estiverem sem S1–S3 abertos: **pedir "sim" a Yan** para integrar na `main` local (merge `--no-ff` por SHA verificado em `integracao/lote2`, gates, `--ff-only`), depois **atualizar a branch de Preview** (`git push origin main:refs/heads/preview/reconstrucao-ds`, avisar Yan) para ele ver na Vercel.
4. Lote 12: congelar M-1..M-5 (inclui remoção do CSS antigo, `.ds-surface`, Carbon, Geist Mono, resíduos de `public/`, gate de aderência em `app/**` e `components/**`), verificar (auditoria de remoção), integrar e reenviar ao Preview. Aplicar L-C1/L-C2 se Yan confirmar.
5. Item 5 (aceite visual): **Yan** faz no Preview em 375/768/1024/1280 px (+ monitor largo em Configurações; foco por Tab no Diagnóstico).
6. Item 8: Yan faz o teste real (Live, Diário, Score) no Preview com dados **fictícios**; registrar resultado, avisos exatos e tempos (limite de duração da função na Vercel não medido). Se falhar, repassar ao Agente NVIDIA.
7. Item 11/12: publicação definitiva (plano `publico/limpo-2026-11-08` não executado vs repositório privado vs push na `main`). Antes de qualquer push na `main`: `NVIDIA_API_KEY` na Production (Yan põe no painel), migrações conferidas, varredura de segredo, decisão sobre o repositório público. Só com pedido explícito de Yan.
8. Registrar no cofre ao fim de cada marco (Log de Sessões; commit; `git pull --rebase`; push só se Yan pedir). Restaurar `apps/web/.env.local` de produção (`.env.local.producao.bak`) ao fim do QA e parar o dev server.

## 7. Pendências e decisões de Yan (lembrar sempre)

- **Item 5** aceite visual (depois dos Lotes 10–12, pela Vercel).
- **Item 7** (QA fechado; falta, se quiser rigor, o texto dos NOTICEs do `qa-4` e confirmar passo 8/R1).
- **Item 8** teste real G2 no Preview (dados fictícios) e revogação já feita; `NVIDIA_MODEL` opcional.
- **Item 11** publicação (plano limpo vs privado vs main) e **Item 12** (primeiro Preview: feito; falta validação de Yan e decisão do banco definitivo; Preview está em banco de produção).
- Decisões: **C9-6** logotipo da Microsoft no botão (recomendação: sim, logotipo oficial); **DS8-5** contraste do `Count` branco sobre verde/vermelho (recomendação: texto escuro sobre fundo claro, como diz o readme do DS) — Yan ainda **não** respondeu "seguir recomendações"; **default ACL `anon`** em `public` (funções futuras nascem abertas); desvios de acessibilidade A11/A12 do DS (foco e borda de campo; mantidos); telas sem mock (Entrar, Onboarding, Diagnóstico, Erro, Termos, Privacidade) derivadas dos componentes (Yan pode desenhar no Claude Design e o desenho dele prevalece).
- Supabase **produção**: B-1 em produção é decisão/ação de Yan (SQL no painel); você não executa SQL.

## 8. Fatos do ambiente que evitam retrabalho

- **Design System (DS):** Indigo + Slate claro; Plus Jakarta Sans + Inter; sem mono; raios 16/22/28/pílula; **um botão brand por tela; no máximo um bloco escuro (focal) por tela**; cartões brancos sem borda colorida à esquerda; títulos terminam com ponto; Lucide embutido no `Icon` (sem dependência); **sem tabela e sem aba**; detalhes em painel flutuante ancorado; **Agente Persona NÃO implementado** (nenhum botão/painel/texto que o afirme); nenhum hex/px literal; Live/Artefatos sem chat aberto. Fonte: `docs/redesign/design-system/` (`readme.md`, `components/**`, `prototipos-t4/`, `_adherence.oxlintrc.json`). Tokens `--ds-*` em `apps/web/app/ds.css`; componentes em `apps/web/components/ds/`; galeria `/dev/ds` (404 em produção/Vercel).
- **Legado a remover no Lote 12:** `app/globals.css` (4.369 linhas), `.ds-surface`, `/dev/ds/legado`, `@carbon/icons-react` (restava em `configuracoes/settings-navigation.tsx`), Geist Mono em `app/layout.tsx`, `public/{file,globe,next,vercel,window}.svg`.
- **Vercel:** projeto `persona-mvp-v2`, team `team_tqV9G0kAT5xqHcaWQxJpVwXi`. Envs: `NEXT_PUBLIC_SUPABASE_URL/ANON_KEY` e `GROQ_API_KEY/MODEL` (production+preview, banco de produção); `NVIDIA_API_KEY` (preview only). Push em `main` = Production. Consultas úteis: `list_deployments`, `filter_project_envs` (sem decrypt).
- **Supabase:** QA `nzzqxbpmrmozlamdmxva` (contas `qa-a@gmail.com.br`/`qa@gmail.com.br`, descartáveis); produção `pnztzmobiwlblzxcqjna`. Migrações fases 3–9 + B-1 (`supabase/migrations/20261108120000_b1_revoke_anon_execute.sql`). Aplicadas pelo SQL Editor (a tela Migrations do Supabase aparece vazia por isso).
- **Dev server local** (shell em background `b0wok4xec`): `cd apps/web && npx next dev --port 3100 -H 127.0.0.1` a partir da checkout principal, com `.env.local` apontando para o QA e `PERSONA_QA_PASSWORD_LOGIN=1` (`.env.local.producao.bak` guarda o original). Mostra o código da `main` (Lote 9), **não** os Lotes 10–12. Se precisar reiniciar: `TaskStop`, e `taskkill //PID <pid> //F` se a instância antiga ficar viva.
- **Prompts anti-alucinação já existem** (Live, Score, Diário/estruturar): "usar exclusivamente fatos literais", "não invente", dados do usuário tratados como não confiáveis, JSON Schema, temperatura baixa; `parseLiveResponse` valida citações contra as evidências; o Score só confere IDs. Eficácia real com o modelo **PENDING** (teste G2). Ofereci pedir ao Agente NVIDIA um relatório das validações e casos adversariais (evidência sem resultado, pedido para inventar número, instrução escondida no relato): Yan não respondeu.
- **Windows/Git Bash:** `gh` não está instalado; use `git`. Foreground `sleep` é bloqueado; avisos CRLF são normais.

## 9. Formato de resposta a Yan (preservar)

Português, curto, direto, com: o que aconteceu; o que ficou pendente; **percentual por agente** (último valor: Orquestrador 93%, Agente NVIDIA 92%, Verificação 90%, Backend 88%, Plataforma 88%, Interface 92%); pendências de Yan (secção 7). Peça autorização explícita antes de ações externas ou de integrar. Não afirme "VERIFIED" sem evidência medida; use rótulos VERIFIED/HYPOTHESIS/PENDING e severidades S1–S4 como nos relatórios. Gate sugerido da Verificação ≠ aprovação; o aceite visual é de Yan.

## 10. Armadilhas conhecidas

- A Verificação reteve o que o escritor julgou pronto (I-3, Lote 9): **sempre** espere o relatório antes de integrar.
- Mensagens a sessões podem ficar "queued": não reenvie em duplicidade sem checar `list_events`.
- Divergência não fast-forward no worktree da Interface (docs na `main`): usar `git merge main` (sem rebase, para preservar SHAs verificados).
- Não misture `localhost` e `127.0.0.1` no login de QA (cookie por host).
- Subir branch de Preview expõe 188 commits ao repositório **público**: a varredura de segredo de 11/11 não achou segredo real, mas refaça a varredura antes de cada novo envio e confirme que `qa-*.sql` continuam fora do Git.

---

## Adendo (11/11/2026, após o handoff)

- **Lote 12 rodada A congelada** (`LOTE-2_CONGELADO.md`, main `c5ef2b4`): M-1 `c8ab536e6887c1430cbc4582614dbd1d8ff2c9c4`, M-2 `0c96ed079e7378e3b1e4cbc9f765f1d7c088da08`, M-3 `c106c844df4a6cefe5dec698361e40bfc7d5e3f1`, STATUS `c1a949cdf476da077631fa1d643d7c276cf2c839`. A Interface foi instruída a fazer **primeiro C10-1/C10-2** (correções do Lote 10) e só depois M-4/M-5 (rodada B). Mensagens à Interface e à Verificação estão "queued" (entregues quando o turno atual de cada uma acabar).
- Fila da Verificação: Lote 10 B → Lote 11 A → Lote 11 B → Lote 12 A → re-verificação das correções C10-1/C10-2.
- Main local atual: `c5ef2b4` (só docs além do Lote 9).

---

## Adendo 2 (11/11/2026, ~14h30; análise feita com o limite do Orquestrador quase esgotado)

**Mudanças feitas fora do fluxo do Orquestrador (por Yan e/ou outra IA); confirme tudo antes de agir:**
1. **Nova branch remota `origin/preview/persona-lote12`** (`ef2db9872d57faef19172716c30537b564e5430f`, autor `yan1405`): = branch da Interface até `560608b` (Lotes 10, 11, 12 inteiros, **incluindo a correção `003261e` e M-4/M-5, ainda NÃO verificados pela Verificação**) + 1 commit `ef2db98` "Enable opt-in QA password login on Vercel previews" (altera `lib/auth/qa-login-gate.ts`, `app/auth/qa-entrar/route.ts`, `app/entrar/page.tsx`, `qa-login-gate.test.ts`). Relatórios da Verificação existentes: Lote 10 A (I10-1/I10-2 S3) e Lote 10 B (`RELATORIO_interface_lote10B_7e40a77.md`: I10B-1 foco 6/7 e I10B-2 filtros, S3, ambos já endereçados pela correção `003261e`, **não re-verificada**); Lotes 11 e 12 sem relatório. Deploys Preview `dpl_5nn7gfhg…` (560608b) e `dpl_6HAsoxNd…`/`dpl_J5HjXtzu…` (ef2db98), todos READY.
2. **O commit `ef2db98` afrouxa o gate do login de QA (Lote 7) para Preview:** só liga se `VERCEL_ENV==="preview"` **e** `PERSONA_QA_PREVIEW_LOGIN=1` **e** `PERSONA_QA_PREVIEW_EMAIL` definido **e** `VERCEL_URL` definido **e** `Host === VERCEL_URL`; a rota exige cabeçalho `Origin` igual a `https://${VERCEL_URL}` (403 senão) e **só aceita o e-mail configurado**. As duas envs existem na Vercel apenas para o branch `preview/persona-lote12` (sensitive). Produção (`VERCEL_ENV=production`) continua desligada. **Risco/atenção:** o Preview usa o **banco de PRODUÇÃO**; esse login por senha entra numa conta do banco de produção. Recomendar a Yan uma conta descartável dedicada (não pessoal), remover as duas envs e a conta ao fim do QA, e mandar a Verificação auditar `ef2db98` (S1–S4) antes de qualquer integração. Esta mudança NÃO está em nenhuma branch do Orquestrador; a `main` local não a contém.
3. **Produção da Vercel foi promovida para o código da reconstrução:** o deployment `dpl_HkPZ6xfdWgni3eG6CZu2FPvUdX5e` (`source: redeploy`, `target: production`, commit `c88f304`) tem os aliases `persona-mvp-v2.vercel.app` e `persona-mvp-v2-yanguiilhermed42-1689s-projects.vercel.app`. Ou seja, **a Production (alias principal) hoje serve `c88f304`** (Lote 9: casca/entrada novas + código NVIDIA), e **não** tem `NVIDIA_API_KEY` (só Preview tem): Live, Score e Diário (NVIDIA) devem falhar com aviso de não configurado em produção. O projeto tem `ssoProtection` ativo (`all_except_custom_domains`), o que reduz a exposição pública. Alguém (provavelmente Yan, pelo painel "Redeploy/Promote") fez isso; **pergunte a Yan se foi intencional**; se não foi, o caminho de retorno é promover/redeploy do deployment `dpl_3SVwqdfD7WJjgMYnhtyFWXzpehF6` (`06de045`, produção anterior) e/ou adicionar `NVIDIA_API_KEY` em Production (Yan faz no painel). Você não promove nem faz deploy.
4. `origin/main` continua `06de045`; `origin/preview/reconstrucao-ds` continua `c88f304`. `main` local `c8b5f58` + este commit.
5. **M-4 e M-5 (`808ab07`, `53fe3d1`, `560608b`) foram commitados por outra sessão no mesmo worktree da Interface**, não pela `p2-interface`; trailer presente; conteúdo reconferido pela Interface (153/153, lint 0, tsc 0, build 0). Causa provável: a mesma "outra AI" de Yan. Trate o conjunto como não verificado.
6. A sessão `p2-verificacao` foi interrompida ("Request interrupted by user", erro após poucos turnos) antes de concluir o Lote 12 B; reenvie a fila se ela estiver parada: Lote 10 correção `003261e` → Lote 11 A/B → Lote 12 A (`c8ab536…`, `0c96ed0…`, `c106c84…`) → Lote 12 B (`808ab07…`, `53fe3d1…`, `560608b…`) → `ef2db98`.
