# Revisão da Fase 6 — Início e Narrative Score

> Implementada e validada tecnicamente em 12/08/2026. Gate atual: avaliação de Yan.

## Entrega

- `/app/diagnostico`: objetivo, dez perguntas, três etapas, rascunho e repetição versionada;
- `/app/inicio`: Score tipográfico, origem/data, dimensões, rastreabilidade, próxima ação, registros e competências;
- `/app/score`: Resumo, Histórico e Como é calculado;
- base declarada com 60% Coerência e 40% Consistência;
- Consistência observada após 21 dias, seis registros ativos e três semanas;
- Coerência assistida sob demanda após cinco evidências, dois contextos e três competências;
- Credibilidade explicitamente indisponível e fora do total;
- snapshots imutáveis para o cliente, com origem, método, período, explicação e evidências.

## Banco e segurança

A migração `20260811180000_phase_6_narrative_score.sql` foi aplicada ao projeto Supabase `persona-mvp-v2`.

Verificações diretas:

- `narrative_diagnostics` e `narrative_score_snapshots` existem com RLS ativa;
- diagnóstico aceita somente leitura própria, criação/edição do próprio rascunho;
- snapshots permitem somente leitura própria ao cliente;
- conclusão e novos snapshots passam por funções atômicas que reconfirmam `auth.uid()`;
- a função de snapshot recalcula o total, deriva o estado e rejeita evidências alheias ou arquivadas;
- nenhuma credencial ou dado privado foi registrado em código ou documentação.

## QA autenticado

O fluxo real encontrou e corrigiu um defeito antes do handoff: respostas de etapas anteriores não eram mescladas na conclusão. Após a correção:

1. o objetivo foi preservado;
2. o rascunho avançou pelas três etapas;
3. dez respostas válidas concluíram o diagnóstico;
4. o banco criou o snapshot inicial;
5. a Início exibiu `65/100`, Coerência `75`, Consistência `50` e Credibilidade indisponível;
6. Histórico mostrou o evento “Diagnóstico concluído”;
7. Como é calculado apresentou as fórmulas;
8. Atualizar análise permaneceu desabilitado sem elegibilidade.

O diagnóstico do ensaio ficou como dado real da própria conta de Yan. Não foi removido ou alterado por SQL.

## Validação técnica

```text
npm.cmd test           20/20 aprovados
npm.cmd run typecheck  aprovado
npm.cmd run lint       aprovado
npm.cmd run build      aprovado
```

O build final terminou com `exit code 0`. O ambiente demorou na geração de três páginas estáticas e o Next refez essas tentativas automaticamente; todas as 17 rotas foram concluídas.

## Validação visual

Capturas:

- `docs/qa/fase-6/inicio-1024.png`;
- `docs/qa/fase-6/inicio-1280.png`;
- `docs/qa/fase-6/inicio-1440.png`;
- `docs/qa/fase-6/inicio-1920.png`;
- `docs/qa/fase-6/score-resumo-1280.png`.

As quatro larguras foram verificadas sem overflow horizontal. A composição preserva o DNA editorial escuro, o violeta da marca, a assinatura de rastreabilidade e a hierarquia por tipografia/divisores, sem gauges, gradientes, medalhas ou grid genérico de cards.

O auditor `design-sem-cara-de-ia` sinalizou somente o violeta aprovado da marca e centralização em duas páginas legais preexistentes. Nenhum novo tell genérico exigiu correção.

## Ponytail `full`

- nenhuma dependência adicionada;
- um único arquivo de teste cobre as três regras do Score;
- filtros, datas e elegibilidade usam funções pequenas e determinísticas;
- Groq reutiliza o cliente e o padrão de erro já existentes;
- sem cron, fila, embeddings, Storage, upload ou abstrações preventivas;
- `/app/score` continua acessado contextualmente pela Início, sem inflar a navegação principal.

## O que Yan deve testar

1. abrir **Início** e conferir hierarquia, Score e próxima ação;
2. clicar em **Refazer diagnóstico** e avaliar clareza das três etapas;
3. abrir **Ver cálculo e histórico**;
4. conferir as abas Resumo, Histórico e Como é calculado;
5. validar se `65/100`, `75` e `50` representam corretamente as respostas usadas no ensaio;
6. avaliar as telas em 1024, 1280, 1440 e 1920px.

## Limitações deliberadas

- Credibilidade não recebe nota;
- Coerência não roda automaticamente;
- faltam evidências reais suficientes para executar a chamada de Coerência neste ensaio;
- Persona Live, Artefatos, arquivos e notificações seguem fora da fase.

## Próximo gate

A Fase 7 permanece bloqueada até Yan aprovar explicitamente esta entrega.
