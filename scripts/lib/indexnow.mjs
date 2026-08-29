export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';
export const INDEXNOW_ORIGIN = 'https://zaleastudio.com';
export const INDEXNOW_HOST = 'zaleastudio.com';
export const INDEXNOW_KEY = 'c7e3cbc8412d9fc7c656069a70729e4682e0b72b9163cdac57982c831fded78e';
export const INDEXNOW_KEY_LOCATION = `${INDEXNOW_ORIGIN}/${INDEXNOW_KEY}.txt`;
export const INDEXNOW_SITEMAP = `${INDEXNOW_ORIGIN}/sitemap.xml`;
export const INDEXNOW_MAX_URLS = 10_000;

const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;

export function validateIndexNowKey(key = INDEXNOW_KEY) {
  if (!KEY_PATTERN.test(key)) {
    throw new Error('The IndexNow key must contain 8–128 letters, numbers or hyphens.');
  }
  return key;
}

export function normalizeIndexNowUrls(urls) {
  if (!Array.isArray(urls)) throw new TypeError('IndexNow URLs must be provided as an array.');

  const uniqueUrls = [];
  const seen = new Set();

  for (const value of urls) {
    if (typeof value !== 'string' || !value.trim()) throw new Error('IndexNow URLs must be non-empty strings.');

    let url;
    try {
      url = new URL(value.trim());
    } catch {
      throw new Error(`Invalid IndexNow URL: ${value}`);
    }

    if (url.origin !== INDEXNOW_ORIGIN || url.hostname !== INDEXNOW_HOST) {
      throw new Error(`IndexNow URL must belong to ${INDEXNOW_ORIGIN}: ${value}`);
    }
    if (url.username || url.password || url.search || url.hash) {
      throw new Error(`IndexNow URL must be a canonical URL without credentials, a query string or fragment: ${value}`);
    }

    const canonicalUrl = url.href;
    if (!seen.has(canonicalUrl)) {
      seen.add(canonicalUrl);
      uniqueUrls.push(canonicalUrl);
    }
  }

  if (!uniqueUrls.length) throw new Error('At least one IndexNow URL is required.');
  if (uniqueUrls.length > INDEXNOW_MAX_URLS) {
    throw new Error(`IndexNow accepts at most ${INDEXNOW_MAX_URLS.toLocaleString()} URLs per request.`);
  }

  return uniqueUrls;
}

function decodeXmlText(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'");
}

export function parseSitemapUrls(xml) {
  if (typeof xml !== 'string' || !xml.trim()) throw new Error('The sitemap response is empty.');
  const urls = [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/giu)].map((match) => decodeXmlText(match[1].trim()));
  if (!urls.length) throw new Error('No <loc> URLs were found in the sitemap.');
  return normalizeIndexNowUrls(urls);
}

export async function fetchSitemapUrls({ fetchImpl = globalThis.fetch, sitemapUrl = INDEXNOW_SITEMAP } = {}) {
  if (typeof fetchImpl !== 'function') throw new Error('A Fetch-compatible implementation is required.');
  const sitemap = new URL(sitemapUrl);
  if (sitemap.origin !== INDEXNOW_ORIGIN || sitemap.pathname !== '/sitemap.xml') {
    throw new Error(`The sitemap must be the canonical ${INDEXNOW_SITEMAP} URL.`);
  }

  const response = await fetchImpl(sitemap, {
    headers: { Accept: 'application/xml, text/xml;q=0.9, */*;q=0.1' },
  });
  if (!response.ok) throw new Error(`Could not read the sitemap: HTTP ${response.status} ${response.statusText}`);
  return parseSitemapUrls(await response.text());
}

export function createIndexNowPayload(urls, { key = INDEXNOW_KEY } = {}) {
  validateIndexNowKey(key);
  return {
    host: INDEXNOW_HOST,
    key,
    keyLocation: `${INDEXNOW_ORIGIN}/${key}.txt`,
    urlList: normalizeIndexNowUrls(urls),
  };
}

export async function submitIndexNowUrls(urls, { fetchImpl = globalThis.fetch, key = INDEXNOW_KEY } = {}) {
  if (typeof fetchImpl !== 'function') throw new Error('A Fetch-compatible implementation is required.');
  const payload = createIndexNowPayload(urls, { key });
  const response = await fetchImpl(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  const responseBody = await response.text();
  if (!response.ok) {
    const detail = responseBody.trim() ? `: ${responseBody.trim().slice(0, 500)}` : '';
    throw new Error(`IndexNow rejected ${payload.urlList.length} URLs with HTTP ${response.status} ${response.statusText}${detail}`);
  }

  return {
    count: payload.urlList.length,
    status: response.status,
    statusText: response.statusText,
    responseBody,
  };
}
