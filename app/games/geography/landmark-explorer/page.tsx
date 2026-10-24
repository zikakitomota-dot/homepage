import Link from 'next/link';
import { ChevronRight, Camera, Globe2, Landmark, MapPin } from 'lucide-react';
import { LandmarkExplorerGame } from '@/components/games/landmark-explorer-game';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';
import { landmarks } from '@/lib/games/landmark-explorer';
import landmarkSources from '@/public/images/landmarks/sources.json';

type LandmarkSource = {
  id: string;
  author: string;
  license: string;
  licenseUrl: string | null;
  sourcePage: string;
};

const sourcesById = new Map(
  (landmarkSources as LandmarkSource[]).map((source) => [source.id, source]),
);

export const metadata = createEducationalMetadata({
  title: 'Landmark Explorer — Level 1 | Free Geography Game',
  description: 'Recognise 30 famous world landmarks and match them with countries and continents in a free 10-question geography game for children.',
  path: '/games/geography/landmark-explorer',
});

const pageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'LearningResource', name: 'Landmark Explorer — Level 1', url: `${SITE_URL}/games/geography/landmark-explorer`, description: 'A free beginner geography game about famous landmarks, countries and continents.', educationalLevel: 'Beginner', learningResourceType: 'Interactive game', isAccessibleForFree: true },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` },
      { '@type': 'ListItem', position: 3, name: 'Geography', item: `${SITE_URL}/games/geography` },
      { '@type': 'ListItem', position: 4, name: 'Landmark Explorer', item: `${SITE_URL}/games/geography/landmark-explorer` },
    ] },
  ],
};

export default function LandmarkExplorerPage() {
  const built = landmarks.filter(({ kind }) => kind === 'built').length;
  const natural = landmarks.length - built;
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(pageJsonLd) }} />
    <section className="border-b border-sky-100 bg-gradient-to-br from-sky-50 via-amber-50/50 to-emerald-50/60"><div className="mx-auto max-w-[1100px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games/geography">Geography</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Landmark Explorer</span></nav>
      <div className="mt-7 flex flex-wrap items-center gap-3"><Badge className="bg-green-100 text-green-800 hover:bg-green-100">Free · No login required</Badge><Badge variant="secondary">30 verified landmarks</Badge></div>
      <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Landmark Explorer — Level 1</h1><p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">Travel across six world regions, recognise famous places and learn where each landmark belongs.</p>
    </div></section>
    <section className="bg-gradient-to-b from-white to-sky-50/35 px-3 py-8 sm:px-6 sm:py-12 lg:px-8"><LandmarkExplorerGame /></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-2"><div><p className="text-sm font-bold uppercase tracking-wider text-sky-700">Learning beyond the score</p><h2 className="mt-2 text-3xl font-bold tracking-tight">What young explorers practise</h2><ul className="mt-5 space-y-4 text-muted-foreground"><li className="flex gap-3"><Camera className="mt-0.5 h-5 w-5 shrink-0 text-sky-700" aria-hidden="true" /><span>Notice shapes, materials and surroundings in real landmark photographs.</span></li><li className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" /><span>Connect each place with its country instead of memorising a picture alone.</span></li><li className="flex gap-3"><Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" /><span>Group countries into six child-friendly world regions used consistently across this game.</span></li></ul></div><div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6 sm:p-8"><Landmark className="h-8 w-8 text-amber-800" aria-hidden="true" /><h2 className="mt-3 text-2xl font-bold">A landmark can be built or natural</h2><p className="mt-4 leading-relaxed text-muted-foreground">This collection includes {built} human-made places such as towers, temples and bridges, plus {natural} natural landmarks such as mountains, reefs and waterfalls. Ask: “What features make this place easy to recognise?”</p><p className="mt-4 leading-relaxed text-muted-foreground">Some landmarks cross borders or have names from more than one language. The feedback explains those details when they matter.</p></div></div>
      <div className="mt-10 rounded-2xl border border-sky-200 bg-sky-50/60 p-6 sm:p-8"><h2 className="text-2xl font-bold">Photo credits and responsible reuse</h2><p className="mt-3 leading-relaxed text-muted-foreground">Every game photograph is stored locally and linked to its Wikimedia Commons source and reuse licence. The source images were resized and converted to WebP for the game; no intentional content changes were made. No synthetic landmark images are used.</p><details className="mt-5"><summary className="min-h-11 cursor-pointer font-bold text-sky-800">View all 30 image credits</summary><ul className="mt-4 grid gap-3 text-sm sm:grid-cols-2">{landmarks.map((item) => { const source = sourcesById.get(item.id); return <li key={item.id} className="rounded-xl border border-sky-100 bg-white/70 p-3"><span className="font-semibold">{item.name}</span><span className="block text-muted-foreground">Photo by {source?.author ?? 'Wikimedia Commons contributor'}</span><span className="mt-1 block"><a href={source?.sourcePage ?? item.sourcePage} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline decoration-sky-300 underline-offset-4 hover:text-sky-800">View source</a><span aria-hidden="true"> · </span>{source?.licenseUrl ? <a href={source.licenseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline decoration-sky-300 underline-offset-4 hover:text-sky-800">{source.license}</a> : <span>{source?.license ?? item.licence}</span>}</span></li>; })}</ul></details></div>
      <div className="mt-10 text-center"><p className="text-muted-foreground">Ready for another kind of geography clue?</p><Link href="/games/geography/flag-detective" className="mt-3 inline-flex min-h-11 items-center font-bold text-sky-800 hover:underline">Play Flag Detective<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></div>
    </section>
  </main><SiteFooter /></div>;
}
