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
import { ProductCard } from '@/components/product-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getFreebie } from '@/lib/freebies';
import { HEALTH_TOOLS_URL } from '@/lib/site';
import { SHOP_PRODUCTS } from '@/lib/shop-products';

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

const highlightedFreebies = ['grade-tracker', 'study-planner', 'pre-writing-pencil-control', 'savings-goal-tracker'].map((slug) => {
  const freebie = getFreebie(slug);
  if (!freebie) throw new Error(`Homepage freebie is missing: ${slug}`);
  return freebie;
});

const featuredProduct = SHOP_PRODUCTS.find((product) => product.id === 'money-milestone-usd');

export default function Home() {
  if (!featuredProduct) throw new Error('Money Milestone featured product is missing from the shop catalogue.');

  return <div className="min-h-screen bg-background"><SiteHeader /><main id="home">
    <section className="relative overflow-hidden border-b border-border/60">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 via-background to-background" aria-hidden="true" />
      <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl" aria-hidden="true" />
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div className="flex flex-col items-start gap-6"><Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary">Free tools and resources for everyday life</Badge><h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">Practical Help for Everyday Questions and Learning</h1><p className="max-w-xl text-lg leading-relaxed text-muted-foreground">Use free calculators, educational games, printable resources and clear guides for money, work, study and family learning. Zalea Studio also offers optional digital products in the shop.</p><div className="flex flex-col gap-3 sm:flex-row"><Button asChild size="lg" className="h-12 px-6"><Link href="#free-tools" data-ga-event="cta_click" data-ga-label="home_explore_free_resources">Explore Free Resources<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button><Button asChild size="lg" variant="outline" className="h-12 px-6"><Link href="/freebies" data-ga-event="cta_click" data-ga-label="home_browse_freebies">Browse Free Downloads</Link></Button></div></div>
        <div className="relative" aria-hidden="true"><div className="relative mx-auto aspect-square w-full max-w-md"><div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-100 to-blue-50" /><div className="absolute inset-6 rounded-[2rem] border border-primary/10 bg-white shadow-xl"><div className="absolute inset-0 overflow-hidden rounded-[2rem]"><div className="absolute left-0 right-0 top-1/3 h-px bg-primary/10" /><div className="absolute left-0 right-0 top-2/3 h-px bg-primary/10" /><div className="absolute bottom-0 left-1/3 top-0 w-px bg-primary/10" /><div className="absolute bottom-0 left-2/3 top-0 w-px bg-primary/10" /></div><div className="absolute left-8 top-10 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-border/60"><Calculator className="h-5 w-5 text-primary" /><span className="text-xs font-medium">Tools</span></div><div className="absolute right-8 top-20 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-border/60"><BookOpen className="h-5 w-5 text-primary" /><span className="text-xs font-medium">Learn</span></div><div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-border/60"><PiggyBank className="h-5 w-5 text-primary" /><span className="text-xs font-medium">Finance</span></div><div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/30" /><div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg" /><div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" /></div></div></div>
      </div>
    </section>

    <section id="free-tools" className="scroll-mt-20 border-b border-border/60 bg-secondary/30" aria-labelledby="resource-areas"><div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mx-auto mb-10 max-w-3xl text-center"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Start with a free resource</p><h2 id="resource-areas" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Choose the area that matches your task</h2><p className="mt-4 leading-relaxed text-muted-foreground">Each section groups tools or resources around a practical question, so you can go directly to the type of help you need.</p></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{resourceAreas.map((area) => <ResourceCard key={area.href} {...area} />)}</div></div></section>

    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="featured-tools"><div className="mb-10 max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Useful calculations</p><h2 id="featured-tools" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Popular free tools</h2><p className="mt-4 leading-relaxed text-muted-foreground">A small selection from Zalea&apos;s work, finance, education and math collections.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{featuredTools.map((tool) => <ResourceCard key={tool.href} {...tool} />)}</div></section>

    <section className="border-y border-border/60 bg-blue-50/50" aria-labelledby="learning-resources"><div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="mb-10 max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Learn and practise</p><h2 id="learning-resources" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Free educational games and guides</h2><p className="mt-4 leading-relaxed text-muted-foreground">Children can practise one focused skill, while parents and teachers can read what the activity covers and how to support it away from the screen.</p></div><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">{learningResources.map((resource) => <ResourceCard key={resource.href} {...resource} />)}</div><Link href="/games" className="mt-7 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Explore all learning games<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div></section>

    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="free-downloads"><div className="mb-10 flex flex-wrap items-end justify-between gap-5"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Genuinely free downloads</p><h2 id="free-downloads" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Printable resources for study, early learning and planning</h2><p className="mt-4 leading-relaxed text-muted-foreground">These printable sets are available in both A4 and US Letter sizes without a purchase.</p></div><Button asChild variant="outline"><Link href="/freebies">Browse all Freebies</Link></Button></div><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{highlightedFreebies.map((freebie) => <Link key={freebie.slug} href={`/freebies/${freebie.slug}`} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><Card className="h-full border-border/60 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md"><CardHeader><div className="flex items-center justify-between gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Download className="h-5 w-5" aria-hidden="true" /></span><Badge variant="secondary" className="border-green-200 bg-green-50 text-green-700">Free</Badge></div><CardTitle className="pt-2 text-xl">{freebie.title}</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{freebie.description}</p><p className="mt-4 text-sm font-semibold text-primary">View download<ArrowRight className="ml-1 inline h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" /></p></CardContent></Card></Link>)}</div></section>

    <section className="border-y border-border/60 bg-secondary/30" aria-labelledby="zalea-approach"><div className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="max-w-3xl"><p className="text-sm font-semibold uppercase tracking-wider text-primary">How Zalea approaches its resources</p><h2 id="zalea-approach" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Clear tasks, visible methods and useful context</h2><p className="mt-4 leading-relaxed text-muted-foreground">Each public page is built around a specific calculation, planning task or learning idea. Where a formula or assumption affects the result, the page explains it and notes relevant limitations.</p><p className="mt-4 leading-relaxed text-muted-foreground">Tools are checked with ordinary examples, boundary values and invalid entries, and pages are reviewed for mobile and keyboard use. If something appears incorrect, Zalea provides a contact path so it can be investigated and corrected.</p><Link href="/about" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Read about Zalea Studio&apos;s approach<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div><div className="mt-9 grid gap-5 md:grid-cols-3"><TrustCard icon={CheckCircle2} title="Built for a clear task">Tools focus on a defined calculation or practical decision rather than a generic result box.</TrustCard><TrustCard icon={FileCheck2} title="Methods are explained">Formulas, important assumptions and interpretation notes are shown where they matter.</TrustCard><TrustCard icon={ShieldCheck} title="Limits are stated">Results are presented as appropriate estimates or learning support, not as professional advice or formal assessment.</TrustCard></div></div></section>

    <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="featured-product-heading"><div className="mx-auto mb-12 max-w-2xl text-center"><p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Optional digital resources</p><h2 id="featured-product-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Product</h2><p className="mt-4 leading-relaxed text-muted-foreground">The shop offers paid printables and digital products alongside Zalea&apos;s free public tools, games and downloads.</p></div><ProductCard product={featuredProduct} featured /><div className="mt-8 text-center"><Link href="/shop" className="inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Browse all digital products<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></div></section>

    <section className="border-t border-border/60 bg-secondary/30"><div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24"><div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 px-6 py-16 text-center shadow-lg sm:px-12"><HeartHandshake className="mx-auto h-10 w-10 text-white" aria-hidden="true" /><h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Choose what is useful today</h2><p className="mx-auto mt-4 max-w-2xl text-lg text-blue-50">Start with a free calculator, game or printable. The health-calculator collection and digital shop remain available when they match what you need.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Button asChild size="lg" className="h-12 bg-white px-6 text-primary hover:bg-blue-50"><Link href="#free-tools" data-ga-event="cta_click" data-ga-label="home_final_free_resources">Explore Free Resources</Link></Button><Button asChild size="lg" variant="outline" className="h-12 border-white bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"><a href={HEALTH_TOOLS_URL} data-ga-event="cta_click" data-ga-label="home_health_tools">Health Calculators</a></Button><Button asChild size="lg" variant="outline" className="h-12 border-white bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"><Link href="/shop" data-ga-event="cta_click" data-ga-label="home_final_browse_shop">Browse the Shop</Link></Button></div></div></div></section>
  </main><SiteFooter /></div>;
}

function ResourceCard({ icon: Icon, title, description, href }: { icon: LucideIcon; title: string; description: string; href: string }) {
  return <Link href={href} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><Card className="h-full border-border/60 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="flex items-center justify-between gap-3 pt-2 text-xl">{title}<ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" /></CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{description}</p></CardContent></Card></Link>;
}

function TrustCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return <Card className="border-border/60 shadow-sm"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="pt-2 text-xl">{title}</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{children}</p></CardContent></Card>;
}
