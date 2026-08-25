import {
  INDEXNOW_KEY_LOCATION,
  INDEXNOW_SITEMAP,
  fetchSitemapUrls,
  normalizeIndexNowUrls,
  submitIndexNowUrls,
} from './lib/indexnow.mjs';

function printHelp() {
  console.log(`Submit canonical Zalea Studio URLs to IndexNow.

Usage:
  npm run indexnow                         Submit every URL in the current sitemap
  npm run indexnow -- <url> [url...]      Submit only listed changed URLs
  npm run indexnow:dry-run                Validate and print sitemap URLs without submitting
  npm run indexnow -- --dry-run <url>     Validate changed URLs without submitting

Listed URLs must already exist in ${INDEXNOW_SITEMAP}.`);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    printHelp();
    return;
  }

  const dryRun = args.includes('--dry-run');
  const unknownOptions = args.filter((arg) => arg.startsWith('-') && arg !== '--dry-run');
  if (unknownOptions.length) throw new Error(`Unknown option: ${unknownOptions.join(', ')}`);

  const requestedUrls = args.filter((arg) => !arg.startsWith('-'));
  const sitemapUrls = await fetchSitemapUrls();
  let urls = sitemapUrls;
  let source = `the sitemap (${INDEXNOW_SITEMAP})`;

  if (requestedUrls.length) {
    urls = normalizeIndexNowUrls(requestedUrls);
    const sitemapSet = new Set(sitemapUrls);
    const unavailableUrls = urls.filter((url) => !sitemapSet.has(url));
    if (unavailableUrls.length) {
      throw new Error(`Refusing to submit URLs that are not current canonical sitemap entries:\n${unavailableUrls.join('\n')}`);
    }
    source = 'the supplied changed-URL list';
  }

  console.log(`[IndexNow] Prepared ${urls.length} canonical URL${urls.length === 1 ? '' : 's'} from ${source}.`);
  console.log(`[IndexNow] Key verification file: ${INDEXNOW_KEY_LOCATION}`);

  if (dryRun) {
    console.log('[IndexNow] Dry run only; no request was sent.');
    for (const url of urls) console.log(url);
    return;
  }

  const result = await submitIndexNowUrls(urls);
  console.log(`[IndexNow] Submitted ${result.count} URL${result.count === 1 ? '' : 's'}; response status ${result.status} ${result.statusText}.`);
}

main().catch((error) => {
  console.error(`[IndexNow] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});
