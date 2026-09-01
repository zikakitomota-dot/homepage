import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, Target } from 'lucide-react';
import { FinalGradeCalculator } from '@/components/education/final-grade-calculator';
import { RelatedEducationTools } from '@/components/education/related-education-tools';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Final Grade Calculator – What Grade Do I Need? | Zalea Studio';
const description = 'Find out what grade you need on your final exam to reach your target course grade. Enter your current grade, final exam weight and desired grade for an instant result.';
const path = '/education/final-grade-calculator';

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: 'website' } };

const faqs = [
  { question: 'What grade do I need on my final?', answer: 'Enter your current course grade, the final exam’s percentage weight and your target course grade. The calculator solves for the final exam score needed.' },
  { question: 'How do I calculate my final course grade?', answer: 'Multiply the current grade by the coursework weight, then add the final exam grade multiplied by the final exam weight. Both weights must total 100%.' },
  { question: 'How much does my final affect my course grade?', answer: 'Its effect equals its percentage weight. A final worth 20% contributes one fifth of the course grade; the existing coursework contributes the other 80%.' },
  { question: 'What if I need more than 100% on my final?', answer: 'The target is not achievable with the final exam alone under a normal 0–100% scale. Extra credit, a curve or another grading adjustment would be required.' },
  { question: 'What if I already have enough to reach my target?', answer: 'If the required result is 0% or lower, the target is mathematically secured even with a 0% final, assuming the entered grading structure is complete.' },
  { question: 'How do I calculate what I need to pass?', answer: 'Use the course’s passing percentage as the target grade. The result depends on your current percentage and the final exam weight, plus any separate school rules.' },
  { question: 'Is this the same as a weighted grade calculator?', answer: 'No. This tool solves for one remaining final exam. A weighted grade calculator combines multiple assignments or categories with different weights.' },
  { question: 'What if my course uses points instead of percentages?', answer: 'This calculator uses percentages and course weights, not raw accumulated points. Use the Grade Calculator for points earned and total possible points.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Final Grade Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Education', item: `${SITE_URL}/education` }, { '@type': 'ListItem', position: 3, name: 'Final Grade Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'How to Calculate What You Need on Your Final', body: <><p><strong>Required final grade = (target grade − current grade × (1 − final weight)) ÷ final weight.</strong></p><p className="mt-3">For an 82% current grade, 30% final and 80% target:</p><p className="mt-2">82 × 0.70 = 57.4<br />80 − 57.4 = 22.6<br />22.6 ÷ 0.30 = <strong>75.33%</strong></p></> },
  { title: 'How Much Is the Final Worth?', body: <p>The calculator cannot determine the final’s weight from grades alone. Check your syllabus or gradebook. If it says the final is worth 25% of the course grade, enter <strong>25</strong>; the completed coursework then contributes the remaining 75%.</p> },
  { title: 'Final Exam vs Weighted Grade Calculator', body: <p>Use this calculator to find the score needed on one remaining final. Use the <Link href="/education/weighted-grade-calculator" className="font-semibold text-primary hover:underline">Weighted Grade Calculator</Link> to combine several assignments or categories. Change the three inputs above to compare what-if final scenarios instantly.</p> },
  { title: 'Percentages, Weights and Points', body: <p>This tool uses percentage grades and one final-exam weight. If your course uses raw points earned and total possible points, use the <Link href="/education/grade-calculator" className="font-semibold text-primary hover:underline">Grade Calculator</Link> instead.</p> },
];

export default function FinalGradeCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/education" className="hover:text-foreground hover:underline">Education</Link><span aria-hidden="true">/</span><span aria-current="page">Final Grade Calculator</span></nav><Link href="/education" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Education Tools</Link><Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Final Grade Calculator</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Find out what score you need on your final exam to reach your target course grade. Enter your current grade, your final exam weight and the grade you want to achieve.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><FinalGradeCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Target className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{guide.title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="final-grade-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="final-grade-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
    <div className="border-t border-border/60"><RelatedEducationTools currentSlug="final-grade-calculator" /></div>
  </main><SiteFooter /></div>;
}
