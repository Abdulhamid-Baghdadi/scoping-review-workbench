// Makes the README's pictures in docs/readme/ from the program itself, with made-up example papers (nothing here
// comes from a real review), in a fresh headless Chromium whose private storage holds the draft review:
//   screening.gif                         the main task: three records decided by keyboard (under 5 s, plays once)
//   screening-light.png, -dark.png        the screening page
//   home-light.png, home-dark.png         the Homepage
//   tour.png                              the app tour at its step about the steps
//   npm run serve   (in another terminal)   then   node scripts/readme-screenshot.js
// Needs Playwright (a devDependency: npm install) and ffmpeg on the PATH for the GIF (winget install Gyan.FFmpeg).
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium } from "playwright";

const URL = "http://localhost:8770/web/";
const OUT = resolve(import.meta.dirname, "..", "docs", "readme");
const [W, H] = [1280, 800];

// made-up papers: nothing here comes from a real review
const DEMO = async () => {
  const s = window.backend.session;
  await s.saveQuestions({ population: "Small household electrical appliances", concept: "Design for repair and disassembly methods",
    context: "Engineering design research, any year", main: "Which design methods improve the repairability of small household appliances?",
    sub: ["Which repair steps do the methods address?", "How were the methods evaluated?"] });
  await s.saveConcepts([{ name: "Repair", terms: ["repair*", "disassembl*", "maintainab*"] },
    { name: "Appliances", terms: ["appliance*", "household product*", "consumer electronic*"] },
    { name: "Design", terms: ["design method*", "design guideline*", "design for"] }]);
  for (const k of ["questions", "concepts", "queries", "protocol", "methods"]) await s.setStageStatus(k, "done");
  await s.lockProtocol("OSF");
  const papers = [
    ["Design for disassembly of small kitchen appliances: a scoring method", "Vermeer, L.; Okafor, C.", 2023, "Journal of Cleaner Production",
      "Small kitchen appliances are rarely repaired because fasteners, adhesives and sealed housings make disassembly slow. We propose a disassembly scoring method that rates each component by tool use, steps and reversibility, and apply it to twelve kettles, toasters and blenders. Designs with snap-fit housings and standard screws scored up to three times better. The method was validated in workshops with repair café volunteers, who found faults 40% faster on high-scoring products."],
    ["Repairability indices for consumer electronics: a comparison", "Moreau, A.; Lindqvist, P.", 2022, "Resources, Conservation and Recycling",
      "Several repairability indices are now used in policy. We compare five of them on twenty consumer electronic products and discuss which product features each index rewards."],
    ["Battery chemistry trends in grid storage", "Lindgren, E.", 2024, "Energy Storage Materials",
      "A review of lithium-ion and sodium-ion chemistries for stationary grid storage, with cost and lifetime projections to 2035."],
    ["Consumer motivations for repairing household products", "Nakamura, Y.", 2020, "Sustainable Production and Consumption",
      "A survey of 1,200 consumers on why they repair or replace household products."],
    ["Disassembly sequence planning with graph models for appliances", "Ruiz, M.; Chen, W.", 2024, "Computers in Industry",
      "Graph-based disassembly sequence planning applied to washing machine control boards and small appliances."],
    ["Repair cafés as a source of design feedback", "Ahmed, F.; de Vries, J.", 2023, "Journal of Industrial Ecology",
      "Repair logs from 30 repair cafés show which product features block repairs most often, and how designers could use them."],
  ];
  const ris = papers.map(([t, a, y, j, ab]) => `TY  - JOUR\nTI  - ${t}\n${a.split("; ").map(x => "AU  - " + x).join("\n")}\nPY  - ${y}\nJO  - ${j}\nAB  - ${ab}\nER  - `).join("\n") + "\n";
  await s.importSearch({ fileName: "scopus.ris", bytes: new TextEncoder().encode(ris), database: "Scopus", query: "TITLE-ABS-KEY(repair* AND appliance*)" }, { force: true });
  await s.decide("R0002", "ta", "include");
  await s.decide("R0004", "ta", "exclude", { reason: "E1" });
  await s.decide("R0005", "ta", "include");
};

