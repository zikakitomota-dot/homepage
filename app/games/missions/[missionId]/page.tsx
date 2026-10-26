import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { MissionDetail } from '@/components/games/missions-dashboard';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { getMission, missions } from '@/lib/games/missions';
import { SITE_URL } from '@/lib/site';

export function generateStaticParams() { return missions.map((mission) => ({ missionId: mission.id })); }

export async function generateMetadata({ params }: PageProps<'/games/missions/[missionId]'>) {
  const mission = getMission((await params).missionId);
  if (!mission) return {};
  return createEducationalMetadata({ title: `${mission.title} Learning Mission | Zalea Studio`, description: mission.shortDescription, path: `/games/missions/${mission.id}` });
}

export default async function MissionPage({ params }: PageProps<'/games/missions/[missionId]'>) {
  const mission = getMission((await params).missionId);
  if (!mission) notFound();
  const url = `${SITE_URL}/games/missions/${mission.id}`;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'LearningResource', name: `${mission.title} Learning Mission`, description: mission.shortDescription, url, isAccessibleForFree: true, educationalLevel: 'Level 1' };
  return <div className="min-h-screen bg-background"><SiteHeader /><main><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} /><section className="border-b border-border/60 bg-gradient-to-br from-blue-50 via-violet-50/50 to-amber-50/40"><div className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games/missions">Missions</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">{mission.title}</span></nav><Badge className="mt-8 bg-violet-100 text-violet-800 hover:bg-violet-100">{mission.subject} · Level 1 · Free</Badge><div className="mt-5 flex items-start gap-4"><span className="text-5xl" aria-hidden="true">{mission.icon}</span><div><h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">{mission.title}</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{mission.introduction}</p></div></div></div></section><section className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><MissionDetail mission={mission} /></section></main><SiteFooter /></div>;
}
