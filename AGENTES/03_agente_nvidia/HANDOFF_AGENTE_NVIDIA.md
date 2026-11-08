> **HISTÓRICO — NÃO CANÔNICO — SUPERADO.**
> Relato de 05/11/2026 (Agente NVIDIA — SHA `f4edecf`, rodada 3), preservado como registro do que o agente declarou naquele momento. Não é o estado atual e não prova implementação.
> Os SHAs, comandos, contagens e "pendências" abaixo valem só para a data do relato. Estado canônico: `AGENTES/STATUS.md`, `AGENTES/00_orquestrador/STATUS.md`, `AGENTES/ATRIBUICOES/LOTE-1_CONGELADO.md` e os relatórios em `AGENTES/04_verificacao/` (fechamento do Lote 1: Interface `abcf288`, Backend `7aeb658`, Agente `42dbddf` bloqueado por L-1; integração local de `lib/agent/**` a partir de `f4edecf` em `b989c9f`).
> Texto original abaixo, sem alterações.

---

# Handoff — Persona — Agente NVIDIA (Lote 1, atualizado após a rodada 3)

Documento factual, somente relato. Escrito em 05/11/2026 a pedido de Yan. Não altera código nem STATUS.

## 1. Título e papel
Persona — Agente NVIDIA (papel 03). Missão: agente colaborativo read-only e efêmero sobre evidências autorizadas, com saída validada e zero mutações.

## 2. Pasta, branch, HEAD, merge-base
- Pasta/worktree: `C:\Users\yansi\Projetos\persona-wt\agente-nvidia`
- Branch: `wt/agente-nvidia-lote1` (sem upstream)
- HEAD: `f4edecf6fac422e6980d0e045ea30e29e22aa3e8` (só registra o SHA no STATUS)
- SHA de código a congelar: `56afc7c99344c87c53e2e83719c8f0b83ac12741`
- Merge-base com `main`: `8da08c698a74aeb4d95c70123eba61fc921a591c`

## 3. git status
Árvore limpa no HEAD `f4edecf`. Este handoff não está no worktree nem no git.

## 4. Escopo e fonte
- `AGENTES/ATRIBUICOES/LOTE-1.md` §03 e `AGENTES/ATRIBUICOES/LOTE-1_CORRECOES.md` §03 (commit `3a6000e` do Orquestrador); prompt em `AGENTES/PROMPTS/03_agente_nvidia.md`.
- Escrita permitida: `apps/web/lib/agent/**`, `docs/redesign/agent/**`, `AGENTES/03_agente_nvidia/STATUS.md`.
- Leitura: `lib/live/**`, `lib/groq/**`, `lib/evidence/**`, `lib/score/**`, `app/**`, `supabase/**`.

## 5. Arquivos
- Criados: `apps/web/lib/agent/agent.ts`, `agent.test.ts`, `output-guard.ts`; `docs/redesign/agent/CONTRATO_AGENTE.md`. Este handoff existe só na pasta do agente em `persona_mvp_v2/AGENTES/03_agente_nvidia/` (fora do worktree e do git).
- Alterado: `AGENTES/03_agente_nvidia/STATUS.md`.
- Apenas lidos: `AGENTS.md`, `AGENTES/README.md`, `PROTOCOLO.md`, `03_agente_nvidia/AGENTS.md`, `lib/live/{generate-live-response,response-schema,validation,recommendation}.ts`, `live.test.ts`, `apps/web/package.json`, trecho de `app/app/live/actions.ts`, `lib/evidence/validation.ts` (grep), relatórios da Verificação (`RELATORIO_agente-nvidia_6a6b8f0.md` e `_489ec0d.md`), `LOTE-1_CORRECOES.md`.
- Não tocados: `package.json`, lockfile, `lib/live/**`, `.env*`, rotas, `supabase/**`.

## 6. Commits (ordem)
1. `6a6b8f0` — incremento 1: retrieval, prompt, `runAgent`, matriz de ferramentas, 9 testes, contrato, STATUS.
2. `80feabe` — guard de meta-comandos, schema estrito, desempate por ID (12 testes). Obs.: foi um amend do `8825576`, anterior a qualquer publicação.
3. `489ec0d` — barreira de meta-comandos também em `gap` (13 testes). Imutável.
4. `56afc7c` — rodada 3: A-1 residual, A-7, A-8, S3 (20 testes).
5. `f4edecf` — registra o SHA `56afc7c` no STATUS.

