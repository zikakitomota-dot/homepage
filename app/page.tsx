import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  Gamepad2,
  GraduationCap,
  HeartHandshake,
  Percent,
  PiggyBank,
  ShieldCheck,
  WalletCards,
  type LucideIcon,
} from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { WhosVisiting } from '@/components/whos-visiting';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFreebie } from '@/lib/freebies';
import { HEALTH_TOOLS_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Zalea Studio | Free Online Tools & Digital Products' },
  description: 'Discover free online tools, educational games, printable resources, and practical digital products from Zalea Studio.',
  alternates: { canonical: '/' },
};

const resourceAreas = [
  { icon: PiggyBank, title: 'Finance', description: 'Compare prices, split bills, plan savings and estimate everyday costs.', href: '/finance' },
  { icon: Clock3, title: 'Work & Time', description: 'Calculate shifts, working days, durations, overtime and pay conversions.', href: '/work-time' },
  { icon: GraduationCap, title: 'Education', description: 'Work with assignment scores, grade targets, weighted results and GPA.', href: '/education' },
  { icon: Percent, title: 'Math', description: 'Solve percentage, fraction, ratio and statistics questions with shown steps.', href: '/math' },
  { icon: Gamepad2, title: 'Learning Games', description: 'Practise early English, addition and science through short browser games.', href: '/games' },
  { icon: Download, title: 'Free Printables', description: 'Download planners, trackers and early-learning activities in two paper sizes.', href: '/freebies' },
] as const;

const featuredTools = [
  { icon: Clock3, title: 'Work Hours Calculator', description: 'Add daily shifts and subtract unpaid breaks to calculate weekly hours and estimated pay.', href: '/work-time/work-hours-calculator' },
  { icon: CalendarDays, title: 'Business Days Calculator', description: 'Count working days or move a date forward or backward using a selected workweek.', href: '/work-time/business-days-calculator' },
  { icon: Percent, title: 'Percentage Calculator', description: 'Find percentages, percentage change, increases, decreases and reverse percentages.', href: '/math/percentage-calculator' },
  { icon: GraduationCap, title: 'Grade Calculator', description: 'Combine assignment points to calculate an overall percentage and estimated letter grade.', href: '/education/grade-calculator' },
  { icon: WalletCards, title: 'Unit Price Calculator', description: 'Compare package sizes and prices to identify the lower cost per unit.', href: '/finance/unit-price-calculator' },
  { icon: PiggyBank, title: 'Savings Goal Calculator', description: 'Estimate a contribution plan and timeline for a personal savings target.', href: '/finance/savings-goal-calculator' },
] as const;

const learningResources = [
  { icon: Gamepad2, title: 'Free English Games', description: 'Ten grammar activities covering articles, plurals, pronouns, verbs, ownership and position words.', href: '/games/english' },
  { icon: Calculator, title: 'Addition Level 1', description: 'Practise addition within 10 and 20, including simple joining word problems.', href: '/games/math/addition-level-1' },
  { icon: BookOpen, title: 'English Learning Guide', description: 'Choose practice by skill, difficulty and the kind of support a child currently needs.', href: '/english-games-for-kids' },
  { icon: GraduationCap, title: 'Grammar Games Guide', description: 'See what each free Level 1 grammar activity teaches before starting a game.', href: '/grammar-games-for-kids' },
] as const;

const practicalGuides = [
  { title: 'Set a Realistic Savings Goal', description: 'Turn a target and deadline into a contribution plan you can review.', href: '/guides/how-to-set-a-realistic-savings-goal' },
  { title: 'Equal vs Unequal Bill Splitting', description: 'Choose a fair method for different orders, shared items and charges.', href: '/guides/equal-vs-unequal-bill-splitting' },
  { title: 'Percentage Points vs Percentage Change', description: 'Use the right comparison when two percentage rates move.', href: '/guides/percentage-points-vs-percentage-change' },
  { title: 'Pre-Writing Skills and Activities', description: 'Support pencil control through movement, play and low-pressure practice.', href: '/guides/pre-writing-skills-activities' },
] as const;

const highlightedFreebies = ['grade-tracker', 'study-planner', 'pre-writing-pencil-control', 'savings-goal-tracker'].map((slug) => {
  const freebie = getFreebie(slug);
  if (!freebie) throw new Error(`Homepage freebie is missing: ${slug}`);
  return freebie;
});

