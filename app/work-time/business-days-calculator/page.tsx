import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CalendarCheck2, CircleHelp } from 'lucide-react';
import { BusinessDaysCalculator } from '@/components/work-time/business-days-calculator';
import { RelatedWorkTimeTools } from '@/components/work-time/related-work-time-tools';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Business Days Calculator – Count Working Days | Zalea Studio';
const description = 'Calculate business days between dates or add and subtract working days. Customize weekends and exclude holidays with this free business days calculator.';
const path = '/work-time/business-days-calculator';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
};

const faqs = [
  { question: 'How many business days are between two dates?', answer: 'Enter the start and end dates, choose whether each boundary date is included, select your working week, and add any excluded dates. The calculator counts only eligible working days.' },
  { question: 'Are weekends included in business days?', answer: 'Not with the default Monday–Friday working week: Saturdays and Sundays are excluded. You can instead choose Sunday–Thursday or select custom working days.' },
  { question: 'Are public holidays included?', answer: 'Public holidays are not detected automatically because calendars vary by country and organization. Add each holiday or closure date under Exclude Holidays / Dates to remove it from the count.' },
  { question: 'Does the calculator include the start and end date?', answer: 'Both dates are included by default when they are working days. Clear either Include option if you do not want that boundary date counted.' },
  { question: 'Is a business day the same as a working day?', answer: 'The terms are commonly used in the same way. Here, either means a day selected in your working week that is not one of your manually excluded dates.' },
  { question: 'How many business days are in a month?', answer: 'There is no single fixed number because month length, weekday placement, working-week settings and holidays vary. Enter the actual first and last dates for an exact count.' },
  { question: 'How many business days are in 9 months?', answer: 'The total varies with the actual start and end dates, weekends, month lengths and holidays. Enter the specific nine-month date range and any holidays to calculate it accurately.' },
  { question: 'What if the start date is after the end date?', answer: 'The calculator shows a validation message and does not return a negative or invalid result. Enter an end date on or after the start date.' },
];

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Business Days Calculator',
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
      { '@type': 'ListItem', position: 3, name: 'Business Days Calculator', item: `${SITE_URL}${path}` },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })),
  },
];

export default function BusinessDaysCalculatorPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/work-time" className="hover:text-foreground hover:underline">Work &amp; Time</Link><span aria-hidden="true">/</span><span aria-current="page">Business Days Calculator</span></nav>
            <Link href="/work-time" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Work &amp; Time Tools</Link>
            <Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge>
            <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Business Days Calculator</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate the number of business or working days between two dates. Saturdays and Sundays are excluded by default, and you can customize the working week or manually exclude holidays.</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <BusinessDaysCalculator />
        </section>

        <section className="border-y border-border/60 bg-secondary/30">
          <div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
            <InfoCard title="What Is a Business Day?">
              <p>A business day generally means a working day. It commonly excludes weekends, but working weeks vary by location and organization. Public holidays and organization-specific closure dates may also be excluded.</p>
            </InfoCard>
            <InfoCard title="How to Calculate Business Days Between Two Dates">
              <ol className="list-decimal space-y-2 pl-5"><li>Choose the start and end dates.</li><li>Decide whether to include each boundary date.</li><li>Select your working week.</li><li>Add holidays or other excluded dates.</li></ol>
            </InfoCard>
            <InfoCard title="How to Add Business Days to a Date">
              <p>Enter a starting date and the number of business days. The calculator moves forward—or backward when subtracting—while skipping configured non-working days and excluded dates.</p>
            </InfoCard>
            <InfoCard title="Calendar Days vs Business Days">
              <p><strong>Calendar days</strong> include every day in the selected range. <strong>Business days</strong> include only selected working days and omit configured non-working and excluded dates.</p>
            </InfoCard>
            <InfoCard title="Worked Example">
              <p>From Monday, June 1, 2026 through Friday, June 12, 2026, there are <strong className="text-foreground">10 business days</strong> with a Monday–Friday week and no excluded holidays. Both dates are included.</p>
            </InfoCard>
            <InfoCard title="Longer Ranges, Including 9 Months">
              <p>The number of working days in a month or nine months is not fixed. Use the actual start and end dates because month lengths, weekday placement, working-week settings and holidays change the result.</p>
            </InfoCard>
            <InfoCard title="Why Business Days Matter">
              <p>Business-day calculations are useful for project deadlines, document processing, delivery estimates, administrative timelines and work schedules. This tool counts working days; it does not calculate financial net payment terms.</p>
            </InfoCard>
            <InfoCard title="Planning Note">
              <p>Business-day definitions and public holidays vary by country, organization and purpose. This calculator is provided for general planning and informational purposes, not legal advice.</p>
            </InfoCard>
          </div>
        </section>

        <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="business-days-faq">
          <div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="business-days-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div>
          <div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div>
        </section>

        <div className="border-t border-border/60"><RelatedWorkTimeTools currentSlug="business-days-calculator" /></div>
      </main>
      <SiteFooter />
    </div>
  );
}
function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><CalendarCheck2 className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>;
}
