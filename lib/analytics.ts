export const GA_MEASUREMENT_ID = 'G-NE4EWMSCGB';

export const analyticsEventNames = [
  'calculator_used',
  'product_click',
  'payhip_click',
  'game_launch',
  'cta_click',
  'page_view',
] as const;

export type AnalyticsEventName = (typeof analyticsEventNames)[number];

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  eventName: AnalyticsEventName,
  parameters: Record<string, string> = {},
) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, parameters);
}
