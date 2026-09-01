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
  { question: 'How do I calculate my test grade?', answer: 'Divide correct answers by total questions and multiply by 100. For example, 18 ÷ 20 × 100 gives a test score of 90%.' },
  { question: 'How do I calculate a quiz score?', answer: 'Use the same formula as a test: correct answers ÷ total questions × 100. The calculator works as a quick quiz grader when every question has equal value.' },
  { question: 'What percentage is 18 out of 20?', answer: '18 divided by 20 multiplied by 100 is 90%. On this reference scale, 90% is an A−.' },
  { question: 'How do teachers calculate test grades?', answer: 'For an equal-value test, teachers divide the number of correct answers by the total questions and multiply by 100. The applicable letter grade depends on the class grading policy.' },
  { question: 'How do I calculate my score from wrong answers?', answer: 'Subtract wrong answers from total questions to find correct answers, then divide correct answers by the total and multiply by 100.' },
  { question: 'Can I use points instead of questions?', answer: 'This tool is designed for whole, equal-value questions. For points earned and total possible points—or differently weighted questions—use the dedicated points calculator.' },
  { question: 'How is the letter grade determined?', answer: 'The percentage is matched to the reference scale shown on this page, from A+ at 97% through D− at 60%, with scores below 60% shown as F.' },
  { question: 'Why might my teacher’s letter grade be different?', answer: 'Grading thresholds vary by teacher, school and institution. Treat the displayed letter as a reference and follow the grading policy for your class.' },
];
const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Test Grade Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Education', item: `${SITE_URL}/education` }, { '@type': 'ListItem', position: 3, name: 'Test Grade Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];
const guides = [
  { title: 'Test and Quiz Grade Formula', body: <p><strong>Test percentage = Correct answers ÷ Total questions × 100.</strong> For 18 correct answers out of 20: 18 ÷ 20 × 100 = <strong>90%</strong>.</p> },
  { title: 'Verified Score Examples', body: <p><strong>18 out of 20 = 90%</strong>, and <strong>36 out of 40 = 90%</strong>. The percentage is the same because both fractions represent the same proportion of correct answers.</p> },
  { title: 'A Quick Grader for Teachers', body: <p>Teachers can quickly convert correct answers into percentages when grading equal-value quizzes, tests, worksheets or assignments. The score chart also shows every possible result for the selected test length.</p> },
  { title: 'Calculate from Wrong Answers', body: <p>First use <strong>Correct answers = Total questions − Wrong answers</strong>. With 20 questions and 2 wrong, 18 are correct; 18 ÷ 20 × 100 = 90%.</p> },
  { title: 'Test Grade Calculator vs Grade Calculator', body: <p>This tool uses equal-value correct and wrong answers. The <Link href="/education/grade-calculator" className="font-semibold text-primary hover:underline">Grade Calculator</Link> supports general points and multiple assignments.</p> },
  { title: 'Test Grade Calculator vs Final Grade Calculator', body: <p>This tool calculates a score already achieved. The <Link href="/education/final-grade-calculator" className="font-semibold text-primary hover:underline">Final Grade Calculator</Link> finds the exam score needed to reach a target course grade.</p> },
];

const gradeScale = [
  ['A+', '97–100%'], ['A', '93% to under 97%'], ['A−', '90% to under 93%'], ['B+', '87% to under 90%'], ['B', '83% to under 87%'], ['B−', '80% to under 83%'],
  ['C+', '77% to under 80%'], ['C', '73% to under 77%'], ['C−', '70% to under 73%'], ['D+', '67% to under 70%'], ['D', '63% to under 67%'], ['D−', '60% to under 63%'], ['F', 'Below 60%'],
] as const;

export default function TestGradeCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/education" className="hover:text-foreground hover:underline">Education</Link><span aria-hidden="true">/</span><span aria-current="page">Test Grade Calculator</span></nav><Link href="/education" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Education Tools</Link><Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Test Grade Calculator</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate your test or quiz grade from the number of questions you answered correctly or incorrectly. See your percentage, estimated letter grade and a complete score chart instantly.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><TestGradeCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-6 md:grid-cols-2">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><ClipboardCheck className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{guide.title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div><Card className="mt-6 border-border/60 shadow-sm"><CardHeader><CardTitle className="text-xl">Letter-Grade Reference Scale</CardTitle><p className="text-sm leading-relaxed text-muted-foreground">The calculator uses the thresholds below. Grading scales vary by school, teacher and institution, so check the policy used for your class.</p></CardHeader><CardContent><div className="overflow-hidden rounded-xl border border-border/60"><table className="w-full text-left text-sm"><thead className="bg-secondary"><tr><th scope="col" className="px-4 py-3 font-semibold">Grade</th><th scope="col" className="px-4 py-3 font-semibold">Percentage</th></tr></thead><tbody className="divide-y divide-border">{gradeScale.map(([grade, range]) => <tr key={grade}><th scope="row" className="px-4 py-3 font-semibold">{grade}</th><td className="px-4 py-3 text-muted-foreground">{range}</td></tr>)}</tbody></table></div></CardContent></Card></div></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="test-grade-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="test-grade-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><p className="mx-auto mt-5 max-w-2xl rounded-xl bg-secondary/50 p-4 text-sm leading-relaxed text-muted-foreground">Grading scales vary between schools, universities and countries. This calculator uses a common US letter-grade scale only as a general reference.</p><div className="mt-7 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}{faq.question === 'Can I use points instead of questions?' && <> Try the <Link href="/education/grade-calculator" className="font-semibold text-primary hover:underline">Grade Calculator</Link>.</>}</p></div>)}</div></section>
    <div className="border-t border-border/60"><RelatedEducationTools currentSlug="test-grade-calculator" /></div>
  </main><SiteFooter /></div>;
}
