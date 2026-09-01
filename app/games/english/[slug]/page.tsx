import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, ChevronRight, Lightbulb, LockKeyhole, Target } from 'lucide-react';
import { GameEngine } from '@/components/games/game-engine';
import { AcademyDiscoveryCard } from '@/components/games/academy-cta';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { canAccessGame } from '@/lib/games/access';
import { academyGames } from '@/lib/games/academy-games';
import { getEnglishGameGuide, type EnglishGameGuide } from '@/lib/games/english-game-guides';
import { englishGames, getEnglishGame } from '@/lib/games/english-games';
import type { AcademyGameSummary, EnglishGame } from '@/lib/games/types';
import { ACADEMY_SOCIAL_IMAGE, createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { PAYHIP_ACADEMY_URL, SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

// Academy routes read an HttpOnly entitlement cookie on every request.
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  // Free games can be pre-rendered. Academy slugs must be resolved at request
  // time so the server can validate the signed entitlement cookie.
  return englishGames.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const game = getEnglishGame(slug);
  const academyGame = academyGames.find((candidate) => candidate.slug === slug);
  if (!game && !academyGame) return {};
  if (academyGame) {
    const title = `${academyGame.title} | Zalea English Academy`;
    const metadata = createEducationalMetadata({
      title,
      description: academyGame.shortDescription,
      path: `/games/english/${academyGame.slug}`,
      image: ACADEMY_SOCIAL_IMAGE,
    });
    return {
      ...metadata,
      robots: {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      },
    };
  }
  if (!game) return {};
  const title = `${game.title} Grammar Game for Kids | Zalea Studio`;
  const url = `/games/english/${game.slug}`;
  return createEducationalMetadata({ title, description: game.seoDescription, path: url });
}

export default async function EnglishGamePage({ params }: Props) {
  const slug = (await params).slug;
  const game = getEnglishGame(slug);
  const academyGame = academyGames.find((candidate) => candidate.slug === slug);
  if (!game && !academyGame) notFound();
  if (academyGame) {
    if (!(await canAccessGame('premium'))) return <LockedAcademyGame game={academyGame} />;
    // This server-only module is reached only after the signed cookie passes.
    const { getPremiumEnglishGame, premiumEnglishGames } = await import('@/lib/games/premium/index.server');
    const premiumGame = getPremiumEnglishGame(slug);
    if (!premiumGame) notFound();
    const currentIndex = premiumEnglishGames.findIndex((candidate) => candidate.slug === slug);
    const nextGame = premiumEnglishGames[(currentIndex + 1) % premiumEnglishGames.length];
    return <PremiumGamePage game={premiumGame} nextGame={nextGame} />;
  }
  if (!game) notFound();
  if (!(await canAccessGame(game.access))) notFound();
  const guide = getEnglishGameGuide(game.slug);
  if (!guide) notFound();
  const currentIndex = englishGames.findIndex(({ slug }) => slug === game.slug);
  const nextGame = englishGames[(currentIndex + 1) % englishGames.length];
  const gameUrl = `${SITE_URL}/games/english/${game.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['LearningResource', 'WebApplication'],
        name: game.title,
        description: game.seoDescription,
        url: gameUrl,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any modern web browser',
        learningResourceType: 'Educational game',
        educationalLevel: 'Early primary',
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
        isAccessibleForFree: true,
        teaches: game.learningObjective,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` },
          { '@type': 'ListItem', position: 3, name: 'English Games', item: `${SITE_URL}/games/english` },
          { '@type': 'ListItem', position: 4, name: game.title, item: gameUrl },
        ],
      },
    ],
  };

  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games" className="hover:text-foreground">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games/english" className="hover:text-foreground">English Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">{game.title}</span></nav>
      <h1 className="mt-7 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{game.title} – Free English Grammar Game</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{game.shortDescription} Play 10 random questions and get friendly feedback after every answer.</p>
    </div></section>
    <section className="bg-blue-50/40 px-3 py-8 sm:px-6 sm:py-12"><GameEngine game={game} nextGame={nextGame} /></section>
    <EducationalGuide guide={guide} gameTitle={game.title} />
    <section className="mx-auto max-w-[1000px] px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20"><div className="rounded-2xl border border-border/60 bg-secondary/40 p-6 sm:p-8"><h2 className="text-2xl font-bold">How to play</h2><p className="mt-4 leading-relaxed text-muted-foreground">Choose Easy, Medium or Hard, press Start Game, then read each question and tap the answer that fits best. A session contains 10 questions, explains each answer and keeps a separate best score for each difficulty on this device.</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3"><Link href="/games/english" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">All free English games<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link><Link href="/grammar-games-for-kids" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Grammar learning guide<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link><Link href="/english-games-for-kids" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">English learning guide<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></div></div><div className="mt-10"><AcademyDiscoveryCard /></div></section>
  </main><SiteFooter /></div>;
}

