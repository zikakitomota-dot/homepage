import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, GraduationCap } from 'lucide-react';
import { GradeCalculator } from '@/components/education/grade-calculator';
import { RelatedEducationTools } from '@/components/education/related-education-tools';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Point-Based Grade Calculator – Calculate Your Grade | Zalea Studio';
const description = 'Calculate a grade from points earned and total points possible. Check one score or combine point-based assignments to see a percentage and estimated letter grade.';
const path = '/education/grade-calculator';

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: 'website' } };

const gradeScale = [
  ['97–100%', 'A+'], ['93–96.99%', 'A'], ['90–92.99%', 'A−'], ['87–89.99%', 'B+'], ['83–86.99%', 'B'], ['80–82.99%', 'B−'], ['77–79.99%', 'C+'], ['73–76.99%', 'C'], ['70–72.99%', 'C−'], ['67–69.99%', 'D+'], ['63–66.99%', 'D'], ['60–62.99%', 'D−'], ['Below 60%', 'F'],
] as const;

const faqs = [
  { question: 'How do I calculate a grade from points?', answer: 'Divide the points earned by the total points possible, then multiply by 100. This converts a quiz, test, assignment or other point-based score into a percentage.' },
  { question: 'What grade is 36 out of 40?', answer: '36 divided by 40 multiplied by 100 is 90%. On the common US scale shown on this page, 90% is an estimated A−, but your school or teacher may use different cutoffs.' },
  { question: 'How do I calculate my overall grade from multiple assignments?', answer: 'For a points-based course, add the earned points across every assignment, add all possible points, then divide the two totals and multiply by 100. Use a weighted grade calculator when categories have different percentage weights.' },
  { question: 'Is 90% always an A?', answer: 'No. This calculator shows 90% as an estimated A− on its reference scale. Letter-grade cutoffs vary between schools, teachers, institutions and countries.' },
  { question: 'Can my grade be higher than 100%?', answer: 'Yes. Extra credit can make earned points higher than the original possible points, producing a grade above 100%.' },
  { question: 'Does every school use the same letter grading scale?', answer: 'No. Grading systems differ between schools, universities and countries. The displayed letter is an estimate based on a common US scale.' },
  { question: 'Is a point-based grade the same as a weighted grade?', answer: 'No. This points-based calculator divides earned points by possible points. The Weighted Grade Calculator applies percentage weights to categories or assignments.' },
];

const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Grade Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Education', item: `${SITE_URL}/education` }, { '@type': 'ListItem', position: 3, name: 'Grade Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];

export default function GradeCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/education" className="hover:text-foreground hover:underline">Education</Link><span aria-hidden="true">/</span><span aria-current="page">Grade Calculator</span></nav><Link href="/education" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Education Tools</Link><Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Grade Calculator</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate a point-based grade from the points you earned and the total points possible. Check one quiz, test or assignment, or combine multiple point-based scores for an overall percentage.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><GradeCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20"><InfoCard title="How to Calculate a Grade from Points"><p><strong>Grade percentage = points earned ÷ total points possible × 100</strong></p><p className="mt-3"><strong>Example: What grade is 36 out of 40?</strong></p><p className="mt-2">36 ÷ 40 × 100 = <strong>90%</strong>.</p><p className="mt-3">Use this formula for quizzes, tests, assignments and other point-based assessments. If every test question has equal value, the <Link href="/education/test-grade-calculator" className="font-semibold text-primary hover:underline">Test Grade Calculator</Link> can also show correct and missed answers.</p></InfoCard><InfoCard title="Point-Based Grade vs Overall Course Grade"><p>The Single Grade tab converts one score to a percentage. Multiple Assignments combines scores by adding all earned points and all possible points before calculating the overall percentage.</p><p className="mt-3">This works when the course uses a points system. If assignments or categories have different percentage weights, use the <Link href="/education/weighted-grade-calculator" className="font-semibold text-primary hover:underline">Weighted Grade Calculator</Link>. To find the exam score needed to reach a course goal, use the <Link href="/education/final-grade-calculator" className="font-semibold text-primary hover:underline">Final Grade Calculator</Link>.</p></InfoCard></div></section>
    <section className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="letter-grade-heading"><div className="text-center"><GraduationCap className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="letter-grade-heading" className="mt-4 text-3xl font-bold tracking-tight">Grade Percentage to Letter Grade</h2></div><div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"><table className="w-full text-left"><thead className="bg-secondary"><tr><th scope="col" className="px-5 py-3 font-semibold">Percentage</th><th scope="col" className="px-5 py-3 font-semibold">Letter Grade</th></tr></thead><tbody className="divide-y divide-border">{gradeScale.map(([percentage, letter]) => <tr key={letter}><td className="px-5 py-3">{percentage}</td><td className="px-5 py-3 font-semibold">{letter}</td></tr>)}</tbody></table></div><p className="mx-auto mt-5 max-w-2xl rounded-xl bg-secondary/50 p-4 text-sm leading-relaxed text-muted-foreground">Grading scales vary between schools, universities and countries. This calculator uses a common US letter-grade scale only as a general reference.</p></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="grade-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="grade-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
    <div className="border-t border-border/60"><RelatedEducationTools currentSlug="grade-calculator" /></div>
  </main><SiteFooter /></div>;
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) { return <Card className="border-border/60 shadow-sm"><CardHeader><CardTitle className="text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>; }
