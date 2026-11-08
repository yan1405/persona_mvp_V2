# Relatório de Verificação — Interface — Lote 2, Rodada 4 (IF4-1)

- SHA revisado: `d3dfa633630f672f7301fadfecdd78d8f186fc5c` (`wt/interface-lote2`; filho direto de `14ad9699faa1041ce9e66f9da4693227ed8234e8`; 3 arquivos, +4/−6).
- Verificador: Persona — Verificação Independente. Data: 08/11/2026. **Não aprovo visual**: o aceite é de Yan.
- `RELATORIO_interface_14ad969.md` vira histórico e **não aprova** este SHA.
- Regras: sem correção, sem push/merge, sem chave, `.env` ou chamada externa; nada nos worktrees dos escritores.

## 1. Resumo e gate sugerido

**Gate sugerido: liberar com ressalvas.** O IF4-1 está **resolvido na amostra**: com o CSS real do build, **nenhuma** das cinco telas (Artefatos, Diário, Live, Score, Diagnóstico) rola na horizontal em 23 larguras de 375 a 1280 px (115 combinações por versão; antes, `14ad969`: 9 rolavam; base `acc1f44`: 3, todas do Diário). Sem corte nem conteúdo inalcançável, reticências, `position: sticky` e barra lateral preservados; o IF3-1 (1024–1280 px) não regrediu. `npm test` 32/32, lint, typecheck e build com exit 0.

Ressalva nova, **IF5-1 (S3, HYPOTHESIS para a tela real)**: remover o override do Diário troca a rolagem por **campos apertados** em janelas estreitas; a **375 px os campos de data mostram só `dd/mm/a`** (98 px) e o placeholder da busca é cortado. A 440 px as datas cabem (120 px). Entre 640 e ≈ 800 px a busca fica 30% mais estreita que antes. De 1023 px para cima o Diário é idêntico. IF2-2, IF2-3 e IF3-2 seguem abertos e inalterados. Telas reais e aceite visual: PENDING.

## 2. Checagens C1–C6

