import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Languages } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createEducationalMetadata } from '@/lib/seo';

export const metadata = createEducationalMetadata({
  title: 'Free Learning Games for Kids | Zalea Studio',
  description: 'Explore free, mobile-friendly learning games for children. Start with English Grammar Level 1—no account or login required.',
  path: '/games',
});

export default function GamesPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1000px] px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">No login required</Badge>
      <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Free Learning Games for Kids</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Build useful skills through short, friendly games designed for phones, tablets, and computers.</p>
    </div></section>
    <section className="mx-auto max-w-[1000px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <Card className="border-blue-200 shadow-md"><CardHeader><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-primary"><BookOpen className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-2xl">English Games</CardTitle></CardHeader><CardContent><p className="max-w-2xl leading-relaxed text-muted-foreground">Practise articles, pronouns, plurals, verbs, prepositions, and more with 10 completely free Grammar Level 1 games.</p><Button asChild size="lg" className="mt-6 min-h-12"><Link href="/games/english">Explore English Games<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button></CardContent></Card>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Card className="border-border/60"><CardHeader><GraduationCap className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">English learning guide</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">See how the free games and Academy learning areas fit together for children, parents and teachers.</p><Link href="/english-games-for-kids" className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">English games for kids<ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></CardContent></Card>
        <Card className="border-border/60"><CardHeader><Languages className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">Grammar and vocabulary</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">Browse free grammar practice or learn what is included in the Academy vocabulary collection.</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2"><Link href="/grammar-games-for-kids" className="font-semibold text-primary hover:underline">Grammar games</Link><Link href="/vocabulary-games-for-kids" className="font-semibold text-primary hover:underline">Vocabulary games</Link></div></CardContent></Card>
      </div>
    </section>
  </main><SiteFooter /></div>;
}
