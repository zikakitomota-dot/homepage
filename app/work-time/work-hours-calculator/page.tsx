import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, CircleHelp } from 'lucide-react';
import { WorkHoursCalculator } from '@/components/work-time/work-hours-calculator';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Work Hours Calculator – Calculate Hours, Breaks & Pay | Zalea Studio';
const description = 'Calculate daily and weekly work hours, subtract unpaid breaks, convert hours to decimals, track overtime and estimate pay with this free work hours calculator.';
const path = '/work-time/work-hours-calculator';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
};

const faqs = [
  { question: 'How do I calculate hours worked with a lunch break?', answer: 'Enter your start and end times, then enter the unpaid lunch break in minutes. The calculator subtracts the break from the elapsed shift.' },
  { question: 'How do I calculate hours between two times?', answer: 'The calculator finds the elapsed time from the start to the end, including shifts that finish after midnight, and then subtracts any unpaid break.' },
  { question: 'How do I convert work hours to decimal hours?', answer: 'Divide the minutes by 60 and add the result to the whole hours. For example, 30 minutes is 0.50 hours, so 7h 30m is 7.50 hours.' },
  { question: 'Can this calculator handle overnight shifts?', answer: 'Yes. When the end time is earlier than the start time, the calculator treats the end time as occurring on the following day.' },
  { question: 'How do I calculate weekly work hours?', answer: 'Enter each working day in the weekly timesheet. The summary adds all valid daily results and displays total, regular and overtime hours.' },
  { question: 'How is overtime calculated?', answer: 'Hours above your chosen weekly threshold are shown as overtime. Pay estimates multiply those hours by the hourly rate and overtime multiplier you enter.' },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Work Hours Calculator',
    url: `${SITE_URL}${path}`,
    description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires a modern web browser with JavaScript enabled.',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Work & Time', item: `${SITE_URL}/work-time` },
      { '@type': 'ListItem', position: 3, name: 'Work Hours Calculator', item: `${SITE_URL}${path}` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
  },
];

export default function WorkHoursCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/work-time" className="hover:text-foreground hover:underline">Work &amp; Time</Link><span aria-hidden="true">/</span><span aria-current="page">Work Hours Calculator</span></nav>
            <Link href="/work-time" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Work &amp; Time Tools</Link>
            <Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Work Hours Calculator</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate hours worked for each day, subtract lunch and other unpaid breaks, convert time to decimal hours, track weekly overtime and optionally estimate pay.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <WorkHoursCalculator />
        </section>

        <section className="border-y border-border/60 bg-secondary/30">
          <div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
            <InfoCard title="How to Use the Work Hours Calculator">
              <ol className="list-decimal space-y-2 pl-5"><li>Enter the start and end time for a working day.</li><li>Add any unpaid lunch or other break in minutes.</li><li>Repeat for each day you worked.</li><li>Adjust the overtime threshold if needed.</li><li>Review weekly hours and, optionally, estimated pay.</li></ol>
            </InfoCard>
            <InfoCard title="How Are Work Hours Calculated?">
              <p>From 9:00 AM to 5:30 PM is 8 hours 30 minutes elapsed. After a 60-minute unpaid break, the worked time is <strong>7h 30m</strong>, or <strong>7.50 decimal hours</strong>.</p>
            </InfoCard>
            <InfoCard title="Hours and Minutes vs Decimal Hours">
              <p>Decimal hours are portions of 60 minutes—not clock-style minutes. Therefore 7h 15m is 7.25 hours, 7h 30m is 7.50 hours, and 7h 45m is 7.75 hours.</p>
            </InfoCard>
            <InfoCard title="Calculating Overnight Shifts">
              <p>If an end time is earlier than its start time, it is treated as the following day. A shift from 10:00 PM to 6:00 AM therefore totals 8 hours before breaks.</p>
            </InfoCard>
            <InfoCard title="Work Hours and Overtime">
              <p>Choose the weekly threshold that applies to your situation. Hours above it appear as overtime. Rules vary by employer, agreement and jurisdiction, so results are an estimate rather than legal or payroll advice.</p>
            </InfoCard>
            <InfoCard title="Planning earnings">
              <p>Add an optional hourly rate and multiplier for an estimated total. For other everyday calculations, explore the <Link href="/finance" className="font-medium text-primary hover:underline">Finance Tools</Link>.</p>
            </InfoCard>
          </div>
        </section>

        <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="work-hours-faq">
          <div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="work-hours-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div>
          <div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><BriefcaseBusiness className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>;
}
