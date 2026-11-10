# Auditoria de aderência ao Persona Design System (10/11/2026)

Pedido de Yan: o design antigo deve ser excluído por completo; tudo (login e qualquer outra área) deve ser repensado a partir do Design System feito no Claude Design. Fonte do DS: `C:\Users\yansi\Downloads\Persona Design System` (readme, SKILL, tokens, componentes) e protótipos T4.1–T4.8 em `Claude Design projects`. App auditado: `main` local (`0a39a51`), `apps/web`. Rótulos: VERIFIED (medido ou lido no código), HYPOTHESIS, PENDING. Auditoria estática (código, CSS, contagens): **não** houve comparação pixel a pixel nem aceite visual autenticado (PENDING).

## 1. Veredito

**VERIFIED — o app não segue o DS.** A "Fundação" do Lote 2 foi uma camada `.ds-surface` que repinta o CSS antigo, não uma reconstrução. `app/globals.css` tem 4.369 linhas: 3.246 (74%) são o sistema antigo (tema escuro, raio 4–5 px, fonte mono) e 1.124 são a camada DS. Só 8 telas receberam a camada; a casca, o login, o onboarding, os erros, os termos e as páginas de detalhe continuam no design antigo. Isso contradiz a decisão de Yan (exclusão total) e o próprio comentário do CSS ("ao fim da migração o legado é removido"). Reconstruir, não remendar.

## 2. Telas e áreas que precisam ser refeitas

| Área | Situação | Evidência | Ação |
|---|---|---|---|
| `/entrar` (login) | Design antigo | Tema escuro; 23 de 30 classes só existem no CSS antigo; overline mono; raio 4 px | Refazer; **sem mock no DS** |
| `/onboarding` | Design antigo | 11 de 24 classes só do antigo; `page.tsx` 5 de 5 | Refazer com `StepFlow` do DS; **sem mock** |
| `/auth/erro` | Design antigo | 4 de 5 classes só do antigo | Refazer (erro calmo e explicativo); **sem mock** |
| `/termos`, `/privacidade` | Design antigo | Páginas legais fora de qualquer camada DS | Refazer; **sem mock** |
| Casca (`AppShell`, `AppNavigation`) | Design antigo | Barra lateral escura, ícones Carbon, logo compacta, botão "Registrar agora"; sem `AppHeader` (Buscar ou perguntar + botão Agente), sem barra flutuante branca (raio 22) nem painel (raio 28) | Refazer com `AppShell`, `Sidebar` e `AppHeader` do DS |
| `/app/diario/[id]` | Design antigo | 23 de 31 classes só do antigo | Refazer como painel flutuante ancorado (DS) |
| `/app/evidencias/[id]` | Design antigo | 22 de 30 classes só do antigo | Idem |
| `/app/artefatos/[id]`, `/novo` | Parcial | Página ds-surface; formulários com 9 classes antigas | Refazer como workspace de página inteira (DS) |
| `/app/configuracoes/conta`, `/dados` | Parcial | Subpáginas sem a camada DS | Refazer |
| Formulários (`diary-forms`, `evidence-forms`, `artifact-forms`, `profile-form`, `diagnostic-form`, `data-form`, `live-forms`) | Parcial | Dependem de classes antigas repintadas | Reescrever com `Input`, `Button` e `Switch` do DS |
| Início, Diário (lista), Evidências (lista), Live, Score, Artefatos (lista), Diagnóstico, Configurações | "Migradas" só na camada | Sem destination tiles, `FocalJourney`, `ScoreRing`, `EvidenceCard`, `EntryCard`, `ArtifactCard`, `FloatingPanel` (0 ocorrências no app) | Recompor com os componentes do DS |

## 3. Aderência ao DS (achados)

