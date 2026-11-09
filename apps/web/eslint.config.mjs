import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const SERVER_CORE_FILE = "(^|/)(nvidia-chat|nvidia-client|generate-version|coherence|structure-evidence)(\.[cm]?[jt]s)?$";
const SERVER_CORE_BARREL = "(^|/)lib/live(/index(\.[cm]?[jt]s)?)?$";
const SERVER_CORE_MESSAGE = "Núcleo do LLM é só de servidor: importe-o apenas de lib/live/**, lib/score/coherence.ts, lib/score/analyze-coherence.ts, lib/groq/structure-evidence.ts, lib/groq/structure-evidence-server.ts ou app/app/live/actions.ts, nunca de componente ou código cliente.";

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
  {
    rules: {
      "no-restricted-imports": ["error", { patterns: [
        { regex: SERVER_CORE_FILE, message: SERVER_CORE_MESSAGE },
        { regex: SERVER_CORE_BARREL, message: SERVER_CORE_MESSAGE },
      ] }],
      "no-restricted-syntax": ["error",
        ...["ImportExpression > Literal.source", "CallExpression[callee.name='require'] > Literal.arguments:first-child"].flatMap((where) => [SERVER_CORE_FILE, SERVER_CORE_BARREL].map((re) => ({
          selector: `${where}[value=/${re.replaceAll("/", "[/]")}/]`,
          message: SERVER_CORE_MESSAGE,
        }))),
      ],
    },
  },
  { files: ["lib/live/**", "lib/score/coherence.ts", "lib/score/coherence.test.ts", "lib/score/analyze-coherence.ts", "lib/groq/structure-evidence.ts", "lib/groq/structure-evidence.test.ts", "lib/groq/structure-evidence-server.ts", "app/app/live/actions.ts"], rules: { "no-restricted-imports": "off", "no-restricted-syntax": "off" } },
]);

export default eslintConfig;
