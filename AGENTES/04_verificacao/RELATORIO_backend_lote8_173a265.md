# Relatório de Verificação — Backend — Lote 8 (BK4-1: redirect aberto em `getSafeNextPath`, QL7-2)

- SHA revisado (`wt/backend-lote2`): `173a265e088444054159e44ede5535e696614357` — `fix(auth): fecha redirect aberto em getSafeNextPath (BK4-1, QL7-2)`. Pai: `36da9be` (docs do Orquestrador, sobre a base `67ba7e8`). O commit do Backend em si mexe em 3 arquivos: `apps/web/lib/auth/redirect.ts`, `redirect.test.ts` e `AGENTES/02_backend/STATUS.md`; todos dentro do escopo autorizado em `LOTE-8.md`.
- Verificador: Persona — Verificação Independente. Data: 10/11/2026. Um relatório vale só para este SHA. **Não é aprovação**; o gate é sugestão.
- Regras cumpridas: sem correção, sem push/merge/banco/SQL/chave/`.env`/provedor real; nada nos worktrees dos escritores; execução só em `verificacao-lote2`, um SHA por vez, `HEAD` conferido antes e depois (`HEAD estavel`); mutações, fuzz e sondas só em cópias fora do repositório; worktree devolvido a `a5a18aa`.

## 1. Resumo e gate sugerido

