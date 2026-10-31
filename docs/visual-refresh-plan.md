# Visual refresh: plan

Status: steps 1–3 (fonts, tokens, type) 4 (journey map and page header), 5 (screening) and 6 (pictures and icons) done on 31 October 2026, screenshots in
[visual-refresh/after-steps-1-3/](visual-refresh/after-steps-1-3/); steps 7–10 still to do. Step 6 drew the five
phase pictures (`web/art/phase-pictures.js`, shown on the start screen) and the icons of the toolbar, the Settings
menu and the start screen (`web/art/icons.js`); emoji inside the pages remain for step 9. Step 5 departs from the
mock-up in one place: the stamp lands on the last-decision line under the record, not on the record, because the next
record replaces it at once and no key may wait for an animation. On a phone the exclusion reasons show only while
one is being chosen. The screenshots (7.5 MB) stay on the author's PC and are not in the repository, so the
picture links below work only there; the mock-up itself is. Mock-up: [visual-refresh/mockup.html](visual-refresh/mockup.html)
(open it with `npm run serve` at http://localhost:8770/docs/visual-refresh/mockup.html; Homepage and Screening, light
and dark). Before screenshots of every page, light, dark and 390 px wide: [visual-refresh/before/](visual-refresh/before/).

## The idea in one paragraph

The Workbench works, but it looks like a default template: Segoe UI, an indigo-to-cyan gradient, emoji for icons and
no colour that means anything beyond ok/warn/bad. Methodical has an identity built from four things that carry over to
a work tool: a type pairing with a job per face, colours that each mean one thing, its own diagram pictures, and
surfaces that feel like objects (cards with a coloured top edge). Its game parts (confetti, shaking, pulsing buttons,
tilting cards) stay in the game. Looks never replace function, Kurosu & Kashimura (1995); Tractinsky et al. (2000):
every step below is tested on the task, not only on the look.

| Mock-up: Homepage | Mock-up: Screening, dark |
|---|---|
| ![Mock-up of the Homepage in light: a hero with a fan of three record cards and five phase cards with drawn pictures](visual-refresh/mockup-home-light.jpg) | ![Mock-up of the screening page in dark: phase-coloured journey map, record card with an "Included" stamp](visual-refresh/mockup-screening-dark.jpg) |

## What to take from Methodical, and what not

| Take | Why it fits a work tool |
|---|---|
| **Fonts with one job each**: Bricolage Grotesque for page titles and big numbers; Barlow Condensed upper case for small labels (phase, type line, metric labels); IBM Plex Sans for reading; IBM Plex Mono for record IDs and keys | Labels look different from content, so a scan finds them; Plex is built for long reading |
| **A colour per meaning**: the five phases (Plan, Find, Select, Chart, Report) and the three decisions (include, unsure, exclude) each get one colour, used everywhere that thing appears, always with its word or shape | Today indigo means "primary button", "current step", "link" and "AI" at once |
| **Its own pictures**: one line-art diagram per phase, drawn by us after Methodical's rules (viewBox 200 × 150, main lines 3, details 2, round caps, one idea per picture) | Replaces emoji (📘 🎓 🤖 🔒), which look different on every system |
| **Tactile surfaces**: a coloured top edge on cards (record, phase, metric), the lab-bench grid on the page background, one soft shadow | Gives each region an edge and a meaning, Wertheimer (1923); Palmer (1992) |
| **Short motion with a purpose**: the next record slides in (0.2 s), a decision "stamp" with its word lands on the record (0.18 s), numbers on the Homepage count up once | Feedback within 0.1 s, Miller (1968); all off under `prefers-reduced-motion`, W3C (2023) 2.3.3 |

| Leave in the game | Why |
|---|---|
| Confetti, shake, win glow, endless pulse (`nudge`, `glow`), the rainbow sheen on the title, endless bobbing cards | Screening 5,000 records needs calm; endless motion pulls the eye from the abstract, Sweller (1988) |
| Hover magnifier, 3D tilt, the full-screen card viewer | The record is text to read, not a card to inspect |
| Card gloss, coins, stars, attribute badges | Decoration that carries no data, Tufte (1983) |
| Big card sizes and generous spacing | The Workbench is dense on purpose: queue, criteria and record on one screen |

## Tokens and fonts, in one place

Replaces the `:root` and `[data-theme="dark"]` blocks of `web/style.css`. Names keep the existing ones where the
meaning stays (`--accent`, `--muted`, `--border` …), so pages need no change for step 2.

