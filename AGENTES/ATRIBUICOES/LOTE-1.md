# Lote 1 — Contratos e caracterização (sem mudança funcional do app)

Emitido pelo Orquestrador em 04/11/2026, com autorização de Yan. Base congelada: `8da08c698a74aeb4d95c70123eba61fc921a591c` (branch `baseline/2026-11-03`). Esta atribuição segue os seis itens de `AGENTES/PROTOCOLO.md`. Quem não tem papel aqui permanece em leitura.

## Regras comuns

- Trabalhe só no seu worktree e só nos caminhos de escrita abaixo. Qualquer outro arquivo é leitura.
- Sem merge, push, tag, deploy, mudança em `main` ou Production; sem `git add -A` fora dos seus caminhos.
- Proibidos sem gate do Orquestrador/Yan: `package.json`, lockfile, dependências, configurações globais (`next.config.ts`, `eslint.config.mjs`, `tsconfig.json`, `proxy.ts`), `globals.css`, navegação, `supabase/migrations/**`, banco compartilhado, `.env*`, segredos, ações destrutivas.
- Antes de `npm run typecheck` num worktree novo: `npx next typegen` (gera `LayoutProps`; sem isso o typecheck falha por falta de tipos, não por defeito).
- Não use `swarm`, SPARC nem `npx claude-flow|agentic-flow|ruflo` (bloqueados).
- Cada commit local no seu branch, mensagem `docs(...)`/`test(...)`/`feat(...)`, com o trailer de coautoria. Sem push: o Orquestrador integra.
- Fonte visual: `docs/design/approved/2026-11-03-t4/` (somente leitura; é especificação, não implementação). Comportamento real vale mais que o protótipo (`AGENTS.md` §3).
- Handoff final no seu `STATUS.md`: estado, arquivos alterados, comandos e resultados, evidências, riscos, decisões pendentes, bloqueio, próximo passo, porcentagem comprovada.

---

## 01 · Persona — Migração de Interface

1. **Objetivo e aceite.** Contrato de migração das telas aprovadas T4.1–T4.8 para o app real, **sem código de produto**. Aceite: arquivo `docs/redesign/interface/MAPA_TELAS.md` com, por tela, rota real existente (`apps/web/app/**`) ou ausente, componentes do protótipo (`fonte/t4/*.jsx`, `fonte/design-system/components`) → componente TSX proposto ou reutilizado, estados do protótipo, lacunas, arquivos compartilhados que a fatia tocaria (para o Orquestrador designar dono) e ordem sugerida de fatias; mais uma lista de **decisões para Yan**, no mínimo: fonte Plus Jakarta Sans + Inter (redesign) contra Geist (produto), Lucide (redesign) contra Carbon (`AGENTS.md` §8), painel do Agente (T4.8) sem backend, dados sintéticos de T4.
2. **Branch/worktree e escrita.** `wt/interface-lote1` em `C:\Users\yansi\Projetos\persona-wt\interface`. Escrita: `docs/redesign/interface/**` e `AGENTES/01_interface/STATUS.md`.
3. **Somente leitura.** `apps/web/**`, `docs/design/**`, `docs/handoff/**`, `docs/design/approved/2026-11-03-t4/**`, `supabase/**`.
4. **Dependências e compartilhados.** Nenhuma dependência. Não toca `globals.css`, navegação nem `package.json`; só os lista.
5. **Validações.** Cada rota e componente citado existe (conferir com `Glob`/`Grep`); toda afirmação sobre o protótipo cita arquivo e hash do manifesto; `git diff --check` limpo.
6. **Parada e gate.** Parar ao terminar o mapa ou ao precisar de decisão visual de Yan. Não implementar, não instalar fonte, não aprovar visual.

## 02 · Persona — Dados e Backend

1. **Objetivo e aceite.** (a) Matriz **tela × dados × ações × backend** para T4.1–T4.8: cada leitura, mutação e estado de T4 ligado à tabela, action, RPC ou lib real, ou marcado "inexistente" (ex.: Agente). (b) Revisar e, se necessário, **corrigir** `docs/qa/fase-9/teste-rls-dois-usuarios.sql` contra `supabase/migrations/20260818200000_phase_9_settings.sql` e as demais migrações. Aceite: `docs/redesign/backend/MATRIZ_TELA_DADOS.md` completa; relatório do teste RLS com o que foi checado por leitura, correções feitas e o que só um banco real prova; o script continua em transação com `rollback`.
2. **Branch/worktree e escrita.** `wt/backend-lote1` em `C:\Users\yansi\Projetos\persona-wt\backend`. Escrita: `docs/redesign/backend/**`, `docs/qa/fase-9/**`, `AGENTES/02_backend/STATUS.md`.
3. **Somente leitura.** `supabase/migrations/**`, `apps/web/app/**/actions.ts`, `apps/web/lib/**`, `docs/architecture/**`, pacote T4.
4. **Dependências e compartilhados.** Nenhuma. **Não aplicar a migração da Fase 9**, não criar migração nova, não conectar a banco, não usar credencial nem service role.
5. **Validações.** Cada tabela/função citada existe nas migrações (grep); o SQL corrigido é válido por revisão (sem executar) e mantém `rollback`; `git diff --check` limpo.
6. **Parada e gate.** Parar antes de qualquer execução em Supabase real ou mudança de RLS fora do script de teste. Aplicar migração e rodar o teste no banco são gates de Yan.

