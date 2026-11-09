# Relatório de Verificação — Interface — Lote 5 (IF7-1, tela Score, tela Artefatos)

- SHAs revisados, um a um (`wt/interface-lote2`, base `3f376937012717a8449730675e0a7ae3372c5cdb`):
  1. `3da5f586db03e8f220e64813031bb9923b84abc5` — IF7-1 (`overflow-wrap` no eyebrow do Live) e texto de IF6-3 (CSS +2, STATUS, FUNDACAO).
  2. `1eef0a4dd87d664fb426596f051a13b85a7a1b66` — tela Score (`score/page.tsx`, +68 linhas de CSS).
  3. `ce12bee4b1bcaefc6080b584448713136b9e7dbd` (topo) — tela Artefatos (`artefatos/page.tsx`, `artefatos/[id]/page.tsx`, +130 linhas de CSS).
- Verificador: Persona — Verificação Independente. Data: 09/11/2026. Os relatórios de `3f37693` e anteriores são histórico e **não** aprovam estes SHAs. Um relatório vale só para o SHA citado.
- Regras cumpridas: sem correção, sem push/merge/banco/chave/provedor; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido antes e depois, devolvida a `a5a18aa` limpa. Medições com Chrome headless local (`--dump-dom`, sem servidor e sem porta aberta; um servidor HTTP foi recusado pelo ambiente e não foi usado).

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `3da5f58` (IF7-1) | **liberar para integração local** | Reproduzi o defeito na base (`3f37693`: 297 px cortados a 375 px) e ele **some** (0 cortes em 24 larguras × 2 telas × 2 textos). Regra nova só em `.ds-surface .live-session-header .eyebrow`. |
| `1eef0a4` (Score) | **liberar com ressalvas** | Lógica, textos e RPC inalterados (a única mudança do TSX é a classe `ds-surface`). 0 rolagens, 0 cortes, 0 vazamentos; sem problemas de contraste, alvos ou foco. Aceite visual de Yan e tela real PENDING. |
| `ce12bee` (Artefatos, topo) | **liberar com ressalvas** | Idem para lista e detalhe (Conteúdo, Evidências, Versões): só `ds-surface`; 0 rolagens/cortes com palavra de 136 caracteres e com texto realista. Ressalvas: editor visto só em marcação transcrita, impressão não medida, aceite visual PENDING. |

Execução independente, sem `.env`, nos três SHAs: `next typegen`, `npm test` **32/32** (cancelados 0, ignorados 0), lint (0 avisos), typecheck e build com saída 0; `HEAD` estável antes e depois de cada um.

**Sem S1, S2 ou S3 confirmado na Interface.** Quatro S4 abaixo.

## 2. Apresentação só (lógica, textos, RPC)

- **VERIFIED por diff:** em `score/page.tsx`, `artefatos/page.tsx` e `artefatos/[id]/page.tsx`, a versão de `ce12bee` com `" ds-surface"` removido tem **o mesmo `md5`** do arquivo de `3f37693` (as três). Nenhuma linha de lógica, texto, RPC, `searchParams` ou ação mudou. `artifact-forms.tsx` (o editor) e `actions.ts` não aparecem no diff. A página `/app/artefatos/novo` (`app-page artifact-new-page`) não foi tocada e segue escura, como declarado.
- O diff total de `apps/web` de `3f37693` a `ce12bee` é: 3 linhas de TSX (a classe) e `globals.css` (+200, 0 removidas). Os demais arquivos são STATUS/FUNDACAO.

## 3. IF7-1 (`3da5f58`)

- **Reprodução na base (controle positivo, VERIFIED):** com o CSS de `3f37693`, `liveid` (eyebrow com o nome da empresa contendo uma palavra de 136 caracteres) fica **cortado** de 375 a 780 px (297 px a 375, 258 a 414, 148 a 640, 20 a 768, 8 a 780; a janela não rola, é o corte silencioso do `container-type`). Com texto realista (com espaços) a base não corta: só o extremo reproduz.
- **Correção (VERIFIED):** com o CSS de `3da5f58` (e de `1eef0a4`/`ce12bee`), **0 de 96** medições (24 larguras × 2 estados × 2 textos: extremo e realista) têm corte, rolagem ou vazamento. Os 70 caracteres seguidos do relato original estão cobertos pelos 136 do teste.
- **Escopo:** a regra adicionada é `.ds-surface .live-session-header .eyebrow { overflow-wrap: anywhere }` (1 seletor com `ds-`); `base → if1`: +1 regra, 0 removidas, 0 alteradas.
- **Texto de IF6-3 (VERIFIED):** o `STATUS.md` agora diz que em `.ds-surface` o excesso é **cortado em silêncio**, sem rolagem (`container-type: inline-size`), e manda usar `minmax(0, 1fr)` e `overflow-wrap: anywhere`; é o comportamento que medi. O parágrafo de `FUNDACAO_LOTE2.md` foi ajustado no mesmo sentido.

## 4. Score e Artefatos: medições (CSS real do build de cada SHA)

Método: amostras HTML com a marcação **transcrita dos `page.tsx`** (versão sem e com `ds-surface`) dentro do casco real (`app-sidebar`), CSS compilado de cada SHA, 24 larguras (375, 414, 560, 600, 639, 640, 660, 672, 700, 760, 768, 780, 799, 800, 900, 1000, 1023, 1024, 1100, 1152, 1200, 1230, 1279, 1280). Estados: lista (cheia, vazia, filtro sem resultado, erro), detalhe (Conteúdo com editor transcrito, Evidências, Versões), Score (Resumo, Histórico, Método, sem dados). Cada um com texto extremo (palavra única de 136 caracteres e URL de 90) e realista (com espaços).

