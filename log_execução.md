# Log de execução — Persona MVP v2

> Arquivo cumulativo e append-only. Não apagar entradas antigas; correções entram como nova entrada.  
> Não registrar chaves, tokens, cookies, client secrets, conteúdo privado completo ou dados pessoais desnecessários.  
> Toda fase ou implementação nova deve atualizar este log antes do commit.

## Como ler

- **Executado** significa observado em arquivos, comando, navegador ou serviço externo.
- **Aprovado** exige confirmação explícita de Yan.
- **Planejado** não deve ser descrito como existente.
- O hash do próprio commit não pode ser gravado dentro dele sem alterar o hash; registre a mensagem e confirme o identificador com `git log`.

---

## EXEC-000 — Governança e preparação do MVP v2

**Data:** 03–10/08/2026  
**Fase:** 0 — governança, produto, arquitetura e design  
**Estado:** concluída e aprovada como direção

### Autorização

Yan solicitou que nenhuma implementação começasse sem leitura completa do projeto, discussão de produto/UI e aprovação do plano. Depois aprovou mapa, stack, autenticação Microsoft, desktop-first, Design DNA e política de execução por fases.

### Objetivo

Criar uma fonte de verdade para o Persona v2 sem transportar automaticamente stack ou visual da Persona v1.

### Executado

- governança central em `AGENTS.md`;
- definição do Persona como sistema de evidências profissionais;
- ciclo `Daily Log → evidência → síntese → ativação`;
- auditoria funcional do legado sem reutilização visual;
- arquitetura de informação com Início, Diário, Evidências, Live, Artefatos e Configurações;
- stack Next.js/React/TypeScript/Supabase/Groq;
- Design DNA adaptado do CRM;
- regra de precedência de marca;
- protocolo de avaliação visual por fase;
- política de shadcn/ui seletivo;
- política de Strix apenas em alvo autorizado.

### Skills e referências

- `editorial-modular-app-design`;
- `design-sem-cara-de-ia`;
- `design-dna`;
- Ponytail `full`;
- `docs/PRODUCT_BRIEF.md`;
- `docs/architecture/`;
- `docs/design/`;
- `docs/audits/2026-08-10-product-scope-audit.md`.

### Decisões

- paleta e logos vêm do Persona original;
- tipografia da v2 é Geist/Geist Mono;
- estrutura/densidade vêm do DNA adaptado;
- Persona v1 não é referência visual;
- Microsoft é o único login;
- sem billing, mobile dedicado ou integração produtiva com reuniões no MVP atual.

### Validações

- documentos comparados entre produto, arquitetura e competição;
- mapa reformulado e aprovado por Yan;
- restrições registradas em `AGENTS.md`.

### Commit

Não existia repositório Git no diretório durante esta fase. O estado passa a integrar o primeiro snapshot versionado criado pela entrada `EXEC-004`.

### Próximo gate registrado à época

Implementar e aprovar a fundação visual antes da autenticação.

---

## EXEC-001 — Fundação técnica e tela de entrada

**Data:** 10/08/2026  
**Fase:** 1 — fundação  
**Estado:** implementada, corrigida e aprovada

### Autorização

Yan aprovou o avanço para scaffold e posteriormente solicitou a correção de marca: usar apenas paleta e logos do Persona original, mantendo Geist e as decisões atuais da v2. Depois confirmou “Certo tudo aprovado”.

### Objetivo

Entregar aplicação executável e tela-piloto que provasse a direção visual sem ocupar a porta 3000.

### Executado

- scaffold em `apps/web`;
- Next.js 16.3.0, React 19.2.8, TypeScript e Tailwind 4;
- porta oficial `3100`;
- `/` redirecionando para `/entrar`;
- `/entrar` com composição dividida;
- demonstração `fonte → argumento → ativação`;
- `/termos` e `/privacidade` provisórios;
- tokens de cor, espaço, raio, tipografia e movimento;
- logos oficiais em `public/brand`;
- foco visível e `prefers-reduced-motion`.

### Correção solicitada

A primeira versão usou indevidamente a paleta verde e um monograma provisório derivados do CRM. Foram substituídos pela paleta e logos do Persona, e os documentos de marca foram atualizados.

### Arquivos e áreas principais

- `apps/web/app/page.tsx`;
- `apps/web/app/entrar/page.tsx`;
- `apps/web/app/globals.css`;
- `apps/web/app/layout.tsx`;
- `apps/web/app/termos/page.tsx`;
- `apps/web/app/privacidade/page.tsx`;
- `apps/web/public/brand/`;
- `docs/design/BRAND_FOUNDATION.md`;
- `docs/design/DESIGN_DNA_ADAPTATION.md`.

### Skills e referências