| Token | Light | Dark | Meaning |
|---|---|---|---|
| `--bg` / `--grid` | #EEF1F4 / 6 % cobalt | #0E131A / 5 % slate | page, with a 24 px grid |
| `--surface` / `--surface-2` | #FFFFFF / #F5F7FA | #161D27 / #1C2531 | cards / insets |
| `--text` / `--muted` | #141922 / #596273 | #E5E9EF / #98A2B1 | |
| `--border` / `--field-border` | #D5DBE3 / #7C8599 | #2A3441 / #646E88 | |
| `--accent` | #2340A8 (cobalt) | #8AA6FF | the one primary action, links, focus |
| `--include` · `--unsure` · `--exclude` | #047857 · #8A6500 · #9F1239 | #34D399 · #E8BC4A · #FB7185 | decisions, always with ✓ ? ✕ and the word |
| `--plan` · `--find` · `--select` · `--chart` · `--report` | #2340A8 · #0C4A6E · #6D28D9 · #9A3412 · #4D4D33 | #8AA6FF · #7DD3FC · #C4B5FD · #FDBA74 · #D9D6B4 | the five phases, always with the phase name |
| `--plan-art` … `--report-art` | the light phase colours, in both themes | | picture boxes, light line art on top |

`--ok`, `--warn`, `--bad` become aliases of the decision colours, so nothing breaks; `--info` stays for messages.

Contrast, computed from the hex values (WCAG relative luminance) on `--bg`, `--surface` and `--surface-2`: text 12.7–17.6;
muted 5.4–7.2; accent 6.6–8.9; decisions 4.7–10.4 (lowest: unsure on `--bg` in light, 4.70); phases 6.3–12.6; white
on include 5.5, on exclude 8.0, on accent 8.9. All pass 4.5:1, W3C (2023) 1.4.3. One catch: `--field-border` must be
#7C8599 or darker, because the old #858EA3 gives only 2.90:1 on the new `--bg` (1.4.11 needs 3:1).

| Face | Weights | Used for | Fallback |
|---|---|---|---|
| Bricolage Grotesque | 700, 800 | h1, Homepage title, metric numbers | Segoe UI |
| Barlow Condensed | 600, 700 | labels in capitals: phase, type line, metric labels, panel headings | Arial Narrow |
| IBM Plex Sans | 400, 600, italic 400 | everything else, abstracts at 15.5 px / 1.7 | Segoe UI |
| IBM Plex Mono | 500 | record IDs, `kbd`, search strings | Consolas |

## Page by page

Before pictures are in `visual-refresh/before/` as `<page>-light.jpg`, `-dark.jpg` and `-phone.jpg`.

| Page | Now (before) | Proposed |
|---|---|---|
| **Toolbar and journey map** (all pages) | [screening](visual-refresh/before/06-screening-light.jpg): grey chips; at 390 px the toolbar takes four lines and 180 px before the title ([phone](visual-refresh/before/06-screening-phone.jpg)) | Phase segments with a coloured top edge and their name; at < 720 px the toolbar keeps icons with names for screen readers and folds rare items into ⚙, one line high |
| **Page header** | [questions](visual-refresh/before/00-questions-light.jpg): title, status pill, description | A kicker "SELECT · STEP 7 OF 9" in the phase colour above a Bricolage title; metrics with Bricolage numbers and Barlow labels |
| **Homepage** | [home](visual-refresh/before/home-light.jpg): a filled indigo "Continue" card next to a filled "My review" button (two primaries, Shneiderman et al. (2016)) | Hero with a fan of three record cards (dealt once, no endless motion), live counts, one primary button; five phase cards with drawn pictures and the state of each phase; the circle demo, folder pictures and tour stay below |
| **Start screen** | [start](visual-refresh/before/start-screen-light.jpg): gradient title, emoji feature cards | Same hero as the Homepage; feature cards get small drawn icons instead of 🔒 🧭 🤖 |
| **Screening** (titles and abstracts, full texts) | [screening](visual-refresh/before/06-screening-light.jpg), [full texts](visual-refresh/before/08-screening-light.jpg); at 390 px the decision bar covers most of the record | Record as a card: violet top edge, type line in capitals, ID in mono, Plex abstract; decision buttons in their decision colour with ✓ ? ✕; a stamp with the word on decision, next record slides in; at < 720 px a one-line decision bar without key hints |
| **Search & import** | [searches](visual-refresh/before/05-searches-light.jpg) | Find colour; database names as labels; counts in the display face |
| **Get full texts** | [retrieval](visual-refresh/before/07-retrieval-light.jpg) | Status pills in decision colours with words; the PDF icon drawn, not emoji |
| **Chart the data** | [charting](visual-refresh/before/09-charting-light.jpg) | Chart colour; field names as Barlow labels above each field; the paper list as small record cards |
| **Report** | [report](visual-refresh/before/10-report-light.jpg): the flow diagram in indigo and green | Flow diagram boxes with the phase colour on their edge, "Included" in the include colour; counts in Plex Mono; the chart rules stay (position and length, labelled), Cleveland & McGill (1984) |
| **Plan pages** (questions, concepts, protocol, methods, registration) | [concepts](visual-refresh/before/01-concepts-light.jpg), [protocol](visual-refresh/before/02-protocol-light.jpg) | Plan colour on card edges (now three different colours on the PCC cards); Population, Concept and Context keep their three tints, from the Plan family |

