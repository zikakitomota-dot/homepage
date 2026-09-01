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
  { question: 'How do I convert salary to an hourly rate?', answer: 'Divide annual gross salary by annual working hours. Annual working hours equal hours per day multiplied by days per week and weeks worked per year.' },
  { question: 'How do I convert monthly salary to hourly pay?', answer: 'Select Monthly salary in the calculator. It multiplies the monthly amount by 12, then divides that annual salary by the annual working hours entered.' },
  { question: 'How many working hours are in a year?', answer: 'A common full-time assumption is 2,080 hours: 8 hours per day × 5 days per week × 52 weeks. Your actual schedule may be different.' },
  { question: 'Does the hourly rate include tax?', answer: 'No. The result converts gross salary before taxes and deductions. It does not estimate take-home pay, benefits, overtime, bonuses or commissions.' },
  { question: 'What if I work fewer than 40 hours per week?', answer: 'Enter your actual hours per day and days per week. With the same salary, fewer annual working hours produce a higher hourly equivalent.' },
  { question: 'Should I use 52 weeks per year?', answer: 'Use 52 if salary continues through paid leave. Use fewer weeks when the salary amount excludes unpaid weeks away from work.' },
  { question: 'Is a salary-to-hourly conversion exact?', answer: 'It is an estimate based on the pay period and work schedule entered. Actual payroll rates can differ because of rounding, paid leave, overtime, bonuses and employer rules.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Salary to Hourly Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'BusinessApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Work & Time', item: `${SITE_URL}/work-time` }, { '@type': 'ListItem', position: 3, name: 'Salary to Hourly Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'How to Convert Salary to Hourly', body: <><p><strong>Hourly rate = annual salary ÷ (hours per day × days per week × weeks per year).</strong></p><p className="mt-3">For example: 50,000 ÷ (8 × 5 × 52) = 50,000 ÷ 2,080 = <strong>24.04 per hour</strong>.</p></> },
  { title: 'Monthly Salary to Hourly', body: <><p>First convert monthly salary to annual salary by multiplying it by 12. Then divide by annual working hours.</p><p className="mt-3">For example: 2,800 × 12 = 33,600. Using 2,080 annual hours, 33,600 ÷ 2,080 = <strong>16.15 per hour</strong>.</p></> },
  { title: 'Why Your Work Schedule Matters', body: <p>The equivalent hourly rate changes when your hours or weeks change. Use 52 weeks when salary continues through paid leave, or reduce it when the salary excludes unpaid time away. The result is a gross-pay estimate before taxes and deductions.</p> },
  { title: 'Useful Next Steps', body: <p>Use the <Link href="/work-time/work-hours-calculator" className="font-semibold text-primary hover:underline">Work Hours Calculator</Link> to total shifts and breaks, or estimate extra-hours pay with the <Link href="/work-time/overtime-calculator" className="font-semibold text-primary hover:underline">Overtime Calculator</Link>.</p> },
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
