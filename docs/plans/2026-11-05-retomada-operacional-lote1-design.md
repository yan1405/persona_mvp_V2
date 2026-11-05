# Retomada operacional do Lote 1

Data: 05/11/2026. Estado: plano de comando; não autoriza merge, push, banco, credencial, Preview ou Production.

## Objetivo

Fechar as divergências da rodada 3, corrigir a leitura de estado do Orquestrador e produzir uma última Verificação independente antes de Yan decidir a integração local.

## Abordagem escolhida

Usar o mesmo time e os mesmos worktrees. O Orquestrador primeiro reconcilia o estado real pelo Git e versiona somente a evidência da Verificação. Depois libera três correções pequenas e disjuntas. Por fim, congela novos SHAs e entrega à Verificação. Não criar novo agente, branch de produto, dependência ou arquitetura.

## Fluxo

1. Pausar escritores e executar o refresh de Git em todos os worktrees.
2. Reconciliar `STATUS.md`, relatórios da rodada 3 e handoffs brutos sem tratá-los como estado vivo.
3. Interface corrige IF-4.
4. Backend corrige BK-6, BK-7 e BK-8, sem SQL.
5. Agente corrige A-9, A-10, A-11, A-5, A-6, limites de entrada e o parser compartilhado A-1/A-7 com regressão do Live.
6. Orquestrador congela os novos SHAs após reler commits e diffs dos worktrees.
7. Verificação revisa apenas os novos incrementos e executa testes no checkout isolado.
8. Orquestrador apresenta a Yan a matriz final e para antes de integração, push, migração ou deploy.

## Critérios de sucesso

- `validate_architecture.py` termina com zero erros;
- estados usam apenas `PENDING`, `ACTIVE`, `WAITING_APPROVAL`, `BLOCKED` ou `DONE`;
- `main` e os worktrees têm autoria e sujeira explicadas;
- cada relatório cita o SHA revisado;
- nenhum S1/S2 permanece no escopo integrável;
- testes do Agente, suíte existente, lint, typecheck e build passam no lote integrado antes de qualquer Preview;
- B-1, banco, visual, credencial e Production continuam gates separados de Yan.

## Tratamento de erro

Se um worktree mudar durante o refresh, invalidar o snapshot e repetir. Se um novo S2 surgir, não ampliar silenciosamente o escopo: registrar, atribuir dono e voltar à Verificação. Relatório de SHA antigo permanece histórico e nunca aprova SHA novo.