function LockedAcademyGame({ game }: { game: AcademyGameSummary }) {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><section className="border-b border-violet-200 bg-violet-50/70"><div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" /><Link href="/games/english">English Games</Link><ChevronRight className="h-4 w-4" /><Link href="/games/english/academy">Academy</Link><ChevronRight className="h-4 w-4" /><span>{game.title}</span></nav><div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-violet-200 bg-white p-6 text-center shadow-lg sm:p-10"><LockKeyhole className="mx-auto h-12 w-12 text-violet-700" aria-hidden="true" /><p className="mt-5 text-sm font-bold uppercase tracking-wider text-violet-700">Zalea English Academy</p><h1 className="mt-3 text-3xl font-bold">{game.title}</h1><p className="mt-5 text-lg font-semibold">This game is included with Lifetime Access.</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><Button asChild className="min-h-12"><a href={PAYHIP_ACADEMY_URL} target="_blank" rel="noreferrer">Get Lifetime Access</a></Button><Button asChild variant="outline" className="min-h-12"><Link href="/games/english/academy#access">Unlock Academy</Link></Button></div><Link href="/games/english/academy" className="mt-6 inline-block min-h-11 font-semibold text-primary hover:underline">Back to Academy</Link></div></div></section></main><SiteFooter /></div>;
}

function PremiumGamePage({ game, nextGame }: { game: EnglishGame; nextGame: EnglishGame }) {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><section className="border-b border-violet-200 bg-violet-50/70"><div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" /><Link href="/games/english">English Games</Link><ChevronRight className="h-4 w-4" /><Link href="/games/english/academy">Academy</Link><ChevronRight className="h-4 w-4" /><span>{game.title}</span></nav><p className="mt-7 text-sm font-bold uppercase tracking-wider text-violet-700">Zalea English Academy</p><h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{game.title}</h1><p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{game.shortDescription} Play 10 random questions at the difficulty you choose.</p></div></section><section className="bg-violet-50/40 px-3 py-8 sm:px-6 sm:py-12"><GameEngine game={game} nextGame={nextGame} /></section><section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8"><div className="grid gap-5 md:grid-cols-3"><Info icon={<BookOpen className="h-6 w-6" />} title="What does this game teach?"><p>{game.whatItTeaches}</p></Info><Info icon={<Target className="h-6 w-6" />} title="Learning objective"><p>{game.learningObjective}</p></Info><Info icon={<Lightbulb className="h-6 w-6" />} title="Parent & teacher tip"><p>{game.parentTip}</p></Info></div><Link href="/games/english/academy#academy-library" className="mt-8 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Back to Academy<ChevronRight className="ml-1 h-4 w-4" /></Link></section></main><SiteFooter /></div>;
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>;
}

function EducationalGuide({ guide, gameTitle }: { guide: EnglishGameGuide; gameTitle: string }) {
  return <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="grammar-guide">
    <div className="max-w-3xl"><p className="text-sm font-bold uppercase tracking-wider text-primary">Grammar guide for {gameTitle}</p><h2 id="grammar-guide" className="mt-2 text-3xl font-bold tracking-tight">{guide.heading}</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">{guide.introduction}</p>{guide.explanation.map((paragraph) => <p key={paragraph} className="mt-4 leading-relaxed text-muted-foreground">{paragraph}</p>)}</div>

    <div className={`mt-9 grid gap-5 ${guide.table ? 'lg:grid-cols-2' : ''}`}>
      <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><BookOpen className="h-6 w-6" /></span><CardTitle className="pt-2 text-xl">Examples to read aloud</CardTitle></CardHeader><CardContent><ul className="grid gap-3 sm:grid-cols-2">{guide.examples.map((example) => <li key={example} className="rounded-lg bg-secondary/50 px-4 py-3 font-medium">{example}</li>)}</ul></CardContent></Card>
      {guide.table && <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Lightbulb className="h-6 w-6" /></span><CardTitle className="pt-2 text-xl">The pattern at a glance</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full table-fixed border-collapse text-left"><caption className="sr-only">{guide.table.caption}</caption><thead><tr>{guide.table.headers.map((header) => <th key={header || 'blank'} className="break-words border-b border-border px-2 py-2 text-sm">{header}</th>)}</tr></thead><tbody>{guide.table.rows.map((row) => <tr key={row.join('-')}>{row.map((cell, index) => <td key={`${cell}-${index}`} className="break-words border-b border-border/60 px-2 py-3 text-sm last:font-semibold">{cell}</td>)}</tr>)}</tbody></table></div></CardContent></Card>}
    </div>

    <div className="mt-5 grid gap-5 lg:grid-cols-2">
      <Card className="border-amber-200 bg-amber-50/50"><CardHeader><CardTitle className="text-xl">Common mistakes to notice</CardTitle></CardHeader><CardContent><ul className="space-y-5">{guide.mistakes.map((mistake) => <li key={mistake.wrong}><p className="font-medium text-muted-foreground"><span className="line-through">{mistake.wrong}</span> <span aria-hidden="true">→</span> <strong className="text-foreground">{mistake.correct}</strong></p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{mistake.note}</p></li>)}</ul></CardContent></Card>
      <Card className="border-blue-200 bg-blue-50/50"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Target className="h-6 w-6" /></span><CardTitle className="pt-2 text-xl">{guide.practice.title}</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{guide.practice.text}</p></CardContent></Card>
    </div>

    {guide.relatedGames && <div className="mt-8 rounded-2xl border border-border/60 bg-white p-6 sm:p-8"><h3 className="text-xl font-bold">Related practice</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{guide.relatedGames.map((related) => <div key={related.href}><Link href={related.href} className="font-semibold text-primary hover:underline">{related.title}</Link><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{related.note}</p></div>)}</div></div>}
  </section>;
}