- `editorial-modular-app-design`;
- `design-sem-cara-de-ia`;
- Design DNA local;
- Ponytail `full`;
- CRM somente para estrutura/densidade.

### Validações

- lint, typecheck e build aprovados;
- navegação jurídica exercitada;
- 1024, 1280, 1440 e 1920px sem overflow;
- auditor automático executado e falsos positivos revisados;
- avaliação registrada em `docs/reviews/fase-1-fundacao.md`.

### Screenshots

`docs/reviews/fase-1-fundacao/`, incluindo as quatro larguras e versões corrigidas com a paleta Persona.

### Limitações

- login ainda era visual;
- textos jurídicos provisórios;
- mascote sem direção aprovada.

### Commit

Não existia repositório Git no diretório. A implementação passa a integrar o snapshot inicial da entrada `EXEC-004`.

### Próximo gate

Fase 2 autorizada após aprovação visual.

---

## EXEC-002 — Autenticação Microsoft via Supabase

**Data:** 10/08/2026  
**Fase:** 2 — autenticação  
**Estado:** implementada, validada e aprovada

### Autorização

Yan aprovou a Fase 1, autorizou acesso/configuração no Supabase e confirmou as ações necessárias no Microsoft Entra durante o fluxo.

### Objetivo

Substituir o botão visual por login Microsoft real com sessão protegida no servidor.

### Executado no código

- `GET /auth/iniciar`;
- `GET /auth/callback`;
- `/auth/erro`;
- clientes Supabase de browser, Server Component e Route Handler;
- proxy de atualização de sessão;
- proteção de `/onboarding` e `/app`;
- redirect interno seguro;
- teste automatizado do redirect;
- `.env.example` sem valores secretos.

### Executado externamente

- projeto Supabase `persona-mvp-v2` identificado;
- provedor Microsoft/Azure configurado;
- novo Secret Value criado e salvo diretamente no Supabase;
- validade registrada até 06/02/2027;
- consentimento individual usado;
- OAuth real concluído.

### Diagnósticos e correções

1. `AADSTS7000215`: secret inválido no provedor; novo Secret Value configurado.
2. Callback recebia código, mas perdia PKCE verifier; cookies passaram a ser anexados explicitamente aos redirects.
3. Servidor local precisou de rede autorizada para concluir a validação com Supabase.

### Arquivos principais

- `apps/web/app/auth/iniciar/route.ts`;
- `apps/web/app/auth/callback/route.ts`;
- `apps/web/app/auth/erro/page.tsx`;
- `apps/web/lib/auth/redirect.ts`;
- `apps/web/lib/auth/redirect.test.ts`;
- `apps/web/lib/supabase/`;
- `apps/web/proxy.ts`;
- planos de autenticação/PKCE em `docs/plans/`.

### Segurança

- `service_role` não foi usada;
- nenhum secret foi exibido em documentação;
- client secret ficou no painel do Supabase;
- redirect externo foi bloqueado;
- sessão foi confirmada no servidor.

### Validações

- lint, typecheck, testes e build aprovados;
- Microsoft → callback → onboarding validado;
- recarregar preservou sessão;
- revisão em `docs/reviews/fase-2-autenticacao.md`.

### Screenshots

- `docs/reviews/fase-2-autenticacao/configuracao-necessaria.png`;
- `docs/reviews/fase-2-autenticacao/onboarding-autenticado.png`.

### Limitações

- sem perfil persistente;
- sem RLS do produto;
- sem Groq.

### Commit

Não existia repositório Git no diretório. A implementação passa a integrar o snapshot inicial da entrada `EXEC-004`.

### Próximo gate

Fase 3 autorizada por Yan.

---

## EXEC-003 — Onboarding funcional, RLS e primeiro Daily Log

**Data:** 10/08/2026  
**Fase:** 3 — onboarding  
**Estado:** implementada e validada; aprovação de Yan pendente

### Autorização

Yan autorizou a Fase 3 e confirmou imediatamente antes da execução da migração no Supabase.

### Objetivo

Levar a conta autenticada por quatro etapas reais, salvar o perfil e primeiro registro de forma atômica e terminar no Início sem score inventado.

### Executado no produto

- onboarding em uma rota e um formulário;
- Contexto, Privacidade, Rotina e Primeiro registro;
- validação nativa + servidor;
- consentimento necessário separado de comunicações;
- lembrete opcional e horário condicional;
- Daily Log de 40 a 2.000 caracteres;
- estado de envio e erro sem perda do texto;
- `/app/inicio` com texto original, objetivo e `Dados insuficientes`;
- redirect de onboarding já concluído.

### Executado no banco

- migration `supabase/migrations/20260810190000_phase_3_onboarding.sql`;
- `profiles`;
- `daily_logs`;
- RLS por usuário;
- função transacional `complete_onboarding`;
- primeiro registro idempotente por `onboarding-first`;
- migração aplicada com resultado `Success. No rows returned`.