const browser = await chromium.launch();
const video = mkdtempSync(join(tmpdir(), "readme-video-"));
try {
  mkdirSync(OUT, { recursive: true });
  const context = await browser.newContext({ serviceWorkers: "block", viewport: { width: W, height: H }, recordVideo: { dir: video, size: { width: W, height: H } } });
  const page = await context.newPage(), born = Date.now();
  const theme = t => page.evaluate(v => { document.documentElement.dataset.theme = v; }, t).then(() => page.waitForTimeout(400));
  const quiet = () => page.evaluate(() => { document.querySelectorAll("#toasts > div").forEach(d => d.replaceChildren()); document.querySelector("#offer")?.replaceChildren(); });
  const save = async name => { await quiet(); await page.screenshot({ path: join(OUT, name) }); console.log(`saved docs/readme/${name}`); };

  await page.goto(URL);
  await page.waitForFunction(() => Boolean(window.backend?.session));
  await page.evaluate(DEMO);
  await page.goto("about:blank"); await page.goto(URL + "#screening");   // a real reload
  await page.waitForSelector("#page .rec"); await page.waitForTimeout(900);   // the abstract loads after the page
  await quiet();

  // the animation: three records of the To do queue decided by keyboard, the stamp and the next record each time
  await page.locator("#page .rec").click({ position: { x: 5, y: 5 } });     // keys go to the page, not a field
  const start = (Date.now() - born) / 1000;
  await page.waitForTimeout(500); await page.keyboard.press("i");
  await page.waitForTimeout(1300); await page.keyboard.press("e");
  await page.waitForTimeout(500); await page.keyboard.press("1");
  await page.waitForTimeout(1300); await page.keyboard.press("u");
  await page.waitForTimeout(1100);
  const length = (Date.now() - born) / 1000 - start;

  // the stills: the queue opened on every record, in both themes
  await page.locator(".seg button", { hasText: "All" }).click(); await page.waitForTimeout(300);
  await page.locator(".qitem", { hasText: "R0001" }).click(); await page.waitForTimeout(700);
  for (const t of ["light", "dark"]) { await theme(t); await save(`screening-${t}.png`); }
  await theme("light");
  await page.locator("#btnHome").click(); await page.waitForTimeout(1200);  // its numbers count up
  for (const t of ["light", "dark"]) { await theme(t); await save(`home-${t}.png`); }
  await theme("light");
  await page.locator("#page .btn", { hasText: "Take the 1-minute tour" }).click(); await page.waitForTimeout(700);
  await page.locator(".tour-card button", { hasText: "Next" }).click(); await page.waitForTimeout(700);   // the highlight moves into place
  await save("tour.png");
  await context.close();                                                     // writes the video

  const webm = join(video, readdirSync(video).find(f => f.endsWith(".webm")));
  const gif = spawnSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", start.toFixed(2), "-t", Math.min(length, 4.9).toFixed(2), "-i", webm,
    // below the toolbar and the map; small: few frames, few colours, no dither (it would multiply the page's grid),
    // and each frame stores only what changed
    "-vf", "crop=1280:690:0:110,fps=6,scale=760:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=48:stats_mode=diff[p];[b][p]paletteuse=dither=none:diff_mode=rectangle",
    "-loop", "-1", join(OUT, "screening.gif")], { stdio: "inherit" });                // -loop -1: plays once, then stays (WCAG 2.2.2)
  if (gif.error) throw new Error("ffmpeg not found: install it (winget install Gyan.FFmpeg) or put it on the PATH, then run this again");
  if (gif.status) throw new Error(`ffmpeg failed (exit ${gif.status})`);
  console.log(`saved docs/readme/screening.gif (${Math.min(length, 4.9).toFixed(1)} s, plays once)`);
} finally {
  await browser.close();
  rmSync(video, { recursive: true, force: true });
}
