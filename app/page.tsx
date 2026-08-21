import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Clock3,
  HeartHandshake,
  Percent,
  PiggyBank,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HEALTH_TOOLS_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Zalea Studio | Free Online Tools & Digital Products' },
  description:
    'Discover free online tools, educational games, printable resources, and practical digital products from Zalea Studio.',
  alternates: { canonical: '/' },
};

const upcomingProjects = [
  { icon: PiggyBank, title: 'Finance Tools', description: 'Simple calculators for everyday spending, savings and smarter buying decisions.', href: '/finance' },
  { icon: Clock3, title: 'Work & Time', description: 'Calculate work hours, schedules, timesheets and everyday work-related time.', href: '/work-time' },
  { icon: BookOpen, title: 'Education Tools', description: 'Free grade calculators and practical student tools for schoolwork.', href: '/education' },
  { icon: Percent, title: 'Math Tools', description: 'Fast percentage calculations with clear formulas and useful explanations.', href: '/math' },
];

const features = [
  { icon: Zap, title: 'Fast & Accessible', description: 'Straightforward tools and resources designed to be easy to use.' },
  { icon: ShieldCheck, title: 'Privacy First', description: 'We respect user privacy and avoid unnecessary data collection.' },
  { icon: HeartHandshake, title: 'Made for Everyday Life', description: 'Every tool and product is designed to solve a practical problem.' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main id="home">
        <section className="relative overflow-hidden border-b border-border/60">
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 via-background to-background" aria-hidden="true" />
          <div className="absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl" aria-hidden="true" />
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div className="flex flex-col items-start gap-6">
              <Badge variant="secondary" className="border-primary/20 bg-primary/10 text-primary">
                Tools and resources for everyday life
              </Badge>
              <h1 className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Smarter Everyday Decisions Start Here
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Free online tools, educational games, printable resources, and practical digital products designed to make everyday decisions easier.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6">
                  <a href={HEALTH_TOOLS_URL} data-ga-event="cta_click" data-ga-label="home_explore_tools">
                    Explore Free Tools
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-6">
                  <Link href="/shop" data-ga-event="cta_click" data-ga-label="home_browse_shop">Browse the Shop</Link>
                </Button>
              </div>
            </div>

            <div className="relative" aria-hidden="true">
              <div className="relative mx-auto aspect-square w-full max-w-md">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-100 to-blue-50" />
                <div className="absolute inset-6 rounded-[2rem] border border-primary/10 bg-white shadow-xl">
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                    <div className="absolute left-0 right-0 top-1/3 h-px bg-primary/10" />
                    <div className="absolute left-0 right-0 top-2/3 h-px bg-primary/10" />
                    <div className="absolute bottom-0 left-1/3 top-0 w-px bg-primary/10" />
                    <div className="absolute bottom-0 left-2/3 top-0 w-px bg-primary/10" />
                  </div>
                  <div className="absolute left-8 top-10 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-border/60">
                    <Calculator className="h-5 w-5 text-primary" /><span className="text-xs font-medium">Tools</span>
                  </div>
                  <div className="absolute right-8 top-20 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-border/60">
                    <BookOpen className="h-5 w-5 text-primary" /><span className="text-xs font-medium">Learn</span>
                  </div>
                  <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-border/60">
                    <PiggyBank className="h-5 w-5 text-primary" /><span className="text-xs font-medium">Finance</span>
                  </div>
                  <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/30" />
                  <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg" />
                  <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="featured-product-heading">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">Learn through play</p>
            <h2 id="featured-product-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Product</h2>
          </div>
          <ProductCard featured />
        </section>

        <section className="border-y border-border/60 bg-secondary/30" aria-labelledby="tools-heading">
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 id="tools-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">A Growing Hub of Useful Resources</h2>
              <p className="mt-3 text-lg text-muted-foreground">Explore our free health, finance, work, time, education and math calculators.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingProjects.map((project) => (
                <Link key={project.title} href={project.href} className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <Card className="h-full border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                    <CardHeader>
                      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><project.icon className="h-6 w-6" aria-hidden="true" /></span>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <Badge variant="secondary" className="w-fit border-primary/20 bg-primary/10 text-primary">Available now</Badge>
                    </CardHeader>
                    <CardContent><p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p></CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="mt-10 text-center"><Button asChild variant="outline"><a href={HEALTH_TOOLS_URL} data-ga-event="cta_click" data-ga-label="home_explore_current_tools">Explore Current Tools</a></Button></div>
          </div>
        </section>

        <section id="about" className="scroll-mt-24 mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About Zalea Studio</h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              Zalea Studio creates practical digital experiences for children, parents, teachers, and families. From <a href={HEALTH_TOOLS_URL} className="font-medium text-primary hover:underline">free online tools</a> to educational games in our <Link href="/shop" className="font-medium text-primary hover:underline">digital shop</Link>, everything is designed to make learning and everyday decisions simpler.
            </p>
          </div>
        </section>

        <section className="border-t border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto mb-12 max-w-2xl text-center"><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Zalea Studio</h2></div>
            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="border-border/60 shadow-sm">
                  <CardHeader><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><feature.icon className="h-6 w-6" aria-hidden="true" /></span><CardTitle className="text-xl">{feature.title}</CardTitle></CardHeader>
                  <CardContent><p className="leading-relaxed text-muted-foreground">{feature.description}</p></CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 px-6 py-16 text-center shadow-lg sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Explore Zalea Studio</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-blue-50">Discover free tools and practical digital resources created to make learning and everyday decisions easier.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 bg-white px-6 text-primary hover:bg-blue-50"><a href={HEALTH_TOOLS_URL} data-ga-event="cta_click" data-ga-label="home_explore_free_tools">Explore Free Tools</a></Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-white bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"><Link href="/shop" data-ga-event="cta_click" data-ga-label="home_final_browse_shop">Browse the Shop</Link></Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
