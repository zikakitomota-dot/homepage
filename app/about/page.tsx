import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, Check, FileSearch, Gamepad2, Heart, RefreshCw, ShieldCheck, Sparkles, TestTube2 } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: { absolute: 'About Zalea Studio' },
  description: 'Learn how Zalea Studio creates accessible educational games, practical calculators and family-friendly digital tools.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Zalea Studio',
    description: 'Educational games, practical calculators and accessible digital tools designed for everyday learning.',
    url: '/about',
    type: 'website',
  },
};

const offerings = [
  { icon: Gamepad2, title: 'English Games for Kids', description: 'Short, encouraging activities that make English practice enjoyable.' },
  { icon: Heart, title: 'Health Calculators', description: 'Straightforward tools that help people understand useful everyday estimates.' },
  { icon: Calculator, title: 'Everyday Tools', description: 'Practical calculators for common money and daily-life decisions.' },
];

const values = ['Learning through play', 'Simplicity', 'Accessibility', 'Privacy', 'Mobile-first design', 'Family-friendly experiences'];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-secondary/30"><div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20"><Sparkles className="mx-auto h-11 w-11 text-primary" aria-hidden="true" /><h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">About Zalea Studio</h1><p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">Zalea Studio publishes practical resources for everyday decisions and learning.</p><p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">The collection combines calculators that expose their method, educational activities with teaching context, and guides or printables that help a visitor continue the task away from the result screen.</p></div></section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="rounded-2xl border border-primary/15 bg-primary/5 p-6 sm:p-8"><p className="text-sm font-bold uppercase tracking-wider text-primary">Publisher accountability</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Prepared and maintained by Zalea Studio</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">Zalea Studio is the publisher and operator responsible for this website. Content is prepared, tested and maintained directly under the Zalea Studio name; the site does not imply an external editorial team, independent fact-checker or medical reviewer. Where professional or medical review genuinely applies, it would need to be stated explicitly on the relevant page.</p><p className="mt-4 leading-relaxed text-muted-foreground">The goal is practical clarity: show the calculation or learning objective, explain assumptions that change the answer, and make it possible to report an error with enough detail to reproduce it.</p></div></section>

        <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="text-center"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What you can explore today</h2><p className="mt-4 text-muted-foreground">More learning resources are continually being added.</p></div><div className="mt-9 grid gap-5 md:grid-cols-3">{offerings.map(({ icon: Icon, title, description }) => <Card key={title} className="border-border/60"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{description}</p></CardContent></Card>)}</div></div></section>

        <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="creation-process-heading"><div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wider text-primary">Editorial and testing standards</p><h2 id="creation-process-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">How we create and review our tools</h2><p className="mt-4 leading-relaxed text-muted-foreground">Every published page should help a visitor complete a clear task or understand a useful idea. We do not treat a working calculator alone as enough: instructions, assumptions and limitations are included where they affect how a result should be interpreted.</p></div><div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/60"><CardHeader><FileSearch className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Select the method</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">For ordinary arithmetic, the page identifies the exact relationship being calculated. Where an external method matters, preference is given to primary research, government or standards bodies, and current reference works; the source and its limits are shown on the relevant page.</p></CardContent></Card>
          <Card className="border-border/60"><CardHeader><TestTube2 className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Check examples and boundaries</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">A result is checked against a calculation that can be worked independently, then against boundary and invalid entries. For example, a bill cannot be divided by zero and a final-grade target above 100% must remain visible rather than being silently capped.</p></CardContent></Card>
          <Card className="border-border/60"><CardHeader><ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Match the claim to the tool</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">A calculator result is described as an estimate whenever the inputs or formula cannot represent individual circumstances. Health tools are educational, not diagnoses; education, work and money tools do not replace official records, policies or professional advice.</p></CardContent></Card>
          <Card className="border-border/60"><CardHeader><RefreshCw className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Review and correct</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">Review dates appear where source currency matters, especially on Health calculators. A report is checked against the published formula, example and implementation; confirmed errors are corrected and material guidance is dated again.</p></CardContent></Card>
        </div></section>

        <section className="border-y border-border/60 bg-blue-50/50"><div className="mx-auto grid max-w-[1000px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20"><div><h2 className="text-3xl font-bold tracking-tight">Privacy and calculation data</h2><p className="mt-4 leading-relaxed text-muted-foreground">Most calculator entries are processed in the browser to produce the result shown on the page. Zalea Studio does not ask for an account to use its free public calculators or English games. Analytics and advertising technologies are described in the <Link href="/privacy-policy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.</p></div><div><h2 className="text-3xl font-bold tracking-tight">How to report a correction</h2><p className="mt-4 leading-relaxed text-muted-foreground">Use the <Link href="/contact" className="font-semibold text-primary hover:underline">contact page</Link> and include the page URL, values or question used, result received, result expected, and the device or browser if the problem appears visual. Do not send passwords, payment details, medical records or other sensitive information.</p><p className="mt-4 leading-relaxed text-muted-foreground">The report is compared with the page&apos;s stated method and a reproducible example. Confirmed formula, content or accessibility errors are corrected; suggestions that depend on local policy or individual circumstances may instead lead to a clearer limitation note.</p><p className="mt-4 text-sm font-semibold text-muted-foreground">Editorial information last reviewed: September 2026.</p></div></div></section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Our values</h2><ul className="mt-9 grid gap-4 sm:grid-cols-2">{values.map((value) => <li key={value} className="flex min-h-14 items-center gap-3 rounded-xl border border-border/70 bg-white px-4 py-3"><Check className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span className="font-semibold">{value}</span></li>)}</ul></section>

        <section className="border-t border-primary/15 bg-primary/5"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8"><h2 className="text-3xl font-bold">Find something useful today</h2><p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">Explore free tools and games designed to make learning and everyday decisions a little easier.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button asChild size="lg"><Link href="/games">Explore Games<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/finance">Explore Tools</Link></Button></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}

