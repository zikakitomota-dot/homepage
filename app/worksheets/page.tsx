import { ResourceFinderLink } from '@/components/resources/resource-finder-link';
import Link from 'next/link';
import { CheckCircle2, ChevronRight, FileDown, Printer, ShieldCheck } from 'lucide-react';
import { WorksheetStudio } from '@/components/worksheets/worksheet-studio';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const path = '/worksheets';
export const metadata = createEducationalMetadata({
  title: 'Free Maths & English Worksheet Generator | Zalea Studio',
  description: 'Create free printable Level 1 Mathematics and English worksheets with deterministic variations, matching answer keys and A4 PDF downloads.',
  path,
  image: null,
});

const jsonLd = { '@context': 'https://schema.org', '@graph': [
  { '@type': ['LearningResource', 'WebApplication'], name: 'Zalea Worksheet Studio', url: `${SITE_URL}${path}`, description: 'A free browser-based Mathematics and English Level 1 worksheet generator with printable A4 layouts and answer keys.', applicationCategory: 'EducationalApplication', operatingSystem: 'Any modern web browser', educationalLevel: 'Early primary', learningResourceType: 'Worksheet generator', isAccessibleForFree: true, teaches: ['Addition and subtraction', 'Early English grammar', 'Pronouns, articles, agreement, ownership and position'] },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Worksheet Studio', item: `${SITE_URL}${path}` }] },
] };

export default function WorksheetsPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="worksheet-screen-only border-b border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-amber-50/40"><div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Worksheet Studio</span></nav><p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-blue-700">Free · Private to your browser · No login</p><h1 className="mt-3 max-w-4xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Custom Worksheet Studio</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Choose Mathematics or English, build an age-appropriate Level 1 worksheet, then print or download the exact preview with its matching answer key.</p></div></section><ResourceFinderLink />
    <section className="worksheet-studio-shell bg-slate-100/70 px-3 py-8 sm:px-6 lg:py-12"><div className="mx-auto max-w-[1240px]"><WorksheetStudio /></div></section>
    <section className="worksheet-screen-only mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="worksheet-method"><p className="text-sm font-bold uppercase tracking-wider text-primary">Built for reliable practice</p><h2 id="worksheet-method" className="mt-2 text-3xl font-bold tracking-tight">Questions stay accurate from preview to paper</h2><div className="mt-8 grid gap-5 md:grid-cols-3"><Feature icon={CheckCircle2} title="Reviewed questions">Maths calculations are validated and English questions reuse the reviewed free Level 1 game banks with one intended answer.</Feature><Feature icon={Printer} title="A4-ready pages">Up to ten questions are grouped per page, with extra space for longer English prompts, stable numbering and black-and-white-friendly styling.</Feature><Feature icon={ShieldCheck} title="No learner data collected">Generation, preview and PDF creation happen in the browser. Worksheets do not update My Learning Journey or Learning Missions.</Feature></div><div className="mt-10 rounded-2xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8"><FileDown className="h-7 w-7 text-blue-700" aria-hidden="true" /><h2 className="mt-3 text-2xl font-bold">Two subjects, one private studio</h2><p className="mt-3 leading-relaxed text-muted-foreground">Mathematics keeps its Classic, Visual Maths and Missing Number formats. English adds Fill in the Blank, Choose the Correct Word and Mixed Grammar Practice across all ten free Level 1 topics.</p><p className="mt-4 text-sm text-muted-foreground">For interactive practice, visit <Link href="/games/math" className="font-semibold text-primary hover:underline">Mathematics Games</Link> or <Link href="/games/english" className="font-semibold text-primary hover:underline">English Games</Link>. For ready-made packs, browse <Link href="/freebies" className="font-semibold text-primary hover:underline">Freebies</Link>.</p></div></section>
  </main><SiteFooter /></div>;
}

function Feature({ icon: Icon, title, children }: { icon: typeof CheckCircle2; title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border bg-white p-6 shadow-sm"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Icon className="h-5 w-5" aria-hidden="true" /></span><h3 className="mt-4 text-xl font-bold">{title}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{children}</p></article>;
}
