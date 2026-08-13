import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BadgePercent, CircleHelp } from 'lucide-react';
import { PercentageCalculator } from '@/components/math/percentage-calculator';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Percentage Calculator – Calculate Percentages Easily | Zalea Studio';
const description = 'Free percentage calculator to find percentages, percentage increase or decrease, percentage change and reverse percentages with formulas and step-by-step results.';
const path = '/math/percentage-calculator';
export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: 'website' } };

const faqs = [
  { question: 'How do I calculate a percentage?', answer: 'Divide the part by the whole and multiply by 100. To find a percentage of a number, divide the percentage by 100 and multiply by the number.' },
  { question: 'What is the formula for percentage?', answer: 'Percentage = (Part ÷ Whole) × 100.' },
  { question: 'How do I find 20% of a number?', answer: 'Multiply the number by 0.20. For example, 20% of 150 is 0.20 × 150 = 30.' },
  { question: 'How do I calculate percentage increase?', answer: 'Subtract the original value from the new value, divide by the original value, then multiply by 100.' },
  { question: 'How do I calculate percentage decrease?', answer: 'Subtract the new value from the original value, divide by the original value and multiply by 100 to express the size of the decrease.' },
  { question: 'How do I find what percentage one number is of another?', answer: 'Divide the first number by the second number and multiply by 100. The second number cannot be zero.' },
  { question: 'How do I reverse a percentage?', answer: 'Divide the final value by 1 plus the increase rate, or by 1 minus the decrease rate, with the rate written as a decimal.' },
  { question: 'Can a percentage be greater than 100%?', answer: 'Yes. A percentage above 100% means the part is larger than the reference whole, or that a value increased by more than its original amount.' },
  { question: 'Why is a 20% increase followed by a 20% decrease not the original value?', answer: 'The decrease is calculated from the larger, increased value. Increasing 100 by 20% gives 120, then decreasing 120 by 20% gives 96.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Percentage Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Math Tools', item: `${SITE_URL}/math` }, { '@type': 'ListItem', position: 3, name: 'Percentage Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'How to Calculate a Percentage', body: <p>A percentage means “per hundred.” To express part of a whole as a percentage, divide the part by the whole and multiply by 100.</p> },
  { title: 'Percentage Formula', body: <><p><strong>Percentage = (Part ÷ Whole) × 100</strong></p><p className="mt-3">If 15 of 60 items are selected, 15 ÷ 60 × 100 = <strong>25%</strong>.</p></> },
  { title: 'How to Find a Percentage of a Number', body: <><p>Divide the percentage by 100, then multiply by the number.</p><p className="mt-3"><strong>20 ÷ 100 × 150 = 30</strong>, so 20% of 150 is 30.</p></> },
  { title: 'How to Find What Percentage One Number Is of Another', body: <p>Use <strong>Part ÷ Whole × 100</strong>. For example, 30 ÷ 150 × 100 = <strong>20%</strong>.</p> },
  { title: 'How to Calculate Percentage Increase', body: <p>Use <strong>((New − Original) ÷ Original) × 100</strong>. From 100 to 125, the increase is (125 − 100) ÷ 100 × 100 = <strong>25%</strong>.</p> },
  { title: 'How to Calculate Percentage Decrease', body: <p>Use the same percentage-change formula. From 200 to 150, the change is (150 − 200) ÷ 200 × 100 = −25%, which is a <strong>25% decrease</strong>.</p> },
  { title: 'How to Increase or Decrease a Number by a Percentage', body: <p>Multiply by 1 plus or minus the percentage as a decimal. Increasing 80 by 10% gives 80 × 1.10 = <strong>88</strong>.</p> },
  { title: 'How to Calculate Reverse Percentage', body: <p>To recover an original value, divide the final value by the percentage multiplier. If 120 is the result after a 20% increase, 120 ÷ 1.20 = <strong>100</strong>.</p> },
];

export default function PercentageCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/math" className="hover:text-foreground hover:underline">Math Tools</Link><span aria-hidden="true">/</span><span aria-current="page">Percentage Calculator</span></nav><Link href="/math" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Math Tools</Link><Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Five calculators in one</Badge><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Percentage Calculator</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate percentages instantly. Find a percentage of a number, discover what percentage one number is of another, calculate percentage increases or decreases, and more.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><PercentageCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><BadgePercent className="h-6 w-6" aria-hidden="true" /></span><h2 className="text-xl font-semibold leading-none tracking-tight">{guide.title}</h2></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="percentage-uses"><h2 id="percentage-uses" className="text-3xl font-bold tracking-tight">Common Uses for Percentage Calculations</h2><p className="mt-4 leading-relaxed text-muted-foreground">Percentages appear in shopping discounts, price and salary increases, test scores, business growth, tax, tips and investment returns. For focused examples, use the <Link href="/finance/discount-calculator" className="font-semibold text-primary hover:underline">Discount Calculator</Link>, <Link href="/finance/cashback-calculator" className="font-semibold text-primary hover:underline">Cashback Calculator</Link>, or <Link href="/education/test-grade-calculator" className="font-semibold text-primary hover:underline">Test Grade Calculator</Link>.</p></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="percentage-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="percentage-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
  </main><SiteFooter /></div>;
}
