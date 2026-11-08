# Persona Live — Groq × NVIDIA (comparação por fatos do código)

Data: 08/11/2026 · Base: `acc1f44` · Escopo: só o adaptador do Persona Live. Nenhuma chamada a provedor, nenhuma chave.

Legenda: **VERIFIED** = lido no código ou provado por teste (`lib/live/nvidia-chat.test.ts`, provedor simulado) · **HYPOTHESIS** = inferência sem prova · **PENDING** = exige chamada real, painel externo ou decisão de Yan (não executado aqui).

Fonte Groq: `git show 06de045:apps/web/lib/groq/generate-live-response.ts` (o que roda hoje em Production). Fonte NVIDIA: `apps/web/lib/live/nvidia-chat.ts` (troca em `45379b8`).

## 1. Fatos do código

| Item | Groq (`06de045`, Production) | NVIDIA (`45379b8`, main local) | Status |
|---|---|---|---|
| Modelo padrão | `openai/gpt-oss-20b` (`GROQ_MODEL`) | `z-ai/glm-5.3-flash` (`NVIDIA_MODEL`) | VERIFIED |
| Versão do prompt gravada | `persona-live-v1` | `persona-live-nvidia-v1` | VERIFIED |
| Temperatura | 0,1 | 0,5 (`top_p` 1) | VERIFIED |
| Limite de saída | `max_completion_tokens` 1.800 | `max_tokens` 1.024 | VERIFIED |
| Garantia de formato | `response_format: json_schema` com `strict: true` (o provedor força o schema) | Nenhuma no provedor: o schema vai como texto no prompt do sistema ("somente JSON válido") | VERIFIED |
| Validação final | `parseLiveResponse` (igual nos dois) | `parseLiveResponse` (igual nos dois) | VERIFIED |
| Cliente | SDK `groq-sdk` | `fetch` direto em `https://integrate.api.nvidia.com/v1/chat/completions` | VERIFIED |
| Timeout por tentativa | 15 s (SDK) | 15 s (`AbortSignal.timeout`) | VERIFIED |
| Tentativas | SDK `maxRetries: 1` (408, 409, 429, 5xx, conexão) + 1 repetição extra em 400 `json_validate_failed`; no pior caso 2 × 2 = 4 chamadas | 2 chamadas no máximo, para 429, 5xx e erro de rede/timeout; 4xx ≠ 429 não repete | VERIFIED (NVIDIA por teste; Groq por leitura do código e do SDK em `node_modules`) |
| Pior caso de espera da ação | ≈ 60 s (4 × 15 s, mais pausas do SDK) | ≈ 30 s (2 × 15 s) mais o tempo da ação | VERIFIED por cálculo; tempo real PENDING |
| Pausa entre tentativas | SDK aplica backoff | Nenhuma: a segunda tentativa sai logo após a primeira, inclusive em 429 | VERIFIED |
| Saída não-JSON / reprovada | `invalid_output` | `invalid_output`, sem nova tentativa | VERIFIED (teste) |
| Mapeamento de erros | `not_configured`, `timeout`, `rate_limit`, `invalid_output`, `provider_error` | Os mesmos cinco códigos | VERIFIED (teste) |
| Chave | `GROQ_API_KEY`, só no servidor | `NVIDIA_API_KEY`, só no cabeçalho `Authorization`; ausente do corpo e das mensagens de erro | VERIFIED (teste) |
| Variáveis na Vercel (projeto `persona-mvp-v2`) | `GROQ_API_KEY`, `GROQ_MODEL` existem | `NVIDIA_API_KEY` **não existe**; `NVIDIA_MODEL` não existe (cai no padrão) | VERIFIED pela auditoria P-1 de 08/11/2026; reconferir antes de agir: PENDING |
| Sem chave configurada | `not_configured`, Live indisponível | `not_configured`, Live indisponível (sem chamar a rede) | VERIFIED (teste) |
| Rollback | Estado atual de Production | Reverter `45379b8` (move o arquivo de volta para `lib/groq/`, restaura `GROQ_*` no `.env.example` e a chamada em `actions.ts`) | HYPOTHESIS: não testei o revert; os commits seguintes tocam `actions.ts` e podem gerar conflito |
| Cobertura de testes do adaptador | nenhuma | 10 testes (`nvidia-chat.test.ts`) | VERIFIED |

## 2. O que a troca muda para o usuário

