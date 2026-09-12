import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

type GuidePageProps = {
  title: string;
  description: string;
  path: string;
  eyebrow: string;
  children: ReactNode;
  relatedLinks: { label: string; href: string; description: string }[];
};

export function GuidePage({ title, description, path, eyebrow, children, relatedLinks }: GuidePageProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: title,
        description,
        url: `${SITE_URL}${path}`,
        mainEntityOfPage: `${SITE_URL}${path}`,
        publisher: { '@type': 'Organization', name: 'Zalea Studio', url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
          { '@type': 'ListItem', position: 3, name: title, item: `${SITE_URL}${path}` },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
        <section className="border-b border-border/60 bg-gradient-to-b from-blue-50/70 to-background">
          <div className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground hover:underline">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/guides" className="hover:text-foreground hover:underline">Guides</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{title}</span>
            </nav>
            <Link href="/guides" className="mt-7 inline-flex items-center text-sm font-medium text-primary hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />All Guides
            </Link>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
            <h1 className="mt-3 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">{description}</p>
          </div>
        </section>

        <article className="mx-auto max-w-[900px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          {children}
        </article>

        <section className="border-y border-border/60 bg-secondary/30" aria-labelledby="related-guide-resources">
          <div className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="flex items-center gap-3"><BookOpen className="h-7 w-7 text-primary" aria-hidden="true" /><h2 id="related-guide-resources" className="text-3xl font-bold tracking-tight">Related Zalea resources</h2></div>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="group rounded-2xl border border-border/60 bg-card p-5 outline-none transition hover:border-primary/60 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <h3 className="font-bold text-primary">{link.label}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{link.description}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">Explore <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" /></span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
