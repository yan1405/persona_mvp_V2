# Prompt — Agente NVIDIA — fechamento do Lote 1

Você é o **Persona — Agente NVIDIA** no worktree `C:\Users\yansi\Projetos\persona-wt\agente-nvidia`.

Ative `/ponytail full`. Leia `AGENTS.md`, `AGENTES/PROTOCOLO.md`, `AGENTES/03_agente_nvidia/AGENTS.md`, `AGENTES/ATRIBUICOES/LOTE-1.md`, `AGENTES/ATRIBUICOES/LOTE-1_CORRECOES.md` e `AGENTES/04_verificacao/RELATORIO_agente-nvidia_f4edecf.md` no repositório principal.

Antes de editar, informe `git status --short --branch`, `git rev-parse HEAD`, `git log --oneline -7` e `git diff --check 8da08c6..HEAD`. O HEAD esperado é `f4edecf6fac422e6980d0e045ea30e29e22aa3e8`. Se divergir, pare.

## Nova propriedade explícita

Nesta rodada você também pode escrever, exclusivamente para corrigir a causa compartilhada:

- `apps/web/lib/live/response-schema.ts`;
- `apps/web/lib/live/live.test.ts`.

Não tocar em rotas, adaptadores, `package.json`, lockfile, `.env*`, Supabase ou outros arquivos de Live.

## Escopo obrigatório

1. corrigir A-1/A-7 no parser compartilhado com as mesmas garantias aplicadas no módulo do Agente: conteúdo efetivo após trim, fronteira numérica/palavra e preservação de negação;
2. corrigir A-9 para que um provedor que rejeita ao receber `AbortSignal` continue sendo classificado como `timeout`;
3. corrigir A-10 sem tratar ponto decimal ou abreviação como limite de oração;
4. aplicar normalização Unicode NFKC em A-11 e documentar que homóglifos fora do mapa continuam limite conhecido;
5. tornar o teste A-5 adversarial de verdade ou rotulá-lo explicitamente como controle positivo;
6. remover ou justificar a checagem A-6 do rascunho descartado, preservando fail-closed para números nos excertos;
7. adicionar limites mínimos e máximos claros para pergunta e descrição na fronteira pública do módulo;
8. atualizar `CONTRATO_AGENTE.md` e `STATUS.md`; usar `Estado: WAITING_APPROVAL` quando o diff estiver entregue, sem autodeclarar aprovação independente.

Use a menor correção compartilhada. Não duplique a lógica entre Live e Agente se uma função existente puder ser reutilizada sem ampliar a API.

## Testes obrigatórios

- espaços e invisíveis;
- `30%` não pode virar `3`;
- negação não pode ser removida;
- decimal `v2.0` não cria falso limite;
- NFKC e full-width;
- provedor rejeitando no evento de abort continua `timeout`;
- regressões do Persona Live e do Agente.

Execute:

```text
node --experimental-strip-types --test lib/agent/*.test.ts
npm test
npm run lint
npm run typecheck
git diff --check
```

Crie commit novo com trailer de coautoria. Não editar `package.json`; a inclusão dos testes agregados permanece com o Orquestrador após o gate. Sem rede, chave, modelo real ou push. Entregue HEAD completo e pare.
