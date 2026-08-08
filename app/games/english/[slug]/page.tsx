import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, ChevronRight, Lightbulb, Target } from 'lucide-react';
import { GameEngine } from '@/components/games/game-engine';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { canAccessGame } from '@/lib/games/access';
import { englishGames, getEnglishGame } from '@/lib/games/english-games';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return englishGames.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const game = getEnglishGame((await params).slug);
  if (!game) return {};
  const title = `${game.title} Free English Grammar Game for Kids | Zalea Studio`;
  const url = `/games/english/${game.slug}`;
  return {
    title: { absolute: title }, description: game.seoDescription, alternates: { canonical: url },
    openGraph: { title, description: game.seoDescription, url, type: 'website' },
    twitter: { card: 'summary', title, description: game.seoDescription },
  };
}

export default async function EnglishGamePage({ params }: Props) {
  const game = getEnglishGame((await params).slug);
  if (!game) notFound();
  if (!canAccessGame(game.access)) notFound();
  const currentIndex = englishGames.findIndex(({ slug }) => slug === game.slug);
  const nextGame = englishGames[(currentIndex + 1) % englishGames.length];
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'LearningResource', name: game.title,
    description: game.seoDescription, url: `https://zaleastudio.com/games/english/${game.slug}`,
    learningResourceType: 'Educational game', educationalLevel: 'Early primary', isAccessibleForFree: true,
    teaches: game.learningObjective,
  };

  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games" className="hover:text-foreground">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games/english" className="hover:text-foreground">English Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">{game.title}</span></nav>
      <h1 className="mt-7 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{game.title} – Free English Grammar Game</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{game.shortDescription} Play 10 random questions and get friendly feedback after every answer.</p>
    </div></section>
    <section className="bg-blue-50/40 px-3 py-8 sm:px-6 sm:py-12"><GameEngine game={game} nextGame={nextGame} /></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-5 md:grid-cols-3">
      <Info icon={<BookOpen className="h-6 w-6" />} title="What does this game teach?"><p>{game.whatItTeaches}</p></Info>
      <Info icon={<Target className="h-6 w-6" />} title="Learning objective"><p>{game.learningObjective}</p></Info>
      <Info icon={<Lightbulb className="h-6 w-6" />} title="Parent & teacher tip"><p>{game.parentTip}</p></Info>
    </div><div className="mt-10 rounded-2xl border border-border/60 bg-secondary/40 p-6 sm:p-8"><h2 className="text-2xl font-bold">How to play</h2><p className="mt-4 leading-relaxed text-muted-foreground">Press Start Game, read each question, and tap the answer that fits best. The game explains the answer before the Next Question button appears. A session contains 10 different questions selected from a bank of {game.questions.length}, so replaying gives useful extra practice. At the end, children see an encouraging score and can play again or choose another free English game.</p><Link href="/games/english" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Back to all English Games<ChevronRight className="ml-1 h-4 w-4" /></Link></div></section>
  </main><SiteFooter /></div>;
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>;
}
