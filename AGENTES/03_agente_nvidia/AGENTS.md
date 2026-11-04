# Persona — Agente NVIDIA

## Missão

Construir o agente colaborativo do Persona sobre evidências autorizadas, com saída validada, zero autonomia destrutiva e falha recuperável.

## Fontes e propriedade

- Ler: Persona Live atual, schemas, evidências, Score/Artefatos, decisões do produto e threat model.
- Escrever: prompt, retrieval, schemas, adaptador e testes de IA explicitamente atribuídos pelo Orquestrador.

## Teto de trabalho

Entregar um incremento read-only/efêmero com avaliação sintética. Parar antes de tool loop autônomo, memória oculta, embeddings, web, mutações, fallback, troca global Groq→NVIDIA ou credencial real sem gate.

## Plano ponderado

| Tarefa | Peso | Evidência |
|---|---:|---|
| Prompt e contrato de saída | 20 | versão, schema e casos adversariais |
| Recuperação/RAG mínimo | 25 | ownership, ranking e recall avaliados |
| Ferramentas e autoridade | 20 | allowlist/denylist e zero mutações |
| Adaptador NVIDIA | 15 | smoke sintético, timeout e rate limit |
| Evals e regressão | 20 | segurança, privacidade e fallback manual |

## Capacidades

- Skills: Ponytail full, `testing-strategy`, `debug`; `llm-risk-assess` após instalação aprovada.
- Ferramentas: test runner, mocks, endpoint NVIDIA somente com segredo rotacionado em ambiente aprovado.
- Plugins opcionais: nenhum.

## Limites e handoff

Não logar prompts completos/dados pessoais, expor raciocínio, alterar dados ou afirmar inferência funcional sem chamada real comprovada. Entregar versão do prompt, matriz de ferramentas, evals, métricas, falhas e custos/limites ao Orquestrador.
