# Roadmap operacional por fase

Este arquivo descreve o que cada fase entrega, quais áreas afeta, quais estados precisa cobrir e qual gate impede o avanço. Fases 1–3 refletem trabalho real. Fases 4–10 são a sequência recomendada para realizar a arquitetura aprovada e precisam de confirmação de Yan antes de começar.

## Legenda

- **Aprovada:** Yan aceitou explicitamente.
- **Implementada, pendente:** código e validação existem, mas falta aprovação de Yan.
- **Planejada:** deriva dos documentos aprovados, sem implementação.
- **Fora do escopo:** não construir sem nova decisão de produto.

## Fase 0 — Governança, escopo e arquitetura

**Estado:** aprovada e ativa como regra permanente.

### Objetivo

Definir o produto, separar v2 de legado, aprovar stack, mapa de páginas, direção visual, política de componentes, segurança e processo de aprovação.

### Entregas existentes

- `AGENTS.md` como governança principal;
- `docs/PRODUCT_BRIEF.md`;
- `docs/architecture/INFORMATION_ARCHITECTURE.md`;
- `docs/architecture/TECHNICAL_ARCHITECTURE.md`;
- `docs/audits/2026-08-10-product-scope-audit.md`;
- `docs/design/design-dna.json`;
- `docs/design/BRAND_FOUNDATION.md`;
- `docs/design/DESIGN_DNA_ADAPTATION.md`;
- `docs/design/VISUAL_REVIEW_PROTOCOL.md`.

### Decisões permanentes

- web/desktop primeiro;
- Next.js App Router, React, TypeScript, Supabase e Groq server-only;
- Microsoft é o único provedor de login;
- IA nunca confirma fatos sozinha;
- Persona v1 é histórico, não referência visual;
- somente paleta e logos originais do Persona são reutilizados;
- sem cobrança ou recursos pagos sem autorização explícita.

### Gate

Qualquer mudança em público, monetização, rotas principais, stack, fluxo de evidências ou identidade precisa de nova aprovação e registro no log.

## Fase 1 — Fundação técnica e entrada

**Estado:** aprovada em 10/08/2026.

### Objetivo

Criar a aplicação executável, aplicar a identidade aprovada e provar a qualidade visual em uma tela-piloto de entrada.

### Rotas e áreas

- `/` — portão inicial;
- `/entrar` — composição dividida com demonstração `fonte → argumento → ativação` e acesso Microsoft;
- `/termos` — texto provisório;
- `/privacidade` — texto provisório.

### Funções entregues

- scaffold Next.js 16 e Tailwind 4;
- Geist Sans e Geist Mono;
- tokens da paleta Persona;
- logos locais oficiais;
- foco visível e movimento reduzido;
- porta de desenvolvimento `3100`.

### Estados obrigatórios cobertos

- entrada padrão;
- foco por teclado;
- navegação jurídica;
- larguras 1024, 1280, 1440 e 1920px.

### Evidências e referências

- revisão: `docs/reviews/fase-1-fundacao.md`;
- screenshots: `docs/reviews/fase-1-fundacao/`;
- marca: `docs/design/BRAND_FOUNDATION.md`.

### Gate concluído

Yan aprovou a correção que removeu a paleta verde do CRM e aplicou a paleta/logos do Persona.

## Fase 2 — Autenticação Microsoft

**Estado:** aprovada em 10/08/2026.

### Objetivo

Permitir login real com contas Microsoft pessoais, profissionais e educacionais, mantendo sessão segura no servidor.

### Rotas e áreas

- `/auth/iniciar` — inicia OAuth;
- `/auth/callback` — conclui PKCE;
- `/auth/erro` — recuperação segura;
- `/onboarding` — destino autenticado provisório na validação da fase;
- `proxy.ts` — renovação e proteção inicial.

### Funções entregues

- Supabase Auth + Microsoft Azure;
- Authorization Code com PKCE;
- escopo `email`;
- cookies propagados em Route Handlers;
- validação de claims no servidor;
- bloqueio de redirect externo no parâmetro `next`;
- suporte a chave pública publishable ou anon legada;
- teste unitário do redirect seguro.

### Configuração externa

- projeto Supabase `persona-mvp-v2`;
- aplicativo Microsoft Entra;
- client secret armazenado somente no Supabase;
- validade registrada até 06/02/2027.

