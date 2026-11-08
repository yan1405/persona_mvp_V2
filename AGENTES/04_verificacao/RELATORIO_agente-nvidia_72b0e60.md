# Relatório de Verificação — Agente NVIDIA — Lote 2, Rodada 4 (AG2-2)

- SHA revisado: `72b0e60d51c6c7142207f62cf2085356e4aa7a52` (`wt/agente-lote2`; filho direto de `9abf92762285c50dc4c20c58624b8f4a794d0001`; 5 arquivos, +195/−40).
- Verificador: Persona — Verificação Independente. Data: 08/11/2026.
- `RELATORIO_agente-nvidia_9abf927.md` vira histórico e **não aprova** este SHA.
- Regras: sem chave, `.env`, rede de provedor, push/merge ou correção; mutações só em cópia fora do repositório.

## 1. Resumo e gate sugerido

**Gate sugerido: liberar para integração local, com ressalvas.** A extração de `generateVersion` para `lib/live/generate-version.ts` é **idêntica** ao corpo anterior (diff linha a linha: 34 linhas, zero diferença além da injeção `generateLiveResponse` → `generate`). Os 11 testes cobrem os casos pedidos e **9 de 9 mutações de comportamento falham** nos testes; `npm test` 75/75, lint, typecheck e build com exit 0. Nada de cliente alcança o módulo novo. Duas ressalvas: **AG4-1 (S3, novo)**, os testes não fixam os filtros de consulta (`user_id`, `status = confirmed`, `removed_at is null`): 3 mutações sobrevivem; e **AG2-3/AG3-1** seguem abertos. Chamada real, chave, latência, parser compartilhado (A-1/A-7/L-1) e ADR: `PENDING`/fora deste SHA.

## 2. Checagens

| # | Checagem | Resultado | Evidência |
|---|---|---|---|
| C1 | Escopo | **OK com nota (AG4-2, S4)** | `apps/web/lib/live/generate-version.ts` (novo), `generate-version.test.ts` (novo), `apps/web/app/app/live/actions.ts`, `apps/web/package.json`, `AGENTES/03_agente_nvidia/STATUS.md`. `actions.ts` e `package.json` constam na linha do papel ("só extração mínima para teste", "só `scripts.test`"). Os dois arquivos novos não aparecem **por nome** na lista (`nvidia-*.ts` e "testes novos de adaptador"); são o destino da extração autorizada, e o congelamento os aceitou |
| C2 | Arquivos proibidos | **OK** | `package.json`: só o valor de `scripts.test` (inclui `lib/live/generate-version.test.ts`); lockfile, dependências, `response-schema.ts`, `nvidia-chat.ts`, casca `generate-live-response.ts`, migrações e telas não mudaram |
| C3 | `git diff --check` | **OK** | exit 0 |
| C4 | Segredos | **OK** | nenhuma linha adicionada com `nvapi`, `gsk_`, `sk-`, `eyJ`, `service_role`, `password`, `secret`, `postgres://` |
| C5 | Commit | **OK** | pai = `9abf927`; autor Yan; trailer `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` |
| C6 | `STATUS.md` | **OK** | linha AG2-2 `DONE`, SHAs anteriores registrados; declara o que segue sem teste (`askLiveQuestion`/`regenerateLiveQuestion`, casca), que A-1/A-7/L-1 seguem abertos e que a guarda `server-only` está na casca |

## 3. Ponto 1: a extração é comportamentalmente idêntica

Extraí o corpo de `generateVersion` de `actions.ts` em `9abf927` (34 linhas, depois de `const { supabase, userId } = await authenticatedClient();`) e o de `runGenerateVersion` em `generate-version.ts` (34 linhas), substituí `await generate(` por `await generateLiveResponse(` e comparei com `diff`: **sem diferenças**. Portanto ficam iguais: as mensagens (`"A sessão precisa estar ativa."`, `"Nenhuma evidência está autorizada."`, `"Não há outra experiência autorizada para esta pergunta."`), a ordem das chamadas (consulta da pergunta → vínculos → evidências → ranking → `generate` → `finish_live_question` → no erro `fail_live_question`), os nomes e os parâmetros dos RPC (`p_question_id`, `p_intent`, `p_status`, `p_primary_evidence_id`, `p_mode`, `p_target_duration_seconds`, `p_draft_text`, `p_arguments`, `p_evidence_ids`, `p_gap`, `p_model`, `p_prompt_version`), o `slice(0, 5)`, o `Set` de `p_evidence_ids` e o log só com o código.

