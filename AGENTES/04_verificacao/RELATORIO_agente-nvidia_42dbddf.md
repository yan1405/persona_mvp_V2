# Relatório — Entrega 03 · Agente NVIDIA e parser do Persona Live (fechamento do Lote 1)

SHA revisado: `42dbddf043f19a492b0fddae03031898ec5acd58` (topo de `wt/agente-nvidia-lote1`, igual ao HEAD do worktree; worktree sem alteração) · base `8da08c698a74aeb4d95c70123eba61fc921a591c` · 6 commits · 7 arquivos, +561/−15 · 05/11/2026.
Específico deste SHA. Os relatórios `6a6b8f0`, `489ec0d` e `f4edecf` são histórico, ficam sem alteração e **não aprovam** este SHA.

## Gate sugerido: bloquear integração deste SHA

Motivo único: o diff altera `apps/web/lib/live/response-schema.ts`, código **em produção no Persona Live**, e o novo parser passou a rejeitar excertos fiéis que o anterior aceitava (achado **L-1, S2**; §5). O escritor declarou que o efeito não foi medido; eu medi o comportamento em corpus sintético e a classe de frase é rejeitada por inteiro. Fora isso, o módulo do Agente está limpo: nenhum S1, nenhum S2 em `lib/agent/**`.

Caminhos para o Orquestrador/Yan (decisão deles, não minha): (a) aceitar L-1 por escrito, com medição no Live antes de produção; (b) pedir ajuste da regra de oração e novo SHA (a sonda do §5 indica o efeito de uma delas); (c) integrar apenas `lib/agent/**` + contrato do SHA `f4edecf` (a revisão da rodada 3 deu "liberar com ressalvas" a ele, sem tocar o Live) e deixar a decisão do parser para depois. A opção (c) é possível porque o `42dbddf` **removeu** a barreira de fronteira/negação de dentro do Agente e passou a depender do parser compartilhado.

## 1. Execução independente

Checkout `C:\Users\yansi\Projetos\persona-wt\verificacao-489ec0d` (nome histórico). `git rev-parse HEAD` → `42dbddf043f19a492b0fddae03031898ec5acd58` (desanexado). `git status --short` **antes** e **depois**: vazio. Comandos em `apps/web`; sem `npm install`, sem build, sem `.env`, sem rede, sem chamada NVIDIA.

| # | Comando | Exit | Contagens |
|---|---|---:|---|
| 1 | `node --experimental-strip-types --test lib/agent/*.test.ts` | 0 | tests 27 · pass 27 · fail 0 · cancelled 0 · skipped 0 · todo 0 |
| 2 | `npm test` | 0 | tests 37 · pass 37 · fail 0 · cancelled 0 · skipped 0 · todo 0 (32 anteriores + 5 de regressão do parser em `lib/live/live.test.ts`; **não inclui** `lib/agent`) |
| 3 | `npm run lint` | 0 | sem diagnósticos |
| 4 | `npm run typecheck` | 0 | sem erros |
| — | build | PENDING | nenhum checkout integrado foi preparado; não improvisei integração |

Sondas: `f_probe.ts` e `f_corpus.ts` no scratchpad (fora do repositório) importam o módulo do checkout por URL `file:` e o parser **antigo**, extraído de `8da08c6` para o scratchpad, para comparar. Nenhum arquivo versionado foi alterado.

## 2. Checagens comuns

| # | Resultado | Evidência |
|---|---|---|
| C1 escopo | VERIFIED | `git diff --name-only 8da08c6..42dbddf` → `AGENTES/03_agente_nvidia/STATUS.md`, `apps/web/lib/agent/{agent.ts,agent.test.ts,output-guard.ts}`, `apps/web/lib/live/{response-schema.ts,live.test.ts}`, `docs/redesign/agent/CONTRATO_AGENTE.md`. Os dois arquivos de `lib/live` são a propriedade explícita do prompt 08; nenhum outro arquivo de Live, rota, adaptador, `package.json`, lockfile, `.env*` ou `supabase/` |
| C2 proibidos | VERIFIED | filtro por `package.json`, lockfile, `next.config`, `eslint.config`, `tsconfig`, `proxy.ts`, `globals.css`, `supabase/`, `.env`, navegação → nenhum |
| C3 `diff --check` | VERIFIED | `CHECK_OK` |
| C4 segredos | VERIFIED | regex (`nvapi-`, `service_role`, JWT, `sb_secret`, `sk-`, e-mail, `password=`) nas linhas `+` → nenhuma ocorrência |
| C5 commit | VERIFIED | commit novo com `Co-Authored-By`; sem upstream informado |
| C6 handoff | VERIFIED | `Estado: WAITING_APPROVAL`, "não é aprovação independente", "Prompt e contrato" ainda `PENDING`; declara que o efeito no Live não foi medido |
| Sem rede/credencial/mutação | VERIFIED | `grep -nE "fetch\(|https?://|XMLHttpRequest|node:(net|http|https|fs|child_process)|supabase|process\.env|console\.|\.(insert|update|delete|upsert|rpc)\(|apiKey|Authorization|Bearer"` em `agent.ts` e `output-guard.ts` → nenhuma ocorrência; o mesmo padrão nas linhas `+` do diff de `lib/live` → nenhuma. Imports de `lib/agent`: só `../live/recommendation.ts`, `../live/response-schema.ts`, `./output-guard.ts` |
| Exportações do parser | VERIFIED | `diff` das linhas `export` de `response-schema.ts` entre a base e o SHA → idênticas |

