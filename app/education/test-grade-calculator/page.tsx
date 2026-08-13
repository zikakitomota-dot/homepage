import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, ClipboardCheck } from 'lucide-react';
import { RelatedEducationTools } from '@/components/education/related-education-tools';
import { TestGradeCalculator } from '@/components/education/test-grade-calculator';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Test Grade Calculator – Calculate Your Test Score | Zalea Studio';
const description = 'Calculate your test grade from correct or wrong answers. Enter the number of questions to see your percentage, letter grade and complete test grade chart instantly.';
const path = '/education/test-grade-calculator';
export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: 'website' } };
const faqs = [
  { question: 'How do I calculate my test grade?', answer: 'Divide correct answers by total questions and multiply by 100.' },
  { question: 'What grade is 43 out of 50?', answer: '43 divided by 50 multiplied by 100 is 86%. On this reference scale, 86% is a B, although grading scales vary.' },
  { question: 'How do I calculate my score from wrong answers?', answer: 'Subtract wrong answers from total questions to find correct answers, then divide correct answers by the total and multiply by 100.' },
  { question: 'How many questions can I miss and still get an A?', answer: 'It depends on the total questions and minimum required percentage. On this scale A begins at 93%, so required correct answers are rounded up.' },
  { question: 'Can I use this calculator for quizzes?', answer: 'Yes. It works for quizzes, tests or exams where every question contributes equally.' },
  { question: 'Does every school use the same grading scale?', answer: 'No. Schools, universities and countries may use different grading policies.' },
  { question: 'Does this work if questions are worth different points?', answer: 'No. This assumes equal-value questions. Use the Grade Calculator when questions have different point values.' },
];
const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Test Grade Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Education', item: `${SITE_URL}/education` }, { '@type': 'ListItem', position: 3, name: 'Test Grade Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];
const guides = [
  { title: 'How to Calculate a Test Grade', body: <p><strong>Test Grade = Correct Answers ÷ Total Questions × 100.</strong> For 43 correct answers out of 50: 43 ÷ 50 × 100 = <strong>86%</strong>.</p> },
  { title: 'Calculate a Test Grade from Wrong Answers', body: <p>First use <strong>Correct Answers = Total Questions − Wrong Answers</strong>. With 50 questions and 7 wrong, 43 are correct; 43 ÷ 50 × 100 = 86%.</p> },
  { title: 'How Many Questions Can I Miss?', body: <p>It depends on the test length and target grade. An A starts at 93% here. On 50 questions, 50 × 0.93 = 46.5, so round up to 47 correct and at most 3 wrong.</p> },
  { title: 'What Is a Test Grade Chart?', body: <p>A test grade chart shows the percentage and estimated letter grade for each possible number of correct or wrong answers, helping teachers and students compare possible scores.</p> },
  { title: 'Test Grade Calculator vs Grade Calculator', body: <p>This tool uses equal-value correct and wrong answers. The <Link href="/education/grade-calculator" className="font-semibold text-primary hover:underline">Grade Calculator</Link> supports general points and multiple assignments.</p> },
  { title: 'Test Grade Calculator vs Final Grade Calculator', body: <p>This tool calculates a score already achieved. The <Link href="/education/final-grade-calculator" className="font-semibold text-primary hover:underline">Final Grade Calculator</Link> finds the exam score needed to reach a target course grade.</p> },
];

export default function TestGradeCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/education" className="hover:text-foreground hover:underline">Education</Link><span aria-hidden="true">/</span><span aria-current="page">Test Grade Calculator</span></nav><Link href="/education" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Education Tools</Link><Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Test Grade Calculator</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate your test or quiz grade from the number of questions you answered correctly or incorrectly. See your percentage, estimated letter grade and a complete score chart instantly.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><TestGradeCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><ClipboardCheck className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{guide.title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="test-grade-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="test-grade-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><p className="mx-auto mt-5 max-w-2xl rounded-xl bg-secondary/50 p-4 text-sm leading-relaxed text-muted-foreground">Grading scales vary between schools, universities and countries. This calculator uses a common US letter-grade scale only as a general reference.</p><div className="mt-7 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}{faq.question === 'Does this work if questions are worth different points?' && <> Try the <Link href="/education/grade-calculator" className="font-semibold text-primary hover:underline">Grade Calculator</Link>.</>}</p></div>)}</div></section>
    <div className="border-t border-border/60"><RelatedEducationTools currentSlug="test-grade-calculator" /></div>
  </main><SiteFooter /></div>;
}
