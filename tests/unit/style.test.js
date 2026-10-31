// The look of the page as rules a program can hold (docs/visual-refresh-plan.md, steps 1 and 2): every font the style
// sheet names is in web/fonts/ with its licence, so the app looks the same offline; and every colour pair of the
// tokens passes WCAG 2.2 AA in light and dark (1.4.3 text 4.5:1, 1.4.11 control parts 3:1). The smoke test measures
// the drawn page as well; this one fails before a page is ever drawn, from the token values alone.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { REVIEW_TYPES } from "../../src/domain/stages.js";
import { ICONS, iconSvg } from "../../web/art/icons.js";
import { phasePictureSvg } from "../../web/art/phase-pictures.js";

const WEB = fileURLToPath(new URL("../../web/", import.meta.url));
const css = readFileSync(join(WEB, "style.css"), "utf8");

// the custom properties of a block such as `:root {` (the first one), as { name: value }
function tokens(opening) {
  const start = css.indexOf(opening);
  assert.ok(start >= 0, `style.css has no "${opening}" block`);
  const body = css.slice(start + opening.length, css.indexOf("}", start));
  return Object.fromEntries([...body.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m => [m[1], m[2].trim()]));
}
const LIGHT = tokens(":root {");
const DARK = { ...LIGHT, ...tokens(':root[data-theme="dark"] {') };

