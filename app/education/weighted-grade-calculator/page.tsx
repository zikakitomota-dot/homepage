import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, Scale } from 'lucide-react';
import { RelatedEducationTools } from '@/components/education/related-education-tools';
import { WeightedGradeCalculator } from '@/components/education/weighted-grade-calculator';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Weighted Grade Calculator | Zalea Studio';
const description = 'Calculate your weighted grade from assignments, tests or course categories. Enter each grade and weight to find your weighted average instantly.';
const path = '/education/weighted-grade-calculator';

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: 'website' } };

const faqs = [
  { question: 'What is a weighted grade?', answer: 'A weighted grade gives assignments or categories different levels of influence. A final exam worth 40% affects the overall grade more than homework worth 10%.' },
  { question: 'How do I calculate a weighted grade?', answer: 'Multiply each grade by its percentage weight expressed as a decimal, then add all of the weighted contributions.' },
  { question: 'How do I calculate grades with different percentages?', answer: 'Enter each grade and its assigned percentage weight. The calculator multiplies them to find each contribution, then combines the contributions into the weighted result.' },
  { question: 'What if my weights do not add up to 100%?', answer: 'Below 100%, the calculator shows both your normalized grade across entered work and its contribution toward the final course grade. Above 100%, it shows a warning instead of a primary grade.' },
  { question: 'Can I use assignment weights instead of category weights?', answer: 'Yes. The same calculation works for individual assignments or broader categories as long as every item has a defined percentage weight.' },
  { question: 'Is a weighted grade the same as an average?', answer: 'It is a weighted average, so larger weights have more influence. A simple average treats every grade equally and can produce a different result.' },
  { question: 'What if one assignment is worth 40% of my grade?', answer: 'Multiply that assignment grade by 0.40. For example, a grade of 85% on an assignment worth 40% contributes 34 percentage points toward the final grade.' },
  { question: 'Can grades be higher than 100%?', answer: 'Yes. Some courses allow extra credit, so this calculator supports grades above 100% without capping them.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Weighted Grade Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Education', item: `${SITE_URL}/education` }, { '@type': 'ListItem', position: 3, name: 'Weighted Grade Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'How Weighted Grades Work', body: <><p><strong>Weighted contribution = Grade × Weight</strong>, with the weight written as a decimal. The complete weighted grade is the sum of all contributions.</p><p className="mt-3">For example, 90% × 20% = <strong>18 percentage points</strong>.</p></> },
  { title: 'What Is a Weighted Grade?', body: <p>A weighted grading system gives some assignments or categories more influence than others. A final exam worth 40% affects the course grade more than homework worth 10%.</p> },
  { title: 'Verified Weighted Grade Example', body: <><p>Homework: 92% × 20% = 18.4. Quizzes: 85% × 20% = 17.0. Midterm: 78% × 25% = 19.5. Final: 88% × 35% = 30.8.</p><p className="mt-3">Overall: 18.4 + 17.0 + 19.5 + 30.8 = <strong>85.7%</strong>.</p></> },
  { title: 'Calculate Your Current Grade Before the Course Is Finished', body: <><p>When only part of a course is graded, use <strong>Current Grade = Weighted Contribution ÷ Total Completed Weight × 100</strong>.</p><p className="mt-3">A 53.10 contribution across 65% completed weight gives 53.10 ÷ 65 × 100 = <strong>81.69%</strong>.</p></> },
  { title: 'Partial Weight vs Final Contribution', body: <p>With less than 100% entered, the normalized current grade describes performance across completed work. The contribution total shows how many percentage points that work currently adds to the full course grade.</p> },
  { title: 'Weighted Grade vs Regular Grade Calculator', body: <p>A regular <Link href="/education/grade-calculator" className="font-semibold text-primary hover:underline">Grade Calculator</Link> divides total earned points by total possible points. This calculator instead multiplies each grade by its assigned percentage weight.</p> },
  { title: 'Weighted Grade vs Final Grade Calculator', body: <p>Use this tool when several categories have different weights. Use the <Link href="/education/final-grade-calculator" className="font-semibold text-primary hover:underline">Final Grade Calculator</Link> to find the score needed on one final exam to reach a target course grade.</p> },
];

export default function WeightedGradeCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/education" className="hover:text-foreground hover:underline">Education</Link><span aria-hidden="true">/</span><span aria-current="page">Weighted Grade Calculator</span></nav><Link href="/education" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Education Tools</Link><Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Weighted Grade Calculator</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate your overall grade when assignments, tests or course categories are worth different percentages. Enter each grade and its weight to find your weighted average instantly.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><WeightedGradeCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Scale className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{guide.title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="weighted-grade-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="weighted-grade-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
    <div className="border-t border-border/60"><RelatedEducationTools currentSlug="weighted-grade-calculator" /></div>
  </main><SiteFooter /></div>;
}
