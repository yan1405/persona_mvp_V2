# Licenças das fontes — Plus Jakarta Sans e Inter

Lote 2 · Interface · 08/11/2026. Base `acc1f44`. Conclusão: **`PROVADA`** para o uso previsto (arquivos próprios, `next/font/local`, sem CDN, sem dependência nova).

Esta é uma conferência técnica de fontes primárias, não parecer jurídico.

## 1. Licença

| | Plus Jakarta Sans | Inter |
|---|---|---|
| Licença | SIL Open Font License 1.1 (SPDX `OFL-1.1`) | SIL Open Font License 1.1 (SPDX `OFL-1.1`) |
| Copyright (linha da licença) | `Copyright 2020 The Plus Jakarta Sans Project Authors (https://github.com/tokotype/PlusJakartaSans)` | `Copyright (c) 2016 The Inter Project Authors (https://github.com/rsms/inter)` |
| Reserved Font Name | **Nenhum declarado.** A linha de copyright não traz “with Reserved Font Name”. | **Nenhum declarado.** Idem. |
| Versão | Tag `2.7.1` (26/05/2023), commit de origem registrado no `METADATA.pb` do Google Fonts: `18d1cd2` | Tag `v4.1` (16/11/2024); build do Google Fonts: commit `66647c0` |
| Peso/eixo usados | variável `wght` 500–800 | variável `wght` 400–700 (o Google Fonts publica Inter com eixo `opsz` 14–32) |

## 2. Fontes primárias consultadas

Consulta feita em 08/11/2026 via HTTPS (`raw.githubusercontent.com`, API do GitHub, `fonts.googleapis.com`).

| Fonte | URL | Commit/tag | SHA-256 do arquivo |
|---|---|---|---|
| `google/fonts` — OFL Plus Jakarta Sans | `https://github.com/google/fonts/blob/5bb28733cec313b63fbd415b574b5ae35c8aa8b8/ofl/plusjakartasans/OFL.txt` | `5bb28733cec313b63fbd415b574b5ae35c8aa8b8` | `995c7199cab65954f545996326755daee7b63cc6b42b06c13da1f9502ab08a99` |
| `google/fonts` — OFL Inter | `…/ofl/inter/OFL.txt` (mesmo commit) | `5bb28733…` | `5b9321a4298cfeb6b34354164a1c3afc3db114569984c502b9b35d988fd58c57` |
| `google/fonts` — METADATA Plus Jakarta Sans / Inter | `…/ofl/plusjakartasans/METADATA.pb`, `…/ofl/inter/METADATA.pb` | `5bb28733…` | `e7953d66…1de6` / `79e4721e…a5b0` |
| Upstream Plus Jakarta Sans — `OFL.txt` | `https://github.com/tokotype/PlusJakartaSans/blob/2.7.1/OFL.txt` | tag `2.7.1` → `489ca9f6588fcf460c8c2fe1ec70c3d610363c98` (idêntico no commit `18d1cd2`) | `995c7199…ab08a99` (idêntico ao do `google/fonts`) |
| Upstream Inter — `LICENSE.txt` | `https://github.com/rsms/inter/blob/v4.1/LICENSE.txt` | tag `v4.1` → `e3a3d4c57d5ecc01453a575621882a384c1995a3` (idêntico no commit `66647c0`) | `262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a` |
| GitHub License API | `api.github.com/repos/{rsms/inter,tokotype/PlusJakartaSans}/license` | — | ambos `OFL-1.1` |

O texto de Inter no `google/fonts` difere do upstream só por espaço em branco, pela divisão do cabeçalho e pelo ano na primeira linha (2020 × 2016). O corpo da licença é o mesmo. O repositório guarda o texto **upstream** de Inter, cujo ano (2016) coincide com o copyright do metadado da fonte (`METADATA.pb`).

## 3. Condições da OFL-1.1 e como o projeto as cumpre

