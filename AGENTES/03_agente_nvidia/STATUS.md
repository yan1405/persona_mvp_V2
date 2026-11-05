# Status — Persona — Agente NVIDIA

Estado: BLOCKED

> Cópia em `main`, atrasada por desenho: o estado vivo está no branch `wt/agente-nvidia-lote1` (HEAD `f4edecf`, lido por `git show`). A tabela abaixo é o contrato original e não representa o estado atual. Ver `AGENTES/00_orquestrador/STATUS.md` (rodada 3).
Motivo do BLOCKED: o parser compartilhado `apps/web/lib/live/response-schema.ts` mantém A-1/A-7 abertos (S2, sem dono, fora do SHA `f4edecf`); bloqueia a integração enquanto aberto.

| Tarefa | Peso | Estado | Evidência |
|---|---:|---|---|
| Prompt e contrato de saída | 20 | PENDING | — |
| Recuperação/RAG mínimo | 25 | PENDING | — |
| Ferramentas e autoridade | 20 | PENDING | — |
| Adaptador NVIDIA | 15 | PENDING | — |
| Evals e regressão | 20 | PENDING | — |

Concluído: 0%
Faltante: 100%
Bloqueio: baseline, credencial rotacionada e decisão de primeiro incremento pendentes.
Próximo desbloqueio: aprovar o contrato read-only e uma suíte sintética antes da chamada real.
Decisões do usuário: `z-ai/glm-5.3-flash` aprovado; migração das outras superfícies não aprovada automaticamente.
Arquivos alterados: nenhum arquivo do produto.
Validação: não iniciada.
