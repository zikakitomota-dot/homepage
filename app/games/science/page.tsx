import Link from 'next/link';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata = createEducationalMetadata({ title: 'Free Science Games for Kids | Zalea Studio', description: 'Explore habitats and classify living and non-living things with free interactive Level 1 science games.', path: '/games/science' });
const jsonLd = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'CollectionPage', name: 'Free Science Games for Kids', url: `${SITE_URL}/games/science`, description: 'Free interactive Level 1 science games for young learners.', isAccessibleForFree: true },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` }, { '@type': 'ListItem', position: 3, name: 'Science', item: `${SITE_URL}/games/science` }] },
] };

export default function ScienceGamesPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-[#d8decf] bg-gradient-to-br from-[#edf3e7] via-[#f5f1e7] to-emerald-50"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Science</span></nav><Badge className="mt-8 bg-green-100 text-green-800 hover:bg-green-100">Free · No login required</Badge><h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Science Games for Young Explorers</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Observe animals, plants, objects and environments. Each short activity helps children notice evidence and explain a scientific choice.</p></div></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-6 md:grid-cols-2"><GameCard icon="🦉" title="Where Do I Live?" description="Match animals with habitats that provide food, shelter and suitable conditions." href="/games/science/animal-habitats" label="Play Animal Habitats" badge="16 animals · 3 difficulties" /><GameCard icon="🌱" title="Living or Non-Living?" description="Classify organisms and objects, sort evidence and learn what once living means." href="/games/science/living-or-non-living" label="Play Living or Non-Living?" badge="New · 60-challenge bank" /></div><div className="mt-12 rounded-2xl border border-[#cad6bd] bg-[#f1f6ed] p-6 sm:p-8"><h2 className="text-2xl font-bold">Think like a scientist</h2><p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">Science starts with careful observation. In Animal Habitats, learners connect visible features with environmental needs. In Living or Non-Living?, they look beyond movement and use evidence such as growth, cells and life processes.</p></div></section>
  </main><SiteFooter /></div>;
}

function GameCard({ icon, title, description, href, label, badge }: { icon: string; title: string; description: string; href: string; label: string; badge: string }) {
  return <Card className="overflow-hidden border-[#cad6bd] shadow-md"><div className="flex min-h-44 items-center justify-center bg-gradient-to-br from-[#e7f0df] to-[#f5eaca] p-8 text-8xl" role="img" aria-label={`${title} illustration`}>{icon}</div><CardContent className="p-6 sm:p-8"><Badge variant="secondary">{badge}</Badge><CardTitle className="mt-4 text-3xl">{title}</CardTitle><p className="mt-4 leading-relaxed text-muted-foreground">{description}</p><Button asChild size="lg" className="mt-7 min-h-12 bg-[#52704d] hover:bg-[#435e40]"><Link href={href} data-ga-event="game_launch" data-ga-label={href.split('/').pop()}>{label}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button></CardContent></Card>;
}
