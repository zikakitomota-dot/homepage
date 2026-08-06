import Link from 'next/link';
import {
  Calculator,
  ArrowRight,
  PiggyBank,
  Users,
  BookOpen,
  Bot,
  Zap,
  ShieldCheck,
  HeartHandshake,
  Menu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const HOME_URL = 'https://zaleastudio.com/';
const HEALTH_CALCULATORS_URL = 'https://health.zaleastudio.com/';

const navLinks = [
  { label: 'Home', href: HOME_URL, external: true },
  { label: 'Health Calculators', href: HEALTH_CALCULATORS_URL, external: true },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

const upcomingProjects = [
  {
    icon: PiggyBank,
    title: 'Money Tools',
    description: 'Budget planners, savings trackers and personal finance tools.',
  },
  {
    icon: Users,
    title: 'Parenting Resources',
    description: 'Helpful tools and educational resources for parents.',
  },
  {
    icon: BookOpen,
    title: 'Educational Printables',
    description: 'Printable learning packs and classroom resources.',
  },
  {
    icon: Bot,
    title: 'AI Utilities',
    description: 'Simple AI-powered tools that improve everyday productivity.',
  },
];

const features = [
  {
    icon: Zap,
    title: 'Fast & Free',
    description: 'Our tools are lightweight, fast and free to use.',
  },
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    description: 'We respect user privacy and avoid unnecessary data collection.',
  },
  {
    icon: HeartHandshake,
    title: 'Made for Everyday Life',
    description: 'Every product is designed to solve real-world problems.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href={HOME_URL} className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Calculator className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Zalea Studio
            </span>
          </a>

          <nav
            className="hidden items-center gap-8 md:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="hidden md:block">
            <Button asChild size="sm">
              <a href={HEALTH_CALCULATORS_URL}>Get Started</a>
            </Button>
          </div>

          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent md:hidden"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main id="home">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/60">
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-b from-blue-50/60 via-background to-background"
            aria-hidden="true"
          />
          <div
            className="absolute left-1/2 top-0 -z-10 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-100/30 blur-3xl"
            aria-hidden="true"
          />
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
            <div className="flex flex-col items-start gap-6">
              <Badge
                variant="secondary"
                className="border-primary/20 bg-primary/10 text-primary"
              >
                Digital tools for everyday life
              </Badge>
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
                Create Better Everyday Tools
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Zalea Studio builds free online calculators, educational
                resources, printable products, and digital tools that help
                people make smarter everyday decisions.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 px-6">
                  <a href={HEALTH_CALCULATORS_URL}>
                    Explore Health Calculators
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 px-6"
                >
                  <Link href="#about">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Abstract graphic */}
            <div className="relative" aria-hidden="true">
              <div className="relative mx-auto aspect-square w-full max-w-md">
                <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-blue-100 to-blue-50" />
                <div className="absolute inset-6 rounded-[2rem] border border-primary/10 bg-white shadow-xl">
                  {/* Grid lines */}
                  <div className="absolute inset-0 overflow-hidden rounded-[2rem]">
                    <div className="absolute left-0 right-0 top-1/3 h-px bg-primary/10" />
                    <div className="absolute left-0 right-0 top-2/3 h-px bg-primary/10" />
                    <div className="absolute bottom-0 top-0 left-1/3 w-px bg-primary/10" />
                    <div className="absolute bottom-0 top-0 left-2/3 w-px bg-primary/10" />
                  </div>
                  {/* Floating cards */}
                  <div className="absolute left-8 top-10 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-border/60">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Calculator className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      BMI
                    </span>
                  </div>
                  <div className="absolute right-8 top-20 flex items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-border/60">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <HeartHandshake className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      Health
                    </span>
                  </div>
                  <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-white px-3 py-2 shadow-md ring-1 ring-border/60">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-medium text-foreground">
                      Learn
                    </span>
                  </div>
                  {/* Central ring */}
                  <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-primary/30" />
                  <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg" />
                  <div className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Tool */}
        <section
          className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24 lg:px-8"
        >
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Featured Tool
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our most popular collection
            </h2>
          </div>

          <Card className="mx-auto max-w-4xl border-border/60 shadow-md">
            <CardHeader className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Calculator className="h-7 w-7" aria-hidden="true" />
                </span>
                <div>
                  <CardTitle className="text-2xl">Health Calculators</CardTitle>
                  <CardDescription className="mt-1 text-base">
                    A growing collection of free health calculators
                  </CardDescription>
                </div>
              </div>
              <Badge
                variant="secondary"
                className="border-primary/20 bg-primary/10 text-primary"
              >
                Available now
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-base leading-relaxed text-muted-foreground">
                A growing collection of free health calculators including BMI,
                calorie needs, pregnancy due date, body fat estimation, ideal
                weight, water intake and more.
              </p>
              <Button asChild size="lg" className="h-11 px-6">
                <a href={HEALTH_CALCULATORS_URL}>
                  Visit Health Calculators
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Upcoming Projects */}
        <section className="border-y border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Upcoming Projects
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                New tools and resources we&apos;re building next.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {upcomingProjects.map((project) => (
                <Card
                  key={project.title}
                  className="group flex flex-col border-border/60 shadow-sm transition-shadow hover:shadow-md"
                >
                  <CardHeader>
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <project.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                    </div>
                    <Badge
                      variant="outline"
                      className="w-fit border-amber-300 bg-amber-50 text-amber-700"
                    >
                      Coming Soon
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {project.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              About Zalea Studio
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              We believe technology should be practical, accessible and
              genuinely useful. Our goal is to create digital products that
              solve everyday problems through thoughtful design and simple
              experiences.
            </p>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="border-t border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Choose Us
              </h2>
              <p className="mt-3 text-lg text-muted-foreground">
                Built with care for everyday users.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <Card
                  key={feature.title}
                  className="border-border/60 shadow-sm"
                >
                  <CardHeader>
                    <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call To Action */}
        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:py-24 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 px-6 py-16 text-center shadow-lg sm:px-12">
            <div
              className="absolute inset-0 -z-10 opacity-20"
              aria-hidden="true"
            >
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Start Exploring
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-blue-50">
              Discover free tools built to make everyday decisions easier.
            </p>
            <div className="mt-8 flex justify-center">
              <Button
                asChild
                size="lg"
                className="h-12 bg-white px-6 text-primary hover:bg-blue-50"
              >
                <a href={HEALTH_CALCULATORS_URL}>
                  Explore Health Calculators
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <a href={HOME_URL} className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Calculator className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-base font-semibold text-foreground">
                Zalea Studio
              </span>
            </a>
            <nav
              className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
              aria-label="Footer navigation"
            >
              <Link
                href="#about"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="#privacy"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="#terms"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Terms of Use
              </Link>
              <Link
                href="#contact"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Contact
              </Link>
            </nav>
          </div>
          <div className="mt-8 border-t border-border/60 pt-6 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Zalea Studio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
