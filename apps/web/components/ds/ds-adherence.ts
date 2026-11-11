// Regras de aderência do CSS do DS (de docs/redesign/design-system/_adherence.oxlintrc.json), em função pura
// para o teste rodar sobre os arquivos reais e sobre casos sujos. Fora de declaração de token (--x: ...) não vale
// cor literal (hex, rgb(), hsl() e afins, nome), medida literal (px, pt...), font abreviado nem
// peso/altura/espaçamento de letra em número ou palavra (bold).
export type CssViolation = { line: number; rule: string; text: string };

const NAMED = [
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black", "blanchedalmond", "blue", "blueviolet", "brown",
  "burlywood", "cadetblue", "chartreuse", "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue", "darkcyan",
  "darkgoldenrod", "darkgray", "darkgrey", "darkgreen", "darkkhaki", "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred",
  "darksalmon", "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise", "darkviolet", "deeppink", "deepskyblue",
  "dimgray", "dimgrey", "dodgerblue", "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite", "gold", "goldenrod",
  "gray", "grey", "green", "greenyellow", "honeydew", "hotpink", "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush",
  "lawngreen", "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow", "lightgray", "lightgrey", "lightgreen",
  "lightpink", "lightsalmon", "lightseagreen", "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow", "lime",
  "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue", "mediumorchid", "mediumpurple", "mediumseagreen",
  "mediumslateblue", "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue", "mintcream", "mistyrose", "moccasin",
  "navajowhite", "navy", "oldlace", "olive", "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen", "paleturquoise",
  "palevioletred", "papayawhip", "peachpuff", "peru", "pink", "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown",
  "royalblue", "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver", "skyblue", "slateblue", "slategray",
  "slategrey", "snow", "springgreen", "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet", "wheat", "white", "whitesmoke",
  "yellow", "yellowgreen",
];
const NAMED_RE = new RegExp("(^|[^\\w-])(" + NAMED.join("|") + ")(?![\\w-])", "i");
const FN_COLOR = /\b(rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\(/i;
const HEX = /(#|%23)[0-9a-f]{3,8}\b/i;
const PX = /\b\d+(\.\d+)?px\b/i;
// Outras unidades absolutas (pt, pc, cm, mm, in, Q) também são medida literal fora dos tokens.
const UNIT = /\b\d+(\.\d+)?(pt|pc|cm|mm|in|q)\b/i;
// Escape CSS (\70x escreve "px"): hexa depois de barra invertida, fora de string.
const ESCAPE = /\\[0-9a-f]{1,6}/i;
const PX_CONCAT = /["'`]\s*px\b|\$\{[^}]*\}\s*px\b/i;
const STRINGS = /"[^"]*"|'[^']*'/g;

export function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

export function cssViolations(source: string): CssViolation[] {
  const out: CssViolation[] = [];
  const lines = stripComments(source).split(/\r?\n/);
  lines.forEach((text, i) => {
    const line = i + 1;
    const add = (rule: string) => out.push({ line, rule, text: text.trim() });
    const isToken = /^\s*--[\w-]+\s*:/.test(text);
    if (HEX.test(text)) add("hex");
    if (isToken) return; // a camada de tokens é a única origem de cor, medida e tipografia
    if (FN_COLOR.test(text)) add("cor-funcional");
    if (PX.test(text) || PX_CONCAT.test(text) || UNIT.test(text)) add("px");
    if (ESCAPE.test(text.replace(STRINGS, " "))) add("escape");
    // Declarações por trecho (; { }): pega também CSS minificado numa linha só (.a{color:red;font-weight:bold}).
    for (const seg of text.split(/[;{}]/)) {
      const decl = /^\s*([a-z-]+)\s*:\s*(.+?)\s*$/i.exec(seg);
      if (!decl || decl[1].startsWith("--")) continue;
      const prop = decl[1].toLowerCase();
      const value = decl[2].replace(/var\([^)]*\)/gi, " ").replace(STRINGS, " ");
      if (prop === "font") add("font-abreviado");
      if (prop === "font-family" && !/^var\(--ds-font-|^['"]?(Inter|Plus Jakarta Sans)/i.test(decl[2])) add("font-family");
      if (prop === "font-weight" && /[\da-z]/i.test(value)) add("font-weight-literal");
      if (prop === "line-height" && /\d/.test(value)) add("line-height-literal");
      if (prop === "letter-spacing" && /[1-9]/.test(value)) add("letter-spacing-literal");
      if (NAMED_RE.test(value)) add("cor-nomeada");
    }
  });
  return out;
}
