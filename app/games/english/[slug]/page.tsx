import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BookOpen, ChevronRight, Lightbulb, LockKeyhole, Target } from 'lucide-react';
import { GameEngine } from '@/components/games/game-engine';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { canAccessGame } from '@/lib/games/access';
import { academyGames } from '@/lib/games/academy-games';
import { englishGames, getEnglishGame } from '@/lib/games/english-games';
import { PAYHIP_ACADEMY_URL } from '@/lib/site';
import type { AcademyGameSummary, EnglishGame } from '@/lib/games/types';

type Props = { params: Promise<{ slug: string }> };

// Academy routes read an HttpOnly entitlement cookie on every request.
export const dynamic = 'force-dynamic';

export function generateStaticParams() {
  // Free games can be pre-rendered. Academy slugs must be resolved at request
  // time so the server can validate the signed entitlement cookie.
  return englishGames.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const game = getEnglishGame(slug);
  const academyGame = academyGames.find((candidate) => candidate.slug === slug);
  if (!game && !academyGame) return {};
  if (academyGame) {
    const title = `${academyGame.title} | Zalea English Academy`;
    return { title: { absolute: title }, description: academyGame.shortDescription, robots: { index: false, follow: false } };
  }
  if (!game) return {};
  const title = `${game.title} Free English Grammar Game for Kids | Zalea Studio`;
  const url = `/games/english/${game.slug}`;
  return {
    title: { absolute: title }, description: game.seoDescription, alternates: { canonical: url },
    openGraph: { title, description: game.seoDescription, url, type: 'website' },
    twitter: { card: 'summary', title, description: game.seoDescription },
  };
}

export default async function EnglishGamePage({ params }: Props) {
  const slug = (await params).slug;
  const game = getEnglishGame(slug);
  const academyGame = academyGames.find((candidate) => candidate.slug === slug);
  if (!game && !academyGame) notFound();
  if (academyGame) {
    if (!(await canAccessGame('premium'))) return <LockedAcademyGame game={academyGame} />;
    // This server-only module is reached only after the signed cookie passes.
    const { getPremiumEnglishGame, premiumEnglishGames } = await import('@/lib/games/premium/index.server');
    const premiumGame = getPremiumEnglishGame(slug);
    if (!premiumGame) notFound();
    const currentIndex = premiumEnglishGames.findIndex((candidate) => candidate.slug === slug);
    const nextGame = premiumEnglishGames[(currentIndex + 1) % premiumEnglishGames.length];
    return <PremiumGamePage game={premiumGame} nextGame={nextGame} />;
  }
  if (!game) notFound();
  if (!(await canAccessGame(game.access))) notFound();
  const currentIndex = englishGames.findIndex(({ slug }) => slug === game.slug);
  const nextGame = englishGames[(currentIndex + 1) % englishGames.length];
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'LearningResource', name: game.title,
    description: game.seoDescription, url: `https://zaleastudio.com/games/english/${game.slug}`,
    learningResourceType: 'Educational game', educationalLevel: 'Early primary', isAccessibleForFree: true,
    teaches: game.learningObjective,
  };

  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/" className="hover:text-foreground">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games" className="hover:text-foreground">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games/english" className="hover:text-foreground">English Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">{game.title}</span></nav>
      <h1 className="mt-7 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{game.title} â€“ Free English Grammar Game</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{game.shortDescription} Play 10 random questions and get friendly feedback after every answer.</p>
    </div></section>
    <section className="bg-blue-50/40 px-3 py-8 sm:px-6 sm:py-12"><GameEngine game={game} nextGame={nextGame} /></section>
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><div className="grid gap-5 md:grid-cols-3">
      <Info icon={<BookOpen className="h-6 w-6" />} title="What does this game teach?"><p>{game.whatItTeaches}</p></Info>
      <Info icon={<Target className="h-6 w-6" />} title="Learning objective"><p>{game.learningObjective}</p></Info>
      <Info icon={<Lightbulb className="h-6 w-6" />} title="Parent & teacher tip"><p>{game.parentTip}</p></Info>
    </div><div className="mt-10 rounded-2xl border border-border/60 bg-secondary/40 p-6 sm:p-8"><h2 className="text-2xl font-bold">How to play</h2><p className="mt-4 leading-relaxed text-muted-foreground">Choose Easy, Normal or Challenge, press Start Game, then read each question and tap the answer that fits best. Every session contains 10 different questions from the selected difficulty pool. The game explains each answer, tracks a separate best score for every difficulty and remembers the most recently selected mode on this device.</p><Link href="/games/english" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Back to all English Games<ChevronRight className="ml-1 h-4 w-4" /></Link></div></section>
  </main><SiteFooter /></div>;
}

