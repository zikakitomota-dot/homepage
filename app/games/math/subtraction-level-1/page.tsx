import Link from 'next/link';
import { ArrowLeft, ChevronRight, CircleDot, Footprints, Minus, Puzzle, Shapes } from 'lucide-react';
import { SubtractionAdventureGame } from '@/components/games/subtraction-adventure-game';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createEducationalMetadata, safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const gamePath = '/games/math/subtraction-level-1';

export const metadata = createEducationalMetadata({
  title: 'Subtraction Adventure — Level 1 | Free Math Game',
  description: 'Practise subtraction within 10 and 20 using interactive objects, number challenges, missing numbers and number lines. Ten questions per session.',
  path: gamePath,
});

const jsonLd = { '@context': 'https://schema.org', '@graph': [
  { '@type': ['LearningResource', 'WebApplication'], name: 'Subtraction Adventure — Level 1', description: 'A free interactive subtraction game for early primary learners.', url: `${SITE_URL}${gamePath}`, applicationCategory: 'EducationalApplication', operatingSystem: 'Any modern web browser', learningResourceType: 'Educational game', educationalLevel: 'Early primary', isAccessibleForFree: true, teaches: ['Taking away', 'Subtraction within 10', 'Subtraction within 20', 'Missing numbers', 'Counting backwards on a number line'] },
  { '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Games', item: `${SITE_URL}/games` },
    { '@type': 'ListItem', position: 3, name: 'Mathematics', item: `${SITE_URL}/games/math` },
    { '@type': 'ListItem', position: 4, name: 'Subtraction Adventure', item: `${SITE_URL}${gamePath}` },
  ] },
] };

export default function SubtractionLevelOnePage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
    <section className="border-b border-blue-100 bg-gradient-to-br from-blue-50 via-amber-50/50 to-emerald-50/50"><div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games/math">Mathematics</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">Subtraction Adventure</span></nav><p className="mt-7 text-sm font-bold uppercase tracking-wider text-blue-700">Free Math Game · Level 1</p><h1 className="mt-2 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Subtraction Adventure — Level 1</h1><p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">Learn what it means to take away, count what remains and travel backwards along a number line—without negative answers.</p></div></section>
    <section className="bg-blue-50/35 px-3 py-8 sm:px-6 sm:py-12"><SubtractionAdventureGame /></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-3xl font-bold tracking-tight">Four ways to understand subtraction</h2><p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">Subtraction can mean taking objects away, finding a missing part or measuring the distance between numbers. Seeing the same idea in different forms helps children understand the operation instead of memorising isolated facts.</p><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><Info icon={<Shapes className="h-6 w-6" />} title="Take objects away">Cross out the requested number and count only the objects that remain.</Info><Info icon={<Minus className="h-6 w-6" />} title="Read the symbols">Connect a number sentence such as 9 − 4 with the action of taking four away.</Info><Info icon={<Puzzle className="h-6 w-6" />} title="Find a missing part">Ask how many must be removed to change the starting number into the result.</Info><Info icon={<Footprints className="h-6 w-6" />} title="Count backwards">Begin at the first number and make one backward step for each number taken away.</Info></div></section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20"><div><CircleDot className="h-8 w-8 text-blue-700" aria-hidden="true" /><h2 className="mt-3 text-3xl font-bold">Try it away from the screen</h2><ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-muted-foreground"><li>Place eight counters on a table, move three aside and count what stays.</li><li>Walk backwards on floor numbers or steps while saying each landing number.</li><li>Hide some of a group and ask how many are missing.</li><li>Check that a subtraction answer is not larger than the starting number.</li></ul></div><div className="rounded-2xl border border-blue-200 bg-white p-6 sm:p-8"><h2 className="text-2xl font-bold">Keep the meaning visible</h2><p className="mt-4 leading-relaxed text-muted-foreground">If a learner guesses, return to objects or the number line. Say the starting number, show how many are being taken away and count the remaining group together. Level 1 deliberately keeps every answer at zero or above.</p><div className="mt-6 flex flex-col items-start gap-3"><Link href="/games/math/addition-level-1" className="inline-flex min-h-11 items-center font-bold text-blue-700 hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Practise joining groups in Addition Level 1</Link><Link href="/worksheets" className="inline-flex min-h-11 items-center font-bold text-blue-700 hover:underline">Create a printable subtraction worksheet<ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div></div></div></section>
  </main><SiteFooter /></div>;
}

function Info({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <Card className="border-blue-100"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">{icon}</span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent></Card>;
}