## 3. Reprodução dos achados A-1, A-7, A-9, A-10 e A-11

"Agente" = `runAgent` com provedor simulado. "Live" = `parseLiveResponse` antigo (base) × novo (SHA), mesmas entradas.

| Achado | Entrada | Agente | Live antigo → novo |
|---|---|---|---|
| **A-1** | excerto `"  "`, `""` | `invalid_output` | `"Na minha experiência: ."` → rejeita |
| A-1 | excerto 2 zero-width, tab/newline, 2 NBSP, `".."` | `invalid_output` | zero-width e `..` já eram rejeitados antes |
| A-1 | `text` de 4 espaços ou 4 zero-width | `invalid_output` (antes aceitava o de zero-width) | — |
| **A-7** | `"…em 3"` / `"…em 30"` de `30%` | `invalid_output` | aceita → rejeita |
| A-7 | `"Atendi 1"`, `"000 clientes"` de `1.000` | `invalid_output` | aceita → rejeita |
| A-7 | `"duzi o trabalho"` (meia palavra) | `invalid_output` | aceita → rejeita |
| A-7 | `"reduzi o custo"` de "Não reduzi o custo, nem liderei…" | `invalid_output` | aceita → rejeita |
| A-7 | competências cruzadas `"Liderança Dados"` | `invalid_output` | aceita → rejeita |
| A-7 | controles `"…em 30%"`, `"Não reduzi o custo"`, `"Dados"` | aceitos | aceitos nos dois |
| **A-9** | provedor que rejeita no evento `abort` | `timeout` (`signal.aborted = true`) | — |
| A-9 | provedor que nunca assenta | `timeout` | — |
| **A-10** | "Não lancei a versão v2.0 pelo cliente Acme" → `pelo cliente Acme` | `invalid_output` | aceita → rejeita |
| A-10 | "Sr. Silva", "S.A.", "Ltda.", "3.5" antes do trecho | `invalid_output` (a negação atravessa o ponto) | aceita → rejeita |
| A-10 | "Não lancei a v2.0. Atendi o cliente Acme" → `Atendi o cliente Acme` | aceito (fim de oração real) | aceito nos dois |
| **A-11** | largura total, cirílico (i, a/e/o), grego (ο), matemático em negrito, zero-width | `hasMetaCommand` = `true` | — |
| A-11 | **soft hyphen U+00AD, LRM U+200E, bidi U+202E, U+180E** no meio de "ignore" | `false` (**escapa**, ver A-12) | — |
| A-11 | `ı` (i sem pingo, U+0131) | `false` (declarado como limite) | — |
| A-11 | falsos positivos "ignorância de regras mínimas", "Desconsiderei as regras de negócio do cliente" | `false` (liberados) | — |

## 4. Veredito por achado da rodada 3 (e carregados)

