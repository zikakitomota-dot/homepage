import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgeDollarSign, Banknote, CalendarDays, Clock3, Timer } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { workTimeTools } from '@/lib/work-time';

export const metadata: Metadata = {
  title: { absolute: 'Work & Time Tools | Zalea Studio' },
  description: 'Free work and time calculators for working hours, timesheets, schedules, pay and everyday work planning.',
  alternates: { canonical: '/work-time' },
  openGraph: {
    title: 'Work & Time Tools | Zalea Studio',
    description: 'Free calculators for working hours, timesheets, schedules, pay and everyday work planning.',
    url: '/work-time',
    type: 'website',
  },
};

const icons = { clock: Clock3, calendar: CalendarDays, timer: Timer, overtime: BadgeDollarSign, salary: Banknote };

export default function WorkTimeToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background">
          <div className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
            <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary">Free practical calculators</Badge>
            <h1 className="mx-auto mt-5 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Work &amp; Time Tools</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Free work and time calculators for working hours, timesheets, schedules, pay and everyday work planning.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="work-calculators-heading">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Choose a calculator</p>
            <h2 id="work-calculators-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Plan your working time</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {workTimeTools.map((tool) => {
              const Icon = icons[tool.icon];
              return <Link key={tool.slug} href={`/work-time/${tool.slug}`} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><Card className="h-full border-border/60 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md"><CardHeader><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="flex items-center justify-between gap-3 text-xl">{tool.title}<ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" /></CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{tool.description}</p></CardContent></Card></Link>;
            })}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
