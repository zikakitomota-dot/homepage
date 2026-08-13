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

const title = 'Business Days Calculator – Count Working Days Between Dates | Zalea Studio';
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
  { question: 'Do business days include weekends?', answer: 'Business days usually exclude weekends, but working weeks differ. You can use Monday–Friday, Sunday–Thursday, or choose custom working days.' },
  { question: 'Do business days include public holidays?', answer: 'That depends on the country, organization and purpose. This version lets you manually add public holidays or other dates that should be excluded.' },
  { question: 'How do I calculate 10 business days from today?', answer: 'Choose Business Days From Today, enter 10 or use the 10 days shortcut, then select Add. The result skips your configured non-working and excluded dates.' },
  { question: 'Can I subtract business days from a date?', answer: 'Yes. Choose Add / Subtract Business Days, select Subtract, and enter the starting date and number of business days.' },
  { question: 'Can I use a Sunday–Thursday working week?', answer: 'Yes. Select Sunday–Thursday under Working Week and the calculator will treat Friday and Saturday as non-working days.' },
  { question: 'Does the calculator support custom working days?', answer: 'Yes. Choose Custom and select any combination of days used by your schedule or organization.' },
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
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Count working days between two dates, add or subtract business days from a date, or calculate common deadlines from today. Customize the working week and exclude holidays or other dates.</p>
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
            <InfoCard title="Why Business Days Matter">
              <p>Business-day calculations are useful for project deadlines, invoice and payment terms, document processing, delivery estimates, administrative timelines and work schedules.</p>
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