### Diagnóstico e correção

O teste real encontrou erro do Next.js 16: arquivo `"use server"` exportava um objeto de estado inicial. O objeto foi movido para o componente cliente; a Server Action permaneceu como única exportação de runtime.

### Arquivos principais

- `apps/web/app/onboarding/page.tsx`;
- `apps/web/app/onboarding/onboarding-form.tsx`;
- `apps/web/app/onboarding/actions.ts`;
- `apps/web/app/app/inicio/page.tsx`;
- `apps/web/lib/onboarding/validation.ts`;
- `apps/web/lib/onboarding/validation.test.ts`;
- `apps/web/app/globals.css`;
- migração SQL;
- plano e revisão da fase.

### Skills e referências

- brainstorming de abordagem;
- `editorial-modular-app-design`;
- `design-sem-cara-de-ia` e script;
- Ponytail `full`;
- Design DNA, fundação de marca e protocolo visual;
- documentação local de forms/auth/redirect do Next.js 16.

### Validações

- `npm.cmd run lint`: aprovado;
- `npm.cmd run typecheck`: aprovado;
- `npm.cmd test`: 4/4;
- `npm.cmd run build`: aprovado;
- consentimento obrigatório testado;
- lembrete condicional testado;
- fluxo real gravou e abriu `/app/inicio`;
- reabrir onboarding redirecionou ao Início;
- script de tells executado e falsos positivos revisados.

### Screenshots

- `docs/reviews/fase-3-onboarding/etapa-1-contexto.png`;
- `docs/reviews/fase-3-onboarding/etapa-4-daily-log.png`;
- `docs/reviews/fase-3-onboarding/inicio-primeiro-registro.png`.

### Eficiência aplicada

- uma rota em vez de quatro;
- sem dependência nova;
- transação em vez de estados parciais;
- idempotência para retry;
- Groq adiada até existir uso real.

### Limitações

- lembrete é preferência sem entrega de notificação;
- dashboard completo ainda não existe;
- 1024/1440/1920 aguardam avaliação manual de Yan;
- registro de teste permanece na conta;
- nenhuma IA foi chamada.

### Commit

Não existia repositório Git durante a implementação. O código passa a integrar o snapshot inicial da entrada `EXEC-004`.

### Próximo gate

Yan precisa aprovar a Fase 3. Fase 4 bloqueada.

---

## EXEC-004 — Rede de handoff, governança de log e preparação do Git

**Data:** 10/08/2026  
**Tipo:** documentação e continuidade  
**Estado:** validado; pronto para o primeiro commit local

### Autorização

Yan solicitou uma rede completa de arquivos Markdown para outra IA auditar e continuar o projeto de qualquer fase. Também tornou obrigatório atualizar `log_execução.md` e fazer commit a cada fase ou implementação nova.

### Objetivo

Eliminar dependência do histórico deste chat e permitir retomada factual, segura e versionada.

### Estado anterior encontrado

- havia documentação de produto, arquitetura, design, planos e revisões;
- não havia índice de handoff, runbook operacional, mapa de fases futuras ou log cumulativo;
- `apps/web/README.md` ainda era o texto genérico do create-next-app e citava porta 3000;
- `persona_mvp_v2` não era repositório Git;
- nenhum remoto Git estava registrado nos arquivos.

### Arquivos criados

- `README.md`;
- `.gitignore` raiz;
- `docs/handoff/START_HERE.md`;
- `docs/handoff/CURRENT_STATE.md`;
- `docs/handoff/PHASES.md`;
- `docs/handoff/PRODUCT_SURFACE.md`;
- `docs/handoff/TECHNICAL_RUNBOOK.md`;
- `docs/handoff/DESIGN_AND_SKILLS.md`;
- `docs/handoff/QUALITY_GATES.md`;
- `log_execução.md`.

### Arquivos atualizados

- `AGENTS.md` para tornar handoff, log e commit obrigatórios;
- `apps/web/README.md` para refletir Persona, porta 3100 e comandos reais.

### Conteúdo coberto

- ponto exato de parada;
- ordem de leitura;
- fases 0–10;
- rotas, páginas, áreas, abas e estados;
- dados atuais e futuros;
- autenticação, PKCE, RLS e Groq;
- design, tokens, logos e proibições;
- skills obrigatórias;
- screenshots existentes e padrão futuro;
- testes, segurança e gates;
- fluxo Git e regra de commit;
- riscos, limitações e próximo gate.

### Skills e abordagem

- Brainstorming para comparar rede por fase, arquivo único e rede temática;
- `full-output-enforcement` para impedir documentação parcial;
- Ponytail `full` para manter poucos arquivos com responsabilidade clara;
- referências oficiais do projeto, código e revisões existentes.

