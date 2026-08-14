import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, ExternalLink } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ABOUT_ROUTE,
  HEALTH_TOOLS_URL,
  PAYHIP_MONEY_MILESTONE_USD_URL,
  PAYHIP_NO_SPEND_COLLECTION_URL,
} from '@/lib/site';

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

const products = [
  {
    category: 'English learning',
    badge: 'Founding Member',
    title: 'Zalea English Academy™ – Founding Member Lifetime Access',
    description: 'Interactive English games that help children practise grammar and vocabulary through play.',
    price: 'USD 14.99',
    features: ['Grammar Level 2', 'Vocabulary Level 1', 'Future Academy updates included'],
    image: '/images/shop/zalea-english-academy.jpg',
    imageAlt: 'Zalea English Academy Lifetime Access product cover',
    href: '/games/english/academy',
    cta: 'Explore Academy',
    external: false,
  },
  {
    category: 'Financial literacy for kids',
    badge: undefined,
    title: 'Little Money Master™ Volume 1 – Needs or Wants?',
    description: 'A playful financial literacy game that helps children aged 5–8 understand needs and wants.',
    price: 'USD 5.99',
    features: ['Interactive learning game', 'Parent & Teacher Guide', 'Completion certificate'],
    image: '/images/Cover.webp',
    imageAlt: 'Little Money Master Volume 1 Needs or Wants product cover',
    href: '/shop/little-money-master-volume-1',
    cta: 'View Game',
    external: false,
  },
  {
    category: 'Money challenge',
    badge: undefined,
    title: 'The Do-It Challenge™ – No Spend Collection',
    description: 'Printable challenges designed to make cutting unnecessary spending feel simple, visual and motivating.',
    price: 'USD 4.99',
    features: ['Four no-spend challenge lengths', 'Reflection pages', 'Reward planner'],
    image: '/images/shop/no-spend-collection.jpg',
    imageAlt: 'The Do-It Challenge No Spend Collection printable bundle cover',
    href: PAYHIP_NO_SPEND_COLLECTION_URL,
    cta: 'View Collection',
    external: true,
  },
  {
    category: 'Savings challenge',
    badge: undefined,
    title: 'The Do-It Challenge™ – Money Milestone (USD)',
    description: 'A printable savings tracker that turns your money goals into visible milestones worth celebrating.',
    price: 'USD 4.99',
    features: ['$500 to $10,000 goals', 'Five printable challenges', '50-envelope tracking format'],
    image: '/images/shop/money-milestone-usd.jpg',
    imageAlt: 'The Do-It Challenge Money Milestone USD printable savings bundle cover',
    href: PAYHIP_MONEY_MILESTONE_USD_URL,
    cta: 'View Challenge',
    external: true,
  },
] as const;

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-blue-50/50">
          <div className="mx-auto max-w-[1200px] px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Zalea Studio Shop</p>
            <h1 className="mx-auto mt-3 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Digital Products &amp; Learning Resources</h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Practical resources for learning, money habits and everyday life—created to make learning and personal goals a little more enjoyable.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="products-heading">
          <div className="mb-9">
            <h2 id="products-heading" className="text-3xl font-bold tracking-tight">Explore all products</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Choose an interactive learning experience or a printable challenge designed for steady, practical progress.</p>
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            {products.map((product, index) => <ShopProductCard key={product.title} product={product} priority={index < 2} />)}
          </div>
        </section>

        <section className="border-t border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground">Looking for something free? Visit our <a href={HEALTH_TOOLS_URL} className="font-medium text-primary hover:underline">online tools</a>, or learn more <Link href={ABOUT_ROUTE} className="font-medium text-primary hover:underline">about Zalea Studio</Link>.<ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" /></p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ShopProductCard({ product, priority }: { product: (typeof products)[number]; priority: boolean }) {
  return (
    <Card className={`group flex h-full min-w-0 flex-col overflow-hidden border-border/60 shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-md ${product.badge ? 'ring-1 ring-violet-200' : ''}`}>
      <div className={`relative aspect-[4/3] overflow-hidden ${product.badge ? 'bg-violet-50' : 'bg-stone-50'}`}>
        <Image src={product.image} alt={product.imageAlt} fill priority={priority} sizes="(min-width: 768px) 50vw, 100vw" className="object-contain p-5 transition-transform duration-300 group-hover:scale-[1.02] sm:p-7" />
        {product.badge && <Badge className="absolute left-4 top-4 bg-violet-700 uppercase tracking-wide hover:bg-violet-700">{product.badge}</Badge>}
      </div>
      <CardHeader className="pb-3">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">{product.category}</p>
        <CardTitle className="text-balance text-2xl leading-tight">{product.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="leading-relaxed text-muted-foreground">{product.description}</p>
        <p className="mt-5 text-2xl font-bold">{product.price}</p>
        <ul className="mt-5 space-y-2.5">
          {product.features.map((feature) => <li key={feature} className="flex gap-2.5 text-sm"><Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" aria-hidden="true" /><span>{feature}</span></li>)}
        </ul>
        <Button asChild size="lg" className="mt-7 min-h-12 w-full sm:w-fit">
          {product.external
            ? <a href={product.href} target="_blank" rel="noreferrer" data-ga-event="product_click" data-ga-label={product.title}>{product.cta}<ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a>
            : <Link href={product.href} data-ga-event="product_click" data-ga-label={product.title}>{product.cta}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>}
        </Button>
      </CardContent>
    </Card>
  );
}
