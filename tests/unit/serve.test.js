// The development server (scripts/serve.js) answers only this computer: at http://localhost and http://127.0.0.1,
// the addresses the launchers open, and not at the computer's address on the network, where anyone on the same
// Wi-Fi could reach it. Right result by definition: the loopback address 127.0.0.1 is this computer alone.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { networkInterfaces } from "node:os";
import { fileURLToPath } from "node:url";

const SERVE = fileURLToPath(new URL("../../scripts/serve.js", import.meta.url));

test("the server answers this computer only", async (t) => {
  const port = 9100 + Math.floor(Math.random() * 400);
  const server = spawn(process.execPath, [SERVE, String(port)], { stdio: ["ignore", "pipe", "inherit"] });
  t.after(() => server.kill());
  await new Promise(ok => server.stdout.once("data", ok));
  const get = host => fetch(`http://${host}:${port}/web/`, { signal: AbortSignal.timeout(3000) });

  assert.equal((await get("127.0.0.1")).status, 200);
  assert.equal((await get("localhost")).status, 200);

  const outside = Object.values(networkInterfaces()).flat().find(a => a.family === "IPv4" && !a.internal);
  if (!outside) { t.diagnostic("no network address on this computer: the outside half is not tried"); return; }
  await assert.rejects(get(outside.address), `the server answered at ${outside.address}, its address on the network`);
});