| SHA | Gate sugerido | Em uma linha |
|---|---|---|
| `173a265` (BK4-1) | **liberar para integração local** | O S3 QL7-2 está fechado: os 6 testes novos falham 3 de 6 no código da base e passam 6 de 6 no topo; um fuzz de 400.000 valores deixa **158 escapes** no código antigo e **0** no novo; as formas do lote (`/\t/…`, `%09`, `%0a`, `%0d`, `%5c`, `//`, `\`, espaço inicial) caem todas no `fallback`; os caminhos válidos voltam iguais. Três S4 abaixo, nenhum bloqueia. |

Execução independente, sem `.env`: `next typegen`, `npm test` **115/115** (cancelados 0, ignorados 0; os seis SHAs da Interface, sobre a mesma base, dão 110, e 110 + 5 = os 6 testes novos menos 1 que existia; não rodei `npm test` na base), lint (0 avisos), typecheck e build com saída 0. `lib/auth/redirect.test.ts` rodado diretamente: **6/6**. A base `67ba7e8` foi reconstruída para comparação (build 0; o teste antigo do arquivo roda 1/1, porque só tem a versão antiga).

**Sem S1, S2 ou S3 novo.** O S3 QL7-2 **fecha** com este SHA (VERIFIED, por teste, fuzz e forma por forma). Três S4.

## 2. Escopo do diff

- **VERIFIED:** `git show --stat 173a265`: 3 arquivos, +84/−5. `auth/iniciar/route.ts`, `auth/callback/route.ts` e `auth/qa-entrar/route.ts` **não** aparecem; continuam só consumindo o helper (`getSafeNextPath(searchParams.get("next"))`; `qa-entrar` com fallback `"/app"`). A assinatura não mudou (`value: string | null`, `fallback = "/onboarding"`).
- Código novo (topo de `redirect.ts`): rejeita (volta ao `fallback`) quando o valor é vazio, não começa com `/`, começa com `//`, casa `/[\u0000-\u001f\u007f\\]|%(?:00|09|0a|0d|5c)/i`, ou quando `new URL(valor, "https://persona.invalid").origin` difere da origem fixa (e se `new URL` lança).

## 3. O teste falha na base e passa no topo

- **VERIFIED:** o `redirect.test.ts` do topo, rodado contra o `redirect.ts` da base (`67ba7e8`): **3 de 6 falham** (caracteres de controle, variantes codificadas/espaço inicial, fallback informado); os outros 3 passam (caminhos válidos, o teste antigo ampliado, origem preservada). Contra o `redirect.ts` do topo: **6 de 6**. Confere com o `STATUS.md` do Backend ("na base falham 3").

## 4. Forma por forma (função antiga × nova, rodada por mim)

Fallback usado na sonda: `/fb`. "Origem" é a de `new URL(resultado, "https://app.example")`.

| Entrada (`next`) | Antigo | Novo |
|---|---|---|
| `/\t/evil.example.com`, `/\n/…`, `/\r/…` (controle cru) | **aceita** (escape) | fallback |
| `/%09/evil.example.com`, `/%0a/…`, `/%0A/…`, `/%0d/…` | aceita | fallback |
| `/%5c/evil.example.com`, `/%5C/…` | aceita | fallback |
| `/app\u0000`, `/%00`, `/./\t/evil` | aceita | fallback |
| `//evil.example.com`, ` //evil.example.com` | fallback | fallback |
| `\evil.example.com`, `/\evil.example.com`, `/\/evil`, `/\\evil`, `\\evil` | fallback | fallback |
| ` /app` (espaço inicial), `https://evil…`, `javascript:alert(1)`, `evil.example.com` | fallback | fallback |
| `/ /evil.example.com`, `/%2F/evil.example.com`, `/..//evil.example.com`, `/／evil…`, `/ /evil` | aceita (resolve na mesma origem) | aceita (mesma origem) |
| `/`, `/onboarding`, `/app/inicio?x=1`, `/app/configuracoes/dados#apagar`, `/a%20b`, `/app?next=%2F%2Fevil` | aceita | **aceita, idêntica** |

- **VERIFIED:** todos os caminhos válidos do lote voltam **iguais** (nenhum reescrito). Nas rotas, o valor aceito continua o texto original do `next`.
- **Fuzz próprio** (400.000 valores gerados com um alfabeto de 26 átomos — `/`, `\`, `\t`, `\n`, `\r`, `\0`, espaço, `%`, `09`, `0a`, `0d`, `5c`, `2f`, `00`, `..`, `@`, `:`, Unicode estranho, `evil.example.com`; 3 origens de teste; pipeline `iniciar` → `callback` simulado com `searchParams.set/get` e resolução do `Location`): **escapes do código antigo: 158; do novo: 0**. Aceitos pelo novo: 133.016; rejeitados mas seguros no antigo ("sobre-rejeição"): 147.029 (a maior parte é ruído do gerador, cheio de `%` e controle; ver BK8-1).

## 5. Mutações no código novo (cópia fora do repositório, 16 mutações, `node --test` sobre o teste do topo)

| Mutação | Resultado |
|---|---|
| tirar a faixa `\u0000-\u001f`; tirar `\u007f`; tirar `%00`, `%09`, `%0a`, `%0d`, `%5c` (cada um); tirar a flag `i`; tirar `startsWith("/")`; tirar `!value`; fallback fixo; remover `FORBIDDEN.test`; inverter a comparação de origem | **13 morrem** |
| tirar `\` do regex (M03) | **sobrevive** (7.981 valores a mais aceitos no fuzz, **0 escapes**) |
| tirar `startsWith("//")` (M10) | **sobrevive** (fuzz: 0 escapes, mesmos 133.016 aceitos) |
| tirar a checagem de origem inteira (M11) | **sobrevive** (fuzz: 0 escapes, mesmos 133.016 aceitos) |

Leitura: M03, M10 e M11 são **defesa em profundidade**: cada um fica coberto pelas outras barreiras (a origem já pega `\evil` e `//evil`; o regex e o `//` pegam o que a origem deixaria passar). Nenhum teste prova que cada camada sozinha funciona, e nenhum valor do fuzz escapou sem elas. **S4, HYPOTHESIS** de que sejam equivalentes além dos 400.000 casos.

## 6. Achados

| ID | Sev. | Rótulo | Achado | Recomendação |
|---|---|---|---|---|
| BK8-1 | S4 | VERIFIED | Sobre-rejeição: caminhos internos legítimos com `%0a`, `%0d`, `%09`, `%00` ou `%5c` **no query ou no fragmento** (`/app?q=a%0Ab`, `/app?x=%5c`) agora caem no `fallback`. Hoje ninguém envia isso (`next` carrega só rotas como `/app/configuracoes/dados`). | Aceitar, ou restringir o filtro codificado ao trecho do caminho (antes de `?` e `#`). |
| BK8-2 | S4 | VERIFIED (testes) / HYPOTHESIS (equivalência) | Três mutações sobrevivem (M03, M10, M11, §5): as camadas redundantes não têm teste próprio. | Aceitar como defesa em profundidade ou adicionar um teste por camada (por exemplo `/a\b`, que o parser trata como `/a/b`). |
| BK8-3 | S4 | PENDING | Não exercitei `auth/iniciar` e `auth/callback` por HTTP (dependem do provedor de login). O diff não as altera e os valores aceitos são idênticos aos de antes (tabela da §4). | Conferir no QA local quando houver ambiente. |
| QL7-2 | S3 | **fechado** | `getSafeNextPath` aceitava `/\t/evil…`; fechado por BK4-1. | — |

## 7. Não verificado / PENDING

- Fluxo real de login Microsoft/Supabase, `auth/iniciar` e `auth/callback` ao vivo, Preview e Production, banco. O comportamento foi provado na função e no pipeline simulado, não no servidor com provedor.
- Equivalência das camadas redundantes além dos 400.000 casos do fuzz (HYPOTHESIS).
- Nada foi corrigido, aplicado, integrado ou commitado por mim.

## 8. Decisão de gate (resumo)

`173a265`: **liberar para integração local**. O S3 QL7-2 fica fechado.
