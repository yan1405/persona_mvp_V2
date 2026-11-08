# Relatório de Verificação — Interface — Lote 2, Rodada 3

- SHA revisado: `14ad9699faa1041ce9e66f9da4693227ed8234e8` (`wt/interface-lote2`; filho direto de `d71f2a7ac2e9b720385f0bf8d425d95811d0edab`; +13/−3 em 3 arquivos).
- Verificador: Persona — Verificação Independente. Data: 08/11/2026. **Não aprovo visual**: o aceite é de Yan.
- `RELATORIO_interface_d71f2a7.md` vira histórico e **não aprova** este SHA.
- Regras: sem correção, sem push/merge, sem chave, `.env` ou chamada externa; nada nos worktrees dos escritores.

## 1. Resumo e gate sugerido

**Gate sugerido: liberar com ressalvas.** O critério de Yan para o IF3-1 está **atendido na amostra**: com o CSS real do build, as cinco telas (Artefatos, Diário, Live, Score, Diagnóstico) não rolam na horizontal em 1024, 1100, 1152, 1200, 1230, 1279 e 1280 px (antes, `d71f2a7`: Artefatos e Diário rolavam de 1024 a 1230). Nenhum conteúdo cortado ou inalcançável, reticências e `position: sticky` preservados, barra lateral preservada, e `npm test`/lint/typecheck/build com exit 0. A regra nova **não sobrepõe** nenhum layout móvel (as regras móveis vêm depois no CSS e continuam vencendo; medido).

Uma ressalva nova, **IF4-1 (S3, HYPOTHESIS para a tela real)**: em duas faixas **estreitas** a janela ainda rola na horizontal e a base `acc1f44` não rolava: Diário de 639 a 671 px e Artefatos de 761 a 799 px. **Esta rodada não as causa nem as corrige** (idênticas em `d71f2a7` e `14ad969`), e ficam fora do critério de 1024–1280 px, mas caem na faixa de 640–768 px que você pediu. Telas reais (login) e aceite visual: PENDING.

## 2. Checagens C1–C6