| Medição | Resultado |
|---|---|
| Rolagem horizontal / corte / vazamento / `<main>` ≠ 1, telas novas de Score e Artefatos | **0 de 624** casos (13 telas × 24 larguras × 2 textos) |
| Controle positivo do método (mesma marcação **sem** `ds-surface`, CSS de `3f37693`) | rola ou corta em **163 de 624** casos (139 de rolagem nas telas escuras antigas com texto extremo, 24 cortes do Live na base): o método enxerga o defeito |
| Controle positivo do diferencial | `ds-surface` muda **17 a 101 elementos** por tela (lista cheia 76 de 123; editor 101 de 148); a ferramenta detecta mudança |
| Vazamento para telas fora do `ds-surface` | 0 diferenças de estilo em 12 telas legadas e nas 11 versões "antigas" (Configurações, Diagnóstico, Diário [id], Evidências antigas, Live antigo, Artefatos e Score antigos, zoo de 273 classes) entre `3f37693` e `ce12bee`, a 375 e 1280 px |
| Telas já em `ds-surface` (Início, Diário, Evidências, Live lista) | o único elemento que muda é o `aside.artifact-editor-aside` que **o próprio harness injeta** (bloco sticky) em toda amostra; não existe nessas telas reais; 0 diferenças nos demais |
| Rolagem das telas legadas 375/768/1024/1280 px | idêntica entre `3f37693` e `ce12bee` (os mesmos `docW`) |
| Contraste (cálculo com fundo composto), alvos < 44 px, `id` duplicado, saltos de título, 1 `<h1>`, `<main>` único | **0 problemas** nas 11 telas novas a 375, 768 e 1280 px (33 casos) |
| Foco | o único "sem anel" é o botão `↑` da primeira seção, que **está `disabled` na minha amostra** (não recebe foco): artefato do harness, não defeito |
| `sticky` do aside do editor | a 1280 px o aside fixa a 24 px do topo (`top: var(--ds-space-6)`, em vez dos 76 px da tela legada: mudança de desenho, não regressão); abaixo de 900 px vira bloco (`position: static` na consulta de contêiner) |

- **Escopo do CSS (VERIFIED):** `3f37693 → ce12bee`: 1057 → 1196 regras, **0 removidas**, 139 adicionadas, **1 alterada** (`.ds-surface .empty-state` ganha `overflow-wrap: anywhere`, que vale para toda tela `ds-surface`; nenhuma mudança visível nas amostras). Todos os 139 seletores novos contêm `ds-` (0 sem). As 39 classes não-`ds` citadas no CSS novo têm uso na árvore de `app` (checagem estrita, sem falso positivo de `-w`); sem CSS morto introduzido.
- Observação: nas telas ≤ 899 px de contêiner o editor empilha e as listas passam a 4 colunas/2 colunas por consulta de contêiner; confirmei só pela ausência de rolagem/corte, não por avaliação estética (isso é aceite de Yan).

## 5. Achados

| ID | Sev. | Rótulo | Achado | Recomendação |
|---|---|---|---|---|
| IF8-1 | S4 | VERIFIED (limite) | O editor (`ArtifactEditor`, componente cliente) foi medido por marcação **transcrita à mão** de `artifact-forms.tsx`; nenhuma tela real autenticada foi vista. Mudanças futuras no componente não são detectadas por esta amostra. | Yan: aceite visual da tela real com um Artefato verdadeiro. |
| IF8-2 | S4 | PENDING | Impressão (`@media print`): a regra nova só pinta `h2` da folha, mas `.ds-surface.artifact-detail-page` virou `display: grid; gap` também ao imprimir. Não medi a saída de "Exportar PDF". | Imprimir um currículo/portfólio em QA e comparar com a base. |
| IF8-3 | S4 | VERIFIED | `.ds-surface .empty-state` ganhou `overflow-wrap: anywhere` (regra alterada, não nova), válida para todas as telas `ds-surface`. Efeito: só quebra palavra sem espaço. | Aceitável; registrar. |
| IF7-2 (aberto) | S4 | VERIFIED (Lote 4) | Checkboxes do Live com 20 px; não tocado neste lote. | Próximo lote. |
| IF6-4/IF3-2 (aberto) | S4 | — | Barra lateral só `sticky` na vertical; inalterado. | — |

## 6. Não verificado / PENDING

- Telas reais autenticadas, hidratação no navegador, leitor de tela, Safari/Firefox, Chrome com a janela real; aceite visual de Yan (`AGENTS.md` §6.1) de Score e Artefatos.
- `/app/artefatos/novo` (segue escura): não amostrei a marcação; as 12 telas legadas e o "zoo" não mudaram, o que cobre vazamento de seletor, não a tela em si.
- Saída de impressão (IF8-2).

## 7. Decisão de gate (resumo)

`3da5f58`: liberar para integração local. `1eef0a4` e `ce12bee`: liberar com ressalvas (aceite visual de Yan e telas reais PENDING). Nenhum bloqueio de gate. Nada foi corrigido, integrado ou commitado por mim.
