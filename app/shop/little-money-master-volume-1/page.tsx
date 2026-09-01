import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Award, BookOpen, CheckCircle2, Gamepad2, Users } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { littleMoneyMaster, PAYHIP_LITTLE_MONEY_MASTER_URL, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: { absolute: 'Needs or Wants? Money Game for Kids Ages 5–8 | Zalea Studio' },
  description:
    'Teach children ages 5–8 the difference between needs and wants with Little Money Master™, an interactive financial literacy game with a Parent & Teacher Guide and completion certificate.',
  alternates: { canonical: littleMoneyMaster.href },
  openGraph: {
    type: 'website',
    title: 'Needs or Wants? Money Game for Kids Ages 5–8 | Zalea Studio',
    description:
      'An interactive financial literacy game with a Parent & Teacher Guide and completion certificate.',
    url: littleMoneyMaster.href,
  },
};

const productJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: littleMoneyMaster.name,
  description: littleMoneyMaster.description,
  url: `${SITE_URL}${littleMoneyMaster.href}`,
  brand: {
    '@type': 'Brand',
    name: 'Zalea Studio',
  },
  audience: {
    '@type': 'PeopleAudience',
    suggestedMinAge: 5,
    suggestedMaxAge: 8,
  },
};

const learningOutcomes = [
  'Recognize the difference between essential needs and optional wants',
  'Think carefully before making simple spending choices',
  'Build early financial vocabulary and confidence',
  'Talk about money decisions with a trusted adult or teacher',
];

const faqs = [
  {
    question: 'What age is Little Money Master™ Volume 1 designed for?',
    answer: 'The game is designed for children ages 5–8, with guidance from a parent, caregiver, or teacher where helpful.',
  },
  {
    question: 'What topic does this volume teach?',
    answer: 'Volume 1 focuses on helping children understand the difference between needs and wants.',
  },
  {
    question: 'Is support material included for adults?',
    answer: 'Yes. The product includes a Parent & Teacher Guide to support discussion and learning.',
  },
  {
    question: 'Does the product include a certificate?',
    answer: 'Yes. A completion certificate is included to celebrate finishing the learning experience.',
  },
];

export default function LittleMoneyMasterPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, '\\u003c') }} />

        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background">
          <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
            <div>
              <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-foreground">Home</Link><span className="mx-2">/</span><Link href="/shop" className="hover:text-foreground">Shop</Link><span className="mx-2">/</span><span>Little Money Master™</span>
              </nav>
              <Badge className="bg-primary/10 text-primary hover:bg-primary/10">Interactive financial literacy game</Badge>
              <h1 className="mt-5 text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Little Money Master™ Volume 1 – Needs or Wants?
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{littleMoneyMaster.description}</p>
              <Button asChild size="lg" className="mt-8 h-12 px-6">
                <a href={PAYHIP_LITTLE_MONEY_MASTER_URL} target="_blank" rel="noreferrer">
                  Get Little Money Master™
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
            <div className="flex min-h-80 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-100 to-blue-50 p-4 sm:p-8">
              <Image
                src="/images/Cover.webp"
                alt="Little Money Master Volume 1 Needs or Wants product cover"
                width={1587}
                height={2245}
                priority
                sizes="(min-width: 1024px) 384px, (min-width: 640px) 55vw, 85vw"
                className="h-auto w-full max-w-sm rounded-2xl object-contain shadow-lg"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="learn-heading">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">Early money skills</p>
              <h2 id="learn-heading" className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">What Children Will Learn</h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">Needs and wants are an important foundation for thoughtful money decisions. This game introduces the idea in a child-friendly, interactive format.</p>
            </div>
            <ul className="space-y-4">
              {learningOutcomes.map((outcome) => <li key={outcome} className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span>{outcome}</span></li>)}
            </ul>
          </div>
        </section>

        <section className="border-y border-border/60 bg-secondary/30" aria-labelledby="included-heading">
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <h2 id="included-heading" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">What&apos;s Included</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              <InfoCard icon={Gamepad2} title="Interactive Learning Game">An engaging activity that helps children practise identifying needs and wants.</InfoCard>
              <InfoCard icon={BookOpen} title="Parent & Teacher Guide">Guidance for adults to reinforce the lesson and encourage useful conversations.</InfoCard>
              <InfoCard icon={Award} title="Completion Certificate">A certificate that recognizes the child&apos;s progress after completing the game.</InfoCard>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <Users className="h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-3xl font-bold tracking-tight">Who It&apos;s For</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">Designed for children ages 5–8 and the parents, caregivers, and teachers helping them develop practical early money skills.</p>
            </div>
            <div>
              <Gamepad2 className="h-10 w-10 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-3xl font-bold tracking-tight">How It Works</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">Children work through the interactive game, decide whether examples are needs or wants, and use the included adult guide to continue the conversation. They can mark their progress with the completion certificate.</p>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-blue-50/60">
          <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
            <BookOpen className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight">Parent & Teacher Guide</h2>
            <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground">The included guide helps adults introduce needs and wants, support children during the activity, and turn the game into a practical conversation about everyday choices.</p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6">
            {faqs.map((faq) => <div key={faq.question} className="py-6"><h3 className="font-semibold">{faq.question}</h3><p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p></div>)}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-6 lg:px-8 lg:pb-24">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-blue-700 px-6 py-14 text-center text-white shadow-lg sm:px-12">
            <h2 className="text-3xl font-bold tracking-tight">Make Money Learning Fun</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-50">Help a child build a strong foundation by learning how to tell the difference between needs and wants.</p>
            <Button asChild size="lg" className="mt-8 h-12 bg-white px-6 text-primary hover:bg-blue-50"><a href={PAYHIP_LITTLE_MONEY_MASTER_URL} target="_blank" rel="noreferrer">Get Little Money Master™</a></Button>
            <p className="mt-5 text-sm text-blue-100">Want to see more? <Link href="/shop" className="font-medium text-white underline underline-offset-4">Return to the Zalea Studio shop</Link>.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoCard({ icon: Icon, title, children }: { icon: typeof Gamepad2; title: string; children: React.ReactNode }) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader><span className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" aria-hidden="true" /></span><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><p className="leading-relaxed text-muted-foreground">{children}</p></CardContent>
    </Card>
  );
}
