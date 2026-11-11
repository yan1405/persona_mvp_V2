# Relatório de Verificação — Interface — Lote 10, rodada B (I-4 Evidências, I-5 painel, I-6 formulários)

- SHAs revisados, um a um (`wt/interface-lote2`; série congelada em `LOTE-2_CONGELADO.md`):
  1. `8846441967e59d04eb50a9c8b2a03d8bbc05a4ff` — I-4: Biblioteca em grade de `EvidenceCard`.
  2. `d6501a610cb6c1e2c074f7f32a4564559631f478` — I-5: detalhe como `FloatingPanel`; rota direta redirecionada para `?abrir=`; Carbon removido.
  3. `e0e97d0c395ac1c56a475ec80a794d79d366f410` — I-6: formulários do Diário e das Evidências com os componentes do DS.
  4. `7e40a777ec52bd817ad86159b920b804bb02dfd1` — STATUS (topo).
- Verificador: Persona — Verificação Independente. Data: 11/11/2026. O relatório vale somente para esses SHAs. **Não é aprovação visual**; o aceite continua sendo de Yan.
- Ambiente: checkout exclusivo `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, sem `.env`, sessão e dados inteiramente fictícios contra stub local em `127.0.0.1`; nenhuma credencial, SQL, banco real, NVIDIA/Groq real, push, merge, Preview ou Production.

## 1. Resumo e gate sugerido

| SHA | Gate sugerido | Evidência principal |
|---|---|---|
| `8846441` (I-4) | **liberar com ressalvas** | Lista real em 1/2/3 colunas a 375/768/1024/1280/1440 px, 0 rolagem horizontal, 0 controle sem nome, 0 alvo abaixo de 24 px, contraste mínimo 5,45:1. O `href` descarta filtros ao abrir um cartão (I10B-2, S3, compartilhado com I-5). |
| `d6501a6` (I-5) | **reter até C10-1/C10-2** | Painel real: 343 px no celular e 600 px nas demais larguras; 1 diálogo, foco inicial em fechar, 0 overflow, 0 controle sem nome, contraste mínimo 5,41:1. Porém o foco falha em 6/7 fechamentos por Esc (I10B-1, S3) e os filtros somem ao abrir/fechar (I10B-2, S3). |
| `e0e97d0` (I-6) | **liberar com ressalvas** | Validação e envio dos formulários reais exercitados contra o stub; rascunho preservado no erro; Diário cria registro e abre painel; Evidências cria/edita, adiciona/remove link, arquiva/restaura. Zero classe legada, Carbon, hex, `px` ou estilo inline nos TSX tocados; CSS adicionado usa somente tokens/rem. |
| `7e40a77` (STATUS) | **liberar com ressalvas** | Só `AGENTES/01_interface/STATUS.md`; a descrição de I-4 a I-6 confere e mantém captura/banco como PENDING. |

**Veredito da rodada B: não integrar isoladamente antes da correção já congelada em `003261e`/`d2ebbfb`.** Sem S1 e sem S2. Dois S3 reproduzidos: retorno de foco e preservação de filtros. Eles são a mesma classe de defeito da rodada A e atingem também Evidências. I-4 e I-6 podem ser liberados com ressalvas; I-5 deve ser retido até a re-verificação da correção.

## 2. Escopo, Git e gates por SHA

- **VERIFIED:** `git diff d0d3225..7e40a77` tem 10 arquivos, +540/−513. Todos estão nos caminhos autorizados: `app/app/evidencias/**`, `app/app/diario/{diary-detail,diary-forms}.tsx`, `app/ds.css`, `components/ds/evidence-card.tsx` e `AGENTES/01_interface/STATUS.md`.
- Por commit: I-4 = 2 arquivos (+112/−97); I-5 = 5 arquivos (+257/−193); I-6 = 5 arquivos (+178/−232); STATUS = 1 arquivo (+2).
- `git diff --check` limpo. Os quatro commits têm trailer `Co-Authored-By`. Zero padrão de segredo nas linhas adicionadas.
- Varredura dos TSX tocados no topo: zero classe legada, Carbon/Lucide, hex, `px`, `style={{}}` e emoji. O CSS novo do I-5/I-6 usa tokens `--ds-*` e `rem`; zero hex, `px`, `rgb()`, `!important` ou borda colorida à esquerda nas linhas adicionadas.
- **40/40 comandos com saída 0**, em sequência e com `HEAD` estável nos quatro SHAs: `npx next typegen`, `npm test`, lint, typecheck, build e cinco testes diretos (`gate`, `ds-adherence`, `origin`, `redirect`, `qa-login-gate`). `npm test`: **149/149** em cada SHA; `ds-adherence`: 29/29.
- Nenhum teste novo nos commits I-4 a I-6; os painéis, filtros e formulários continuam sem cobertura automatizada específica (**I10B-4, S4**).

## 3. I-4 — Biblioteca de Evidências (`8846441`)

Medição do topo com React/Next reais, CSS real do build, sessão fictícia e dados fictícios:

| Largura | Colunas | Documento | Contraste mín. | Alvos < 24 px | Controles sem nome |
|---:|---:|---|---:|---:|---:|
| 375 | 1 | 375/375, sem rolagem horizontal | 5,45:1 | 0 | 0 |
| 768 | 2 | 768/768, sem rolagem horizontal | 5,45:1 | 0 | 0 |
| 1024 | 3 | 1024/1024, sem rolagem horizontal | 5,45:1 | 0 | 0 |
| 1280 | 3 | 1280/1280, sem rolagem horizontal | 5,45:1 | 0 | 0 |
| 1440 | 3 | 1440/1440, sem rolagem horizontal | 5,45:1 | 0 | 0 |

- **VERIFIED:** um `h1`, um `h2`, grade sem tabela/abas; cartões com nível, competências, quantidade de provas, origem e data; estados sem prova e com prova; título longo quebra/trunca sem alargar a página.
- **VERIFIED:** filtro `q=Python` produz 2 cartões e mantém o valor no campo antes de abrir o painel.
- **PENDING:** fidelidade da consulta e do filtro de status contra Supabase/RLS reais. O stub não é evidência de semântica do banco.

## 4. I-5 — painel da Evidência (`d6501a6`)

- **VERIFIED:** um único `<dialog>` modal; nome acessível pelo título; foco inicial no botão “Fechar painel (Esc)”; `TraceLine` de origem → evidência → prova; seções de edição, origem/provas, uso e arquivamento.
- **VERIFIED:** 343 × 868 px a 375; 600 × 868 px nas larguras 768/1024/1280/1440; documento e diálogo sem overflow horizontal; zero alvo abaixo de 24 px; contraste de 52 amostras sem falha (mínimo 5,41:1).
- **VERIFIED contra stub:** editar evidência (`PATCH`), adicionar link (`POST`), remover link (`DELETE`), arquivar e restaurar (`PATCH`). O código de `actions.ts` não foi alterado.
- **Teclado:** Tab percorre os controles do painel. No ponto de retorno do ciclo, `document.activeElement` fica momentaneamente no `<body>` e a próxima tecla volta ao botão fechar; o fundo permanece inerte. Impacto com leitor de tela é **HYPOTHESIS** e fica como S4 (**I10B-3**), pois NVDA/VoiceOver não foram executados.

### I10B-1 — S3 — retorno de foco instável

**VERIFIED:** em 7 aberturas/fechamentos por Esc, o foco voltou ao cartão em 1 e terminou no `<body>` em 6. Reprodução local rápida, sem rede externa. O mecanismo é o mesmo da rodada A: `EvidencePanel.close()` faz `router.replace("/app/evidencias")` e tenta `focus()` 50 ms depois. A corrida entre desmontagem do diálogo e troca de rota deixa a pessoa que usa teclado sem posição previsível.

### I10B-2 — S3 — filtros descartados

**VERIFIED:** com `?q=Python&...`, abrir o cartão navega para `?abrir=<id>`; a lista de fundo volta de 2 para 5 cartões e a busca fica vazia. Esc fecha em `/app/evidencias`, sem filtros. Causa por leitura: I-4 monta `href={`/app/evidencias?abrir=${id}`}` e I-5 fecha sempre em `/app/evidencias`.

## 5. I-6 — formulários do Diário e das Evidências (`e0e97d0`)

- **Diário — VERIFIED:** entrada curta mostra `alert` “Escreva entre 40 e 2000 caracteres.” e `status` “Revise o registro.” sem apagar o rascunho. Entrada válida fictícia cria o registro, abre o painel com `notice=created`, preserva texto/data/contexto e mostra o aviso de sucesso.
- **Evidências — VERIFIED:** campos têm nomes acessíveis; envio incompleto desloca o foco ao primeiro campo obrigatório faltante sem apagar o título. A execução anterior no mesmo topo registrou criação de evidência, edição, vínculo/remoção de prova e arquivamento/restauração no stub.
- **VERIFIED por diff:** nomes de campos, ações e validações de domínio permanecem; `actions.ts`/`lib/**`/RPC não foram tocados. A mudança substitui os controles e botões legados por `Input`, `Textarea` e `Button` do DS.
- **PENDING:** mensagens/validações contra Supabase real, RLS, conflitos, latência e falhas de rede. Nenhuma exclusão permanente real foi executada.

## 6. Achados

| ID | Sev. | Rótulo | SHA | Resumo |
|---|---|---|---|---|
| I10B-1 | **S3** | VERIFIED | `d6501a6` | Foco termina no `<body>` em 6/7 fechamentos por Esc; retorno usa `setTimeout(50)`. |
| I10B-2 | **S3** | VERIFIED | `8846441` + `d6501a6` | Abrir/fechar o painel descarta filtros e o recorte da lista. |
| I10B-3 | S4 | VERIFIED/HYPOTHESIS | `d6501a6` | No ciclo de Tab, o foco passa pelo `<body>` antes de voltar ao botão fechar; fundo inerte, impacto em leitor de tela não medido. |
| I10B-4 | S4 | VERIFIED | I-4 a I-6 | Nenhum teste automatizado novo para lista, painel, foco, filtros ou formulários; 149 testes antes/depois. |

## 7. Limites e estados de evidência

- **VERIFIED:** Git/escopo, gates por SHA, build, varredura de segredo/legado/Carbon, lista e painel em cinco larguras, contraste calculado, alvos, nomes acessíveis, teclado real e ações contra o stub local.
- **APPROVED:** nenhuma aprovação visual; somente Yan pode aprovar.
- **HYPOTHESIS:** impacto do foco transitório no `<body>` para leitores de tela; comportamento/latência com Supabase remoto.
- **PENDING:** QA real/RLS, Microsoft, NVDA/VoiceOver, Safari, Preview/Production, modo escuro, impressão e aceite visual.
- **BLOCKER:** I10B-1 e I10B-2 para integrar I-5 sem a correção C10-1/C10-2. A correção já está congelada em `003261ecfa9866f2ce1c6afe8841a23b0af7d103` + STATUS `d2ebbfb6560f30ca9ce084621868a60c34817764` e precisa de relatório próprio.

## 8. Comandos, artefatos e percentual

- Comandos: `git diff --stat|--name-status|--check`, `git log --format`, `git grep`, varredura das linhas adicionadas; sequência registrada em `seq13.sh`/`seq13.out`; `npx next typegen`, `npm test`, lint, typecheck, build e testes diretos por SHA.
- Navegador: app em `127.0.0.1:3198`, stub em `127.0.0.1:3199`, ponte de cookie fictício em `127.0.0.1:3197`; Chrome headless isolado para 375/768/1024/1280/1440 e automação nativa para mouse/teclado.
- Evidências fora do repositório: `...\scratchpad\l13\measure13.json`, `measure-panel13.json`, `evidencias-{largura}.png`, `evidencia-painel-{largura}.png`, logs por SHA e `stub.log`.
- Arquivo escrito no repositório: somente este relatório e a atualização do `AGENTES/04_verificacao/STATUS.md`.
- Percentual comprovado do plano ponderado: **0% concluído integralmente**. Os 4/4 SHAs e 40/40 gates foram exercitados, mas nenhum eixo ponderado está completo: funcional depende do QA/RLS real; segurança do banco não foi testada; UX não tem leitor de tela/aceite; release não tem Preview.

## 9. Próximo gate

Rever `003261e`/`d2ebbfb` com a mesma bateria: foco por Esc em Diário e Evidências (pelo menos 7 amostras cada), preservação exata de todos os parâmetros de filtro ao abrir/fechar, Score `?abrir=calculo`, teste novo `panel-href`, gates e cinco larguras. Até isso, **não integrar a série completa do Lote 10**.
