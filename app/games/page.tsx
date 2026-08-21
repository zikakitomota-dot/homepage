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
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">A useful place to start</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Choose a learning path</h2><p className="mt-4 leading-relaxed text-muted-foreground">Children can begin with a focused grammar skill, practise several Level 1 topics, or use the English learning guide to choose an activity that matches their needs. Each free game works directly in the browser, so families and classrooms can try a short session before deciding what to practise next.</p></div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">For first-time learners</h3><p className="mt-3 leading-relaxed text-muted-foreground">Start with <Link href="/games/english/a-or-an" className="font-semibold text-primary hover:underline">A or An?</Link> or <Link href="/games/english/one-or-many" className="font-semibold text-primary hover:underline">One or Many?</Link>. Both use familiar words and short questions that suit early primary practice.</p></div>
        <div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">For regular practice</h3><p className="mt-3 leading-relaxed text-muted-foreground">Browse the <Link href="/grammar-games-for-kids" className="font-semibold text-primary hover:underline">grammar games collection</Link> to work on pronouns, verbs, position words and other common sentence patterns.</p></div>
        <div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">For a broader programme</h3><p className="mt-3 leading-relaxed text-muted-foreground">Visit <Link href="/games/english/academy" className="font-semibold text-primary hover:underline">Zalea English Academy</Link> to understand the guided grammar and vocabulary library. Individual Academy games require access.</p></div>
      </div>
    </div></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-2">
      <div><h2 className="text-3xl font-bold tracking-tight">How the free games support practice</h2><p className="mt-4 leading-relaxed text-muted-foreground">A free session presents ten questions from the selected difficulty. Learners receive feedback after each answer, helping them notice the language pattern instead of seeing only a final score. The activities are designed as practice tools rather than tests, so repeating a game is encouraged.</p><p className="mt-4 leading-relaxed text-muted-foreground">For a useful routine, read each question aloud, let the child choose independently, and discuss the explanation when an answer is unfamiliar. A short, calm session is usually more helpful than rushing through several topics at once.</p></div>
      <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8"><h2 className="text-2xl font-bold">For parents and teachers</h2><ul className="mt-5 space-y-3 text-muted-foreground"><li><strong className="text-foreground">Pick one skill:</strong> use the game title and learning notes to match the activity to the child.</li><li><strong className="text-foreground">Practise, then explain:</strong> ask the learner to say why an answer fits.</li><li><strong className="text-foreground">Repeat later:</strong> a new set of questions helps check whether the pattern is becoming familiar.</li></ul><p className="mt-5 text-sm leading-relaxed text-muted-foreground">These games provide educational practice and are not a formal assessment of a child&apos;s language level.</p></div>
    </div></section>
  </main><SiteFooter /></div>;
}

