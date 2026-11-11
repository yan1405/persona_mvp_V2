import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const SERVER_CORE_FILE = "(^|/)(nvidia-chat|nvidia-client|generate-version|coherence|structure-evidence)(\.[cm]?[jt]s)?$";
const SERVER_CORE_BARREL = "(^|/)lib/live(/index(\.[cm]?[jt]s)?)?$";
const SERVER_CORE_MESSAGE = "Núcleo do LLM é só de servidor: importe-o apenas de lib/live/**, lib/score/coherence.ts, lib/score/analyze-coherence.ts, lib/groq/structure-evidence.ts, lib/groq/structure-evidence-server.ts ou app/app/live/actions.ts, nunca de componente ou código cliente.";
const SERVER_SHELL_FILE = "(^|/)(generate-live-response|analyze-coherence|structure-evidence-server)(\.[cm]?[jt]s)?$";
const SERVER_SHELL_MESSAGE = "Casca server-only do LLM: importe-a apenas de app/app/live/actions.ts, app/app/score/actions.ts ou app/app/diario/actions.ts (o build também recusa componente cliente).";
const restrict = (patterns) => ({
  "no-restricted-imports": ["error", { patterns: patterns.map(([regex, message]) => ({ regex, message })) }],
  "no-restricted-syntax": ["error",
    ...["ImportExpression > Literal.source", "CallExpression[callee.name='require'] > Literal.arguments:first-child"].flatMap((where) => patterns.map(([re, message]) => ({
      selector: `${where}[value=/${re.replaceAll("/", "[/]")}/]`,
      message,
    }))),
  ],
});

