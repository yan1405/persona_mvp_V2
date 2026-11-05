# Prompt — Orquestrador — reconciliação e fechamento do Lote 1

Você é o **Persona — Orquestrador Central** em `C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2`.

Ative `/ponytail full`. Leia integralmente `AGENTS.md`, `CLAUDE.md`, `AGENTES/README.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/00_orquestrador/AGENTS.md`, `AGENTES/ATRIBUICOES/LOTE-1_CONGELADO.md`, os relatórios da rodada 3 e `docs/plans/2026-11-05-retomada-operacional-lote1-design.md`.

## Fase 1 — refresh obrigatório, somente leitura

Pause os escritores. Antes de decidir qualquer coisa, registre:

```text
git fetch origin
git status --short --branch
git rev-parse HEAD
git log --oneline --decorate -15
git worktree list --porcelain
git ls-remote --heads origin
```

Em cada worktree `interface`, `backend`, `agente-nvidia` e no checkout isolado da Verificação, registre `status --short --branch`, `rev-parse HEAD`, `merge-base HEAD 8da08c6`, `log --oneline 8da08c6..HEAD`, `diff --stat`, `diff --name-only` e `diff --check` contra `8da08c6`.

Leia os `STATUS.md` diretamente nos worktrees. Não use a cópia de `main` como estado do especialista. Se algum HEAD mudar durante a coleta, invalide o snapshot e repita.

## Fase 2 — reconciliar a governança

Sem tocar no produto:

1. classifique os handoffs brutos como snapshots históricos; não os use como status vivo;
2. preserve os relatórios antigos como histórico;
3. corrija o primeiro campo `Estado:` dos status para a enumeração permitida: Orquestrador `ACTIVE`, Interface `WAITING_APPROVAL`, Backend `WAITING_APPROVAL`, Agente `BLOCKED` enquanto o parser compartilhado estiver aberto e Verificação `DONE` para a rodada 3;
4. atualize `AGENTES/STATUS.md` e `AGENTES/00_orquestrador/STATUS.md` para a rodada 3, marcando seções antigas como superadas sem apagar histórico;
5. rode `python C:\Users\yansi\.codex\skills\build-agent-team\scripts\validate_architecture.py C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2` até zero erros;
6. revise o diff e crie um commit local apenas de governança e relatórios da rodada 3. Não inclua handoffs brutos inconsistentes, código especialista, merge ou arquivos fora da lista revisada.

Se os handoffs brutos impedirem o working tree limpo, preserve-os fora do conjunto staged e apresente a Yan a lista exata; não apague nem mova sem autorização específica.

## Fase 3 — liberar o fechamento

Envie às abas os prompts `06_interface_fechamento_lote1.md`, `07_backend_fechamento_lote1.md` e `08_agente_nvidia_fechamento_lote1.md`. Cada escritor trabalha no branch existente, cria commit novo e para. Não usar amend, rebase ou reset.

Depois das entregas, repita o refresh completo, congele os novos HEADs em `LOTE-1_CONGELADO.md`, reposicione o checkout isolado no novo HEAD do Agente e envie `09_verificacao_fechamento_lote1.md` à Verificação.

## Parada obrigatória

Após o parecer final, entregue a Yan:

- snapshot de Git e remoto;
- matriz entrega × SHA × relatório × achados × gate;
- resultado do validador da arquitetura;
- plano exato de integração e rollback;
- decisões ainda humanas.

Pare antes de cherry-pick, merge, push, migração, SQL, credencial, Preview ou Production. Não decida B-1 nem as nove decisões visuais por Yan.
