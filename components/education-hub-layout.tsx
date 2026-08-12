import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';

export function EducationHubLayout({
  eyebrow,
  title,
  introduction,
  children,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  children: ReactNode;
}) {
  return <div className="min-h-screen bg-background"><SiteHeader /><main>
    <section className="border-b border-border/60 bg-blue-50/70"><div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="Breadcrumb"><Link href="/">Home</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><Link href="/games">Games</Link><ChevronRight className="h-4 w-4" aria-hidden="true" /><span aria-current="page">{eyebrow}</span></nav>
      <p className="mt-7 text-sm font-bold uppercase tracking-wider text-primary">{eyebrow}</p>
      <h1 className="mt-3 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground">{introduction}</p>
    </div></section>
    {children}
  </main><SiteFooter /></div>;
}