### Estados obrigatórios cobertos

- configuração ausente;
- retorno seguro do provedor;
- falha do provedor/callback;
- sessão autenticada persistente;
- rota privada sem sessão.

### Evidências e referências

- plano: `docs/plans/2026-08-10-fase-2-autenticacao-design.md`;
- correção PKCE: `docs/plans/2026-08-10-pkce-cookie-propagation-design.md`;
- revisão: `docs/reviews/fase-2-autenticacao.md`;
- screenshots: `docs/reviews/fase-2-autenticacao/`.

### Gate concluído

Login Microsoft real chegou ao onboarding e permaneceu autenticado após recarregar.

## Fase 3 — Onboarding funcional

**Estado:** aprovada para avanço em 10/08/2026.

### Objetivo

Concluir o primeiro uso com contexto mínimo, consentimentos separados, lembrete opcional e um Daily Log real.

### Rota e etapas

`/onboarding` contém etapas sequenciais, não abas:

1. **Contexto:** nome, momento profissional e objetivo;
2. **Privacidade:** tratamento necessário e comunicação opcional separados;
3. **Rotina:** lembrete opcional e horário;
4. **Primeiro registro:** Daily Log de 40 a 2.000 caracteres.

Saída: `/app/inicio`.

### Funções entregues

- formulário único com estado local de etapa;
- validação HTML e validação repetida no servidor;
- Server Action autenticada;
- gravação transacional do perfil e log;
- chave idempotente `onboarding-first`;
- redirecionamento de perfil concluído para Início;
- estado de score insuficiente, sem número inventado.

### Dados entregues

- tabela `profiles`;
- tabela `daily_logs`;
- RLS por usuário;
- função `complete_onboarding`;
- migração `20260810190000_phase_3_onboarding.sql`.

### Estados cobertos

- campos vazios/inválidos;
- consentimento obrigatório não marcado;
- lembrete desligado e ligado;
- horário obrigatório apenas quando necessário;
- envio pendente;
- erro sem perda do texto;
- sucesso;
- retomada depois da conclusão.

### Testes e evidências

- 4 testes unitários totais no projeto;
- lint, TypeScript e build aprovados;
- fluxo real até o Supabase aprovado tecnicamente;
- revisão: `docs/reviews/fase-3-onboarding.md`;
- screenshots: `docs/reviews/fase-3-onboarding/`.

### Limites

- lembrete não envia notificação;
- Groq não é usada;
- não há sugestões nem evidência criada;
- `/app/inicio` é apenas o estado inicial.

### Gate pendente

Gate encerrado em 10/08/2026: Yan autorizou explicitamente o início da Fase 4. A avaliação complementar em 1024/1440/1920px permanece registrada como limitação, sem bloquear o avanço funcional.

## Fase 4 — Diário, estruturação assistida e revisão

**Estado:** aprovada por Yan em 11/08/2026.

### Objetivo

Completar o primeiro ciclo de valor: criar e consultar Daily Logs, solicitar sugestões estruturadas à IA, revisar cada campo e confirmar uma evidência sem alterar o texto original.

### Rotas e áreas

#### `/app/diario`

- shell autenticado com trilho principal;
- editor `O que aconteceu hoje?` em primeiro plano;
- data e contexto opcionais;
- ação de salvar;
- histórico compacto dos registros;
- busca e filtro por período/estado;
- ação de abrir detalhe.

#### `/app/diario/[id]`

Painel lateral/deep link com abas irmãs:

- **Registro:** texto original, data, contexto, edição e exclusão;
- **Sugestões:** estruturas propostas, estado de geração, revisão e vínculos.

### Funções mínimas

- criar, listar, abrir e editar Daily Log em texto;
- excluir com aviso de impacto e confirmação proporcional;
- disparar estruturação server-only;
- retornar uma ou mais sugestões de evidência;
- manter separado o texto original e o conteúdo inferido;
- permitir editar contexto, desafio, ação, resultado, competências e aprendizado;
- marcar campos sem suporte suficiente como ausentes, nunca inventá-los;
- confirmar, rejeitar ou regenerar uma sugestão;
- criar evidência somente após confirmação humana;
- manter fallback manual quando Groq falhar.

### Dados esperados

