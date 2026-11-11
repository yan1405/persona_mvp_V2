import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

// Aderência do CSS do DS (app/ds.css e a galeria): o ESLint cobre os TSX de components/ds/**; aqui o CSS.
// Regras (de docs/redesign/design-system/_adherence.oxlintrc.json): sem hex, sem px fora de declaração de token
// (custom property), fontes só Inter / Plus Jakarta Sans (via var(--ds-font-*)).
const FILES = ["../../app/ds.css", "../../app/dev/ds/gallery.css"];

function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "");
}

for (const rel of FILES) {
  const css = stripComments(readFileSync(new URL(rel, import.meta.url), "utf8"));
  const lines = css.split(/\r?\n/);

  test(rel + ": nenhum hexadecimal literal", () => {
    const hits = lines.map((l, i) => [i + 1, l] as const).filter(([, l]) => /#[0-9a-fA-F]{3,8}\b/.test(l));
    assert.deepEqual(hits, []);
  });

  test(rel + ": px só em declaração de custom property (token)", () => {
    const hits = lines.map((l, i) => [i + 1, l] as const).filter(([, l]) => /\b\d+(\.\d+)?px\b/.test(l) && !/^\s*--[\w-]+\s*:/.test(l));
    assert.deepEqual(hits, []);
  });

  test(rel + ": font-family só por var(--ds-font-*) ou Inter / Plus Jakarta Sans", () => {
    const hits = lines
      .map((l, i) => [i + 1, l] as const)
      .filter(([, l]) => /font-family\s*:/.test(l) && !/font-family\s*:\s*(var\(--ds-font-|['"]?(Inter|Plus Jakarta Sans))/.test(l));
    assert.deepEqual(hits, []);
  });
}
