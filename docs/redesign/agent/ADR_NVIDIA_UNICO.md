# ADR — NVIDIA como único provedor de LLM da plataforma

Data: 08/11/2026 · Estado: **PROPOSTO** (aguarda aceite de Yan) · Base: `lote2-agente` após o parser do Live · Escopo: só documento; **nenhum código migrado**, nenhuma chave, nenhuma chamada a provedor.

Legenda: **VERIFIED** = lido no código ou provado por teste · **HYPOTHESIS** = inferência sem prova · **PENDING** = exige chamada real, painel externo ou decisão de Yan.

## 1. Contexto e decisão

- Hoje há dois provedores: Live em NVIDIA (`45379b8`, `z-ai/glm-5.3-flash`, `fetch` direto) e Diário, Score e Artefatos em Groq (SDK `groq-sdk`, `openai/gpt-oss-20b`). VERIFIED.
- Em 08/11/2026 Yan decidiu, como decisão de produto, que **todo uso de LLM da plataforma passa a ser NVIDIA**. Este ADR registra o plano; o aceite do ADR e os gates da seção 7 continuam com Yan.
- Em 28/10/2026 Yan aprovou `z-ai/glm-5.3-flash` **só para o Live**; a migração das outras superfícies não foi aprovada na época (STATUS do Agente). O modelo das demais superfícies é decisão pendente (seção 6).
- Nenhum uso de NVIDIA foi comprovado com chamada real em produto: PENDING.

## 2. Inventário de todos os usos de LLM

| # | Uso | Código | Chamado por | Provedor hoje | Modelo (padrão) | Temp. | Saída máx. | Timeout / tentativas | Formato de saída | Variáveis | Versão de prompt | Códigos de erro |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Persona Live** | `lib/live/nvidia-chat.ts` (casca `generate-live-response.ts`, orquestração `generate-version.ts`) | `app/app/live/actions.ts` | **NVIDIA** (`fetch`, `integrate.api.nvidia.com/v1/chat/completions`) | `z-ai/glm-5.3-flash` | 0,5 | 1.024 | 15 s × 2 tentativas (429, 5xx, rede), sem pausa | schema só no prompt; `parseLiveResponse` valida | `NVIDIA_API_KEY`, `NVIDIA_MODEL` | `persona-live-nvidia-v1` | `not_configured`, `timeout`, `rate_limit`, `invalid_output`, `provider_error` |
| 2 | **Diário** — estruturar evidência | `lib/groq/structure-evidence.ts` | `app/app/diario/actions.ts:210` | Groq (SDK) | `openai/gpt-oss-20b` | 0,1 | 1.400 | 12 s, `maxRetries: 1` do SDK | `response_format` JSON Schema **estrito** (`persona_evidence_suggestions`) + `parseEvidenceStructure` | `GROQ_API_KEY`, `GROQ_MODEL` | sem versão gravada | `StructureEvidenceError`: `not_configured`, `timeout`, `rate_limit`, `invalid_output`, `provider_error` |
| 3 | **Score** — coerência narrativa | `lib/score/coherence.ts` | `app/app/score/actions.ts:22` | Groq (SDK) | `openai/gpt-oss-20b` | 0,1 | 1.600 | 12 s, `maxRetries: 1` | JSON Schema estrito (`persona_narrative_coherence`) + `parseCoherenceOutput`; rubrica `coherence-v1` | `GROQ_API_KEY`, `GROQ_MODEL` | `COHERENCE_RUBRIC_VERSION = coherence-v1` | `CoherenceAnalysisError`: mesmos cinco |
| 4 | **Artefatos** — seleção de fontes | `lib/groq/generate-artifact.ts` | `app/app/artefatos/actions.ts:56` e `:99` (regerar) | Groq (SDK) | `openai/gpt-oss-20b` | 0,1 | 2.400 | 15 s, `maxRetries: 1` + 1 repetição em 400 `json_validate_failed` (até 4 chamadas) | JSON Schema estrito (`persona_artifact_sources`) + `parseArtifactSelection` | `GROQ_API_KEY`, `GROQ_MODEL` | `persona-artifacts-v1` | `ArtifactGenerationError`: cinco + `gap` |
| 5 | **Agente** (read-only) | `lib/agent/agent.ts`, `output-guard.ts` | **nenhum chamador**: provedor é injetado (`AgentProvider`), só testes | nenhum (simulado) | — | — | — | `runAgent` com timeout padrão 15 s e `AbortSignal` | schema estrito em `guardRawOutput` + `parseLiveResponse` + `guardGrounding` | — | `persona-agent-readonly-v1` | `AgentError`: `timeout`, `rate_limit`, `invalid_output`, `invalid_input`, `provider_error` |

