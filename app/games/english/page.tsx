import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';
import { GameCard } from '@/components/games/game-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { englishGames } from '@/lib/games/english-games';

export const metadata: Metadata = {
  title: { absolute: 'Free English Games for Kids | Zalea Studio' },
  description: 'Play free English grammar games for kids. Practise articles, pronouns, plurals, verbs, prepositions and more with fun mobile-friendly learning games.',
  alternates: { canonical: '/games/english' },
  openGraph: { title: 'Free English Games for Kids | Zalea Studio', description: 'Ten free Grammar Level 1 games for children ages 5–8. No login required.', url: '/games/english', type: 'website' },
  twitter: { card: 'summary', title: 'Free English Games for Kids | Zalea Studio', description: 'Play 10 free, mobile-friendly English grammar games for kids.' },
};

export default function EnglishGamesPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games" className="hover:text-foreground">Free Tools / Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">English Games</span></nav>
      <Badge className="mt-7 bg-green-100 text-green-800 hover:bg-green-100">10 free games · No login</Badge>
      <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Free English Games for Kids</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Practise English grammar, vocabulary, and reading through fun interactive games. No login required.</p>
    </div></section>
    <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="grammar-level-one">
      <div className="mb-9 flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-6 w-6" aria-hidden="true" /></span><div><h2 id="grammar-level-one" className="text-3xl font-bold tracking-tight">Grammar — Level 1</h2><p className="mt-2 text-muted-foreground">Fun grammar practice for children beginning to learn English.</p></div></div>
      <div className="grid gap-5 md:grid-cols-2">{englishGames.map((game) => <GameCard key={game.slug} game={game} />)}</div>
    </section>
    <section className="border-t border-border/60 bg-secondary/30"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8"><h2 className="text-3xl font-bold">Learning that fits everyday life</h2><p className="mt-5 leading-relaxed text-muted-foreground">Each game selects 10 questions from a larger original question bank, gives immediate child-friendly feedback, and works without an account. Children can practise independently or play with a parent or teacher. Progress stays on the device and never includes a child&apos;s name, age, school, or contact details.</p></div></section>
  </main><SiteFooter /></div>;
}
