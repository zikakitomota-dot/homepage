import Link from 'next/link';
import { BookOpen, ChevronRight, Eye, Leaf, Lightbulb, Map, Users } from 'lucide-react';
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
      <div className="max-w-3xl"><h2 id="about-habitats-game" className="text-3xl font-bold tracking-tight">About This Animal Habitats Game</h2><p className="mt-4 leading-relaxed text-muted-foreground">Children match 16 familiar animals with the forest, desert, ocean, or ice and snow. Short facts connect each answer with a real feature of the animal&apos;s natural environment. The activity practises observation and classification: children look for clues such as fins, thick fur, wide feet or a shell, then decide which environment could meet that animal&apos;s needs.</p></div>
      <h2 className="mt-12 text-3xl font-bold tracking-tight">What Children Learn</h2>
      <div className="mt-7 grid gap-5 md:grid-cols-3">
        <Info icon={<Eye className="h-6 w-6" />} title="Animal recognition">Notice animal names, shapes and familiar features.</Info>
        <Info icon={<Leaf className="h-6 w-6" />} title="Habitats & environment">Connect animals with places that provide food, shelter and suitable weather.</Info>
        <Info icon={<BookOpen className="h-6 w-6" />} title="Science vocabulary">Practise words such as habitat, forest, desert, ocean, Arctic and tundra.</Info>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <Map className="h-8 w-8 text-[#52704d]" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight">What is a habitat?</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">A habitat is the place where a living thing normally finds what it needs to survive. That includes food, water, shelter, space and suitable conditions. A habitat is more than scenery: an ocean gives a dolphin room to swim and breathe at the surface, while Arctic sea ice gives a polar bear access to a cold hunting environment.</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">Animals within one broad habitat can use it differently. An owl may nest in a forest tree, while a deer feeds and shelters among woodland plants. The game uses four simple categories so early learners can notice the main connection before exploring more detailed habitats later.</p>
        </div>
        <div className="rounded-2xl border border-[#cad6bd] bg-[#f1f6ed] p-6 sm:p-8">
          <h2 className="text-2xl font-bold">The four habitat groups</h2>
          <dl className="mt-5 space-y-4 text-muted-foreground">
            <div><dt className="font-semibold text-foreground">Forest</dt><dd>Trees and other plants provide food, shade, nesting places and cover for animals such as deer, owls, squirrels and raccoons.</dd></div>
            <div><dt className="font-semibold text-foreground">Desert</dt><dd>Dry conditions and large temperature changes suit animals with ways to conserve water, avoid heat or move across sand and rock.</dd></div>
            <div><dt className="font-semibold text-foreground">Ocean</dt><dd>Salt water supports animals adapted for swimming, breathing and finding food at different depths.</dd></div>
            <div><dt className="font-semibold text-foreground">Ice and snow</dt><dd>Cold polar environments favour features such as insulating fur, feathers or blubber and behaviours that conserve warmth.</dd></div>
          </dl>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-[#cad6bd] bg-[#f1f6ed] p-6 sm:p-8"><h2 className="text-2xl font-bold">How to Play</h2><ol className="mt-5 grid gap-4 text-muted-foreground md:grid-cols-3"><li><strong className="block text-foreground">1. Choose a level</strong>Start with two habitats or explore all four.</li><li><strong className="block text-foreground">2. Match the animal</strong>Tap the habitat where the animal belongs.</li><li><strong className="block text-foreground">3. Read and continue</strong>Learn one quick fact, then try the next animal.</li></ol></div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div>
          <Users className="h-8 w-8 text-[#52704d]" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight">Ideas for parents and teachers</h2>
          <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted-foreground">
            <li>Before a child chooses, ask which body feature gives them a clue and accept simple observations such as “it has flippers” or “it has thick fur.”</li>
            <li>After a correct match, name one need the habitat provides: food, water, shelter, space or the right temperature.</li>
            <li>Sort toy animals, drawings or magazine pictures into habitat groups away from the screen.</li>
            <li>Choose one animal and compare it with an animal from another habitat. Ask what would make each one uncomfortable in the other&apos;s home.</li>
            <li>Invite an older learner to draw a habitat and add two plants, a water source and a safe place for its animals.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Age-appropriate learning goals</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">For ages 4–7, the aim is not to memorise every ecosystem. A useful first step is being able to name broad habitats, match familiar animals using visible clues and explain one simple reason for a choice.</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">Some animals can live across more than one specific environment, and real habitats often overlap. If a child notices an exception, treat it as a chance to explore rather than marking their wider knowledge as wrong. The game selects one clear, representative home for each animal to keep the activity manageable.</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">Play one short round, revisit difficult animals later and let the child explain answers in their own words. Conversation is more valuable than rushing for a perfect score.</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-border/60 bg-secondary/30 p-6 sm:p-8"><div className="flex items-center gap-3"><Lightbulb className="h-7 w-7 text-primary" aria-hidden="true" /><h2 className="text-2xl font-bold">Explore More Free Learning Resources</h2></div><p className="mt-4 leading-relaxed text-muted-foreground">Keep learning with a short maths or English activity, or use a printable for hands-on practice. Every free game works in the browser without an account.</p><div className="mt-5 flex flex-wrap gap-x-6 gap-y-3"><Link href="/games/math/addition-level-1" className="font-semibold text-primary hover:underline">Play Addition Level 1</Link><Link href="/games/english" className="font-semibold text-primary hover:underline">Explore English Games</Link><Link href="/freebies/shapes-and-colours-activity-pack" className="font-semibold text-primary hover:underline">Shapes &amp; Colours Activity Pack</Link><Link href="/games" className="font-semibold text-primary hover:underline">View All Learning Games</Link></div></div>
    </section>
  </main><SiteFooter /></div>;
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e7f0df] text-[#52704d]">{icon}</span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>;
}
