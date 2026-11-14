# Health calculators

Astro source for the pages served at `zaleastudio.com/health`.

The main site's build (`npm run build` in the repo root) runs `scripts/build-health.mjs`,
which installs this folder's dependencies if needed and builds it into `../public/health`.
The header reuses the main site's navigation from `../lib/navigation` and
`../components/site-navigation.css`.

Formerly the separate repo `zikakitomota-dot/health-calculators`, merged here on 2026-11-14.