function LockedAcademyGame({ game }: { game: AcademyGameSummary }) {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><section className="border-b border-violet-200 bg-violet-50/70"><div className="mx-auto max-w-[900px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" /><Link href="/games/english">English Games</Link><ChevronRight className="h-4 w-4" /><Link href="/games/english/academy">Academy</Link><ChevronRight className="h-4 w-4" /><span>{game.title}</span></nav><div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-violet-200 bg-white p-6 text-center shadow-lg sm:p-10"><LockKeyhole className="mx-auto h-12 w-12 text-violet-700" aria-hidden="true" /><p className="mt-5 text-sm font-bold uppercase tracking-wider text-violet-700">Zalea English Academy</p><h1 className="mt-3 text-3xl font-bold">{game.title}</h1><p className="mt-5 text-lg font-semibold">This game is included with Lifetime Access.</p><div className="mt-7 grid gap-3 sm:grid-cols-2"><Button asChild className="min-h-12"><a href={PAYHIP_ACADEMY_URL} target="_blank" rel="noreferrer">Get Lifetime Access</a></Button><Button asChild variant="outline" className="min-h-12"><Link href="/games/english/academy#access">Unlock Academy</Link></Button></div><Link href="/games/english/academy" className="mt-6 inline-block min-h-11 font-semibold text-primary hover:underline">Back to Academy</Link></div></div></section></main><SiteFooter /></div>;
}

