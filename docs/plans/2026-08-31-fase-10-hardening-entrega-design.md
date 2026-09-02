# Fase 10 — Hardening e entrega

> Estado: em andamento. Infraestrutura recuperada e correção local de performance validada em 01/09/2026; publicação e medição final pendentes.
> Pré-condição: Fase 9 totalmente encerrada (migração aplicada e teste RLS com dois usuários rodado no Supabase — ver `docs/qa/fase-9/teste-rls-dois-usuarios.sql`). A revisão visual local já foi feita por Yan em 31/08/2026.
> Prazo-alvo: **09/09/2026**.

## 1. Objetivo e critério de sucesso

Preparar o MVP existente (Fases 1–9) para a banca do Empreenda Senac e para testes controlados, sem adicionar funcionalidade de produto nova. Hardening, consistência e uma narrativa de demonstração segura — não um recurso a mais.

A fase está correta quando:

1. o ciclo principal completo (Microsoft → onboarding → Diário → sugestão → evidência → Início/Score → Live → Artefatos → Configurações) roda do início ao fim sem intervenção manual em banco;
2. RLS foi revisada em todas as tabelas privadas das Fases 3–9, com teste de dois usuários repetido;
3. dependências e segredos foram auditados sem nenhum valor sensível exposto;
4. existe um conjunto de dados de demonstração explicitamente fictício ou autorizado, isolado da conta pessoal de Yan;
5. screenshots finais em 1024/1280/1440/1920px cobrem o ciclo principal;
6. Yan aprovou explicitamente escopo público, dados de demonstração, custo e narrativa da banca antes de qualquer deploy final.

## 2. Decisões confirmadas por Yan em 31/08/2026

1. **Data-limite:** 09/09/2026. A partir de hoje (31/08) restam 9 dias corridos — o escopo abaixo é dimensionado para caber nesse prazo, priorizando hardening real sobre polimento.
2. **Modo Automático:** fora do MVP por enquanto, confirmado. Nenhum código, contrato de consentimento ou protótipo nesta fase.
3. **Dados de demonstração:** as duas — a conta pessoal de Yan com o histórico real das Fases 1–9 continua existindo, e uma conta de demonstração separada (reaproveitando a linha de contas descartáveis já usada nas Fases 7–9 para QA) é povoada pelo fluxo real do produto para a banca testar ao vivo e para as capturas finais, sem misturar os dois.
4. **Deploy final:** manter o projeto atual (`persona-mvp-v2` na Vercel/Supabase) como está. Nenhum ambiente novo, nenhum recurso pago adicional.
5. **Hardening de segurança:** só revisão manual dirigida por risco. Strix fica fora desta fase — não há orçamento/tempo confirmado para configurá-lo dentro do prazo.

## 3. Abordagem de hardening de segurança (decidida: manual dirigido por risco)

Checklist cobre 100% das tabelas/RLS e das rotas autenticadas manualmente, tabela por tabela e rota por rota — é o mesmo padrão que as Fases 4–9 já aplicaram fase a fase, só que revisitando o projeto inteiro de uma vez. Sem Strix nesta fase: menor cobertura automatizada de superfícies inesperadas, mas cabe no prazo e não depende de orçamento, Docker ou expor código a um provedor de LLM externo. Fica registrado como possível item futuro do hardening (Fase 10 seguinte ou pós-banca), não como pendência desta fase.

## 4. Abordagem de dados de demonstração (decidida: as duas contas)

- **Conta pessoal de Yan:** continua com o histórico real das Fases 1–9. Não é tocada, resetada nem usada para gravações públicas.
- **Conta de demonstração:** reaproveita a mesma conta Microsoft descartável já usada nas Fases 7–9 para QA (nenhuma conta nova a criar). É povoada pelo fluxo real do produto — Diário, evidências, Score, Live, Artefatos — sem SQL manual e sem dado inventado por script, gerando evidência de que o ciclo funciona de ponta a ponta. É essa conta que a banca testa ao vivo e que aparece nas capturas finais.

## 5. Escopo obrigatório de hardening (`PHASES.md`, já aprovado)

- auditoria de dependências (`npm audit` ou equivalente) e segredos (`.env`, histórico de commits, logs);
- revisão de RLS em todas as tabelas das Fases 3–9, teste de dois usuários repetido;
- limites de upload e de uso da IA (Groq) — tamanho de entrada, timeout, retries, rate limit;
- recuperação de falhas: Groq indisponível, Supabase indisponível, sessão expirada;
- acessibilidade e teclado no ciclo principal completo;
- screenshots finais 1024/1280/1440/1920 do ciclo principal;
- build limpo (`lint`, `typecheck`, `test`, `build`) na íntegra do repositório;
- achados de segurança reproduzidos e corrigidos manualmente antes de fechar qualquer item.

## 6. Fora do escopo

- modo Automático do Persona Live;
- integração real com Meet, Zoom ou Teams;
- qualquer gravação ou persistência de áudio de terceiros;
- billing, paywall ou checkout;
- PWA/mobile dedicado;
- painel administrativo, filas, microsserviços;
- login local ou outro provedor além da Microsoft;
- Strix (adiado, ver §3).

