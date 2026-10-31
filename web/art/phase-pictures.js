/**
 * The five phases of a review as pictures (SVG text, no imports): a diagram of each phase's idea, drawn by us after
 * the rules of the SMART-Lab Science Game Kit's card art (Methodical, tools/art.py): a 200 × 150 box in the phase's
 * deep colour, light line art on it, main lines 3 wide and details 2, round caps and joins, one idea per picture.
 * The colours are CSS tokens (style.css: --plan-art …, --art-ink, --art-dim, --art-acc), the same in both themes.
 * @module web/art/phase-pictures
 */

// ink and accent carry the labels (4.5:1 on every phase colour); dim is for lines only (3:1), never for text
const I = "var(--art-ink)", D = "var(--art-dim)", A = "var(--art-acc)";
const line = (d, c = I, w = 3) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const label = (x, y, s, c = I, size = 14) =>
  `<text x="${x}" y="${y}" fill="${c}" font-size="${size}" text-anchor="middle" font-family="Barlow Condensed, Arial Narrow, sans-serif" font-weight="700" letter-spacing=".6">${s}</text>`;
const box = (x, y, w, h, c = I, sw = 2.5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="none" stroke="${c}" stroke-width="${sw}"/>`;

/** Each phase: what the picture shows (its alt text) and the drawing. Keys are the phases of the review's steps, in lower case. */
export const PHASE_PICTURES = {
  plan: ["Three overlapping circles, Population, Concept and Context: the question sits where they meet",
    `<circle cx="80" cy="60" r="34" fill="none" stroke="${I}" stroke-width="3"/><circle cx="120" cy="60" r="34" fill="none" stroke="${I}" stroke-width="3"/>
     <circle cx="100" cy="94" r="34" fill="none" stroke="${A}" stroke-width="3"/><circle cx="100" cy="73" r="5" fill="${A}"/>
     ${label(64, 55, "P")}${label(136, 55, "C")}${label(100, 120, "C", A)}`],
  find: ["Three databases pour their records into one funnel",
    `${[40, 100, 160].map(x => `<ellipse cx="${x}" cy="26" rx="20" ry="6" fill="none" stroke="${I}" stroke-width="3"/>${line(`M${x - 20} 26v20a20 6 0 0 0 40 0V26`)}`).join("")}
     ${line("M40 58l10 10M100 58v10M160 58l-10 10", D, 2)}${line("M30 72h140l-50 34v22l-40 12v-34z")}${label(100, 94, "RECORDS", A, 13)}`],
  select: ["A stack of papers sorted into two piles: included and excluded",
    `${[0, 1, 2].map(i => `<rect x="${78 + i * 3}" y="${18 + i * 4}" width="44" height="56" rx="5" fill="var(--select-art)" stroke="${I}" stroke-width="2.5"/>`).join("")}
     ${line("M88 40h26M88 48h26M88 56h18", D, 2)}${line("M100 84v10M100 94L52 110M100 94l48 16", D, 2)}
     ${box(28, 110, 48, 28, I, 3)}${line("M42 124l6 6 12-12", A)}${box(124, 110, 48, 28, D, 3)}${line("M140 117l16 14M156 117l-16 14", D)}`],
  chart: ["A table with one row per paper and one column per data item",
    `${box(30, 22, 140, 106, I, 3)}${line("M30 44h140M76 22v106M124 22v106", I, 2)}
     ${[62, 84, 106].map(y => line(`M40 ${y}h26M86 ${y}h${y === 84 ? 30 : 20}M134 ${y}h${y === 62 ? 26 : 16}`, y === 84 ? A : D, 4)).join("")}`],
  report: ["A flow diagram: records found, full texts read, papers included, and those excluded",
    `${box(26, 16, 78, 24)}${box(26, 62, 78, 24)}${box(26, 108, 78, 28, A, 3)}${box(120, 62, 66, 24, D)}
     ${line("M65 40v22M65 86v22M104 74h16", I, 2)}
     ${label(65, 33, "FOUND", I, 12)}${label(65, 79, "READ", I, 12)}${label(65, 127, "INCLUDED", A, 13)}${label(153, 79, "EXCLUDED", I, 11)}`],
};

/** One phase's picture as an <svg> with its alt text; "" for a phase without one. */
export function phasePictureSvg(phase) {
  const p = PHASE_PICTURES[String(phase).toLowerCase()];
  if (!p) return "";
  const [alt, art] = p;
  return `<svg class="phase-pic" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${alt}">`
    + `<rect width="200" height="150" fill="var(--${String(phase).toLowerCase()}-art)"/>${art}</svg>`;
}