Fatos transversais, VERIFIED:
- `GROQ_MODEL` é **uma só variável** para os três módulos Groq; `NVIDIA_MODEL` hoje só vale para o Live.
- `model` e `prompt_version` são gravados em tabelas (`live_draft_versions`, versões de artefato): linhas antigas manterão `openai/gpt-oss-20b`, e as novas, o modelo NVIDIA. Não há migração de dados nem de esquema envolvida.
- A interface cita "Groq" ao usuário em `app/app/diario/[id]/page.tsx` (cinco textos: timeout, limite, indisponibilidade, "Aguarde a resposta da Groq" e o rótulo de origem `Groq`). A troca do texto pertence ao papel Interface.
- `groq-sdk` está em `package.json`; só `lib/groq/**` e `lib/score/coherence.ts` o importam. Removê-lo é mudança de dependência e lockfile (gate de Yan).
- Cada módulo repete o mesmo `try/catch` de mapeamento de erros; o Live já tem núcleo testado com `fetch` simulado (12 testes, timeout e `AbortSignal` fixados por mutação).

## 3. O que muda ao sair da Groq (diferenças a tratar)

| Tema | Groq hoje | NVIDIA (Live hoje) | Status |
|---|---|---|---|
| Garantia de formato | `response_format: json_schema` estrito | schema só no texto do prompt; o parser é a única barreira | VERIFIED |
| Suporte a `response_format`/JSON guiado no endpoint NVIDIA para este modelo | n/a | não usado; suporte não verificado | PENDING (documentação do provedor e chamada real) |
| Temperatura | 0,1 | 0,5 no Live; tarefas determinísticas (Score, Diário, Artefatos) provavelmente pedem 0,1 | HYPOTHESIS |
| Limite de saída | 1.400–2.400 tokens | 1.024 no Live; pode truncar JSON maior (Artefatos 2.400) | HYPOTHESIS |
| Repetição | SDK com backoff + repetição em `json_validate_failed` | 2 tentativas sem pausa; saída inválida não repete | VERIFIED |
| Timeouts | 12–15 s por tentativa | 15 s por tentativa | VERIFIED |
| Limite de duração da função na Vercel | desconhecido; `maxDuration` não definido no repositório | idem | PENDING |
| Qualidade em português nas tarefas de extração e pontuação | `gpt-oss-20b` em uso há semanas | `glm-5.3-flash` nunca medido nessas tarefas | PENDING |
| Rate limit/custo do endpoint NVIDIA | n/a | registro do Orquestrador cita respostas de até 90 s no endpoint trial | PENDING |

## 4. Plano de migração em lotes pequenos

Regras de todos os lotes: um provedor por commit; **testes antes** com `fetch` simulado (sem rede, sem chave); mutação em cópia para provar que os testes falham; `npm test`, lint, typecheck, build sem `.env` e `git diff --check` verdes; sem fallback automático entre provedores (cada lote se desfaz por `git revert`); nenhuma chamada real até o gate G2.

| Lote | Conteúdo | Arquivos prováveis | Testes que travam o lote | Dono |
|---|---|---|---|---|
| M0 | Decidir o formato de saída da NVIDIA: mesmo modelo e `response_format`/JSON guiado, ou schema no prompt + parser | documento + tabela da seção 3 | — (decisão após G2) | Yan + Agente |
| M1 | **Cliente NVIDIA compartilhado**: generalizar `nvidia-chat.ts` (mensagens, temperatura, `max_tokens`, timeout por chamada como parâmetros; mesmos cinco códigos de erro) sem mudar o Live | `lib/live/nvidia-chat.ts` → módulo comum, testes atuais mantidos | os 12 testes do adaptador continuam verdes; novos: parâmetros respeitados, chave só no cabeçalho | Agente |
| M2 | **Score (coerência)**: menor superfície (um chamador, rubrica discreta 0/25/50/75/100) | `lib/score/coherence.ts` | sucesso, `not_configured`, timeout, 429, 5xx, saída inválida, IDs fora da entrada; rubrica `coherence-v1` inalterada | Agente |
| M3 | **Diário (estruturar evidência)** | `lib/groq/structure-evidence.ts` | idem + `useful=false`, campos sem sustentação como `null` | Agente (+ Interface para os textos "Groq") |
| M4 | **Artefatos** (maior: 2.400 tokens, repetição de `json_validate_failed`, modo `gap`) | `lib/groq/generate-artifact.ts` | idem + blocos faltantes, regeneração por seção | Agente |
| M5 | **Agente real**: provedor NVIDIA para `runAgent` e decisão de ligar (ou não) o Agente a alguma rota | `lib/agent/**` + chamador | `AbortSignal` real, sem tool loop, zero mutações | Agente + Orquestrador |
| M6 | **Limpeza**: remover `lib/groq/**` (ou renomear para `lib/llm/**`), `groq-sdk`, `GROQ_*` do `.env.example`; textos de interface | `package.json`, lockfile, `.env.example` | build sem `groq-sdk` | Yan (dependência) + Orquestrador |

