export const SITE_URL = 'https://zaleastudio.com';
export const HEALTH_TOOLS_URL = 'https://health.zaleastudio.com/';
export const ABOUT_ROUTE = '/about';
export const CONTACT_ROUTE = '/contact';

// General storefront used by non-Academy product and legal-page links.
export const PAYHIP_PRODUCT_URL = 'https://payhip.com/ZaleaStudio';
// Direct Academy product page, with an optional deployment-specific override.
export const PAYHIP_ACADEMY_PRODUCT_KEY = 'q6xWY';
export const PAYHIP_ACADEMY_PRODUCT_URL = 'https://payhip.com/b/q6xWY';
export const PAYHIP_ACADEMY_URL = process.env.NEXT_PUBLIC_PAYHIP_ACADEMY_URL?.trim() || PAYHIP_ACADEMY_PRODUCT_URL;

export const navLinks = [
  { label: 'Home', href: '/', external: false },
  { label: 'Games', href: '/games', external: false },
  { label: 'Shop', href: '/shop', external: false },
  { label: 'About', href: ABOUT_ROUTE, external: false },
  { label: 'Contact', href: CONTACT_ROUTE, external: false },
] as const;

export const toolLinks = [
  { label: 'Health', href: HEALTH_TOOLS_URL, external: true },
  { label: 'Finance', href: '/money', external: false },
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
