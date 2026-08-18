# Revisão da Fase 8 — Artefatos profissionais

> Data: 18/08/2026
> Estado: implementada, publicada e tecnicamente validada; aprovação visual de Yan pendente

## Entrega

- biblioteca com busca e filtros por tipo, estado e data;
- criação obrigatória de Resposta STAR, Pitch 30/60/90, Currículo ATS e Portfólio por casos;
- geração inicial baseada somente em evidências autorizadas;
- IA posterior limitada à seção escolhida;
- editores com autosave e reordenação por botões nos documentos estruturados;
- estados Rascunho e Revisado;
- versões em geração, ação de IA, revisão e restauração;
- fontes literais consultáveis;
- PDF nativo para Currículo e Portfólio;
- ação opcional do Persona Live que salva um STAR sem nova geração.

## Segurança e dados

- tabelas privadas `artifacts`, `artifact_sources` e `artifact_versions` com RLS;
- seis RPCs autenticadas e controle otimista por `revision`;
- o modelo seleciona citações, mas o servidor reconstrói o texto persistido;
- trechos ausentes da evidência são rejeitados;
- nenhuma chave foi registrada, exibida ou versionada;
- o E2E usou apenas a evidência explicitamente fictícia `Teste interno Fase 8 — cenário fictício`.

## Validação

```text
npm.cmd test           30/30 aprovados
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd run build      aprovado
git diff --check       aprovado
```

Fluxos exercitados em `https://persona-mvp-v2.vercel.app`:

1. criação e geração dos quatro tipos;
2. Pitch com geração inicial e `Aprofundar` somente na seção de 30 segundos;
3. autosave, marcação como Revisado e criação de checkpoint;
4. restauração de versão, retornando para Rascunho;
5. busca e filtros combinados da biblioteca;
6. Currículo e Portfólio com ação `Exportar PDF` e folha de impressão;
7. Persona Live manual com evidência fictícia → resposta sustentada → `Salvar nos Artefatos` → STAR em Rascunho;
8. falhas do Groq preservando contexto e fontes, seguidas de retry único apenas para `json_validate_failed`.

## Revisão visual

- 1024, 1440 e 1920 px foram inspecionados sem quebra funcional;
- capturas de produção:
  - `docs/qa/fase-8/biblioteca-1440.png`;
  - `docs/qa/fase-8/curriculo-1440.png`;
- a auditoria `design-sem-cara-de-ia` encontrou apenas falsos positivos ou decisões deliberadas: token violeta da marca, sombras internas de seleção/foco e dois raios de 4 px do Live;
- direção preservada: editorial escura, lista densa, superfícies planas, acento violeta restrito, sem cards genéricos, gradientes ou chat.

## Registros de QA

Os testes criaram uma evidência fictícia, uma sessão Live fictícia e Artefatos identificados por `QA Fase 8`. Eles permanecem visíveis na conta para a revisão de Yan. Não removê-los sem confirmação explícita.

## Gate

Yan deve revisar a Biblioteca e o editor de Currículo nas capturas ou na produção. A Fase 8 só será marcada como aprovada após sua confirmação explícita.