### Decisão de estrutura

Foi escolhida rede temática com um roadmap único. Arquivos por cada fase foram evitados porque repetiriam rotas, gates e estado em múltiplos lugares.

### Validações exigidas antes de encerrar

- conferir todos os links Markdown locais;
- procurar linguagem contraditória sobre status;
- verificar que nenhum segredo entrou nos arquivos;
- revisar diff e arquivos staged;
- inicializar Git local se continuar ausente;
- criar commit do snapshot sem `.env.local`, `.next` ou `node_modules`;
- registrar hash/mensagem no handoff final;
- informar que push remoto não ocorreu se nenhum remoto existir.

### Validações executadas

- arquivos obrigatórios presentes: aprovado;
- links Markdown locais: aprovado;
- consistência de status Fase 3/Fase 4/Groq: aprovada;
- `npm.cmd run lint`: aprovado;
- `npm.cmd run typecheck`: aprovado;
- `npm.cmd test`: 4 testes aprovados, 0 falhas;
- repositório Git local inicializado na branch `main`;
- revisão de arquivos staged: aprovada; saídas locais, dependências e `.env.local` permaneceram ignoradas;
- busca por assinaturas de segredo: nenhuma encontrada;
- `.claude/settings.local.json` foi excluído do snapshot por ser configuração específica da máquina;
- capturas sinalizadas para revisão de dados antes de eventual publicação externa.

### Commit preparado

Mensagem: `docs: establish project handoff and execution log`.

O commit é local. Nenhum remoto foi encontrado e nenhum push foi realizado.

### Próximo gate

Apresentar a rede e o commit a Yan. A Fase 4 continua bloqueada até aprovação separada da Fase 3 e autorização de avanço.

---

## EXEC-005 — Publicação inicial no GitHub

**Data:** 10/08/2026  
**Tipo:** versionamento e publicação  
**Estado:** concluído

### Autorização

Yan criou e informou o repositório `https://github.com/yan1405/persona_mvp_V2` e solicitou atualizar e enviar o projeto completo para esse destino.

### Estado anterior

- branch local: `main`;
- commit raiz: `d47fde0 docs: establish project handoff and execution log`;
- nenhum remoto configurado;
- `.env.local`, `.next`, `node_modules` e configurações locais ignorados;
- nenhuma assinatura de segredo detectada no snapshot.

### Executado

1. remoto `origin` configurado como `https://github.com/yan1405/persona_mvp_V2.git`;
2. proteção `safe.directory` aplicada somente à pasta `persona_mvp_v2`, necessária porque o repositório local foi criado pelo ambiente seguro do Codex e o push usa a conta Windows de Yan;
3. branch `main` enviada ao GitHub;
4. acompanhamento configurado como `main` → `origin/main`;
5. estado Git atualizado no handoff.

### Segurança

- nenhum segredo foi adicionado para realizar o push;
- não foram exibidos tokens ou credenciais do GitHub;
- arquivos locais e dependências permaneceram ignorados;
- as capturas existentes continuam exigindo revisão de dados antes de compartilhamento público externo.

### Commit desta entrada

Mensagem: `docs: record GitHub publication`.

O hash é informado na entrega e pode ser confirmado com `git log -1 --oneline`.

### Próximo gate

A Fase 4 continua bloqueada. Yan ainda precisa aprovar a Fase 3 e autorizar explicitamente o avanço.

---

## EXEC-006 — Aprovação de avanço e design técnico da Fase 4

**Data:** 10/08/2026
**Fase:** 4 — Diário, estruturação assistida e revisão
**Estado:** design registrado; implementação autorizada

### Autorização

Após a publicação do projeto no GitHub, Yan confirmou: “pode iniciar a fase 4”. A confirmação encerra o gate de avanço da Fase 3 e autoriza somente o contrato já documentado para a Fase 4.

### Skills e referências aplicadas

- brainstorming para comparar três abordagens;
- `editorial-modular-app-design` para shell, lista–detalhe, estados, acessibilidade e contrato de IA;
- `design-sem-cara-de-ia` para ancoragem, copy e restrições visuais;
- Ponytail `full` para escolher Server Actions, HTML nativo e o menor conjunto de dependências;
- documentação local do Next.js 16 para formulários, Server Actions, segurança, rotas dinâmicas, redirects e revalidação;
- `PHASES.md`, `PRODUCT_SURFACE.md`, arquitetura de informação e arquitetura técnica.

### Abordagem escolhida

Server Components para leitura, Server Actions autenticadas para mutações e Supabase/RLS como fonte da verdade. Uma RPC será usada somente para a confirmação transacional que cria evidência e atualiza a sugestão.

