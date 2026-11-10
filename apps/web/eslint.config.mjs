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
const DS_ADHERENCE = [
  ...["Literal[value", "TemplateElement[value.raw"].map((n) => ({ selector: n + "=/" + HEX + "/]", message: "Cor hexadecimal literal: use um token do DS (var(--ds-*)) em app/ds.css." })),
  ...["Literal[value", "TemplateElement[value.raw"].map((n) => ({ selector: n + "=/" + PX + "/]", message: "Valor em px literal: use tokens de medida do DS (var(--ds-*)) ou números do React." })),
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
  // DS-6: aderência ao Design System (traduzida de docs/redesign/design-system/_adherence.oxlintrc.json) SÓ em components/ds/**:
  // sem hex, sem px literal (use tokens --ds-* via classes dx-* em app/ds.css) e fontes só Inter / Plus Jakarta Sans.
  // Este bloco repete a barreira do núcleo do LLM acima, porque no flat config a regra mais recente substitui a anterior para os mesmos arquivos.
  // O CSS (app/ds.css) é coberto por components/ds/ds-adherence.test.ts (não há plugin de CSS no ESLint e a dependência nova está fora do escopo).
  {
    files: ["components/ds/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": restrict([[SERVER_CORE_FILE, SERVER_CORE_MESSAGE], [SERVER_CORE_BARREL, SERVER_CORE_MESSAGE], [SERVER_SHELL_FILE, SERVER_SHELL_MESSAGE]])["no-restricted-imports"],
      "no-restricted-syntax": ["error",
        ...restrict([[SERVER_CORE_FILE, SERVER_CORE_MESSAGE], [SERVER_CORE_BARREL, SERVER_CORE_MESSAGE], [SERVER_SHELL_FILE, SERVER_SHELL_MESSAGE]])["no-restricted-syntax"].slice(1),
        ...DS_ADHERENCE,
      ],
    },
  },
]);

export default eslintConfig;
