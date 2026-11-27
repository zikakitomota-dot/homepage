// Renders the cover page of every free printable (the A4 PDF) to a WebP preview image.
// Needs the site running locally (next start -p 3100) and Chrome installed.
// Run: node scripts/capture-printables.mjs   (output: public/images/printables/<slug>.webp)
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const chromePath = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const baseUrl = process.env.PREVIEW_BASE_URL ?? 'http://127.0.0.1:3100';
const downloads = resolve('public/downloads/freebies');
const outDir = resolve('public/images/printables');
const port = 9233;
mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), 'zalea-printables-'));
const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Chrome's PDF viewer at this size draws the page from x 13 to 887 with a 4px top margin.
const viewport = { width: 900, height: 1300 };
const page = { x: 13, y: 4, width: 874, height: Math.round(874 * Math.SQRT2) };

let targets;
for (let i = 0; i < 60 && !targets; i += 1) {
  try { targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); } catch { await sleep(100); }
}
try {
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => { const msg = JSON.parse(event.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } });
  const send = (method, params = {}) => new Promise((r) => { id += 1; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
  await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: false });

  for (const slug of readdirSync(downloads)) {
    const pdf = readdirSync(join(downloads, slug)).find((f) => /_A4(_Final)?\.pdf$/i.test(f));
    if (!pdf) { console.warn(`no A4 PDF for ${slug}`); continue; }
    await send('Page.navigate', { url: `${baseUrl}/downloads/freebies/${slug}/${encodeURIComponent(pdf)}#toolbar=0&view=FitH` });
    await sleep(4000);
    const { result } = await send('Page.captureScreenshot', { format: 'webp', quality: 80, clip: { ...page, scale: 0.7 } });
    writeFileSync(join(outDir, `${slug}.webp`), Buffer.from(result.data, 'base64'));
    console.log(`saved ${slug}.webp`);
  }
  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* Chrome may still hold files briefly */ }
}
