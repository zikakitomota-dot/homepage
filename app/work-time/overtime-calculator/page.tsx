import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BadgeDollarSign, CircleHelp } from 'lucide-react';
import { OvertimeCalculator } from '@/components/work-time/overtime-calculator';
import { RelatedWorkTimeTools } from '@/components/work-time/related-work-time-tools';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Overtime Calculator – Calculate Overtime Hours & Pay | Zalea Studio';
const description = 'Calculate overtime hours, overtime rate and estimated overtime pay using your hourly wage, overtime threshold and custom multiplier.';
const path = '/work-time/overtime-calculator';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
};

const faqs = [
  { question: 'How do I calculate overtime pay?', answer: 'Multiply the regular hourly rate by the overtime multiplier, then multiply that overtime rate by the overtime hours. Add regular pay to overtime pay for the estimated total.' },
  { question: 'What does time and a half mean?', answer: 'Time and a half means 1.5 times the regular hourly rate. A regular rate of $20 per hour becomes an overtime rate of $30 per hour.' },
  { question: 'How do I calculate a 1.5x overtime rate?', answer: 'Multiply the regular hourly rate by 1.5. For example, $16 × 1.5 gives an overtime rate of $24 per hour.' },
  { question: 'How do I calculate double time?', answer: 'Multiply the regular hourly rate by 2. For example, $16 × 2 gives a double-time rate of $32 per hour.' },
  { question: 'Can I change the overtime threshold?', answer: 'Yes. Weekly Hours mode lets you set the threshold that applies to your situation instead of assuming a fixed number.' },
  { question: 'Can I enter overtime hours directly?', answer: 'Yes. Choose Enter Overtime Directly and enter regular hours and overtime hours without using a threshold.' },
  { question: 'Does overtime always start after 40 hours?', answer: 'No. Rules vary by employer and jurisdiction, which is why the calculator allows the threshold to be customized.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Overtime Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'BusinessApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Work & Time', item: `${SITE_URL}/work-time` },
    { '@type': 'ListItem', position: 3, name: 'Overtime Calculator', item: `${SITE_URL}${path}` },
  ] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'How to Calculate Overtime Pay', body: <ol className="list-decimal space-y-2 pl-5"><li>Determine regular hours.</li><li>Determine overtime hours.</li><li>Multiply the hourly rate by the overtime multiplier.</li><li>Multiply overtime hours by that overtime rate.</li><li>Add regular pay and overtime pay.</li></ol> },
  { title: 'Overtime Pay Formula', body: <><p><strong>Overtime Rate = Regular Hourly Rate × Overtime Multiplier</strong></p><p className="mt-2"><strong>Overtime Pay = Overtime Hours × Overtime Rate</strong></p><p className="mt-2">At $20 per hour and 1.5×, the overtime rate is $30. Five overtime hours produce $150 overtime pay.</p></> },
  { title: 'What Is Time and a Half?', body: <p>Time and a half means <strong>1.5 times the regular hourly rate</strong>. A $16 hourly rate becomes $24 per overtime hour. The multiplier does not apply universally.</p> },
  { title: 'What Is Double Time?', body: <p>Double time means <strong>2 times the regular hourly rate</strong>. A $16 hourly rate becomes $32 per hour. This calculator does not determine when double time applies.</p> },
  { title: 'Regular Hours vs Overtime Hours', body: <p>Overtime definitions vary, so Weekly Hours mode lets you set your own threshold. If you need to total shifts and breaks first, use the <Link href="/work-time/work-hours-calculator" className="font-semibold text-primary hover:underline">Work Hours Calculator</Link>.</p> },
];

export default function OvertimeCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/work-time" className="hover:text-foreground hover:underline">Work &amp; Time</Link><span aria-hidden="true">/</span><span aria-current="page">Overtime Calculator</span></nav>
      <Link href="/work-time" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Work &amp; Time Tools</Link>
      <Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge>
      <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Overtime Calculator</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate regular and overtime hours, effective overtime rate, overtime pay and total estimated pay using a customizable threshold and multiplier.</p>
    </div></section>

    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><OvertimeCalculator /></section>

    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
      {guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><BadgeDollarSign className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{guide.title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}
    </div></section>

    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="overtime-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="overtime-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
    <div className="border-t border-border/60"><RelatedWorkTimeTools currentSlug="overtime-calculator" /></div>
  </main><SiteFooter /></div>;
}
