import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const chromePath = process.env.CHROME_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.QA_BASE_URL ?? 'http://127.0.0.1:3100';
const outputDir = resolve(process.env.QA_OUTPUT_DIR ?? 'qa/learning-missions');
const profile = mkdtempSync(join(tmpdir(), 'zalea-missions-chrome-'));
mkdirSync(outputDir, { recursive: true });

const chrome = spawn(chromePath, ['--headless=new', '--disable-gpu', '--no-first-run', '--remote-debugging-port=9223', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });

const sleep = (ms) => new Promise((resolvePromise) => setTimeout(resolvePromise, ms));
async function waitForJson(path) {
  let lastError;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try { const response = await fetch(`http://127.0.0.1:9223${path}`); if (response.ok) return response.json(); } catch (error) { lastError = error; }
    await sleep(100);
  }
  throw lastError ?? new Error('Chrome DevTools endpoint did not start.');
}

class Cdp {
  constructor(url) {
    this.ws = new WebSocket(url);
    this.id = 0;
    this.pending = new Map();
    this.events = new Map();
  }
  async open() {
    await new Promise((resolvePromise, reject) => { this.ws.addEventListener('open', resolvePromise, { once: true }); this.ws.addEventListener('error', reject, { once: true }); });
    this.ws.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (message.id) { const pending = this.pending.get(message.id); this.pending.delete(message.id); message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result); }
      else { const listeners = this.events.get(message.method) ?? []; this.events.delete(message.method); listeners.forEach((listener) => listener(message.params)); }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolvePromise, reject) => { this.pending.set(id, { resolve: resolvePromise, reject }); this.ws.send(JSON.stringify({ id, method, params })); });
  }
  once(method) { return new Promise((resolvePromise) => this.events.set(method, [...(this.events.get(method) ?? []), resolvePromise])); }
  async evaluate(expression) { return (await this.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result.value; }
  close() { this.ws.close(); }
}

async function newPage(url) {
  const response = await fetch(`http://127.0.0.1:9223/json/new?${encodeURIComponent(url)}`, { method: 'PUT' });
  const page = await response.json();
  const cdp = new Cdp(page.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  return cdp;
}

async function navigate(cdp, path) {
  const loaded = cdp.once('Page.loadEventFired');
  await cdp.send('Page.navigate', { url: `${baseUrl}${path}` });
  await loaded;
  await sleep(350);
}

async function screenshot(cdp, name, width, height) {
  await cdp.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 600 });
  await navigate(cdp, '/games/missions');
  const overflow = await cdp.evaluate('document.documentElement.scrollWidth > document.documentElement.clientWidth');
  assert.equal(overflow, false, `${width}px layout overflows horizontally`);
  const { data } = await cdp.send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  writeFileSync(join(outputDir, `missions-${width}.png`), Buffer.from(data, 'base64'));
}

const emptyJourney = { version: 2, updatedAt: '2026-10-25T00:00:00.000Z', games: {}, achievements: [], recordedSessions: [], missionEvidence: [] };

try {
  await waitForJson('/json/version');
  const first = await newPage(`${baseUrl}/games/missions/maths-explorer`);
  await first.evaluate(`localStorage.setItem('zalea-learning-journey-v1', ${JSON.stringify(JSON.stringify(emptyJourney))}); location.reload()`);
  await sleep(600);
  assert.match(await first.evaluate('document.body.innerText'), /not started/i);
  assert.equal(await first.evaluate(`[...document.querySelectorAll('button')].some(button => button.textContent.includes('I finished my worksheet'))`), true);
  await first.evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('I finished my worksheet')).click()`);
  await sleep(300);
  assert.match(await first.evaluate('document.body.innerText'), /1 of 3 activities completed/);
  await navigate(first, '/games/missions/maths-explorer');
  assert.match(await first.evaluate('document.body.innerText'), /1 of 3 activities completed/);

  const second = await newPage(`${baseUrl}/games/missions/maths-explorer`);
  await sleep(400);
  assert.match(await second.evaluate('document.body.innerText'), /1 of 3 activities completed/);
  await second.evaluate(`[...document.querySelectorAll('button')].find(button => button.textContent.includes('Undo completion')).click()`);
  await sleep(400);
  assert.match(await first.evaluate('document.body.innerText'), /0 of 3 activities completed/);

  const completed = { ...emptyJourney, updatedAt: '2026-10-25T00:03:00.000Z', missionEvidence: [{ id: 'maths-explorer:worksheet', completedAt: '2026-10-25T00:03:00.000Z' }], games: {
    'addition-level-1': { gameId: 'addition-level-1', subjectId: 'mathematics', sessionCount: 1, completedSessionCount: 1, totalCorrectAnswers: 8, totalQuestionsAttempted: 10, personalBest: { correct: 8, questions: 10, percentage: 80 }, lastPlayedAt: '2026-10-25T00:01:00.000Z', firstCompletedAt: '2026-10-25T00:01:00.000Z' },
    'subtraction-level-1': { gameId: 'subtraction-level-1', subjectId: 'mathematics', sessionCount: 1, completedSessionCount: 1, totalCorrectAnswers: 7, totalQuestionsAttempted: 10, personalBest: { correct: 7, questions: 10, percentage: 70 }, lastPlayedAt: '2026-10-25T00:02:00.000Z', firstCompletedAt: '2026-10-25T00:02:00.000Z' },
  } };
  await first.evaluate(`localStorage.setItem('zalea-learning-journey-v1', ${JSON.stringify(JSON.stringify(completed))}); window.dispatchEvent(new CustomEvent('zalea-learning-journey-changed'))`);
  await sleep(400);
  const completedText = await first.evaluate('document.body.innerText');
  assert.match(completedText, /Mission Completed/);
  assert.match(completedText, /Maths Explorer/);
  assert.match(completedText, /October 25, 2026/);

  for (const width of [320, 375, 768, 1440]) await screenshot(first, `missions-${width}`, width, 1000);
  first.close(); second.close();
  console.log(`Learning Missions browser QA passed. Screenshots: ${outputDir}`);
} finally {
  chrome.kill();
  await sleep(200);
  try { rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 }); } catch { /* Chrome may briefly retain profile files on Windows. */ }
}
