import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, Divide } from 'lucide-react';
import { FractionCalculator } from '@/components/math/fraction-calculator';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Fraction Calculator – Add, Subtract, Multiply & Divide | Zalea Studio';
const description = 'Free fraction calculator to add, subtract, multiply and divide fractions and mixed numbers. Get simplified answers, decimals and clear step-by-step solutions.';
const path = '/math/fraction-calculator';

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
};

const faqs = [
  { question: 'How do you add fractions?', answer: 'Give the fractions a common denominator, add their numerators and then simplify the result.' },
  { question: 'How do you subtract fractions?', answer: 'Find a common denominator, subtract the second numerator from the first and reduce the answer to simplest form.' },
  { question: 'How do you multiply fractions?', answer: 'Multiply the numerators together, multiply the denominators together and simplify the resulting fraction.' },
  { question: 'How do you divide fractions?', answer: 'Keep the first fraction, invert the second fraction and multiply. Division by a zero fraction is undefined.' },
  { question: 'What is a mixed number?', answer: 'A mixed number combines a whole number and a proper fraction, such as 2 1/3.' },
  { question: 'What is an improper fraction?', answer: 'An improper fraction has a numerator whose magnitude is at least as large as its denominator, such as 7/4.' },
  { question: 'How do you simplify a fraction?', answer: 'Divide the numerator and denominator by their greatest common divisor. For example, 8/12 simplifies to 2/3.' },
  { question: 'Can this calculator use negative fractions?', answer: 'Yes. Enter a minus sign in the numerator for an ordinary fraction, or in the whole-number field for a negative mixed number.' },
  { question: 'Can a denominator be zero?', answer: 'No. A fraction with a denominator of zero is undefined, so the calculator will ask you to enter a non-zero denominator.' },
  { question: 'How is the decimal value calculated?', answer: 'The simplified numerator is divided by the denominator. Repeating decimals are shown as an approximation.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Fraction Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Math Tools', item: `${SITE_URL}/math` }, { '@type': 'ListItem', position: 3, name: 'Fraction Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'How to Use the Fraction Calculator', body: <p>Enter the whole-number part if you have a mixed number, then enter its numerator and denominator. Choose an operation and the simplified result updates instantly. Leave the whole-number field blank for an ordinary fraction.</p> },
  { title: 'Adding Fractions', body: <><p>Fractions need a common denominator before their numerators can be added.</p><p className="mt-3"><strong>1/2 + 3/4 = 2/4 + 3/4 = 5/4 = 1 1/4</strong>.</p></> },
  { title: 'Subtracting Fractions', body: <><p>Use a common denominator, then subtract the numerators while keeping that denominator.</p><p className="mt-3"><strong>3/4 − 1/2 = 3/4 − 2/4 = 1/4</strong>.</p></> },
  { title: 'Multiplying Fractions', body: <><p>Multiply straight across, numerator by numerator and denominator by denominator, before simplifying.</p><p className="mt-3"><strong>2/3 × 3/5 = 6/15 = 2/5</strong>.</p></> },
  { title: 'Dividing Fractions', body: <><p>Invert the second fraction and multiply. This is sometimes remembered as “keep, change, flip.”</p><p className="mt-3"><strong>2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6</strong>.</p></> },
  { title: 'Simplifying Fractions', body: <p>A fraction is simplest when its numerator and denominator share no common factor other than 1. This calculator uses the greatest common divisor to reduce every result exactly.</p> },
  { title: 'Mixed Numbers and Improper Fractions', body: <p>Convert a mixed number by multiplying the whole number by the denominator and adding the numerator. For example, 2 1/3 becomes 7/3. The calculator accepts either form and reports both when useful.</p> },
  { title: 'Negative Fractions and Zero', body: <p>A negative sign applies to the value of the entire fraction. Zero is a valid numerator and simplifies to 0, but zero can never be a denominator or the fraction you divide by.</p> },
];

export default function FractionCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/math" className="hover:text-foreground hover:underline">Math Tools</Link><span aria-hidden="true">/</span><span aria-current="page">Fraction Calculator</span></nav>
      <Link href="/math" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Math Tools</Link>
      <Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Exact answers with clear steps</Badge>
      <h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Fraction Calculator</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Add, subtract, multiply and divide fractions or mixed numbers. See the simplified fraction, mixed-number form, decimal value and each step of the calculation.</p>
    </div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><FractionCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Divide className="h-6 w-6" aria-hidden="true" /></span><h2 className="text-xl font-semibold leading-none tracking-tight">{guide.title}</h2></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="related-math-tools"><h2 id="related-math-tools" className="text-3xl font-bold tracking-tight">Related Free Tools</h2><p className="mt-4 leading-relaxed text-muted-foreground">Explore all <Link href="/math" className="font-semibold text-primary hover:underline">Math Tools</Link>, calculate discounts and changes with the <Link href="/math/percentage-calculator" className="font-semibold text-primary hover:underline">Percentage Calculator</Link>, or work out scores with the <Link href="/education/test-grade-calculator" className="font-semibold text-primary hover:underline">Test Grade Calculator</Link>.</p></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="fraction-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="fraction-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
  </main><SiteFooter /></div>;
}

