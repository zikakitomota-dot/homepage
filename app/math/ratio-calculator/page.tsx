import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, Ratio } from 'lucide-react';
import { RatioCalculator } from '@/components/math/ratio-calculator';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Ratio Calculator – Simplify Ratios & Solve Proportions | Zalea Studio';
const description = 'Free ratio calculator to simplify ratios, find equivalent ratios, solve proportions and calculate missing values. Supports decimals and three-number ratios.';
const path = '/math/ratio-calculator';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
};

const faqs = [
  { question: 'How do you simplify a ratio?', answer: 'Convert decimal values to integers if needed, then divide every value by their greatest common divisor.' },
  { question: 'What is the simplest form of a ratio?', answer: 'A ratio is in simplest form when its values have no common whole-number factor greater than 1.' },
  { question: 'How do you calculate equivalent ratios?', answer: 'Multiply or divide every part of the ratio by the same non-zero value.' },
  { question: 'How do you solve a ratio with a missing number?', answer: 'Write the two equal ratios as a proportion, cross multiply and divide to isolate the missing value.' },
  { question: 'How do you solve a proportion?', answer: 'For A/B = C/D, use A × D = B × C, then divide both sides to find the unknown.' },
  { question: 'What is cross multiplication?', answer: 'Cross multiplication multiplies diagonally across two equal fractions: the first numerator by the second denominator and the first denominator by the second numerator.' },
  { question: 'Can ratios contain decimals?', answer: 'Yes. Multiply all values by the same power of 10 to create an equivalent integer ratio, then simplify.' },
  { question: 'How do you simplify a three-number ratio?', answer: 'Find the greatest common divisor of all three values and divide each value by it.' },
  { question: 'What is the difference between a ratio and a fraction?', answer: 'A ratio compares quantities. A fraction usually describes a part of one whole, although a ratio A:B can also be written as A/B.' },
  { question: 'Can a ratio have a zero?', answer: 'Yes. For example, 0:5 simplifies to 0:1. However, 0:0 is undefined because it describes no meaningful relationship.' },
  { question: 'Are 2:3 and 4:6 the same ratio?', answer: 'Yes. Dividing both values in 4:6 by 2 gives 2:3, so the ratios are equivalent.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Ratio Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Math Tools', item: `${SITE_URL}/math` }, { '@type': 'ListItem', position: 3, name: 'Ratio Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'What Is a Ratio?', body: <p>A ratio compares two or more quantities. A ratio of <strong>2 : 3</strong> means that for every 2 units of the first quantity, there are 3 units of the second. It can also be written as “2 to 3” or 2/3.</p> },
  { title: 'How to Simplify a Ratio', body: <p>Find the greatest common divisor and divide every value by it. For <strong>12 : 18</strong>, the GCD is 6, so 12 ÷ 6 : 18 ÷ 6 = <strong>2 : 3</strong>.</p> },
  { title: 'How to Simplify Ratios with Decimals', body: <p>Multiply every value by the same power of 10 to remove decimals. For <strong>1.5 : 3</strong>, multiply both values by 10 to get 15 : 30, then simplify to <strong>1 : 2</strong>.</p> },
  { title: 'What Are Equivalent Ratios?', body: <p>Equivalent ratios express the same relationship. <strong>2 : 3</strong>, <strong>4 : 6</strong> and <strong>8 : 12</strong> are equivalent because every pair simplifies to 2 : 3.</p> },
  { title: 'How to Find an Equivalent Ratio', body: <p>Multiply or divide every part by the same non-zero scale factor. Scaling 2 : 3 by 4 gives <strong>8 : 12</strong>.</p> },
  { title: 'How to Solve a Ratio With a Missing Value', body: <p>Write equal ratios as a proportion. For 2 : 3 = x : 12, cross multiply to get 3x = 24, then divide by 3, so <strong>x = 8</strong>.</p> },
  { title: 'What Is a Proportion?', body: <p>A proportion states that two ratios are equal. For example, <strong>2/3 = 8/12</strong> because both ratios simplify to the same relationship.</p> },
  { title: 'How to Solve a Proportion', body: <p>For A/B = C/D, cross multiply using <strong>A × D = B × C</strong>. Then divide to isolate the single missing value.</p> },
  { title: 'How to Simplify a Three-Number Ratio', body: <p>Find a common divisor across all three values. The GCD of 6, 9 and 12 is 3, so 6 : 9 : 12 simplifies to <strong>2 : 3 : 4</strong>.</p> },
  { title: 'Ratio vs Fraction', body: <p>A ratio compares quantities, while a fraction usually describes part of a whole. With 2 red and 3 blue balls, the red-to-blue ratio is 2 : 3, but red balls make up 2/5 of all balls. Use the <Link href="/math/fraction-calculator" className="font-semibold text-primary hover:underline">Fraction Calculator</Link> for fraction arithmetic.</p> },
];

const commonUses = ['Recipes and ingredient mixtures', 'Map scales and construction measurements', 'Classroom mathematics', 'Screen dimensions and design scaling', 'Business and financial comparisons', 'Sharing quantities in fixed proportions'];

export default function RatioCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/math" className="hover:text-foreground hover:underline">Math Tools</Link><span aria-hidden="true">/</span><span aria-current="page">Ratio Calculator</span></nav>
      <Link href="/math" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Math Tools</Link>
      <Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Four ratio tools in one</Badge>
      <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Ratio Calculator</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Simplify ratios, find equivalent ratios, solve proportions and calculate missing ratio values instantly. Supports two-number and three-number ratios with clear step-by-step results.</p>
    </div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><RatioCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Ratio className="h-6 w-6" aria-hidden="true" /></span><h2 className="text-xl font-semibold leading-none tracking-tight">{guide.title}</h2></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="ratio-uses"><h2 id="ratio-uses" className="text-3xl font-bold tracking-tight">Common Uses for Ratios</h2><p className="mt-4 leading-relaxed text-muted-foreground">Ratios make relationships easier to compare, scale and share in everyday situations.</p><ul className="mt-6 grid gap-3 sm:grid-cols-2">{commonUses.map((item) => <li key={item} className="rounded-xl border border-border/60 bg-card p-4">{item}</li>)}</ul><p className="mt-6 leading-relaxed text-muted-foreground">For part-to-whole percentages, use the <Link href="/math/percentage-calculator" className="font-semibold text-primary hover:underline">Percentage Calculator</Link>, or return to all <Link href="/math" className="font-semibold text-primary hover:underline">Math Tools</Link>.</p></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="ratio-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="ratio-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
  </main><SiteFooter /></div>;
}
