import Link from 'next/link';
import { MoneyMatchGame } from '@/components/games/money-match-game';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const path = '/games/life-skills/money-match';
export const metadata = createEducationalMetadata({
  title: 'Money Match — Level 1 | Free MYR and USD Money Game',
  description: 'Learn to recognise coins and notes, count money, match prices, pay exact amounts and work out simple change in MYR or USD.',
  path,
});
const jsonLd = { '@context': 'https://schema.org', '@graph': [
  { '@type': ['LearningResource', 'WebApplication'], name: 'Money Match — Level 1', url: `${SITE_URL}${path}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Any modern web browser', educationalLevel: 'Beginner', isAccessibleForFree: true, learningResourceType: 'Interactive game', teaches: ['Recognising money denominations', 'Counting money', 'Matching prices', 'Exact payment', 'Simple change'] },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` }, { '@type': 'ListItem', position: 3, name: 'Life Skills', item: `${SITE_URL}/games/life-skills` }, { '@type': 'ListItem', position: 4, name: 'Money Match', item: `${SITE_URL}${path}` }] },
] };

export default function MoneyMatchPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-orange-200 bg-orange-50/60"><div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8"><nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-muted-foreground"><Link href="/" className="underline">Home</Link><span aria-hidden="true">/</span><Link href="/games" className="underline">Games</Link><span aria-hidden="true">/</span><Link href="/games/life-skills" className="underline">Life Skills</Link><span aria-hidden="true">/</span><span aria-current="page">Money Match</span></nav><p className="mt-6 text-sm font-bold text-orange-800">Free Life Skills Game · Level 1</p><h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">Money Match — Level 1</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">Learn to recognise coins and notes, count money, pay exact amounts and work out simple change.</p></div></section>
    <div className="bg-orange-50/30 px-3 py-8 sm:px-6 sm:py-12"><MoneyMatchGame /></div>
    <section className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">Money practice without exchange rates</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['1', 'Recognise', 'Read the value and accessible name of each educational coin or note.'], ['2', 'Count', 'Combine integer minor-unit values without floating-point arithmetic.'], ['3', 'Pay', 'Build any denomination combination that reaches the exact price.'], ['4', 'Change', 'Subtract a simple price from the amount paid.']].map(([number, title, text]) => <div key={number} className="rounded-xl border bg-white p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-900">{number}</span><h3 className="mt-3 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p></div>)}</div>
      <p className="mt-6 max-w-3xl leading-7 text-muted-foreground">Choose Malaysian Ringgit or US Dollar before starting. The game does not infer nationality or location, convert currencies, add tax, or claim that every real purchase follows the same rounding rule. MYR and initial USD exercises use five-unit minor-currency increments for beginner-friendly exact payment.</p>
      <p className="mt-4 max-w-3xl leading-7 text-muted-foreground">The original drawings clearly show values but are not reproductions of official currency. Currency choice and detailed progress remain in this browser. Analytics receives only aggregate game start and completion events.</p>
      <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50/40 p-5"><h2 className="text-xl font-bold">Continue practising</h2><div className="mt-3 flex flex-wrap gap-x-6 gap-y-3"><Link href="/games/life-skills/time-detective" className="font-semibold text-orange-800 underline focus-visible:ring-2 focus-visible:ring-orange-700">Play Time Detective</Link><Link href="/games/math/addition-level-1" className="font-semibold text-orange-800 underline focus-visible:ring-2 focus-visible:ring-orange-700">Practise Addition Level 1</Link><Link href="/games/life-skills" className="font-semibold text-orange-800 underline focus-visible:ring-2 focus-visible:ring-orange-700">Life Skills Games</Link><Link href="/resources" className="font-semibold text-orange-800 underline focus-visible:ring-2 focus-visible:ring-orange-700">Find another free resource</Link></div></div>
    </section>
  </main><SiteFooter /></div>;
}
