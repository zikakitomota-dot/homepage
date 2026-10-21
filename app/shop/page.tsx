import type { Metadata } from 'next';
import { ShopStorefront } from '@/components/shop/shop-storefront';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { ETSY_PRODUCTS } from '@/lib/shop-products';

export const metadata: Metadata = {
  title: { absolute: 'Digital Templates & Business Spreadsheets | Zalea Studio Shop' },
  description: 'Browse verified Zalea Studio digital tools and business spreadsheet listings on Etsy, plus Zalea English Academy Lifetime Access.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Zalea Studio Digital Shop',
    description: 'Browse practical digital tools and verified business spreadsheet listings from Zalea Studio.',
    url: '/shop',
    type: 'website',
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <ShopStorefront products={ETSY_PRODUCTS} />
      <SiteFooter />
    </div>
  );
}