// a token's colour as a hex string, following var(--x) aliases
function hex(theme, name) {
  let v = theme[name];
  for (let i = 0; i < 5 && v?.startsWith("var("); i++) v = theme[v.slice(6, -1)];
  assert.match(v ?? "", /^#[0-9a-f]{6}$/i, `--${name} is not a six-digit colour: ${theme[name]}`);
  return v;
}
// WCAG 2.2 relative luminance and contrast ratio (definition in the standard's glossary)
const luminance = h => { const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(c => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

const GROUNDS = ["bg", "surface", "surface-2"];
const TEXTS = ["text", "muted", "faint", "accent", "ok", "warn", "bad", "info", "include", "unsure", "exclude", "plan", "find", "select", "chart", "report"];
// a colour on its own tint, and text on a filled colour
const ON = [["ok", "ok-bg"], ["warn", "warn-bg"], ["bad", "bad-bg"], ["info", "info-bg"], ["include", "include-bg"], ["unsure", "unsure-bg"], ["exclude", "exclude-bg"],
  ["accent", "accent-2"], ["text", "accent-2"], ["text", "mark"], ["accent-ink", "accent"], ["on-status", "ok"], ["on-status", "warn"], ["on-status", "bad"]];
const PARTS = [["field-border", "bg"], ["field-border", "surface"], ["field-border", "surface-2"], ["accent", "bg"], ["accent", "surface"]];

for (const [name, theme] of [["light", LIGHT], ["dark", DARK]]) {
  test(`every text colour reads at 4.5:1 on every surface (${name} theme)`, () => {
    const fails = [];
    for (const t of TEXTS) for (const g of GROUNDS) { const r = ratio(hex(theme, t), hex(theme, g)); if (r < 4.5) fails.push(`--${t} on --${g}: ${r.toFixed(2)}`); }
    for (const [t, g] of ON) { const r = ratio(hex(theme, t), hex(theme, g)); if (r < 4.5) fails.push(`--${t} on --${g}: ${r.toFixed(2)}`); }
    assert.deepEqual(fails, []);
  });
  test(`field edges and focus rings reach 3:1 (${name} theme)`, () => {
    const fails = PARTS.map(([p, g]) => [p, g, ratio(hex(theme, p), hex(theme, g))]).filter(([, , r]) => r < 3).map(([p, g, r]) => `--${p} on --${g}: ${r.toFixed(2)}`);
    assert.deepEqual(fails, []);
  });
}

test("the ratio is the one WCAG defines: black on white is 21:1, a colour on itself 1:1", () => {
  assert.equal(ratio("#000000", "#ffffff").toFixed(1), "21.0");
  assert.equal(ratio("#2340a8", "#2340a8"), 1);
});

test("every font the style sheet loads is in web/fonts/, with the licence of its family", () => {
  const faces = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(m => m[1]);
  assert.ok(faces.length >= 4, "style.css declares the four families with @font-face");
  for (const face of faces) {
    const family = face.match(/font-family:\s*"([^"]+)"/)?.[1];
    const urls = [...face.matchAll(/url\("?([^")]+)"?\)/g)].map(m => m[1]);
    assert.ok(urls.length, `${family}: no url()`);
    for (const u of urls) assert.ok(existsSync(join(WEB, u)), `${family}: ${u} is missing`);
    assert.match(face, /font-display:\s*swap/, `${family}: text shows in the fallback font while the font loads`);
    const licence = join(WEB, "fonts", `OFL-${family.toLowerCase().replace(/ /g, "-")}.txt`);
    assert.ok(existsSync(licence), `${family}: no licence at ${licence}`);
    assert.match(readFileSync(licence, "utf8"), /SIL Open Font License, Version 1\.1/);
  }
});

test("every phase a review type names has its colour, in both themes (the map and the page header use it)", () => {
  const phases = new Set(Object.values(REVIEW_TYPES).flatMap(t => t.steps.map(s => s.phase.toLowerCase())));
  assert.ok(phases.size >= 5, "the scoping review has five phases");
  for (const p of phases) {
    assert.match(css, new RegExp(`\\.phase-${p}\\s*{\\s*--phase:\\s*var\\(--${p}\\)`), `style.css gives .phase-${p} no colour`);
    hex(LIGHT, p); hex(DARK, p);                         // a token in each theme, held to 4.5:1 by the tests above
    assert.ok(TEXTS.includes(p), `--${p} is not in the contrast check`);
  }
});

test("every phase has its picture, with alt text; its labels read at 4.5:1 on its colour and its lines at 3:1", () => {
  const phases = new Set(Object.values(REVIEW_TYPES).flatMap(t => t.steps.map(s => s.phase.toLowerCase())));
  // a colour of the art, with its alpha laid over the picture's background (#rrggbb or #rrggbbaa)
  const over = (c, bg) => { const a = c.length === 9 ? parseInt(c.slice(7), 16) / 255 : 1;
    return "#" + [1, 3, 5].map(i => Math.round(parseInt(c.slice(i, i + 2), 16) * a + parseInt(bg.slice(i, i + 2), 16) * (1 - a)).toString(16).padStart(2, "0")).join(""); };
  const fails = [];
  for (const p of phases) {
    const svg = phasePictureSvg(p);
    assert.match(svg, /role="img" aria-label="[^"]{20,}"/, `${p}: no picture or no alt text`);
    const bg = LIGHT[`${p}-art`];
    assert.match(bg ?? "", /^#[0-9a-f]{6}$/i, `--${p}-art is missing`);
    for (const [ink, min] of [["art-ink", 4.5], ["art-acc", 4.5], ["art-dim", 3]]) { const r = ratio(over(LIGHT[ink], bg), bg); if (r < min) fails.push(`--${ink} on --${p}-art: ${r.toFixed(2)}`); }
    for (const [, fill] of svg.matchAll(/<text [^>]*fill="([^"]+)"/g)) if (fill === "var(--art-dim)") fails.push(`${p}: a label in --art-dim, which is for lines only`);
  }
  assert.deepEqual(fails, []);
});

test("every icon the page asks for is drawn, and the fixed buttons carry no emoji", () => {
  const html = readFileSync(join(WEB, "index.html"), "utf8");
  for (const [, name] of html.matchAll(/data-icon="([^"]+)"/g)) assert.ok(ICONS[name], `index.html asks for the icon "${name}", which web/art/icons.js does not draw`);
  for (const [, label] of html.matchAll(/data-icon="[^"]+"[^>]*>([^<]*<span class="lbl">[^<]*)/g)) assert.doesNotMatch(label, /\p{Extended_Pictographic}/u, label);
  assert.equal(iconSvg("no such icon"), "");
  assert.match(iconSvg("settings"), /aria-hidden="true"/, "an icon stands beside its word: screen readers skip it");
});

test("no font is loaded from another site: the app works offline and asks no third party", () => {
  for (const f of ["style.css", "start.css", "index.html"]) assert.doesNotMatch(readFileSync(join(WEB, f), "utf8"), /fonts\.(googleapis|gstatic)\.com/, f);
});
