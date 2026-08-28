import Link from 'next/link';
import { BookOpen, ChevronRight, Lightbulb, Target } from 'lucide-react';
import { AdditionGameEngine } from '@/components/games/addition-game-engine';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const gamePath = '/games/math/addition-level-1';

export const metadata = createEducationalMetadata({
  title: 'Addition Level 1 – Free Addition Game for Kids | Zalea Studio',
  description: 'Play a free addition game for ages 5–7 with addition within 10, addition within 20 and simple word problems. Ten questions per round, no login required.',
  path: gamePath,
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LearningResource', 'WebApplication'],
      name: 'Addition Level 1',
      description: 'A free, child-friendly addition game with three difficulty modes and ten randomized questions per round.',
      url: `${SITE_URL}${gamePath}`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any modern web browser',
      learningResourceType: 'Educational game',
      educationalLevel: 'Early primary',
      audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
      isAccessibleForFree: true,
      teaches: ['Number sense', 'Addition fluency', 'Addition within 10', 'Addition within 20', 'Simple addition word problems'],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` },
        { '@type': 'ListItem', position: 3, name: 'Addition Level 1', item: `${SITE_URL}${gamePath}` },
      ],
    },
  ],
};

export default function AdditionLevelOnePage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games" className="hover:text-foreground">Learning Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Addition Level 1</span></nav>
      <p className="mt-7 text-sm font-bold uppercase tracking-wider text-primary">Free Zalea Math Game · Ages 5–7</p>
      <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Addition Level 1 – Free Addition Game for Kids</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Build confidence with addition within 10 and 20. Choose a difficulty and play a fresh 10-question round with friendly feedback after every answer.</p>
    </div></section>

    <section className="bg-blue-50/40 px-3 py-8 sm:px-6 sm:py-12"><AdditionGameEngine /></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="addition-skills">
      <h2 id="addition-skills" className="mb-7 text-3xl font-bold tracking-tight">Skills practised</h2>
      <div className="grid gap-5 md:grid-cols-3">
        <Info icon={<Target className="h-6 w-6" />} title="Number sense"><p>Recognise how two quantities join to make a total.</p></Info>
        <Info icon={<BookOpen className="h-6 w-6" />} title="Addition fluency"><p>Practise addition within 10 and 20 through short, replayable rounds.</p></Info>
        <Info icon={<Lightbulb className="h-6 w-6" />} title="Word problems"><p>Connect simple addition equations with familiar everyday situations.</p></Info>
      </div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-secondary/40 p-6 sm:p-8">
        <h2 className="text-2xl font-bold">How to play</h2>
        <p className="mt-4 leading-relaxed text-muted-foreground">Choose Easy, Medium or Hard and press Start Game. Tap one of the four answer buttons, read the feedback, then continue to the next question. After question 10, the game shows the score and lets the learner replay or change difficulty.</p>
        <p className="mt-4 leading-relaxed text-muted-foreground">Questions are generated in the browser without an account, external game service or personal-data collection. Progress and best scores stay on this device.</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3"><Link href="/games" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Explore all Learning Games<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link><Link href="/games/english" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Try free English Games<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></div>
      </div>
    </section>
  </main><SiteFooter /></div>;
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>;
}