O que mudou de fato: (a) `supabase`, `userId` e `generate` vêm injetados (`GenerateVersionDeps`); (b) `actions.ts` mantém `authenticatedClient()` e chama `runGenerateVersion({ supabase, userId, generate: generateLiveResponse }, questionId, mode)`; (c) o tipo `EvidenceRow` mudou de lugar; (d) `actions.ts` passou a importar só `generateLiveResponse` da casca. Equivalência de tipos: `typecheck` exit 0.

## 4. Ponto 2: os 11 testes cobrem os casos pedidos

| Caso pedido | Teste |
|---|---|
| sessão inativa ou pergunta inexistente | (a): `paused`, `closed`, `null`; erro, sem `generate`, sem RPC |
| sem evidências autorizadas | (b) |
| `alternative` sem outra evidência | (c); e `alternative` com outra: a alternativa vai como preferida e primeira |
| sucesso, `answered` | (d): parâmetros exatos do RPC, `p_evidence_ids` sem duplicatas (`[E1, E2]` a partir de três argumentos) |
| sucesso, `gap` | (d): `p_status` `gap`, `p_evidence_ids` vazio, lacuna e `p_draft_text` nulo |
| `generate` recebe pergunta, contexto e no máximo 5 evidências | teste próprio (7 evidências → 5) |
| falha do adaptador, modo inicial, `fail_live_question` | (e): cinco códigos mais erro genérico de rede → `provider_error` |
| falha do `rpc` como `invalid_output` | (f): `finish_live_question` com erro → `fail_live_question` com `invalid_output` |
| regeneração não chama `fail_live_question` | (g): `shorter`/`deeper`/`alternative`; e erro do `rpc` na regeneração |
| log só com o código | teste final |

Os fakes não usam rede, chave nem banco; o construtor de consulta ignora os filtros (ver AG4-1).

## 5. Ponto 3: mutações em cópia fora do repositório

Cópia de `generate-version.ts`, `generate-version.test.ts`, `nvidia-chat.ts`, `recommendation.ts` e `response-schema.ts` extraída de `72b0e60` para uma pasta do scratchpad; `sed` só nessa cópia; `node --experimental-strip-types --test --test-timeout=8000 generate-version.test.ts`.

| Mutação | Resultado | Testes que falham |
|---|---|---|
| nenhuma | **pass 11 / fail 0** | — |
| não chamar `fail_live_question` | pass 9 / fail 2 | (e), (f) |
| chamar `fail_live_question` sempre (`if (true)`) | pass 10 / fail 1 | (g) |
| trocar `answered`/`gap` | pass 9 / fail 2 | (d) ×2 |
| gerar com sessão inativa (`status !== "active"` anulado) | pass 10 / fail 1 | (a) |
| `p_evidence_ids` sem `Set` (duplicatas) | pass 10 / fail 1 | (d) |
| ignorar o erro do `finish_live_question` | pass 9 / fail 2 | (f), (g) |
| `alternative` pode repetir a evidência anterior | pass 9 / fail 2 | (c), alternative |
| `slice(0, 6)` | pass 10 / fail 1 | limite de 5 |
| vazar a pergunta no log | pass 10 / fail 1 | log |
| **remover `.eq("user_id", userId)`** | **pass 11 / fail 0** (sobrevive) | — |
| **remover `.eq("status", "confirmed")`** | **pass 11 / fail 0** (sobrevive) | — |
| **remover `.is("removed_at", null)`** | **pass 11 / fail 0** (sobrevive) | — |

## 6. Ponto 4: alcance de `generate-version.ts` (relação com AG2-3)

- `git grep -n "generate-version" 72b0e60 -- apps/web` devolve **só** `actions.ts` (linha 7), o teste e o `package.json`. `nvidia-chat.ts` é importado por `generate-live-response.ts` (casca) e por `generate-version.ts`.
- `actions.ts` começa com `"use server"` e **também** importa a casca `generate-live-response.ts`, que tem `import "server-only"`: todo grafo que inclui `generate-version.ts` via `actions.ts` inclui a guarda.
- O único módulo cliente do diretório (`live-forms.tsx`, `"use client"`) importa só `askLiveQuestion`, `authorizeAndActivate`, `createLiveSession` e o tipo `LiveActionState` de `./actions` (referência de server action). Nenhum módulo `"use client"` do app importa `generate-version`, `nvidia-chat` nem a casca. O build passa (um vazamento via a casca quebraria o build por `server-only`).
- `generate-version.ts` só importa **tipo** de `../supabase/server.ts` (`import type`), então não puxa módulo de servidor em tempo de execução.
- **Conclusão:** nada de cliente alcança `generate-version.ts`. Mas a lacuna de AG2-3 cresce de um para dois módulos sem `server-only` (`nvidia-chat.ts` e `generate-version.ts`), e o comentário no topo de `nvidia-chat.ts` ("importe a casca no app") passa a ser contrariado pelo próprio `generate-version.ts`, que importa o núcleo direto. É convenção, não barreira; sem vazamento de chave.

