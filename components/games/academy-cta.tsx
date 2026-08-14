import Link from 'next/link';
import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAcademyRecommendation, getAcademyResultsHeadline } from '@/lib/games/academy-recommendations';

const academyFeatures = [
  'Grammar Level 2',
  'Vocabulary Level 1',
  'Easy, Normal & Challenge modes',
  '20 premium games',
  'One-time purchase',
  'Lifetime Access',
];

export function AcademyResultsCta({ gameSlug, score }: { gameSlug: string; score: number }) {
  return <aside className="mt-8 w-full rounded-2xl border border-violet-200 bg-violet-50 p-5 text-left sm:p-6" aria-labelledby="academy-results-title">
    <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><Sparkles className="h-5 w-5" aria-hidden="true" /></span><div><h3 id="academy-results-title" className="text-xl font-bold text-violet-950">{getAcademyResultsHeadline(score)}</h3><p className="mt-2 leading-relaxed text-violet-900">{getAcademyRecommendation(gameSlug)}</p></div></div>
    <ul className="mt-5 grid gap-2 text-sm font-medium text-violet-950 min-[430px]:grid-cols-2">{academyFeatures.map((feature) => <li key={feature} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-700" aria-hidden="true" />{feature}</li>)}</ul>
    <Button asChild className="mt-6 min-h-12 h-auto w-full whitespace-normal bg-violet-700 py-3 text-center hover:bg-violet-800 sm:w-auto"><Link href="/games/english/academy" data-ga-event="cta_click" data-ga-label="academy_results_explore">Explore Zalea English Academy<ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden="true" /></Link></Button>
  </aside>;
}

export function AcademyDiscoveryCard() {
  return <aside className="rounded-2xl border border-violet-200 bg-violet-50/70 p-6 sm:p-8" aria-labelledby="academy-discovery-title">
    <div className="grid items-center gap-6 md:grid-cols-[1fr_auto]"><div><p className="text-sm font-bold uppercase tracking-wider text-violet-700">Zalea English Academy</p><h2 id="academy-discovery-title" className="mt-2 text-2xl font-bold text-violet-950">Want more English games?</h2><p className="mt-3 max-w-2xl leading-relaxed text-violet-900">Grammar Level 1 is just the beginning. Continue learning with Grammar Level 2 and Vocabulary Level 1 in Zalea English Academy – Lifetime Access.</p></div><Button asChild variant="outline" className="min-h-12 h-auto w-full whitespace-normal border-violet-300 bg-white py-3 text-violet-800 hover:bg-violet-100 hover:text-violet-900 md:w-auto"><Link href="/games/english/academy" data-ga-event="cta_click" data-ga-label="academy_discovery">See What&apos;s Inside<ArrowRight className="ml-2 h-5 w-5 shrink-0" aria-hidden="true" /></Link></Button></div>
  </aside>;
}
