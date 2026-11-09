import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

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
  // AG2-3: o núcleo do adaptador NVIDIA não tem "server-only" (precisa rodar em node --test); só o servidor pode importá-lo.
  {
    rules: {
      "no-restricted-imports": ["error", { patterns: [{
        regex: "(^|/)(nvidia-chat|generate-version)(\.ts)?$",
        message: "Núcleo do Live é só de servidor: importe-o apenas de lib/live/** ou de app/app/live/actions.ts, nunca de componente ou código cliente.",
      }] }],
    },
  },
  { files: ["lib/live/**", "app/app/live/actions.ts"], rules: { "no-restricted-imports": "off" } },
]);

export default eslintConfig;
