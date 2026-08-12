# Runbook técnico, dados e operação

## 1. Estrutura real

```text
persona_mvp_v2/
  apps/web/                   aplicação Next.js
    app/                      rotas e páginas
    lib/auth/                 redirect seguro
    lib/onboarding/           validação do onboarding
    lib/supabase/             clientes e sessão
    public/brand/             logos aprovados
    package.json
  docs/                       produto, arquitetura, design, planos e revisões
  supabase/migrations/        SQL versionado
  AGENTS.md                   governança
  log_execução.md             histórico cumulativo
```

Não existe backend separado, ORM, pacote compartilhado ou camada de serviços genérica.

## 2. Comandos oficiais

Execute dentro de `apps/web`:

```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
```

Servidor:

```text
http://localhost:3100
```

Não altere para `3000`. Se a porta estiver ocupada, identifique o processo; não encerre outro projeto sem autorização.

## 3. Regras específicas do Next.js 16

Antes de alterar Server Actions, cookies, redirect, proxy, cache, forms ou APIs do App Router:

1. leia `apps/web/AGENTS.md`;
2. pesquise em `apps/web/node_modules/next/dist/docs/`;
3. use a API da versão instalada, não memória de versões anteriores.

Falha já encontrada: arquivos com `"use server"` só podem exportar funções assíncronas em runtime. Tipos apagados pelo TypeScript são aceitos; objetos/constantes devem ficar em módulo comum ou cliente.

## 4. Variáveis de ambiente

### Atuais e públicas no navegador

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

Compatibilidade temporária existente:

```text
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

`lib/supabase/config.ts` usa publishable quando disponível e aceita anon como fallback.

### Fase 4 e server-only

Variáveis previstas no código e documentadas em `.env.example`:

```text
GROQ_API_KEY
GROQ_MODEL
```

Os nomes finais precisam ser registrados no `.env.example` sem valores. Nunca prefixar segredo com `NEXT_PUBLIC_`.

### Proibições

- não ler ou imprimir `.env.local` sem necessidade;
- não copiar segredo para Markdown, log ou screenshot;
- não usar `service_role` no cliente;
- não logar token, cookie, relato completo ou saída privada;
- não commitrar `.env*` exceto `.env.example`.

## 5. Autenticação

Fluxo:

```text
/entrar
  → GET /auth/iniciar
  → Microsoft
  → GET /auth/callback?code=...
  → exchangeCodeForSession
  → /onboarding ou destino interno seguro
```

Arquivos:

- `app/auth/iniciar/route.ts`;
- `app/auth/callback/route.ts`;
- `app/auth/erro/page.tsx`;
- `lib/auth/redirect.ts`;
- `lib/supabase/server.ts`;
- `lib/supabase/proxy.ts`;
- `proxy.ts`.

Regras:

- `next` aceita somente caminho interno;
- cookies PKCE precisam ser aplicados ao `NextResponse` de redirect;
- `getClaims()` valida sessão antes de rota/dado privado;
- autorização final pertence à RLS e ao `user_id`, não apenas ao proxy;
- erros para usuário são traduzidos; detalhes técnicos ficam sem PII.

## 6. Banco atual

Migrações aplicadas:

```text
supabase/migrations/20260810190000_phase_3_onboarding.sql
supabase/migrations/20260810230000_phase_4_diary_evidences.sql
supabase/migrations/20260811120000_phase_5_evidence_library.sql
```

### `profiles`

Campos:

- `id uuid` — PK e FK para `auth.users`, exclusão em cascata;
- `display_name` — 2 a 80 caracteres;
- `professional_moment` — enum por constraint textual;
- `main_objective` — 8 a 180 caracteres;
- `product_consent` — obrigatoriamente verdadeiro para perfil concluído;
- `product_consent_at`;
- `consent_version`;
- `communications_consent`;
- `daily_log_reminder_enabled`;
- `daily_log_reminder_time` — nulo quando lembrete desligado;
- `onboarding_completed_at`;
- `created_at`, `updated_at`.

Momentos aceitos:

```text
estudando
inicio-carreira
transicao
consolidacao
lideranca
```

### `daily_logs`

Campos:

- `id uuid`;
- `user_id` — FK para `auth.users`;
- `entry_key` — idempotência por usuário;
- `content` — 40 a 2.000 caracteres no contrato atual;
- `source` — `text` ou `voice`;
- `status` — `raw`, `structured` ou `archived`;
- `created_at`, `updated_at`;
- unique `(user_id, entry_key)`.

### `evidence_suggestions`

- estrutura sugerida pela Groq ou criada manualmente;
- permanece separada da evidência até confirmação humana;
- estados de geração, revisão, confirmação, rejeição e falha;
- vínculo obrigatório com proprietário e Daily Log.

### `evidences`

- pode nascer da confirmação atômica de sugestão ou de registro manual;
- `source_log_id` e `suggestion_id` são nulos somente no registro manual;
- estrutura confirmada: título, contexto, desafio, ação, resultado, competências e aprendizado;
- estado `confirmed` ou `archived`;
- atualização limitada ao proprietário e a referências pertencentes ao mesmo usuário.

### `evidence_sources`

- uma linha por link HTTP/HTTPS;
- URL única por evidência;
- sem arquivos, upload ou Storage nesta fase;
- `on delete cascade` com evidência/usuário;
- RLS e privilégios mínimos de CRUD para o proprietário.

### Função transacional

```text
public.complete_onboarding(
  text, text, text,
  boolean, boolean, boolean,
  time, text
) returns uuid
```

É `security invoker`, usa `auth.uid()`, valida fronteiras novamente e grava perfil + primeiro log na mesma transação.

Também existe `public.confirm_evidence_suggestion(uuid)`, que confirma a sugestão e cria a evidência vinculada ao Daily Log em uma única transação.

### RLS

`profiles`:

- select próprio;
- insert próprio;
- update próprio.

`daily_logs`:

- select próprio;
- insert próprio;
- update próprio;
- delete próprio.

`evidence_suggestions`:

- select, insert e update próprios;
- confirmação final ocorre pela RPC validada.

`evidences`:

- select próprio;
- insert próprio somente para registro manual confirmado;
- update próprio com referências restritas ao mesmo usuário.

`evidence_sources`:

- select, insert, update e delete próprios;
- inserção/alteração exige evidência ativa do mesmo proprietário.

Qualquer nova tabela privada precisa de RLS antes da feature ser considerada funcional.

## 7. Alterações de banco

Para cada mudança:

1. criar arquivo em `supabase/migrations/` com timestamp e nome;
2. revisar constraints, FK, cascade e índices;
3. habilitar RLS;
4. criar políticas mínimas por operação;
5. conceder apenas privilégios necessários;
6. testar com usuário autenticado e acesso anônimo/segundo usuário;
7. aplicar no projeto correto;
8. registrar resultado no log sem dados privados;
9. nunca deixar SQL aplicado apenas no painel sem migração equivalente.

## 8. IA server-only

Contrato técnico para a primeira integração:

- rota ou Server Action autenticada;
- validação e limite do Daily Log antes da chamada;
- prompt versionado em arquivo server-only;
- modelo configurável;
- schema explícito de resposta;
- parse e validação antes de persistir;
- timeout e erro recuperável;
- retry mínimo e somente quando seguro;
- entrada e saída privadas não entram em logs;
- sugestão fica separada de evidência confirmada;
- modo manual funciona sem Groq.

Recuperação inicial usa Postgres determinístico. Embeddings entram somente após teste real demonstrar necessidade.

## 9. Testes atuais

Script:

```text
node --experimental-strip-types --test
  lib/auth/redirect.test.ts
  lib/onboarding/validation.test.ts
  lib/diary/validation.test.ts
  lib/groq/evidence-schema.test.ts
  lib/evidence/validation.test.ts
