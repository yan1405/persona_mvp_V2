import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { Linter } from "eslint";
import { cssViolations } from "./ds-adherence.ts";

// Aderência do Design System (docs/redesign/design-system/_adherence.oxlintrc.json): todo CSS de app/** e
// components/**, exceto a galeria, passa por cssViolations; todo TS/TSX dessas árvores passa pelo ESLint
// (DS_ADHERENCE em eslint.config.mjs).
// Cada regra tem caso sujo abaixo: se um dia a regra deixar de pegar, o teste falha.
const FILES = ["../../app/ds.css", "../../app/globals.css"];

for (const rel of FILES) {
  test(rel + ": sem cor literal, px, font abreviado nem tipografia em número fora dos tokens", () => {
    assert.deepEqual(cssViolations(readFileSync(new URL(rel, import.meta.url), "utf8")), []);
  });
}

const DIRTY_CSS: Array<[string, string]> = [
  ["hex", ".a {\n  color: #fff;\n}"],
  ["hex", ".a {\n  background: url(\"data:image/svg+xml,%3Csvg fill='%23ff0000'/%3E\");\n}"],
  ["cor-funcional", ".a {\n  color: rgb(1 2 3);\n}"],
  ["cor-funcional", ".a {\n  color: rgba(1, 2, 3, 0.5);\n}"],
  ["cor-funcional", ".a {\n  color: hsl(10 20% 30%);\n}"],
  ["cor-funcional", ".a {\n  color: oklch(50% 0.1 20);\n}"],
  ["cor-nomeada", ".a {\n  color: red;\n}"],
  ["cor-nomeada", ".a {\n  border: var(--ds-bw) solid rebeccapurple;\n}"],
  ["px", ".a {\n  margin: 12px;\n}"],
  ["px", ".a {\n  margin: 12PX;\n}"],
  ["px", ".a {\n  --x: 1;\n  margin: calc(var(--y) + 4px);\n}"],
  ["font-abreviado", ".a {\n  font: 600 14px/1.4 Inter;\n}"],
  ["font-family", ".a {\n  font-family: Arial, sans-serif;\n}"],
  ["font-weight-literal", ".a {\n  font-weight: 600;\n}"],
  ["line-height-literal", ".a {\n  line-height: 1.4;\n}"],
  ["letter-spacing-literal", ".a {\n  letter-spacing: -0.02em;\n}"],
  // C9-8: lacunas apontadas pela Verificação (a versão anterior deixava passar estas)
  ["cor-nomeada", ".a{color:red}"],
  ["font-family", ".a{font-family:Arial,sans-serif}"],
  ["font-weight-literal", ".a{font-weight:700;color:var(--x)}"],
  ["font-weight-literal", ".a {\n  font-weight: bold;\n}"],
  ["line-height-literal", ".a{line-height:1.4}"],
  ["letter-spacing-literal", ".a{letter-spacing:-.02em}"],
  ["px", ".a {\n  margin: 12pt;\n}"],
  ["px", ".a {\n  margin: 3mm;\n}"],
  ["escape", ".a {\n  margin: 12\\70x;\n}"],
];

for (const [rule, css] of DIRTY_CSS) {
  test("caso sujo de CSS pego: " + rule + " — " + css.replace(/\s*\n\s*/g, " "), () => {
    assert.ok(cssViolations(css).some((v) => v.rule === rule), "regra " + rule + " não pegou");
  });
}

test("CSS limpo não gera falso positivo (token, var, transparent, selectores com nome de cor)", () => {
  const clean = [
    ":root {",
    "  --hex: #fff;",
    "  --a: rgb(1 2 3);",
    "  --b: 12px;",
    "  --c: 600;",
    "}",
    ".dx-avatar--green .dx-x:hover:not(:disabled) {",
    "  color: var(--ds-text-strong);",
    "  background: transparent;",
    "  font-family: var(--ds-font-body);",
    "  font-weight: var(--ds-fw-semibold);",
    "  line-height: var(--ds-lh-140);",
    "  letter-spacing: 0;",
    "  content: \"red\";",
    "}",
  ].join("\n");
  assert.deepEqual(cssViolations(clean), []);
});

const eslintConfigPath = "../../eslint.config.mjs";
const DIRTY_TSX = [
  'const a = "#fff";',
  "const a = `#ABC123`;",
  'const a = "rgb(1 2 3)";',
  'const a = "RGBA(1,2,3,.5)";',
  'const a = "hsl(10 20% 30%)";',
  'const a = "12px";',
  'const a = "12PX";',
  'const a = n + "px";',
  "const a = `${n}px`;",
  'const a = "font-family: Arial";',
  // C9-8
  'const a = { color: "red" };',
  'const a = { backgroundColor: "RebeccaPurple" };',
  "const a = { width: 12 };",
  "const a = { marginTop: -8 };",
  'const a = { fontFamily: "Arial" };',
  "const a = { fontWeight: 600 };",
  'const a = { fontWeight: "bold" };',
  "const a = { lineHeight: 1.4 };",
  'const a = { letterSpacing: "-0.02em" };',
];

test("ESLint do DS pega cada caso sujo de TSX e deixa o código limpo passar", async () => {
  const mod = (await import(eslintConfigPath)) as { DS_ADHERENCE: Array<{ selector: string; message: string }> };
  const linter = new Linter({ configType: "flat" });
  const cfg = [{ rules: { "no-restricted-syntax": ["error", ...mod.DS_ADHERENCE] as never } }];
  const missed = DIRTY_TSX.filter((code) => linter.verify(code, cfg, "x.js").length === 0);
  assert.deepEqual(missed, []);
  for (const clean of ['const a = "var(--ds-text-strong)";', "const a = { width: 0 };", 'const a = { fontWeight: "var(--ds-fw-bold)" };', 'const a = { color: "var(--ds-text-strong)" };', 'const a = "dx-card dx-card--sm";']) {
    assert.deepEqual(linter.verify(clean, cfg, "x.js"), [], clean);
  }
});
