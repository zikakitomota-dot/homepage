import Link from 'next/link';
import { ArrowRight, BookOpen, Check, ChevronRight, Languages, Sparkles } from 'lucide-react';
import { GameCard } from '@/components/games/game-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { englishGames } from '@/lib/games/english-games';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata = createEducationalMetadata({
  title: 'Free English Games for Kids | Grammar & Learning Games | Zalea Studio',
  description: 'Play free English games for kids with grammar activities covering articles, pronouns, plurals, verbs, prepositions and more. No login required.',
  path: '/games/english',
});

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      name: 'Free English Games for Kids',
      url: `${SITE_URL}/games/english`,
      description: 'Ten free, mobile-friendly English grammar games for early primary learners.',
      isAccessibleForFree: true,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` },
        { '@type': 'ListItem', position: 3, name: 'English Games', item: `${SITE_URL}/games/english` },
      ],
    },
  ],
};

export default function EnglishGamesPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(pageJsonLd) }} />
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games" className="hover:text-foreground">Free Tools / Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">English Games</span></nav>
      <Badge className="mt-7 bg-green-100 text-green-800 hover:bg-green-100">10 free games · No login</Badge>
      <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Free English Games for Kids</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Children ages 5–8 can practise articles, plurals, pronouns, verbs, possessives and prepositions through short interactive activities. Every free game works on phones, tablets and computers, with no account or login required.</p>
      <div className="mt-7 flex flex-wrap gap-3"><Button asChild variant="outline"><Link href="#grammar-level-one">Free Games</Link></Button><Button asChild className="bg-violet-700 hover:bg-violet-800"><Link href="/games/english/academy">Zalea English Academy<Sparkles className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div>
    </div></section>
    <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="grammar-level-one">
      <div className="mb-9 flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-6 w-6" aria-hidden="true" /></span><div><Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100">FREE</Badge><h2 id="grammar-level-one" className="text-3xl font-bold tracking-tight">Grammar — Level 1</h2><p className="mt-2 text-muted-foreground">10 free games. No login required.</p></div></div>
      <div className="grid gap-5 md:grid-cols-2">{englishGames.map((game) => <GameCard key={game.slug} game={game} />)}</div>
    </section>
    <section className="border-y border-violet-200 bg-violet-50/70"><div className="mx-auto max-w-[900px] px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-20">
      <Sparkles className="mx-auto h-10 w-10 text-violet-700" aria-hidden="true" /><Badge className="mt-4 bg-violet-100 text-violet-800 hover:bg-violet-100">ACADEMY</Badge><h2 className="mt-3 text-3xl font-bold tracking-tight text-violet-950 sm:text-4xl">Ready for the next level?</h2>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-violet-900">Zalea English Academy – Lifetime Access adds two learning areas while the Grammar Level 1 collection stays completely free.</p>
      <div className="mx-auto mt-7 grid max-w-2xl gap-3 text-left sm:grid-cols-2">{['Grammar Level 2 — 10 games', 'Vocabulary Level 1 — 10 games', 'Three difficulty modes', 'Mobile, tablet and desktop friendly', 'One-time purchase', 'Lifetime Access'].map((feature) => <p key={feature} className="flex items-start gap-2 font-medium text-violet-950"><Check className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" aria-hidden="true" />{feature}</p>)}</div>
      <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3" aria-label="English learning areas"><div className="rounded-xl border border-green-200 bg-white p-4"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">FREE</Badge><p className="mt-2 font-bold">Grammar Level 1</p></div><div className="rounded-xl border border-violet-200 bg-white p-4"><Badge className="bg-violet-100 text-violet-800 hover:bg-violet-100">ACADEMY</Badge><p className="mt-2 font-bold">Grammar Level 2</p></div><div className="rounded-xl border border-violet-200 bg-white p-4"><Badge className="bg-violet-100 text-violet-800 hover:bg-violet-100">ACADEMY</Badge><p className="mt-2 font-bold">Vocabulary Level 1</p></div></div>
      <Button asChild size="lg" className="mt-7 min-h-12 bg-violet-700 hover:bg-violet-800"><Link href="/games/english/academy">Explore Zalea English Academy<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button>
    </div></section>
    <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-5 rounded-2xl border border-border/60 bg-white p-6 sm:grid-cols-3 sm:p-8"><div><Languages className="h-7 w-7 text-primary" aria-hidden="true" /><h2 className="mt-3 text-xl font-bold">Choose a learning path</h2><p className="mt-2 leading-relaxed text-muted-foreground">Use these parent-friendly guides to find suitable practice without another login or complicated setup.</p></div><div><Link href="/grammar-games-for-kids" className="font-semibold text-primary hover:underline">English Grammar Games</Link><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Explore what each free Level 1 grammar game teaches.</p></div><div><Link href="/vocabulary-games-for-kids" className="font-semibold text-primary hover:underline">Vocabulary Games for Kids</Link><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Learn about the Academy vocabulary topics available with Lifetime Access.</p></div></div></section>
    <section className="border-t border-border/60 bg-secondary/30"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8"><h2 className="text-3xl font-bold">Learning that fits everyday life</h2><p className="mt-5 leading-relaxed text-muted-foreground">Each game selects 10 questions from a larger original question bank, gives immediate child-friendly feedback, and works without an account. Children can practise independently or play with a parent or teacher. Progress stays on the device and never includes a child&apos;s name, age, school, or contact details.</p></div></section>
  </main><SiteFooter /></div>;
}
