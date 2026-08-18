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
  { question: 'What grade do I need on my final?', answer: 'The required score depends on your current course grade, the percentage weight of the final exam and your desired overall course grade.' },
  { question: 'How do I calculate my final exam grade needed?', answer: 'Multiply the current grade by the coursework weight, subtract that amount from the target grade, then divide by the final exam weight expressed as a decimal.' },
  { question: 'Can I still pass if I fail my final exam?', answer: 'That depends on your current grade, the final exam weight, the passing grade and any school-specific rules. This calculator provides a mathematical estimate, not an interpretation of academic policy.' },
  { question: 'What if I need more than 100% on my final?', answer: 'The target is mathematically unreachable through the final exam alone unless extra credit, curved grading or another adjustment is available.' },
  { question: 'What if my final is worth 20% of my grade?', answer: 'A 20% final means the current coursework contributes 80% of the overall course grade and the final exam contributes the remaining 20%.' },
  { question: 'Does this calculator work for weighted courses?', answer: 'This calculator assumes the current grade already represents all coursework completed before the final and that the final has its own specified percentage weight. Detailed category weighting requires a weighted grade calculator.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Final Grade Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Education', item: `${SITE_URL}/education` }, { '@type': 'ListItem', position: 3, name: 'Final Grade Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

const guides = [
  { title: 'How to Calculate What Grade You Need on Your Final', body: <><p><strong>Required Final Score = (Target Grade − Current Grade × Remaining Coursework Weight) ÷ Final Exam Weight</strong></p><p className="mt-3">Convert the final weight to a decimal first. With an 82% current grade, a 30% final and an 85% target: (85 − (82 × 0.70)) ÷ 0.30 = <strong>92%</strong>.</p></> },
  { title: 'How Final Exam Weight Affects Your Grade', body: <p>A larger final exam weight has more influence on the final course grade. A final worth 40% can change the outcome much more than one worth 10%. To combine several weighted categories, use the <Link href="/education/weighted-grade-calculator" className="font-semibold text-primary hover:underline">Weighted Grade Calculator</Link>.</p> },
  { title: 'What If I Need More Than 100%?', body: <p>A required score above 100% usually means the target cannot be reached through the final alone. Extra credit, curved grading, bonus assignments or instructor adjustments may change the situation, but availability is not guaranteed.</p> },
  { title: 'What If My Required Score Is Below 0%?', body: <p>A negative formula result means the current course grade is already sufficient to meet the target even with a 0% final exam score.</p> },
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
