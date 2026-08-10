# Fundação de Marca — Persona MVP v2

Status: aprovado por Yan em 10/08/2026.

## Regra de precedência

A identidade da v2 combina duas fontes com responsabilidades diferentes:

1. **Persona original:** somente paleta de cores e logos oficiais.
2. **Design DNA adaptado do CRM:** estrutura, densidade, geometria, componentes, superfícies, movimento e comportamento visual.
3. **Persona MVP v2:** tipografia, conteúdo, fluxos, arquitetura e decisões novas documentadas dentro deste projeto.

Quando houver conflito, a paleta e os logos do Persona prevalecem sobre cores e marcas do CRM. Para todos os demais pontos, prevalecem os documentos atuais da v2.

## Paleta original aprovada

### Índigo de marca

| Token | Valor | Uso principal |
|---|---|---|
| `indigo-50` | `#F7F5FE` | fundo de realce claro |
| `indigo-100` | `#ECEAFB` | seleção e borda suave |
| `indigo-200` | `#DDD6F8` | borda e superfície marcada |
| `indigo-300` | `#C4B5FD` | texto secundário no tema escuro |
| `indigo-400` | `#A78BFA` | foco e realce |
| `indigo-500` | `#7C3AED` | ação principal e núcleo do logo |
| `indigo-600` | `#6D28D9` | hover de ação principal |
| `indigo-700` | `#5B21B6` | ênfase em fundo claro |
| `indigo-900` | `#2E1A6B` | ênfase máxima |

### Neutros violeta

| Token | Valor |
|---|---|
| `slate-50` | `#FAFAFC` |
| `slate-100` | `#F2F1F7` |
| `slate-200` | `#E4E2EE` |
| `slate-300` | `#C9C5D8` |
| `slate-400` | `#888291` |
| `slate-500` | `#6D5BA6` |
| `slate-600` | `#4F4866` |
| `slate-700` | `#2E2A3D` |
| `slate-900` | `#1A1726` |

### Cores semânticas preservadas

- sucesso: `#ECFDF5`, `#10B981`, `#064E3B`;
- alerta: `#FFFBEB`, `#F59E0B`, `#78350F`;
- erro: `#FEF2F2`, `#EF4444`, `#7F1D1D`;
- informação: `#EFF6FF`, `#3B82F6`, `#1E3A8A`.

## Tipografia atual da v2

- Interface, títulos e corpo: **Geist Sans**.
- IDs, atalhos e metadados técnicos: **Geist Mono**.
- Plus Jakarta Sans e JetBrains Mono não fazem parte da v2.
- O texto “Persona” ao lado do símbolo usa Geist e não o lockup tipográfico antigo.

## Logos locais

Os arquivos aprovados estão em `apps/web/public/brand/`:

- `persona-logo-rica.svg`: fundos claros, tamanho mínimo de 24px;
- `persona-logo-rica-dark.svg`: fundos escuros, tamanho mínimo de 24px;
- `persona-logo-compacta.svg`: favicon e tamanhos de até 20px;
- `persona-logo-mono.svg`: reprodução monocromática.

Os SVGs preservam sua geometria e cores. Não devem receber gradiente, sombra, distorção ou recoloração arbitrária.

## O que não foi importado

O pacote antigo não governa tipografia, escala tipográfica, espaçamento, raios, sombras, componentes, layouts, ilustrações, mascote ou movimento da v2. Esses pontos permanecem definidos por `design-dna.json`, `DESIGN_DNA_ADAPTATION.md` e pelos demais documentos atuais do projeto.