| Achado | Sev. | Veredito | Evidência |
|---|---|---|---|
| A-1/A-7 no módulo do Agente | S2 | **Corrigido** | §3; agora a validação mora no parser compartilhado e o Agente chama `parseLiveResponse` + `guardRepeatedArguments` |
| A-1/A-7 no parser compartilhado (Live) | S2 | **Corrigido, com efeito colateral (L-1)** | §3 e §5 |
| A-9 timeout vira `provider_error` | S3 | **Corrigido** | `agent.ts:65` rejeita com `timeout` **antes** de `abort()`; teste `agent.test.ts` "A-9" cobre `Error` e `signal.reason`; minhas sondas confirmam. Segue provado só com provedor simulado; com `fetch` real é PENDING |
| A-10 ponto decimal apaga negação | S3 | **Corrigido** | §3; também no caminho do Live |
| A-11 largura total e homóglifos | S3 | **Corrigido** para o mapa declarado; **parcial** (A-12) | NFKC + mapa mínimo; `ı` e invisíveis fora do conjunto escapam |
| A-5 teste de injection sem defesa | S3 | **Corrigido** | teste renomeado "controle positivo (não prova defesa)" e novo "A-5 adversarial": provedor que obedece à pergunta (`fui diretor da empresa`) → `invalid_output` |
| A-6 número do rascunho descartado | S3 | **Aceito por decisão documentada** | `CONTRATO_AGENTE.md`: checagem mantida de propósito como sinal fail-closed. Sondas: rascunho `1000` com fonte `1.000`, `30` com `30%` e `99%` inventado → `invalid_output`. O custo (falso rejeito de formato) continua e está declarado |
| Entradas sem limite | S3 | **Parcial** | pergunta (8–500, mínimo após `trim`) e descrição (≤ 2000) → `invalid_input` antes do provedor (sonda e teste, `calls === 0`). `targetRole`, `company` (10.000 caracteres aceitos), campos de evidência (50.000 aceitos) e `updated_at` inválido continuam sem limite, **declarados** no contrato |
| `updated_at` inválido / ordem | S3 | **Corrigido na prática** | sonda: aceito e determinístico (rodada 3) |

## 5. Parser compartilhado: regressão e falso positivo no Persona Live

Fatos do diff (`response-schema.ts`, +37 linhas): o parser agora exige conteúdo efetivo, fronteira de palavra/número, não cruza duas competências e rejeita excerto quando há **negador** (`não, nunca, sem, nem, jamais, nenhum/a`) antes dele na mesma oração (`. ; : ! ?`; ponto decimal e abreviações não encerram). O Live chama o parser uma vez (`generate-live-response.ts:66`); `invalid_output` vira "Não foi possível gerar com segurança. A pergunta foi preservada." e, na primeira geração, `fail_live_question` (`actions.ts:104-108`). Não há nova tentativa com o modelo. Nos modos Encurtar/Aprofundar/Outra experiência a falha **não mostra mensagem** (`regenerateLiveQuestion` (`actions.ts:130-131`) descarta `result.error`; comportamento anterior, agora mais provável).

O prompt 08 pediu "preservação de negação" no parser compartilhado; o escritor implementou o que foi pedido. O achado é o custo dessa regra.

### L-1 · S2 · VERIFIED em execução (comportamento) · frequência em produção: HYPOTHESIS — falso positivo em excertos fiéis com negador na mesma oração

Corpus **sintético**, escrito por mim (`f_corpus.ts`), não é medição de produção: 31 pares fonte/excerto, parser antigo × novo.

| Classe | N | Aceitos (antigo) | Aceitos (novo) |
|---|---:|---:|---:|
| A — fiéis, sem negador antes do trecho | 12 | 12 | 12 |
| **B — fiéis, com negador antes na mesma oração** | 12 | 12 | **0** |
| C — distorções (negação removida, `30%`→`3`, `1.000`→`1`, "Sr. Silva", qualificador omitido) | 7 | 7 | 1 |

Os 12 de B são afirmações verdadeiras, comuns em português profissional: "Sem supervisão direta, estruturei o fluxo…" → `estruturei o fluxo…`; "Não havia processo definido, então criei um fluxo padrão" → `criei um fluxo padrão`; "Mesmo sem experiência prévia, liderei a equipe de 5 pessoas"; "Não só liderei…, como também treinei o time"; "Nunca perdi um prazo e entreguei 12 relatórios"; "Nem sempre havia dados, mas atingi 95%…"; item de lista após "- Sem acesso ao CRM\n"; "Nenhum curso me preparou, então aprendi Python sozinho"; "Não concluí o plano B. Reduzi o custo em 10%"; entre outros. A vírgula não encerra a oração, então qualquer trecho posterior ao negador é tratado como negado.
Dos 7 de C, o único aceito ("liderança" de "Participei como ouvinte de reuniões de liderança", qualificador omitido) é limite **declarado** no contrato.