## Order of work

Each step is one commit, small enough to check, and ends with `npm test`, `npm run check` and `npm run smoke` (the
smoke test already measures contrast, target size and reflow in light, dark and at 400 px on every page), plus a look
in the browser pane in light, dark, by keyboard and at phone width.

1. **Fonts, self-hosted.** Latin subsets of the four families as `.woff2` in `web/fonts/` with their licences
   (all four are believed to be SIL Open Font Licence: check each `OFL.txt` before adding), `@font-face` with
   `font-display: swap` in `style.css`. `scripts/precache-list.js` walks `web/`, so the offline copy takes them
   without change. Test: a unit test that every `url()` in `style.css` exists and every font has its licence file.
   About 250 kB. Needs your yes to download the fonts.
2. **Tokens.** The new palette, phase and decision tokens, old names as aliases. Test: a unit test that reads the
   token blocks of `style.css` and computes every text-on-surface pair against 4.5:1 and every control part against
   3:1, in light and dark (a fitness function, Ford et al. (2017)); the smoke test's floor check on top.
3. **Type.** Apply the faces: h1, metrics, labels, IDs, `kbd`. No layout change.
4. **Journey map and page header.** Phase colours and kicker, in `shell/journey-map.js` and `shell/chrome.js`; the
   phase of a stage comes from the snapshot, never from a colour list in the page.
5. **Screening.** Record card, decision colours, stamp and slide, reduced motion respected; the one-line decision bar
   on phones. Smoke: a decision still lands and the focus stays visible above the bar.
6. **Pictures.** `web/art/phase-pictures.js` (SVG text, no imports, like `folder-pictures.js`), shown through a
   `studio/ui` component, so the architecture check needs no new rule. Drawn icons replace emoji in the toolbar and
   feature cards, each next to its word.
7. **Homepage and start screen.** Hero, card fan, counts, phase cards; one primary button.
8. **Phone toolbar.** One line below 720 px.
9. **Other pages.** Search, full texts, charting, report, plan pages, in that order.
10. **README and audit.** Re-record the README animation and the light and dark screenshots; a UI audit of the
    result in `docs/ui-audit-<date>.md`.

Steps 1–3 change the look everywhere at once and can ship alone. Steps 4–9 are independent of each other.

## Risks

- **Fonts offline.** Fonts from Google would break the offline app and send a request on every visit. Self-hosting
  (step 1) avoids both; the system fallbacks keep it readable until the fonts load.
- **Contrast in both themes.** The table above is computed, not looked at; step 2 makes it a test. Translucent tints
  (`color-mix`) are measured by the smoke test, which blends layers.
- **Colour as the only signal.** Phase and decision colours always come with their word or shape, W3C (2023) 1.4.1.
- **Motion.** Nothing loops; every animation stops under `prefers-reduced-motion`, W3C (2023) 2.3.3.
- **Architecture check.** New pictures go in the `art` layer, which pages reach only through `studio/ui`; new CSS
  needs nothing from the check. `npm run check` after each step.
- **Speed.** The stamp and slide must not delay the next record: the next decision key works at once, the animation
  only decorates. Screening stays at the ~40 ms per click measured on the full review.
- **The README pictures** go out of date at step 3 (house rule: re-record when the look changes). Step 10 covers it.
- **The site is public.** Pushing to `main` publishes the new look on GitHub Pages; nothing here touches research
  content.

## Seen in passing (outside this plan)

- At 390 px the sticky decision bar covers most of the record ([phone](visual-refresh/before/06-screening-phone.jpg)):
  usable but cramped; step 5 fixes it.
- The Homepage shows two filled primary buttons at once (Continue, My review); step 7 fixes it.