## 7. Comandos e resultados (rodada 3, antes do commit `56afc7c`)
- `node --experimental-strip-types --test lib/agent/*.test.ts` → tests 20, pass 20, fail 0 (antes das correções: 13 pass, 7 fail, os 7 novos).
- `npm test` → tests 32, pass 32, fail 0.
- `npm run lint` → sem diagnósticos. `npm run typecheck` → sem erros.
- `git diff --check` → saída vazia (aviso de LF→CRLF é só do git).
- Os resultados foram obtidos antes do commit de código; não foram repetidos depois do commit que só mexe no STATUS, nem ao escrever este arquivo.

## 8. Não executado
Build; teste no navegador; qualquer chamada à NVIDIA; eval com modelo real; métrica de recall; teste de integração em rota; `npm test` agregado incluindo `lib/agent` (depende do `package.json`, do Orquestrador).

## 9. VERIFIED (por execução minha)
Os 20 testes do agente; os 32 existentes; lint e typecheck; diff `8da08c6..HEAD` sem `package.json`, `lib/live`, `.env*`, rotas, `supabase/`. Nota: "VERIFIED" no sentido do protocolo (aprovação independente) ainda não existe para `56afc7c`.

## 10. Hipóteses abertas
Comportamento do `z-ai/glm-5.3-flash` diante dos casos adversariais; qualidade do ranking em dados reais; se o limiar `score > 0` derruba evidência relevante.

## 11. Riscos e achados conhecidos
- Barreira de meta-comandos é lexical pt/en (paráfrases e outras conjugações passam).
- Negação (A-7) é heurística, falha fechada, sem escopo sintático.
- Validador aceita número já presente na evidência (inclusive plantado).
- Limites de tamanho das entradas e `updated_at` inválido não cobertos (S3 aberto).
- Módulo não integrado a rota; adaptador real não existe.
- Verificação (rodada 2, SHA `489ec0d`) bloqueou integração por A-1 residual, A-7 e A-8; a rodada 3 corrige esses itens e ainda **não foi revisada**.

## 12. Decisões pendentes de Yan
Chave NVIDIA rotacionada e chamada real; troca de provedor Groq→NVIDIA; limiar de relevância (score > 0 ou outro); severidade de A-7 (reclassificação só com decisão sobre o contrato); integração/merge/push.

## 13. Dependências de outros agentes
Orquestrador (congelar SHA, incluir `lib/agent/agent.test.ts` no `npm test`, enviar à Verificação, dono do parser compartilhado); Verificação Independente (revisão formal de `56afc7c`). Nenhuma dependência de código dos papéis 01 e 02.

## 14. Arquivos compartilhados e possíveis conflitos
- `apps/web/package.json`: dono Orquestrador (pedido de incluir o teste).
- `apps/web/lib/live/response-schema.ts` e `recommendation.ts`: somente leitura, reutilizados; mudanças neles quebram o módulo e o Persona Live. `response-schema.ts` não tem dono; mesmos defeitos A-1/A-7 do parser permanecem lá (pedido registrado no STATUS).
- `AGENTES/03_agente_nvidia/STATUS.md`: exclusivo meu.

## 15. Local versus remoto
Tudo local no branch `wt/agente-nvidia-lote1`, sem upstream. Nada enviado a `origin` (`https://github.com/yan1405/persona_mvp_V2.git`).

## 16. Bloqueio atual
Nenhum para o lote. Pendente: revisão formal do SHA `56afc7c` pela Verificação.

## 17. Próximo passo mínimo (não executado)
Orquestrador congela `56afc7c`, inclui o teste no `npm test` e envia à Verificação. Qualquer passo meu depende de aprovação ou de novo gate de Yan.

## 18. Porcentagem comprovada
20% (somente "Ferramentas e autoridade" VERIFIED). "Prompt e contrato" PENDING até a Verificação.

| Tarefa | Peso | Estado |
|---|---:|---|
| Prompt e contrato de saída | 20 | PENDING |
| Recuperação/RAG mínimo | 25 | PENDING |
| Ferramentas e autoridade | 20 | VERIFIED |
| Adaptador NVIDIA | 15 | PENDING |
| Evals e regressão | 20 | PENDING |

## 19. Divergências
- Mensagem anterior a este documento dizia "entrega aceita tecnicamente" (`489ec0d`); a Verificação, no mesmo SHA, recomendou bloquear. Vale o relatório da Verificação.
- STATUS e este handoff concordam em 20% e em PENDING para "Prompt e contrato".
- Não li o estado atual de `main` além do merge-base `8da08c6`, e não existe relatório da Verificação para `56afc7c` até este momento.

## 20. Confirmação
Este arquivo foi o único artefato criado ao produzi-lo (depois movido para esta pasta a pedido de Yan). Nenhum commit, merge, push, migração, SQL, deploy ou chamada externa foi feito, e o STATUS não foi alterado.