- evoluir `daily_logs` somente com campos necessários ao histórico/estado;
- criar `evidences` com `user_id`, origem, conteúdo estruturado, estado e timestamps;
- criar `evidence_sources` se a relação log → evidência exigir fonte própria;
- RLS em todas as novas tabelas;
- estado de sugestão que diferencie `pendente`, `gerando`, `para_revisar`, `confirmada`, `rejeitada` e `falha` ou equivalente aprovado;
- migração versionada, reversibilidade avaliada e nenhum SQL manual sem arquivo correspondente.

### Integração Groq

Esta é a primeira fase que realmente precisa da Groq.

Procedimento obrigatório:

1. fechar o schema de saída e o contrato de erro;
2. implementar a fronteira server-only sem segredo;
3. pedir a chave de API a Yan imediatamente antes da configuração;
4. salvar em `.env.local`, nunca em Markdown, chat, screenshot, log ou Git;
5. usar modelo configurável por variável;
6. validar saída estruturada no servidor;
7. limitar entrada, tempo, retries e dados enviados;
8. não enviar anexos ou dados desnecessários;
9. registrar apenas código/status técnico, nunca o relato completo.

### Estados obrigatórios

- lista vazia;
- registro salvo;
- geração em andamento;
- sugestão disponível;
- nenhuma sugestão útil;
- falha/timeout/rate limit da Groq;
- revisão com alterações não salvas;
- confirmação de evidência;
- exclusão com derivados existentes;
- modo manual funcional sem IA.

### Testes obrigatórios

- validação do input do Daily Log;
- validação do schema de saída da IA;
- garantia de que sugestão não vira evidência sem confirmação;
- RLS entre dois usuários de teste ou teste equivalente autorizado;
- falha da Groq preserva log e edição;
- fluxo navegador `novo log → sugestão → revisão → evidência`;
- lint, typecheck, testes e build;
- screenshots 1024/1280/1440/1920 e estados representativos;
- auditoria `design-sem-cara-de-ia`;
- revisão Ponytail.

### Gate concluído

Yan autorizou explicitamente o avanço para a Fase 5 em 11/08/2026, após receber a recapitulação da implementação, das validações e do fluxo disponível para teste.

## Fase 5 — Biblioteca de Evidências

**Estado:** contrato aprovado por Yan em 11/08/2026; implementação autorizada.

### Objetivo

Transformar evidências confirmadas em uma biblioteca consultável, rastreável e editável.

Contrato detalhado: `docs/plans/2026-08-11-fase-5-biblioteca-evidencias-design.md`. A decisão aprovada é aceitar provas por link nesta fase e adiar arquivos/Supabase Storage.

### Rotas e áreas

#### `/app/evidencias`

- lista densa;
- busca textual;
- filtros por estado, competência, período e nível;
- filtros salvos `Todas` e `Para revisar`, sem transformar filtros em tabs;
- ação contextual `Registrar evidência`;
- origem, nível, atualização e competências visíveis.

#### `/app/evidencias/[id]`

Abas:

- **Resumo:** contexto, desafio, ação, resultado, aprendizado e competências;
- **Provas:** arquivos, links, origem e nível;
- **Uso:** sessões Live e Artefatos que consumiram a evidência.

### Funções mínimas

- criar manualmente;
- confirmar sugestão vinda de log;
- editar e arquivar;
- buscar e filtrar;
- documentar com link ou arquivo quando Storage for habilitado;
- distinguir Registrada de Documentada;
- não oferecer Validada/Certificada sem mecanismo real;
- indicar fonte e alterações;
- preparar seleção para Persona Live e Artefatos.

### Dados esperados

- `evidences` consolidada;
- `evidence_sources` para log, link ou anexo;
- metadados de origem e confiança;
- Storage somente após contrato de tipo, tamanho, autorização e exclusão;
- RLS e políticas de Storage por usuário.

### Estados e testes

- vazio inicial, sem resultados, carregando, parcial e erro;
- evidência registrada/documentada;
- fonte removida ou indisponível;
- busca e filtros combinados;
- edição não perde origem;
- RLS e upload seguro;
- navegação por teclado, painel e tabs acessíveis;
- screenshots e gate visual.

### Gate

Yan aprova hierarquia, filtros, detalhe, níveis e rastreabilidade.

## Fase 6 — Início e Narrative Score explicável

**Estado:** planejada.

### Objetivo

