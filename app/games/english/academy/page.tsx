import type { Metadata } from 'next';
import Link from 'next/link';
import { BookOpen, Check, ChevronRight, CreditCard, LockKeyhole, Sparkles, Star, Trophy } from 'lucide-react';
import { GameCard } from '@/components/games/game-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { grammarLevelTwoGames, vocabularyLevelOneGames } from '@/lib/games/academy-games';

export const metadata: Metadata = {
  title: { absolute: 'Zalea English Academy — English Games for Kids | Zalea Studio' },
  description: 'Help children build stronger English skills with interactive grammar and vocabulary games in Zalea English Academy.',
  alternates: { canonical: '/games/english/academy' },
  openGraph: { title: 'Zalea English Academy — English Games for Kids | Zalea Studio', description: 'Preview the planned Grammar Level 2 and Vocabulary Level 1 learning library for young English learners.', url: '/games/english/academy', type: 'website' },
  twitter: { card: 'summary', title: 'Zalea English Academy | Zalea Studio', description: 'Learn. Play. Grow. Preview the planned premium English game library for kids.' },
};

const parentBenefits = ['Learn through play', 'Works on phones and tablets', 'Short 10-question sessions', 'Immediate friendly feedback', 'No complicated setup', 'No advertising inside core gameplay'];
const academyHighlights = ['20-game launch library planned', 'Grammar Level 2', 'Vocabulary Level 1', 'Mobile, tablet and computer friendly', 'One-time purchase planned', 'More English learning areas planned'];

export default function AcademyPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="border-b border-violet-200 bg-violet-50/70"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" /><Link href="/games/english">English Games</Link><ChevronRight className="h-4 w-4" /><span aria-current="page">Academy</span></nav>
      <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.25fr_0.75fr]"><div><Badge className="bg-violet-700 hover:bg-violet-700"><Sparkles className="mr-1 h-4 w-4" />Academy preview</Badge><h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-violet-950 sm:text-5xl lg:text-6xl">Zalea English Academy</h1><p className="mt-4 text-2xl font-semibold text-violet-700">Learn. Play. Grow.</p><p className="mt-5 max-w-2xl text-lg leading-relaxed text-violet-900">Interactive English games designed to help young learners practise grammar and vocabulary at their own pace. Premium access and secure license unlocking are coming soon.</p><Button asChild variant="outline" className="mt-7 min-h-12 border-violet-300 bg-white text-violet-800"><Link href="#academy-library">Preview the Academy Library<ChevronRight className="ml-2 h-5 w-5" /></Link></Button></div>
      <Card className="border-violet-200 bg-white shadow-md"><CardHeader><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Trophy className="h-6 w-6" /></span><CardTitle className="pt-2">Planned launch collection</CardTitle></CardHeader><CardContent><ul className="space-y-3">{academyHighlights.map((item) => <li key={item} className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" /><span>{item}</span></li>)}</ul></CardContent></Card></div>
    </div></section>

    <section id="academy-library" className="mx-auto max-w-[1100px] scroll-mt-20 px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><SectionHeading icon={<BookOpen className="h-6 w-6" />} title="Grammar — Level 2" subtitle="10 premium games that build on the free Grammar Level 1 collection." /><div className="grid gap-5 md:grid-cols-2">{grammarLevelTwoGames.map((game) => <GameCard key={game.slug} game={game} />)}</div></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><SectionHeading icon={<Star className="h-6 w-6" />} title="Vocabulary — Level 1" subtitle="10 visual, child-friendly games for useful everyday English words." /><div className="grid gap-5 md:grid-cols-2">{vocabularyLevelOneGames.map((game) => <GameCard key={game.slug} game={game} />)}</div></div></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-6 lg:grid-cols-2"><Card className="min-w-0 border-border/60"><CardHeader><CardTitle className="text-2xl">Why parents will love it</CardTitle></CardHeader><CardContent><ul className="grid gap-3 sm:grid-cols-2">{parentBenefits.map((item) => <li key={item} className="flex gap-2"><Check className="h-5 w-5 shrink-0 text-green-600" />{item}</li>)}</ul></CardContent></Card>
      <Card id="access" className="min-w-0 scroll-mt-24 border-violet-200 bg-violet-50"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><CreditCard className="h-5 w-5" /></span><CardTitle className="pt-2 text-2xl">One-time purchase</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-violet-900">One payment. No monthly subscription. Keep access to the Academy content included with your purchase.</p><Button disabled className="mt-5 h-auto min-h-12 w-full whitespace-normal py-3 text-center bg-violet-700">Get Academy Access — Coming Soon</Button></CardContent></Card></div></section>

    <section className="border-t border-border/60 bg-secondary/30"><div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 lg:px-8"><LockKeyhole className="mx-auto h-9 w-9 text-violet-700" /><h2 className="mt-4 text-3xl font-bold">Already purchased?</h2><p className="mt-4 leading-relaxed text-muted-foreground">Secure Payhip license validation is not connected yet. The license-key unlock form will become available only after server-side entitlement validation is ready.</p><div className="mx-auto mt-6 flex max-w-lg flex-col gap-3 sm:flex-row"><input disabled aria-label="License key coming soon" placeholder="License key — coming soon" className="min-h-12 flex-1 rounded-md border border-input bg-background px-3 disabled:cursor-not-allowed disabled:opacity-60" /><Button disabled className="min-h-12">Unlock Academy</Button></div></div></section>
  </main><SiteFooter /></div>;
}

function SectionHeading({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return <div className="mb-9 flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">{icon}</span><div><h2 className="text-3xl font-bold tracking-tight">{title}</h2><p className="mt-2 text-muted-foreground">{subtitle}</p></div></div>;
}
