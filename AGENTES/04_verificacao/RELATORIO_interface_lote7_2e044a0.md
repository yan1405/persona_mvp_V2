# Relatório de Verificação — Interface — Lote 7 (login por senha SOMENTE para QA local, QL-1 a QL-4)

- SHAs revisados, um a um (`wt/interface-lote2`, base `2bca3790f18bb1428b3923747e5287ca76cccbce`, cada um filho do anterior):
  1. `d786814494b967b8c59d14aeff9d725ed6e5ea90` — QL-1: gate puro `lib/auth/qa-login-gate.ts` + teste.
  2. `092a5c3d7c17ec6f1bd389afa9e933c098d65888` — QL-2: rota `POST /auth/qa-entrar`.
  3. `707e93f6d5ae90c29de63711624845ddca49f918` — QL-3: formulário em `/entrar` (só `app/entrar/page.tsx`, +20/−2).
  4. `2e044a062082f58c2dc7168145e12f018ba22583` (topo) — QL-4: `.env.example` e `STATUS.md`.
- Verificador: Persona — Verificação Independente. Data: 09/11/2026. Um relatório vale só para os SHAs citados. **Não é aprovação**; o gate é sugestão.
- Regras cumpridas: sem correção, sem push/merge; **sem senha real, sem projeto Supabase, sem chave, sem `.env`** (o worktree só tem `.env.example`; o servidor rodou sem `NEXT_PUBLIC_SUPABASE_*`, então `isSupabaseConfigured()` é falso e nenhuma chamada a provedor foi possível); sem SQL; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, builds em sequência com `HEAD` conferido antes e depois (`HEAD estavel` em todos), devolvida a `a5a18aa` limpa. Credenciais usadas nas requisições: valores fictícios (`qa-fake@example.invalid`, uma frase qualquer). Servidor: `next start` em `127.0.0.1:3107`, encerrado ao fim de cada bloco.

## 1. Resumo e gate sugerido por SHA

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `d786814` (QL-1) | **liberar para integração local** | Gate é uma lista de permissões estrita; cada condição isolada desliga (teste 3/3 rodado direto, mais 23 hosts e 13 combinações de ambiente em sondagem própria). Ressalva: `NODE_ENV` com outra grafia (`Production`, `test`, vazio) deixa o gate ligado (QL7-3, S4). |
| `092a5c3` (QL-2) | **liberar com ressalvas** | Com `NODE_ENV=production` + `PERSONA_QA_PASSWORD_LOGIN=1` o `POST` responde 404 vazio (5 variantes, incluindo `Host`/`X-Forwarded-Host`/`Forwarded` forjados). Não loga nada; não ecoa o Supabase. Ressalvas: QL7-1 (a rota é distinguível de um 404 comum) e QL7-2 (`next` do helper existente pode sair da origem). |
| `707e93f` (QL-3) | **liberar para integração local** | Com o gate desligado o HTML de `/entrar` tem **0 linhas diferentes** da base `2bca379` (4 configurações); com o gate ligado só entra o `<form>`. Sem vestígio nos arquivos estáticos do cliente. |
| `2e044a0` (QL-4, topo) | **liberar com ressalvas** | `.env.example` só com comentário (sem valor) e `STATUS.md`. Ressalvas: o teste do gate **não está no `npm test`** (ajuste do Orquestrador, `package.json` fora da escrita da Interface) e QL7-2. |

Execução independente, sem `.env`, nos quatro SHAs: `next typegen`, `npm test` **107/107** (cancelados 0, ignorados 0), lint (0 avisos), typecheck e build com saída 0; `HEAD` estável. `lib/auth/qa-login-gate.test.ts` rodado **diretamente** (`node --experimental-strip-types --test`) em cada SHA: **3/3** (o arquivo só existe a partir de `d786814`).

**Sem S1, S2 ou S3 introduzido pelo Lote 7. Nenhum cabeçalho forjado liga o gate (S2 não encontrado).** Há um **S3 preexistente** (QL7-2, `getSafeNextPath`, na base `2bca379` e antes), fora do diff do lote mas reutilizado pela rota nova. Quatro S4 abaixo.

## 2. Escopo do diff (`2bca379..2e044a0`)

