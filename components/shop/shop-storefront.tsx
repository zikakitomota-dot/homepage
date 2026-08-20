'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  ExternalLink,
  Files,
  GraduationCap,
  ShoppingBag,
  Store,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FEATURED_PRODUCT_IDS,
  SHOP_CATEGORIES,
  type ShopCategoryId,
  type ShopProduct,
} from '@/lib/shop-products';
import { KO_FI_SHOP_URL, PAYHIP_PRODUCT_URL } from '@/lib/site';

type ProductFilter = 'all' | ShopCategoryId;

const categoryIcons = {
  briefcase: BriefcaseBusiness,
  'graduation-cap': GraduationCap,
  files: Files,
} as const;

const filterOptions: readonly { id: ProductFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  ...SHOP_CATEGORIES.map(({ id, title }) => ({ id, label: title })),
];

export function ShopStorefront({ products }: { products: readonly ShopProduct[] }) {
  const [activeFilter, setActiveFilter] = useState<ProductFilter>('all');
  const featuredProducts = FEATURED_PRODUCT_IDS
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is ShopProduct => Boolean(product));
  const heroProducts = products.slice(0, 3);
  const filteredProducts = useMemo(
    () => activeFilter === 'all' ? products : products.filter((product) => product.shopCategory === activeFilter),
    [activeFilter, products],
  );

  function selectCategory(category: ShopCategoryId) {
    setActiveFilter(category);
    window.requestAnimationFrame(() => {
      document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  return (
    <main>
      <section className="relative overflow-hidden border-b border-blue-100 bg-gradient-to-br from-blue-50 via-white to-violet-50/80">
        <div className="pointer-events-none absolute -left-20 top-8 h-64 w-64 rounded-full bg-blue-200/25 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary">Zalea Studio Shop</p>
            <h1 className="mt-4 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Digital tools for everyday life</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">Learn, organize, create and make everyday tasks a little easier with practical digital products from Zalea Studio.</p>
            <Button asChild size="lg" className="mt-8 min-h-12 rounded-full px-6">
              <a href="#all-products">Explore Products<ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" /></a>
            </Button>
          </div>

          <div className="relative mx-auto grid w-full max-w-lg grid-cols-2 items-center gap-4 rounded-[2rem] border border-white/80 bg-white/55 p-5 shadow-xl shadow-blue-950/5 backdrop-blur-sm sm:p-7" role="group" aria-label="Selected Zalea Studio product covers">
            <div className="absolute inset-x-12 bottom-2 h-12 rounded-full bg-blue-950/10 blur-2xl" aria-hidden="true" />
            {heroProducts.map((product, index) => (
              <div key={product.id} className={`relative overflow-hidden rounded-2xl border border-white bg-white shadow-lg ${index === 0 ? '-rotate-2 translate-y-4' : index === 1 ? 'rotate-2 -translate-y-3' : 'col-span-2 mx-auto -mt-4 w-[48%] rotate-1'}`}>
                <div className="relative aspect-[4/3] bg-gradient-to-br from-blue-50 to-violet-50">
                  <Image src={product.image} alt={product.imageAlt} fill priority={index === 0} sizes="(min-width: 1024px) 210px, 40vw" className="object-contain p-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="shop-categories-heading">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Browse your way</p>
          <h2 id="shop-categories-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Shop by category</h2>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {SHOP_CATEGORIES.map((category) => {
            const Icon = categoryIcons[category.icon];
            const selected = activeFilter === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => selectCategory(category.id)}
                aria-pressed={selected}
                aria-controls="product-grid"
                className={`group rounded-2xl border p-6 text-left shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? 'border-blue-300 bg-blue-50/70 ring-1 ring-blue-200' : 'border-border/70 bg-white'}`}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-violet-100 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                <span className="mt-5 block text-xl font-bold">{category.title}</span>
                <span className="mt-2 block min-h-[4.5rem] leading-relaxed text-muted-foreground">{category.description}</span>
                <span className="mt-5 inline-flex items-center font-semibold text-primary">Explore<ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border/60 bg-slate-50/70">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="featured-products-heading">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">A curated starting point</p>
              <h2 id="featured-products-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Featured products</h2>
            </div>
            <a href="#all-products" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">See the full collection<ArrowDown className="ml-2 h-4 w-4" aria-hidden="true" /></a>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.map((product, index) => <ShopProductCard key={product.id} product={product} priority={index === 0} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="marketplaces-heading">
        <div className="grid gap-8 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50/70 to-violet-50/70 p-6 sm:p-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">More ways to browse</p>
            <h2 id="marketplaces-heading" className="mt-2 text-3xl font-bold tracking-tight">Prefer to shop elsewhere?</h2>
            <p className="mt-3 max-w-xl leading-relaxed text-muted-foreground">You can also browse Zalea Studio products on your preferred marketplace.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MarketplaceLink href={PAYHIP_PRODUCT_URL} name="Payhip" label="Shop on Payhip" />
            <MarketplaceLink href={KO_FI_SHOP_URL} name="Ko-fi" label="Shop on Ko-fi" />
          </div>
        </div>
      </section>

      <section id="all-products" className="scroll-mt-20 border-t border-border/60" aria-labelledby="all-products-heading">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">The full collection</p>
            <h2 id="all-products-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Explore all products</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">Browse every Zalea Studio digital product, from learning games to practical printable challenges.</p>
          </div>

          <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter products by category">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setActiveFilter(option.id)}
                aria-pressed={activeFilter === option.id}
                aria-controls="product-grid"
                className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${activeFilter === option.id ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-white text-foreground hover:border-blue-300 hover:bg-blue-50'}`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm text-muted-foreground" aria-live="polite">Showing {filteredProducts.length} of {products.length} products</p>
          {filteredProducts.length > 0 ? (
            <div id="product-grid" className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product, index) => <ShopProductCard key={product.id} product={product} priority={activeFilter === 'all' && index === 0} />)}
            </div>
          ) : (
            <div id="product-grid" className="mt-6 rounded-2xl border border-dashed border-blue-200 bg-blue-50/40 px-6 py-12 text-center">
              <ShoppingBag className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-bold">No products in this category yet</h3>
              <p className="mx-auto mt-2 max-w-lg text-muted-foreground">We have kept the catalogue accurate and only show products that are currently available.</p>
              <Button type="button" variant="outline" className="mt-5" onClick={() => setActiveFilter('all')}>View all products</Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function MarketplaceLink({ href, name, label }: { href: string; name: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" data-ga-event="cta_click" data-ga-label={`shop_${name.toLowerCase()}`} className="group rounded-2xl border border-white/80 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-primary"><Store className="h-5 w-5" aria-hidden="true" /></span>
      <span className="mt-4 block font-bold">{name}</span>
      <span className="mt-1 inline-flex items-center text-sm font-semibold text-primary">{label}<ExternalLink className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" /></span>
    </a>
  );
}

function ShopProductCard({ product, priority }: { product: ShopProduct; priority: boolean }) {
  const category = SHOP_CATEGORIES.find(({ id }) => id === product.shopCategory);
  return (
    <Card className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border-border/70 bg-white shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/60 to-violet-50/60">
        <Image src={product.image} alt={product.imageAlt} fill priority={priority} sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 100vw" className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.025]" />
        {product.badge && <Badge className="absolute left-4 top-4 bg-violet-700 uppercase tracking-wide hover:bg-violet-700">{product.badge}</Badge>}
      </div>
      <CardHeader className="space-y-3 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
          <span>{category?.title ?? product.category}</span><span className="text-border" aria-hidden="true">•</span><span className="text-muted-foreground">{product.category}</span>
        </div>
        <CardTitle className="text-balance text-xl leading-snug">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-0">
        <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {product.formats.map((format) => <span key={format} className="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-blue-800">{format}</span>)}
        </div>
        <p className="mt-auto pt-5 text-xl font-bold">{product.price}</p>
        <Button asChild variant="outline" className="mt-5 min-h-11 w-full justify-between border-blue-200 text-primary hover:bg-blue-50 hover:text-primary">
          {product.external ? (
            <a href={product.href} target="_blank" rel="noopener noreferrer" data-ga-event="product_click" data-ga-label={product.title}>{product.cta}<ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
          ) : (
            <Link href={product.href} data-ga-event="product_click" data-ga-label={product.title}>{product.cta}<ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