Foram rejeitados:

- Route Handlers + cache cliente, por duplicarem contratos e estado;
- camada RPC para todas as operações, por acoplamento desnecessário;
- store global, Zod, shadcn, gateway de IA, fila e embeddings, por não resolverem necessidade atual.

### Contrato registrado

Arquivo: `docs/plans/2026-08-10-fase-4-diario-estruturacao-design.md`.

O plano cobre:

- rotas, shell, editor, lista, detalhe e abas;
- schema `daily_logs`, `evidence_suggestions` e `evidences`;
- RLS e confirmação transacional;
- schema de saída e erros da Groq;
- fallback manual;
- estados, segurança, testes e itens fora de escopo.

### Decisões Ponytail

- `evidence_sources` adiada até existir fonte adicional ou anexo;
- navegador automatizado externo substitui dependência Playwright local nesta fase;
- testes continuam no runner nativo do Node;
- dependências novas limitadas ao SDK oficial Groq e Carbon para navegação aprovada;
- nenhuma chave solicitada antes da fronteira server-only estar pronta.

### Commit

Mensagem: `docs(fase-4): approve design and implementation contract`.

### Próximo passo

Implementar migração, validações e o modo manual; depois fechar a fronteira Groq e solicitar a chave imediatamente antes da configuração real.

---

## EXEC-007 — Núcleo funcional da Fase 4

**Data:** 10/08/2026
**Fase:** 4 — Diário, estruturação assistida e revisão
**Estado:** primeiro bloco concluído; configuração Groq pendente

### Implementado

- shell autenticado compartilhado e navegação com ícones Carbon;
- `/app/diario` com captura, data, contexto, busca, filtros e histórico;
- `/app/diario/[id]` com Registro e Sugestões;
- Server Actions autenticadas para criar, editar e excluir logs;
- sugestão manual, revisão de campos, rejeição e confirmação humana;
- migração `20260810230000_phase_4_diary_evidences.sql` aplicada no Supabase;
- tabelas `evidence_suggestions` e `evidences`, RLS e RPC atômica;
- bloqueio estrutural da exclusão do Daily Log que já originou evidência;
- integração Groq server-only com `openai/gpt-oss-20b` configurável, JSON Schema estrito, timeout de 12 s, um retry e erros classificados;
- `.env.example` atualizado sem segredo;
- fallback manual disponível independentemente da Groq.

### Skills e referências aplicadas

- brainstorming para fechar abordagem e escopo;
- `editorial-modular-app-design` e suas referências de layout, navegação, componentes, estados, acessibilidade, arquitetura, conteúdo, segurança e QA;
- `design-sem-cara-de-ia` para copy, hierarquia e restrições visuais;
- Ponytail `full` para evitar store global, API duplicada, Zod, Playwright local e tabela prematura de fontes;
- Browser in-app para Supabase e validação local, sem acessar cookies ou credenciais;
- documentação oficial Groq para modelos, Structured Outputs e deprecações.

### Banco e segurança

A migração foi executada com sucesso no projeto Supabase `persona-mvp-v2`. Um teste transacional com rollback comprovou criação do log, sugestão manual, confirmação atômica, isolamento RLS e proteção da fonte. Nenhum registro sintético foi mantido.

A chave Groq ainda não foi fornecida, lida, impressa ou salva. O segredo deverá entrar somente em `.env.local`, sem prefixo `NEXT_PUBLIC_`.

