import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { HEALTH_TOOLS_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Shop Educational Games & Digital Resources | Zalea Studio' },
  description:
    'Explore educational games, printable resources, and digital learning products from Zalea Studio, designed for children, parents, teachers, and families.',
  alternates: { canonical: '/shop' },
  openGraph: {
    title: 'Shop Educational Games & Digital Resources | Zalea Studio',
    description:
      'Explore educational games, printable resources, and digital learning products for children, parents, teachers, and families.',
    url: '/shop',
  },
};

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background">
          <div className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Zalea Studio Shop</p>
            <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Educational Games & Digital Resources
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Explore practical digital learning products created to make important ideas engaging and easier to understand for children, parents, teachers, and families.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="products-heading">
          <div className="mb-10">
            <h2 id="products-heading" className="text-3xl font-bold tracking-tight">Featured Educational Products</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Start building everyday money skills through play. More games and printable resources will be added here over time.</p>
          </div>
          <div className="max-w-3xl"><ProductCard /></div>
        </section>

        <section className="border-t border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground">
              Looking for something free? Visit our <a href={HEALTH_TOOLS_URL} className="font-medium text-primary hover:underline">online tools</a>, or learn more <Link href="/#about" className="font-medium text-primary hover:underline">about Zalea Studio</Link>.
              <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
