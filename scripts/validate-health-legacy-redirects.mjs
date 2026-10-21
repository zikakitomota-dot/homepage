import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const csvUrl = new URL('../config/cloudflare-health-legacy-redirects.csv', import.meta.url);
const rows = (await readFile(csvUrl, 'utf8')).trim().split(/\r?\n/u).map((line) => line.split(','));

assert.equal(rows.length, 23, 'Expected 23 unique Cloudflare rules covering 24 URL variants');

const redirects = new Map();
for (const row of rows) {
  assert.equal(row.length, 7, `Unexpected CSV field count: ${row.join(',')}`);
  const [source, target, status, preserveQuery, includeSubdomains, subpathMatching, preservePathSuffix] = row;
  const normalizedSource = new URL(source).href;
  assert.equal(status, '301');
  assert.equal(preserveQuery, 'TRUE');
  assert.equal(includeSubdomains, 'FALSE');
  assert.equal(subpathMatching, 'FALSE');
  assert.equal(preservePathSuffix, 'FALSE');
  assert(!redirects.has(normalizedSource), `Duplicate source: ${normalizedSource}`);
  redirects.set(normalizedSource, target);
}

const mappings = [
  ['', '/health'],
  ['about', '/about'],
  ['contact', '/contact'],
  ['privacy', '/privacy-policy'],
  ['disclaimer', '/health/disclaimer'],
  ['calculators/bmi', '/health/calculators/bmi'],
  ['calculators/bmr', '/health/calculators/bmr'],
  ['calculators/tdee', '/health/calculators/tdee'],
  ['calculators/ideal-weight', '/health/calculators/ideal-weight'],
  ['calculators/calorie-deficit', '/health/calculators/calorie-deficit'],
  ['calculators/water-intake', '/health/calculators/water-intake'],
  ['calculators/walking-calories', '/health/calculators/walking-calories'],
];

let variants = 0;
for (const [path, destinationPath] of mappings) {
  const sources = path
    ? [`https://health.zaleastudio.com/${path}`, `https://health.zaleastudio.com/${path}/`]
    : ['https://health.zaleastudio.com', 'https://health.zaleastudio.com/'];
  for (const source of sources) {
    variants += 1;
    const normalizedSource = new URL(source).href;
    const target = redirects.get(normalizedSource);
    assert.equal(target, `https://zaleastudio.com${destinationPath}`, `Wrong target for ${source}`);
    const queryTarget = new URL(target);
    queryTarget.search = '?utm_source=redirect-check';
    assert.equal(queryTarget.href, `https://zaleastudio.com${destinationPath}?utm_source=redirect-check`);
  }
}

assert.equal(variants, 24);
console.log(`Validated ${rows.length} exact Cloudflare rules covering ${variants} slash/no-slash variants.`);
console.log('All rules use HTTP 301, preserve query strings, and disable subdomain/subpath matching.');
