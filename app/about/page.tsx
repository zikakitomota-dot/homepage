import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calculator, Check, Gamepad2, Heart, Sparkles } from 'lucide-react';
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

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="rounded-2xl border border-primary/15 bg-primary/5 p-6 sm:p-8"><p className="text-sm font-bold uppercase tracking-wider text-primary">Our mission</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Useful digital tools for everyone</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">Our mission is to make useful digital tools accessible to everyone through simple, enjoyable and high-quality experiences.</p></div></section>

        <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="text-center"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What you can explore today</h2><p className="mt-4 text-muted-foreground">More learning resources are continually being added.</p></div><div className="mt-9 grid gap-5 md:grid-cols-3">{offerings.map(({ icon: Icon, title, description }) => <Card key={title} className="border-border/60"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{description}</p></CardContent></Card>)}</div></div></section>

        <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Our values</h2><ul className="mt-9 grid gap-4 sm:grid-cols-2">{values.map((value) => <li key={value} className="flex min-h-14 items-center gap-3 rounded-xl border border-border/70 bg-white px-4 py-3"><Check className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span className="font-semibold">{value}</span></li>)}</ul></section>

        <section className="border-t border-primary/15 bg-primary/5"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8"><h2 className="text-3xl font-bold">Find something useful today</h2><p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">Explore free tools and games designed to make learning and everyday decisions a little easier.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Button asChild size="lg"><Link href="/games">Explore Games<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline"><Link href="/money">Explore Tools</Link></Button></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}
