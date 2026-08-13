import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, CircleHelp, School } from 'lucide-react';
import { GpaCalculator } from '@/components/education/gpa-calculator';
import { RelatedEducationTools } from '@/components/education/related-education-tools';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { gpaScale } from '@/lib/gpa';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'GPA Calculator – Calculate Your GPA on a 4.0 Scale | Zalea Studio';
const description = 'Calculate your semester or cumulative GPA using a standard 4.0 scale. Enter your courses, grades and credit hours to get your GPA instantly.';
const path = '/education/gpa-calculator';
export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: path }, openGraph: { title, description, url: path, type: 'website' } };

const faqs = [
  { question: 'How do I calculate my GPA?', answer: 'Convert each letter grade to grade points, multiply by course credits, add the quality points and divide by total credit hours.' },
  { question: 'What is a 4.0 GPA scale?', answer: 'A 4.0 scale maps letter grades to grade points, with 4.0 typically representing the highest standard grade point.' },
  { question: 'Does an A+ count as 4.0 or higher?', answer: 'In this calculator, A+ and A both count as 4.0. Some institutions use different scales, so verify your school policy.' },
  { question: 'How do credit hours affect GPA?', answer: 'Courses with more credit hours contribute more quality points and therefore have more influence on overall GPA.' },
  { question: 'How do I calculate cumulative GPA?', answer: 'Combine quality points from previous and new semesters, then divide by the combined completed credits.' },
  { question: 'Can I convert GPA directly to percentage?', answer: 'There is no universal GPA-to-percentage conversion because institutions use different grading systems and policies.' },
  { question: 'Can I use this GPA calculator for any university?', answer: 'It can be used when the institution follows this same 4.0 mapping. Always verify the official grading scale first.' },
];
const jsonLd = [
  { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'GPA Calculator', url: `${SITE_URL}${path}`, description, applicationCategory: 'EducationalApplication', operatingSystem: 'Any', browserRequirements: 'Requires a modern web browser with JavaScript enabled.', isAccessibleForFree: true, offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
  { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Education', item: `${SITE_URL}/education` }, { '@type': 'ListItem', position: 3, name: 'GPA Calculator', item: `${SITE_URL}${path}` }] },
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map((faq) => ({ '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer } })) },
];
const guides = [
  { title: 'How to Calculate GPA', body: <><p><strong>GPA = Total Quality Points ÷ Total Credit Hours</strong>. Quality points equal grade points multiplied by credit hours.</p><p className="mt-3">An A in a 3-credit course gives 4.0 × 3 = 12 quality points. A B in a 4-credit course gives 3.0 × 4 = 12 quality points.</p></> },
  { title: 'What Are Credit Hours?', body: <p>Credit hours represent the academic weight of a course. A 4-credit course contributes more to GPA than a 2-credit course.</p> },
  { title: 'What Are Quality Points?', body: <p>Quality points are <strong>Grade Point × Credit Hours</strong>. Adding them across courses creates the weighted total used to calculate GPA.</p> },
  { title: 'How to Calculate Cumulative GPA', body: <p><strong>Cumulative GPA = Total Quality Points Across All Semesters ÷ Total Credits Across All Semesters.</strong> The calculator combines previous results with the latest semester.</p> },
  { title: 'Is GPA the Same as Percentage?', body: <p>GPA and percentage are different systems. There is no single universal conversion between GPA and percentage because institutions use different grading policies.</p> },
  { title: 'GPA vs Grade Calculator', body: <p>This calculator uses letter grades, grade points and credits. The <Link href="/education/grade-calculator" className="font-semibold text-primary hover:underline">Grade Calculator</Link> uses points earned and total possible points.</p> },
  { title: 'GPA vs Weighted Grade Calculator', body: <p>Use the <Link href="/education/weighted-grade-calculator" className="font-semibold text-primary hover:underline">Weighted Grade Calculator</Link> for assignment or category percentages. Use GPA for courses with credit hours and letter grades.</p> },
];

export default function GpaCalculatorPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav aria-label="Breadcrumb" className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-foreground hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/education" className="hover:text-foreground hover:underline">Education</Link><span aria-hidden="true">/</span><span aria-current="page">GPA Calculator</span></nav><Link href="/education" className="inline-flex items-center text-sm font-medium text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Education Tools</Link><Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">Free calculator</Badge><h1 className="mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">GPA Calculator</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Calculate your semester or cumulative GPA using a standard 4.0 grading scale. Enter your courses, letter grades and credit hours to see your GPA instantly.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><GpaCalculator /></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">{guides.map((guide) => <Card key={guide.title} className="border-border/60 shadow-sm"><CardHeader><span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><School className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{guide.title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{guide.body}</CardContent></Card>)}</div></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="gpa-scale-heading"><div className="text-center"><School className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="gpa-scale-heading" className="mt-4 text-3xl font-bold tracking-tight">GPA Scale Reference</h2></div><div className="mx-auto mt-8 max-w-xl overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"><table className="w-full text-left"><thead className="bg-secondary"><tr><th scope="col" className="px-5 py-3 font-semibold">Letter Grade</th><th scope="col" className="px-5 py-3 font-semibold">Grade Point</th></tr></thead><tbody className="divide-y divide-border">{gpaScale.map(([letter, point]) => <tr key={letter}><td className="px-5 py-3 font-semibold">{letter}</td><td className="px-5 py-3">{point.toFixed(1)}</td></tr>)}</tbody></table></div><p className="mx-auto mt-5 max-w-2xl rounded-xl bg-secondary/50 p-4 text-sm leading-relaxed text-muted-foreground">Your institution may use a different grading scale. Always check your official school or university grading policy.</p></section>
    <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="gpa-faq"><div className="text-center"><CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 id="gpa-faq" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2></div><div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">{faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}</div></section>
    <div className="border-t border-border/60"><RelatedEducationTools currentSlug="gpa-calculator" /></div>
  </main><SiteFooter /></div>;
}
