# Status — Persona — Migração de Interface

Estado: VERIFIED (Lote 1 · 01, mapa de telas). Nenhuma fatia de produto iniciada.

| Tarefa | Peso | Estado | Evidência |
|---|---:|---|---|
| Fundação visual da fatia | 20 | PENDING | fora do Lote 1 |
| Componentes e estados | 25 | PENDING | fora do Lote 1 |
| Tela/fluxo aprovado | 35 | PENDING | fora do Lote 1 |
| Acessibilidade e larguras | 20 | PENDING | fora do Lote 1 |

Lote 1 · 01 (contrato, sem código): `docs/redesign/interface/MAPA_TELAS.md` — VERIFIED pelas validações abaixo.
Concluído (plano ponderado do papel): 0%. O mapa não pontua nenhuma tarefa acima; o Lote 1 não implementa.
Faltante: 100% do plano de implementação.

Escopo recebido: `AGENTES/ATRIBUICOES/LOTE-1.md`, seção 01, em `wt/interface-lote1` (`C:\Users\yansi\Projetos\persona-wt\interface`). Escrita: `docs/redesign/interface/**` e este arquivo.

Arquivos alterados: `docs/redesign/interface/MAPA_TELAS.md` (novo), `AGENTES/01_interface/STATUS.md`. Nenhum arquivo de produto, `globals.css`, navegação ou `package.json`.

Comandos e resultados:
- Leitura de `AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/01_interface/AGENTS.md`, prompt e atribuição: ok.
- Script de conferência: todos os 12-hex `sha:` do mapa existem em `MANIFEST.json`; todos os caminhos `app/**`, `lib/**` e `t4/*.jsx` citados existem.
- `git diff --check`: limpo. Sem espaços finais no mapa.
- Não rodados (fora do escopo, sem mudança de código): `npm run lint`, `typecheck`, `test`, `build`, app em execução, screenshots.

Evidências: o mapa cita arquivo e hash do manifesto por tela; estados extraídos dos mapas de cenário dos `.jsx`.

Riscos:
- Estados do protótipo foram listados dos objetos de cenário; não foram abertos no navegador. Itens "não verificado"/"não foi encontrado" no mapa são ausência na leitura, não prova.
- Parte das comparações com o real vem de leitura parcial das páginas (colunas longas truncadas); conferir ao implementar cada fatia.
- A tela de dados (T4.7) depende da migração e do teste RLS da Fase 9, ainda pendentes no Supabase real.

Decisões pendentes de Yan (detalhe no mapa §4): fonte (Plus Jakarta/Inter × Geist); ícones (Lucide × Carbon, `AGENTS.md` §8); painel do Agente sem backend; dados sintéticos; Score painel × página; diagnóstico/onboarding sem T4; painéis × rotas `/[id]`; exportação de Artefato sem backend; aceite visual por fatia.

Bloqueio: nenhum para o mapa. A primeira fatia espera as decisões 4.1, 4.2, 4.5 e 4.7 e a atribuição do Orquestrador (dono de `globals.css`, `layout.tsx`, `app-navigation.tsx`).
Próximo passo: o Orquestrador revisa o diff, congela o SHA e envia à Verificação; depois Yan decide.
Commit local: ver `git log -1` no branch `wt/interface-lote1`. Sem push.
