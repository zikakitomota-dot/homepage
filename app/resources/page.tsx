import type { Metadata } from 'next';
import Link from 'next/link';
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
    <section className="border-b border-blue-100 bg-gradient-to-b from-blue-50/70 to-background"><div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link href="/" className="hover:underline">Home</Link><span className="mx-2" aria-hidden="true">/</span><span aria-current="page">Resources</span></nav><p className="mt-7 text-sm font-bold uppercase tracking-wider text-primary">Zalea Studio Resource Finder</p><h1 className="mt-3 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">Choose an activity for a learner, a printable for your next session, or a calculator for an everyday decision. Search the free collection by the task you want to do. No account needed.</p></div></section>
    <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><ResourceFinder resources={resources} /></div>
  </main><SiteFooter /></div>;
}
