import Link from 'next/link';
import { Blocks, BookOpen, Check, ChevronRight, Lightbulb, MessageCircle, RefreshCw, Target } from 'lucide-react';
import { AdditionGameEngine } from '@/components/games/addition-game-engine';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const gamePath = '/games/math/addition-level-1';

export const metadata = createEducationalMetadata({
  title: 'Addition Level 1 – Free Addition Game for Kids | Zalea Studio',
  description: 'Play a free addition game for ages 5–7 with addition within 10, addition within 20 and simple word problems. Ten questions per round, no login required.',
  path: gamePath,
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LearningResource', 'WebApplication'],
      name: 'Addition Level 1',
      description: 'A free, child-friendly addition game with three difficulty modes and ten randomized questions per round.',
      url: `${SITE_URL}${gamePath}`,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Any modern web browser',
      learningResourceType: 'Educational game',
      educationalLevel: 'Early primary',
      audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
      isAccessibleForFree: true,
      teaches: ['Number sense', 'Addition fluency', 'Addition within 10', 'Addition within 20', 'Simple addition word problems'],
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` },
        { '@type': 'ListItem', position: 3, name: 'Addition Level 1', item: `${SITE_URL}${gamePath}` },
      ],
    },
  ],
};

export default function AdditionLevelOnePage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games" className="hover:text-foreground">Learning Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Addition Level 1</span></nav>
      <p className="mt-7 text-sm font-bold uppercase tracking-wider text-primary">Free Zalea Math Game · Ages 5–7</p>
      <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">Addition Level 1 – Free Addition Game for Kids</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">Build confidence with addition within 10 and 20. Choose a difficulty and play a fresh 10-question round with friendly feedback after every answer.</p>
    </div></section>

    <section className="bg-blue-50/40 px-3 py-8 sm:px-6 sm:py-12"><AdditionGameEngine /></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="addition-skills">
      <div className="max-w-3xl"><h2 id="addition-skills" className="text-3xl font-bold tracking-tight">What Addition Level 1 practises</h2><p className="mt-4 leading-relaxed text-muted-foreground">Early addition means combining two quantities to find how many there are altogether. In <strong className="text-foreground">3 + 2 = 5</strong>, a group of three and a group of two make a total of five. Every question in this game uses that joining idea.</p></div>
      <div className="mt-9 grid gap-5 md:grid-cols-3">
        <Info icon={<Target className="h-6 w-6" />} title="Easy · Within 10"><p>Ten number sentences with totals no higher than 10. There are no word problems at this level.</p></Info>
        <Info icon={<BookOpen className="h-6 w-6" />} title="Medium · Within 20"><p>Seven number sentences and three simple word problems, all with totals no higher than 20.</p></Info>
        <Info icon={<Lightbulb className="h-6 w-6" />} title="Hard · Totals 10–20"><p>Five number sentences and five word problems. Every total is between 10 and 20.</p></Info>
      </div>
    </section>

    <section className="border-y border-border/60 bg-secondary/30" aria-labelledby="addition-strategies"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12"><div><Blocks className="h-8 w-8 text-primary" aria-hidden="true" /><h2 id="addition-strategies" className="mt-4 text-3xl font-bold tracking-tight">Simple ways to work out a total</h2><p className="mt-4 leading-relaxed text-muted-foreground">Children can use objects, fingers, drawings or numbers. The aim is to make each quantity visible before expecting the answer to be remembered.</p></div>
        <div className="space-y-5"><div className="rounded-2xl border border-border/60 bg-white p-6"><h3 className="text-xl font-bold">Count the two groups</h3><p className="mt-3 leading-relaxed text-muted-foreground">For 3 + 2, place three counters beside two counters, join the groups and count all five. This is a useful starting strategy when the child still needs to see every item.</p></div><div className="rounded-2xl border border-border/60 bg-white p-6"><h3 className="text-xl font-bold">Count on from the larger number</h3><p className="mt-3 leading-relaxed text-muted-foreground">Instead of recounting the first group, hold the larger number in mind and count forward. For 7 + 3, start at 7 and say 8, 9, 10. Familiar combinations such as 5 + 5 can gradually be recognised without counting every item.</p></div><div className="rounded-2xl border border-border/60 bg-white p-6"><h3 className="text-xl font-bold">Make 10 when it helps</h3><p className="mt-3 leading-relaxed text-muted-foreground">For some within-20 questions, split the smaller number to reach 10 first. For 8 + 5, use 2 of the 5 to make 10, then add the remaining 3: 10 + 3 = 13. This strategy is most useful after addition within 10 is becoming familiar.</p></div></div>
      </div>
    </div></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="word-problems">
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12"><div><MessageCircle className="h-8 w-8 text-primary" aria-hidden="true" /><h2 id="word-problems" className="mt-4 text-3xl font-bold tracking-tight">Reading the word problems</h2><p className="mt-4 leading-relaxed text-muted-foreground">Medium and Hard include short stories in which more objects join an existing group. For example: “Mia has 3 apples and gets 2 more. How many apples does she have now?” This represents 3 + 2 = 5.</p><ol className="mt-6 space-y-3 leading-relaxed text-muted-foreground"><li><strong className="text-foreground">1. Find the numbers:</strong> identify the starting group and the amount being added.</li><li><strong className="text-foreground">2. Notice what joins:</strong> apples join apples, books join books or ducks join ducks.</li><li><strong className="text-foreground">3. Show the story:</strong> use objects, quick marks or an addition sentence.</li><li><strong className="text-foreground">4. Check the total:</strong> because more were added, the answer should be larger than either starting number.</li></ol></div>
        <Card className="h-fit border-blue-200 bg-blue-50/50"><CardHeader><RefreshCw className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-2xl">Choosing a difficulty</CardTitle></CardHeader><CardContent><ul className="space-y-3 leading-relaxed text-muted-foreground"><li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span>Start with Easy if the child still counts every item or is learning what the plus sign means.</span></li><li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span>Move to Medium when within-10 questions feel familiar and the child is ready to connect addition with short stories.</span></li><li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span>Use Hard for more word-problem practice and totals from 10 to 20.</span></li><li className="flex gap-3"><Check className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" /><span>Return to an easier level if answers become guesses or the harder questions feel frustrating.</span></li></ul></CardContent></Card>
      </div>
    </section>

    <section className="border-y border-border/60 bg-blue-50/50" aria-labelledby="offline-addition"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="max-w-3xl"><h2 id="offline-addition" className="text-3xl font-bold tracking-tight">Practise addition with everyday objects</h2><p className="mt-4 leading-relaxed text-muted-foreground">Short, hands-on examples can help a child connect the symbols on screen with real quantities.</p></div><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl border border-border/60 bg-white p-5"><h3 className="font-bold">Combine toys</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Make two small groups, push them together and count the total.</p></div><div className="rounded-xl border border-border/60 bg-white p-5"><h3 className="font-bold">Add fruit</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Put two pieces beside three more and describe the matching addition sentence.</p></div><div className="rounded-xl border border-border/60 bg-white p-5"><h3 className="font-bold">Roll two dice</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Add the two numbers. Counters can represent the dots when needed.</p></div><div className="rounded-xl border border-border/60 bg-white p-5"><h3 className="font-bold">Tell an addition story</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Invent a short story about more books, crayons, balloons or ducks joining a group.</p></div></div>
    </div></section>

    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-8 lg:grid-cols-2">
      <div><h2 className="text-3xl font-bold tracking-tight">When an answer is difficult</h2><p className="mt-4 leading-relaxed text-muted-foreground">A child may recount the first group, confuse joining with taking away, or guess when the quantities are hard to picture. These are useful clues about which support to offer. Show the two groups again, say what is being added and let the child represent the question before choosing an answer.</p><p className="mt-4 leading-relaxed text-muted-foreground">The game can complement hands-on counting, classroom mathematics, number conversations and everyday examples. It is one way to revisit addition, not a replacement for explaining and using the idea away from the screen.</p></div>
      <div className="rounded-2xl border border-border/60 bg-secondary/40 p-6 sm:p-8"><h2 className="text-2xl font-bold">How to play</h2><p className="mt-4 leading-relaxed text-muted-foreground">Choose Easy, Medium or Hard and press Start Game. Tap one of the four answers, read the feedback and continue. After question 10, the learner can replay or change difficulty.</p><p className="mt-4 leading-relaxed text-muted-foreground">Questions are generated in the browser without an account. Progress and best scores stay on this device.</p><Link href="/games" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Explore all Learning Games<ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></div>
    </div></section>
  </main><SiteFooter /></div>;
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>;
}
