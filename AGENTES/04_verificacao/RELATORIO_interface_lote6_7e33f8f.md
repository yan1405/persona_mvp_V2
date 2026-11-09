# Relatório de Verificação — Interface — Lote 6 (AG7-1, IF7-2/IF8-2, Diagnóstico, Configurações)

- SHAs revisados, um a um (`wt/interface-lote2`, base `ce12bee4b1bcaefc6080b584448713136b9e7dbd`, cada um filho do anterior):
  1. `f80de4a4485d2d6ba1d41d510258ee6dd6bbfb19` — AG7-1: cinco textos visíveis "Groq" do Diário.
  2. `44b191380985f5530e1206ced973336d3bf3b345` — IF7-2 (checkbox do Live 24 px) e IF8-2 (impressão de Artefatos).
  3. `ff3df5706cb3d084497e3d71453a5e56aa052f6a` — tela Diagnóstico.
  4. `7e33f8f37bd581ba496ce80305b4f35e6499c114` (topo) — tela Configurações (as rotas pelo `layout.tsx`).
- Verificador: Persona — Verificação Independente. Data: 09/11/2026. Os relatórios de `ce12bee` e anteriores são histórico e **não** aprovam estes SHAs. Um relatório vale só para o SHA citado.
- Regras cumpridas: sem correção, sem push/merge/banco/chave/provedor; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido antes e depois (`HEAD estavel` nos quatro), devolvida a `a5a18aa` limpa. Medições com Chrome headless local (`--dump-dom`, sem servidor e sem porta aberta). **Não aprovo o visual**: o aceite visual é de Yan (`AGENTS.md` §6.1).

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `f80de4a` (AG7-1) | **liberar para integração local** | Só cinco textos mudam (chaves e lógica iguais); `git grep -i groq -- apps/web/app` em `7e33f8f` só acha dois `import` de `lib/groq/…` (não visíveis). Fecha o S3 AG7-1 **na Interface**; o ramo do Agente, sozinho, ainda tem os cinco textos (ver §3). |
| `44b1913` (IF7-2, IF8-2) | **liberar para integração local** | Uma linha de CSS: 5 de 5 checkboxes do Live passam de 20 para 24 × 24 px (375 e 1280 px), sem rolagem. IF8-2 não tem mudança de código: a impressão com o CSS do topo é idêntica à da base (4 de 4 PDFs, mesmo conteúdo). |
| `ff3df57` (Diagnóstico) | **liberar com ressalvas** | Só a classe `ds-surface` no TSX. 0 rolagens, cortes e vazamentos (528 casos); 0 problemas de contraste, alvo, `id` duplicado ou salto de título. Aceite visual de Yan e tela real PENDING. |
| `7e33f8f` (Configurações, topo) | **liberar com ressalvas** | Só a classe do `<main>` do `layout.tsx` (ganha `app-page` e `ds-surface`). Mesmos resultados. Ressalva extra: `app-page` limita a largura a 1280 px (ver IF9-4). |

Execução independente, sem `.env`, nos quatro SHAs: `next typegen`, `npm test` **32/32** (cancelados 0, ignorados 0), lint (0 avisos), typecheck e build com saída 0; `HEAD` estável antes e depois de cada um.

**Sem S1, S2 ou S3 confirmado na Interface.** Seis S4 abaixo.

## 2. Apresentação só (lógica, textos, RPC)

- **VERIFIED por diff** (`ce12bee..7e33f8f`, 6 arquivos, +150/−11): `configuracoes/layout.tsx` e `diagnostico/page.tsx` mudam **uma linha cada, só `className`**; `diario/[id]/page.tsx` muda 5 linhas, só texto (§3); `globals.css` +141/−1; `STATUS.md` e `FUNDACAO_LOTE2.md` só documentação (a tabela §7 ganha as linhas de Diagnóstico e Configurações). `diagnostic-form.tsx`, as ações, as páginas de `configuracoes/*` e `package.json` não aparecem no diff. Nenhuma lógica, RPC, `searchParams` ou ação mudou.
- O `STATUS.md` da Interface descreve a mudança do Diário como "única exceção à regra de textos inalterados": confere.

## 3. AG7-1 (`f80de4a`)

