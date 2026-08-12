# Fase 6 — Início e Narrative Score explicável

> Data: 11/08/2026
> Estado: contrato de produto, UI e arquitetura aprovado por Yan
> Implementação: aguarda confirmação para iniciar

## 1. Objetivo

Substituir o estado mínimo de `/app/inicio` por uma visão operacional e criar um Narrative Score inicial útil sem transformar poucos dados em precisão artificial.

O Score começa por um diagnóstico declarativo curto e passa, dimensão por dimensão, a usar comportamento e evidências reais. Toda pontuação precisa informar origem, período, método e confiança.

## 2. Princípio aprovado

O Score possui duas camadas de origem:

1. **Base declarada:** diagnóstico respondido pelo usuário;
2. **Evolução observada:** Daily Logs, evidências confirmadas e análises rastreáveis.

A base declarada é provisória. Ela é substituída por dimensão quando o mínimo de dados reais daquela dimensão for atingido.

Credibilidade permanece indisponível enquanto não houver mecanismo externo real. Respostas sobre provas orientam próximos passos, mas não geram pontuação de Credibilidade.

## 3. Rotas e navegação

### `/app/diagnostico`

Fluxo sequencial separado do onboarding. Não usa tabs.

- três etapas curtas;
- progresso visível;
- rascunho persistido ao avançar;
- saída e retomada;
- revisão antes da conclusão;
- resultado com Score inicial e explicação.

O diagnóstico não bloqueia Diário ou Evidências. Sem diagnóstico, o Início mostra `Diagnóstico não iniciado` e uma ação clara.

### `/app/inicio`

Visão operacional com:

- objetivo profissional atual;
- Narrative Score e origem;
- Consistência, Coerência e Credibilidade;
- próxima ação dinâmica;
- progresso para dados observados;
- evidências para revisar;
- registros e evidências recentes;
- competências recorrentes e lacunas de evidência;
- Persona Live e Artefatos apenas como próximas fases, sem CTA falso.

### `/app/score`

Deep link com abas irmãs:

- **Resumo**;
- **Histórico**;
- **Como é calculado**.

## 4. Diagnóstico essencial

Duração-alvo: aproximadamente 5 minutos.

### Etapa 1 — Objetivo e direção

Campo textual curto:

> Qual oportunidade ou objetivo profissional você quer alcançar agora?

Perguntas:

1. Consigo explicar meu objetivo profissional atual.
2. Sei quais competências preciso demonstrar para alcançar esse objetivo.

### Etapa 2 — Clareza e repertório

3. Consigo resumir minha trajetória profissional com clareza.
4. Consigo conectar minhas experiências ao objetivo que estou buscando.
5. Consigo lembrar situações concretas em que resolvi problemas ou gerei resultados.
6. Consigo explicar contexto, ação e resultado sem exagerar ou inventar informações.

### Etapa 3 — Consistência e base de credibilidade

7. Registro experiências profissionais relevantes com frequência.
8. Reviso minhas experiências antes de entrevistas, apresentações ou oportunidades.
9. Tenho links, documentos, entregas ou resultados que sustentam algumas experiências.
10. Sei onde encontrar essas provas quando preciso utilizá-las.

### Escalas

Cada resposta possui cinco rótulos textuais e um valor interno:

```text
nível 1 → 0
nível 2 → 25
nível 3 → 50
nível 4 → 75
nível 5 → 100
```

- perguntas 1–6: discordo totalmente → concordo totalmente;
- perguntas 7–8: nunca → sempre;
- perguntas 9–10: nenhuma base → base organizada e acessível.

Os números internos não aparecem durante o preenchimento.

## 5. Score inicial

```text
Coerência declarada   = média das perguntas 1–6
Consistência declarada = média das perguntas 7–8

Score inicial = (Coerência declarada × 0,60)
              + (Consistência declarada × 0,40)
```

As perguntas 9–10 produzem orientação de documentação, não Credibilidade.

Após a conclusão, mostrar:

- total de 0 a 100;
- origem `Base declarada`;
- confiança `Inicial`;
- data e versão do diagnóstico;
- Credibilidade `Ainda não avaliada`;
- próximo passo recomendado.

## 6. Substituição por dimensão

### Consistência

A Consistência se torna observada após:

- 21 dias desde a conclusão do diagnóstico;
- 6 Daily Logs ativos;
- atividade distribuída em pelo menos 3 semanas.

