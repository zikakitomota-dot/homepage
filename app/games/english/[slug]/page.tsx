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

const pageSpecificPlayGuidance: Partial<Record<string, { heading: string; text: string; academyHeading: string; academyDescription: string }>> = {
  'a-or-an': {
    heading: 'Say the noun and listen for its first sound',
    text: 'Read the noun aloud before choosing. Ask the learner whether the first sound opens smoothly like apple or begins with a consonant sound like book. This listening step matters more than memorising the first written letter: an hour and a uniform begin with different sounds from what their first letters might suggest.',
    academyHeading: 'Move from article clues to complete noun phrases',
    academyDescription: 'This free activity isolates a and an. Academy activities provide additional sentence contexts after the learner can hear the opening-sound clue reliably.',
  },
  'one-or-many': {
    heading: 'Count first, then choose',
    text: 'Choose a difficulty and start the game. Before looking at the answer buttons, ask the child to count or notice the number clue. After choosing one or many, read the completed phrase aloud. The ten-question session keeps a separate best score for each difficulty on this device.',
    academyHeading: 'Continue from number clues to sentence clues',
    academyDescription: 'The free game practises singular and plural recognition. Zalea English Academy adds broader grammar and themed vocabulary activities when the learner is ready to apply words in more sentence contexts.',
  },
  'he-she-it': {
    heading: 'Name the person or thing before replacing it',
    text: 'Point to the subject in the prompt and say its noun first: “the girl,” “the dog,” or “the chair.” Then replace that noun with he, she or it. Keeping the noun visible for the first few rounds helps the child understand that a pronoun refers back to somebody or something.',
    academyHeading: 'Extend subject choices into longer sentences',
    academyDescription: 'The free game concentrates on three singular pronouns. Academy grammar practice adds wider sentence patterns once that reference is secure.',
  },
  'is-am-are': {
    heading: 'Build the subject-and-verb pair aloud',
    text: 'Cover the answer choices briefly and read only the subject. Have the learner complete a short pair—“I am,” “she is,” or “they are”—before returning to the whole sentence. Sorting small cards headed I, one person or thing, and you/we/they can make the three patterns easier to compare.',
    academyHeading: 'Use agreement clues in more sentence patterns',
    academyDescription: 'This game practises present-tense forms of be. Academy activities broaden the contexts in which learners must notice the subject before choosing a verb.',
  },
  'can-or-cant': {
    heading: 'Think about the action before the word',
    text: 'Choose a difficulty and start the game. Read the subject and action together, decide whether the action is possible in the sentence, then choose can or can’t. Ask the learner to say the complete answer aloud before continuing. The ten-question session explains each answer and stores scores only on this device.',
    academyHeading: 'Build from ability sentences to wider language practice',
    academyDescription: 'This free activity focuses narrowly on can and can’t. The Academy collection adds new grammar patterns and themed vocabulary for learners who want a broader set of short practice games.',
  },
  'who-is-it': {
    heading: 'Find who is speaking and who is being described',
    text: 'Use two quick questions: “Who is talking?” and “Who or what are they talking about?” Pointing to real people, a group, or an object helps distinguish I, you, he, she, it, we and they. Ask the learner to explain the reference, not only repeat the pronoun.',
    academyHeading: 'Carry pronoun meaning into varied contexts',
    academyDescription: 'The free questions focus on identifying people and things. Academy activities add vocabulary and grammar contexts where the same pronouns support fuller meaning.',
  },
  'whose-is-it': {
    heading: 'Match the owner before choosing the possessive word',
    text: 'Place an everyday item beside its owner and say both parts: “Maya has the pencil; it is her pencil.” Then swap the owner or use two owners to hear how my, your, his, her, our and their change. The ownership clue should be identified before the answer buttons are considered.',
    academyHeading: 'Apply ownership words beyond isolated examples',
    academyDescription: 'This free game focuses on possessive determiners. Academy practice offers additional sentences and vocabulary after the owner-to-word relationship is understood.',
  },
  'where-is-it': {
    heading: 'Move one object and describe the change',
    text: 'Use a cup and a small toy to demonstrate in, on, under, behind, in front of and next to. Move only the toy, then ask the child to say a complete location phrase before answering. Contrasting behind with in front of in the same setup is especially useful.',
    academyHeading: 'Use position language with a wider vocabulary',
    academyDescription: 'The free game isolates common position words. Academy activities add more vocabulary contexts while keeping short, repeatable sessions.',
  },
  'this-that-these-those': {
    heading: 'Check two clues: number, then distance',
    text: 'First decide whether the prompt shows one item or more than one. Then decide whether it is near or farther away. A four-box grid—one near, one far, many near, many far—lets the learner place this, that, these and those by meaning instead of guessing from sound.',
    academyHeading: 'Combine demonstratives with richer noun phrases',
    academyDescription: 'This free activity makes number and distance explicit. Academy practice adds broader language contexts after both clues can be used together.',
  },
  'has-or-have': {
    heading: 'Replace the subject with a pronoun first',
    text: 'If the subject is a name or noun, replace it aloud: “Lina” becomes “she,” while “the children” becomes “they.” Then use the familiar pair she has or they have. This prevents the nearest noun in a longer sentence from distracting the learner from the true subject.',
    academyHeading: 'Use subject agreement in longer sentences',
    academyDescription: 'The free game contrasts has and have. Academy grammar activities add new patterns where learners can reuse the same subject-checking habit.',
  },
};

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
  const playGuidance = pageSpecificPlayGuidance[game.slug];
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
    <section className="mx-auto max-w-[1000px] px-4 pb-14 sm:px-6 lg:px-8 lg:pb-20"><div className="rounded-2xl border border-border/60 bg-secondary/40 p-6 sm:p-8"><h2 className="text-2xl font-bold">{playGuidance?.heading ?? 'How to play'}</h2><p className="mt-4 leading-relaxed text-muted-foreground">{playGuidance?.text ?? 'Choose Easy, Medium or Hard, press Start Game, then read each question and tap the answer that fits best. A session contains 10 questions, explains each answer and keeps a separate best score for each difficulty on this device.'}</p><div className="mt-6 flex flex-wrap gap-x-6 gap-y-3"><Link href="/games/english" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">All free English games<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link><Link href="/grammar-games-for-kids" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Grammar learning guide<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link><Link href="/english-games-for-kids" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">English learning guide<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></div></div><div className="mt-10"><AcademyDiscoveryCard heading={playGuidance?.academyHeading} description={playGuidance?.academyDescription} /></div></section>
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