- **VERIFIED:** 6 arquivos, +108/−2: `lib/auth/qa-login-gate.ts` (17), `qa-login-gate.test.ts` (30), `app/auth/qa-entrar/route.ts` (34), `app/entrar/page.tsx` (+20/−2), `.env.example` (+5), `AGENTES/01_interface/STATUS.md` (+2). `package.json`, `proxy.ts`, `auth/iniciar`, `auth/callback`, `lib/supabase/**` **não** aparecem: nada de fluxo Microsoft foi tocado.
- `git grep NEXT_PUBLIC` no diff: nenhuma variável nova (o único acerto é o comentário de `.env.example` que proíbe o prefixo). Nenhum `console.*` ou logger adicionado. Os arquivos estáticos do build do topo (`.next/static`) não contêm `PERSONA_QA`, `qa-entrar` nem "Entrar (QA)"; a variável só aparece nos chunks de servidor, lida em tempo de execução.

## 3. QL-1: o gate (`d786814`)

- Código: `PERSONA_QA_PASSWORD_LOGIN === "1" && NODE_ENV !== "production" && !VERCEL && !VERCEL_ENV && typeof host === "string" && /^(localhost|127\.0\.0\.1|\[::1\])(:\d{1,5})?$/.test(host)`. O host vem do cabeçalho `Host`; `X-Forwarded-Host` e `Forwarded` nunca são lidos (confirmado por leitura e pelas requisições da §5).
- **VERIFIED, teste do autor (3/3 em cada SHA):** todo ligado liga (4 formas de host); cada condição isolada desliga (flag ausente, `true`, `0`; `NODE_ENV=production`; `VERCEL`; `VERCEL_ENV`; host `null`/`undefined`); 14 hosts hostis desligam.
- **VERIFIED, sondagem própria** (mesma função, cópia fora do repositório):
  - Hosts que **desligam**: `localhost.`, `localhost\n`, `localhost\r\n`, `localhost:3000\n`, `localhost, evil.com`, `evil.com, localhost`, `LOCALHOST`, `127.0.0.1.evil.com`, `[0:0:0:0:0:0:0:1]`, `::1`, porta com dígitos Unicode, porta com 7 dígitos, `localhost%00`, `a.localhost`. Hosts que **ligam**: `localhost`, `localhost:0`, `localhost:99999`, `127.0.0.1:80`, `[::1]:3000`, `localhost:00080` (porta fora de faixa/zeros à esquerda não importa: o servidor real já recusa).
  - Flag com espaço (`"1 "`, `" 1"`) desliga. `VERCEL="0"` desliga (conservador). `VERCEL=""` e `VERCEL_ENV=""` **não** desligam (é o que o lote pediu: "ausente/vazia").
  - `NODE_ENV` `"Production"`, `"PRODUCTION"`, `"test"` ou `""` **ligam** o gate (QL7-3).
  - `VERCEL_URL`, `NOW_REGION` e `AWS_LAMBDA_FUNCTION_NAME` não participam; na Vercel `VERCEL=1` sempre existe, então isso não abre nada hoje.

## 4. QL-2: prova real de 404 em produção (`092a5c3`, repetida no topo)

Builds de `092a5c3` e `2e044a0` com `next build`, `next start` com ambiente limpo (`env -i`), porta 3107, sem Supabase configurado. A rota é idêntica nos dois (`diff` vazio).

| Cenário (ambiente do processo) | Requisição | Resultado |
|---|---|---|
| `NODE_ENV=production`, sem a flag | `POST /auth/qa-entrar` | **404**, corpo vazio |
| `NODE_ENV=production` **e** `PERSONA_QA_PASSWORD_LOGIN=1` | `POST` com `Host` real (127.0.0.1) | **404**, corpo vazio |
| idem | `POST` com `Host: localhost` e com `Host: localhost:3107` | **404** (os dois) |
| idem | `POST` com `X-Forwarded-Host: localhost` | **404** |
| idem | `POST` com `Forwarded: host=localhost` | **404** |
| idem | `GET /entrar` | HTML **sem** formulário (ver §6) |
| `NODE_ENV=development`, flag `1`, `VERCEL=1` | `POST` | **404** (e `/entrar` sem formulário) |
| `NODE_ENV=development`, flag `1`, `VERCEL_ENV=preview` | `POST` | **404** (e `/entrar` sem formulário) |
| `NODE_ENV=development`, flag `true` | `POST` | **404** |

Nos casos de produção, `Host: localhost` + flag ligada é o melhor caso para um atacante e mesmo assim a produção segura (VERIFIED). Isso vale também para os dois SHAs intermediários por serem o mesmo código (`d786814` ainda não tem a rota; `707e93f` só mexe em `/entrar`).

