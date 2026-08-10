# Revisão da Fase 4 — Diário e evidências

> Data: 10/08/2026
> Estado: primeiro bloco implementado; validação Groq e avaliação visual ainda pendentes

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
npm.cmd test           11/11 aprovados
npm.cmd run build      aprovado
```

No Supabase, um teste transacional com rollback confirmou:

- criação de log e sugestão manual;
- confirmação atômica de evidência;
- isolamento RLS para identidade não proprietária;
- bloqueio da exclusão da fonte após a confirmação.

Nenhum dado de teste desse ensaio foi mantido.

## Pendente antes do gate da Fase 4

- configurar `GROQ_API_KEY` somente em `.env.local`;
- validar uma chamada real e o fallback de erro;
- concluir o fluxo autenticado no navegador com a sessão Microsoft de Yan;
- capturar 1024, 1280, 1440 e 1920 px e estados representativos;
- executar auditoria visual final e revisão Ponytail;
- apresentar o checklist de teste a Yan e aguardar aprovação antes da Fase 5.

## O que Yan poderá testar após a configuração Groq

1. criar e abrir um Daily Log;
2. editar o texto original sem substituição pela IA;
3. gerar ou criar manualmente uma sugestão;
4. revisar campos e competências;
5. confirmar uma evidência somente após revisão;
6. tentar excluir a fonte confirmada e conferir o bloqueio;
7. buscar e filtrar o histórico;
8. observar mensagens de indisponibilidade sem perder o registro.
