import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight, Scale } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export function LegalPage({ title, description, lastUpdated, children }: { title: string; description: string; lastUpdated: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border/60 bg-secondary/30">
          <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">{title}</span></nav>
            <span className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Scale className="h-6 w-6" aria-hidden="true" /></span>
            <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{description}</p>
            <p className="mt-4 text-sm font-semibold text-foreground">Last updated: {lastUpdated}</p>
          </div>
        </section>
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="space-y-10 text-[1.02rem] leading-7 text-muted-foreground">{children}</div>
        </article>
      </main>
      <SiteFooter />
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return <section><h2 className="text-2xl font-bold tracking-tight text-foreground">{title}</h2><div className="mt-4 space-y-4">{children}</div></section>;
}

export function LegalList({ children }: { children: ReactNode }) {
  return <ul className="ml-5 list-disc space-y-2 marker:text-primary">{children}</ul>;
}

export const legalLinkClass = 'font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary';