Ordem sugerida: M0 → M1 → M2 → M3 → M4 → M5 → M6, cada lote com revisão independente antes do seguinte. M2–M4 só entram em Preview depois de G3 passar para a superfície correspondente.

## 5. Riscos

1. **Perda do JSON Schema estrito** nas três superfícies hoje protegidas pelo provedor: aumenta `invalid_output`; o parser continua rejeitando fato não sustentado (VERIFIED para o Live), então o risco é de disponibilidade, não de conteúdo falso. Taxa real PENDING.
2. **Qualidade** do modelo em extração (Diário), pontuação (Score) e seleção de fontes (Artefatos) desconhecida (PENDING). Uma pontuação de coerência errada afeta o Narrative Score exibido.
3. **Latência**: pior caso de 30 s por chamada NVIDIA contra o limite da função, desconhecido; o caso de 90 s observado estoura de qualquer forma (PENDING).
4. **Produção quebra no push** sem `NVIDIA_API_KEY` na Vercel: o Live já falha assim (VERIFIED, auditoria P-1); após M2–M4 Diário, Score e Artefatos também falhariam com "não configurado". As três têm falha recuperável e o usuário mantém o registro.
5. **Um fornecedor só**: sem fallback, uma indisponibilidade da NVIDIA derruba todas as superfícies de IA. Fallback automático está fora do escopo do Agente (limite do papel) e precisa de decisão de Yan.
6. **Segredo**: a chave anterior foi exposta e tratada como comprometida; só uma chave nova, no escopo correto, serve (G1).
7. **Dados no provedor**: cada chamada envia texto do usuário (relatos, evidências) à NVIDIA; política de privacidade, retenção e consentimento precisam refletir isso antes de Production (PENDING, decisão de Yan e jurídico).
8. **Dados antigos**: linhas com `model = openai/gpt-oss-20b` convivem com as novas; relatórios que comparem versões devem filtrar por `model`/`prompt_version`.
9. Textos de interface ainda dizem "Groq" (seção 2) e ficariam incorretos ao trocar.

## 6. Decisões que o ADR pede a Yan

- **Modelo** das outras superfícies: manter `z-ai/glm-5.3-flash` ou escolher outro por superfície; uma variável (`NVIDIA_MODEL`) ou uma por superfície.
- **Formato de saída**: exigir `response_format`/JSON guiado se o endpoint suportar (M0).
- **Fallback**: nenhum (recomendado agora, por simplicidade e para não gastar dados do usuário com um segundo provedor) ou provedor secundário em lote próprio.
- **Privacidade**: texto do usuário a ser enviado à NVIDIA em todas as superfícies.
- **Remoção de `groq-sdk`** (M6).

## 7. Gates de Yan

| Gate | Condição | Status |
|---|---|---|
| G0 | Aceite deste ADR | PENDING |
| G1 | Chave NVIDIA nova, rotacionada, só em Preview (e depois Production) | PENDING |
| G2 | Uma chamada real por superfície, dados sintéticos, registrando latência, tokens e taxa de saída aceita pelo parser | PENDING |
| G3 | Qualidade aceita por superfície em conjunto sintético definido por Yan (limiar de `invalid_output` e revisão manual de amostras) | PENDING |
| G4 | Limite de duração da função confirmado frente ao pior caso (ou timeouts ajustados) | PENDING |
| G5 | Preview autorizado com as variáveis do escopo Preview | PENDING |
| G6 | Remoção de `groq-sdk` e do lockfile (M6) | PENDING |
| G7 | Production: `NVIDIA_API_KEY` presente antes do push de `main`; política de privacidade atualizada | PENDING |

## 8. O que este ADR não faz

Não altera código, dependências, variáveis, Vercel, banco nem textos de interface; não faz chamada a provedor; não define o modelo definitivo. As tarefas M1–M6 só começam por atribuição do Orquestrador.

## 9. Andamento (Lote 4)

| Lote | Estado | Observação |
|---|---|---|
| M0 | PROVISÓRIO | esquema no prompt + parser estrito; decisão final de Yan depois do G2 |
| M1 | FEITO (local) | `lib/live/nvidia-client.ts` (`callNvidiaChat`); o cliente ficou em `lib/live/` por ser a pasta autorizada ao Agente |
| M2 | FEITO (local) | Score em `lib/score/coherence.ts`; 12 s por tentativa mantidos do Groq (HYPOTHESIS: o modelo NVIDIA pode precisar de mais; medir no G2) |
| M3–M6 | PENDENTE | Diário, Artefatos, Agente real, limpeza |
