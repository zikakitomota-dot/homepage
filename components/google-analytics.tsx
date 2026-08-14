'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import {
  analyticsEventNames,
  GA_MEASUREMENT_ID,
  trackEvent,
  type AnalyticsEventName,
} from '@/lib/analytics';

const calculatorPathPattern = /(?:^|\/)\w[\w-]*-calculator\/?$/;
const gamePathPattern = /^\/games\/english\/([^/]+)\/?$/;
const productPathPattern = /^\/shop\/([^/]+)\/?$/;

function isAnalyticsEventName(value: string): value is AnalyticsEventName {
  return analyticsEventNames.includes(value as AnalyticsEventName);
}

function safePagePath() {
  return window.location.pathname;
}

function AnalyticsEvents() {
  const pathname = usePathname();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (previousPath.current === null) {
      previousPath.current = pathname;
      return;
    }

    if (previousPath.current !== pathname) {
      previousPath.current = pathname;
      trackEvent('page_view', {
        page_path: pathname,
        page_title: document.title,
      });
    }
  }, [pathname]);

  useEffect(() => {
    const trackedCalculators = new Set<string>();
    let calculatorTimer: ReturnType<typeof setTimeout> | undefined;

    function trackCalculatorUse() {
      const pagePath = safePagePath();
      if (!calculatorPathPattern.test(pagePath) || trackedCalculators.has(pagePath)) return;

      if (calculatorTimer) clearTimeout(calculatorTimer);
      calculatorTimer = setTimeout(() => {
        const hasVisibleError = Array.from(document.querySelectorAll('main [role="alert"]')).some(
          (element) => element.textContent?.trim(),
        );
        if (hasVisibleError) return;

        trackedCalculators.add(pagePath);
        trackEvent('calculator_used', {
          calculator_name: pagePath.split('/').filter(Boolean).at(-1) ?? 'calculator',
          page_path: pagePath,
        });
      }, 700);
    }

    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;

      const interactiveElement = event.target.closest<HTMLElement>(
        'a, button, [data-ga-event]',
      );
      if (!interactiveElement) return;

      const pagePath = safePagePath();
      const configuredElement = interactiveElement.closest<HTMLElement>('[data-ga-event]');
      const configuredEvent = configuredElement?.dataset.gaEvent;
      const configuredLabel = configuredElement?.dataset.gaLabel;

      if (configuredEvent && isAnalyticsEventName(configuredEvent)) {
        const labelKey =
          configuredEvent === 'product_click'
            ? 'product_name'
            : configuredEvent === 'game_launch'
              ? 'game_slug'
              : 'cta_name';
        trackEvent(configuredEvent, {
          ...(configuredLabel ? { [labelKey]: configuredLabel } : {}),
          page_path: pagePath,
        });
      }

      const anchor = interactiveElement.closest<HTMLAnchorElement>('a[href]');
      if (anchor) {
        const destination = new URL(anchor.href, window.location.href);
        const isSameOrigin = destination.origin === window.location.origin;

        if (/(^|\.)payhip\.com$/i.test(destination.hostname)) {
          trackEvent('payhip_click', {
            destination_domain: destination.hostname,
            page_path: pagePath,
          });
        }

        if (!configuredEvent && isSameOrigin) {
          const productMatch = destination.pathname.match(productPathPattern);
          const gameMatch = destination.pathname.match(gamePathPattern);

          if (productMatch) {
            trackEvent('product_click', {
              product_name: productMatch[1],
              page_path: pagePath,
            });
          } else if (gameMatch && gameMatch[1] !== 'academy') {
            trackEvent('game_launch', {
              game_slug: gameMatch[1],
              page_path: pagePath,
            });
          }
        }
      }

      if (calculatorPathPattern.test(pagePath)) trackCalculatorUse();
    }

    document.addEventListener('click', handleClick);
    document.addEventListener('input', trackCalculatorUse);
    document.addEventListener('change', trackCalculatorUse);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('input', trackCalculatorUse);
      document.removeEventListener('change', trackCalculatorUse);
      if (calculatorTimer) clearTimeout(calculatorTimer);
    };
  }, []);

  return null;
}

export function GoogleAnalytics() {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <AnalyticsEvents />
    </>
  );
}