```

Cobertura real:

- redirects internos seguros;
- onboarding válido sem lembrete;
- consentimento e tamanho do Daily Log;
- horário quando lembrete está ativo.
- validação e normalização do Daily Log;
- estrutura de evidência e compatibilidade do schema Groq;
- níveis Registrada/Documentada;
- URLs HTTP/HTTPS normalizadas e rejeição de esquemas perigosos ou credenciais embutidas.

Estado atual: 20/20 testes aprovados, incluindo diagnóstico, Consistência observada e validação da Coerência assistida.

O plano técnico cita Vitest e Playwright, mas eles não estão instalados. Só adicionar quando um fluxo exigir ganho real e após `package.json`/plano aprovados.

## 10. Operação local

### Verificar porta

```powershell
Get-NetTCPConnection -LocalPort 3100 -State Listen -ErrorAction SilentlyContinue
```

### Iniciar

```powershell
cd C:\Users\yansi\OneDrive\Persona_Geral\persona_mvp_v2\apps\web
npm.cmd run dev
```

### Encerrar

Use `Ctrl+C` no terminal que iniciou o servidor. Em Windows, `npm.cmd` pode perguntar se deseja finalizar o arquivo em lotes; responda `S` apenas no terminal correto.

### Build

Evite build concorrente com `next dev` usando a mesma `.next`. Encerre o servidor, execute o build e reinicie depois.

## 11. Git e commits

Fluxo obrigatório após cada implementação coerente:

```powershell
git status --short
git diff --check
git diff --stat
git diff
```

Depois:

1. verificar que `.env.local`, `.next`, `node_modules`, logs e segredos não estão staged;
2. atualizar `CURRENT_STATE.md`, revisão e `log_execução.md`;
3. executar os gates relevantes;
4. adicionar somente arquivos da implementação;
5. criar commit local;
6. verificar `git status --short` e `git log -1 --oneline`;
7. fazer push apenas se houver remoto correto e autorização/fluxo já estabelecido.

Mensagens recomendadas:

```text
feat(fase-4): implement daily log review flow
fix(fase-3): preserve onboarding data on retry
docs: update handoff after phase 3
test(fase-4): cover Groq output validation
```

Se não existir remoto, não invente URL nem publique em repositório antigo. Registre a limitação e peça o destino a Yan.

## 12. Segurança operacional

- não usar dados financeiros ou pessoais do perfil de Yan em demo pública;
- não mostrar e-mail em screenshot destinado à banca;
- usar dados sintéticos ou explicitamente autorizados;
- confirmar antes de excluir, revogar credencial, publicar ou criar recurso pago;
- Strix somente com alvo autorizado, orçamento/tempo definidos e dados de teste;
- um scan limpo não substitui RLS, revisão e testes manuais.
