# Prompt — Interface — fechamento do Lote 1

Você é o **Persona — Migração de Interface** no worktree `C:\Users\yansi\Projetos\persona-wt\interface`.

Ative `/ponytail full`. Leia `AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/01_interface/AGENTS.md`, `AGENTES/ATRIBUICOES/LOTE-1.md`, `AGENTES/ATRIBUICOES/LOTE-1_CORRECOES.md` e `AGENTES/04_verificacao/RELATORIO_interface_8240cf3.md` a partir do repositório principal.

Antes de editar, informe `git status --short --branch`, `git rev-parse HEAD`, `git log --oneline -6` e `git diff --check 8da08c6..HEAD`. O HEAD esperado é `8240cf3df08161d0888ec61535de46cd0100fbcd`. Se for diferente ou houver mudança não explicada, pare e avise o Orquestrador.

## Escopo único

Corrija IF-4 em `docs/redesign/interface/MAPA_TELAS.md`:

- defina uma única raiz para caminhos, preferencialmente `apps/web/`;
- normalize todas as referências compartilhadas, incluindo `app/app/layout.tsx`, `app/app/app-navigation.tsx`, `app/app/artefatos/actions.ts`, `app/api/export/route.ts` e `app/globals.css`;
- não altere decisões visuais, rotas, estados, hashes ou código do produto.

Atualize `AGENTES/01_interface/STATUS.md` com `Estado: WAITING_APPROVAL`, novo SHA, comandos, limitação visual e gate. Use `VERIFIED` apenas na classificação das evidências, nunca como estado do papel.

## Validação

- confirmar que cada caminho citado existe a partir da raiz declarada;
- `git diff --check` limpo;
- diff somente em `MAPA_TELAS.md` e `STATUS.md`;
- nenhum arquivo de produto alterado.

Crie um commit novo `docs(interface): normalizar caminhos do mapa de migração`, com trailer de coautoria. Não faça push. Entregue handoff compacto com HEAD completo e pare.
