import type { Metadata } from 'next';

export type CurrencyCode = 'RM' | 'USD' | 'SGD' | 'GBP' | 'EUR' | 'AUD';

export const currencies: CurrencyCode[] = ['RM', 'USD', 'SGD', 'GBP', 'EUR', 'AUD'];

const currencyConfig: Record<CurrencyCode, { currency: string; locale: string }> = {
  RM: { currency: 'MYR', locale: 'en-MY' },
  USD: { currency: 'USD', locale: 'en-US' },
  SGD: { currency: 'SGD', locale: 'en-SG' },
  GBP: { currency: 'GBP', locale: 'en-GB' },
  EUR: { currency: 'EUR', locale: 'en-IE' },
  AUD: { currency: 'AUD', locale: 'en-AU' },
};

export function formatMoney(value: number, code: CurrencyCode) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0;
  const config = currencyConfig[code];

  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeValue);
}

export function nonNegativeNumber(value: string) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

export const moneyTools = [
  {
    slug: 'discount-calculator',
    title: 'Discount Calculator',
    description: 'See the discount amount, final price, and exactly how much you save.',
    icon: 'badge-percent',
  },
  {
    slug: 'split-bill-calculator',
    title: 'Split Bill Calculator',
    description: 'Split a bill fairly between people, with an optional tip included.',
    icon: 'users',
  },
  {
    slug: 'savings-goal-calculator',
    title: 'Savings Goal Calculator',
    description: 'Estimate how many months it may take to reach a savings target.',
    icon: 'piggy-bank',
  },
  {
    slug: 'unit-price-calculator',
    title: 'Unit Price Calculator',
    description: 'Compare two products and quickly identify the better-value option.',
    icon: 'scale',
  },
  {
    slug: 'fuel-cost-calculator',
    title: 'Fuel Cost Calculator',
    description: 'Estimate fuel use and trip cost from distance and efficiency.',
    icon: 'fuel',
  },
  {
    slug: 'cashback-calculator',
    title: 'Cashback Calculator',
    description: 'Calculate cashback earned, including an optional maximum cap.',
    icon: 'wallet-cards',
  },
] as const;

export function createMoneyMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: { absolute: `${title} | Zalea Studio` },
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Zalea Studio`,
      description,
      url: path,
      type: 'website',
    },
  };
}
