import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';
import {
  INDEXNOW_ORIGIN,
  INDEXNOW_SITEMAP,
  parseSitemapUrls,
  submitIndexNowUrls,
} from './indexnow.mjs';

export const INDEXNOW_DEPLOYMENT_MANIFEST_PATH = '/.well-known/zalea-indexnow-deployment.json';
export const INDEXNOW_DEPLOYMENT_MANIFEST_URL = `${INDEXNOW_ORIGIN}${INDEXNOW_DEPLOYMENT_MANIFEST_PATH}`;

const execFileAsync = promisify(execFile);
const sourceExtensions = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'];
const ignoredDependencies = [
  /^components\/ui\//u,
  /^components\/site-header\.[jt]sx?$/u,
  /^components\/site-footer\.[jt]sx?$/u,
];

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function isIgnoredDependency(relativePath) {
  return ignoredDependencies.some((pattern) => pattern.test(relativePath));
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(absolutePath));
    else files.push(absolutePath);
  }
  return files;
}

export function pageFileToRoute(relativePath) {
  const normalized = relativePath.replaceAll('\\', '/');
  if (!normalized.startsWith('app/') || !normalized.endsWith('/page.tsx')) return null;
  if (normalized.includes('/api/') || normalized.includes('[') || normalized.includes('(')) return null;
  const route = normalized.slice('app'.length, -'/page.tsx'.length);
  return route || '/';
}

async function resolveLocalImport(projectRoot, importerPath, specifier) {
  if (!specifier.startsWith('.') && !specifier.startsWith('@/')) return null;
  const unresolved = specifier.startsWith('@/')
    ? path.join(projectRoot, specifier.slice(2))
    : path.resolve(path.dirname(importerPath), specifier);
  const candidates = [
    unresolved,
    ...sourceExtensions.map((extension) => `${unresolved}${extension}`),
    ...sourceExtensions.map((extension) => path.join(unresolved, `index${extension}`)),
  ];
  for (const candidate of candidates) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // Try the next supported local source candidate.
    }
  }
  return null;
}

function localImportSpecifiers(source) {
  const specifiers = new Set();
  const patterns = [
    /(?:import|export)\s+(?:[^'"]+?\s+from\s+)?['"]([^'"]+)['"]/gu,
    /import\(\s*['"]([^'"]+)['"]\s*\)/gu,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) specifiers.add(match[1]);
  }
  return [...specifiers];
}

async function collectRouteSources(projectRoot, entryPath, visited = new Set()) {
  const absolutePath = path.resolve(entryPath);
  const relativePath = toPosix(path.relative(projectRoot, absolutePath));
  if (visited.has(relativePath) || (relativePath !== toPosix(path.relative(projectRoot, entryPath)) && isIgnoredDependency(relativePath))) {
    return visited;
  }
  visited.add(relativePath);
  const source = await readFile(absolutePath, 'utf8');
  for (const specifier of localImportSpecifiers(source)) {
    const dependency = await resolveLocalImport(projectRoot, absolutePath, specifier);
    if (!dependency) continue;
    const dependencyRelativePath = toPosix(path.relative(projectRoot, dependency));
    if (isIgnoredDependency(dependencyRelativePath)) continue;
    await collectRouteSources(projectRoot, dependency, visited);
  }
  return visited;
}

async function fingerprintFiles(projectRoot, relativePaths) {
  const hash = createHash('sha256');
  for (const relativePath of [...relativePaths].sort()) {
    hash.update(relativePath);
    hash.update('\0');
    hash.update(await readFile(path.join(projectRoot, relativePath)));
    hash.update('\0');
  }
  return hash.digest('hex');
}

async function currentRevision(projectRoot) {
  for (const name of ['GITHUB_SHA', 'CF_PAGES_COMMIT_SHA']) {
    if (process.env[name]?.trim()) return process.env[name].trim();
  }
  try {
    const { stdout } = await execFileAsync('git', ['rev-parse', 'HEAD'], { cwd: projectRoot });
    return stdout.trim();
  } catch {
    return null;
  }
}

export async function createDeploymentManifest({ projectRoot, generatedAt = new Date().toISOString() }) {
  const appDirectory = path.join(projectRoot, 'app');
  const pageFiles = (await listFiles(appDirectory)).filter((file) => file.endsWith(`${path.sep}page.tsx`));
  const routes = {};
  const dynamicRoutes = {};
  const skippedDynamicRoutes = [];
  for (const pageFile of pageFiles) {
    const relativePath = toPosix(path.relative(projectRoot, pageFile));
    const route = pageFileToRoute(relativePath);
    if (!route) {
      if (relativePath.includes('[')) {
        skippedDynamicRoutes.push(relativePath);
        dynamicRoutes[relativePath] = await fingerprintFiles(projectRoot, await collectRouteSources(projectRoot, pageFile));
      }
      continue;
    }
    const sources = await collectRouteSources(projectRoot, pageFile);
    routes[route] = await fingerprintFiles(projectRoot, sources);
  }
  return {
    version: 1,
    origin: INDEXNOW_ORIGIN,
    generatedAt,
    revision: await currentRevision(projectRoot),
    routes,
    dynamicRoutes,
    skippedDynamicRoutes: skippedDynamicRoutes.sort(),
  };
}

export function detectChangedUrls(previousManifest, currentManifest) {
  if (!previousManifest || previousManifest.version !== 1) return [];
  if (previousManifest.origin !== currentManifest.origin || currentManifest.origin !== INDEXNOW_ORIGIN) return [];
  const urls = [];
  for (const [route, fingerprint] of Object.entries(currentManifest.routes ?? {})) {
    if (previousManifest.routes?.[route] !== fingerprint) urls.push(new URL(route, INDEXNOW_ORIGIN).href);
  }
  return [...new Set(urls)].sort();
}

