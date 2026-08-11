# Revisão da Fase 4 — Diário e evidências

> Data: 10/08/2026
> Estado: implementada e tecnicamente validada; aprovação de Yan pendente

## Entregue neste bloco

- shell autenticado compartilhado com navegação Carbon;
- `/app/diario` com editor, data, contexto, busca, filtros e histórico;
- `/app/diario/[id]` com abas Registro e Sugestões;
- criação, edição e exclusão protegida de Daily Logs;
- sugestão manual revisável, confirmação humana e rejeição;
- persistência em `evidence_suggestions` e `evidences`;
- RPC atômica que confirma a evidência e preserva o registro-fonte;
- RLS nas novas tabelas;
- SDK Groq server-only com schema JSON estrito, timeout, retry curto e erros classificados;
- fallback manual quando a IA não estiver configurada ou falhar.

## Validação executada

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           12/12 aprovados
npm.cmd run build      aprovado
```

No Supabase, um teste transacional com rollback confirmou:

- criação de log e sugestão manual;
- confirmação atômica de evidência;
- isolamento RLS para identidade não proprietária;
- bloqueio da exclusão da fonte após a confirmação.

Nenhum dado de teste desse ensaio foi mantido.

## Fluxo real com Groq

`GROQ_API_KEY` foi configurada por Yan somente em `.env.local`. O valor não foi impresso, copiado para chat, Markdown, screenshot ou Git.

O primeiro teste confirmou que chave e modelo eram válidos, mas a Groq rejeitou `uniqueItems` no JSON Schema. A palavra-chave foi removida porque o parser do servidor já elimina duplicatas. Um teste automatizado protege essa compatibilidade.

O ciclo autenticado validou:

1. criação de Daily Log sintético;
2. falha Groq preservando o texto e permitindo retry;
3. geração real com `openai/gpt-oss-20b`;
4. detecção de desafio e aprendizado inferidos sem suporte explícito;
5. reforço do prompt para usar `null` nesses campos;
6. rejeição da primeira sugestão;
7. regeneração sem os campos inventados;
8. confirmação humana e criação da evidência;
9. bloqueio da exclusão do registro-fonte.

Depois das capturas, a evidência, as sugestões e o Daily Log sintéticos foram removidos por ID e contexto exatos. A consulta de verificação retornou zero; o Daily Log real de Yan não foi alterado.

## Validação visual

Capturas sem e-mail ou relato real:

- `fase-4-diario-evidencias/evidencia-confirmada-1024.jpg`;
- `fase-4-diario-evidencias/evidencia-confirmada-1280.jpg`;
- `fase-4-diario-evidencias/evidencia-confirmada-1440.jpg`;
- `fase-4-diario-evidencias/evidencia-confirmada-1920.jpg`.

O QA encontrou e corrigiu overflow horizontal no detalhe. A versão final usa largura fluida com máximo de `1280px`, cabeçalho adaptativo, título controlado e ações de estruturação empilhadas de forma previsível.

## Auditorias obrigatórias

### `design-sem-cara-de-ia`

O script varreu 35 arquivos e apontou duas categorias, ambas revisadas e justificadas:

- `#7C3AED`: paleta original do Persona, explicitamente aprovada;
- centralização em Termos e Privacidade: coluna de leitura deliberadamente limitada, não composição genérica de marketing.

Não há gradiente decorativo, glassmorphism, cards uniformes com sombra, copy genérica ou biblioteca visual padrão sem tokens próprios.

### Ponytail `full`

- `uniqueItems` removido em vez de criar camada de compatibilidade;
- deduplicação continuou no parser existente;
- CSS redundante removido após o QA;
- sem store global, fila, gateway, Zod, Playwright local ou tabela prematura de fontes;
- testes continuam no runner nativo do Node.

## Gate pendente

Yan precisa testar e aprovar o Diário, o nível de automação e um exemplo próprio. A Fase 5 permanece bloqueada.

## O que Yan pode testar

1. criar e abrir um Daily Log;
2. editar o texto original sem substituição pela IA;
3. gerar ou criar manualmente uma sugestão;
4. revisar campos e competências;
5. confirmar uma evidência somente após revisão;
6. tentar excluir a fonte confirmada e conferir o bloqueio;
7. buscar e filtrar o histórico;
8. observar mensagens de indisponibilidade sem perder o registro.
