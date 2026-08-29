import assert from 'node:assert/strict';
import test from 'node:test';
import {
  detectChangedUrls,
  pageFileToRoute,
  runAutomaticIndexNow,
  runAutomaticIndexNowFailOpen,
} from './lib/indexnow-deployment.mjs';

const manifest = (routes) => ({ version: 1, origin: 'https://zaleastudio.com', routes });
const mockFetch = async (url) => {
  if (String(url) === 'https://zaleastudio.com/sitemap.xml') {
    return new Response(`<?xml version="1.0"?><urlset>
      <url><loc>https://zaleastudio.com/education/grade-calculator</loc></url>
      <url><loc>https://zaleastudio.com/math/ratio-calculator</loc></url>
    </urlset>`, { status: 200, headers: { 'Content-Type': 'application/xml' } });
  }
  return new Response(`<html><head><link rel="canonical" href="${url}"></head><body>Public page</body></html>`, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
};

test('no-change deployment submits zero URLs', async () => {
  let submissions = 0;
  const current = manifest({ '/education/grade-calculator': 'same' });
  const result = await runAutomaticIndexNow({
    previousManifest: current,
    currentManifest: current,
    submitImpl: async () => { submissions += 1; },
    log: () => {},
  });
  assert.equal(submissions, 0);
  assert.deepEqual(result.submitted, []);
});

test('one changed calculator page submits that canonical URL only', async () => {
  const previous = manifest({ '/education/grade-calculator': 'old', '/education/gpa-calculator': 'same' });
  const current = manifest({ '/education/grade-calculator': 'new', '/education/gpa-calculator': 'same' });
  assert.deepEqual(detectChangedUrls(previous, current), ['https://zaleastudio.com/education/grade-calculator']);
  let submitted;
  const result = await runAutomaticIndexNow({
    previousManifest: previous,
    currentManifest: current,
    fetchImpl: mockFetch,
    submitImpl: async (urls) => { submitted = urls; return { status: 200, statusText: 'OK', responseBody: '' }; },
    log: () => {},
  });
  assert.deepEqual(submitted, ['https://zaleastudio.com/education/grade-calculator']);
  assert.deepEqual(result.submitted, submitted);
});

test('multiple changed public pages submit only their URLs without duplicates', async () => {
  const previous = manifest({ '/education/grade-calculator': 'old', '/math/ratio-calculator': 'old', '/about': 'same' });
  const current = manifest({ '/education/grade-calculator': 'new', '/math/ratio-calculator': 'new', '/about': 'same' });
  assert.deepEqual(detectChangedUrls(previous, current), [
    'https://zaleastudio.com/education/grade-calculator',
    'https://zaleastudio.com/math/ratio-calculator',
  ]);
  let submitted;
  await runAutomaticIndexNow({
    previousManifest: previous,
    currentManifest: current,
    fetchImpl: mockFetch,
    submitImpl: async (urls) => { submitted = urls; return { status: 200, statusText: 'OK', responseBody: '' }; },
    log: () => {},
  });
  assert.deepEqual(submitted, [
    'https://zaleastudio.com/education/grade-calculator',
    'https://zaleastudio.com/math/ratio-calculator',
  ]);
});

test('non-public and dynamic files never become direct submission routes', () => {
  assert.equal(pageFileToRoute('app/api/contact/route.ts'), null);
  assert.equal(pageFileToRoute('public/logo.png'), null);
  assert.equal(pageFileToRoute('app/sitemap.ts'), null);
  assert.equal(pageFileToRoute('app/freebies/[slug]/page.tsx'), null);
  assert.equal(pageFileToRoute('app/education/grade-calculator/page.tsx'), '/education/grade-calculator');
});

test('missing prior deployment baseline submits zero URLs', async () => {
  let submissions = 0;
  const result = await runAutomaticIndexNow({
    previousManifest: null,
    currentManifest: manifest({ '/education/grade-calculator': 'new' }),
    submitImpl: async () => { submissions += 1; },
    log: () => {},
  });
  assert.equal(submissions, 0);
  assert.deepEqual(result.submitted, []);
});

test('IndexNow failure is reported without failing the successful deployment', async () => {
  const errors = [];
  const result = await runAutomaticIndexNowFailOpen({
    previousManifest: manifest({ '/education/grade-calculator': 'old' }),
    currentManifest: manifest({ '/education/grade-calculator': 'new' }),
    fetchImpl: mockFetch,
    submitImpl: async () => { throw new Error('HTTP 429 Too Many Requests'); },
    log: () => {},
    errorLog: (message) => errors.push(message),
  });
  assert.equal(result.ok, false);
  assert.match(result.error, /HTTP 429/u);
  assert.match(errors.join('\n'), /production deployment remains successful/u);
});