## 5. Host forjado (`092a5c3` e `2e044a0`), gate efetivamente ligado

Para testar o lado positivo usei `next start` com `NODE_ENV=development` + flag `1` (aviso "non-standard NODE_ENV" do Next; só no meu teste).

| Requisição (servidor ouvindo em 127.0.0.1:3107) | Resultado |
|---|---|
| `Host` real local, dados fictícios | **303** para `/entrar?erro=qa` (sem Supabase configurado, a validação cai no `fail()`; nenhum `Set-Cookie`) |
| `Host: localhost:3107` | 303 (igual) |
| `Host: evil.example.com` | **404** |
| `Host: evil.example.com` + `X-Forwarded-Host: localhost` | **404** (`X-Forwarded-Host` não liga o gate) |
| `Host: evil.example.com` + `Forwarded: host=localhost` | **404** |
| `Host` local + `X-Forwarded-Host: evil.example.com` | 303 com `Location: http://localhost:3107/entrar?erro=qa`: o cabeçalho forjado **não** altera a origem do redirect |
| corpo inválido, vazio, `next=https://evil…` | 303 genérico para `/entrar?erro=qa` (o `next` só é lido depois de um login bem-sucedido) |

- **VERIFIED:** nenhum cabeçalho de encaminhamento liga o gate nem desvia o redirect; o único cabeçalho que conta é `Host`, e em produção (`NODE_ENV=production`) ou na Vercel (`VERCEL`/`VERCEL_ENV`) ele não basta. **S2 não encontrado.**
- **Limite (QL7-4, S4):** em ambiente de desenvolvimento o `Host` é controlado por quem manda a requisição. O servidor do Next escuta em todas as interfaces por padrão (o `next start` imprimiu `Network: 172.24.160.1:3107`), então um dispositivo da mesma rede que enviar `Host: localhost` a um `next dev` com a flag ligada vê o gate ligado. Mitigação sem código: `next dev -H 127.0.0.1` e a flag só na máquina de QA.

## 6. QL-3: HTML de `/entrar` (`707e93f`, topo)

- **VERIFIED:** `GET /entrar` com o build de `092a5c3` e `2e044a0` contra a base `2bca379`, gate desligado por quatro caminhos (sem flag; `production`+flag; `VERCEL=1`+flag; `VERCEL_ENV=preview`+flag): `<main>` byte a byte idêntico nos 8 casos; página inteira, sem `<script>` e com os caminhos de assets normalizados, com **0 linhas diferentes**. A string `qa-entrar` não aparece em nenhum desses HTMLs (nem nos dados do RSC). O botão "Entrar com Microsoft" (`/auth/iniciar`) está igual.
- Gate ligado (`NODE_ENV=development`, flag, host local): a única diferença é o `<form class="qa-login" action="/auth/qa-entrar" method="post">` com o aviso "Acesso de QA local (conta descartável).", `label`/`for` em e-mail e senha, `autoComplete="username"` e `current-password`, `maxLength` 254/200, `required` e o botão "Entrar (QA)". A palavra "Senha" só existe com o gate ligado.
- `707e93f` não foi servido sozinho; o diff `707e93f..2e044a0` não toca `app/entrar/page.tsx`, então o HTML dele é o do topo.
- Não verifiquei o visual (aceite de Yan).

## 7. Segredos, logs e regressões

- **VERIFIED por leitura:** `route.ts` nunca usa `console`; o retorno de `signInWithPassword` só é testado por `if (error)` e a mensagem é descartada; o redirect de erro é fixo (`/entrar?erro=qa`); o formulário mostra um texto fixo ("Não foi possível entrar.").
- **VERIFIED por execução:** 18 logs de servidor (base `2bca379`, `092a5c3` e `2e044a0`, 6 cenários cada) têm só o banner do Next (≤ 371 bytes); **0 ocorrências** de `qa-fake`, `example.invalid`, da senha fictícia ou de "password". Respostas 303 sem `Set-Cookie`.
- **HYPOTHESIS:** o ramo de sucesso (cookies aplicados, 303 para `/app` ou `next`) e a ausência de eco de mensagem do Supabase em erro **real** não foram exercitados (não há projeto nem senha). O código usa `createRouteClient`/`applyAuthCookies` como `auth/callback`.
- **O que `/app` e o callback exigem:** `proxy.ts` (`updateSession`) só exige uma sessão (`getClaims`); não há checagem de domínio de e-mail no `/app`, no `/onboarding` ou no callback. Uma sessão por senha passa pelo mesmo caminho e cai no onboarding normal (VERIFIED por leitura; não executado). Nenhuma checagem de produção foi enfraquecida: o diff não toca `proxy.ts`, `iniciar` nem `callback`.
- **Login Microsoft:** sem diff nos arquivos do fluxo e HTML do botão idêntico (VERIFIED); o OAuth em si não foi exercitado (HYPOTHESIS/PENDING).

