# Revisão da Fase 7 — Persona Live manual

> Implementada e validada tecnicamente em 12/08/2026. Yan autorizou o deploy na Vercel; a validação autenticada final será repetida no endereço publicado.

## Entrega

- `/app/live`: preparação da oportunidade, recomendação determinística e histórico de sessões;
- `/app/live/[id]`: autorização de 1 a 8 evidências, sessão manual, várias perguntas, versões e encerramento;
- argumentos reais e rascunho sugerido em regiões separadas;
- ações `Encurtar`, `Aprofundar`, `Outra experiência` e `Copiar rascunho`;
- lacuna explícita quando as evidências não sustentam uma resposta;
- histórico append-only e duplicação de sessão encerrada sem copiar perguntas;
- nenhuma captura de áudio, integração com reuniões, embedding, fila ou Artefato.

## Banco e segurança

A migração `20260812150000_phase_7_persona_live.sql` foi aplicada ao projeto Supabase `persona-mvp-v2` em 12/08/2026.

- tabelas `live_sessions`, `live_session_evidences`, `live_questions` e `live_draft_versions`;
- RLS ativa e leitura restrita ao proprietário;
- mutações de estado passam por funções que reconfirmam `auth.uid()`;
- evidências autorizadas precisam estar confirmadas e pertencer ao usuário;
- versões são acrescentadas, não sobrescritas;
- Groq permanece server-only e a saída é validada contra IDs, campos, trechos e números presentes nas evidências;
- nenhuma chave, cookie, sessão ou conteúdo privado foi adicionado ao repositório.

## Validação técnica

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           26/26 aprovados
npm.cmd run build      aprovado
```

O build de produção concluiu 18 páginas e incluiu `/app/live` e `/app/live/[id]`. A API do Supabase confirmou a existência da tabela após a migração e negou leitura anônima com `42501`, conforme esperado.

## Auditoria visual e originalidade

O fluxo usa hierarquia editorial, listas densas, divisores, Carbon e os tokens já aprovados. Argumentos e rascunho têm pesos visuais diferentes; a interface não usa grid promocional de cards, gradiente decorativo, glassmorphism, gamificação ou copy genérica.

O auditor `design-sem-cara-de-ia` encontrou somente:

- o violeta oficial já aprovado da marca;
- raio de `4px` em status e controles compactos;
- uma sombra interna de `2px` que comunica evidência selecionada;
- centralização preexistente apenas em Termos e Privacidade.

Nenhum achado exige correção. As capturas finais e o exercício autenticado completo serão registrados no endereço da Vercel, porque o navegador automatizado local não concluiu navegação por `localhost` neste ciclo.

## Ponytail `full`

- nenhuma dependência nova;
- recomendação determinística antes de qualquer embedding;
- Groq sob demanda, sem fila, cron ou infraestrutura paralela;
- quatro tabelas correspondem diretamente ao contrato de sessão, autorização, pergunta e versão;
- um arquivo de testes cobre recomendação, autorização de fonte, números inventados e lacuna segura.

## Limitações deliberadas

- modo Automático, áudio e integrações de reunião permanecem fora do escopo;
- salvar como Artefato pertence à Fase 8;
- Termos e Privacidade continuam provisórios;
- o endereço de produção é público no plano Hobby, embora as rotas internas exijam login Microsoft.

## Gate

Após o deploy, validar no endereço publicado: login Microsoft, criação de sessão, seleção de evidências, pergunta real, geração Groq, versões, pausa, encerramento e duplicação.

## Hardening de 16/08/2026

- `parseLiveResponse` passou a persistir argumentos somente como trechos literais validados das evidências autorizadas;
- o rascunho persistido é reconstruído no servidor exclusivamente a partir desses trechos, sem aceitar afirmações livres do modelo;
- um teste de regressão prova que texto e rascunho inventados pela Groq são substituídos pela fonte autorizada;
- 27/27 testes, lint, TypeScript e build foram aprovados;
- o painel do Supabase confirmou o Site URL `https://persona-mvp-v2.vercel.app` e o callback publicado na lista permitida;
- a rotação da chave Groq e a validação autenticada de produção continuam pendentes.
