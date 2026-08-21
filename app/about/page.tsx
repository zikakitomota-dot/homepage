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
        <section className="border-b border-border/60 bg-secondary/30"><div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20"><Sparkles className="mx-auto h-11 w-11 text-primary" aria-hidden="true" /><h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">About Zalea Studio</h1><p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-muted-foreground">Welcome to Zalea Studio.</p><p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">Zalea Studio creates free online educational games, practical calculators and digital learning tools that help children, parents and everyday users learn, grow and make smarter decisions.</p></div></section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="rounded-2xl border border-primary/15 bg-primary/5 p-6 sm:p-8"><p className="text-sm font-bold uppercase tracking-wider text-primary">Our mission</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Useful digital tools for everyone</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">Our mission is to make useful digital tools accessible through clear instructions, transparent calculations and friendly learning experiences. Zalea Studio is the publisher and operator responsible for the content on this website.</p></div></section>

        <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="text-center"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What you can explore today</h2><p className="mt-4 text-muted-foreground">More learning resources are continually being added.</p></div><div className="mt-9 grid gap-5 md:grid-cols-3">{offerings.map(({ icon: Icon, title, description }) => <Card key={title} className="border-border/60"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{description}</p></CardContent></Card>)}</div></div></section>

        <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="creation-process-heading"><div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wider text-primary">Editorial and testing standards</p><h2 id="creation-process-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">How we create and review our tools</h2><p className="mt-4 leading-relaxed text-muted-foreground">Every published page should help a visitor complete a clear task or understand a useful idea. We do not treat a working calculator alone as enough: instructions, assumptions and limitations are included where they affect how a result should be interpreted.</p></div><div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/60"><CardHeader><FileSearch className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Research</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">We identify the formula, definitions and decisions a visitor needs. Where a standard or external method matters, the relevant calculator explains or cites it.</p></CardContent></Card>
          <Card className="border-border/60"><CardHeader><TestTube2 className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Build and test</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">Inputs and calculations are checked with ordinary examples, boundary values and invalid entries. Pages are also reviewed for keyboard and mobile use.</p></CardContent></Card>
          <Card className="border-border/60"><CardHeader><ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Explain limits</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">Health, education, work and money estimates include context so they are not presented as diagnoses, official records or personalised professional advice.</p></CardContent></Card>
          <Card className="border-border/60"><CardHeader><RefreshCw className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Review and correct</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">We revisit tools when functionality, guidance or relevant standards change. Reported errors are investigated and corrected rather than hidden.</p></CardContent></Card>
        </div></section>

        <section className="border-y border-border/60 bg-blue-50/50"><div className="mx-auto grid max-w-[1000px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20"><div><h2 className="text-3xl font-bold tracking-tight">Privacy and calculation data</h2><p className="mt-4 leading-relaxed text-muted-foreground">Most calculator entries are processed in the browser to produce the result shown on the page. Zalea Studio does not ask for an account to use its free public calculators or English games. Analytics and advertising technologies are described in the <Link href="/privacy-policy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.</p></div><div><h2 className="text-3xl font-bold tracking-tight">Corrections and contact</h2><p className="mt-4 leading-relaxed text-muted-foreground">If a formula, explanation, accessibility feature or game question appears incorrect, please send the page URL and a short description through the <Link href="/contact" className="font-semibold text-primary hover:underline">contact page</Link>. Clear reports help us reproduce the issue and review the underlying content.</p><p className="mt-4 text-sm font-semibold text-muted-foreground">Editorial information last reviewed: August 2026.</p></div></div></section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Our values</h2><ul className="mt-9 grid gap-4 sm:grid-cols-2">{values.map((value) => <li key={value} className="flex min-h-14 items-center gap-3 rounded-xl border border-border/70 bg-white px-4 py-3"><Check className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span className="font-semibold">{value}</span></li>)}</ul></section>

        <section className="border-t border-primary/15 bg-primary/5"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8"><h2 className="text-3xl font-bold">Find something useful today</h2><p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">Explore free tools and games designed to make learning and everyday decisions a little easier.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button asChild size="lg"><Link href="/games">Explore Games<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/finance">Explore Tools</Link></Button></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}