function PremiumGamePage({ game, nextGame }: { game: EnglishGame; nextGame: EnglishGame }) {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><section className="border-b border-violet-200 bg-violet-50/70"><div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14"><nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" /><Link href="/games/english">English Games</Link><ChevronRight className="h-4 w-4" /><Link href="/games/english/academy">Academy</Link><ChevronRight className="h-4 w-4" /><span>{game.title}</span></nav><p className="mt-7 text-sm font-bold uppercase tracking-wider text-violet-700">Zalea English Academy</p><h1 className="mt-2 text-balance text-3xl font-bold tracking-tight sm:text-4xl">{game.title}</h1><p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">{game.shortDescription} Play 10 random questions at the difficulty you choose.</p></div></section><section className="bg-violet-50/40 px-3 py-8 sm:px-6 sm:py-12"><GameEngine game={game} nextGame={nextGame} /></section><section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8"><div className="grid gap-5 md:grid-cols-3"><Info icon={<BookOpen className="h-6 w-6" />} title="What does this game teach?"><p>{game.whatItTeaches}</p></Info><Info icon={<Target className="h-6 w-6" />} title="Learning objective"><p>{game.learningObjective}</p></Info><Info icon={<Lightbulb className="h-6 w-6" />} title="Parent & teacher tip"><p>{game.parentTip}</p></Info></div><Link href="/games/english/academy#academy-library" className="mt-8 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Back to AcademßİyÚÚ$z{-®éÜj×vW"ârÂvæ÷6RuÒÅ²u–÷RW6RF†W6RFò†öÆBVæ6–ÂârÂv†æG2uÒÅ²u–÷R7FæBöâF†W6RârÂvfVWBuÕÒÂ²–ç7G'V7F–öç3¢tÖF6‚V6‚&öG’×'B7–Ö&öÂ÷"gVæ7F–öâv—F‚F†R6÷'&V7Bv÷&BârÂv†D—EFV6†W3¢t6öÖÖöâW‡FW&æÂ&öG’×'Bv÷&G2æBv†BF†W’†VÇW2FòârÂ&VçEF—¢uö–çBFò–÷W"÷vâ&öG’'BöæÇ’v†VâF†R6†–ÆB—26öÖf÷'F&ÆR6÷––ærârÒ’À¢fö6$vÖR‚v–âÖ×’×66†ööÂÖ&rrÂ66†ööÂÂµ²u–÷RW6RF†—2FòÖV7W&RÆ–æRârÂw'VÆW"uÒÅ²u–÷RW6RF†W6RFò7WBW"6fVÇ’v—F‚âGVÇBæV&'’ârÂw66—76÷'2uÒÅ²u–÷RW6RF†—2Fò&VÖ÷fRVæ6–ÂÖ&²ârÂvW&6W"uÒÅ²u–÷R6â6†'VâF†—2w&—F–ærFööÂârÂwVæ6–ÂuÒÅ²u–÷R6''’66†ööÂ—FV×2–ç6–FRF†—2ârÂv&ruÕÒÂ²–ç7G'V7F–öç3¢tÖF6‚66†ööÂÖ—FVÒ7–Ö&öÇ2æBW6W2v—F‚F†V—"VævÆ—6‚v÷&G2ârÂv†D—EFV6†W3¢uW6VgVÂ6Æ77&ööÒæB66†ööÂ×7WÇ’fö6'VÆ'’ârÂ&VçEF—¢t6²F†RÆV&æW"Fòf–æBæBæÖR6fR—FVÒ–âF†V—"÷vâ66†ööÂ&rârÒ’À¥Ó° ¦6öç7BfÖ–Ç’Ò°¢²vÖ÷F†W"rÂ	ù’rÂvâGVÇBvöÖâÆ&VÆÆVBÖ÷F†W"rÂvfVÖÆR&VçC²æ÷F†W"v÷&B—2×VÒuÒÂ²vfF†W"rÂ	ù‚rÂvâGVÇBÖâÆ&VÆÆVBfF†W"rÂvÖÆR&VçC²æ÷F†W"v÷&B—2FBuÒÂ²v×VÒrÂ	ù’rÂwF†Rv÷&B×VÒ&W6–FRvöÖârÂvâ–æf÷&ÖÂ'&—F—6‚v÷&Bf÷"Ö÷F†W"uÒÂ²vFBrÂ	ù‚rÂwF†Rv÷&BFB&W6–FRÖârÂvâ–æf÷&ÖÂv÷&Bf÷"fF†W"uÒÂ²v'&÷F†W"rÂ	ùbrÂv&÷’Æ&VÆÆVB'&÷F†W"rÂvÖÆR6–&Æ–æruÒÂ²w6—7FW"rÂ	ùrrÂvv—&ÂÆ&VÆÆVB6—7FW"rÂvfVÖÆR6–&Æ–æruÒÂ²vw&æFÖ÷F†W"rÂ	ùRrÂvâöÆFW"vöÖâÆ&VÆÆVBw&æFÖ÷F†W"rÂv&VçBöb&VçBv†ò—2vöÖâuÒÂ²vw&æFfF†W"rÂ	ùBrÂvâöÆFW"ÖâÆ&VÆÆVBw&æFfF†W"rÂv&VçBöb&VçBv†ò—2ÖâuÒÂ²w&VçG2rÂ	úy(ß	úIŞ(ß	úyrÂwGvò6&–ærGVÇG2Æ&VÆÆVB&VçG2rÂvÇW&Âv÷&Bf÷"W'6öî(	—2&VçBf–wW&W2uÒÂ²vfÖ–Ç’rÂ	ù¢rÂvw&÷WöbV÷ÆRÆ&VÆÆVBfÖ–Ç’rÂwV÷ÆR6öææV7FVBF‡&÷Vv‚6&RÂ&—'F‚ÂÖ'&–vR÷"F÷F–öâuÒÀ¥Ò26öç7B6F—6f–W2&VFöæÇ’VçG'•µÓ°¦6öç7B6Æ÷F†W2Ò°¢²w6†—'BrÂ	ùBrÂv6öÆÆ&VB6†—'BrÂvF÷v—F‚6öÆÆ"æB'WGFöç2uÒÂ²vG&W72rÂ	ùrrÂvG&W72rÂvöæR×–V6R—FVÒöb6Æ÷F†–æruÒÂ²wG&÷W6W'2rÂ	ùbrÂv—"öbG&÷W6W'2rÂt'&—F—6‚VævÆ—6‚f÷"6Æ÷F†–ær6÷fW&–ær&÷F‚ÆVw2uÒÂ²w6†÷'G2rÂ	ú›2rÂv—"öb6†÷'G2rÂw6†÷'B6Æ÷F†–ærv÷&âöâF†RÆVw2uÒÂ²w6†öW2rÂ	ùòrÂv—"öb6†öW2rÂvfö÷GvV"v÷&â÷WG6–FR6ö6·2uÒÂ²w6ö6·2rÂ	úzbrÂv—"öb6ö6·2rÂw6ögB6Æ÷F†–ærv÷&âöâF†RfVWB–ç6–FR6†öW2uÒÂ²v†BrÂ	úz"rÂv†Bv—F‚'&–ÒrÂw6öÖWF†–ærv÷&âöâF†R†VBuÒÂ²v¦6¶WBrÂ	úzRrÂv¦6¶WBrÂv6†÷'B÷WFW"Æ–W"v—F‚6ÆVWfW2uÒÂ²w6¶—'BrÂ	ú›rÂv6¶—'B×6†VBv&ÖVçBrÂv6Æ÷F†–ær†æv–ærg&öÒF†Rv—7Bv—F†÷WB6W&FRÆVw2uÒÂ²uB×6†—'BrÂ	ùRrÂv6†÷'B×6ÆVWfVBB×6†—'BrÂv67VÂF÷6†VBÆ–¶RF†RÆWGFW"BuÒÀ¥Ò26öç7B6F—6f–W2&VFöæÇ’VçG'•µÓ°¦6öç7B†öÖRÒ°¢²v&VBrÂ	ù¸şûˆòrÂv&VBv—F‚–ÆÆ÷rrÂvgW&æ—GW&RW6VBf÷"6ÆVW–æruÒÂ²wF&ÆRrÂ	ú©rÂvF&ÆR&W6–FR6†—"rÂvgW&æ—GW&Rv—F‚fÆBF÷f÷"ÖVÇ2÷"v÷&²uÒÂ²v6†—"rÂ	ú©rÂv6†—"v—F‚&6²rÂv6VBf÷"öæRW'6öâuÒÂ²vFö÷"rÂ	ùª¢rÂv6Æ÷6VBFö÷"rÂvÖ÷f–æræVÂW6VBFòVçFW"&ööÒuÒÂ²wv–æF÷rrÂ	ú©òrÂvv–æF÷rv—F‚æW2rÂvâ÷Væ–ærv—F‚vÆ72F†BÆWG2–âÆ–v‡BuÒÂ²w6öfrÂ	ù¸¾ûˆòrÂv6öfv—F‚7W6†–öç2rÂv6ögB6VBf÷"Ö÷&RF†âöæRW'6öâuÒÂ²v¶—F6†VârÂ	øÛ2rÂv6öö¶–ærâÆ&VÆÆVB¶—F6†VârÂwF†R&ööÒv†W&RfööB—2&W&VBuÒÂ²v&VG&ööÒrÂ	ù¸şûˆòrÂv&VBÆ&VÆÆVB&VG&ööÒrÂwF†R&ööÒv†W&RV÷ÆR6ÆVWuÒÂ²v&F‡&ööÒrÂ	ù¸rÂv&F‚Æ&VÆÆVB&F‡&ööÒrÂwF†R&ööÒW6VBf÷"v6†–æruÒÂ²vÆ×rÂ	ù*rÂvF&ÆRÆ×rÂvâö&¦V7BF†Bv—fW2Æ–v‡BuÒÀ¥Ò26öç7B6F—6f–W2&VFöæÇ’VçG'•µÓ°¦6öç7B7F–öç2Ò°¢²w'VârÂ	øø2rÂvW'6öâ'Vææ–ærrÂvÖ÷fRV–6¶Ç’öâ–÷W"fVWBuÒÂ²wvÆ²rÂ	ù«brÂvW'6öâvÆ¶–ærrÂvÖ÷fRöâ–÷W"fVWBB7FVG’6RuÒÂ²v§V×rÂ	úK‚rÂvW'6öâ§V×–ærrÂwW6‚öfbF†Rw&÷VæB–çFòF†R—"uÒÂ²vVBrÂ	øÛŞûˆòrÂvÆFRW6VBf÷"VF–ærrÂwF¶RfööB–çFò–÷W"Ö÷WF‚uÒÂ²vG&–æ²rÂ	úZBrÂv7Wv—F‚7G&rrÂwF¶RÆ—V–B–çFò–÷W"Ö÷WF‚uÒÂ²w&VBrÂ	ù9brÂvâ÷Vâ&öö²rÂvÆöö²BæBVæFW'7FæBw&—GFVâv÷&G2uÒÂ²ww&—FRrÂ~)ÈŞûˆòrÂv†æBw&—F–ærrÂvÖ¶RÆWGFW'2÷"v÷&G2öâ7W&f6RuÒÂ²w6ÆVWrÂ	ù‹BrÂv6ÆVW–ærf6RrÂw&W7Bv—F‚–÷W"W–W26Æ÷6VBuÒÂ²w6—BrÂ	ú©rÂv6†—"Æ&VÆÆVB6—BrÂw&W7B–÷W"&öG’öâ6VBuÒÂ²w7FæBrÂ	úxÒrÂvW'6öâ7FæF–ærrÂv&RW&–v‡Böâ–÷W"fVWBuÒÂ²w7v–ÒrÂ	øø¢rÂvW'6öâ7v–ÖÖ–ærrÂvÖ÷fRF‡&÷Vv‚vFW"uÒÂ²wÆ’rÂ~)«ÒrÂv&ÆÂW6VBf÷"Æ’rÂwF¶R'B–âvÖR÷"gVâ7F—f—G’uÒÀ¥Ò26öç7B6F—6f–W2&VFöæÇ’VçG'•µÓ°¦6öç7B÷÷6—FW2Ò°¢²w6ÖÆÂrÂ	ù
ÒrÂv6ÖÆÂÖ÷W6R&W6–FRÆ&vR6†RrÂwF†R÷÷6—FRöb&–ruÒÂ²v6öÆBrÂ	úx¢rÂvâ–6R7V&RÆ&VÆÆVB6öÆBrÂwF†R÷÷6—FRöb†÷BuÒÂ²w6BrÂ	ù˜rÂv6Bf6RrÂwF†R÷÷6—FRöb†’uÒÂ²w6Æ÷rrÂ	ù
"rÂv6Æ÷rF÷'Fö—6RrÂwF†R÷÷6—FRöbf7BuÒÂ²vF÷vârÂ~*È~ûˆòrÂvâ'&÷rö–çF–ærF÷vârÂwF†R÷÷6—FRöbWuÒÂ²v6Æ÷6VBrÂ	ùI"rÂv6Æ÷6VBÆö6²rÂwF†R÷÷6—FRöb÷VâuÒÂ²væ–v‡BrÂ	øÉ’rÂvÖööâBæ–v‡BrÂwF†R÷÷6—FRF–ÖRFòF’uÒÂ²væWrrÂ~)Ê‚rÂv6†–ç’æWrö&¦V7BrÂwF†R÷÷6—FRöböÆBuÒÂ²vV×G’rÂ	ú¹’rÂvâV×G’¦"rÂwF†R÷÷6—FRöbgVÆÂuÒÂ²w6†÷'BrÂ	ù8òrÂv6†÷'BÆ–æR&W6–FRFÆÂöæRrÂwF†R÷÷6—FRöbFÆÂuÒÀ¥Ò26öç7B6F—6f–W2&VFöæÇ’VçG'•µÓ° ¦W‡÷'B6öç7B&VÖ–æ–æufö6'VÆ'”vÖW2Ò°¢fö6$vÖR‚v×’ÖfÖ–Ç’rÂfÖ–Ç’Âµ²uv†–6‚v÷&B6âÖVâfVÖÆR&VçCòrÂvÖ÷F†W"uÒÅ²uv†–6‚–æf÷&ÖÂv÷&B6âÖVâÖÆR&VçCòrÂvFBuÒÅ²uv†–6‚v÷&BÖVç2ÖÆR6–&Æ–æsòrÂv'&÷F†W"uÒÅ²uv†–6‚v÷&B6â–æ6ÇVFRF†RV÷ÆRv†ò6&Rf÷"æB&VÆöærv—F‚öæRæ÷F†W#òrÂvfÖ–Ç’uÒÅ²uv†–6‚ÇW&Âv÷&B6âFW67&–&R&VçBf–wW&W3òrÂw&VçG2uÕÒÂ²–ç7G'V7F–öç3¢uW6RF†Rw&—GFVâ6ÇVRFòÆV&â&W7V7FgVÂv÷&G2f÷"fÖ–Ç’&VÆF–öç6†—2ârÂv†D—EFV6†W3¢t6öÖÖöâfÖ–Ç’fö6'VÆ'’v—F†÷WB77VÖ–ærF†BWfW'’†÷W6V†öÆB†2F†R6ÖR7G'V7GW&RârÂ&VçEF—¢uW6Rv†–6†WfW"v÷&G2f—BF†RÆV&æW.(	—2÷vâfÖ–Ç’æBW‡Æ–âF†BfÖ–Æ–W26â&RF–ffW&VçBârÒ’À¢fö6$vÖR‚wv†BÖ&R×vR×vV&–ærrÂ6Æ÷F†W2Âµ²u–÷RvV"F†W6Röâ–÷W"fVWB÷fW"6ö6·2ârÂw6†öW2uÒÅ²t'&—F—6‚VævÆ—6‚W6W2F†—2v÷&Bf÷"6Æ÷F†–ærF†B6÷fW'2&÷F‚ÆVw2ârÂwG&÷W6W'2uÒÅ²u–÷RvV"F†—2öâ–÷W"†VBârÂv†BuÒÅ²uF†—267VÂF÷—26†VBÆ–¶RF†RÆWGFW"BârÂuB×6†—'BuÒÅ²uF†—2—26†÷'B÷WFW"Æ–W"v—F‚6ÆVWfW2ârÂv¦6¶WBuÕÒÂ²–ç7G'V7F–öç3¢tÖF6‚6Æ÷F†–ær7–Ö&öÇ2æBFW67&—F–öç2v—F‚'&—F—6‚ÔVævÆ—6‚v÷&G2ârÂv†D—EFV6†W3¢tWfW'–F’6Æ÷F†–ærfö6'VÆ'’–æ6ÇVF–ærG&÷W6W'2æBB×6†—'BârÂ&VçEF—¢t6†ö÷6RöæR—FVÒF†RÆV&æW"—2vV&–æræB6’—G2VævÆ—6‚æÖRârÒ’À¢fö6$vÖR‚vBÖ†öÖRrÂ†öÖRÂµ²u–÷R6ÆVW–âF†—2&ööÒârÂv&VG&ööÒuÒÅ²u–÷R&W&RfööB–âF†—2&ööÒârÂv¶—F6†VâuÒÅ²u–÷R6—BöâF†—26ögB6VBv—F‚÷F†W"V÷ÆRârÂw6öfuÒÅ²u–÷R÷VâF†—2FòVçFW"&ööÒârÂvFö÷"uÒÅ²uF†—2ö&¦V7Bv—fW2Æ–v‡BârÂvÆ×uÕÒÂ²–ç7G'V7F–öç3¢t6†ö÷6RF†R†öÖRv÷&BF†BÖF6†W2V6‚&ööÒÂö&¦V7B÷"W6RârÂv†D—EFV6†W3¢t6öÖÖöâ&öö×2ÂgW&æ—GW&RæBö&¦V7G2f÷VæB–âÖç’†öÖW2ârÂ&VçEF—¢uvÆ²F‡&÷Vv‚fÖ–Æ–"&ööÒæBæÖRöæÇ’F†Rö&¦V7G2F†B&R&VÆÇ’F†W&RârÒ’À¢fö6$vÖR‚v7F–öâ×F–ÖRrÂ7F–öç2Âµ²uv†–6‚v÷&BÖVç2Ö÷f–ærV–6¶Ç’öâ–÷W"fVWCòrÂw'VâuÒÅ²uv†–6‚v÷&BÖVç2Æöö¶–ærBæBVæFW'7FæF–ærw&—GFVâv÷&G3òrÂw&VBuÒÅ²uv†–6‚v÷&BÖVç2Ö÷f–ærF‡&÷Vv‚vFW#òrÂw7v–ÒuÒÅ²uv†–6‚v÷&BÖVç2&W7F–æröâ6VCòrÂw6—BuÒÅ²uv†–6‚v÷&BÖVç2Ö¶–ærÆWGFW'2÷"v÷&G3òrÂww&—FRuÕÒÂ²–ç7G'V7F–öç3¢tÖF6‚V6‚7F–öâ7–Ö&öÂ÷"ÖVæ–ærv—F‚—G2fW&"ârÂv†D—EFV6†W3¢uW6VgVÂWfW'–F’7F–öâfW&'2ârÂ&VçEF—¢t7B÷WB6fRfW&"æB–çf—FRF†RÆV&æW"FòæÖR—BârÒ’À¢fö6$vÖR‚v÷÷6—FRÖÖF6‚rÂ÷÷6—FW2Âµ²uF†R&÷GFÆR—2gVÆÂâF†R÷÷6—FRöbgVÆÂ—2õõòârÂvV×G’uÒÅ²uF†R&&&—B—2f7BâF†R÷÷6—FRöbf7B—2õõòârÂw6Æ÷ruÒÅ²uF†RFö÷"—2÷VââF†R÷÷6—FRöb÷Vâ—2õõòârÂv6Æ÷6VBuÒÅ²uF†RF÷vW"—2FÆÂâF†R÷÷6—FRöbFÆÂ—2õõòârÂw6†÷'BuÒÅ²uF†RF÷’—2öÆBâF†R÷÷6—FRöböÆB—2õõòârÂvæWruÕÒÂ²–ç7G'V7F–öç3¢t6†ö÷6RF†Rv÷&Bv—F‚F†R÷÷6—FRÖVæ–ærârÂv†D—EFV6†W3¢uFVâW6VgVÂ÷÷6—FR—'2F‡&÷Vv‚F—&V7BÖF6†W2æB6–×ÆR6öçFW‡G2ârÂ&VçEF—¢u6’&÷F‚v÷&G22—"Â7V6‚2(	Æ÷VâÂ6Æ÷6VN(	ÒÂæBW6R6fRvW7GW&RârÒ’À¥Ó° ¦W‡÷'B6öç7Bfö6'VÆ'•&VÖ—VÔvÖW2Ò²ââæf—'7Df—fUfö6'VÆ'”vÖW2Âââç&VÖ–æ–æufö6'VÆ'”vÖW5Ó°