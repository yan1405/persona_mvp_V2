# Design da Fase 4 — Diário, estruturação assistida e revisão

> Data: 10/08/2026  
> Estado: autorizado para implementação  
> Autorização: Yan confirmou “pode iniciar a fase 4” após receber o handoff e o repositório publicado.

## 1. Objetivo e sucesso

Completar o primeiro ciclo de valor do Persona:

```text
Daily Log original → sugestão estruturada → revisão humana → evidência confirmada
```

O fluxo é bem-sucedido quando uma pessoa autenticada consegue criar, localizar, editar e excluir um registro; estruturar manualmente ou com Groq; revisar cada campo; e criar uma evidência somente por confirmação explícita. O texto original nunca é substituído pela saída da IA.

## 2. Abordagens comparadas

### A — Server Components + Server Actions + Supabase direto

**Escolhida.** Reutiliza autenticação, clientes Supabase, formulários e validação já presentes. Leituras acontecem no servidor e cada mutação autentica, valida, restringe por usuário e revalida a rota afetada.

Vantagens: menor superfície HTTP, sem estado global, progressive enhancement, RLS preservada e menor número de conceitos.

### B — Route Handlers + cliente com fetch/cache

Permitiria uma experiência mais parecida com SPA, mas duplicaria contratos HTTP, estados de cache, autenticação e tratamento de erros sem necessidade demonstrada na Fase 4.

### C — Funções RPC para todo o domínio

Concentraria regras no Postgres, mas aumentaria o acoplamento e a dificuldade de teste para operações simples. RPC será usada somente quando atomicidade real justificar, como confirmar sugestão e criar evidência na mesma transação.

## 3. Contrato da interface

### Shell autenticado

- cabeçalho de 48px com logo Persona;
- trilho lateral de 56px com Início e Diário ativos nesta fase;
- destinos futuros aparecem indisponíveis, sem links quebrados;
- conteúdo operacional de até 1280px;
- navegação Carbon selecionada individualmente;
- desktop-first em 1024, 1280, 1440 e 1920px.

### `/app/diario`

- âncora visual: editor “O que aconteceu hoje?”;
- texto entre 40 e 2.000 caracteres;
- data da experiência e contexto opcionais;
- ação `Salvar registro`;
- busca textual, período e estado como ferramentas locais;
- histórico em linhas densas, não em cards repetidos;
- estados vazio inicial e nenhum resultado distintos.

### `/app/diario/[id]`

- deep link estável;
- abas irmãs por query string: `Registro` e `Sugestões`;
- `Registro`: fonte original, data, contexto, edição e exclusão;
- `Sugestões`: geração, fallback manual, campos estruturados e confirmação;
- exclusão usa explicação e confirmação explícita;
- log com evidência confirmada não pode ser apagado silenciosamente.

### Voz e assinatura

- copy direta, operacional e específica;
- paleta e logos oficiais do Persona;
- Geist Sans + Geist Mono;
- ritmo por divisores e linhas editoriais;
- elemento-assinatura: rastreabilidade visível `registro → sugestão → evidência`;
- sem gradiente, mascote decorativo, card grid uniforme ou copy motivacional vaga.

## 4. Modelo de dados

### Evolução de `daily_logs`

- `occurred_on date` para a data declarada;
- `context text` opcional e curto;
- preservar `content` como fonte original;
- manter `status` em `raw`, `structured` ou `archived`;
- índices por usuário, data e atualização.

### `evidence_suggestions`

- sempre vinculada a `user_id` e `daily_log_id`;
- origem `ai` ou `manual`;
- estado `generating`, `for_review`, `confirmed`, `rejected`, `failed` ou `no_suggestion`;
- título, contexto, desafio, ação, resultado, competências e aprendizado;
- campos sem suporte registrados em `unsupported_fields`;
- falha guarda somente `error_code`, nunca o relato ou a resposta completa do provedor;
- múltiplas versões são permitidas para regeneração e histórico de decisão.

### `evidences`

- criada somente por confirmação transacional de uma sugestão;
- vínculo direto ao Daily Log como fonte suficiente nesta fase;
- cópia revisada dos campos estruturados;
- estado `confirmed` ou `archived`;
- `evidence_sources` fica adiada até existir anexo ou fonte adicional real.

Todas as tabelas privadas usam RLS por `auth.uid()`. Exclusão de um log com evidência confirmada é bloqueada pelo vínculo e explicada na interface.

## 5. Contrato da Groq

### Fronteira

- SDK oficial em módulo server-only;
- `GROQ_API_KEY` somente em `.env.local` e ambiente de deploy;
- modelo configurável por `GROQ_MODEL`;
- no máximo 2.000 caracteres do Daily Log e contexto estritamente necessário;
- timeout e retry limitados;
- nenhum anexo, e-mail, token ou perfil completo enviado;
- logs técnicos contêm somente categoria/código da falha.

### Saída validada

```json
{
  "useful": true,
  "reason": null,
  "suggestions": [
    {
      "title": "string",
      "context": "string ou null",
      "challenge": "string ou null",
      "action": "string ou null",
      "result": "string ou null",
      "competencies": ["string"],
      "learning": "string ou null",
      "unsupported_fields": ["result"]
    }
  ]
}
```

Limites: uma a três sugestões, strings curtas, competências deduplicadas e nenhum campo fora do schema. `useful = false` exige lista vazia e motivo curto.

Erros públicos equivalentes: não configurada, timeout, limite do provedor, saída inválida, indisponibilidade e conteúdo insuficiente. Em todos os casos, o Daily Log permanece salvo e o modo manual continua disponível.

## 6. Ações e autorização

- `createDailyLog`;
- `updateDailyLog`;
- `deleteDailyLog`;
- `createManualSuggestion`;
- `generateSuggestion`;
- `saveSuggestion`;
- `rejectSuggestion`;
- `confirmSuggestion` por função transacional no Supabase.

Cada ação:

1. autentica novamente no servidor;
2. valida somente os campos recebidos;
3. consulta/muta por ID e `user_id`;
4. retorna mensagem restrita para a interface;
5. revalida apenas as rotas afetadas.

## 7. Estados e erros

- salvando, salvo e falha sem perda do formulário;
- lista vazia e busca sem resultado;
- gerando;
- sugestão para revisar;
- nenhuma sugestão útil;
- falha Groq com tentativa novamente;
- modo manual;
- alterações inválidas preservadas;
- confirmação concluída;
- exclusão bloqueada quando há derivado confirmado;
- recurso não encontrado sem revelar dados de outro usuário.

## 8. Testes e gate

- validação de Daily Log e revisão;
- parser/schema da Groq;
- confirmação transacional sem evidência prematura;
- RLS com usuários distintos ou verificação equivalente autorizada;
- falha da Groq preservando edição;
- fluxo real no navegador;
- lint, typecheck, testes e build;
- screenshots 1024/1280/1440/1920;
- auditoria `design-sem-cara-de-ia`;
- revisão Ponytail `full`.

## 9. Fora desta fase

- voz, anexos e Storage;
- Biblioteca de Evidências completa;
- Narrative Score;
- Persona Live e Artefatos;
- notificações;
- embeddings, streaming, fila, cache de IA ou gateway multiprovedor;
- exclusão em cascata de evidências confirmadas.

## 10. Sequência de implementação

1. migração e validações puras;
2. shell e leitura do Diário;
3. criação/edição/exclusão;
4. sugestão manual e confirmação;
5. fronteira Groq sem segredo;
6. solicitar a chave a Yan imediatamente antes da configuração;
7. validar fluxo, screenshots, revisão e commit da fase.