function tagAttributes(tag) {
  const attributes = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(['"])(.*?)\2/gu)) attributes[match[1].toLowerCase()] = match[3];
  return attributes;
}

function canonicalFromHtml(html) {
  for (const match of html.matchAll(/<link\b[^>]*>/giu)) {
    const attributes = tagAttributes(match[0]);
    if ((attributes.rel ?? '').toLowerCase().split(/\s+/u).includes('canonical')) return attributes.href ?? null;
  }
  return null;
}

function hasNoIndex(html) {
  for (const match of html.matchAll(/<meta\b[^>]*>/giu)) {
    const attributes = tagAttributes(match[0]);
    if (!['robots', 'googlebot', 'bingbot'].includes((attributes.name ?? '').toLowerCase())) continue;
    if ((attributes.content ?? '').toLowerCase().split(/[\s,]+/u).includes('noindex')) return true;
  }
  return false;
}

export async function validateChangedUrls(urls, { fetchImpl = globalThis.fetch } = {}) {
  if (!urls.length) return { urls: [], skipped: [] };
  const sitemapResponse = await fetchImpl(INDEXNOW_SITEMAP, { headers: { Accept: 'application/xml, text/xml;q=0.9' } });
  if (!sitemapResponse.ok) throw new Error(`Could not validate changed URLs against the live sitemap: HTTP ${sitemapResponse.status} ${sitemapResponse.statusText}`);
  const sitemapUrls = new Set(parseSitemapUrls(await sitemapResponse.text()));
  const accepted = [];
  const skipped = [];
  for (const url of [...new Set(urls)]) {
    if (!sitemapUrls.has(url)) {
      skipped.push({ url, reason: 'not present in the live canonical sitemap' });
      continue;
    }
    const response = await fetchImpl(url, { redirect: 'manual', headers: { Accept: 'text/html' } });
    const contentType = response.headers.get('content-type') ?? '';
    if (!response.ok || !contentType.toLowerCase().includes('text/html')) {
      skipped.push({ url, reason: `live page returned HTTP ${response.status} ${response.statusText || ''}`.trim() });
      continue;
    }
    const html = await response.text();
    const canonical = canonicalFromHtml(html);
    if (!canonical || new URL(canonical, url).href !== url) {
      skipped.push({ url, reason: 'live canonical link does not match the candidate URL' });
      continue;
    }
    if (hasNoIndex(html)) {
      skipped.push({ url, reason: 'live page declares noindex' });
      continue;
    }
    accepted.push(url);
  }
  return { urls: accepted, skipped };
}

export async function runAutomaticIndexNow({
  previousManifest,
  currentManifest,
  fetchImpl = globalThis.fetch,
  submitImpl = submitIndexNowUrls,
  log = console.log,
  errorLog = console.error,
  deploymentTimestamp = new Date().toISOString(),
} = {}) {
  log(`[IndexNow] Deployment timestamp: ${deploymentTimestamp}`);
  const detected = detectChangedUrls(previousManifest, currentManifest);
  log(`[IndexNow] Detected ${detected.length} changed public route${detected.length === 1 ? '' : 's'}.`);
  for (const url of detected) log(`[IndexNow] Detected URL: ${url}`);
  if (previousManifest) {
    for (const [routeFile, fingerprint] of Object.entries(currentManifest.dynamicRoutes ?? {})) {
      if (previousManifest.dynamicRoutes?.[routeFile] !== fingerprint) {
        errorLog(`[IndexNow] Skipped changed dynamic route ${routeFile}: individual canonical URLs cannot be identified reliably; use the manual command for the affected URL.`);
      }
    }
  }
  if (!previousManifest) {
    log('[IndexNow] No prior deployment manifest is available; establishing a baseline and submitting 0 URLs.');
    return { detected: [], submitted: [], status: null, skipped: [] };
  }
  if (!detected.length) {
    log('[IndexNow] No relevant public URLs changed; no request was sent.');
    return { detected, submitted: [], status: null, skipped: [] };
  }
  const validation = await validateChangedUrls(detected, { fetchImpl });
  for (const item of validation.skipped) errorLog(`[IndexNow] Skipped ${item.url}: ${item.reason}.`);
  if (!validation.urls.length) {
    log('[IndexNow] No changed URLs passed live canonical/indexability checks; no request was sent.');
    return { detected, submitted: [], status: null, skipped: validation.skipped };
  }
  log(`[IndexNow] Submitting ${validation.urls.length} URL${validation.urls.length === 1 ? '' : 's'}:`);
  for (const url of validation.urls) log(`[IndexNow] URL: ${url}`);
  const result = await submitImpl(validation.urls, { fetchImpl });
  log(`[IndexNow] HTTP response status: ${result.status} ${result.statusText}.`);
  if (result.responseBody?.trim()) log(`[IndexNow] Response body: ${result.responseBody.trim().slice(0, 500)}`);
  return { detected, submitted: validation.urls, status: result.status, skipped: validation.skipped };
}

export async function runAutomaticIndexNowFailOpen(options = {}) {
  try {
    return { ok: true, result: await runAutomaticIndexNow(options), error: null };
  } catch (error) {
    const errorLog = options.errorLog ?? console.error;
    const message = error instanceof Error ? error.message : String(error);
    errorLog(`[IndexNow] Automatic submission failed after the successful deployment: ${message}`);
    errorLog('[IndexNow] The production deployment remains successful; use the existing manual command to retry changed URLs.');
    return { ok: false, result: null, error: message };
  }
}