- **VERIFIED:** as 5 linhas de `diario/[id]/page.tsx`: `timeout` ("A IA demorou…"), `rate_limit` ("…do provedor de IA…"), `provider_error` ("O provedor de IA está indisponível…"), o rótulo `origin === "ai" ? "IA" : "Manual"` e "Aguarde a resposta da IA". As chaves de `noticeMessages` e a ramificação não mudam.
- `git grep -n -i groq 7e33f8f -- apps/web/app`: sobram `artefatos/actions.ts` e `diario/actions.ts` (apenas caminhos de `import`). Em `b5ba514` (ramo do Agente) a mesma busca ainda acha os **cinco textos**: o ramo do Agente tem base `b409e7c`, sem este commit. **Para fechar o S3 AG7-1, os dois ramos precisam entrar juntos.** `git merge-tree 7e33f8f b5ba514` não acusa conflito (leitura; nada integrado).
- Observação: o texto "A IA" agora aparece para falhas do provedor NVIDIA; é neutro e correto para o ADR (sem nome de provedor na tela).

## 4. IF7-2 (`44b1913`)

- **VERIFIED:** a regra `.ds-surface .live-evidence-options input` passa de `20px` para `24px` (único alterado do `cssdiff` `if1→if2`; 0 adicionadas, 0 removidas).
- Medição (página de preparação do Live, 5 caixas, CSS real de cada SHA): `base` e `f80de4a` 20 × 20; `44b1913` e `7e33f8f` **24 × 24**, a 375 e 1280 px, texto extremo e realista; `scrollWidth` igual à janela (sem rolagem). O alvo clicável é o rótulo inteiro (284 × 490 a 375 px; 844 × 185 a 1280 px), então o alvo de 24 px vale com folga.

## 5. IF8-2 (`44b1913`): impressão de Artefatos

- A fonte não mudou nada para a impressão; o `STATUS.md` afirma "sem diferença visível, só `overflow-wrap` nos h2". Medi de outra forma: 4 amostras da folha impressa (marcação transcrita de `artefatos/[id]/page.tsx`, versão com e sem `ds-surface`, texto extremo e realista), impressas em PDF com Chrome headless (`--print-to-pdf`) com o CSS de `ce12bee` e com o de `7e33f8f`.
- **VERIFIED:** para a mesma marcação, o conteúdo decodificado do PDF (5 fluxos, 91.755 e 93.702 bytes) é **idêntico byte a byte** entre `ce12bee` e `7e33f8f`, nas 4 amostras. O Lote 6 não muda a impressão em relação à base.
- **VERIFIED (limite):** a marcação sem `ds-surface` e a com `ds-surface` (mudança do Lote 5) geram PDFs de 1 página, mesmo texto (907 operações de texto) e mesmas cores de preenchimento; a única diferença é o recurso de fonte de 5 trechos de 16 px (dois recursos: `ArialMT` e `Arial-BoldMT`). **HYPOTHESIS:** são os cinco `h2` da folha, que passam de peso normal para negrito sob `ds-surface`; não confirmei qual lado é qual nem vi a página. Não compara com uma impressão real de "Exportar PDF" de um currículo (PENDING, IF8-2 abaixo).

## 6. Diagnóstico e Configurações: medições (CSS real do build de cada SHA)

Método: amostras HTML com a marcação **transcrita** de `diagnostico/page.tsx` + `diagnostic-form.tsx` (3 etapas, erro, revisão) e de `configuracoes/layout.tsx` + `perfil`, `conta`, `dados` e `dados` com nova autenticação, versão sem e com `ds-surface`, dentro do casco real; 24 larguras (375 a 1280 px), texto extremo (palavra de 136 caracteres e URL de 90) e realista.

| Medição | Resultado |
|---|---|
| Rolagem horizontal / corte / vazamento / `<main>` ≠ 1, telas novas (Diagnóstico 5 estados, Configurações 4, mais as duas amostras do Live) | **0 de 528** casos (22 variantes × 24 larguras) |
| Controle positivo do método (mesma marcação **sem** `ds-surface`, CSS da base) | rola ou corta em **187 de 528** casos (106 de rolagem, 123 de corte; Diagnóstico antigo 92, Configurações antigas 95): o método enxerga o defeito |
| Controle positivo do diferencial | `ds-surface` muda 229 de 276 elementos (Diagnóstico), 231 de 278 (com erro) e 35 a 53 de 82 a 100 (Configurações) |
| Vazamento para telas fora do `ds-surface` (`ce12bee` × `7e33f8f`, 375 e 1280 px) | **0 diferenças** em 14 telas legadas (Diagnóstico e Configurações antigos, Diário `[id]`, Evidências antigas, Live antigo, Diagnóstico gen3, "zoo" de 302 elementos), com e sem texto longo |
| Telas já migradas (Início, Diário, Evidências, Artefatos lista) | 0 diferenças em Artefatos; **1 elemento, 1 propriedade** em cada uma das outras (IF9-1, IF9-2); nada mais |
| Contraste (fundo composto), alvos < 24 e < 44 px, `id` duplicado, saltos de título, `<main>` único | **0 problemas** nas 9 telas novas a 375, 768 e 1280 px (27 casos) |
| Escala de cinco respostas do Diagnóstico | radios de 24 × 24 px (eram 15); rótulo inteiro é o alvo; `label:has(input:focus-visible)` com anel de 2 px (a base não tinha anel próprio) |
| Configurações | checkboxes de 24 × 24 px, rótulos de 574 × 68 a 106 px |