Antes disso, o Início mostra progresso concreto, por exemplo `4 de 6 registros` e `2 de 3 semanas`.

Depois da primeira substituição, a dimensão permanece observada. Inatividade futura reduz o valor; não restaura a autoavaliação.

### Coerência

A Coerência fica elegível para análise observada após:

- 5 evidências confirmadas e ativas;
- pelo menos 2 contextos textuais distintos após trim e normalização de caixa;
- pelo menos 3 competências distintas após normalização.

A análise usa entre 5 e 12 evidências. Evidências arquivadas, sugestões rejeitadas e logs não confirmados ficam fora.

### Estado do total

- ambas declaradas: `Base declarada`;
- uma dimensão substituída: `Parcialmente observado`;
- Consistência e Coerência substituídas: `Observado`;
- Credibilidade continua separada e não participa do total nesta fase.

Os pesos do total permanecem 60% Coerência e 40% Consistência em todos os estados.

## 7. Consistência observada

Janela móvel de até quatro semanas, limitada ao período iniciado na conclusão do diagnóstico.

```text
continuidade = semanas com ao menos 1 Daily Log / semanas elegíveis × 100

frequência = min(
  dias distintos com Daily Log / (2 × semanas elegíveis),
  1
) × 100

Consistência observada = continuidade × 0,70
                       + frequência × 0,30
```

Regras:

- vários logs no mesmo dia contam como um dia;
- logs arquivados não contam;
- cálculo determinístico, server-only e repetível;
- semanas e datas usam `America/Sao_Paulo`;
- `/app/score?tab=metodo` mostra período, semanas e dias usados.

## 8. Coerência observada

Atualização somente sob demanda pelo botão `Atualizar análise`.

Entradas permitidas:

- objetivo profissional do diagnóstico atual;
- 5 a 12 evidências confirmadas e ativas;
- contexto, ação, resultado, aprendizado e competências;
- IDs das evidências para rastreabilidade.

Rubrica fixa:

| Critério | Peso | Pergunta |
|---|---:|---|
| Alinhamento | 35% | As experiências sustentam o objetivo atual? |
| Conexão | 25% | Existe uma linha compreensível entre experiências e decisões? |
| Especificidade | 25% | As evidências descrevem ações e resultados concretos? |
| Recorrência | 15% | Competências importantes aparecem em mais de uma experiência? |

A Groq classifica cada critério somente como `0`, `25`, `50`, `75` ou `100`, devolve explicação curta e referencia IDs permitidos. O servidor valida o schema, recalcula a média ponderada e rejeita referência externa ao conjunto enviado.

Falha, timeout ou schema inválido preserva o último snapshot. Nenhuma chamada ocorre antes da elegibilidade.

## 9. Persistência

### `narrative_diagnostics`

- `id`, `user_id`;
- `version`;
- `status`: `draft` ou `completed`;
- `current_step`;
- `professional_objective`;
- `answers jsonb` validado;
- `declared_consistency`, `declared_coherence`, `initial_score`;
- `started_at`, `completed_at`, `created_at`, `updated_at`.

Somente um draft ativo por usuário e versão. Repetir o diagnóstico cria nova linha e preserva a anterior.

### `narrative_score_snapshots`

- `id`, `user_id`, `diagnostic_id`;
- valores e origem de cada dimensão;
- Score total e estado da origem;
- início/fim do período;
- versão da fórmula e da rubrica;
- explicação estruturada;
- IDs das evidências usadas;
- motivo e data da atualização.

Snapshots são imutáveis para o cliente. São criados na conclusão/repetição do diagnóstico, primeira substituição de dimensão, atualização manual da Coerência e mudança futura de método.

RLS limita seleção e escrita ao proprietário. Operações críticas podem usar RPC `security invoker`, sempre baseadas em `auth.uid()`.

## 10. Fluxo de dados

```text
Diagnóstico em 3 etapas
  → validação servidor
  → diagnóstico concluído
  → snapshot Base declarada
  → /app/inicio

Daily Logs
  → progresso determinístico
  → limiar atingido
  → Consistência observada

Evidências elegíveis
  → Atualizar análise
  → Groq com rubrica fixa
  → validação servidor
  → snapshot parcial ou observado
```

Não haverá cron, fila, worker, store global, nova biblioteca de formulário ou nova dependência de testes.

## 11. Contrato visual

### Direção