## 8. Achados

| ID | Sev. | Rótulo | Achado | Recomendação |
|---|---|---|---|---|
| QL7-2 | **S3 (preexistente)** | VERIFIED (mecanismo) / PENDING (ponta a ponta) | `getSafeNextPath` (`lib/auth/redirect.ts`, igual na base) aceita `/\t/evil.example.com`, `/\n/…` e `/\r/…`: não começa com `//` e não tem `\`, mas `new URL(valor, origem)` remove tabulação e quebras de linha e resolve para `https://evil.example.com/`. Simulei o fluxo de `/auth/iniciar?next=/%09/evil.example.com` → `callback?next=%2F%09%2Fevil.example.com` → `new URL(next, origin)`: destino final externo. Vale para `auth/iniciar` e `auth/callback` (**produção**, redirect aberto após o login Microsoft) e para o `next` da rota nova (só depois de login de QA bem-sucedido; o formulário não tem campo `next`). Não vem do Lote 7. `redirect.test.ts` não cobre esses caracteres. | Backend/Interface: rejeitar caracteres de controle (`/[\u0000-\u001f]/`) ou validar com `new URL` e comparar a origem; acrescentar teste. Não bloqueia o Lote 7, mas não promover a Preview/Production sem tratar. |
| QL7-1 | S4 | VERIFIED | Com o gate desligado a rota **não é** indistinguível de um caminho inexistente: o `POST` dá 404 com corpo vazio e cabeçalhos próprios (o 404 padrão do Next traz uma página HTML de 9.476 bytes), e `GET`/`HEAD` em `/auth/qa-entrar` dá **405** em vez de 404, mesmo em produção. Revela que a rota existe; não revela o gate, os valores nem credenciais. | Aceitável para QA local; se quiser sumir, exportar também `GET`/`HEAD`/etc. com 404 (`notFound()`), ou aceitar. |
| QL7-3 | S4 | VERIFIED | O gate compara `NODE_ENV !== "production"` por igualdade exata: `Production`, `PRODUCTION`, `test` e vazio ligam. O Next e a Vercel definem `production` em minúsculas, então hoje não abre nada; é uma dependência frágil de configuração. | Registrar; opcionalmente exigir `NODE_ENV` em `{"development","test"}` ou ausente. |
| QL7-4 | S4 | VERIFIED (limite) | Host é a única âncora de "local" e é controlado pelo cliente; o servidor ouve em todas as interfaces (§5). | Documentar `next dev -H 127.0.0.1`; flag só na máquina de QA. |
| QL7-5 | S4 | VERIFIED | `lib/auth/qa-login-gate.test.ts` não está no script `npm test` (`package.json` fora da escrita da Interface). | Orquestrador acrescenta o caminho na integração (e confira com `npm test` depois). |
| QL7-6 | S4 | VERIFIED | Sem proteção contra login CSRF/limite de tentativas na rota (forma de formulário comum). Só existe com o gate ligado, em QA local, com contas descartáveis. | Aceitável; registrar. |

## 9. Não verificado / PENDING

- Login por senha de ponta a ponta (sucesso, cookies, 303 para `/app`, eco de erro real do Supabase): exigiria credenciais e um projeto, fora do lote.
- OAuth Microsoft de ponta a ponta; Preview e Production; Vercel real (a prova de `VERCEL`/`VERCEL_ENV` é por variável de ambiente local).
- Visual do formulário e acessibilidade com leitor de tela; `707e93f` servido isoladamente (§6).
- Servidor sem `next dev`: usei `next start` com `NODE_ENV=development` para ligar o gate.

## 10. Decisão de gate (resumo)

`d786814` e `707e93f`: liberar para integração local. `092a5c3` e `2e044a0`: liberar com ressalvas (QL7-2 preexistente a tratar antes de Preview/Production; QL7-5 para o Orquestrador). Nenhum bloqueio do Lote 7 e nenhum S2. Nada foi corrigido, integrado ou commitado por mim.