const HEX = String.raw`#[0-9a-fA-F]{3,8}\b`;
const PX = String.raw`\b\d+(\.\d+)?px\b`;
const FONT = String.raw`font-family\s*:\s*(?=\S)(?!['"]?(Inter|Plus Jakarta Sans)|var\(--ds-font-)`;
const COLOR_FN = String.raw`\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color-mix)\(`;
// Nomes de cor CSS (mesma lista de components/ds/ds-adherence.ts), para pegar cor nomeada em objetos de estilo.
const NAMED_COLORS = "aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|grey|green|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen";
export const DS_ADHERENCE = [
  ...["Literal[value", "TemplateElement[value.raw"].map((n) => ({ selector: n + "=/" + HEX + "/]", message: "Cor hexadecimal literal: use um token do DS (var(--ds-*)) em app/ds.css." })),
  ...["Literal[value", "TemplateElement[value.raw"].map((n) => ({ selector: n + "=/" + COLOR_FN + "/i]", message: "Cor funcional literal (rgb, hsl...): use um token do DS (var(--ds-*))." })),
  ...["Literal[value", "TemplateElement[value.raw"].map((n) => ({ selector: n + "=/" + PX + "/i]", message: "Valor em px literal: use tokens de medida do DS (var(--ds-*)) ou números do React." })),
  // Objetos de estilo (style={{ ... }}): cor nomeada, medida em número, fonte, peso, altura de linha e espaçamento de letra.
  { selector: `Property[key.name=/^(color|background|backgroundColor|borderColor|outlineColor|fill|stroke)$/] > Literal[value=/^\\s*(${NAMED_COLORS})\\s*$/i]`, message: "Cor nomeada: use um token do DS (var(--ds-*))." },
  { selector: "ObjectExpression > Property[key.name=/^(width|height|minWidth|maxWidth|minHeight|maxHeight|top|right|bottom|left|gap|margin\\w*|padding\\w*|borderRadius|fontSize)$/] Literal[raw=/^[1-9]/]", message: "Medida numérica (vira px): use um token do DS (var(--ds-*))." },
  { selector: "Property[key.name='fontFamily'] > Literal:not([value=/^var\\(--ds-font-/])", message: "Fonte fora do DS: use var(--ds-font-body) ou var(--ds-font-display)." },
  { selector: "Property[key.name=/^(fontWeight|lineHeight|letterSpacing)$/] > Literal:not([value=/^var\\(/])", message: "Peso, altura de linha e espaçamento de letra: use os tokens do DS (var(--ds-fw-*), var(--ds-lh-*), var(--ds-ls-*))." },
  { selector: "BinaryExpression[operator='+'] > Literal[value=/^\\s*px\\b/i]", message: "px por concatenação: use tokens de medida do DS ou números do React." },
  { selector: "TemplateLiteral > TemplateElement[value.raw=/^\\s*px\\b/i]", message: "px por interpolação: use tokens de medida do DS ou números do React." },
  ...["Literal[value", "TemplateElement[value.raw"].map((n) => ({ selector: n + "=/" + FONT + "/i]", message: "Fonte fora do DS. Disponíveis: Inter e Plus Jakarta Sans (var(--ds-font-body) / var(--ds-font-display))." })),
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // AG2-3/AG5-1: o núcleo do adaptador NVIDIA não tem "server-only" (precisa rodar em node --test); só o servidor pode importá-lo.
  // Cobre import estático, re-export, import() com texto literal, require() com texto literal, sufixos .ts/.js/.mjs/.cjs e a pasta/index (barril).
  // Limites (sem análise de fluxo): caminho montado em tempo de execução (`import(`${base}/nvidia-chat`)`, concatenação), alias novo que aponte
  // para estes arquivos e componente cliente colocado dentro das pastas permitidas. Um barril novo dentro de lib/live que reexporte o núcleo
  // fica liberado pela lista abaixo; por isso o barril não deve existir (nenhum hoje) e a revisão deve recusá-lo.
  // AG7-3: as cascas server-only também ficam fora do alcance de componentes (feedback no lint; o build já recusa). O núcleo continua restrito a todos.
  { rules: restrict([[SERVER_CORE_FILE, SERVER_CORE_MESSAGE], [SERVER_CORE_BARREL, SERVER_CORE_MESSAGE], [SERVER_SHELL_FILE, SERVER_SHELL_MESSAGE]]) },
  // As ações de Score e Diário podem importar a casca, nunca o núcleo.
  { files: ["app/app/score/actions.ts", "app/app/diario/actions.ts"], rules: restrict([[SERVER_CORE_FILE, SERVER_CORE_MESSAGE], [SERVER_CORE_BARREL, SERVER_CORE_MESSAGE]]) },
  { files: ["lib/live/**", "lib/score/coherence.ts", "lib/score/coherence.test.ts", "lib/score/analyze-coherence.ts", "lib/groq/structure-evidence.ts", "lib/groq/structure-evidence.test.ts", "lib/groq/structure-evidence-server.ts", "app/app/live/actions.ts"], rules: { "no-restricted-imports": "off", "no-restricted-syntax": "off" } },
  // DS-6 / C9-8: aderência ao Design System (traduzida de docs/redesign/design-system/_adherence.oxlintrc.json) em components/ds/** e nas telas novas
  // (entrar, onboarding, auth/erro, termos, privacidade, layout de /app):
  // sem hex, sem px literal (use tokens --ds-* via classes dx-* em app/ds.css) e fontes só Inter / Plus Jakarta Sans.
  // Este bloco repete a barreira do núcleo do LLM acima, porque no flat config a regra mais recente substitui a anterior para os mesmos arquivos.
  // O CSS (app/ds.css) é coberto por components/ds/ds-adherence.test.ts (não há plugin de CSS no ESLint e a dependência nova está fora do escopo).
  {
    files: ["components/ds/**/*.{ts,tsx}", "app/entrar/**/*.{ts,tsx}", "app/onboarding/**/*.{ts,tsx}", "app/auth/erro/**/*.{ts,tsx}", "app/termos/**/*.{ts,tsx}", "app/privacidade/**/*.{ts,tsx}", "app/app/layout.tsx"],
    rules: {
      "no-restricted-imports": restrict([[SERVER_CORE_FILE, SERVER_CORE_MESSAGE], [SERVER_CORE_BARREL, SERVER_CORE_MESSAGE], [SERVER_SHELL_FILE, SERVER_SHELL_MESSAGE]])["no-restricted-imports"],
      "no-restricted-syntax": ["error",
        ...restrict([[SERVER_CORE_FILE, SERVER_CORE_MESSAGE], [SERVER_CORE_BARREL, SERVER_CORE_MESSAGE], [SERVER_SHELL_FILE, SERVER_SHELL_MESSAGE]])["no-restricted-syntax"].slice(1),
        ...DS_ADHERENCE,
      ],
    },
  },
  // O teste e as regras de aderência contêm, de propósito, os casos sujos (hex, px, rgb...): só eles ficam fora de DS_ADHERENCE.
  {
    files: ["components/ds/ds-adherence.test.ts", "components/ds/ds-adherence.ts"],
    rules: {
      "no-restricted-syntax": ["error",
        ...restrict([[SERVER_CORE_FILE, SERVER_CORE_MESSAGE], [SERVER_CORE_BARREL, SERVER_CORE_MESSAGE], [SERVER_SHELL_FILE, SERVER_SHELL_MESSAGE]])["no-restricted-syntax"].slice(1),
      ],
    },
  },
]);

export default eslintConfig;