## 7. Execução independente

Checkout isolado `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado em `72b0e60d51c6c7142207f62cf2085356e4aa7a52` (`HEAD` conferido antes e depois, `git status` limpo), devolvido a `acc1f44`. Lockfile igual (nenhuma mudança em dependências); `node_modules` do `npm ci` anterior reutilizados. Em `apps\web`, sem `.env`, sem chave, sem rede de provedor:

| Comando | Exit | Resultado |
|---|---:|---|
| `npx next typegen` | 0 | tipos gerados |
| `npm test` | 0 | tests **75** · pass 75 · fail 0 · cancelled 0 · skipped 0 (era 64: +11) |
| `npm run lint` | 0 | sem diagnósticos |
| `npm run typecheck` | 0 | sem erros |
| `npm run build` | 0 | compilado |

## 8. Achados

| ID | Sev. | Status | Achado |
|---|---|---|---|
| AG2-2 | (era S3) | **resolvido na parte com ramificação; S4 residual** | a orquestração de `generateVersion` passa a ter 11 testes, 9 de 9 mutações de comportamento pegas. Reduzi de S3 para S4 residual por essa medição: a casca que sobra (`askLiveQuestion`, `regenerateLiveQuestion`, `authenticatedClient`, `redirect`/`revalidatePath`, RPC `create_live_question`) tem pouca ramificação e continua sem teste. |
| **AG4-1** | S3 | VERIFIED (mutação) / HYPOTHESIS (efeito no banco) | **Os testes não fixam os filtros das consultas.** O construtor de consulta falso ignora `.eq`, `.is` e `.in`; remover `.eq("user_id", userId)`, `.eq("status", "confirmed")` ou `.is("removed_at", null)` mantém 11/11 verdes. São a fronteira de autorização do que alimenta o modelo (só evidência confirmada, não removida, do próprio usuário). **Atenuantes:** o corpo foi movido sem alteração (seção 3, verificado), então hoje os filtros estão lá; a RLS das tabelas é a barreira autoritativa (HYPOTHESIS: não verificada em banco real, Backend). **Recomendação:** o falso registrar os filtros recebidos (`calls`) e a asserção conferir `user_id`, `status` e `removed_at`. Efeito: só regressão futura. |
| **AG4-2** | S4 | VERIFIED | Os dois arquivos novos (`generate-version.ts` e o teste) não estão **por nome** na linha do Agente; estão no destino da extração autorizada. Registro para o Orquestrador. |
| AG2-3 | S4 | **aberto; alcance ampliado** | seção 6: dois módulos sem `server-only`; nada de cliente os alcança. Não alterado pela correção, exceto pelo segundo módulo. |
| AG3-1 | S4 | **aberto, inalterado** | `npm test` segue sem `--test-timeout`; o teste novo não tem passo que pendure (todos os fakes resolvem), então não acrescenta risco. |
| Observação (S4) | — | VERIFIED | `STATUS.md` declara e o código confirma: `regenerateLiveQuestion` chama `generateVersion` e **ignora o resultado** (linha 97 de `actions.ts`); numa falha de regeneração o usuário não vê a mensagem. É comportamento anterior, agora provado nos testes ((g) devolve o erro), não corrigido. |

Nenhuma severidade reduzida sem evidência; AG2-2 por mutação.

## 9. VERIFIED / HYPOTHESIS / PENDING

| Estado | Itens |
|---|---|
| VERIFIED | C1–C6; corpo idêntico; 11 testes e os casos pedidos; 9 mutações pegas e 3 que sobrevivem; alcance do módulo novo; typegen/test 75/75/lint/typecheck/build |
| HYPOTHESIS | RLS como barreira real dos filtros; comportamento do runtime Next com a injeção (a casca não tem teste) |
| PENDING | chamada real NVIDIA (chave, gates de Yan); latência contra o limite da função; parser compartilhado (G5, A-1/A-7/L-1); ADR Groq→NVIDIA; teste da casca; variáveis da Vercel |

## 10. Decisões pendentes

Orquestrador: aceitar AG4-1 como ressalva ou pedir um commit curto ao Agente; AG2-3/AG3-1 e o parser em lote próprio. Yan: chave NVIDIA, chamada de aceite, ADR, Preview/Production.