## 7. Sequência até 09/09/2026

Ordem, não calendário fixo por dia — cada item só começa depois do anterior fechar, e a fase não avança para o item seguinte sem o gate correspondente:

1. **Fechar a Fase 9** — Yan aplica `supabase/migrations/20260818200000_phase_9_settings.sql` e roda `docs/qa/fase-9/teste-rls-dois-usuarios.sql` no SQL Editor; resultado registrado em `docs/reviews/fase-9-configuracoes-privacidade.md`.
2. **Auditoria de dependências e segredos** — `npm audit`, revisão de `.env.local`/`.gitignore`, checagem de que nenhum segredo entrou em commits, logs ou Markdown.
3. **Revisão de RLS tabela por tabela** — reler todas as migrações das Fases 3–9 e confirmar política por tabela contra o padrão "por proprietário"; qualquer tabela sem RLS ou com política larga demais vira achado corrigido antes de seguir.
4. **Limites e recuperação de falhas** — conferir limites de entrada/timeout/retry da Groq já implementados nas Fases 4/6/7/8/9, e os estados de falha (Groq indisponível, Supabase indisponível, sessão expirada) em cada rota autenticada.
5. **Acessibilidade e teclado** — passar pelo ciclo principal completo só com teclado, focando nos fluxos mais novos (Artefatos, Configurações).
6. **Popular a conta de demonstração** pelo fluxo real (onboarding → Diário → evidências → Score → Live → Artefatos → Configurações), conforme §4.
7. **Screenshots finais** 1024/1280/1440/1920px do ciclo principal com a conta de demonstração.
8. **Build limpo final** — `lint`, `typecheck`, `test`, `build` na íntegra do repositório.
9. **Sessão de Avaliação Visual e gate final** — Yan aprova escopo público, dados de demonstração e narrativa da banca antes de qualquer ajuste em produção.

## 8. Progresso

- **Incidente de infraestrutura e performance (01/09/2026):** o projeto Supabase estava pausado e o domínio específico retornava `NXDOMAIN`; foi reativado sem upgrade e voltou a responder em dois resolvedores públicos. Auth/REST, OAuth Microsoft e uma leitura real em `/app/inicio` foram validados. A linha de base de cinco navegações autenticadas aquecidas teve mediana de 2.942 ms. Localmente, o Proxy passou a cobrir apenas `/app`, `/onboarding` e `/api/export`, layout e Início compartilham a leitura de perfil por requisição, e as fontes Geist usam os arquivos do Next local. Lint, TypeScript, 32/32 testes e build passaram. Publicação e novo trace em produção continuam pendentes; nenhuma RPC foi criada sem evidência.
- **Item 2 (dependências e segredos):** `npm audit` sem dependências de produção ou desenvolvimento — 0 vulnerabilidades; nenhum arquivo `.env*` (exceto `.env.example`, que não existe ainda) nunca foi commitado; busca por padrões de chave Groq/JWT no histórico completo do Git sem nenhum resultado real. Sem achados.
- **Item 3 (RLS tabela por tabela):** reli as nove migrações (Fases 3–9). Todas as tabelas privadas têm RLS habilitada; toda política de `insert`/`update` tem `with check` correspondente, sempre `(select auth.uid()) = user_id` (ou `= id` em `profiles`); tabelas sem coluna própria de dono (`live_session_evidences`, `live_questions`, `live_draft_versions`, `artifact_sources`, `artifact_versions`) foram desnormalizadas com `user_id` direto em vez de depender de join, evitando a classe mais comum de bug de RLS; escrita sensível é sempre por RPC `security definer`, nunca INSERT/UPDATE direto do cliente nas tabelas mais críticas. Sem achados.
- **Item 4 (limites e recuperação de falhas da Groq):** os três pontos de chamada (`structure-evidence.ts`, `generate-live-response.ts`, `generate-artifact.ts`) usam `maxRetries: 1` e timeout de 12–15s, com erros tipados `timeout`/`rate_limit`/`provider_error` que já acionam o modo Manual no fluxo, conforme validado nas Fases 4/7/8. Entrada já é limitada no banco (Daily Log 40–2000 caracteres, pergunta do Live 8–500). Sem achados.
- **Item 5 (acessibilidade e teclado):** confirmado estaticamente que `:focus-visible` e `prefers-reduced-motion` são globais em `globals.css`, e que os formulários novos (Fase 9) já usam `aria-describedby`/`aria-invalid` por campo. **Falta** o passe real só-teclado pelo ciclo principal em navegador — a tentativa de automatizar isso nesta sessão não conseguiu abrir um navegador de forma confiável; depende de Yan ou de uma sessão futura com automação de navegador funcionando.
- **Itens 6–9 (dados de demonstração, screenshots, build final, gate):** não iniciados — dependem da Fase 9 estar fechada (migração + teste RLS) e de login Microsoft real.
