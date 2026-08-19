import Link from 'next/link';
import { ArrowRight, BookOpen, Languages, MonitorSmartphone, Users } from 'lucide-react';
import { EducationHubLayout } from '@/components/education-hub-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createEducationalMetadata } from '@/lib/seo';

export const metadata = createEducationalMetadata({
  title: 'Free English Games for Kids | Zalea Studio',
  description: 'Find free English grammar games for children ages 5–8, plus mobile-friendly grammar and vocabulary learning in Zalea English Academy.',
  path: '/english-games-for-kids',
});

const features = [
  { icon: BookOpen, title: 'Learn through play', text: 'Short activities turn grammar practice into an approachable game with immediate, friendly feedback.' },
  { icon: Users, title: 'Useful for families', text: 'Children can play independently or read each sentence aloud with a parent, carer or teacher.' },
  { icon: MonitorSmartphone, title: 'Play on any device', text: 'The controls are designed for phones and tablets and work equally well on a computer.' },
];

export default function EnglishGamesForKidsPage() {
  return <EducationHubLayout eyebrow="English learning guide" title="English Games for Kids" introduction="Zalea Studio offers short interactive activities for young learners who are building confidence with everyday English. The free Grammar Level 1 collection is designed mainly for ages 5–8 and does not require an account.">
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20"><h2 className="text-3xl font-bold tracking-tight">A simple place to begin</h2><p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">Start with ten free grammar games covering articles, plurals, pronouns, verbs, possession and position words. Each session contains ten questions, and progress stays on the device. Parents can use the games as a quick practice activity after school, while teachers can share a specific game that matches a lesson.</p><Button asChild size="lg" className="mt-7 min-h-12"><Link href="/games/english">Play Free English Games<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{features.map(({ icon: Icon, title, text }) => <Card key={title}><CardHeader><Icon className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent className="leading-relaxed text-muted-foreground">{text}</CardContent></Card>)}</div>
    </section>
    <section className="border-y border-border/60 bg-secondary/30"><div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20"><Card><CardHeader><BookOpen className="h-7 w-7 text-primary" aria-hidden="true" /><CardTitle className="pt-2">Free grammar practice</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">Explore the Level 1 concepts and choose a free game that matches the skill your child is practising.</p><Link href="/grammar-games-for-kids" className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">English Grammar Games<ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" /></Link></CardContent></Card><Card className="border-violet-200"><CardHeader><Languages className="h-7 w-7 text-violet-700" aria-hidden="true" /><CardTitle className="pt-2">Continue with the Academy</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">Zalea English Academy adds Grammar Level 2 and Vocabulary Level 1 with one-time Lifetime Access.</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2"><Link href="/vocabulary-games-for-kids" className="font-semibold text-primary hover:underline">Vocabulary guide</Link><Link href="/games/english/academy" className="font-semibold text-primary hover:underline">Explore the Academy</Link></div></CardContent></Card></div></section>
  </EducationHubLayout>;
}
