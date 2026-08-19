import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Banknote, CircleHelp } from 'lucide-react';
import { SalaryToHourlyCalculator } from '@/components/work-time/salary-to-hourly-calculator';
import { RelatedWorkTimeTools } from '@/components/work-time/related-work-time-tools';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Salary to Hourly Calculator | Zalea Studio';
const description = 'Convert annual, monthly or weekly salary into hourly pay—or calculate annual salary from an hourly rate using your actual work schedule.';
const path = '/work-time/salary-to-hourly-calculator';

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: 'website' } };

const faqs = [
  { question: 'How do I convert annual salary to hourly pay?', answer: 'Divide annual salary by total working hours per year. Total annual hours equal hours per day multiplied by days per week and weeks worked per year.' },
  { question: 'What is the hourly rate for a $52,000 salary?', answer: 'Using 8 hours per day, 5 days per week and 52 weeks per year, $52,000 is $25 per hour before tax and deductions.' },
  { question: 'How do I convert monthly salary to hourly pay?', answer: 'Multiply monthly salary by 12, then divide the annual amount by your total working hours per year.' },
  { question: 'How do I calculate annual salary from an hourly rate?', answer: 'Multiply the hourly rate by hours per day, days per week and weeks worked per year.' },
  { question: 'Should I use 52 weeks per year?', answer: 'Use 52 when salary continues through paid leave. Reduce the value when estimating work that includes unpaid weeks away.' },
  { question: 'Does the result include overtime or bonuses?', answer: 'No. Results are straight gross-pay equivalents and do not include overtime, bonuses, commissions, taxes, deductions or benefits.' },
  { question: 'Can I use a work schedule other than 40 hours per week?', answer: 'Yes. Hours per day, days per week and weeks per year are all editable so the estimate can reflect part-time or alternative schedules.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Salary to Hourly Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'BusinessApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Work & Time', item: `${SITE_URL}/work-time` }, { '@type': 'ListItem', position: 3, name: 'Salary to Hourly Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'How to Convert Salary to Hourly Pay', body: <p>Annualize the salary, then divide it by annual working hours. For a standard schedule, <strong>hours per year = 8 × 5 × 52 = 2,080</strong>. A $52,000 annual salary therefore equals $25 per hour.</p> },
  { title: 'How to Convert Hourly Pay to Annual Salary', body: <p>Multiply the hourly rate by hours per day, days per week and weeks per year. At $25 per hour on an 8 × 5 × 52 schedule, estimated annual gross salary is $52,000.</p> },
  { title: 'Monthly and Weekly Salary Conversions', body: <p>Monthly salary is annual salary divided by 12. Weekly pay reflects your schedule and weeks worked. When converting a weekly salary, the calculator multiplies it by your chosen weeks per year.</p> },
  { title: 'Why Your Work Schedule Matters', body: <p>The same salary produces a different hourly equivalent when annual hours change. Use the <Link href="/work-time/work-hours-calculator" className="font-semibold text-primary hover:underline">Work Hours Calculator</Link> to total shifts and breaks, or estimate extra pay with the <Link href="/work-time/overtime-calculator" className="font-semibold text-primary hover:underline">Overtime Calculator</Link>.</p> },
];

export default function SalaryToHourlyCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/work-time" className="hover:text-foreground hover:underline">Work &amp; Time</Link><span aria-hidden="true">/</span><span aria-current="page">Salary to Hourly Calculator</span></nav><Link href="/work-time" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Work &amp; Time Tools</Link><Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Salary to Hourly Calculator</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Convert annual, monthly or weekly salary into hourly, daily, weekly and monthly pay—or calculate annual salary from an hourly rate using your actual schedule.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><SalaryToHourlyCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Banknote className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{guide.title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="salary-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="salary-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
    <div className="border-t border-border/60"><RelatedWorkTimeTools currentSlug="salary-to-hourly-calculator" /></div>
  </main><SiteFooter /></div>;
}
