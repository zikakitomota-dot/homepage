import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, Timer } from 'lucide-react';
import { TimeDurationCalculator } from '@/components/work-time/time-duration-calculator';
import { RelatedWorkTimeTools } from '@/components/work-time/related-work-time-tools';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Time Duration Calculator – Hours Between Two Times | Zalea Studio';
const description = 'Calculate the time between two times, handle overnight durations, add or subtract time, and convert hours and minutes into decimal hours.';
const path = '/work-time/time-duration-calculator';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
};

const faqs = [
  { question: 'How do I calculate the time between two times?', answer: 'Subtract the start time from the end time. Enter both times above and the calculator will show the duration in hours and minutes, decimal hours and total minutes.' },
  { question: 'Can this calculator handle overnight times?', answer: 'Yes. Without dates, an end time earlier than the start time is treated as occurring the following day. You can also enable dates for an exact multi-day calculation.' },
  { question: 'How do I convert hours and minutes into decimal hours?', answer: 'Divide the minutes by 60, then add the result to the whole hours. For example, 8 hours 30 minutes is 8.50 decimal hours.' },
  { question: 'How do I add hours and minutes to a time?', answer: 'Choose Add Time, enter a start time and the duration to add. Enable dates if you want the resulting calendar date when the calculation crosses midnight.' },
  { question: 'How do I subtract time from a clock time?', answer: 'Choose Subtract Time, enter the starting time and the duration to subtract. The calculator will handle a result that crosses into the previous day.' },
  { question: 'Can I calculate duration across multiple days?', answer: 'Yes. Enable Use dates and enter the start and end dates and times. The result will include days where appropriate and show total decimal hours.' },
  { question: 'What is 30 minutes as a decimal hour?', answer: 'Thirty minutes is 0.50 hours because 30 divided by 60 equals 0.5. Similarly, 15 minutes is 0.25 hours and 45 minutes is 0.75 hours.' },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Time Duration Calculator',
    url: `${SITE_URL}${path}`,
    description,
    applicationCategory: 'UtilityApplication',
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
      { '@type': 'ListItem', position: 3, name: 'Time Duration Calculator', item: `${SITE_URL}${path}` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
  },
];

const guides = [
  { title: 'How to Calculate Time Duration', body: <>Subtract the start time from the end time. For example, 9:15 AM to 5:45 PM is <strong>8 hours 30 minutes</strong>.</> },
  { title: 'How to Calculate an Overnight Time Difference', body: <>When a time-only end is earlier than its start, it occurs the following day. So 10:00 PM to 6:00 AM is <strong>8 hours</strong>.</> },
  { title: 'Hours and Minutes vs Decimal Hours', body: <>Minutes are fractions of an hour: 8h 15m is 8.25 hours, 8h 30m is 8.50 hours and 8h 45m is 8.75 hours. It is never written as 8.30 hours. Use the <Link href="/work-time/work-hours-calculator" className="font-semibold text-primary hover:underline">Work Hours Calculator</Link> for weekly timesheets.</> },
  { title: 'How to Add Time', body: <>Add the duration to the starting clock time. For example, 3:45 PM plus 2 hours 30 minutes is <strong>6:15 PM</strong>.</> },
  { title: 'How to Subtract Time', body: <>Move backward by the entered duration. For example, 8:00 AM minus 1 hour 45 minutes is <strong>6:15 AM</strong>. For working-day deadlines, try the <Link href="/work-time/business-days-calculator" className="font-semibold text-primary hover:underline">Business Days Calculator</Link>.</> },
];

export default function TimeDurationCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/work-time" className="hover:text-foreground hover:underline">Work &amp; Time</Link><span aria-hidden="true">/</span><span aria-current="page">Time Duration Calculator</span></nav>
            <Link href="/work-time" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Work &amp; Time Tools</Link>
            <Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Time Duration Calculator</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate the time between two times, handle overnight or multi-day durations, add or subtract time, and convert hours and minutes into decimal hours.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><TimeDurationCalculator /></section>

        <section className="border-y border-border/60 bg-secondary/30">
          <div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
            {guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Timer className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{guide.title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground"><p>{guide.body}</p></CardContent></Card>)}
          </div>
        </section>

        <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="time-duration-faq">
          <div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="time-duration-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div>
          <div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div>
        </section>

        <div className="border-t border-border/60"><RelatedWorkTimeTools currentSlug="time-duration-calculator" /></div>
      </main>
      <SiteFooter />
    </div>
  );
}
