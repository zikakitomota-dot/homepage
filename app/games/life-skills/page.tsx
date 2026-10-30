import Link from 'next/link';
import { ArrowRight, Clock3, Coins, ListChecks, Scale } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Button } from '@/components/ui/button';
import { gameRegistry } from '@/lib/games/registry';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata = createEducationalMetadata({
  title: 'Life Skills Games | Free Everyday Learning Activities',
  description: 'Practise useful everyday skills through free interactive challenges about telling time, money, routines and making decisions.',
  path: '/games/life-skills',
});

const games = gameRegistry.filter(game => game.subjectId === 'life-skills');
const available = games.filter(game => game.status === 'available');
const planned = games.filter(game => game.status === 'planned');
const availableIcons = { 'time-detective': Clock3, 'money-match': Coins } as const;
const plannedIcons = { 'daily-routine-builder': ListChecks, 'needs-vs-wants': Scale } as const;

export default function LifeSkillsPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Life Skills Games', url: `${SITE_URL}/games/life-skills`, mainEntity: { '@type': 'ItemList', itemListElement: available.map((game, index) => ({ '@type': 'ListItem', position: index + 1, name: game.title, url: `${SITE_URL}${game.route}` })) } }) }} />
    <section className="border-b border-orange-200 bg-orange-50/60"><div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 text-sm text-muted-foreground"><Link href="/" className="underline">Home</Link><span aria-hidden="true">/</span><Link href="/games" className="underline">Games</Link><span aria-hidden="true">/</span><span aria-current="page">Life Skills</span></nav>
      <Clock3 className="mt-7 h-12 w-12 text-orange-800" aria-hidden="true" /><h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Life Skills Games</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">Practise useful everyday skills through interactive challenges about time, money, routines and making decisions.</p>
    </div></section>
    <section className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8" aria-labelledby="life-skills-ready"><h2 id="life-skills-ready" className="text-3xl font-bold">Ready to play</h2><div className="mt-7 grid gap-5 md:grid-cols-2">{available.map(game => { const Icon = availableIcons[game.gameId as keyof typeof availableIcons]; return <article key={game.gameId} className="flex flex-col rounded-2xl border border-orange-200 bg-white p-6 shadow-sm"><Icon className="h-10 w-10 text-orange-800" aria-hidden="true" /><p className="mt-4 text-sm font-bold text-orange-800">Available · New · Level {game.level}</p><h3 className="mt-2 text-2xl font-bold">{game.title}</h3><p className="mt-4 leading-7 text-muted-foreground">{game.description}</p><p className="mt-3 text-sm text-muted-foreground">{game.gameId === 'money-match' ? '80 validated challenges per currency · MYR and USD' : '60 reviewed time challenges'} · 10 per session · No timer · Free</p><Button asChild size="lg" className="mt-6 h-auto min-h-12 max-w-full self-start whitespace-normal bg-orange-800 px-4 hover:bg-orange-900"><Link href={game.route!}>Play {game.gameId === 'money-match' ? 'Money Match' : 'Time Detective'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button></article>; })}</div></section>
    <section className="border-y bg-secondary/20"><div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">More Life Skills adventures are planned</h2><p className="mt-3 max-w-3xl leading-7 text-muted-foreground">These ideas are part of the roadmap, but they are not playable links yet. We will only mark them available when their learning content and interactions are complete.</p><div className="mt-6 grid gap-4 sm:grid-cols-3">{planned.map(game => { const Icon = plannedIcons[game.gameId as keyof typeof plannedIcons]; return <article key={game.gameId} className="rounded-2xl border border-orange-200 bg-white p-5"><Icon className="h-8 w-8 text-orange-800" aria-hidden="true" /><p className="mt-3 text-xs font-bold uppercase tracking-wide text-orange-800">Planned</p><h3 className="mt-1 text-lg font-bold">{game.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{game.description}</p></article>; })}</div></div></section>
    <section className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold">Practise, explain, use it again</h2><p className="mt-4 max-w-3xl leading-8 text-muted-foreground">Life Skills games use clear examples without suggesting that every family, school or community follows the same routine. Learners can take their time, read the feedback, and connect the skill to a situation that is familiar to them.</p><div className="mt-5 flex flex-wrap gap-5"><Link href="/games/my-learning-journey" className="inline-flex min-h-12 items-center rounded font-semibold text-orange-800 underline focus-visible:ring-2 focus-visible:ring-orange-700">My Learning Journey</Link><Link href="/games/math" className="inline-flex min-h-12 items-center rounded font-semibold text-orange-800 underline focus-visible:ring-2 focus-visible:ring-orange-700">Explore Mathematics Games</Link><Link href="/resources" className="inline-flex min-h-12 items-center rounded font-semibold text-orange-800 underline focus-visible:ring-2 focus-visible:ring-orange-700">Find another free resource</Link></div></section>
  </main><SiteFooter /></div>;
}
