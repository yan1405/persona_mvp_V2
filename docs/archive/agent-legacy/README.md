# Quarentena — comandos legados de agentes

Movidos em 03/11/2026 por decisão de Yan (Lote 0), com `git mv`, sem apagar histórico. **Não estão ativos**: o Claude Code só carrega skills de `.claude/skills/` e o Codex de `.agents/skills/`.

| Origem | Destino |
|---|---|
| `.claude/commands/` | `claude-commands/` |
| `.agents/skills/source-command-*` (6) | `agents-skills/` |

Conteúdo: swarm-orchestration, SPARC, hooks-automation, pair-programming, performance-analysis, verification-quality, github-workflow-automation, browser e agentes auxiliares. Todos dependem de `claude-flow`, `agentic-flow` ou `ruflo`, não aprovados pela arquitetura (`AGENTES/00_orquestrador/DOCUMENTACAO_BASE.md`). Os `npx` correspondentes também estão em `deny` em `.claude/settings.json`.

Para restaurar um item, peça autorização a Yan e use `git mv` de volta. Não executar nada daqui sem aprovação escrita.