## 03 · Persona — Agente NVIDIA

1. **Objetivo e aceite.** Primeiro incremento **read-only e efêmero, sem rede**: recuperação determinística de 5–8 evidências do próprio usuário, pacote de contexto, prompt versionado, schema de saída, validação pós-resposta (IDs, excertos, números, autorização), matriz de ferramentas permitidas/proibidas e suíte de avaliação **sintética** com provedor simulado. Aceite: testes passando por `node --experimental-strip-types --test lib/agent/*.test.ts`; casos adversariais (prompt injection em pergunta/evidência, ID/excerto/número inventado, evidência alheia, schema inválido, timeout/rate limit simulados, zero mutações); `docs/redesign/agent/CONTRATO_AGENTE.md` com versão do prompt, matriz de ferramentas, limites e o que **não** está comprovado (nenhuma inferência real).
2. **Branch/worktree e escrita.** `wt/agente-nvidia-lote1` em `C:\Users\yansi\Projetos\persona-wt\agente-nvidia` (`node_modules` já instalado com `npm ci`; `next typegen` já rodado). Escrita: `apps/web/lib/agent/**` (novo), `docs/redesign/agent/**`, `AGENTES/03_agente_nvidia/STATUS.md`.
3. **Somente leitura.** `apps/web/lib/live/**`, `lib/groq/**`, `lib/evidence/**`, `lib/score/**`, `apps/web/app/**`, `supabase/**`.
4. **Dependências e compartilhados.** Sem dependência nova, sem SDK novo e sem `fetch` para a NVIDIA neste lote. **Não editar `package.json`**: o script `npm test` lista os arquivos de teste, e incluir `lib/agent/*.test.ts` nele é tarefa do Orquestrador (registrar o pedido no handoff). Não alterar `lib/live/generate-live-response.ts`.
5. **Validações.** `npm run lint`, `npm run typecheck`, `npm test` (os 32 existentes continuam verdes) e o comando dos testes novos; `git diff --check` limpo; nenhum prompt completo nem dado pessoal em log.
6. **Parada e gate.** **Não receber, pedir nem registrar a chave NVIDIA**; não ler `.env*`; não chamar endpoint; não migrar Groq; sem tool loop, memória oculta, embeddings, web ou mutações. Chamada real e troca de provedor são gates de Yan.

## 04 · Persona — Verificação Independente

1. **Objetivo e aceite.** Somente leitura. Preparar `AGENTES/04_verificacao/PLANO_LOTE1.md` com os critérios de revisão de cada entrega (o mapa de telas é fiel ao protótipo e ao app? a matriz de dados bate com as migrações? o agente respeita ownership, schema e zero mutações?) e, quando o Orquestrador entregar um **diff congelado** (SHA + patch), revisá-lo e registrar achados reproduzíveis por severidade. Aceite: plano publicado agora; relatório por entrega quando houver diff.
2. **Branch/worktree e escrita.** Sem worktree. Escrita: apenas `AGENTES/04_verificacao/**` na checkout do Orquestrador.
3. **Somente leitura.** Tudo o mais, incluindo os worktrees dos escritores (`git -C <worktree> diff`/`log`; sem editar, sem rodar `npm install`, sem build neles).
4. **Dependências e compartilhados.** Nenhum. Depende das três entregas acima.
5. **Validações.** Comandos de revisão registrados com saída; severidade só reduzida com evidência.
6. **Parada e gate.** Não corrigir, não aprovar visual (decisão de Yan), não usar dados reais, não pentestar alvo não autorizado, não promover Preview/Production.

---

## Como abrir as abas

Yan abre uma aba do Claude Code por papel, na pasta indicada, e cola o prompt de `AGENTES/PROMPTS/<papel>.md` seguido de:

> Sua atribuição está em `C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2\AGENTES\ATRIBUICOES\LOTE-1.md`, seção do seu papel. Trabalhe no worktree indicado e atualize seu `STATUS.md`.

Pastas: Interface `C:\Users\yansi\Projetos\persona-wt\interface`; Backend `…\backend`; Agente NVIDIA `…\agente-nvidia`; Verificação `C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2`.

## Integração

Só o Orquestrador integra, um lote por vez: revisar o diff do branch, congelar SHA, enviar à Verificação, apresentar evidências a Yan, e só então propor merge. Os branches `wt/*-lote1` não têm upstream e não foram publicados.