| # | Checagem | Resultado | Evidência |
|---|---|---|---|
| C1 | Escopo (linha da Interface) | **OK** | `apps/web/app/globals.css` (+1/−5), `docs/redesign/interface/FUNDACAO_LOTE2.md`, `AGENTES/01_interface/STATUS.md` |
| C2 | Arquivos proibidos | **OK** | nada em `lib/**`, `package*.json`, lockfile, telas, componentes, `.env` |
| C3 | `git diff --check` | **OK** | exit 0 |
| C4 | Segredos | **OK** | nenhuma ocorrência nas linhas adicionadas |
| C5 | Commit | **OK** | pai = `14ad969`; autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` |
| C6 | `STATUS.md` do papel | **OK** | `Estado: WAITING_APPROVAL`, Fundação `PENDING`, "autorrótulo `VERIFIED` não usado"; declara os efeitos colaterais (títulos de Artefatos quebram linha, datas do Diário apertadas a 375 px) e que telas reais não foram amostradas |

## 3. O que mudou

Diff do CSS **compilado** entre `14ad969` e `d3dfa63` (diff por regra dos dois arquivos de saída do build): exatamente duas diferenças.

```css
/* a) removido o override do Diário (estava em @media (max-width: 1023px)) */
-  .diary-filters { grid-template-columns: minmax(220px, 1fr) 140px 140px; }
/* b) coluna de título da lista de Artefatos */
-.artifact-list li > a { grid-template-columns: 58px minmax(240px, 1fr) 92px 82px 120px 20px; … }
+.artifact-list li > a { grid-template-columns: 58px minmax(0, 1fr) 92px 82px 120px 20px; … }
```

Efeito de (a): `.diary-filters` passa a valer a regra de 3 colunas `minmax(0, 1fr)` do IF3-1 (`@media (max-width: 1279px)`) em **toda** a faixa abaixo de 1280 px, inclusive 640–1023 e 375 px (não há outra regra de `.diary-filters` abaixo dela: verificado no CSS compilado).

## 4. Ponto 1: rolagem horizontal, antes × depois, CSS real do build

Método: `next build` de `14ad969` e de `d3dfa63`, **em sequência**, com o `HEAD` conferido antes e depois de cada build (`estável` nos dois) e com o `.next` copiado logo após cada um; nenhum outro checkout rodou em paralelo. O CSS de cada um foi carregado em páginas estáticas servidas em `127.0.0.1` (encerrado), dentro de `iframe` da largura medida, com a casca real de cada SHA e a marcação das telas copiada das páginas (filtros + lista de Artefatos; cabeçalho + filtros + lista do Diário; contexto, evidências e sessões do Live; resumo, histórico e método do Score; grade e opções do Diagnóstico). A base `acc1f44` entra com a casca antiga. Transições desligadas. Dados sintéticos. Rolagem = `documentElement.scrollWidth > innerWidth`.

Larguras medidas (23): 375, 414, 560, 600, 639, 640, 660, 672, 700, 760, 768, 780, 799, 800, 900, 1000, 1023, 1024, 1100, 1152, 1230, 1279, 1280.

| Versão | Combinações | Rolam | Quais (largura do documento) |
|---|---:|---:|---|
| base `acc1f44` | 46 (só Artefatos e Diário) | 3 | Diário 375, 414, 560 (588 px) |
| antes, `14ad969` | 115 | **9** | Artefatos 768, 780, 799 (800 px); Diário 375, 414, 560 (572 px), 639, 640, 660 (672 px) |
| **depois, `d3dfa63`** | 115 | **0** | nenhuma |

Observações:

- Este resultado **exclui** a grade sintética de 280 px que eu usava para testar o `sticky`: com ela, a 375 px há 1 a 8 px de rolagem artificial (é a minha amostra, não a página; sem ela, Artefatos e Diário medem 375 px). Para o `sticky` usei a grade; para a rolagem, não.
- O Diário **também** rolava na base a 375–560 px (588 px): esse problema pré-existente saiu junto.
- Corte pelo painel: 0 px em todas as combinações das duas versões novas; 0 elementos inalcançáveis. Reticências: `.artifact-list small` e `.diary-list p` truncam 3/3 na versão nova (medido em todas as larguras).
- **IF3-1 (1024–1280 px):** 0 rolagens nas cinco telas, em 1024, 1100, 1152, 1230, 1279 e 1280 px: sem regressão. (Em 1279 px a regra de 1279 px não casa neste navegador de medição, como já relatado; sem consequência, não rola.)

## 5. Ponto 3: o que a remoção do override do Diário faz com o layout de 640 a 1023 px (e abaixo)

Larguras dos controles do filtro (busca, datas, estado), antes → depois, de `.diary-filters` (seis células em 2 linhas de 3):

| Largura | Antes (busca / datas) | Depois (todas iguais) | Leitura |
|---:|---|---|---|
| 375 | 220 / 140 (rolava: 572 px) | **98** | datas cortam (`dd/mm/a`), placeholder da busca cortado; **sem rolagem** |
| 414 | 220 / 140 (rolava) | 111 | idem, ainda apertado |
| 440 (medido à parte) | — | 120 | `dd/mm/aaaa` cabe |
| 560 | 220 / 140 (rolava) | 160 | cabe, sem rolagem |
| 639–672 | 220 / 140 (639–660 rolavam) | 150–161 | cabe; busca ≈ 30% mais estreita |
| 700–800 | 232–332 / 140 | 171–204 | busca mais estreita (−60 a −130 px), datas mais largas (+31 a +64 px) |
| 900–1000 | 432–532 / 140 | 237–271 | busca bem menor, datas ≈ 2× maiores, tudo igual entre si |
| 1023–1230 | igual | igual | sem mudança |
| 1279–1280 | igual (colunas originais) | igual | sem mudança |

Leitura: **de 1023 px para cima, nada muda. De 560 a 1000 px** os seis controles ficam do mesmo tamanho (mais regulares que antes, em que a busca tinha até 532 px e as datas 140), nenhum controle estoura sua célula (`inputOverflow` 0) e deixou de haver rolagem em 639–660 px. **A busca fica mais estreita em 640–~800 px** (placeholder "Buscar no texto ou contexto" cortado, cosmético). **Abaixo de ≈ 430 px**, o ganho (sem rolagem) vem com o custo do IF5-1: células de 98–111 px, em que a data mostra `dd/mm/a`. Conferi por captura a 375 px e 440 px.

Lista de Artefatos de 761 a 799 px (item b): a coluna de título cai de 240 para 177 px a 768 px; uma linha de título muito longo (injetei um de 113 caracteres) **quebra em 5 linhas** (linha de 118 px em vez de 68 px) porque `strong` não tem reticências; o subtítulo (`small`) segue truncando. Aceitável, e o `STATUS` já declara o efeito.

## 6. Ponto 4: sticky e barra lateral

Com `align-items: start` na grade da amostra (como no CSS real da tela): `aside` sticky com `top: 76 px` a 1000 px de rolagem em 1100 px; barra lateral sticky `top: 16 px`, largura 256 px (1100 px), 76 px (1024 px, medido na rodada anterior com o mesmo shell); a 375 px a barra superior fica sticky em `top: 8 px`, de 8 a 367 px, sem rolagem. O diff não toca a casca.

## 7. Ponto 5: IF2-2, IF2-3, IF3-2

Inalterados: o diff compilado são as duas mudanças acima, nada em `.app-sidebar`, `.app-sidebar-nav` nem na casca; `git grep -c "<main" d3dfa63 -- apps/web/app/app/configuracoes` vazio.

## 8. Execução independente

Checkout isolado `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado em `d3dfa633630f672f7301fadfecdd78d8f186fc5c` (`HEAD` conferido antes e depois, `git status` limpo), devolvido a `acc1f44` (limpo). Lockfile igual; `node_modules` do `npm ci` anterior reutilizados. Em `apps\web`, sem `.env`, sem chave, sem rede de provedor:

