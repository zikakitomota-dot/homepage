import type { Metadata } from 'next';
import { ShopStorefront } from '@/components/shop/shop-storefront';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { SHOP_PRODUCTS } from '@/lib/shop-products';

export const metadata: Metadata = {
  title: { absolute: 'Shop Digital Learning & Money Resources | Zalea Studio' },
  description: 'Explore interactive learning games, printable savings challenges, no-spend activities and educational resources from Zalea Studio.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop Digital Learning & Money Resources | Zalea Studio',
    description: 'Explore interactive learning games, printable savings challenges, no-spend activities and educational resources from Zalea Studio.',
    url: '/shop',
    type: 'website',
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <ShopStorefront products={SHOP_PRODUCTS} />
      <SiteFooter />
    </div>
  );
}