- **Escopo do CSS (VERIFIED):** `ce12bee → 7e33f8f`: 1196 → 1291 regras, **0 removidas**, 95 adicionadas, **2 alteradas**. Todos os 95 seletores novos contêm `ds-` (0 sem). As alteradas: `.ds-surface .empty-state` perde o `overflow-wrap: anywhere` próprio e ele passa para uma regra conjunta nova (`.empty-state, .field-error, .form-error, .form-success, .inline-notice`), e o checkbox do Live (§4). Sem CSS morto (as classes não-`ds` citadas têm uso na árvore de `app`).
- **Lição de método (registrada, não é defeito do produto):** nesta rodada o build de `ff3df57` e `7e33f8f` separou as `@font-face` em um segundo arquivo de CSS (as seis regras são idênticas às da base). Meu gerador de amostras pegou o arquivo errado (1º do `glob`) e produziu uma primeira rodada de medições inválida (fonte reserva, e em `ff3df57` sem o CSS do app); **descartei esses números**, corrigi as amostras para ligar os dois arquivos e refiz tudo. Controle: base contra base dá 0 diferenças; base contra `f80de4a` e `44b1913`, 0 e 0.

## 7. Achados

| ID | Sev. | Rótulo | Achado | Recomendação |
|---|---|---|---|---|
| IF9-1 | S4 | VERIFIED | Regra nova `.ds-surface a.button-secondary { text-align: center; … display: inline-flex }` vale para **toda** tela `ds-surface`. No Início muda uma propriedade de um elemento (`text-align: start → center`); sem efeito visível com uma linha. Um botão-link de duas linhas passaria a ficar centralizado. | Yan: aceite visual do Início; registrar. |
| IF9-2 | S4 | VERIFIED | `.field-error`, `.form-error`, `.form-success`, `.inline-notice` ganham `overflow-wrap: anywhere` em toda tela `ds-surface` (Diário e Evidências: 1 `p.inline-notice` muda). Só quebra palavra sem espaço. | Aceitável; registrar. |
| IF9-3 | S4 | PENDING | Impressão: sem diferença para a base (§5), mas a saída real de "Exportar PDF" de um currículo/portfólio nunca foi vista; a diferença legado × `ds-surface` nos títulos é hipótese. | QA com um Artefato real. |
| IF9-4 | S4 | HYPOTHESIS | `app-page` entra no `<main>` de Configurações: `.app-page { width: 100%; max-width: 1280px; margin-inline: auto }`. Painéis até 1280 px (todas as medições) não mudam; acima disso o conteúdo passa a ficar centralizado com 1280 px. Não medi painel maior. | Yan: conferir em monitor largo no aceite. |
| IF9-5 | S4 | PENDING | Foco do Diagnóstico: a regra existe (`label:has(input:focus-visible)`, 2 px), mas o foco por **Tab real** não foi exercitado (o `focus()` programático não casa `:focus-visible` nos radios e o harness marca 52 radios "sem anel", falso positivo conhecido para anel no rótulo). | Teste de teclado na tela real. |
| IF9-6 | S4 | VERIFIED (limite) | Diagnóstico e Configurações foram medidos por marcação transcrita; nenhuma tela autenticada vista. A página de Diagnóstico mantém 3 `<h1>` no DOM (uma por etapa, as demais ocultas) como antes. | Aceite visual de Yan com dados reais. |
| IF8-1/IF8-3, IF6-4/IF3-2 | S4 | aberto | Editor só transcrito; barra lateral só `sticky` na vertical. Inalterados. | — |

## 8. Não verificado / PENDING

- Telas reais autenticadas, hidratação, leitor de tela, Safari/Firefox, Chrome com a janela real; foco por Tab real no Diagnóstico; painel maior que 1280 px; aceite visual de Yan (`AGENTS.md` §6.1) de Diagnóstico e Configurações; impressão real; `/app/artefatos/novo` (segue escura).
- Fluxos de exclusão de conta e exportação (só a apresentação foi medida; as ações não foram executadas).

## 9. Decisão de gate (resumo)

`f80de4a` e `44b1913`: liberar para integração local. `ff3df57` e `7e33f8f`: liberar com ressalvas (aceite visual de Yan e telas reais PENDING). Nenhum bloqueio de gate. Para fechar o S3 AG7-1 os ramos da Interface e do Agente precisam ser integrados juntos. Nada foi corrigido, integrado ou commitado por mim.
