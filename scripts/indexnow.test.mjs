import assert from 'node:assert/strict';
import test from 'node:test';
import {
  INDEXNOW_ENDPOINT,
  INDEXNOW_HOST,
  INDEXNOW_KEY,
  INDEXNOW_KEY_LOCATION,
  createIndexNowPayload,
  normalizeIndexNowUrls,
  parseSitemapUrls,
  submitIndexNowUrls,
  validateIndexNowKey,
} from './lib/indexnow.mjs';

test('the generated key matches the official character and length rules', () => {
  assert.equal(validateIndexNowKey(), INDEXNOW_KEY);
  assert.match(INDEXNOW_KEY, /^[A-Za-z0-9-]{8,128}$/);
});

test('sitemap parsing keeps unique canonical Zalea Studio URLs', () => {
  const urls = parseSitemapUrls(`<?xml version="1.0"?><urlset>
    <url><loc>https://zaleastudio.com/</loc></url>
    <url><loc>https://zaleastudio.com/freebies</loc></url>
    <url><loc>https://zaleastudio.com/freebies</loc></url>
  </urlset>`);
  assert.deepEqual(urls, ['https://zaleastudio.com/', 'https://zaleastudio.com/freebies']);
});

test('external, query-string and fragment URLs are rejected', () => {
  assert.throws(() => normalizeIndexNowUrls(['https://payhip.com/ZaleaStudio']), /must belong/);
  assert.throws(() => normalizeIndexNowUrls(['https://www.zaleastudio.com/']), /must belong/);
  assert.throws(() => normalizeIndexNowUrls(['https://zaleastudio.com/shop?ref=test']), /canonical URL/);
  assert.throws(() => normalizeIndexNowUrls(['https://zaleastudio.com/shop#products']), /canonical URL/);
});

test('the bulk payload follows the official JSON format', () => {
  const payload = createIndexNowPayload(['https://zaleastudio.com/', 'https://zaleastudio.com/freebies']);
  assert.deepEqual(payload, {
    host: INDEXNOW_HOST,
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: ['https://zaleastudio.com/', 'https://zaleastudio.com/freebies'],
  });
});

test('submission uses the IndexNow endpoint and JSON content type', async () => {
  let request;
  const fetchImpl = async (url, init) => {
    request = { url, init };
    return new Response('', { status: 202, statusText: 'Accepted' });
  };
  const result = await submitIndexNowUrls(['https://zaleastudio.com/freebies'], { fetchImpl });
  assert.equal(request.url, INDEXNOW_ENDPOINT);
  assert.equal(request.init.method, 'POST');
  assert.equal(request.init.headers['Content-Type'], 'application/json; charset=utf-8');
  assert.deepEqual(JSON.parse(request.init.body).urlList, ['https://zaleastudio.com/freebies']);
  assert.deepEqual(result, { count: 1, status: 202, statusText: 'Accepted', responseBody: '' });
});
