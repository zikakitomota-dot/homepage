import { ResourceFinderLink } from '@/components/resources/resource-finder-link';
import type { Metadata } from 'next';
import { guides } from '@/lib/guides';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, GraduationCap } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const title = 'Practical Guides for Everyday Learning and Decisions | Zalea Studio';
const description = 'Understand savings, shared costs, percentage language and pre-writing practice before choosing a related calculator, download or activity.';

export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: '/guides' },
  openGraph: { title, description, url: '/guides', type: 'website' },
  twitter: { card: 'summary', title, description },
};

const guideIcons = { calculator: Calculator, learning: GraduationCap };

export default function GuidesPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-sage-soft"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link href="/" className="hover:text-primary hover:underline">Home</Link><span className="mx-2" aria-hidden="true">/</span><span aria-current="page">Guides</span></nav><BookOpen className="mt-8 h-10 w-10 text-primary" aria-hidden="true" /><p className="mt-5 text-sm font-bold uppercase tracking-[0.16em] text-primary">Useful explanations, without the jargon</p><h1 className="mt-3 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">Practical Guides</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Understand a topic before using a tool or printable. These guides combine clear explanations, realistic examples and practical next steps for everyday decisions and learning support.</p></div></section><ResourceFinderLink />
    <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="mb-8 max-w-3xl"><h2 className="text-3xl font-bold tracking-tight">Read by the decision you need to make</h2><p className="mt-3 leading-7 text-muted-foreground">Money-planning guides clarify targets and fair divisions; the percentage guide clarifies reporting language; the early-learning guide helps adults choose and observe low-pressure practice.</p></div><div className="grid gap-6 md:grid-cols-2">{guides.map((guide) => { const Icon = guideIcons[guide.icon]; return <Card key={guide.href} className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span><p className="pt-3 text-xs font-bold uppercase tracking-[0.14em] text-sage-foreground">{guide.category}</p><CardTitle className="text-2xl">{guide.title}</CardTitle></CardHeader><CardContent><p className="leading-7 text-muted-foreground">{guide.description}</p><Link href={guide.href} className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Read guide<ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></CardContent></Card>; })}</div></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20"><div><h2 className="text-3xl font-bold tracking-tight">Use a guide when the calculation is not the whole decision</h2><p className="mt-4 leading-7 text-muted-foreground">A calculator can divide a bill or produce a savings contribution, but it cannot decide what is fair, affordable, or realistic for the people involved. The money guides focus on those choices before linking to a tool for the arithmetic.</p><p className="mt-4 leading-7 text-muted-foreground">The math guide explains language that changes how a result should be reported. The early-learning guide focuses on observing and supporting practice rather than producing a score.</p></div><div className="rounded-2xl border border-blue-200 bg-white p-6 sm:p-8"><h2 className="text-2xl font-bold">A simple reading route</h2><ol className="mt-5 list-decimal space-y-3 pl-5 leading-7 text-muted-foreground"><li>Start with the definition or decision rule.</li><li>Work through the example without a calculator.</li><li>Use the linked tool or printable if it fits your situation.</li><li>Return to the limitations before relying on the result.</li></ol></div></div></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-3xl font-bold tracking-tight">Know which format you are opening</h2><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><FormatCard title="Guide">Explains a concept, trade-off or practice routine before recommending a next step.</FormatCard><FormatCard title="Calculator">Produces a result from your inputs; assumptions and limitations still need judgment.</FormatCard><FormatCard title="Download">A printable record, planner or activity to use away from the browser.</FormatCard><FormatCard title="Game">Interactive practice with feedback; useful for rehearsal, not a formal assessment.</FormatCard></div><div className="mt-10 rounded-2xl border border-border/70 bg-secondary/20 p-6 sm:p-8"><h2 className="text-2xl font-bold">How these guides are written</h2><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">Each guide defines the topic, uses a concrete example, separates calculation from judgment, and points to a related tool only when it helps. Limitations, educational notices and safer interpretations belong beside the advice—not hidden after a call to action.</p></div></section>
  </main><SiteFooter /></div>;
}

function FormatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-border/60 bg-white p-5"><h3 className="text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p></article>;
}
