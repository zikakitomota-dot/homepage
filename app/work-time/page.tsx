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

        <section className="border-y border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Match the tool to the task</p><h2 className="mt-2 text-3xl font-bold tracking-tight">What do you need to work out?</h2><p className="mt-4 leading-relaxed text-muted-foreground">These calculators cover three common planning needs: recording time already worked, counting future working dates, and converting pay into a form that is easier to compare. Choose the task closest to your question.</p></div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">Track a shift or timesheet</h3><p className="mt-3 leading-relaxed text-muted-foreground">Use the <Link href="/work-time/work-hours-calculator" className="font-semibold text-primary hover:underline">Work Hours Calculator</Link> for daily and weekly shifts, or the <Link href="/work-time/time-duration-calculator" className="font-semibold text-primary hover:underline">Time Duration Calculator</Link> for one interval or decimal-hour conversion.</p></div>
              <div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">Plan working dates</h3><p className="mt-3 leading-relaxed text-muted-foreground">The <Link href="/work-time/business-days-calculator" className="font-semibold text-primary hover:underline">Business Days Calculator</Link> counts working days or moves a date forward or backward while respecting the workweek and excluded dates you select.</p></div>
              <div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">Estimate and compare pay</h3><p className="mt-3 leading-relaxed text-muted-foreground">Estimate extra-hours pay with the <Link href="/work-time/overtime-calculator" className="font-semibold text-primary hover:underline">Overtime Calculator</Link>, or compare annual and hourly figures with the <Link href="/work-time/salary-to-hourly-calculator" className="font-semibold text-primary hover:underline">Salary to Hourly Calculator</Link>.</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-2">
          <div><h2 className="text-3xl font-bold tracking-tight">How the calculators handle your entries</h2><p className="mt-4 leading-relaxed text-muted-foreground">Calculations run from the values and options you enter. Where a shift crosses midnight, the work-hours tools treat the end time as the following day. Business-day results use the workweek and excluded dates selected for that calculation rather than assuming every workplace follows the same calendar.</p><p className="mt-4 leading-relaxed text-muted-foreground">Results are shown as practical estimates with the important inputs visible, making it easier to check a timesheet, compare scenarios, or spot an entry that needs correcting.</p></div>
          <aside className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8" aria-labelledby="work-estimate-note"><h2 id="work-estimate-note" className="text-2xl font-bold">Important estimate note</h2><p className="mt-4 leading-relaxed text-muted-foreground">Work schedules, overtime eligibility, payroll deductions, holidays and rounding rules vary by employer and location. Use these results for planning and checking, then confirm official hours or pay with the relevant employer, contract, payroll record or local rule.</p></aside>
        </div></section>
      </main>
      <SiteFooter />
    </div>
  );
}

