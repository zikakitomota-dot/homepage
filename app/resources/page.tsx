import type { Metadata } from 'next';
import { ResourceFinder } from '@/components/resources/resource-finder';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { resourceCatalogue } from '@/lib/resources/catalogue';
import { searchResources } from '@/lib/resources/search';
import { initialResourceFilters } from '@/lib/resources/types';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Find Free Games, Worksheets, Calculators & Learning Resources';
const description = 'Find a free Zalea Studio resource for learning or an everyday task. Search games, missions, worksheets, printables, guides and practical calculators by topic.';
const resources = searchResources(resourceCatalogue, initialResourceFilters);
export const metadata: Metadata = {
  title: { absolute: `${title} | Zalea Studio` }, description,
  alternates: { canonical: '/resources' }, robots: { index: true, follow: true },
  openGraph: { title, description, url: '/resources', type: 'website' },
  twitter: { card: 'summary', title, description },
};
const jsonLd = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'CollectionPage', name: title, description, url: `${SITE_URL}/resources`, mainEntity: { '@type': 'ItemList', numberOfItems: resources.length, itemListElement: resources.map((resource, index) => ({ '@type': 'ListItem', position: index + 1, name: resource.title, url: resource.canonicalUrl })) } },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Resources', item: `${SITE_URL}/resources` }] },
] };
export default function ResourcesPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section><div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h1 className="max-w-4xl text-balance font-bold tracking-tight">Find a game, worksheet or calculator</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Search by topic or by the job in front of you, and see the free games, printables, guides and calculators that fit. No account needed.</p></div></section>
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><ResourceFinder resources={resources} /></div>
  </main><SiteFooter /></div>;
}
