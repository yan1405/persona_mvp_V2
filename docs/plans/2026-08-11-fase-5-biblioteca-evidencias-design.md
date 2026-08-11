# Design da Fase 5 — Biblioteca de Evidências

> Data: 11/08/2026
> Estado: aprovado para implementação
> Autorização: Yan escolheu “Links agora e arquivos depois” e confirmou o contrato completo da fase.

## 1. Objetivo e sucesso

Transformar evidências confirmadas em uma biblioteca consultável, editável e rastreável:

```text
Daily Log ou registro manual → evidência registrada → link de prova → evidência documentada
```

O fluxo é bem-sucedido quando uma pessoa autenticada consegue encontrar evidências confirmadas na Fase 4, registrar uma evidência manual, editar sua estrutura, adicionar ou remover links de prova, arquivar sem perder rastreabilidade e compreender por que o nível é Registrada ou Documentada.

## 2. Abordagens comparadas

### A — Links agora e arquivos depois

**Escolhida.** Implementa provas por URL validada e adia Supabase Storage até existir contrato próprio de tipos, tamanho, exclusão e download seguro.

Vantagens: entrega o nível Documentada, reduz risco de dados e mantém o escopo demonstrável.

### B — Links e arquivos agora

Inclui bucket, upload, políticas de Storage, limites, download e remoção. Foi adiada porque amplia segurança e QA sem ser necessária para provar o ciclo desta fase.

### C — Biblioteca sem provas

Listaria apenas evidências já confirmadas. Foi rejeitada porque não completa a distinção entre Registrada e Documentada.

## 3. Contrato da interface

### `/app/evidencias`

- lista editorial densa, sem grade de cards;
- título e ação `Registrar evidência`;
- busca textual;
- filtros por visão salva, competência, período e nível;
- `Todas` e `Para revisar` como filtros, não abas;
- título, competências, nível, origem e atualização visíveis;
- estados vazio inicial, nenhum resultado e erro recuperável.

### `/app/evidencias/[id]`

Abas irmãs por query string:

- **Resumo:** contexto, desafio, ação, resultado, aprendizado e competências;
- **Provas:** origem, links e nível calculado;
- **Uso:** explicação de que Persona Live e Artefatos entram nas fases seguintes.

Ações: editar, adicionar/remover link e arquivar. Exclusão definitiva fica fora da fase para preservar rastreabilidade.

### Assinatura visual

A linha de rastreabilidade `origem → estrutura confirmada → prova` é a decisão visual forte. A composição reutiliza shell, tokens, divisores, listas densas, Geist e Carbon já existentes. Roxo fica restrito a ação, foco, seleção e rastreabilidade.

## 4. Modelo de dados

### Evolução de `evidences`

- manter campos estruturados e vínculo opcional com Daily Log;
- aceitar evidência manual sem `daily_log_id` ou `suggestion_id`;
- estado `confirmed` ou `archived`;
- nível derivado: Registrada sem link, Documentada com ao menos um link;
- não persistir nível Validada ou Certificada sem mecanismo externo.

### `evidence_sources`

- `id`, `user_id`, `evidence_id`;
- tipo limitado a `link`;
- título opcional;
- URL HTTP/HTTPS normalizada e validada;
- timestamps;
- RLS completa por usuário;
- remoção da evidência em cascata somente no vínculo de fonte, sem expor dados de outro usuário.

O nível é calculado a partir da existência de fontes; não haverá coluna duplicada nem trigger apenas para manter esse derivado.

## 5. Ações e validação

- `createEvidence`;
- `updateEvidence`;
- `archiveEvidence`;
- `addEvidenceLink`;
- `removeEvidenceLink`.

Cada ação autentica no servidor, valida fronteiras, restringe por `user_id`, preserva dados em erro e revalida somente Biblioteca e detalhe afetados.

Links aceitam somente `http:` ou `https:`, com limite de tamanho e título curto. Esquemas como `javascript:`, `data:` e caminhos locais são rejeitados.

## 6. Estados e copy

- carregando pela navegação nativa;
- vazio inicial com ação concreta;
- nenhum resultado com limpeza dos filtros;
- salvando, salvo e erro sem perda do formulário;
- link inválido;
- origem indisponível;
- arquivada;
- nível Registrada ou Documentada;
- Validada e Certificada somente como explicação indisponível;
- Uso vazio sem inventar sessões Live ou Artefatos.

A voz permanece direta e operacional. Não usar gamificação, “força” inventada, porcentagem de confiança ou copy promocional.

## 7. Testes e segurança

- validação de formulário e URL;
- nível derivado pela existência de link;
- RLS entre identidades ou teste equivalente autorizado;
- evidência da Fase 4 aparece automaticamente;
- registro manual não exige Daily Log;
- remoção do último link rebaixa para Registrada;
- arquivamento preserva fontes e estrutura;
- lint, typecheck, testes e build;
- fluxo real no navegador;
- screenshots 1024/1280/1440/1920;
- auditoria `design-sem-cara-de-ia` e revisão Ponytail `full`.

## 8. Fora desta fase

- upload, Supabase Storage, preview e download de arquivos;
- validação por terceiros e certificação institucional;
- exclusão definitiva de evidência;
- ações em lote;
- taxonomia global de competências;
- paginação, busca vetorial, cache ou store global;
- Persona Live, Artefatos e cálculo do Narrative Score.

## 9. Sequência de implementação

1. migração e validações puras;
2. leitura, busca e filtros da Biblioteca;
3. registro manual e edição;
4. links de prova e nível derivado;
5. detalhe, arquivamento e estados;
6. RLS, testes, navegador e QA visual;
7. revisão, handoff e commit da implementação.
