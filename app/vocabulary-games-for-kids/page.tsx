import Link from 'next/link';
import { ArrowRight, Check, Languages, LockKeyhole } from 'lucide-react';
import { EducationHubLayout } from '@/components/education-hub-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { vocabularyLevelOneGames } from '@/lib/games/academy-games';
import { ACADEMY_SOCIAL_IMAGE, createEducationalMetadata } from '@/lib/seo';

export const metadata = createEducationalMetadata({
  title: 'Vocabulary Games for Kids – English Word Practice | Zalea Studio',
  description: 'Explore child-friendly vocabulary games about colours, animals, food, body parts, school, family, clothes, home, actions and opposites in Zalea English Academy.',
  path: '/vocabulary-games-for-kids',
  image: ACADEMY_SOCIAL_IMAGE,
});

export default function VocabularyGamesForKidsPage() {
  return <EducationHubLayout eyebrow="Vocabulary learning guide" title="Vocabulary Games for Kids" introduction="Vocabulary Level 1 helps children recognise and use familiar English words through colourful visual clues and short interactive activities. It is part of Zalea English Academy – Lifetime Access.">
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-[1fr_0.75fr]"><div><h2 className="text-3xl font-bold tracking-tight">Everyday words children can use</h2><p className="mt-4 leading-relaxed text-muted-foreground">The collection covers ten practical themes rather than presenting isolated word lists. Children connect a written word with a clear visual or contextual clue, choose an answer and see immediate feedback. The activities work on phones, tablets and computers.</p><ul className="mt-7 grid gap-3 sm:grid-cols-2">{vocabularyLevelOneGames.map((game) => <li key={game.slug} className="flex gap-3 rounded-xl border border-border/60 bg-white p-4"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span><strong>{game.title}</strong><span className="mt-1 block text-sm text-muted-foreground">{game.shortDescription}</span></span></li>)}</ul></div><Card className="h-fit border-violet-200 bg-violet-50"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><LockKeyhole className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="pt-2 text-2xl">Included with Lifetime Access</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-violet-900">Vocabulary Level 1 contains ten Academy games with Easy, Normal and Challenge modes. Premium question banks stay protected and are served only after a Payhip licence is verified.</p><Button asChild className="mt-6 min-h-12 w-full bg-violet-700 hover:bg-violet-800"><Link href="/games/english/academy">View Academy details<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button></CardContent></Card></div></section>
    <section className="border-t border-border/60 bg-secondary/30"><div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8"><Languages className="mx-auto h-9 w-9 text-primary" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold">Build a balanced English routine</h2><p className="mt-4 leading-relaxed text-muted-foreground">Vocabulary practice works well alongside sentence patterns. Begin with the free grammar collection, then return to vocabulary topics that match a child&apos;s interests or everyday experiences.</p><div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3"><Link href="/games/english" className="font-semibold text-primary hover:underline">Play free English games</Link><Link href="/grammar-games-for-kids" className="font-semibold text-primary hover:underline">Explore grammar games</Link></div></div></section>
  </EducationHubLayout>;
}