### Validação

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           11/11 aprovados
npm.cmd run build      aprovado
```

### Limitação atual

O navegador automatizado chegou ao login oficial da Microsoft, que depende da sessão interativa de Yan. A chamada real Groq e as capturas autenticadas ficam para o próximo bloco, após a configuração segura da chave e a autenticação.

### Commit planejado

Mensagem: `feat(fase-4): implement diary and evidence review core`.

### Próximo gate

Configurar Groq, validar o caminho real de IA e concluir QA visual. A Fase 5 permanece bloqueada até a apresentação e aprovação da Fase 4 por Yan.

---

## EXEC-008 — Integração Groq e fechamento técnico da Fase 4

**Data:** 10/08/2026
**Fase:** 4 — Diário, estruturação assistida e revisão
**Estado:** implementação e QA concluídos; aprovação de Yan pendente

### Configuração segura

Yan confirmou que configurou `GROQ_API_KEY` e `GROQ_MODEL` diretamente em `apps/web/.env.local`. A automação verificou somente que as variáveis estavam preenchidas. Nenhum valor de segredo foi exibido, copiado ou versionado.

O servidor foi reiniciado na porta oficial `3100` com acesso de rede para testar Supabase e Groq. A porta `3000` não foi usada.

### Diagnóstico e correção Groq

1. a listagem segura de modelos confirmou chave válida e disponibilidade de `openai/gpt-oss-20b`;
2. a primeira chamada estruturada retornou HTTP 400 porque `uniqueItems` não é aceito no subconjunto de JSON Schema da Groq;
3. `uniqueItems` foi removido; a deduplicação existente no parser foi preservada;
4. um teste automatizado impede reintroduzir essa palavra-chave;
5. a chamada direta passou com `finish_reason = stop` e conteúdo estruturado;
6. o fluxo real do navegador gerou uma sugestão revisável.

### Revisão sem invenção

A primeira resposta real inferiu desafio e aprendizado não declarados. A sugestão foi rejeitada. O prompt server-only passou a exigir:

- desafio somente quando houver obstáculo explícito;
- resultado somente quando houver consequência narrada;
- aprendizado somente quando a pessoa declarar o aprendizado;
- proibição de transformar ação em desafio ou resultado em aprendizado;
- `null` e `unsupported_fields` quando faltar suporte direto.

A regeneração deixou desafio e aprendizado vazios, preservou ação e resultado narrados e permitiu revisão antes da confirmação.

### Fluxo real validado

```text
Microsoft → Diário → novo log → falha preservada → retry Groq
→ sugestão → rejeição → regeneração → revisão → evidência confirmada
→ exclusão da fonte bloqueada
```

O teste usou somente conteúdo sintético. Depois das capturas, a evidência foi removida primeiro e o Daily Log exato foi removido em seguida, levando junto apenas suas sugestões. A consulta final retornou `synthetic_records_remaining = 0`. O registro real existente não foi alterado.

### QA visual e skills

- `editorial-modular-app-design`: hierarquia, estados, responsividade, acessibilidade e validação visual;
- `design-sem-cara-de-ia`: script executado em 35 arquivos e checklist manual;
- Ponytail `full`: remoção de redundâncias e manutenção do menor caminho funcional;
- Browser in-app: fluxo autenticado, Supabase, Groq e screenshots;
- `agent-browser`: CLI não instalada; não foi adicionada ao projeto porque o navegador interno cobria o QA.

O QA visual identificou overflow horizontal no detalhe. A correção aplicou container fluido, máximo de `1280px`, cabeçalho adaptativo, título controlado e ações previsíveis. Foram salvas capturas sintéticas em 1024, 1280, 1440 e 1920 px.

A auditoria automática apontou somente:

- `#7C3AED`, mantido por ser a paleta original aprovada do Persona;
- centralização nas páginas legais, mantida por limitar a linha de leitura.

### Validação final

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           12/12 aprovados
npm.cmd run build      aprovado
```

### Commit planejado

Mensagem: `feat(fase-4): validate Groq flow and complete QA`.

### Próximo gate

Apresentar a Fase 4 a Yan com checklist de teste e capturas. A Fase 5 só pode começar após aprovação explícita.

---

## EXEC-009 — Aprovação da Fase 4 e contrato da Fase 5

**Data:** 11/08/2026
**Fase:** encerramento da 4 e design da 5
**Estado:** contrato aprovado; implementação autorizada

### Autorização

Após receber a recapitulação das fases, validações, limitações e do ponto exato de parada, Yan autorizou explicitamente o avanço para a Fase 5. No brainstorming obrigatório, escolheu “Links agora e arquivos depois” e confirmou o contrato completo da Biblioteca de Evidências.

### Abordagens comparadas

1. links agora e arquivos depois — escolhida;
2. links e Supabase Storage nesta fase — adiada pelo custo de segurança e QA;
3. biblioteca sem provas — rejeitada porque não entrega o nível Documentada.

### Contrato aprovado

- `/app/evidencias` com lista densa, busca e filtros;
- `/app/evidencias/[id]` com Resumo, Provas e Uso;
- registro manual, edição e arquivamento;
- evidências confirmadas na Fase 4 aparecem automaticamente;
- `evidence_sources` guarda apenas links HTTP/HTTPS nesta fase;
- Registrada sem link e Documentada com link;
- Validada e Certificada continuam indisponíveis sem mecanismo externo;
- exclusão definitiva, upload, Storage e ações em lote ficam fora do escopo.

### Skills e referências

- brainstorming para comparar abordagens e obter confirmação incremental;
- `design-dna` para preservar tokens, densidade e assinatura de rastreabilidade;
- `editorial-modular-app-design` para lista, detalhe, estados e acessibilidade;
- `design-sem-cara-de-ia` para auditoria prévia e restrições visuais;
- Ponytail `full` para evitar Storage, dependências, nível duplicado e abstrações preventivas.

### Auditoria prévia

O script `auditar_tells_ia.py` varreu 35 arquivos antes do código. Os únicos achados foram `#7C3AED`, cor oficial aprovada, e centralização deliberada das páginas legais para limitar a linha de leitura.