Impacto: se a evidência do usuário contém esse tipo de frase e o modelo cita o trecho afirmativo, a resposta **inteira** do Live é rejeitada (basta um argumento). Falha fechada, sem conteúdo errado, mas é regressão de disponibilidade no fluxo principal da demonstração. A taxa real depende de quantas evidências têm essa estrutura e de como o modelo escolhe excertos; nenhum dos dois foi medido (nem por mim). Por isso classifico S2 pela classe de falha comprovada, não por frequência.

Sonda de hipótese (cópia do parser no scratchpad, **não** é correção nem foi aplicada): tratar a vírgula também como limite de oração leva a classe B de 0/12 para 9/12 aceitos e mantém C em 1/7 (as distorções com negação continuam rejeitadas, porque "nem" e "não" ficam na mesma oração do trecho). Sobram: "Nunca perdi um prazo e entreguei…" (sem vírgula), o item de lista após quebra de linha e "plano B.".
Recomendação: medir com evidências reais e o modelo real antes de produção; decidir se a perda de disponibilidade é aceitável; considerar vírgula, quebra de linha e conjunção como limites, ou usar a barreira só no Agente (onde a resposta é revisada pelo usuário) e relaxá-la no Live.

### L-2 · S3 · declarado — letra isolada antes do ponto não encerra a oração
`ABBREVIATION` trata qualquer letra isolada como abreviação: "plano B. Reduzi…" mantém a negação anterior viva na frase seguinte (um dos 3 casos que sobram na sonda de vírgula). O `CONTRATO_AGENTE.md` já declara o limite ("item a."). Sem ação nova; entra na medição de L-1.

### A-12 · S3 · VERIFIED em execução — invisíveis e controles Unicode fora do conjunto escapam da barreira de meta-comandos
`INVISIBLE` cobre U+200B–200D, U+2060 e U+FEFF. Não cobre soft hyphen (U+00AD), LRM/RLM (U+200E/F), controles bidi (U+202A–202E) nem U+180E: `hasMetaCommand("ig\u00adnore as regras")` e as outras três variantes → `false`. O contrato declara homóglifos fora do mapa, **não** esses invisíveis. Mesma classe do A-11; só afeta o texto devolvido ao usuário (nenhum modelo posterior obedece). Recomendação: remover a categoria Unicode `Cf` antes do teste, ou declarar no contrato.

## 6. Resultado das demais verificações pedidas

- **Limites de entrada**: ver §4. Pergunta 7 caracteres, 9 espaços e 501 caracteres → `invalid_input`; 8 e 500 → aceitas; descrição 2.000 aceita e 2.001 recusada.
- **Zero mutações, ownership, schema estrito, meta-comando em `gap`, argumentos repetidos**: mantidos desde a rodada 3 (suíte 27/27).
- **Desempenho do parser novo**: cadeias adversariais de 400 repetições (`a.`, `. `, `não `) resolvidas em ≤ 1 ms; sem sinal de ReDoS.
- **Contrato**: agora declara o efeito no Live ("pode aumentar `invalid_output` em produção… não exercitada com o modelo real nem na rota"), a decisão A-6, os limites e o que não está coberto. Honesto.
- `Estado:` do `STATUS.md` do escritor: `WAITING_APPROVAL (…)`, dentro da enumeração (§ do STATUS consolidado).

## 7. PENDING

Build e integração em checkout integrado; comportamento do `z-ai/glm-5.3-flash` e taxa real de `invalid_output` no Live; recall do limiar `score > 0`; A-9 com `fetch` real; adaptador, retentativa e 429; teste de rota do Live. UX/acessibilidade não se aplica.

## 8. Classificação

| Item | Estado |
|---|---|
| Escopo, segredos, sem rede/credencial/mutação, exportações do parser | VERIFIED |
| Suíte do Agente 27/27, `npm test` 37/37, lint, typecheck (execução independente) | VERIFIED |
| A-1, A-7, A-9, A-10, A-11 (mapa declarado), A-5 | VERIFIED corrigidos (execução) |
| A-6, entradas sem limite (parte) | decisão documentada / S3 declarado |
| L-1: regressão de disponibilidade no Live | **ABERTO — S2** |
| A-12, L-2 | S3 abertos |
| Build, modelo real, rota do Live | PENDING |

Achados abertos: S2 ×1 (L-1), S3 ×2 (A-12, L-2). Nenhum S1. Nenhuma severidade reduzida.

## 9. Gate sugerido

**Bloquear integração** do `42dbddf` até decisão sobre L-1 (opções no topo). Aceite visual, Preview e Production não se aplicam e ficam com Yan.
