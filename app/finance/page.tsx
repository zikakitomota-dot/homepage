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

        <section className="border-y border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Choose by decision</p><h2 className="mt-2 text-3xl font-bold tracking-tight">What are you trying to compare or plan?</h2><p className="mt-4 leading-relaxed text-muted-foreground">The tools are grouped around everyday decisions rather than financial products. You can check a price before buying, divide a shared expense, or estimate the time and cost involved in a future goal.</p></div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">Check a purchase</h3><p className="mt-3 leading-relaxed text-muted-foreground">Use the <Link href="/finance/discount-calculator" className="font-semibold text-primary hover:underline">Discount Calculator</Link> to check a sale price, the <Link href="/finance/unit-price-calculator" className="font-semibold text-primary hover:underline">Unit Price Calculator</Link> to compare package value, or the <Link href="/finance/cashback-calculator" className="font-semibold text-primary hover:underline">Cashback Calculator</Link> to understand a reward cap.</p></div>
              <div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">Share an expense</h3><p className="mt-3 leading-relaxed text-muted-foreground">The <Link href="/finance/split-bill-calculator" className="font-semibold text-primary hover:underline">Split Bill Calculator</Link> divides a total between people and can include a tip. Review the original receipt and any individual items before treating an equal split as fair.</p></div>
              <div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">Plan ahead</h3><p className="mt-3 leading-relaxed text-muted-foreground">Use the <Link href="/finance/savings-goal-calculator" className="font-semibold text-primary hover:underline">Savings Goal Calculator</Link> to compare monthly contributions, or estimate a journey with the <Link href="/finance/fuel-cost-calculator" className="font-semibold text-primary hover:underline">Fuel Cost Calculator</Link>.</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-2">
          <div><h2 className="text-3xl font-bold tracking-tight">How to use the estimates responsibly</h2><p className="mt-4 leading-relaxed text-muted-foreground">Results are calculated from the numbers and options entered; they do not retrieve live prices, bank rates or merchant terms. Check the currency, quantities, percentage rates, limits and time period before comparing two scenarios.</p><p className="mt-4 leading-relaxed text-muted-foreground">For a more realistic plan, test more than one input. A fuel price, monthly contribution or purchase amount can change, so a range of results is often more useful than one exact-looking number.</p></div>
          <aside className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8" aria-labelledby="money-information-note"><h2 id="money-information-note" className="text-2xl font-bold">General information only</h2><p className="mt-4 leading-relaxed text-muted-foreground">These calculators support everyday arithmetic and planning. They do not provide personalised financial, tax, credit or investment advice. Confirm important decisions with current receipts, provider terms or an appropriately qualified professional.</p></aside>
        </div></section>

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