### Arquivos alterados

- `AGENTS.md`;
- `docs/handoff/START_HERE.md`;
- `docs/handoff/CURRENT_STATE.md`;
- `docs/handoff/PHASES.md`;
- `docs/reviews/fase-4-diario-evidencias.md`;
- `docs/plans/2026-08-11-fase-5-biblioteca-evidencias-design.md`;
- `log_execução.md`.

### Commit planejado

Mensagem: `docs(fase-5): approve evidence library contract`.

### Próximo gate

Implementar banco/RLS, Biblioteca, detalhe, links e arquivamento; depois executar validação técnica, visual e apresentar a Fase 5 a Yan.

---

## EXEC-010 — Implementação e QA da Biblioteca de Evidências

**Data:** 11/08/2026
**Fase:** 5
**Estado:** implementada e validada; pendente de avaliação de Yan

### Implementação

- Biblioteca densa com busca e filtros combinados;
- detalhe com Resumo, Provas e Uso;
- registro manual, edição, arquivamento e restauração;
- links HTTP/HTTPS e nível derivado Registrada/Documentada;
- migração `20260811120000_phase_5_evidence_library.sql` aplicada;
- RLS por proprietário em evidências e fontes;
- navegação Evidências habilitada;
- sem upload, Storage ou dependências novas.

### Validação

```text
npm.cmd run lint       aprovado
npm.cmd run typecheck  aprovado
npm.cmd test           15/15 aprovados
npm.cmd run build      aprovado com acesso de rede autorizado para next/font
```

O teste SQL autenticado concluiu `phase5_rls_passed_and_rolled_back`. O navegador validou criação, edição, link, arquivamento e restauração. Dois registros e dois links sintéticos foram removidos por IDs exatos; a verificação separada retornou zero fontes e zero evidências residuais.

### QA visual

- capturas em 1024, 1280, 1440 e 1920px;
- detalhe Provas capturado em 1440px;
- overflow intermediário dos filtros encontrado e corrigido;
- `scrollWidth = innerWidth` confirmado nas quatro larguras;
- dados reais e credenciais ausentes das capturas.

### Skills

- `design-dna`: tokens e assinatura de rastreabilidade preservados;
- `editorial-modular-app-design`: lista editorial, detalhe modular, estados e QA responsivo;
- `design-sem-cara-de-ia`: cards repetidos, pills excessivas e selos inventados evitados;
- Ponytail `full`: plataforma existente, sem dependência, nível derivado e Storage adiado.

### Arquivos centrais

- `apps/web/app/app/evidencias/`;
- `apps/web/lib/evidence/`;
- `apps/web/app/globals.css`;
- `supabase/migrations/20260811120000_phase_5_evidence_library.sql`;
- `docs/reviews/fase-5-biblioteca-evidencias.md`;
- `docs/reviews/fase-5-biblioteca-evidencias/`;
- handoff e governança atualizados.

### Commit planejado

Mensagem: `feat(fase-5): implement evidence library and link proofs`.

### Próximo gate

Apresentar a Fase 5 a Yan. A Fase 6 permanece bloqueada até aprovação explícita ou conclusão dos ajustes solicitados.

---

## EXEC-011 — Aprovação da Fase 5 e abertura da Fase 6

**Data:** 11/08/2026
**Fase:** encerramento da 5 e abertura da 6
**Estado:** Fase 5 aprovada; Fase 6 autorizada para design

### Autorização

Yan informou que validou a Biblioteca de Evidências e autorizou explicitamente o avanço para a Fase 6.

### Limite vigente

A autorização abre o brainstorming e a contratação do novo Início e do Narrative Score explicável. Fórmula, limiares de suficiência, estados, uso de IA e hierarquia precisam de aprovação antes do código, para não transformar poucos dados em precisão artificial.

### Próximo gate

Comparar abordagens de pontuação, apresentar a recomendação em seções curtas e registrar o contrato aprovado em `docs/plans/`.

---

## EXEC-012 — Contrato da Fase 6 aprovado

**Data:** 11/08/2026
**Fase:** 6 — design
**Estado:** contrato aprovado; implementação não iniciada

### Decisões aprovadas

- diagnóstico separado do onboarding em três etapas e 10 perguntas;
- Score inicial declarativo de 0 a 100;
- Coerência 60% e Consistência 40%; Credibilidade fora do cálculo;
- substituição por dimensão, sem mistura permanente da autoavaliação;
- Consistência observada após 21 dias, 6 logs e 3 semanas;
- fórmula 70% continuidade e 30% frequência;
- Coerência elegível com 5 evidências, 2 contextos e 3 competências;
- Groq sob demanda com rubrica fixa, validação e IDs rastreáveis;
- `narrative_diagnostics` e `narrative_score_snapshots` com RLS;
- Início editorial e `/app/score` com Resumo, Histórico e Como é calculado;
- falha parcial preserva o último valor válido.

