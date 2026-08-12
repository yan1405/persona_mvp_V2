# Fase 7 — Persona Live manual

> Status: contrato funcional e técnico aprovado por Yan em 12/08/2026
> Implementação: não iniciada
> Base conceitual: `docs/plans/2026-08-05-persona-live-design.md`

## 1. Objetivo

Transformar evidências profissionais autorizadas em argumentos rastreáveis e um rascunho curto para perguntas de entrevista, sem responder pelo usuário e sem criar fatos ausentes.

O MVP é exclusivamente manual. Áudio, escuta e detecção automática de perguntas permanecem fora da Fase 7.

## 2. Decisões aprovadas

- preparação antes da pergunta;
- vaga ou objetivo e empresa obrigatórios;
- descrição da oportunidade opcional;
- Persona recomenda evidências e o usuário confirma a seleção;
- entre 1 e 8 evidências autorizadas por sessão;
- várias perguntas por sessão;
- histórico persistido com contexto, perguntas, rascunhos e IDs das evidências usadas;
- `Copiar` envia somente o rascunho;
- Salvar como Artefato permanece para a Fase 8;
- ausência de evidência mostra uma lacuna e sugere fatos a registrar, sem resposta genérica;
- Encurtar, Aprofundar e Outra experiência fazem nova geração controlada;
- recomendação determinística, sem embeddings;
- alteração de evidências exige pausar a sessão;
- sessões encerradas são somente leitura e podem ser duplicadas sem o histórico;
- Server Actions, Supabase relacional e Groq sob demanda;
- nenhuma dependência nova.

## 3. Abordagens consideradas

### A. Server Actions + Supabase + Groq sob demanda — aprovada

Mantém o padrão das fases anteriores, persiste cada pergunta de forma rastreável e evita infraestrutura adicional.

### B. Estado local até encerrar

Reduz escritas durante a sessão, mas pode perder perguntas e respostas em falha ou recarregamento. Rejeitada.

### C. API com fila assíncrona

Oferece escala futura, mas adiciona complexidade sem necessidade demonstrada no MVP. Rejeitada.

## 4. Rotas e navegação

O item Persona Live passa de indisponível para ativo no trilho principal.

### `/app/live`

- criação de nova sessão;
- lista densa de sessões recentes;
- estados vazio, preparação, ativa, pausada e encerrada.

### `/app/live/[id]`

- preparação quando a sessão ainda não começou;
- workspace manual durante a sessão;
- consulta somente leitura após encerramento.

Não haverá rota, painel ou controle de áudio.

## 5. Preparação da sessão

Campos:

- `target_role`: vaga ou objetivo, entre 4 e 120 caracteres;
- `company`: empresa, entre 2 e 120 caracteres;
- `opportunity_description`: opcional, até 2.000 caracteres.

O Persona classifica evidências confirmadas e ativas usando tokens normalizados presentes em:

- vaga/objetivo;
- empresa;
- descrição;
- título;
- contexto;
- ação;
- resultado;
- aprendizado;
- competências.

Recência desempata pontuações iguais, mas não supera correspondência temática. A justificativa é derivada de sinais reais, como competência, contexto ou termo relacionado. Nenhum LLM participa da recomendação inicial.

A interface recomenda evidências e permite ajustar a seleção. A sessão só inicia com 1 a 8 evidências próprias e ativas confirmadas.

## 6. Fluxo da sessão

1. o usuário envia uma pergunta manual;
2. o servidor valida sessão, propriedade e estado ativo;
3. somente evidências autorizadas e ativas são recuperadas;
4. a relevância determinística ordena o conjunto;
5. um conjunto pequeno é enviado à Groq;
6. a resposta estruturada separa intenção, argumentos e rascunho;
7. o servidor valida IDs e correspondência;
8. pergunta e primeira versão são persistidas;
9. os painéis aparecem separados.

Cada sessão aceita várias perguntas e mantém histórico cronológico.

## 7. Dados

### `live_sessions`

- `id`, `user_id`;
- `target_role`, `company`, `opportunity_description`;
- `status`: `preparing | active | paused | closed`;
- `started_at`, `paused_at`, `closed_at`;
- `created_at`, `updated_at`.

### `live_session_evidences`

- `session_id`, `evidence_id`, `user_id`;
- `recommendation_score`;
- `recommendation_reasons`;
- `authorized_at`, `removed_at`.

Uma remoção pausa o uso futuro, mas não apaga vínculos históricos.

### `live_questions`

- `id`, `session_id`, `user_id`;
- `question_text`;
- `intent`: `objective | behavioral | complex`;
- `status`: `processing | answered | gap | failed`;
- `primary_evidence_id` opcional;
- `error_code` opcional;
- datas.

### `live_draft_versions`

- `id`, `question_id`, `user_id`, `version`;
- `mode`: `initial | shorter | deeper | alternative`;
- `target_duration_seconds`;
- `draft_text`;
- `arguments` JSONB validado;
- `evidence_ids` UUID[];
- `gap` JSONB opcional;
- `model`, `prompt_version`;
- `created_at`.

Snapshots anteriores não são alterados.

## 8. Contrato da Groq

Entrada mínima:

- pergunta;
- vaga/objetivo, empresa e descrição limitada;
- entre uma e poucas evidências autorizadas já ordenadas;
- modo da geração;
- evidência principal preferida quando aplicável.

Saída estrita:

- `intent`;
- `supported`;
- `primary_evidence_id`;
- `arguments[]`: texto curto, `evidence_id`, campo de origem;
- `draft` ou `null`;
- `target_duration_seconds`;
- `gap`: fatos necessários e sugestão de registro quando não sustentada.

Regras:

- cada ID deve pertencer ao conjunto enviado;
- cada argumento aponta para título, contexto, ação, resultado, aprendizado ou competência real;
- números, responsabilidades e resultados ausentes são proibidos;
- `supported=false` exige `draft=null`;
- o servidor rejeita saída inválida e preserva a pergunta;
- timeout, uma tentativa adicional máxima e erros classificados;
- nenhuma chamada ocorre antes de a sessão estar ativa.

## 9. Extensão da resposta

| Intenção | Duração alvo |
|---|---:|
| Objetiva | 15–25 segundos |
| Comportamental | 30–45 segundos |
| Complexa | até 60 segundos |

`Encurtar` reduz a duração sem remover o fato central. `Aprofundar` acrescenta somente fatos já autorizados. Não são geradas respostas automáticas acima de 60 segundos.

## 10. Controles

### Encurtar

Cria nova versão com a mesma pergunta e evidências usadas.

### Aprofundar

Cria nova versão limitada aos fatos autorizados.

### Outra experiência

Troca a evidência principal pela próxima alternativa relevante dentro da seleção. Fica indisponível sem alternativa.

### Copiar

Copia somente o rascunho da versão atual. Não altera banco.

### Pausar e revisar evidências

Bloqueia novas perguntas e gerações. A seleção confirmada afeta somente perguntas futuras.

### Encerrar

Exige confirmação e torna a sessão somente leitura. Contexto, perguntas, versões e vínculos são preservados.

### Duplicar

Cria uma nova sessão em preparação com contexto e seleção ativa copiados, sem perguntas ou rascunhos.

## 11. Estados e erros

### Preparação

- nenhuma evidência disponível;
- recomendações carregando;
- recomendações encontradas;
- seleção insuficiente;
- erro de carregamento;
- pronta para iniciar.

### Pergunta

- ociosa;
- processando;
- resposta sustentada;
- lacuna identificada;
- falha parcial.

Durante a falha da Groq, pergunta e recuperação determinística são preservadas. Retry não duplica silenciosamente a pergunta.

Sessão pausada ou encerrada bloqueia novas gerações no servidor, independentemente do cliente.

## 12. Interface

O Persona Live não usa bolhas de chat. A composição é editorial e operacional.

### Preparação

- contexto da oportunidade;
- lista densa de evidências recomendadas;
- título, contexto, competências e nível;
- motivo da recomendação;
- controle explícito de autorização.

### Workspace

- cabeçalho com empresa, vaga/objetivo e estado;
- pergunta manual como ação primária;
- histórico cronológico;
- painel **Argumentos reais**;
- painel **Rascunho sugerido**;
- evidências usadas e alertas;
- controles de versão e Copiar.

Em largura compacta, Argumentos reais vem antes do Rascunho. Em largura expandida, podem ficar lado a lado. Estados não dependem só de cor, foco é visível e atualizações relevantes são anunciadas.

## 13. RLS e integridade

- todas as tabelas privadas possuem `user_id`;
- select por proprietário;
- sessões em preparação podem receber contexto e seleção;
- somente sessões ativas recebem perguntas;
- sessões pausadas alteram apenas a seleção e o estado;
- sessões encerradas são imutáveis para o cliente;
- versões de rascunho são append-only;
- vínculos só aceitam evidências próprias e confirmadas;
- funções atômicas validam transições e propriedade;
- logs técnicos não contêm pergunta completa, rascunho, cookie ou token.

## 14. Testes obrigatórios

- recomendação determinística e desempate por recência;
- justificativa baseada em sinais encontrados;
- limite de 1 a 8 evidências;
- RLS e identidade alheia;
- sessão pausada/encerrada bloqueando geração;
- pergunta sem evidência suficiente;
- rejeição de IDs não autorizados;
- ausência de números, resultados ou responsabilidades inventados;
- versões curta, aprofundada e alternativa;
- preservação após falha da Groq;
- histórico antigo preservado após mudança da seleção;
- duplicação sem perguntas;
- copiar somente o rascunho;
- fluxo autenticado completo;
- teclado, foco, estados anunciados;
- QA em 1024, 1280, 1440 e 1920px.

## 15. Fora da Fase 7

- áudio e modo automático, inclusive simulado;
- embeddings e banco vetorial;
- fila e processamento em segundo plano;
- Meet, Teams e Zoom;
- salvar como Artefato;
- geração sem evidência;
- reabertura de sessão encerrada;
- cronômetro, gamificação ou resposta indetectável.

## 16. Gate

Yan deve conseguir preparar uma oportunidade, autorizar evidências, fazer várias perguntas e compreender claramente a separação entre fatos recuperados e redação sugerida.

Antes de qualquer código, obter confirmação explícita de Yan para implementar este contrato.