| # | Checagem | Resultado | Evidência |
|---|---|---|---|
| C1 | Escopo (linha da Interface) | **OK** | `apps/web/app/globals.css` (+8), `docs/redesign/interface/FUNDACAO_LOTE2.md`, `AGENTES/01_interface/STATUS.md` |
| C2 | Arquivos proibidos | **OK** | nada em `lib/**`, `package*.json`, lockfile, telas, componentes, `.env`; o diff do CSS é só as duas regras novas |
| C3 | `git diff --check` | **OK** | exit 0 |
| C4 | Segredos | **OK** | nenhuma ocorrência nas linhas adicionadas |
| C5 | Commit | **OK** | pai = `d71f2a7`; autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` |
| C6 | `STATUS.md` do papel | **OK** | `Estado: WAITING_APPROVAL`; Fundação `PENDING`, "`VERIFIED` só após a Verificação"; texto do IF3-1 declara a tela real PENDING e o que não foi amostrado. Ressalva menor: diz que o Diário rolava "a 1100–1152 px" antes, e na minha amostra rolava de 1024 a 1230 (a amostra diferente explica) |

## 3. O que mudou (diff `d71f2a7..14ad969` em `globals.css`)

```css
/* após .diary-filters (≈ linha 1746) */
@media (max-width: 1279px) { .diary-filters { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
/* após .artifact-filters (≈ linha 3208) */
@media (max-width: 1279px) { .artifact-filters { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
```

Diferença do CSS **compilado** entre `d71f2a7` e `14ad969`: exatamente essas duas regras, nada mais (diff por regra dos dois arquivos de saída do build).

## 4. Ponto 1 — IF3-1, antes × depois, CSS real do build

Método: `next build` de `d71f2a7` e de `14ad969`, em sequência e com o `HEAD` conferido antes e depois de cada build (ver "Nota de método"); o CSS gerado de cada um foi carregado em páginas estáticas servidas em `127.0.0.1` (encerrado) dentro de `iframe` da largura medida, com a casca real de cada SHA e a marcação das telas copiada das páginas (`artefatos`: filtros + `.artifact-list`; `diario`: cabeçalho, `.diary-filters`, `.diary-list`; `live`: formulário de contexto, `.live-evidence-options`, `.live-session-list`; `score`: resumo, `.score-history`, `.score-method`; `diagnostico`: grade da página, `.diagnostic-options`). Transições desligadas. Dados sintéticos. `scrollWidth` do documento comparado com a largura da janela (`clientWidth` da janela é igual à largura; `scrolling=no` no `iframe` evita barra de rolagem).

Rolagem horizontal da janela (`documentElement.scrollWidth > innerWidth`); entre parênteses, `scrollWidth`:

| Largura | Artefatos antes → depois | Diário antes → depois | Live | Score | Diagnóstico |
|---:|---|---|---|---|---|
| 1024 | rola (1053) → **ok** | rola (1059) → **ok** | ok → ok | ok → ok | ok → ok |
| 1100 | rola (1233) → **ok** | rola (1239) → **ok** | ok → ok | ok → ok | ok → ok |
| 1152 | rola (1233) → **ok** | rola (1239) → **ok** | ok → ok | ok → ok | ok → ok |
| 1200 | rola (1233) → **ok** | rola (1239) → **ok** | ok → ok | ok → ok | ok → ok |
| 1230 | rola (1233) → **ok** | rola (1239) → **ok** | ok → ok | ok → ok | ok → ok |
| 1279 | ok → ok | ok → ok | ok → ok | ok → ok | ok → ok |
| 1280 | ok → ok | ok → ok | ok → ok | ok → ok | ok → ok |

Observações:

- O valor "antes" de Artefatos (1233 px) reproduz a medição do meu relatório anterior (1234 px na época, com outro método de janela: diferença de 1 px), então o método é coerente.
- **Live, Score e Diagnóstico nunca rolaram** na minha amostra, antes ou depois. É HYPOTHESIS que as telas reais se comportem igual (as amostras são esqueletos de classes, não as páginas).
- Em 1279 px a regra nova **não casa** neste navegador (`matchMedia('(max-width: 1279px)')` devolveu `false` com `innerWidth` 1279; casa até 1278); em 1279 as colunas ficam originais (7/6) e **mesmo assim não rola**. Fronteira provavelmente de subpixel do painel de medição (HYPOTHESIS); sem consequência de rolagem.
- Em 1024–1239 o painel tem 796–926 px; os filtros em 3 colunas cabem.

## 5. Ponto 2 — a regra nova × regras móveis existentes

**Ordem no CSS real** (build de `14ad969`, linhas do CSS compilado): `.diary-filters` base (370) → **regra nova (372)** → `@media (max-width:1023px)` com `.diary-filters {…220px 140px 140px}` (556, já existia na base `acc1f44`); `.artifact-filters` base (811) → **regra nova (812)** → `@media (max-width:1000px)` `repeat(3,1fr)` (907) → `@media (max-width:760px)` `1fr` (915). Os três blocos móveis vêm **depois** da regra nova e têm a mesma especificidade, então vencem.

**Medido** (cada largura, `d71f2a7` × `14ad969`, número de colunas de `.artifact-filters`/`.diary-filters` e rolagem): 375, 414, 600, 639, 640, 700, 768, 800, 900, 1000 → **idênticos** em colunas, `scrollWidth` e rolagem. Artefatos: 1 coluna até 760 px, 3 de 761 a 1278 px. Diário: 3 colunas (220/140/140) até 1023 px, 3 colunas `minmax(0, 1fr)` de 1024 a 1278 px. **A única diferença está em 1023 px, a favor** (antes: Artefatos 1053 e Diário 1059 rolavam; depois 1023, sem rolar). A regra nova não deixa os filtros pior em nenhum ponto medido.

## 6. Ponto 3 — sem corte, reticências, sticky, barra lateral

- **Sem corte (IF2-1 continua corrigido):** conteúdo cortado pelo painel = 0 px em **todas** as medições de `d71f2a7` e `14ad969` (centenas de combinações de tela × largura × versão); último descendente sempre dentro do documento rolável (0 inalcançáveis). A base `acc1f44` é que cortava em 375 px na minha amostra (21 a 213 px).
- **Reticências:** `.artifact-list small` e `.diary-list p` truncam 3/3 em ambos os SHAs.
- **Sticky:** com `align-items: start` na grade da amostra (como no CSS real da tela), `aside` sticky com `top: 76 px` rolando a 1000 px em 1024, 1100 e 1280 px; barra lateral sticky (`top: 16 px`) com largura 76 px em 1024 e 256 px em 1100 e 1280 px; a 375 px a barra superior é sticky em `top: 8 px`, de 8 a 367 px, janela de 376 px, sem rolagem.

## 7. Ponto 4 — execução independente

Checkout isolado `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado em `14ad9699faa1041ce9e66f9da4693227ed8234e8` (`HEAD` conferido, `git status` limpo antes e depois), devolvido a `acc1f44` (limpo). Lockfile igual ao de `d71f2a7`; reutilizei os `node_modules` do `npm ci` anterior. Em `apps\web`, sem `.env`, sem chave, sem rede de provedor:

| Comando | Exit | Resultado |
|---|---:|---|
| `npx next typegen` | 0 | tipos gerados |
| `npm test` | 0 | tests 32 · pass 32 · fail 0 · cancelled 0 · skipped 0 |
| `npm run lint` | 0 | sem diagnósticos |
| `npm run typecheck` | 0 | sem erros |
| `npm run build` | 0 | compilado |

`d71f2a7` foi construído de novo só para o CSS de comparação (`npm run build`, exit 0).

**Nota de método (para a honestidade do relatório):** minha primeira rodada de builds correu **em paralelo** com uma segunda por engano (duas cadeias de `checkout` + `build` no mesmo checkout), e o CSS "antes" saiu da base `acc1f44`. Descartei esses resultados e refiz tudo em sequência, com `HEAD` conferido antes e depois de cada build e o CSS "antes" conferido por diff contra o "depois" (só as duas regras novas diferem). Todos os números deste relatório vêm da rodada refeita.

## 8. Achados

| ID | Sev. | Status | Achado |
|---|---|---|---|
| IF3-1 | (era S3) | **resolvido na amostra** (tela real PENDING) | seção 4: nenhuma rolagem de 1024 a 1280 px nas cinco telas; sem corte. |
| IF2-1 | (era S2) | continua **corrigido** | seção 6. |
| **IF4-1** | S3 | VERIFIED (CSS real, amostra) / HYPOTHESIS (tela real) | **Faixas estreitas ainda rolam na horizontal onde a base não rolava:** Diário **639–671 px** (precisa de 672 px) e Artefatos **761–799 px** (precisa de 800 px); a base `acc1f44` não rola nessas duas telas em nenhuma largura medida (640 a 1023 px de 8 em 8 px, e 1024, 1100 e 1280 px). **Esta rodada não muda isso** (idêntico em `d71f2a7`) e a regra nova não é a causa. Causas lidas: Diário, `.diary-filters` em `@media (max-width:1023px)` com `minmax(220px,1fr) 140px 140px` (516 px + 48 px de margem; regra já existia na base `acc1f44`, linha 2345; a casca nova tira largura do painel em relação à base; não medi a diferença exata); Artefatos, `.artifact-list li > a` com colunas fixas somando 692 px abaixo de 800 px (ver `artifact-list li > a` a 780 px: `58 240 92 82 120 20`). Efeito: 32 px de rolagem lateral; conteúdo alcançável. **Fora do critério de Yan (1024–1280 px)**; relato por estar na faixa 640–768 px pedida. Opções (não implementadas, dono Interface): `minmax(0, …)` nessas colunas, ou 1 coluna no filtro do Diário abaixo de ≈ 672 px. **Reprodução:** páginas da amostra em 640, 660, 768 e 790 px, `documentElement.scrollWidth > innerWidth` no "depois" e não na base. |
| IF3-2 | S4 | **inalterado** | A barra lateral só é sticky na vertical de 640 px para cima; com rolagem lateral ela sai da tela. O diff não toca nisso. Aparece menos, porque a janela deixou de rolar de 1024 a 1280 px, mas ainda aparece nas duas faixas do IF4-1. |
| IF2-2 | S3 | **inalterado** | o diff é só duas regras de filtro; nada em `.app-sidebar-nav`. |
| IF2-3 | S3 | **inalterado** | `git grep -c "<main" 14ad969 -- apps/web/app/app/configuracoes` vazio. |
| Observação (S4) | — | amostra | A 375 px a amostra dá `scrollWidth` 376 em Artefatos, Live e Score (1 px) nos dois SHAs; é a grade sintética de 280 px + 48 px de espaço que eu pus para testar o `sticky`, não a página (Diagnóstico, sem essa grade, dá 375). Diário rola a 572 px em 375/414 px nos dois SHAs e na base (588 px): regra já existente de `.diary-filters`, não tratada nesta rodada. |

Nenhuma severidade reduzida sem evidência; o IF3-1 sai de S3 por medição do CSS real nas cinco telas.

## 9. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | C1–C6; typegen/test 32/32/lint/typecheck/build; diff do CSS compilado = duas regras; ordem das regras móveis; IF3-1 resolvido na amostra (cinco telas × sete larguras); sem corte; reticências; sticky; IF4-1 na amostra; IF2-2/IF2-3/IF3-2 inalterados |
| HYPOTHESIS | telas reais autenticadas (a amostra é esqueleto de classes); Live, Score e Diagnóstico reais; Evidências e Configurações não amostradas; subpixel em 1279 px |
| PENDING | sessão real de `/app/**`; 1440/1920 px; leitor de tela; impressão A4; **aceite visual de Yan** |

## 10. Decisões pendentes

Orquestrador/Yan: aceitar o IF4-1 como ressalva (faixas de 639–671 e 761–799 px) ou abrir uma nova correção curta da Interface; IF2-2/IF2-3/IF3-2 no próximo lote da Interface. Yan: aceite visual e integração (a main já contém `d71f2a7`, e `14ad969` entra por merge simples quando você autorizar).