Substituir o estado mínimo de `/app/inicio` por uma visão operacional com próximos passos e métricas explicáveis.

### Rotas e áreas

#### `/app/inicio`

- cabeçalho contextual;
- KPI total e dimensões Consistência, Coerência e Credibilidade;
- período e última atualização;
- próxima ação dinâmica;
- evidências para revisar;
- logs/evidências recentes;
- competências e lacunas;
- acesso ao Persona Live e último Artefato quando existirem.

#### `/app/score`

Painel com abas:

- **Resumo**;
- **Histórico**;
- **Como é calculado**.

### Regras do score

- Consistência começa determinística por regularidade;
- Coerência só usa IA com conjunto controlado, explicação e data;
- Credibilidade permanece indisponível sem validação real;
- poucos dados significam insuficiência, não zero;
- mudanças apontam período e origem;
- falha de uma dimensão não bloqueia o restante da página.

### Dados esperados

- `narrative_score_snapshots`;
- eventos/origens suficientes para explicar mudanças;
- cálculo repetível para Consistência;
- snapshots somente quando os dados de origem justificarem atualização.

### Estados e testes

- sem registros;
- dados insuficientes;
- calculando;
- disponível;
- falha parcial;
- regras determinísticas testadas;
- histórico consistente com eventos;
- nenhum número para Credibilidade sem prova;
- screenshots e revisão explicativa com Yan.

### Gate

Yan deve entender por que cada valor existe sem precisar confiar cegamente na IA.

## Fase 7 — Persona Live manual

**Estado:** planejada; design conceitual existente em `docs/plans/2026-08-05-persona-live-design.md`.

### Objetivo

Responder a uma pergunta digitada pelo usuário com argumentos rastreáveis e um rascunho curto baseado somente nas evidências autorizadas.

### Rota e workspace

`/app/live` contém:

- preparação de oportunidade e contexto;
- campo de pergunta manual;
- processamento e recuperação de evidências;
- painel principal **Argumentos reais**;
- painel separado **Rascunho sugerido**;
- fontes e alertas;
- ações Encurtar, Aprofundar, Outra experiência, Copiar e Salvar como Artefato.

### Funções mínimas

- recuperar evidências de forma determinística antes de embeddings;
- limitar o conjunto enviado ao modelo;
- mostrar por que cada evidência foi escolhida;
- alertar fatos ausentes;
- gerar resposta curta conforme tipo de pergunta;
- manter modo Manual sempre disponível;
- salvar resposta como Artefato com fontes;
- não responder pelo usuário nem ouvir terceiros.

### Dados esperados

- `live_sessions`;
- `live_questions`;
- vínculos com evidências usadas;
- nenhuma transcrição de terceiros persistida.

### Estados e testes

- preparação, pronto, processando, resposta, nenhuma evidência, baixa confiança, falha da IA e encerramento;
- teste de não invenção com evidências controladas;
- argumentos e rascunho visualmente separados;
- origem recuperável;
- saída 15–60 segundos conforme contrato;
- falha preserva pergunta e oferece modo manual;
- screenshots e demonstração completa.

### Gate

Yan aprova utilidade real em preparação/entrevista e separação entre fatos e redação.

## Fase 8 — Artefatos profissionais

**Estado:** planejada.

### Objetivo

Criar, revisar e guardar materiais de carreira usando somente evidências autorizadas.

### Rotas e áreas

#### `/app/artefatos`

- biblioteca;
- busca e filtros por tipo, estado e data;
- rascunhos e itens recentes;
- ação `Novo Artefato`.

#### `/app/artefatos/novo`

Etapas:

1. tipo e objetivo;
2. contexto da oportunidade;
3. evidências sugeridas/autorizadas;
4. geração;
5. revisão humana;
6. salvar, copiar ou exportar.

#### `/app/artefatos/[id]`

Abas:

- **Conteúdo**;
- **Evidências**;
- **Versões**.

### Tipos obrigatórios

1. Resposta STAR;
2. resposta salva do Persona Live;
3. pitch pessoal;
4. carta de apresentação;
5. currículo;
6. portfólio profissional.

### Regras

- todos nascem como Rascunho;
- estados: Rascunho, Revisado e Exportado/Copiado;
- fontes sempre consultáveis;
- alteração/remoção de fonte gera aviso;
- um workspace configurável atende os tipos;
- PDF/DOCX só entram após especificação e teste por tipo;
- falha de geração não perde contexto nem seleção.

