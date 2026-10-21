import Link from 'next/link';
import { ChevronRight, Compass, Droplets, Globe2, Lightbulb, MousePointer2, Waves } from 'lucide-react';
import { OceanExplorerGame } from '@/components/games/ocean-explorer-game';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata = createEducationalMetadata({
  title: 'Ocean Explorer — Free World Map Game for Kids | Zalea Studio',
  description: 'Learn the five named oceans with an accessible interactive map, continent clues, useful facts and a fresh 10-question voyage each time.',
  path: '/games/geography/ocean-explorer',
});

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'LearningResource', name: 'Ocean Explorer — Level 1', url: `${SITE_URL}/games/geography/ocean-explorer`, description: 'An interactive beginner geography game about the five named oceans.', learningResourceType: 'game', educationalLevel: 'Beginner', isAccessibleForFree: true, teaches: ['The five named oceans', 'Approximate ocean locations', 'Oceans and nearby continents', 'Why oceans are important'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` },
      { '@type': 'ListItem', position: 3, name: 'Geography', item: `${SITE_URL}/games/geography` },
      { '@type': 'ListItem', position: 4, name: 'Ocean Explorer', item: `${SITE_URL}/games/geography/ocean-explorer` },
    ] },
  ],
};

const oceanNames = ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Southern Ocean', 'Arctic Ocean'];

export default function OceanExplorerPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(pageJsonLd) }} />
    <section className="border-b border-cyan-100 bg-gradient-to-br from-cyan-50 via-blue-50/70 to-emerald-50/40"><div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games/geography">Geography</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Ocean Explorer</span></nav><p className="mt-7 text-sm font-bold uppercase tracking-wider text-cyan-800">Free Geography Game · Level 1</p><h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-5xl">Ocean Explorer</h1><p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">Learn the five named oceans, find their approximate locations and connect each ocean with the continents around it.</p></div></section>
    <section className="bg-cyan-50/30 px-2 py-10 sm:px-6 lg:px-8 lg:py-14" aria-label="Ocean Explorer game"><OceanExplorerGame /></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-3xl font-bold tracking-tight">What is an ocean?</h2><p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">An ocean is a vast body of salty water. Earth really has one connected global ocean, but geographers give its largest regions names so we can describe and study them more easily.</p><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{oceanNames.map((name, index) => <div key={name} className="rounded-xl border border-cyan-100 bg-white p-4"><span className="text-xs font-bold text-cyan-700">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-1 font-bold">{name}</h3></div>)}</div><p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">This game uses the modern five-ocean classification. Some maps and educational systems use four oceans, treat the Southern Ocean differently, or divide the connected water in another way. Those are classification choices, not separate bodies of water.</p></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-3xl font-bold tracking-tight">How to play</h2><div className="mt-7 grid gap-5 md:grid-cols-3"><div className="rounded-2xl border bg-white p-6"><MousePointer2 className="h-7 w-7 text-cyan-700" aria-hidden="true" /><h3 className="mt-3 text-xl font-bold">1. Choose</h3><p className="mt-2 text-muted-foreground">Select an answer or choose a labelled ocean marker. Keyboard players can use Tab, then Enter or Space.</p></div><div className="rounded-2xl border bg-white p-6"><Lightbulb className="h-7 w-7 text-amber-600" aria-hidden="true" /><h3 className="mt-3 text-xl font-bold">2. Learn</h3><p className="mt-2 text-muted-foreground">Read a short explanation after every answer and use nearby continents as clues.</p></div><div className="rounded-2xl border bg-white p-6"><Compass className="h-7 w-7 text-emerald-700" aria-hidden="true" /><h3 className="mt-3 text-xl font-bold">3. Sail again</h3><p className="mt-2 text-muted-foreground">Finish ten challenges, check your score, then replay for a fresh question mix.</p></div></div></div></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-9 lg:grid-cols-2"><div><Waves className="h-8 w-8 text-cyan-700" aria-hidden="true" /><h2 className="mt-3 text-3xl font-bold tracking-tight">Why oceans matter</h2><p className="mt-4 leading-relaxed text-muted-foreground">Oceans cover most of Earth, provide habitats for an enormous range of life, move heat around the planet and strongly influence weather and climate. Tiny ocean organisms also produce roughly half of Earth’s oxygen.</p></div><div><Droplets className="h-8 w-8 text-blue-700" aria-hidden="true" /><h2 className="mt-3 text-3xl font-bold tracking-tight">What learners will practise</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted-foreground"><li>Naming the Pacific, Atlantic, Indian, Southern and Arctic oceans</li><li>Finding approximate locations on a world map</li><li>Using nearby continents as location clues</li><li>Understanding why the Pacific appears twice on many flat maps</li><li>Remembering useful facts about ocean size and position</li></ul></div></div>
      <div className="mt-10 rounded-2xl border border-cyan-200 bg-cyan-50/60 p-6 sm:p-8"><Globe2 className="h-7 w-7 text-cyan-700" aria-hidden="true" /><h2 className="mt-3 text-2xl font-bold">Continue your Geography journey</h2><p className="mt-3 text-muted-foreground">Review the land around each ocean in our companion Level 1 game.</p><Link href="/games/geography/continent-explorer" className="mt-4 inline-flex min-h-11 items-center font-bold text-cyan-800 hover:underline">Play Continent Explorer<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></div>
    </section>
  </main><SiteFooter /></div>;
}
