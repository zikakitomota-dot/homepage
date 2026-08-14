import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BadgePercent, Calculator, Divide, Ratio } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const title = 'Free Math Calculators | Zalea Studio';
const description = 'Free online math calculators for percentages, fractions, ratios, averages and everyday calculations with clear formulas and step-by-step explanations.';

export const metadata: Metadata = { title: { absolute: title }, description, alternates: { canonical: '/math' }, openGraph: { title, description, url: '/math', type: 'website' } };

export default function MathToolsPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24"><Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary">Free everyday calculations</Badge><h1 className="mx-auto mt-5 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Free Math Calculators</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">Free online math calculators for percentages, fractions, ratios, averages and everyday calculations. Get instant answers with clear formulas and step-by-step explanations.</p></div></section>
    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="math-calculators-heading"><div className="mb-10"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Choose a calculator</p><h2 id="math-calculators-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Available Math Tools</h2></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"><MathToolCard href="/math/percentage-calculator" title="Percentage Calculator" description="Calculate percentages, percentage change, increases, decreases and reverse percentages with clear steps." icon={<BadgePercent className="h-6 w-6" aria-hidden="true" />} /><MathToolCard href="/math/fraction-calculator" title="Fraction Calculator" description="Add, subtract, multiply and divide fractions or mixed numbers with simplified answers and clear steps." icon={<Divide className="h-6 w-6" aria-hidden="true" />} /><MathToolCard href="/math/ratio-calculator" title="Ratio Calculator" description="Simplify ratios, find equivalent ratios and solve proportions or missing values with clear step-by-step results." icon={<Ratio className="h-6 w-6" aria-hidden="true" />} /></div></section>
    <section className="border-t border-border/60 bg-secondary/30"><div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-20"><Calculator className="mx-auto h-10 w-10 text-primary" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold tracking-tight">Math made clearer</h2><p className="mt-5 text-lg leading-relaxed text-muted-foreground">Math Tools are designed for quick everyday calculations without accounts or external services. Each result includes the formula used so you can understand the answer as well as calculate it.</p></div></section>
  </main><SiteFooter /></div>;
}

function MathToolCard({ href, title, description, icon }: { href: string; title: string; description: string; icon: React.ReactNode }) {
  return <Link href={href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><Card className="h-full border-border/60 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md"><CardHeader><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span><CardTitle className="flex items-center justify-between gap-3 text-xl">{title}<ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" /></CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{description}</p></CardContent></Card></Link>;
}
