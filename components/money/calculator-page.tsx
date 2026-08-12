import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, CircleHelp, Lightbulb } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type CalculatorPageProps = {
  title: string;
  description: string;
  calculator: ReactNode;
  whatItDoes: string;
  howToUse: string[];
  formula: string;
  example: string;
  faqs: { question: string; answer: string }[];
};

export function CalculatorPage({
  title,
  description,
  calculator,
  whatItDoes,
  howToUse,
  formula,
  example,
  faqs,
}: CalculatorPageProps) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background">
          <div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Link href="/finance" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              All Finance Tools
            </Link>
            <Badge variant="secondary" className="mt-6 block w-fit border-primary/20 bg-primary/10 text-primary">
              Free calculator
            </Badge>
            <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1000px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {calculator}
        </section>

        <section className="border-y border-border/60 bg-secondary/30">
          <div className="mx-auto grid max-w-[1000px] gap-6 px-4 py-14 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-20">
            <InfoCard icon={<BookOpen className="h-6 w-6" aria-hidden="true" />} title="What this calculator does">
              <p>{whatItDoes}</p>
            </InfoCard>
            <InfoCard icon={<Lightbulb className="h-6 w-6" aria-hidden="true" />} title="How to use it">
              <ol className="list-decimal space-y-2 pl-5">
                {howToUse.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </InfoCard>
            <InfoCard title="Calculation method">
              <p>{formula}</p>
            </InfoCard>
            <InfoCard title="Simple example">
              <p>{example}</p>
            </InfoCard>
          </div>
        </section>

        <section className="mx-auto max-w-[800px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="faq-heading">
          <div className="text-center">
            <CircleHelp className="mx-auto h-9 w-9 text-primary" aria-hidden="true" />
            <h2 id="faq-heading" className="mt-4 text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>
          <div className="mt-9 divide-y divide-border rounded-2xl border border-border/60 bg-card px-6 shadow-sm">
            {faqs.map((faq) => (
              <div key={faq.question} className="py-6">
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoCard({ icon, title, children }: { icon?: ReactNode; title: string; children: ReactNode }) {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader>
        {icon && <span className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="leading-relaxed text-muted-foreground">{children}</CardContent>
    </Card>
  );
}