| # | Severidade | Achado | Evidência |
|---|---|---|---|
| A1 | Alto | Ícones **Carbon** (`@carbon/icons-react`) em 3 arquivos; o DS exige **Lucide**, traço 1,75 (72 glifos em `assets/icons`) | `app-navigation.tsx`, `settings-navigation.tsx`, `evidencias/[id]/page.tsx`; `package.json` |
| A2 | Alto | Tema escuro e raios 4–5 px no sistema antigo; o DS é claro com raios 16/22/28/pílula | `color-scheme: dark` ×3; 16 usos de `--radius-control/special` |
| A3 | Alto | Fonte mono **Geist Mono** carregada no layout raiz e 46 usos de `font-mono`; o DS não tem mono ("números usam Inter tnum") | `app/layout.tsx`; `globals.css` |
| A4 | Alto | Borda colorida à esquerda em 13 regras antigas e 2 na camada DS; o DS proíbe | `border-left: Npx solid` |
| A5 | Alto | Detalhes em páginas separadas; o DS manda painel flutuante ancorado (560–640 px) ou seções empilhadas com índice | `diario/[id]`, `evidencias/[id]` |
| A6 | Alto | Sem `AppHeader`, sem `AppShell` do DS, sem `Sidebar` branca flutuante; logo `compacta` em vez de `persona-lockup-h` | `components/shell`, `app-navigation.tsx` |
| A7 | Médio | Início sem os quatro destination tiles e sem `ScoreRing`; `FocalJourney` só aproximado | `inicio/page.tsx` |
| A8 | Médio | Títulos sem ponto final ("Biblioteca profissional", "Configurações", "Privacidade", "Termos da fase de testes"); o DS: "Headlines end with a period" | 4 de 13 H1 literais |
| A9 | Médio | Valores literais: 88 hex e muitos px no antigo; na camada DS 5 hex e 183 linhas com px literal ao lado de 184 com token de espaçamento. O DS traz regras oxlint (`_adherence.oxlintrc.json`) que proíbem hex/px literal e fonte fora de Inter/Jakarta | contagem em `globals.css` |
| A10 | Médio | Duas camadas de tokens (`--indigo-*`/`--radius-*` antigos e `--ds-*`) | `globals.css` linhas 3–80 |
| A11 | Baixo | Foco com contorno simples de 2 px (`indigo-600`); o DS especifica anel duplo (`focusRing.jsx`). **Desvio documentado por contraste** (o anel aprovado dá ~2,7:1) | decisão de Yan/Design: manter ou atualizar o DS |
| A12 | Baixo | Borda de campo `n-400` em vez de `n-200` do DS (contraste WCAG 1.4.11). **Desvio documentado** | idem A11 |
| A13 | Baixo | Resíduos do scaffold em `public/` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) | `public/` |
| A14 | Baixo | O DS diz que a entrada é só "Entrar com Microsoft"; o formulário de QA é exceção local e fica invisível em produção (verificado no Lote 7) | Lote 7 |

Pontos **conformes** (VERIFIED): tokens de cor, paleta Indigo+Slate, fontes Plus Jakarta Sans e Inter locais com licença OFL, copy em pt-BR e "você" nas telas migradas, sem tabela e sem aba, honestidade (a IA sugere, a pessoa confirma).

## 4. Lacunas do DS (não há mock para estas telas)

T4.1–T4.8 cobrem Início, Diário, Evidências, Persona Live, Artefatos, Narrative Score, Configurações e Agente Persona. **Não existem para:** Entrar, Onboarding, Diagnóstico (formulário em etapas), Erro de autenticação, Termos e Privacidade. Para essas, Yan desenha no Claude Design ou autoriza derivar dos componentes existentes (`StepFlow`, `Card`, `Input`, `Button`). O **Agente Persona** (T4.8) está marcado no DS como não implementado: não construir, nem afirmar na interface que existe.

## 5. Plano de refação proposto

- **Lote 8 — núcleo DS (Interface):** tokens do DS como único CSS global, fontes, Lucide (remover Carbon e Geist Mono) e componentes React portados dos `.jsx` do DS (Button, Badge, Chip, Input, Switch, Card, FocalCard, DestinationTile, Sidebar/NavItem, AppHeader, AppShell, EvidenceCard, EntryCard, ArtifactCard, FloatingPanel, SectionIndex, StepFlow, TraceLine, ScoreRing), com o `_adherence.oxlintrc.json` como gate de lint.
- **Lote 9 — casca e entrada:** casca nova, Entrar (com o formulário de QA no mesmo padrão), Onboarding, Erro, Termos, Privacidade.
- **Lotes 10 a 12 — telas:** Início; Diário e Evidências (com painéis flutuantes); Live, Score, Artefatos, Diagnóstico e Configurações. **Remoção do CSS antigo, de `.ds-surface`, do Carbon e do Geist Mono** ao fim, com varredura que prove zero referência.
- **Em paralelo (Backend/Agente):** corrigir o redirect aberto (`getSafeNextPath`, S3) e o destino do login de QA (`/onboarding`).
- **Verificação:** comparação das capturas reais (375, 768, 1024, 1280 e 1440 px) com os `shots` do DS, por tela. Sem aceite visual de Yan, nada é "VERIFIED visual".
- O aceite visual (item 5) fica **para depois da reconstrução**; antes só vale um teste de fumaça funcional.

## 6. Decisões de Yan

1. Autorizar a reconstrução total (recomendado) em vez de continuar a camada `.ds-surface`.
2. Telas sem mock: Yan desenha no Claude Design ou autoriza derivar dos componentes.
3. Manter os dois desvios de acessibilidade (A11, A12) ou levá-los ao DS.
4. Agente Persona: não construir agora.
