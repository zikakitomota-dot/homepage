// Captures real screenshots of Zalea tools and games for use on the homepage and hub pages.
// Needs the production build running locally (next start -p 3100) and Chrome installed.
// Run: node scripts/capture-previews.mjs   (output: public/images/previews/*.webp)
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const chromePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.PREVIEW_BASE_URL ?? 'http://127.0.0.1:3100';
const outDir = resolve('public/images/previews');
const port = 9231;
mkdirSync(outDir, { recursive: true });
const profile = mkdtempSync(join(tmpdir(), 'zalea-previews-'));
const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function json(path) {
  for (let i = 0; i < 60; i += 1) {
    try { const res = await fetch(`http://127.0.0.1:${port}${path}`); if (res.ok) return res.json(); } catch { /* not up yet */ }
    await sleep(100);
  }
  throw new Error('Chrome did not start');
}

const shots = [
  { name: 'work-hours-calculator', url: '/work-time/work-hours-calculator', find: 'document.querySelectorAll("main > section")[1]', maxHeight: 760 },
  { name: 'unit-price-calculator', url: '/finance/unit-price-calculator', find: 'document.querySelectorAll("main > section")[1]', maxHeight: 760 },
  { name: 'percentage-calculator', url: '/math/percentage-calculator', find: 'document.querySelectorAll("main > section")[1]', maxHeight: 760 },
  { name: 'grade-calculator', url: '/education/grade-calculator', find: 'document.querySelectorAll("main > section")[1]', maxHeight: 760 },
  { name: 'worksheet', url: '/worksheets', find: 'document.querySelector(".worksheet-page")', maxHeight: 640 },
  { name: 'memory-match', url: '/games/logic/memory-match', click: ['Start matching'], after: 'Array.from(document.querySelectorAll("main button[aria-label]")).slice(0,2).forEach((b)=>b.click())', find: 'document.querySelector("main > div")', maxHeight: 760 },
  { name: 'continent-explorer', url: '/games/geography/continent-explorer', click: ['Start Exploring'], find: 'document.querySelectorAll("main > section")[1]', maxHeight: 760 },
];

try {
  const target = (await json('/json/list')).find((t) => t.type === 'page');
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => { const msg = JSON.parse(event.data); if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); } });
  const send = (method, params = {}) => new Promise((r) => { id += 1; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
  const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;

  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 1000, deviceScaleFactor: 1, mobile: false });
  for (const shot of shots) {
    await send('Page.navigate', { url: baseUrl + shot.url });
    await sleep(2500);
    await evaluate('localStorage.removeItem("zalea-theme"); document.documentElement.removeAttribute("data-theme"); document.querySelector("[data-cookie-banner], .cookie-banner")?.remove(); const s = document.createElement("style"); s.textContent = ".zalea-header{display:none!important}"; document.head.append(s); true');
    for (const text of shot.click ?? []) {
      await evaluate(`(Array.from(document.querySelectorAll("button")).find((b) => b.textContent.trim().startsWith(${JSON.stringify(text)}))?.click(), true)`);
      await sleep(1200);
    }
    if (shot.after) { await evaluate(`(${shot.after}, true)`); await sleep(900); }
    const rect = await evaluate(`(() => { const el = ${shot.find}; el.scrollIntoView({ block: 'start' }); const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })()`);
    await sleep(600);
    const clip = { x: Math.max(0, rect.x), y: rect.y, width: Math.min(rect.width, 1280), height: Math.min(rect.height, shot.maxHeight), scale: 1 };
    const { result } = await send('Page.captureScreenshot', { format: 'webp', quality: 82, clip, captureBeyondViewport: true });
    writeFileSync(join(outDir, `${shot.name}.webp`), Buffer.from(result.data, 'base64'));
    console.log(`saved ${shot.name}.webp ${Math.round(clip.width)}x${Math.round(clip.height)}`);
  }
  ws.close();
} finally {
  chrome.kill();
  await sleep(300);
  try { rmSync(profile, { recursive: true, force: true }); } catch { /* Chrome may still hold files briefly */ }
}
