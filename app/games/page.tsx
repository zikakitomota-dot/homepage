import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: { absolute: 'Free Learning Games for Kids | Zalea Studio' },
  description: 'Explore free, mobile-friendly learning games for children from Zalea Studio. Start with English Grammar Level 1.',
  alternates: { canonical: '/games' },
  openGraph: { title: 'Free Learning Games for Kids | Zalea Studio', description: 'Free, friendly learning games for children on mobile, tablet, and computer.', url: '/games', type: 'website' },
};

export default function GamesPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1000px] px-4 py-16 text-center sm:px-6 lg:px-8 lg:py-24">
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">No login required</Badge>
      <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Free Learning Games for Kids</h1>
      <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">Build useful skills through short, friendly games designed for phones, tablets, and computers.</p>
    </div></section>
    <section className="mx-auto max-w-[1000px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <Card className="border-blue-200 shadow-md"><CardHeader><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-primary"><BookOpen className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-2xl">English Games</CardTitle></CardHeader><CardContent><p className="max-w-2xl leading-relaxed text-muted-foreground">Practise articles, pronouns, plurals, verbs, prepositions, and more with 10 completely free Grammar Level 1 games.</p><Button asChild size="lg" className="mt-6 min-h-12"><Link href="/games/english">Explore English Games<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button></CardContent></Card>
    </section>
  </main><SiteFooter /></div>;
}