### Dados e testes

- `artifacts` e `artifact_sources`;
- histórico mínimo de versão/exportação;
- validação de fatos contra evidências;
- cada tipo testado com conteúdo realista;
- estados vazio, falha, fonte indisponível e revisão;
- cópia/exportação verificadas;
- screenshots e aprovação por tipo ou lote aprovado.

### Gate

Yan aprova a biblioteca, o fluxo comum e os formatos realmente suportados.

## Fase 9 — Configurações, privacidade e controle de dados

**Estado:** planejada.

### Objetivo

Dar ao usuário controle explícito sobre perfil, preferências, conta e ciclo de vida dos dados.

### Rotas e áreas

- `/app/configuracoes` — Perfil e Preferências;
- `/app/configuracoes/dados` — consentimentos, exportação e exclusão;
- `/app/configuracoes/conta` — conta Microsoft e sair.

### Funções mínimas

- editar nome e contexto profissional;
- configurar idioma e lembrete;
- alterar comunicações opcionais;
- exportar os próprios dados em formato documentado;
- excluir conta e dados com confirmação forte;
- encerrar sessão;
- registrar efeitos sobre logs, evidências, score, Live e Artefatos.

### Segurança e testes

- reautenticação quando o risco justificar;
- exclusão não usa service role no cliente;
- exportação contém apenas dados do usuário;
- RLS testada;
- confirmação destrutiva específica;
- logs sem conteúdo privado;
- revisão jurídica de Termos e Privacidade antes de uso externo;
- screenshots dos estados e aprovação.

### Gate

Yan aprova controle, clareza dos impactos e fluxo destrutivo antes de qualquer publicação externa.

## Fase 10 — Demonstração automática, hardening e entrega

**Estado:** planejada; não confundir demonstração com integração produtiva.

### Objetivo

Preparar o MVP para banca e testes controlados, consolidando qualidade, segurança, apresentação e implantação autorizada.

### Escopo possível

- modo `Automático — demonstração` no Persona Live, com cenário controlado;
- nenhum acesso produtivo a Meet, Zoom ou Teams;
- nenhum áudio de terceiros persistido;
- dados fictícios ou autorizados para demonstração pública;
- navegação completa do ciclo principal;
- seed/test user seguro se aprovado;
- observabilidade mínima sem PII;
- deploy em Vercel/Supabase somente após autorização e verificação de custo;
- preparação das evidências da competição marcada como `[CRUZADO]` quando afetar produto e banca.

### Hardening obrigatório

- auditoria de dependências e segredos;
- revisão de RLS em todas as tabelas;
- teste de dois usuários;
- limites de upload e IA;
- recuperação de falhas;
- acessibilidade e teclado;
- screenshots finais 1024/1280/1440/1920;
- build limpo;
- Strix somente em alvo autorizado, efêmero/staging, com dados de teste e regras de engajamento aprovadas;
- achados reproduzidos e corrigidos manualmente.

### Gate final

Yan aprova escopo público, dados de demonstração, custos, deploy e narrativa da banca. Nenhum recurso pago ou publicação ocorre por inferência.

## Fora das fases atuais

Não construir sem nova decisão explícita:

- login local por senha ou outros provedores;
- billing, paywall ou checkout;
- PWA/mobile dedicado;
- integração real com plataformas de reunião;
- gravação de terceiros;
- rede social, validação por pares ou colaboração;
- scraping/análise autônoma de mercado;
- relatório semanal automático;
- banco vetorial preventivo;
- microsserviços, filas, Redis, GraphQL ou arquitetura multicloud;
- painel administrativo.

## Regra de encerramento de qualquer fase

Uma fase só termina quando:

1. contrato e critérios foram aprovados;
2. fluxo principal funciona;
3. dados e autorização foram verificados;
4. estados relevantes foram exercitados;
5. lint, typecheck, testes e build passaram;
6. interface foi auditada pelas skills obrigatórias;
7. screenshots e revisão foram salvas;
8. Yan recebeu o checklist do que testar e a explicação de eficiência;
9. `CURRENT_STATE.md`, a revisão e `log_execução.md` foram atualizados;
10. um commit coerente foi criado sem segredos;
11. Yan aprovou antes da fase seguinte.
