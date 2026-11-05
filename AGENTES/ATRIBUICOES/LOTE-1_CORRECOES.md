# Lote 1 — rodada 3: correções dos achados da Verificação

Emitida pelo Orquestrador em 05/11/2026. Origem: relatórios da Verificação em `AGENTES/04_verificacao/` (`RELATORIO_*_d4a1e3b|4a37131|489ec0d`). Autorização de Yan: "Confirmo tudo pode fazer", entendida como a rodada de correção dos achados e o saneamento das divergências documentais. **Não** cobre push, merge, Production, migração, banco, chave NVIDIA, a decisão B-1 nem as decisões visuais.

Base e escritores continuam os de `LOTE-1.md`; as regras comuns daquele arquivo valem aqui. Cada escritor trabalha no **mesmo worktree e branch**, **sem `--amend`, `rebase` nem `reset`**: os SHAs congelados (`d4a1e3b`, `4a37131`, `489ec0d`) são histórico imutável e a correção nasce como commit novo. Ao terminar, atualize o seu `STATUS.md` com o novo SHA e **não** o marque VERIFIED antes da Verificação.

Os seis itens do protocolo, por papel:

## 01 · Interface — `wt/interface-lote1`

1. **Objetivo e aceite.** Corrigir IF-1 (o mapa afirma que `exclusao-bloqueada` "não foi localizado"; ele existe: `apps/web/app/app/diario/actions.ts:134` e `app/diario/[id]/page.tsx:55`, `notice=delete-blocked`), IF-2 (resolver "conferir o protótipo" em `MAPA_TELAS.md:29` e `:69`: `score-panel.jsx:102` mostra que a Credibilidade não entra no cálculo) e IF-3 (o `STATUS.md` não pode se rotular VERIFIED antes da verificação independente). Aceite: os três pontos corrigidos com citação de arquivo e hash do manifesto quando for o protótipo.
2. **Escrita.** `docs/redesign/interface/**` e `AGENTES/01_interface/STATUS.md`.
3. **Leitura.** O resto, como em `LOTE-1.md`.
4. **Dependências.** Nenhuma. Não resolve as 9 decisões de Yan.
5. **Validações.** Rotas e símbolos citados existem (`Grep`); `git diff --check` limpo.
6. **Parada e gate.** Parar ao corrigir; sem código de produto.

## 02 · Backend — `wt/backend-lote1`

1. **Objetivo e aceite.** Corrigir os achados da Verificação, **sem executar SQL**:
   - **BK-1:** o script roda como `postgres` e não prova as políticas RLS das Fases 3–8. Deixar isso explícito no cabeçalho do script e em `RELATORIO_TESTE_RLS.md` (escopo real: lógica das duas funções e catálogo da tabela da Fase 9), sem prometer "RLS aprovada". Não criar script novo; se útil, descrever em texto o teste futuro com papel `authenticated`.
   - **BK-2:** `MATRIZ_TELA_DADOS.md` (R1) e o script devem aceitar **`23001` e `23503`** como sinal de R1, sem afirmar qual vem; só o banco real decide.
   - **BK-5:** se `anon` tiver `EXECUTE` (B-1), o passo 1 não deve abortar antes do passo 8; registrar como `ACHADO B-1` (aviso) e continuar, mantendo `begin` e `rollback`. B-1 segue decisão de Yan: não escolher opção.
   - **BK-3:** corrigir "só `ilike` simples" (não há `ilike`; o filtro é em memória).
   - **BK-4:** falsos positivos apontados no relatório (`profiles_restante` passa trivialmente; passo 9 não conta todas as tabelas).
   Aceite: cada ponto corrigido ou justificado por escrito; script continua em transação única terminada em `rollback`, sem `commit` nem DDL persistente.
2. **Escrita.** `docs/redesign/backend/**`, `docs/qa/fase-9/**`, `AGENTES/02_backend/STATUS.md`.
3. **Leitura.** `supabase/migrations/**` e o restante.
4. **Dependências.** Nenhuma. Sem migração nova, sem banco, sem credencial.
5. **Validações.** Nomes conferidos por `grep` nas migrações; leitura do SQL; `git diff --check` limpo; sem execução.
6. **Parada e gate.** Parar antes de qualquer execução. Migração e QA são gates de Yan.

## 03 · Agente NVIDIA — `wt/agente-nvidia-lote1`

1. **Objetivo e aceite.** Corrigir, com teste que falhe antes e passe depois para cada item:
   - **A-1 residual:** `source_excerpt`/`text` só com espaços passam; medir o tamanho **após `trim`** (e rejeitar vazio efetivo).
   - **A-7:** o excerto aceito como substring sem fronteira. Exigir casamento em **fronteira de palavra e de número** (`"em 3"` não pode casar `30%`) e não aceitar excerto que **inverta negação** (`"reduzi o custo"` sobre `"Não reduzi o custo…"`: rejeitar quando o trecho imediatamente anterior na evidência é uma negação ausente do excerto). Documentar o limite do que a heurística não cobre.
   - **A-8:** `hasMetaCommand` contornável por quebra de linha (`.` não casa `\n`) e com falsos positivos (`"ignorância de regras mínimas"`). Normalizar espaços e quebras antes, e usar formas verbais/fronteiras em vez de prefixo livre.
   - **S3 da rodada 1 e 2:** IDs duplicados nos argumentos; timeout sem cancelamento no provedor simulado (`AbortController`); recuperação aceitando evidência irrelevante (limiar mínimo de relevância).
   Aceite: `node --experimental-strip-types --test lib/agent/*.test.ts` verde com os novos casos; `npm test` 32/32; lint e typecheck 0; `CONTRATO_AGENTE.md` atualizado com o que continua **não** coberto.
2. **Escrita.** `apps/web/lib/agent/**`, `docs/redesign/agent/**`, `AGENTES/03_agente_nvidia/STATUS.md`.
3. **Leitura.** `apps/web/lib/live/**` (inclui `response-schema.ts`, parser compartilhado **sem dono**: se uma correção exigir mudá-lo, registrar o pedido no handoff, não editar).
4. **Dependências.** Sem pacote novo; `package.json` é do Orquestrador. Sem chave, sem rede, sem `.env*`.
5. **Validações.** Os quatro comandos acima; `git diff --check` limpo; nenhum dado pessoal em log.
6. **Parada e gate.** Parar ao corrigir. Chamada real e troca de provedor são gates de Yan.

## 04 · Verificação — somente leitura

Depois que os três escritores entregarem, o Orquestrador congela os **SHAs novos** em `LOTE-1_CONGELADO.md` e a Verificação refaz os relatórios para eles, com a mesma execução independente no checkout isolado (que o Orquestrador reposiciona no SHA novo do Agente). Os relatórios dos SHAs anteriores permanecem como histórico. Escrita: `AGENTES/04_verificacao/**`.

## O que o Orquestrador faz em paralelo (não é tarefa de escritor)

Corrigir as divergências documentais da `main` (cabeçalho do `STATUS.md`, `CONVERSAS.md`, `AGENTES/STATUS.md`, `CURRENT_STATE.md` §10) e, **só depois da aprovação**, incluir `lib/agent/*.test.ts` no `npm test`, em commit próprio.