| Comando | Exit | Resultado |
|---|---:|---|
| `npx next typegen` | 0 | tipos gerados |
| `npm test` | 0 | tests 32 · pass 32 · fail 0 · cancelled 0 · skipped 0 |
| `npm run lint` | 0 | sem diagnósticos |
| `npm run typecheck` | 0 | sem erros |
| `npm run build` | 0 | compilado |

`14ad969` foi construído de novo só para o CSS de comparação (`npm run build`, exit 0).

## 9. Achados

| ID | Sev. | Status | Achado |
|---|---|---|---|
| IF4-1 | (era S3) | **resolvido na amostra** (tela real PENDING) | seção 4: 0 rolagens em 115 combinações; antes 9. |
| IF3-1 | (era S3) | continua resolvido | seção 4: 1024–1280 px sem rolagem. |
| IF2-1 | (era S2) | continua corrigido | corte 0 px, 0 inalcançáveis. |
| **IF5-1** | S3 | VERIFIED (captura e medição) / HYPOTHESIS (campo real) | **Diário, filtros em janelas estreitas:** com o override removido, abaixo de ≈ 430 px os campos ficam de 98–111 px; a data mostra `dd/mm/a` (o ano não cabe) e o placeholder da busca é cortado. Sem rolagem lateral, mas o valor digitado também ficaria cortado. Entre 640 e ≈ 800 px a busca fica 30–40% mais estreita que antes (cosmético). **Opções (não implementadas, dono Interface):** 1 coluna do filtro abaixo de ≈ 450 px; ou 2 colunas abaixo de ≈ 560 px; ou `min-width` mínimo nas datas. **Reprodução:** `after/diario.html` a 375, 414 e 440 px (largura do `input[type=date]`: 98, 111, 120 px). |
| IF3-2 | S4 | inalterado | a barra lateral só é sticky na vertical de 640 px para cima; a rolagem lateral que a expunha (IF3-1, IF4-1) deixou de ocorrer nas larguras medidas. |
| IF2-2 | S3 | inalterado | sem mudança no diff. |
| IF2-3 | S3 | inalterado | sem `<main>` em Configurações. |

Nenhuma severidade reduzida sem evidência; IF4-1 sai de S3 por medição do CSS real nas cinco telas.

## 10. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | C1–C6; typegen/test 32/32/lint/typecheck/build; diff compilado = duas mudanças; 0 rolagens em 23 larguras × 5 telas; IF3-1 sem regressão; sem corte; reticências; sticky; efeito no Diário (tabela da seção 5) |
| HYPOTHESIS | telas reais autenticadas (a amostra é esqueleto de classes); datas e busca reais; Evidências e Configurações não amostradas; subpixel em 1023 e 1279 px |
| PENDING | sessão real de `/app/**`; 1440/1920 px; leitor de tela; impressão A4; **aceite visual de Yan** |

## 11. Decisões pendentes

Orquestrador/Yan: aceitar o IF5-1 como ressalva (filtros do Diário apertados abaixo de ≈ 430 px) ou pedir um ajuste curto (1 coluna em janelas muito estreitas); IF2-2/IF2-3/IF3-2 no próximo lote da Interface. Yan: aceite visual e a integração (a `main` contém `d71f2a7`; `14ad969` e `d3dfa63` entram por merge simples quando você autorizar).