- desktop/web nas larguras 1024, 1280, 1440 e 1920px;
- Geist e Geist Mono nos papéis existentes;
- paleta Persona e tokens atuais sem nova família cromática;
- conteúdo antes do chrome;
- bordas e ritmo antes de cartões e sombra;
- movimento funcional e `prefers-reduced-motion`;
- Carbon como família de ícones.

### Diagnóstico

- composição sequencial, não tabs;
- uma ação principal por etapa;
- progresso textual e visual;
- alternativas de resposta como linhas selecionáveis, não pills decorativas;
- autosave discreto com `Salvando`, `Salvo` e retry;
- revisão final antes de calcular.

### Início

Uma âncora visual dominante: o Narrative Score tipográfico com origem e data.

Abaixo:

1. faixa de dimensões explicáveis;
2. linha de rastreabilidade `Diagnóstico → Registros → Evidências → Score`;
3. próxima ação;
4. listas densas de revisão e atividade;
5. competências e lacunas baseadas em evidências.

Não usar três cards iguais, velocímetro, medalhas, ranking, anéis de progresso decorativos ou cores de aprovação/reprovação.

### Score

- Resumo prioriza método e origem;
- Histórico usa lista temporal densa, não gráfico ornamental sem dados;
- Como é calculado mostra fórmulas, limiares, uso de IA e limitações em linguagem simples.

## 12. Estados e recuperação

### Diagnóstico

- não iniciado;
- draft salvo;
- validação por etapa;
- conclusão pendente;
- falha sem perda;
- concluído;
- nova versão após mudança de objetivo.

### Score

- diagnóstico não iniciado;
- Base declarada;
- progresso para observação;
- Parcialmente observado;
- Coerência desatualizada;
- atualização pendente;
- falha parcial com último valor preservado;
- Observado;
- Credibilidade indisponível.

Alterar o objetivo marca Coerência como desatualizada. Falha de uma dimensão não bloqueia Diário, Evidências ou o restante do Início.

## 13. Acessibilidade e privacidade

- WCAG 2.2 AA;
- labels persistentes e erros ligados aos campos;
- teclado completo e foco visível;
- estado não comunicado apenas por cor;
- texto ampliado sem clipping;
- anúncios acessíveis para salvar e atualizar análise;
- nenhuma resposta gera Daily Log ou evidência automaticamente;
- nenhum conteúdo privado em logs ou screenshots;
- somente saída Groq estruturada e validada é persistida;
- prompt e resposta bruta não são armazenados.

## 14. Testes e QA

### Unitários

- dez respostas e escalas;
- fórmula inicial 60/40;
- Consistência observada 70/30;
- janela, fuso, dias únicos e semanas;
- limiares 21 dias/6 logs/3 semanas;
- elegibilidade 5 evidências/2 contextos/3 competências;
- schema Groq e IDs permitidos;
- total sem Credibilidade;
- transições de origem.

### Banco

- constraints e versões;
- um draft ativo;
- snapshots imutáveis;
- RLS entre duas identidades;
- RPCs com usuário autenticado;
- rollback de dados sintéticos.

### Fluxo autenticado

- iniciar, sair, retomar e concluir diagnóstico;
- ver Base declarada no Início;
- acompanhar progresso;
- atualizar Coerência;
- preservar valor após falha;
- abrir Resumo, Histórico e Como é calculado.

### Visual

- 1024, 1280, 1440 e 1920px;
- diagnóstico, Início e Score;
- estados não iniciado, declarado, parcial, atualização e falha;
- teclado, foco, zoom e reduced motion;
- auditoria `design-sem-cara-de-ia` e revisão Ponytail `full`.

## 15. Fora do escopo

- número para Credibilidade;
- validação por terceiros;
- cron ou atualização automática da Groq;
- embeddings;
- comparação pública, ranking, streak ou gamificação;
- captura de voz;
- Persona Live e Artefatos funcionais;
- Storage e upload;
- novos provedores de IA;
- novas dependências sem necessidade comprovada.

## 16. Critério de aceite

Yan consegue responder, para qualquer valor exibido:

1. de onde veio;
2. qual período foi usado;
3. se é declarado, observado ou assistido por IA;
4. quais dados sustentam a análise;
5. o que precisa fazer para melhorar a base, sem promessa de aprovação profissional.

A Fase 7 permanece bloqueada até implementação, QA e aprovação visual explícita da Fase 6.
