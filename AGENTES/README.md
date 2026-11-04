# Equipe de agentes — Persona

Arquitetura para execução paralela governada no Claude Code. Ela organiza trabalho; não comprova implementação do produto.

## Skill principal obrigatória

Toda aba deve ativar **`/ponytail full` como primeira skill da sessão** e mantê-la durante planejamento, implementação, dependências e revisão. Ela governa escopo, economia de contexto e a menor solução completa. Skills especializadas entram somente quando a atribuição realmente exigir; segurança, privacidade, validação, testes e acessibilidade nunca podem ser cortados para economizar tokens.

| Pasta | Título oficial | Missão | Escrita no produto |
|---|---|---|---|
| `00_orquestrador` | Persona — Orquestrador Central | Priorizar, atribuir, integrar e proteger gates | Governança, integração e Git |
| `01_interface` | Persona — Migração de Interface | Reescrever a interface aprovada em TSX acessível | Somente caminhos atribuídos de UI |
| `02_backend` | Persona — Dados e Backend | Preservar contratos, Auth, Supabase e RLS | Somente caminhos atribuídos de dados/backend |
| `03_agente_nvidia` | Persona — Agente NVIDIA | Implementar o agente colaborativo rastreável | Somente caminhos atribuídos de IA |
| `04_verificacao` | Persona — Verificação Independente | Testar e revisar sem validar o próprio trabalho | Relatórios e evidências; produto somente por correção atribuída |

## Fluxo obrigatório

1. Yan abre uma aba do Claude Code por papel usando `AGENTES/PROMPTS/`.
2. Cada aba ativa `/ponytail full`, começa em leitura e registra o estado em seu `STATUS.md`.
3. O Orquestrador reconcilia o baseline Git antes de liberar escrita.
4. Cada atribuição define objetivo, caminhos exclusivos, dependências, testes e gate humano.
5. Especialistas não fazem merge, push, deploy, migração real nem alteram arquivos fora do escopo.
6. A Verificação Independente trabalha sobre um diff congelado.
7. O Orquestrador integra um lote por vez e apresenta evidências a Yan.

## Fontes obrigatórias

- `AGENTS.md`, `CLAUDE.md` e instruções mais específicas da área;
- `AGENTES/00_orquestrador/DOCUMENTACAO_BASE.md`;
- `docs/handoff/START_HERE.md`, `CURRENT_STATE.md`, `PHASES.md` e `PRODUCT_SURFACE.md`;
- artefatos aprovados do redesign indicados pelo Orquestrador;
- `C:\Users\yansi\OneDrive\persona-contexto`, conciliado com o estado operacional.

## Regra de precedência

Instrução atual de Yan > evidência operacional atual > decisões vigentes > documentação histórica > inferência do agente.
