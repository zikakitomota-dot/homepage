import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChartNoAxesCombined, CircleHelp } from 'lucide-react';
import { StandardDeviationCalculator } from '@/components/math/standard-deviation-calculator';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Standard Deviation Calculator – Sample & Population | Zalea Studio';
const description = 'Free standard deviation calculator for sample and population data. Calculate standard deviation, variance, mean and more with clear step-by-step results.';
const path = '/math/standard-deviation-calculator';

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: 'website' } };

const faqs = [
  { question: 'What is standard deviation?', answer: 'Standard deviation measures how far values typically spread from their mean. A larger result indicates greater spread.' },
  { question: 'How do you calculate standard deviation?', answer: 'Find the mean, square each value’s deviation from it, average those squares using the correct divisor, then take the square root.' },
  { question: 'What is the standard deviation formula?', answer: 'Population standard deviation is σ = √[Σ(xᵢ − μ)² / N]. Sample standard deviation uses n − 1 as the divisor.' },
  { question: 'What is the difference between sample and population standard deviation?', answer: 'Population standard deviation describes an entire group. Sample standard deviation estimates spread in a larger population from a sample.' },
  { question: 'Why does sample standard deviation use n − 1?', answer: 'Using n − 1 corrects the tendency of a sample to underestimate variability in the larger population.' },
  { question: 'What does a high standard deviation mean?', answer: 'It means values are more widely spread around the mean. It does not by itself mean the data is good or bad.' },
  { question: 'What does a low standard deviation mean?', answer: 'It means values tend to stay closer to the mean.' },
  { question: 'Can standard deviation be zero?', answer: 'Yes. A standard deviation of zero means every value in the dataset is identical.' },
  { question: 'Can standard deviation be negative?', answer: 'No. Variance is non-negative and standard deviation is its non-negative square root.' },
  { question: 'What is variance?', answer: 'Variance is the average squared distance from the mean, using N for a population or n − 1 for a sample.' },
  { question: 'What is the difference between variance and standard deviation?', answer: 'Variance is expressed in squared units. Standard deviation is the square root of variance and uses the original units.' },
  { question: 'Is standard deviation affected by outliers?', answer: 'Yes. Because deviations are squared, unusually high or low values can strongly increase standard deviation.' },
  { question: 'How many values are needed to calculate standard deviation?', answer: 'Population standard deviation can use one value and equals zero. Sample standard deviation requires at least two observations.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Standard Deviation Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Math Tools', item: `${SITE_URL}/math` }, { '@type': 'ListItem', position: 3, name: 'Standard Deviation Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'What Is Standard Deviation?', body: <><p>Standard deviation measures how spread out values are around their average. The sets 9, 10, 10, 10, 11 and 1, 5, 10, 15, 19 both center on 10, but the second has a much larger standard deviation because its values are farther apart.</p><p className="mt-3">A larger standard deviation means greater spread, not that the data is automatically good or bad.</p></> },
  { title: 'Standard Deviation Formula', body: <><div className="overflow-x-auto rounded-lg bg-secondary/50 p-3 text-center font-semibold text-foreground"><span className="whitespace-nowrap">Population: σ = √[Σ(xᵢ − μ)² / N]</span><br /><span className="whitespace-nowrap">Sample: s = √[Σ(xᵢ − x̄)² / (n − 1)]</span></div><p className="mt-3">Here, xᵢ is each value, μ or x̄ is the mean, N or n is the value count, and Σ means to add the terms.</p></> },
  { title: 'How to Calculate Standard Deviation', body: <ol className="list-decimal space-y-2 pl-5"><li>Find the mean.</li><li>Subtract it from each value.</li><li>Square each difference.</li><li>Add the squared differences.</li><li>Divide by N for a population or n − 1 for a sample.</li><li>Take the square root.</li></ol> },
  { title: 'Population vs Sample Standard Deviation', body: <p>Use the population result when the data contains the entire group being studied. Use the sample result when the data is only part of a larger population. Dividing by n − 1 helps correct the sample’s tendency to underestimate the larger group’s variability.</p> },
  { title: 'What Is Variance?', body: <p>Variance is the average squared distance from the mean. <strong>Standard deviation = √Variance.</strong> Variance uses squared units, while standard deviation returns to the same units as the original data.</p> },
  { title: 'Standard Deviation vs Variance', body: <p>Standard deviation is usually easier to interpret because it uses the original measurement unit. Variance is especially useful in statistical formulas, but its squared units are less intuitive.</p> },
  { title: 'Standard Deviation vs Mean', body: <p>The mean describes the center of a dataset; standard deviation describes its spread around that center. If you mainly need mean, median, mode and range, use the <Link href="/math/average-calculator" className="font-semibold text-primary hover:underline">Average Calculator</Link>.</p> },
];

const commonUses = ['Test scores and school results', 'Investment-return analysis', 'Financial data comparison', 'Quality control', 'Manufacturing measurements', 'Scientific experiments', 'Survey data', 'Sports performance', 'Business metrics', 'Research', 'Data analysis'];

export default function StandardDeviationCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/math" className="hover:text-foreground hover:underline">Math Tools</Link><span aria-hidden="true">/</span><span aria-current="page">Standard Deviation Calculator</span></nav>
      <Link href="/math" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Math Tools</Link>
      <Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Sample and population results together</Badge>
      <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Standard Deviation Calculator</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate sample and population standard deviation, variance, mean, sum and count for any set of numbers with clear step-by-step calculations.</p>
    </div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><StandardDeviationCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><ChartNoAxesCombined className="h-6 w-6" aria-hidden="true" /></span><h2 className="text-xl font-semibold leading-none tracking-tight">{guide.title}</h2></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="standard-deviation-uses"><h2 id="standard-deviation-uses" className="text-3xl font-bold tracking-tight">Common Uses for Standard Deviation</h2><p className="mt-4 leading-relaxed text-muted-foreground">Standard deviation helps compare consistency and variability across many kinds of data without deciding whether that variation is inherently good or bad.</p><ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{commonUses.map((item) => <li key={item} className="rounded-xl border border-border/60 bg-card p-4">{item}</li>)}</ul><p className="mt-6 leading-relaxed text-muted-foreground">Compare central values with the <Link href="/math/average-calculator" className="font-semibold text-primary hover:underline">Average Calculator</Link>, explore all <Link href="/math" className="font-semibold text-primary hover:underline">Math Tools</Link>, or work with results using the <Link href="/education/grade-calculator" className="font-semibold text-primary hover:underline">Grade Calculator</Link>.</p></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="standard-deviation-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="standard-deviation-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
  </main><SiteFooter /></div>;
}

