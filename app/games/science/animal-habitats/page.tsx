import Link from 'next/link';
import { BookOpen, ChevronRight, Eye, Leaf, Lightbulb } from 'lucide-react';
import { AnimalHabitatsGame } from '@/components/games/animal-habitats-game';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const gamePath = '/games/science/animal-habitats';

export const metadata = createEducationalMetadata({
  title: 'Free Animal Habitats Game for Kids | Zalea Studio',
  description: 'Play a free animal habitats game for kids. Match animals to the forest, desert, ocean, and icy habitats while learning through play.',
  path: gamePath,
  image: null,
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LearningResource', 'WebApplication'], name: 'Where Do I Live?',
      alternateName: 'Animal Habitats Game for Kids', description: 'A free animal habitat matching game with three difficulty modes for children ages 4–7.',
      url: `${SITE_URL}${gamePath}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Any modern web browser',
      learningResourceType: 'Educational game', educationalLevel: 'Preschool and early primary', typicalAgeRange: '4-7',
      audience: { '@type': 'EducationalAudience', educationalRole: 'student' }, isAccessibleForFree: true,
      teaches: ['Animal recognition', 'Natural habitats', 'Environmental awareness', 'Observation', 'Basic science vocabulary'],
    },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` },
      { '@type': 'ListItem', position: 3, name: 'Where Do I Live?', item: `${SITE_URL}${gamePath}` },
    ] },
  ],
};

export default function AnimalHabitatsPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-[#d8decf] bg-[#edf3e7]"><div className="mx-auto max-w-[1000px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games" className="hover:text-foreground">Learning Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Where Do I Live?</span></nav>
      <p className="mt-6 text-sm font-bold uppercase tracking-wider text-[#52704d]">Free Zalea Science Game · Ages 4–7</p>
      <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Where Do I Live? <span className="block text-xl font-semibold text-[#5e6b59] sm:mt-1 sm:text-2xl">Animal Habitats Game for Kids</span></h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Look at each animal and choose the place where it belongs.</p>
    </div></section>

    <section className="bg-[#f4f1e8] px-2 py-7 sm:px-6 sm:py-11"><AnimalHabitatsGame /></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="about-habitats-game">
      <div className="max-w-3xl"><h2 id="about-habitats-game" className="text-3xl font-bold tracking-tight">About This Animal Habitats Game</h2><p className="mt-4 leading-relaxed text-muted-foreground">Children match 16 familiar animals with the forest, desert, ocean, or ice and snow. Short facts connect each answer with a real feature of the animal&apos;s natural environment.</p></div>
      <h2 className="mt-12 text-3xl font-bold tracking-tight">What Children Learn</h2>
      <div className="mt-7 grid gap-5 md:grid-cols-3">
        <Info icon={<Eye className="h-6 w-6" />} title="Animal recognition">Notice animal names, shapes and familiar features.</Info>
        <Info icon={<Leaf className="h-6 w-6" />} title="Habitats & environment">Connect animals with places that provide food, shelter and suitable weather.</Info>
        <Info icon={<BookOpen className="h-6 w-6" />} title="Science vocabulary">Practise words such as habitat, forest, desert, ocean, Arctic and tundra.</Info>
      </div>

      <div className="mt-10 rounded-2xl border border-[#cad6bd] bg-[#f1f6ed] p-6 sm:p-8"><h2 className="text-2xl font-bold">How to Play</h2><ol className="mt-5 grid gap-4 text-muted-foreground md:grid-cols-3"><li><strong className="block text-foreground">1. Choose a level</strong>Start with two habitats or explore all four.</li><li><strong className="block text-foreground">2. Match the animal</strong>Tap the habitat where the animal belongs.</li><li><strong className="block text-foreground">3. Read and continue</strong>Learn one quick fact, then try the next animal.</li></ol></div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-secondary/30 p-6 sm:p-8"><div className="flex items-center gap-3"><Lightbulb className="h-7 w-7 text-primary" aria-hidden="true" /><h2 className="text-2xl font-bold">Explore More Free Learning Games</h2></div><p className="mt-4 leading-relaxed text-muted-foreground">Keep learning with a short maths or English activity. Every free game works in the browser without an account.</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3"><Link href="/games/math/addition-level-1" className="font-semibold text-primary hover:underline">Play Addition Level 1</Link><Link href="/games/english" className="font-semibold text-primary hover:underline">Explore English Games</Link><Link href="/games" className="font-semibold text-primary hover:underline">View All Learning Games</Link></div></div>
    </section>
  </main><SiteFooter /></div>;
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f0df] text-[#52704d]">{icon}</span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>;
}
