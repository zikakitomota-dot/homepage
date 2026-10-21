import Link from 'next/link';
import { ChevronRight, Compass, Globe2, Lightbulb, Map, MousePointer2 } from 'lucide-react';
import { ContinentExplorerGame } from '@/components/games/continent-explorer-game';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata = createEducationalMetadata({
  title: 'Continent Explorer — Free World Map Game for Kids | Zalea Studio',
  description: 'Learn the seven continents with an interactive world map, country challenges, helpful explanations and a fresh 10-question journey each time.',
  path: '/games/geography/continent-explorer',
});

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'LearningResource', name: 'Continent Explorer — Level 1', url: `${SITE_URL}/games/geography/continent-explorer`, description: 'An interactive beginner geography game about the seven continents.', learningResourceType: 'game', educationalLevel: 'Beginner', isAccessibleForFree: true, teaches: ['The seven continents', 'Approximate continent locations', 'Countries and their continents', 'Basic world-map awareness'] },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` },
      { '@type': 'ListItem', position: 3, name: 'Geography', item: `${SITE_URL}/games/geography` },
      { '@type': 'ListItem', position: 4, name: 'Continent Explorer', item: `${SITE_URL}/games/geography/continent-explorer` },
    ] },
  ],
};

export default function ContinentExplorerPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(pageJsonLd) }} />
    <section className="border-b border-sky-100 bg-gradient-to-br from-sky-50 via-blue-50/70 to-emerald-50/40"><div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games" className="hover:text-foreground">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games/geography" className="hover:text-foreground">Geography</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Continent Explorer</span></nav><p className="mt-7 text-sm font-bold uppercase tracking-wider text-sky-800">Free Geography Game · Level 1</p><h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-5xl">Continent Explorer</h1><p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">Learn where the seven continents are, connect countries with continents, and build confidence reading a world map.</p></div></section>
    <section className="bg-sky-50/30 px-2 py-10 sm:px-6 lg:px-8 lg:py-14" aria-label="Continent Explorer game"><ContinentExplorerGame /></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-3xl font-bold tracking-tight">What is a continent?</h2><p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">A continent is one of Earth&apos;s largest geographic divisions. Continents help us describe where places are in the world, although their boundaries and names are partly based on convention as well as land and water.</p><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'South America', 'Australia'].map((name, index) => <div key={name} className="rounded-xl border border-border/60 bg-white p-4"><span className="text-xs font-bold text-sky-700">{String(index + 1).padStart(2, '0')}</span><h3 className="mt-1 text-lg font-bold">{name}</h3></div>)}</div><p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted-foreground">This game uses the seven-continent model and labels the smallest continent Australia. Oceania is the wider Pacific region. Other countries and learning systems may use a different model, so a different map or textbook is not necessarily wrong.</p></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-3xl font-bold tracking-tight">How to use the game</h2><div className="mt-7 grid gap-5 md:grid-cols-3"><div className="rounded-2xl border border-border/70 bg-white p-6"><MousePointer2 className="h-7 w-7 text-sky-700" aria-hidden="true" /><h3 className="mt-3 text-xl font-bold">1. Choose</h3><p className="mt-2 text-muted-foreground">Select an answer button or choose a continent directly on the map. Keyboard players can use Tab, then Enter or Space.</p></div><div className="rounded-2xl border border-border/70 bg-white p-6"><Lightbulb className="h-7 w-7 text-amber-600" aria-hidden="true" /><h3 className="mt-3 text-xl font-bold">2. Learn</h3><p className="mt-2 text-muted-foreground">Read the explanation after every answer. Correct and incorrect choices are clearly marked.</p></div><div className="rounded-2xl border border-border/70 bg-white p-6"><Compass className="h-7 w-7 text-emerald-700" aria-hidden="true" /><h3 className="mt-3 text-xl font-bold">3. Explore again</h3><p className="mt-2 text-muted-foreground">Complete ten challenges, view the result, then replay for a reshuffled set with no repeats in that journey.</p></div></div></div></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-9 lg:grid-cols-2"><div><Map className="h-8 w-8 text-sky-700" aria-hidden="true" /><h2 className="mt-3 text-3xl font-bold tracking-tight">Skills learners will practise</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted-foreground"><li>Recognising continent names, shapes and approximate positions</li><li>Scanning a world map from west to east and north to south</li><li>Connecting familiar countries with their continents</li><li>Remembering simple facts such as the largest, smallest and coldest continents</li><li>Explaining an answer using a position or geographic clue</li></ul></div><div><Globe2 className="h-8 w-8 text-emerald-700" aria-hidden="true" /><h2 className="mt-3 text-3xl font-bold tracking-tight">Keep exploring</h2><p className="mt-4 leading-relaxed text-muted-foreground">After the game, choose one continent and investigate its countries, climates, languages, landforms and wildlife. On a globe, notice how a flat world map stretches shapes near the poles. Try finding the Equator, the Prime Meridian and the oceans between continents.</p><p className="mt-4 leading-relaxed text-muted-foreground">The map uses simplified public-domain Natural Earth geographic data. It is suitable for recognising continents at world scale, but it is not intended for studying detailed borders or disputed territories.</p></div></div></section>
  </main><SiteFooter /></div>;
}