### Influência das skills

- Design DNA preserva tokens, densidade, Geist, Carbon e a assinatura de rastreabilidade;
- editorial modular prioriza hierarquia, fluxo sequencial, estados e acessibilidade;
- `design-sem-cara-de-ia` elimina cards repetidos, velocímetros, medalhas e gamificação genérica;
- Ponytail `full` remove cron, fila, embeddings, store global e dependências novas.

### Documento

`docs/plans/2026-08-11-fase-6-inicio-narrative-score-design.md`.

### Próximo gate

Obter confirmação final de Yan para iniciar a implementação do contrato aprovado.

---

## EXEC-013 — Implementação e QA da Fase 6

**Data:** 12/08/2026
**Fase:** 6 — Início e Narrative Score
**Estado:** implementada; aguardando aprovação de Yan

### Autorização

Yan confirmou a implementação após aprovar integralmente o contrato da Fase 6.

### Ações executadas

- criadas regras determinísticas do diagnóstico e da Consistência;
- criado schema estrito e análise Groq server-only para Coerência;
- implementados diagnóstico de três etapas, nova Início e `/app/score`;
- adicionada atualização da Consistência após mutações do Diário;
- criada e aplicada a migração de diagnósticos e snapshots;
- verificados RLS e quatro políticas mínimas no Supabase real;
- executado fluxo autenticado de rascunho até snapshot inicial;
- corrigida a mesclagem das respostas entre etapas encontrada pelo QA;
- capturadas as larguras 1024, 1280, 1440 e 1920px;
- executadas auditorias obrigatórias e Ponytail `full`.

### Arquivos centrais

- `apps/web/app/app/diagnostico/`;
- `apps/web/app/app/inicio/page.tsx`;
- `apps/web/app/app/score/`;
- `apps/web/lib/score/`;
- `supabase/migrations/20260811180000_phase_6_narrative_score.sql`;
- `docs/reviews/fase-6-narrative-score.md`;
- `docs/qa/fase-6/`.

### Mutação externa

A migração foi aplicada ao projeto Supabase `persona-mvp-v2`. O ensaio autenticado concluiu um diagnóstico real na conta de Yan e criou um snapshot inicial 65/100. Nenhum dado foi removido ou modificado diretamente por SQL.

### Validações

- testes: 20/20;
- TypeScript: aprovado;
- lint: aprovado;
- build: aprovado com `exit code 0`;
- fluxo autenticado: aprovado;
- RLS/tabelas/políticas: verificadas;
- matriz visual: sem overflow horizontal;
- auditor visual: somente tokens aprovados/preexistentes sinalizados.

### Simplificações

Nenhuma dependência, cron, fila, embedding, Storage, upload ou store global foi adicionado. Credibilidade continua indisponível e Coerência só roda sob demanda depois da elegibilidade.

### Próximo gate

Yan deve avaliar a Fase 6. A Fase 7 permanece bloqueada até aprovação explícita.

---

## EXEC-014 — Aprovação da Fase 6 e contrato da Fase 7

**Data:** 12/08/2026
**Fase:** encerramento da 6 e design da 7
**Estado:** Fase 6 aprovada; contrato da Fase 7 aprovado; implementação não iniciada

### Autorizações

Yan autorizou o avanço após o handoff da Fase 6 e aprovou, em seções, o fluxo, os dados, os estados, os controles, a interface, os testes e os limites do Persona Live manual.

### Decisões aprovadas

- preparação com vaga/objetivo, empresa e descrição opcional;
- recomendação determinística e confirmação de 1 a 8 evidências;
- várias perguntas por sessão;
- argumentos reais e rascunho sugerido separados;
- histórico persistido e versões append-only;
- Encurtar, Aprofundar e Outra experiência por nova geração controlada;
- Copiar somente o rascunho;
- pausa para revisar evidências;
- encerramento somente leitura e duplicação sem histórico;
- Server Actions, Supabase e Groq sob demanda;
- ausência de evidência produz lacuna, não resposta genérica;
- áudio, embeddings, filas e Artefatos fora da fase.

### Skills e simplicidade

O brainstorming obrigatório consolidou o contrato antes do código. Ponytail permanece aplicado: nenhuma dependência, busca determinística antes de embeddings e nenhuma infraestrutura assíncrona preventiva.

### Documento

`docs/plans/2026-08-12-fase-7-persona-live-manual-design.md`.

### Próximo gate

Obter confirmação final de Yan para iniciar a implementação. Nenhum código da Fase 7 foi criado neste ciclo.
