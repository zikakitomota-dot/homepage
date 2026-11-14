import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, Download, Gamepad2, HeartPulse, Search } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
};

const destinations = [
  { href: '/work-time', icon: Calculator, title: 'Calculators', description: 'Work hours, finance, grades and math tools.' },
  { href: '/health', icon: HeartPulse, title: 'Health calculators', description: 'BMI, BMR, TDEE, water intake and more.' },
  { href: '/games', icon: Gamepad2, title: 'Learning games', description: 'Short English, math and science games for kids.' },
  { href: '/freebies', icon: Download, title: 'Free printables', description: 'Planners, trackers and early-learning sheets.' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Error 404</p>
          <h1 className="mt-3 text-balance text-4xl font-bold tracking-tight sm:text-5xl">We couldn&apos;t find that page</h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The link may be old or mistyped. Search the free collection, or jump to one of the popular sections below.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="min-h-12">
              <Link href="/resources"><Search className="mr-2 h-5 w-5" aria-hidden="true" />Search resources</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="min-h-12">
              <Link href="/">Go to the homepage</Link>
            </Button>
          </div>
        </section>
        <section className="mx-auto max-w-[1100px] px-4 pb-20 sm:px-6 lg:px-8" aria-labelledby="popular-heading">
          <h2 id="popular-heading" className="sr-only">Popular sections</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map(({ href, icon: Icon, title, description }) => (
              <li key={href}>
                <Link href={href} className="group flex h-full flex-col rounded-2xl border border-border/60 bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span>
                  <span className="mt-4 flex items-center justify-between font-semibold">{title}<ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span>
                  <span className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
