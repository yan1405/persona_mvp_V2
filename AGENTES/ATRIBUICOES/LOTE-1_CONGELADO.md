# Lote 1 — diffs congelados para a Verificação

Congelado pelo Orquestrador em 04/11/2026. Base: `8da08c698a74aeb4d95c70123eba61fc921a591c`. Os três branches compartilham o mesmo repositório Git, então `git diff 8da08c6..<SHA>` funciona a partir de qualquer checkout. Um SHA é imutável: se o escritor corrigir algo, nasce um SHA novo e este registro é substituído.

| Entrega | Branch | SHA congelado | Arquivos | Linhas |
|---|---|---|---:|---|
| 01 Interface | `wt/interface-lote1` | `8c5ef15877afac9837522c16c83d3f86ffbe2a98` | 2 | +166 / −13 |
| 02 Backend | `wt/backend-lote1` | `ffd4289e1c7efaa46ae52734962e5d371e1ee491` | 4 | +370 / −63 |
| 03 Agente NVIDIA | `wt/agente-nvidia-lote1` | `6a6b8f0011aa340a0efaf5862c837d72ab530777` | 4 | +213 / −13 |

## Conferido pelo Orquestrador antes de congelar (não substitui a Verificação)

- Os caminhos alterados de cada branch estão dentro dos caminhos de escrita da sua seção; nenhum arquivo proibido foi tocado.
- `git diff --check` limpo nos três; nenhum padrão de segredo, chave ou e-mail nos três diffs.
- Agente: `lib/agent/agent.ts` só importa de `lib/live` (leitura), sem `fetch`, `process.env` ou SDK; 9/9 testes novos, 32/32 existentes, lint e typecheck com código 0, reexecutados por mim no worktree.
- Backend: o script SQL termina em `rollback`, sem `commit`, `drop table`, `truncate` ou service role.
- Interface: só documentação; cada afirmação do mapa ainda precisa de conferência independente.

## O que a Verificação deve fazer

Seguir `AGENTES/04_verificacao/PLANO_LOTE1.md` sobre estes três SHAs, em leitura. Relatório por entrega em `AGENTES/04_verificacao/`, com achados por severidade e reprodução mínima. Não corrigir; não aprovar visual; não rodar build, `npm install` nem testes dentro dos worktrees dos escritores (use uma cópia sua, se precisar executar, e declare o comando).

## Itens que o Orquestrador já sabe e que não são achado novo

- `lib/agent/agent.test.ts` ainda não está no script `npm test` (`package.json` é do Orquestrador).
- O validador do agente aceita um número já presente na evidência, inclusive plantado (risco declarado pelo escritor).
- O risco R1 do Backend (`delete_own_account` e chaves estrangeiras `on delete restrict`) é HYPOTHESIS e só um banco real confirma.
