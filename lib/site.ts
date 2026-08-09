export const SITE_URL = 'https://zaleastudio.com';
export const HEALTH_TOOLS_URL = 'https://health.zaleastudio.com/';
export const ABOUT_ROUTE = '/about';
export const CONTACT_ROUTE = '/contact';

// Existing Zalea Studio Payhip destination. Replace this value with the
// product-specific checkout URL when one becomes available.
export const PAYHIP_PRODUCT_URL = 'https://payhip.com/ZaleaStudio';

export const navLinks = [
  { label: 'Home', href: '/', external: false },
  { label: 'Games', href: '/games', external: false },
  { label: 'Shop', href: '/shop', external: false },
  { label: 'About', href: ABOUT_ROUTE, external: false },
  { label: 'Contact', href: CONTACT_ROUTE, external: false },
] as const;

export const toolLinks = [
  { label: 'Health', href: HEALTH_TOOLS_URL, external: true },
  { label: 'Money', href: '/money', external: false },
] as const;

export const littleMoneyMaster = {
  name: 'Little Money Master™ Volume 1 – Needs or Wants?',
  shortName: 'Little Money Master™ Volume 1',
  href: '/shop/little-money-master-volume-1',
  description:
    'A fun interactive financial literacy game that helps children aged 5–8 understand the difference between needs and wants.',
  features: [
    'Interactive learning game',
    'Parent & Teacher Guide',
    'Completion Certificate',
    'Designed for ages 5–8',
  ],
} as const;
