import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgePercent, Fuel, PiggyBank, Scale, Users, WalletCards } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { moneyTools } from '@/lib/money-tools';

export const metadata: Metadata = {
  title: { absolute: 'Everyday Money Tools | Zalea Studio' },
  description: 'Use six free money calculators to compare prices, split bills, plan savings, estimate fuel costs, and understand cashback.',
  alternates: { canonical: '/finance' },
  openGraph: {
    title: 'Everyday Money Tools | Zalea Studio',
    description: 'Simple free calculators for everyday spending, savings, and smarter buying decisions.',
    url: '/finance',
    type: 'website',
  },
};

const icons = {
  'badge-percent': BadgePercent,
  users: Users,
  'piggy-bank': PiggyBank,
  scale: Scale,
  fuel: Fuel,
  'wallet-cards': WalletCards,
};

export default function MoneyToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background">
          <div className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
            <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary">Free everyday calculators</Badge>
            <h1 className="mx-auto mt-5 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Everyday Money Tools</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Simple calculators to help you compare prices, save smarter and understand everyday spending.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="calculators-heading">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Choose a calculator</p>
            <h2 id="calculators-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Six practical tools, ready to use</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {moneyTools.map((tool) => {
              const Icon = icons[tool.icon];
              return (
                <Link key={tool.slug} href={`/finance/${tool.slug}`} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Card className="h-full border-border/60 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md">
                    <CardHeader>
                      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                      <CardTitle className="flex items-center justify-between gap-3 text-xl">{tool.title}<ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" /></CardTitle>
                    </CardHeader>
                    <CardContent><p className="leading-relaxed text-muted-foreground">{tool.description}</p></CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-t border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20">
            <PiggyBank className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Free tools for everyday financial decisions</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">Zalea Studio&apos;s Money Tools make common calculations easier to understand. Use them to check a sale price, share a restaurant bill, plan a savings goal, compare product value, estimate a journey, or understand a cashback offer. No account or personal financial information is required.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
