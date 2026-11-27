import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { MissionsDashboard } from '@/components/games/missions-dashboard';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata = createEducationalMetadata({ title: 'Learning Missions for Kids | Zalea Studio', description: 'Follow free Level 1 learning missions across maths, English, science and geography, with progress saved privately in this browser.', path: '/games/missions' });

const jsonLd = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Zalea Studio Learning Missions', url: `${SITE_URL}/games/missions`, description: 'Free Level 1 learning missions using Zalea Studio games and worksheets.', isAccessibleForFree: true };

export default function MissionsPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} /><section className="border-b border-border/60 bg-gradient-to-br from-blue-50 via-violet-50/50 to-amber-50/40"><div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Learning Missions</span></nav><Badge className="mt-8 bg-violet-100 text-violet-800 hover:bg-violet-100">Free · Saved on this device</Badge><h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">Learning Missions</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Each mission is a short set of activities on one topic. Do them in any order and come back whenever you like. Your progress stays on this device.</p></div></section><section className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="mb-8 max-w-3xl"><h2 className="text-3xl font-bold">Choose a mission</h2><p className="mt-3 leading-relaxed text-muted-foreground">A game ticks off when you play it through to the results screen. The ticks show what you’ve done, not a test score.</p></div><MissionsDashboard /></section></main><SiteFooter /></div>;
}
