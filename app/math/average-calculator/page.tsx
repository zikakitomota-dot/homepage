import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BarChart3, CircleHelp } from 'lucide-react';
import { AverageCalculator } from '@/components/math/average-calculator';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Average Calculator – Mean, Median, Mode & Range | Zalea Studio';
const description = 'Free average calculator to find the mean, median, mode, range, sum, minimum and maximum of any set of numbers with clear calculation steps.';
const path = '/math/average-calculator';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
};

const faqs = [
  { question: 'How do you calculate an average?', answer: 'Add all the values, count how many values there are, then divide the sum by that count.' },
  { question: 'Is average the same as mean?', answer: 'In everyday mathematics, average usually means the arithmetic mean: the sum of the values divided by their count.' },
  { question: 'How do you find the median?', answer: 'Sort the values from lowest to highest. Use the middle value, or average the two middle values when the count is even.' },
  { question: 'How do you find the mode?', answer: 'Count how often each value occurs. The value or values with the highest frequency are the mode.' },
  { question: 'How do you calculate the range?', answer: 'Subtract the minimum value from the maximum value.' },
  { question: 'Can a dataset have more than one mode?', answer: 'Yes. When two or more values share the highest frequency, the dataset has multiple modes.' },
  { question: 'What happens if there is no mode?', answer: 'If every distinct value occurs equally often, the dataset has no mode.' },
  { question: 'What is the difference between mean and median?', answer: 'The mean uses every value, while the median is the middle of the sorted data. Unusually high or low values can affect the mean more strongly.' },
  { question: 'Can I calculate an average with negative numbers?', answer: 'Yes. Negative numbers, positive numbers and zero all contribute to the sum and count normally.' },
  { question: 'Can I calculate an average with decimals?', answer: 'Yes. Enter decimal values using a decimal point and the calculator will use them in every statistic.' },
  { question: 'Does zero count when calculating an average?', answer: 'Yes. Zero is a valid value: it adds zero to the sum and adds one to the count.' },
  { question: 'What is the difference between average and weighted average?', answer: 'A normal average gives every value equal importance. A weighted average gives some values more influence than others.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Average Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Math Tools', item: `${SITE_URL}/math` }, { '@type': 'ListItem', position: 3, name: 'Average Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'How to Calculate an Average', body: <><p>Add all values, count them, then divide the sum by the count.</p><p className="mt-3 rounded-lg bg-secondary/50 p-3 font-medium text-foreground">10 + 20 + 30 = 60<br />60 ÷ 3 = 20<br />Average = 20</p></> },
  { title: 'Average Formula', body: <><p>The arithmetic mean formula is:</p><p className="mt-3 rounded-lg bg-secondary/50 p-3 text-center font-semibold text-foreground" aria-label="Average equals sum of all values divided by number of values">Average = Sum of values ÷ Number of values</p></> },
  { title: 'What Is the Mean?', body: <p>The arithmetic mean combines a set of values into one central value. In most everyday math, “mean” and “average” refer to the same calculation.</p> },
  { title: 'How to Find the Median', body: <><p>Sort the values first. For 5, 10, 15, the middle value is <strong>10</strong>. With an even count, average the middle pair: for 5, 10, 15, 20, (10 + 15) ÷ 2 = <strong>12.5</strong>.</p></> },
  { title: 'How to Find the Mode', body: <p>The mode occurs most often. In 2, 3, 3, 5, the mode is <strong>3</strong>. Data can have one mode, multiple modes, or no mode when all distinct values occur equally often.</p> },
  { title: 'How to Find the Range', body: <p>Range = Maximum − Minimum. For 5, 10, 20, the range is 20 − 5 = <strong>15</strong>.</p> },
  { title: 'Mean vs Median', body: <p>The mean uses every value, while the median marks the middle of sorted data. In 10, 10, 10, 10, 100, the mean is <strong>28</strong> but the median is <strong>10</strong>, so the median can better represent a typical value when an outlier is present.</p> },
  { title: 'Average vs Weighted Average', body: <p>A normal average gives every value equal importance. A weighted average gives selected values greater influence. This calculator intentionally calculates an unweighted arithmetic mean.</p> },
];

const commonUses = ['School scores and test results', 'Monthly expenses', 'Sales figures', 'Temperatures', 'Sports statistics', 'Survey results', 'Work hours', 'Business performance', 'Everyday data analysis'];

export default function AverageCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/math" className="hover:text-foreground hover:underline">Math Tools</Link><span aria-hidden="true">/</span><span aria-current="page">Average Calculator</span></nav>
      <Link href="/math" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Math Tools</Link>
      <Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Eight useful statistics in one</Badge>
      <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Average Calculator</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate the average of any set of numbers instantly. See the mean, median, mode, range, sum, count, minimum and maximum with clear calculation steps.</p>
    </div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><AverageCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><BarChart3 className="h-6 w-6" aria-hidden="true" /></span><h2 className="text-xl font-semibold leading-none tracking-tight">{guide.title}</h2></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="average-uses"><h2 id="average-uses" className="text-3xl font-bold tracking-tight">Common Uses for Averages</h2><p className="mt-4 leading-relaxed text-muted-foreground">Averages summarize repeated measurements and everyday data so they are easier to compare.</p><ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{commonUses.map((item) => <li key={item} className="rounded-xl border border-border/60 bg-card p-4">{item}</li>)}</ul><p className="mt-6 leading-relaxed text-muted-foreground">For school results, try the <Link href="/education/grade-calculator" className="font-semibold text-primary hover:underline">Grade Calculator</Link>. To measure how widely values spread around their mean, use the <Link href="/math/standard-deviation-calculator" className="font-semibold text-primary hover:underline">Standard Deviation Calculator</Link>. You can also simplify relationships with the <Link href="/math/ratio-calculator" className="font-semibold text-primary hover:underline">Ratio Calculator</Link>, or explore all <Link href="/math" className="font-semibold text-primary hover:underline">Math Tools</Link>.</p></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="average-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="average-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
  </main><SiteFooter /></div>;
}

