'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { englishGames } from '@/lib/games/english-games';

const ADSENSE_CLIENT_ID = 'ca-pub-2130981852492599';
const adEligiblePaths = new Set([
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
  '/games',
  '/games/english',
  '/games/english/academy',
  '/english-games-for-kids',
  '/grammar-games-for-kids',
  '/vocabulary-games-for-kids',
  ...englishGames.map(({ slug }) => `/games/english/${slug}`),
]);

export function GoogleAdSense() {
  const pathname = usePathname();
  const normalizedPathname = pathname === '/' ? pathname : pathname.replace(/\/$/, '');

  if (!adEligiblePaths.has(normalizedPathname)) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

