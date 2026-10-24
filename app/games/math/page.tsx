import Link from 'next/link';
import { ArrowRight, ChevronRight, Minus, Plus } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

export const metadata = createEducationalMetadata({ title: 'Free Mathematics Games for Kids | Zalea Studio', description: 'Practise early addition and subtraction with free ten-question mathematics games for young learners.', path: '/games/math' });
const jsonLd = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'CollectionPage', name: 'Free Mathematics Games for Kids', url: `${SITE_URL}/games/math`, description: 'Free interactive Level 1 addition and subtraction games.', isAccessibleForFree: true },
  { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` }, { '@type': 'ListItem', position: 3, name: 'Mathematics', item: `${SITE_URL}/games/math` }] },
] };

export default function MathematicsGamesPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} /><section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-amber-50/40"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Mathematics</span></nav><Badge className="mt-8 bg-green-100 text-green-800 hover:bg-green-100">Free · No login required</Badge><h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Mathematics Games for Young Learners</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">Build number sense through short, friendly Level 1 adventures. Begin by joining groups with addition or taking away with subtraction.</p></div></section><section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-6 md:grid-cols-2"><GameCard icon={<Plus className="h-24 w-24" />} title="Addition Level 1" description="Join quantities and solve addition within 10 and 20." href="/games/math/addition-level-1" label="Play Addition Level 1" badge="10 questions per round" /><GameCard icon={<Minus className="h-24 w-24" />} title="Subtraction Adventure" description="Take objects away, find missing numbers and move backwards on number lines." href="/games/math/subtraction-level-1" label="Play Subtraction Adventure" badge="New · 60-question bank" /></div><div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8"><h2 className="text-2xl font-bold">Choosing where to start</h2><p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">Start with Addition when a learner is practising how groups join. Choose Subtraction Adventure when they are ready to take part of a group away and count what remains. Both games use immediate feedback and ten-question sessions.</p></div></section></main><SiteFooter /></div>;
}

function GameCard({ icon, title, description, href, label, badge }: { icon: React.ReactNode; title: string; description: string; href: string; label: string; badge: string }) {
  return <Card className="overflow-hidden border-blue-200 shadow-md"><div className="flex min-h-44 items-center justify-center bg-gradient-to-br from-blue-100 to-amber-100 p-8 text-blue-700" aria-hidden="true">{icon}</div><CardContent className="p-6 sm:p-8"><Badge variant="secondary">{badge}</Badge><CardTitle className="mt-4 text-3xl">{title}</CardTitle><p className="mt-4 leading-relaxed text-muted-foreground">{description}</p><Button asChild size="lg" className="mt-7 min-h-12"><Link href={href} data-ga-event="game_launch" data-ga-label={href.split('/').pop()}>{label}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button></CardContent></Card>;
}
