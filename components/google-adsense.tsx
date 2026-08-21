'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { academyGames } from '@/lib/games/academy-games';

const ADSENSE_CLIENT_ID = 'ca-pub-2130981852492599';
const academyGamePaths = new Set(
  academyGames.map(({ slug }) => `/games/english/${slug}`),
);

export function GoogleAdSense() {
  const pathname = usePathname();
  const normalizedPathname = pathname === '/' ? pathname : pathname.replace(/\/$/, '');

  if (academyGamePaths.has(normalizedPathname)) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