- VERIFIED: sem JSON Schema estrito do provedor, a conformidade do formato depende só do modelo e do parser. Saída malformada vira `invalid_output` (mensagem "Não foi possível gerar com segurança"); no Groq, parte desses casos era corrigida pelo provedor ou repetida.
- VERIFIED: temperatura 0,5 aumenta a variação entre respostas; o parser continua rejeitando excerto que não esteja literalmente na evidência e números inventados, então o risco é de **mais rejeições**, não de conteúdo falso aceito.
- HYPOTHESIS: `max_tokens` 1.024 pode truncar um JSON com 5 argumentos (até 280 + 240 caracteres cada) mais rascunho de até 1.200 caracteres, resultando em JSON cortado → `invalid_output`. Se o modelo gastar tokens com raciocínio interno, piora. Não medido.
- PENDING: taxa real de `invalid_output`, latência real (o registro do Orquestrador cita respostas de até 90 s no endpoint trial), qualidade em português e custo/limite de taxa do endpoint. Tudo exige chamada real.
- PENDING: limite de duração da função/ação no deploy da Vercel. `maxDuration` não está definido no repositório (busca em `app/`); o limite efetivo depende do plano e do runtime. Se for menor que ≈ 30 s, o pior caso da NVIDIA estoura antes do timeout próprio; o caso de 90 s observado estoura de qualquer forma.

## 3. Comportamento da ação na falha (provado por teste)

- VERIFIED: modo inicial: grava `fail_live_question` com o código e devolve mensagem; `timeout` tem mensagem própria ("demorou além do limite"), os demais usam a genérica.
- VERIFIED: nos modos `shorter`, `deeper` e `alternative` a falha **não** marca a pergunta como falha (preserva a versão anterior).
- VERIFIED por leitura (sem teste, exige Next e Supabase): `regenerateLiveQuestion` descarta o retorno de `generateVersion`, então o usuário não vê mensagem de erro ao regenerar; só a página recarrega igual. Registrado como risco, não corrigido (fora do escopo do lote).

## 4. O que cada opção exige para um Preview

| Opção | Exigências | Status |
|---|---|---|
| Groq (reverter `45379b8` ou manter módulo antigo) | `GROQ_API_KEY` e `GROQ_MODEL` já existem na Vercel; nenhuma chave nova | VERIFIED (variáveis, auditoria P-1) |
| NVIDIA | Chave **nova** (a anterior foi exposta e tratada como comprometida), `NVIDIA_API_KEY` no escopo Preview da Vercel, dados sintéticos, uma chamada real de aceite, medição de latência contra o limite da função | PENDING (gate de Yan) |
| Preview sem nenhuma chave de IA | O Live responde `not_configured` com falha recuperável; serve para testar fluxo e interface, não o Live | VERIFIED (teste) |

## 5. Riscos

1. **Production quebra no push** se `main` for publicada sem `NVIDIA_API_KEY`: o Live passa a falhar (VERIFIED por código e teste; auditoria P-1).
2. Latência: pior caso 30 s no código, 90 s observado uma vez; limite da função desconhecido (PENDING).
3. Mais `invalid_output` por falta de schema estrito, temperatura maior e possível truncamento (HYPOTHESIS).
4. Segunda tentativa sem pausa em 429 pode agravar o limite de taxa (VERIFIED o comportamento; efeito PENDING).
5. Decisão de produto sem registro (auditoria P-4): ADR Groq→NVIDIA pendente; Diário, Score e Artefatos seguem na Groq.
6. Regerar não mostra erro ao usuário (seção 3).

## 6. Recomendação com gates

**Recomendação:** não publicar Production com NVIDIA agora. Para o Preview, manter o Live **sem** chave de IA ou com Groq até que os gates abaixo passem; só então ligar a NVIDIA.

| Gate | Condição | Quem | Status |
|---|---|---|---|
| G1 | Chave NVIDIA nova, rotacionada, só no escopo Preview | Yan | PENDING |
| G2 | Uma chamada real com dados sintéticos devolve JSON aceito pelo parser; registrar latência e tokens | Yan / Agente com chave aprovada | PENDING |
| G3 | Taxa de `invalid_output` aceitável em um conjunto sintético (limiar definido por Yan) e decisão sobre `max_tokens` e temperatura | Yan | PENDING |
| G4 | Limite de duração da função confirmado ≥ pior caso (≥ 35 s) ou timeout reduzido | Orquestrador | PENDING |
| G5 | Parser `response-schema.ts` (L-1/A-1/A-7) tratado em lote próprio antes de integrar o Agente | Orquestrador | PENDING |
| G6 | ADR Groq→NVIDIA registrado | Yan | PENDING |
| G7 | Para Production: G1–G6 e `NVIDIA_API_KEY` presente na Vercel antes do push de `main` | Yan | PENDING |

Alternativa simples e reversível, se G2–G4 falharem: voltar o Live para a Groq (revert de `45379b8`, HYPOTHESIS de conflitos) mantendo o novo código só em `lib/agent`.
