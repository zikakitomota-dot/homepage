const ADSENSE_ELIGIBLE_PATHS = new Set([
  '/',
  '/finance',
  '/finance/discount-calculator',
  '/finance/split-bill-calculator',
  '/finance/savings-goal-calculator',
  '/finance/unit-price-calculator',
  '/finance/fuel-cost-calculator',
  '/finance/cashback-calculator',
  '/work-time',
  '/work-time/work-hours-calculator',
  '/work-time/business-days-calculator',
  '/work-time/time-duration-calculator',
  '/work-time/overtime-calculator',
  '/work-time/salary-to-hourly-calculator',
  '/education',
  '/education/grade-calculator',
  '/education/final-grade-calculator',
  '/education/weighted-grade-calculator',
  '/education/gpa-calculator',
  '/education/test-grade-calculator',
  '/math',
  '/math/percentage-calculator',
  '/math/fraction-calculator',
  '/math/ratio-calculator',
  '/math/average-calculator',
  '/math/standard-deviation-calculator',
]);

function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') return '/';
  return pathname.replace(/\/+$/, '');
}

/**
 * AdSense uses an explicit allowlist so ads cannot appear by accident on
 * child-facing games, purchase flows, legal pages, APIs, or future routes.
 */
export function shouldLoadAdSense(pathname: string) {
  return ADSENSE_ELIGIBLE_PATHS.has(normalizePathname(pathname));
}
