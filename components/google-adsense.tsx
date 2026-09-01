'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { shouldLoadAdSense } from '@/lib/adsense';

const ADSENSE_CLIENT_ID = 'ca-pub-2130981852492599';

export function GoogleAdSense() {
  const pathname = usePathname();

  useEffect(() => {
    const handleInternalLink = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;

      // A new document prevents a previously loaded Auto Ads script from
      // surviving a client-side transition onto an intentionally ad-free page.
      if (shouldLoadAdSense(pathname) !== shouldLoadAdSense(destination.pathname)) {
        event.preventDefault();
        window.location.assign(destination.href);
      }
    };

    document.addEventListener('click', handleInternalLink, true);
    return () => document.removeEventListener('click', handleInternalLink, true);
  }, [pathname]);

  if (!shouldLoadAdSense(pathname)) return null;

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}