export default function Home() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main id="home">
    <WhosVisiting />

    <section id="free-tools" className="scroll-mt-20 border-b border-border/60 bg-secondary/30" aria-labelledby="resource-areas"><div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Three ways to use Zalea</p><h2 id="resource-areas" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Calculate, learn, or work through a practical task</h2><p className="mt-4 leading-relaxed text-muted-foreground">Finance, work, education and math tools handle everyday calculations. Learning games support focused practice. Guides and printables help plan, teach or record what happens next.</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{resourceAreas.map((area) => <ResourceCard key={area.href} {...area} />)}</div></div></section>

    <section className="border-b border-border/60" aria-labelledby="practical-guides"><div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16"><div className="flex flex-wrap items-end justify-between gap-4"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Understand before you act</p><h2 id="practical-guides" className="mt-2 text-3xl font-bold tracking-tight">Practical Guides</h2><p className="mt-3 leading-relaxed text-muted-foreground">Read the reasoning behind a problem before you calculate, practise or download a resource.</p></div><Link href="/guides" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">View all Guides<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div><div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{practicalGuides.map((guide) => <Link key={guide.href} href={guide.href} className="group rounded-2xl border border-border/60 bg-card p-5 outline-none transition hover:border-primary/50 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><BookOpen className="h-5 w-5 text-primary" aria-hidden="true" /><h3 className="mt-3 font-bold leading-snug">{guide.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{guide.description}</p><span className="mt-3 inline-flex items-center text-sm font-semibold text-primary">Read guide<ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></span></Link>)}</div></div></section>

    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="featured-tools"><div className="mb-10 max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Useful calculations</p><h2 id="featured-tools" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Popular free tools</h2><p className="mt-4 leading-relaxed text-muted-foreground">A small selection from Zalea&apos;s work, finance, education and math collections.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featuredTools.map((tool) => <ResourceCard key={tool.href} {...tool} />)}</div></section>

    <section className="border-y border-border/60 bg-secondary" aria-labelledby="learning-resources"><div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mb-10 max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Learn and practise</p><h2 id="learning-resources" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Free educational games and guides</h2><p className="mt-4 leading-relaxed text-muted-foreground">Children can practise one focused skill, while parents and teachers can read what the activity covers and how to support it away from the screen.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{learningResources.map((resource) => <ResourceCard key={resource.href} {...resource} />)}</div><Link href="/games" className="mt-7 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Explore all learning games<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div></section>

    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="free-downloads"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Genuinely free downloads</p><h2 id="free-downloads" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Printable resources for study, early learning and planning</h2><p className="mt-4 leading-relaxed text-muted-foreground">These printable sets are available in both A4 and US Letter sizes without a purchase.</p></div><Button asChild variant="outline"><Link href="/freebies">Browse all Freebies</Link></Button></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{highlightedFreebies.map((freebie) => <Link key={freebie.slug} href={`/freebies/${freebie.slug}`} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><Card className="h-full border-border/60 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md"><CardHeader><div className="flex items-center justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Download className="h-5 w-5" aria-hidden="true" /></span><Badge variant="secondary" className="border-sage/30 bg-sage-soft text-sage-foreground">Free</Badge></div><CardTitle className="pt-2 text-xl">{freebie.title}</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{freebie.description}</p><p className="mt-4 text-sm font-semibold text-primary">View download<ArrowRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></p></CardContent></Card></Link>)}</div></section>

    <section className="border-y border-border/60 bg-secondary/30" aria-labelledby="zalea-approach"><div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">How Zalea approaches its resources</p><h2 id="zalea-approach" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Clear tasks, visible methods and useful context</h2><p className="mt-4 leading-relaxed text-muted-foreground">Each public page is built around a specific calculation, planning task or learning idea. Where a formula or assumption affects the result, the page explains it and notes relevant limitations.</p><p className="mt-4 leading-relaxed text-muted-foreground">Tools are checked with ordinary examples, boundary values and invalid entries, and pages are reviewed for mobile and keyboard use. If something appears incorrect, Zalea provides a contact path so it can be investigated and corrected.</p><Link href="/about" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Read about Zalea Studio&apos;s approach<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div><div className="mt-9 grid gap-5 md:grid-cols-3"><TrustCard icon={CheckCircle2} title="Built for a clear task">Tools focus on a defined calculation or practical decision rather than a generic result box.</TrustCard><TrustCard icon={FileCheck2} title="Methods are explained">Formulas, important assumptions and interpretation notes are shown where they matter.</TrustCard><TrustCard icon={ShieldCheck} title="Limits are stated">Results are presented as appropriate estimates or learning support, not as professional advice or formal assessment.</TrustCard></div></div></section>

    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="digital-shop-heading"><div className="mx-auto max-w-3xl rounded-[2.5rem_1.75rem_2.75rem_2rem] border border-border/60 bg-card px-6 py-12 text-center shadow-sm sm:px-12"><p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Optional digital resources</p><h2 id="digital-shop-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Practical templates in the digital shop</h2><p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted-foreground">Explore business spreadsheets, printable resources and premium English learning materials alongside Zalea&apos;s free public tools, games and downloads.</p><Button asChild size="lg" className="mt-7"><Link href="/shop" data-ga-event="cta_click" data-ga-label="home_browse_digital_shop">Browse the digital shop<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></div></section>

    <section className="border-t border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="relative overflow-hidden rounded-[3rem_2rem_3.25rem_2.25rem] bg-primary px-6 py-16 text-center text-primary-foreground shadow-lg sm:px-12"><HeartHandshake className="mx-auto h-10 w-10" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Choose what is useful today</h2><p className="mx-auto mt-4 max-w-2xl text-lg">Start with a free calculator, game or printable. The health-calculator collection and digital shop remain available when they match what you need.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="lg" className="h-12 bg-card px-6 text-card-foreground hover:bg-secondary"><Link href="#free-tools" data-ga-event="cta_click" data-ga-label="home_final_free_resources">Explore Free Resources</Link></Button><Button asChild size="lg" variant="outline" className="h-12 border-current bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link href={HEALTH_TOOLS_URL} data-ga-event="cta_click" data-ga-label="home_health_tools">Health Calculators</Link></Button><Button asChild size="lg" variant="outline" className="h-12 border-current bg-transparent px-6 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"><Link href="/shop" data-ga-event="cta_click" data-ga-label="home_final_browse_shop">Browse the Shop</Link></Button></div></div></div></section>
  </main><SiteFooter /></div>;
}

function ResourceCard({ icon: Icon, title, description, href }: { icon: LucideIcon; title: string; description: string; href: string }) {
  return <Link href={href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><Card className="h-full border-border/60 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="flex items-center justify-between gap-3 pt-2 text-xl">{title}<ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" /></CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{description}</p></CardContent></Card></Link>;
}

function TrustCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{children}</p></CardContent></Card>;
}