| Condição (OFL §2–§5) | Cumprimento |
|---|---|
| Usar, estudar, copiar, incorporar e redistribuir livremente, inclusive em software/site comercial | Uso em site/app: permitido. |
| Não vender as fontes isoladamente | Não são vendidas; só servem ao app. |
| Cada cópia redistribuída inclui o aviso de copyright e a licença (arquivo de texto ou metadado) | `apps/web/public/fonts/OFL-Inter.txt` e `OFL-PlusJakartaSans.txt`, ao lado dos `.woff2`. |
| Nome Reservado: obrigação de renomear versões modificadas | Sem Reserved Font Name declarado, não há renomeação obrigatória. Os arquivos não foram modificados por nós. |
| Não usar nome de autor/projeto para promover derivados sem permissão | Não usamos. |
| Derivados continuam sob a OFL | Não há derivado; os `.woff2` são os arquivos distribuídos pelo Google Fonts. |
| Licença não se aplica ao software que **usa** a fonte | O código do Persona não herda a OFL. |

Um subconjunto (`latin`) já feito pelo Google Fonts é distribuição desse serviço; não fizemos subconjunto nem conversão.

## 4. Arquivos incorporados e procedência

Os dois `.woff2` são os do pacote de Design System aprovado (`fonts/*-latin.woff2`, hashes em `MANIFEST.json` do pacote T4) e foram comparados byte a byte com o que `https://fonts.googleapis.com/css2?family=Inter:wght@400..700&family=Plus+Jakarta+Sans:wght@500..800` entrega em 08/11/2026 (`fonts.gstatic.com`, Inter v20 e Plus Jakarta Sans v12): **os SHA-256 são idênticos**. Cada arquivo é um único `.woff2` variável; o pacote repete o mesmo conteúdo para cada peso.

| Arquivo no repositório | Origem (URL no `fonts.gstatic.com`) | Tamanho | SHA-256 |
|---|---|---:|---|
| `apps/web/public/fonts/Inter-latin.woff2` | `/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2` | 48 256 | `3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62` |
| `apps/web/public/fonts/PlusJakartaSans-latin.woff2` | `/s/plusjakartasans/v12/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2` | 27 348 | `153fc85b70298beeb1d61a5f723331649e7f23bb77302a66e61cb3e2fbdb5e79` |
| `apps/web/public/fonts/OFL-Inter.txt` | upstream `v4.1` `LICENSE.txt` | — | `262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a` |
| `apps/web/public/fonts/OFL-PlusJakartaSans.txt` | upstream `2.7.1` `OFL.txt`, **só com o espaço final removido** (linha 21, para `git diff --check`; texto idêntico) | — | `f9a8e776b4b048227f2f046b8716083eb04b1539d9ad1d4b87e81c1df28f86e3` (original upstream: `995c7199…ab08a99`) |

Os arquivos `latin-ext` do pacote **não** foram incorporados: `next/font/local` não aceita `unicode-range` por arquivo, e o `latin` (U+0000–00FF, pontuação geral, `€`, `™`) cobre todo o português. Nomes com letras fora do Latin-1 (ex.: `ł`, `ő`) caem na fonte de sistema.

## 5. Limites desta verificação

- A versão de cada fonte vem do `METADATA.pb` do `google/fonts` e das tags upstream; **não foi lida da tabela `name` do binário** (o ambiente não tinha ferramenta de leitura de `.woff2`; instalar uma exigiria dependência).
- A ausência de Reserved Font Name foi verificada no texto das licenças e nas linhas de copyright, não na tabela `name` dos binários.
- O Design System tem Inter/Jakarta, mas **não define fonte monoespaçada**. O produto continua com Geist Mono nos papéis técnicos (`app/layout.tsx`); Geist Mono não foi verificada neste documento e seu caminho ainda aponta para `node_modules/next/...` (frágil). Decisão pendente.

## 6. Conclusão

**`PROVADA`.** Ambas as fontes são OFL-1.1, sem Reserved Font Name, redistribuíveis em site/app com o aviso de licença junto dos arquivos; os arquivos usados são idênticos aos publicados pelo Google Fonts a partir dos repositórios dos autores. O uso previsto (arquivos próprios, `next/font/local`) é permitido.
