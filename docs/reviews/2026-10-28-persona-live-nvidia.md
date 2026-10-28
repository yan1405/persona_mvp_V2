# Integração NVIDIA no Persona Live

> Data: 28/10/2026<br>
> Escopo: troca do modelo do Persona Live manual; sem deploy e sem uso de dados reais.

## Decisão

Por solicitação de Yan, o Persona Live passa a usar a API OpenAI-compatible da NVIDIA com o modelo padrão `z-ai/glm-5.3-flash`.

- o segredo entra somente por `NVIDIA_API_KEY`, sem prefixo público;
- `NVIDIA_MODEL` permite substituir o modelo sem alterar código;
- Diário, Narrative Score e Artefatos continuam na Groq nesta mudança;
- a saída textual do modelo é validada pelo contrato existente do Persona;
- IDs, trechos e números não sustentados pelas evidências continuam rejeitados;
- falhas preservam pergunta e dados existentes.

## Segurança

A chave enviada no chat foi tratada como exposta e não foi copiada para código, documentação, `.env.local`, logs ou testes. Ela deve ser revogada na NVIDIA e substituída por uma chave nova no ambiente local e, após autorização específica, no ambiente de deploy.

## Validação executada

```text
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
git diff --check
```

- lint: aprovado;
- TypeScript: aprovado;
- testes: 32/32 aprovados;
- build: aprovado, com 24 páginas geradas;
- nenhuma chamada real à NVIDIA foi executada.

Uma chamada real e o fluxo autenticado não fazem parte desta validação local porque exigem uma chave nova e dados sintéticos autorizados.
