import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LearningJourneyDashboard } from '@/components/games/learning-journey-dashboard';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { createEducationalMetadata } from '@/lib/seo';

export const metadata = createEducationalMetadata({
  title: 'My Learning Journey | Zalea Studio',
  description: 'See the Zalea Studio learning games explored on this device, celebrate achievements, review personal bests and discover what to play next.',
  path: '/games/my-learning-journey',
});

export default function MyLearningJourneyPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="border-b border-border/60 bg-gradient-to-br from-blue-50 via-violet-50/50 to-amber-50/40"><div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">My Learning Journey</span></nav><Badge className="mt-8 bg-violet-100 text-violet-800 hover:bg-violet-100">Private to this device</Badge><h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">My Learning Journey</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">See the games you&apos;ve explored, celebrate your achievements, and discover what to learn next.</p></div></section>
    <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><LearningJourneyDashboard /></div>
  </main><SiteFooter /></div>;
}
