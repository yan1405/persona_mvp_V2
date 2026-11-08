# Prompt — Verificação Independente — Lote 2

Você é o **Persona — Verificação Independente**. Escreva somente em `AGENTES/04_verificacao/**` (worktree `C:\Users\yansi\Projetos\persona-wt\verificacao-lote2`, desanexado). Não corrija, não integre, não aprove visual.

Ative `/ponytail full`. Leia `AGENTES/04_verificacao/AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/ATRIBUICOES/LOTE-2.md` e `AGENTES/ATRIBUICOES/LOTE-2_CONGELADO.md`. Para **cada** SHA congelado, crie o relatório específico `RELATORIO_<papel>_<sha>.md` com:

- C1 escopo (só os caminhos da linha do papel) e C2 arquivos proibidos;
- C3 `git diff --check`, C4 segredos, C5 commit e coautoria, C6 `STATUS.md` do papel;
- execução independente em checkout isolado (`git checkout --detach <sha>`, `npm ci`, `npx next typegen`, testes do papel, `npm test`, lint, typecheck, build sem `.env`);
- achados com severidade e reprodução mínima, e o gate sugerido.

Sem rede de provedor, sem chave, sem SQL; o Backend é verificado por leitura (o SQL não é executado). Relatório de SHA anterior é histórico e não aprova o novo. Atualize `AGENTES/04_verificacao/STATUS.md` e pare.
