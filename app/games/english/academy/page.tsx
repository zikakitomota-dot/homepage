import type { Metadata } from 'next';
import Link from 'next/link';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CreditCard,
  Heart,
  LockKeyhole,
  MessageCircleHeart,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';
import { GameCard } from '@/components/games/game-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { grammarLevelTwoGames, vocabularyLevelOneGames } from '@/lib/games/academy-games';

export const metadata: Metadata = {
  title: { absolute: 'Zalea English Academy – Lifetime Access | Zalea Studio' },
  description: 'Help children build stronger English skills through interactive grammar and vocabulary games. One payment. Lifetime access. Works on phones, tablets and computers.',
  alternates: { canonical: '/games/english/academy' },
  openGraph: {
    title: 'Zalea English Academy – Lifetime Access',
    description: 'Help children build stronger English skills through interactive grammar and vocabulary games. One payment. Lifetime access.',
    url: '/games/english/academy',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Zalea English Academy – Lifetime Access',
    description: 'Learn. Play. Grow. Interactive English practice for young learners, with one payment and Lifetime Access.',
  },
};

const parentBenefits = [
  'Learn through play',
  'Designed for short daily practice',
  'Works on phones, tablets and computers',
  'Immediate friendly feedback',
  'Child-friendly design',
  'No complicated setup',
  'One payment',
  'Future Academy updates included',
];

const academyHighlights = [
  '20 Interactive Games',
  'Grammar Level 2',
  'Vocabulary Level 1',
  'Mobile, tablet and computer friendly',
  'One-time purchase',
  'Lifetime access',
  'Future Academy updates included',
];

