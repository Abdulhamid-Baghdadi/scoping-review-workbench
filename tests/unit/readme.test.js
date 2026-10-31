// The README shows the program (the design rules' readme.md): every picture it links to exists and has alt text
// (WCAG 1.1.1), and an animation that starts by itself stops within 5 s (WCAG 2.2.2). Made by scripts/readme-screenshot.js.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const readme = readFileSync(join(ROOT, "README.md"), "utf8");

// every picture: ![alt](src), <img src alt>, and the dark version <source srcset> (whose <img> carries the alt text)
const pictures = [
  ...[...readme.matchAll(/!\[([^\]]*)\]\(([^)\s]+)\)/g)].map(m => ({ src: m[2], alt: m[1] })),
  ...[...readme.matchAll(/<img\b[^>]*>/g)].map(m => ({ src: m[0].match(/src="([^"]+)"/)?.[1], alt: m[0].match(/alt="([^"]*)"/)?.[1] })),
  ...[...readme.matchAll(/<source\b[^>]*srcset="([^"]+)"/g)].map(m => ({ src: m[1], source: true })),
].filter(p => !/^https?:/.test(p.src ?? ""));

/** A GIF's total running time in seconds, and whether it loops (a NETSCAPE2.0 block). */
function gifTiming(buf) {
  let cs = 0;
  for (let i = 0; i < buf.length - 5; i++) if (buf[i] === 0x21 && buf[i + 1] === 0xf9 && buf[i + 2] === 0x04) cs += buf[i + 4] | (buf[i + 5] << 8);
  return { seconds: cs / 100, loops: buf.includes(Buffer.from("NETSCAPE2.0")) };
}

test("the README shows the program: pictures and an animation", () => {
  assert.ok(pictures.length >= 4, "an animation and screenshots");
  assert.ok(pictures.some(p => p.src.endsWith(".gif")), "an animation of the main task");
  assert.ok(pictures.some(p => /dark/.test(p.src)), "the light and the dark theme");
});

test("every picture the README shows is there and has alt text", () => {
  for (const p of pictures) {
    assert.ok(existsSync(join(ROOT, p.src)), `${p.src} is missing: run node scripts/readme-screenshot.js`);
    if (!p.source) assert.ok((p.alt ?? "").trim().length >= 15, `${p.src}: alt text says what the picture shows`);
  }
});

test("the animation stops by itself within 5 seconds", () => {
  for (const p of pictures.filter(x => x.src.endsWith(".gif"))) {
    const { seconds, loops } = gifTiming(readFileSync(join(ROOT, p.src)));
    assert.equal(loops, false, `${p.src} loops; make it play once (ffmpeg -loop -1)`);
    assert.ok(seconds > 0 && seconds <= 5, `${p.src} runs ${seconds} s`);
  }
});
