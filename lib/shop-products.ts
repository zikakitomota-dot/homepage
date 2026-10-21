import { PAYHIP_ACADEMY_URL } from '@/lib/site';

export const ETSY_SHOP_URL = 'https://www.etsy.com/shop/ZaleaStudioCo';

export const SHOP_CATEGORIES = [
  { id: 'business-templates', title: 'Business Templates', description: 'Excel tools for clearer day-to-day business records and decisions.' },
  { id: 'bundles-collections', title: 'Bundles & Collections', description: 'Coordinated templates collected into one practical download.' },
] as const;

export type ShopCategoryId = (typeof SHOP_CATEGORIES)[number]['id'];
export type EtsyAvailability = 'active';

export type EtsyProduct = {
  id: string;
  title: string;
  shortDescription: string;
  category: ShopCategoryId;
  imagePath: string;
  imageAlt: string;
  etsyUrl: string;
  availability: EtsyAvailability;
  featured: boolean;
  popularityRank?: number;
  lastVerifiedDate: string;
  formats: readonly string[];
};

export const ETSY_PRODUCTS: readonly EtsyProduct[] = [
  { id: 'expiry-renewal-tracker', title: 'Expiry Date Spreadsheet', shortDescription: 'Track licences, insurance, certificates, permits and renewals with automatic status alerts inside Excel.', category: 'business-templates', imagePath: '/images/shop/etsy/expiry-renewal-tracker.webp', imageAlt: 'Expiry and Renewal Tracker showing upcoming dates, days remaining and status alerts', etsyUrl: 'https://www.etsy.com/listing/4579610091/expiry-date-spreadsheet-licence', availability: 'active', featured: true, popularityRank: 1, lastVerifiedDate: '2026-10-20', formats: ['Excel', 'Digital download'] },
  { id: 'quote-follow-up-tracker', title: 'Quote Follow-Up Spreadsheet', shortDescription: 'Organize quotes, calculate follow-up dates and see which prospective customers need attention.', category: 'business-templates', imagePath: '/images/shop/etsy/quote-follow-up-tracker.webp', imageAlt: 'Quote and Estimate Follow-Up Tracker showing follow-up dates, statuses and open quote value', etsyUrl: 'https://www.etsy.com/listing/4581575519/quote-follow-up-spreadsheet-estimate', availability: 'active', featured: true, popularityRank: 2, lastVerifiedDate: '2026-10-20', formats: ['Excel', 'Digital download'] },
  { id: 'small-business-excel-bundle', title: 'Small Business Excel Bundle', shortDescription: 'Four practical workbooks for invoices, income and expenses, sales, and client follow-ups.', category: 'bundles-collections', imagePath: '/images/shop/etsy/small-business-excel-bundle.webp', imageAlt: 'Small Business Excel Bundle showing four spreadsheet dashboards', etsyUrl: 'https://www.etsy.com/listing/4572683633/small-business-excel-bundle-finance', availability: 'active', featured: false, lastVerifiedDate: '2026-10-20', formats: ['Excel', 'ZIP download'] },
  { id: 'invoice-payment-tracker', title: 'Invoice & Payment Tracker', shortDescription: 'Create invoices, monitor due dates and payments, and review outstanding balances from one workbook.', category: 'business-templates', imagePath: '/images/shop/etsy/invoice-payment-tracker.webp', imageAlt: 'Invoice and Payment Tracker showing its dashboard, invoice tracker, invoice template and setup sheets', etsyUrl: 'https://www.etsy.com/listing/4571805526/invoice-payment-tracker-spreadsheet', availability: 'active', featured: false, lastVerifiedDate: '2026-10-20', formats: ['Excel', 'Digital download'] },
  { id: 'income-expense-tracker', title: 'Small Business Income & Expense Tracker', shortDescription: 'Record income and expenses, review monthly profit, and see a clear business-finance dashboard.', category: 'business-templates', imagePath: '/images/shop/etsy/income-expense-tracker.webp', imageAlt: 'Small Business Income and Expense Tracker with dashboard, transaction sheets and monthly summary', etsyUrl: 'https://www.etsy.com/listing/4571938547/small-business-income-expense-tracker', availability: 'active', featured: false, lastVerifiedDate: '2026-10-20', formats: ['Excel', 'Digital download'] },
  { id: 'sales-tracker', title: 'Small Business Sales Tracker', shortDescription: 'Track sales and payment status while reviewing monthly revenue, customers and products.', category: 'business-templates', imagePath: '/images/shop/etsy/sales-tracker.webp', imageAlt: 'Small Business Sales Tracker with sales dashboard, monthly summary and payment status views', etsyUrl: 'https://www.etsy.com/listing/4572370903/small-business-sales-spreadsheet-excel', availability: 'active', featured: false, lastVerifiedDate: '2026-10-20', formats: ['Excel', 'Digital download'] },
  { id: 'seasonal-order-fulfillment-planner', title: 'Seasonal Order & Fulfillment Planner', shortDescription: 'Plan seasonal orders, shipping, inventory and profit from one organized spreadsheet.', category: 'business-templates', imagePath: '/images/shop/etsy/seasonal-order-fulfillment-planner.webp', imageAlt: 'Seasonal Order and Fulfillment Planner spreadsheet cover', etsyUrl: 'https://www.etsy.com/listing/4576557255/seasonal-order-fulfillment-planner', availability: 'active', featured: false, lastVerifiedDate: '2026-10-20', formats: ['Excel', 'Digital download'] },
  { id: 'black-friday-profit-planner', title: 'Black Friday & Cyber Monday Profit Planner', shortDescription: 'Compare discounts, inventory, marketing costs and projected profit before a major sales event.', category: 'business-templates', imagePath: '/images/shop/etsy/black-friday-profit-planner.webp', imageAlt: 'Black Friday and Cyber Monday Profit Planner spreadsheet cover', etsyUrl: 'https://www.etsy.com/listing/4575832635/black-friday-profit-planner-cyber-monday', availability: 'active', featured: false, lastVerifiedDate: '2026-10-20', formats: ['Excel', 'Digital download'] },
];

// Ordered manually from seller-provided merchandising information. Sales counts are not public copy.
export const POPULAR_PICK_IDS: readonly EtsyProduct['id'][] = [
  'expiry-renewal-tracker',
  'quote-follow-up-tracker',
];

export const ACADEMY_SHOP_PRODUCT = {
  id: 'zalea-english-academy', title: 'Zalea English Academy — Founding Member Lifetime Access',
  description: 'Twenty paid English learning games covering Grammar Level 2 and Vocabulary Level 1, with future Academy updates included.',
  price: 'USD 9.99', imagePath: '/images/shop/zalea-english-academy.jpg', imageAlt: 'Zalea English Academy Lifetime Access product cover', payhipUrl: PAYHIP_ACADEMY_URL,
} as const;