const learningJourney = [
  { icon: '🌱', eyebrow: 'Free now', title: 'Grammar Level 1', detail: '10 free games' },
  { icon: '🚀', eyebrow: 'Lifetime Access', title: 'Grammar Level 2', detail: '10 Academy games' },
  { icon: '🎨', eyebrow: 'Lifetime Access', title: 'Vocabulary Level 1', detail: '10 Academy games' },
  { icon: '📖', eyebrow: 'Future learning area', title: 'Reading Level 1', detail: 'Grow reading confidence' },
  { icon: '🧩', eyebrow: 'Future learning area', title: 'Sentence Builder', detail: 'Create stronger sentences' },
  { icon: '🏆', eyebrow: 'Learning goal', title: 'English Champion', detail: 'Keep learning and growing' },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-violet-200 bg-violet-50/70">
          <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" />
              <Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" />
              <Link href="/games/english">English Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" />
              <span aria-current="page">Academy</span>
            </nav>
            <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <Badge className="bg-violet-700 hover:bg-violet-700"><Sparkles className="mr-1 h-4 w-4" aria-hidden="true" />Lifetime Access · Launching Soon</Badge>
                <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-violet-950 sm:text-5xl lg:text-6xl">Zalea English Academy</h1>
                <p className="mt-4 text-2xl font-semibold text-violet-700">Learn. Play. Grow.</p>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-violet-900">Help your child build confidence in English through short, fun interactive games designed for everyday learning.</p>
                <p className="mt-3 max-w-2xl leading-relaxed text-violet-800">Children get enjoyable practice at their own pace, while parents get a simple learning experience that works across phones, tablets and computers.</p>
                <Button asChild variant="outline" className="mt-7 min-h-12 border-violet-300 bg-white text-violet-800 hover:bg-violet-100 hover:text-violet-900"><Link href="#academy-library">Preview Academy<ChevronRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button>
              </div>
              <Card className="border-violet-200 bg-white shadow-md ring-1 ring-violet-100">
                <CardHeader><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Trophy className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="pt-2">Launch Collection</CardTitle></CardHeader>
                <CardContent><ul className="space-y-3">{academyHighlights.map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span>{item}</span></li>)}</ul></CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="learning-journey">
          <div className="text-center"><p className="text-sm font-bold uppercase tracking-wider text-violet-700">A path that grows with them</p><h2 id="learning-journey" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Your Child&apos;s Learning Journey</h2><p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">Start with free grammar practice, then keep building confidence through the Academy&apos;s current and future learning areas.</p></div>
          <ol className="mx-auto mt-10 max-w-2xl">
            {learningJourney.map((step, index) => <li key={step.title} className="relative">
              <div className="flex min-w-0 gap-4 rounded-2xl border border-border/70 bg-white p-5 shadow-sm"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-2xl" aria-hidden="true">{step.icon}</span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-wider text-violet-700">{step.eyebrow}</p><h3 className="mt-1 text-xl font-bold">{step.title}</h3><p className="mt-1 text-sm text-muted-foreground">{step.detail}</p></div></div>
              {index < learningJourney.length - 1 && <div className="flex h-10 items-center justify-center text-violet-400" aria-hidden="true"><ChevronDown className="h-6 w-6" /></div>}
            </li>)}
          </ol>
        </section>

        <section id="academy-library" className="border-t border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-[1100px] scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading icon={<BookOpen className="h-6 w-6" />} title="Grammar — Level 2" subtitle="10 Academy games that build on the free Grammar Level 1 collection." />
            <div className="grid gap-5 md:grid-cols-2">{grammarLevelTwoGames.map((game) => <GameCard key={game.slug} game={game} />)}</div>
          </div>
        </section>
        <section className="border-y border-border/60">
          <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <SectionHeading icon={<Star className="h-6 w-6" />} title="Vocabulary — Level 1" subtitle="10 visual, child-friendly games for useful everyday English words." />
            <div className="grid gap-5 md:grid-cols-2">{vocabularyLevelOneGames.map((game) => <GameCard key={game.slug} game={game} />)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="min-w-0 border-border/60"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-700"><Heart className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="pt-2 text-2xl">Why parents will love it</CardTitle></CardHeader><CardContent><ul className="grid gap-3 sm:grid-cols-2">{parentBenefits.map((item) => <li key={item} className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />{item}</li>)}</ul></CardContent></Card>
            <Card id="access" className="min-w-0 scroll-mt-24 border-violet-200 bg-violet-50 ring-1 ring-violet-100"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><CreditCard className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="pt-2 text-2xl">Zalea English Academy – Lifetime Access</CardTitle></CardHeader><CardContent><p className="font-semibold text-violet-950">One payment. No monthly subscription.</p><p className="mt-3 leading-relaxed text-violet-900">Unlock every Academy game included in your purchase and receive future Academy updates at no additional cost.</p><Button disabled className="mt-5 h-auto min-h-12 w-full whitespace-normal bg-violet-700 py-3 text-center">Get Lifetime Access — Launching Soon</Button></CardContent></Card>
          </div>
        </section>

        <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8"><MessageCircleHeart className="mx-auto h-10 w-10 text-violet-700" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold">Trusted by Parents</h2><p className="mt-4 text-lg text-muted-foreground">Parent reviews coming soon.</p></div></section>

        <section><div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 lg:px-8"><LockKeyhole className="mx-auto h-9 w-9 text-violet-700" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold">Already purchased?</h2><p className="mt-4 leading-relaxed text-muted-foreground">Lifetime Access customers will use their Payhip license key here when the Academy opens.</p><div className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"><input disabled aria-label="License key access opens with launch" placeholder="License key" className="min-h-12 flex-1 rounded-md border border-input bg-background px-3 disabled:cursor-not-allowed disabled:opacity-60" /><Button disabled className="h-auto min-h-12 whitespace-normal py-3">Unlock Academy — Opening Soon</Button></div></div></section>
      </main>
      <SiteFooter />
    </div>
  );
}

function SectionHeading({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return <div className="mb-9 flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">{icon}</span><div><h2 className="text-3xl font-bold tracking-tight">{title}</h2><p className="mt-2 text-muted-foreground">{subtitle}</p></div></div>;
}
