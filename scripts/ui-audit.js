// The measured part of a UI audit (docs/ui-audit-<date>.md), where npm run smoke does not go: the accessibility floor
// of tests/smoke/a11y.mjs on every page of the example at 320 px, with each AI card open, with the Help drawer and the
// Settings menu open, on the Homepage and the start screen, in light and dark; and motion: with reduced motion asked
// for, the card fan and the decision stamp do not move. Starts its own server; exits 1 if anything is found.
//   node scripts/ui-audit.js        (Playwright is a devDependency: npm install)
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { audit, narrow } from "../tests/smoke/a11y.mjs";

const ROOT = resolve(import.meta.dirname, "..");
const PORT = 8890 + Math.floor(Math.random() * 100);
const server = spawn(process.execPath, [resolve(ROOT, "scripts/serve.js"), String(PORT)], { stdio: ["ignore", "pipe", "inherit"] });
await new Promise(ok => server.stdout.once("data", ok));

const browser = await chromium.launch();
const found = [], errors = [];

/** The finished example in a fresh browser (reset each time it is opened); `opts` go to the browser context. */
async function openExample(opts = {}) {
  const page = await (await browser.newContext({ serviceWorkers: "block", viewport: { width: 1400, height: 900 }, ...opts })).newPage();
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", e => errors.push(e.message));
  // Headless Chromium's private storage refuses some non-ASCII file names that Chrome on Windows accepts (as in the smoke test)
  await page.route("**/example/example-review.json", async route => {
    const ex = await (await route.fetch()).json();
    const ascii = obj => Object.fromEntries(Object.entries(obj ?? {}).map(([k, v]) => [k.replace(/[^\x20-\x7e]/g, "-"), v]));
    await route.fulfill({ json: { ...ex, files: ascii(ex.files), binary: ascii(ex.binary), linked: ascii(ex.linked) } });
  });
  await page.goto(`http://localhost:${PORT}/web/#example`);
  await page.waitForFunction(() => window.backend?.entry?.example && document.querySelector("#page")?.innerText.length > 200);
  await page.keyboard.press("Escape");                     // a first-visit tour, if one is offered
  return page;
}

try {
  const page = await openExample();
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });   // measure the end colours
  const here = () => page.evaluate(() => location.hash + (document.querySelector("#page")?.innerText.slice(0, 120) ?? ""));
  const floor = async name => {
    for (const t of ["light", "dark"]) {
      await page.evaluate(v => { document.documentElement.dataset.theme = v; }, t); await page.waitForTimeout(40);
      for (const f of await page.evaluate(audit)) found.push(`${name} [${t}] ${f}`);
    }
    await page.evaluate(() => { document.documentElement.dataset.theme = "light"; });
    await page.setViewportSize({ width: 320, height: 800 }); await page.waitForTimeout(250);
    for (const f of await page.evaluate(narrow)) found.push(`${name} [320px] ${f}`);
    await page.setViewportSize({ width: 1400, height: 900 }); await page.waitForTimeout(80);
  };

  for (let i = 0, last = ""; i < 80; i++) {                // back to the first page
    await page.keyboard.press("Alt+ArrowUp"); await page.waitForTimeout(50);
    const w = await here(); if (w === last) break; last = w;
  }
  let pages = 0;
  for (let i = 0, last = ""; i < 40; i++) {                // then every page, and its AI card open
    const w = await here(); if (w === last) break; last = w; pages++;
    const name = await page.evaluate(() => location.hash);
    await floor(name);
    if (await page.locator(".ai-chip").count()) {
      await page.locator(".ai-chip").click(); await page.waitForTimeout(150); await floor(`${name} with its AI card`);
      await page.locator(".ai-chip").click(); await page.waitForTimeout(100);
    }
    await page.keyboard.press("Alt+ArrowDown"); await page.waitForTimeout(120);
  }
  await page.keyboard.press("?"); await page.waitForTimeout(250); await floor("Help drawer"); await page.keyboard.press("Escape");
  await page.locator("#btnHome").click(); await page.waitForTimeout(900); await floor("#home");
  await page.locator("#btnSettings").click(); await page.waitForTimeout(150); await floor("Settings menu"); await page.keyboard.press("Escape");
  await page.evaluate(async () => { document.getElementById("app").hidden = true; const m = await import("./start/start-screen.js"); await m.showStartScreen(); });
  await page.waitForTimeout(400); await floor("start screen");

  // motion (WCAG 2.3.3): with reduced motion asked for, the decision stamp and the Homepage's card fan stand still
  const calm = await openExample({ reducedMotion: "reduce" });
  await calm.locator(".fmc-count", { hasText: "Titles" }).click(); await calm.waitForTimeout(400);
  await calm.locator(".seg button", { hasText: "All" }).click(); await calm.waitForTimeout(300);
  await calm.locator("body").click({ position: { x: 5, y: 600 } }); await calm.keyboard.press("i"); await calm.waitForTimeout(300);
  const stamp = await calm.evaluate(() => getComputedStyle(document.querySelector(".last-decision .stamp-word")).animationName);
  await calm.locator("#btnHome").click(); await calm.waitForTimeout(600);
  const fan = await calm.evaluate(() => [...document.querySelectorAll(".fan-card")].map(e => getComputedStyle(e).animationName));
  if (stamp !== "none") found.push(`reduced motion: the decision stamp still animates (${stamp})`);
  if (fan.some(a => a !== "none")) found.push(`reduced motion: the Homepage's card fan still animates (${fan.join(", ")})`);

  console.log(`${pages} pages, each light, dark and 320 px, with their AI cards; the Help drawer, Settings menu, Homepage and start screen; reduced motion`);
  console.log(found.length ? `${found.length} finding(s):\n${found.join("\n")}` : "accessibility floor and motion: ok");
  console.log(errors.length ? `console errors:\n${errors.join("\n")}` : "no console errors");
} finally {
  await browser.close();
  server.kill();
}
process.exitCode = found.length || errors.length ? 1 : 0;
