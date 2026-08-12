import Link from 'next/link';
import { ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { EducationHubLayout } from '@/components/education-hub-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { englishGames } from '@/lib/games/english-games';
import { createEducationalMetadata } from '@/lib/seo';

export const metadata = createEducationalMetadata({
  title: 'Grammar Games for Kids – Free Interactive Practice | Zalea Studio',
  description: 'Play free grammar games for kids covering a and an, plurals, pronouns, is/am/are, can/can’t, possessives, prepositions and has/have.',
  path: '/grammar-games-for-kids',
});

export default function GrammarGamesForKidsPage() {
  return <EducationHubLayout eyebrow="Grammar learning guide" title="Grammar Games for Kids" introduction="Children can build grammar confidence by seeing a clear sentence, choosing an answer and receiving an explanation straight away. These free Level 1 games use familiar words and short sessions suited to early primary learners.">
    <section className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="max-w-3xl"><h2 className="text-3xl font-bold tracking-tight">Free Grammar Level 1 games</h2><p className="mt-4 leading-relaxed text-muted-foreground">The collection moves from articles and plurals to personal pronouns, forms of “to be”, ability, possessive words, prepositions, demonstratives and has/have. A child can choose Easy, Normal or Challenge without creating an account.</p></div>
      <div className="mt-9 grid gap-5 md:grid-cols-2">{englishGames.map((game) => <Card key={game.slug}><CardHeader><div className="flex items-center gap-3"><span className="text-2xl" aria-hidden="true">{game.icon}</span><CardTitle className="text-xl">{game.title}</CardTitle></div></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{game.shortDescription} {game.learningObjective}</p><Link href={`/games/english/${game.slug}`} className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Play {game.title}<ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></CardContent></Card>)}</div>
    </section>
    <section className="border-y border-violet-200 bg-violet-50/70"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8"><Sparkles className="mx-auto h-9 w-9 text-violet-700" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold text-violet-950">What comes after Level 1?</h2><p className="mt-4 leading-relaxed text-violet-900">Grammar Level 2 in Zalea English Academy introduces past forms, helping verbs, negatives, verb endings, question words, conjunctions, time prepositions and sentence building. The protected questions are available only after a valid Lifetime Access licence is verified.</p><Button asChild size="lg" className="mt-7 min-h-12 bg-violet-700 hover:bg-violet-800"><Link href="/games/english/academy">Explore Zalea English Academy<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button><p className="mt-5 text-sm"><Link href="/english-games-for-kids" className="font-semibold text-violet-800 hover:underline">Read the English games guide</Link></p></div></section>
  </EducationHubLayout>;
}
