import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, ClipboardCheck, Download, FileArchive, FileText, Lightbulb, Target, Users } from 'lucide-react';
import { notFound } from 'next/navigation';
import { FreebiePreview } from '@/components/freebies/freebie-preview';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Button } from '@/components/ui/button';
import { freebieCategories, getFreebie, publishedFreebies } from '@/lib/freebies';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return publishedFreebies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const freebie = getFreebie((await params).slug);
  if (!freebie) return {};
  const path = `/freebies/${freebie.slug}`;
  return {
    title: { absolute: freebie.seoTitle }, description: freebie.seoDescription,
    alternates: { canonical: path },
    openGraph: { title: freebie.seoTitle, description: freebie.seoDescription, url: path, type: 'website' },
    twitter: { card: 'summary', title: freebie.seoTitle, description: freebie.seoDescription },
  };
}

export default async function FreebiePage({ params }: Props) {
  const freebie = getFreebie((await params).slug);
  if (!freebie) notFound();
  const category = freebieCategories[freebie.category];
  const path = `/freebies/${freebie.slug}`;
  const relatedFreebies = freebie.relatedFreebies.map(getFreebie).filter((item): item is NonNullable<typeof item> => Boolean(item));
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Freebies', item: `${SITE_URL}/freebies` },
      { '@type': 'ListItem', position: 3, name: freebie.title, item: `${SITE_URL}${path}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
        <section className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-sage-soft">
          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><Link href="/" className="hover:text-primary hover:underline">Home</Link><span aria-hidden="true">/</span><Link href="/freebies" className="hover:text-primary hover:underline">Freebies</Link><span aria-hidden="true">/</span><span aria-current="page">{freebie.title}</span></nav>
            <Link href="/freebies" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> All freebies</Link>
            <div className="mt-7 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">{category.label}</p>
                <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">{freebie.title}</h1>
                <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">{freebie.description}</p>
                <div className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-foreground/80">
                  <span className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 shadow-sm"><Users className="h-4 w-4 text-sage-foreground" aria-hidden="true" />{freebie.ageRange ?? freebie.audience}</span>
                  <span className="rounded-full bg-background px-4 py-2 shadow-sm">{freebie.pageCount} pages</span>
                  <span className="rounded-full bg-background px-4 py-2 shadow-sm">{freebie.format}</span>
                </div>
              </div>
              <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-lg"><FreebiePreview freebie={freebie} /></div>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-[1100px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8 lg:py-20">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">What&apos;s Included</h2>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2">
              {freebie.includedPages.map((page) => <li key={page} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage-soft text-sage-foreground"><Check className="h-4 w-4" aria-hidden="true" /></span><span className="font-medium">{page}</span></li>)}
            </ul>
            {freebie.notice ? <p className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950"><strong>Please note:</strong> {freebie.notice}</p> : null}
          </div>
          <aside className="order-first h-fit rounded-3xl border border-primary/20 bg-card p-6 shadow-sm lg:order-none" aria-labelledby="download-heading">
            <FileArchive className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 id="download-heading" className="mt-4 text-2xl font-bold">Download Your Copy</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">No checkout, email or account required.</p>
            <Button asChild size="lg" className="mt-6 min-h-12 w-full gap-2 rounded-xl"><a href={freebie.bundleDownload} download data-ga-event="freebie_download" data-ga-label={freebie.slug} data-ga-format={freebie.bundleFormat.toLowerCase()}><Download className="h-5 w-5" aria-hidden="true" />Download Both Sizes <span className="sr-only">as {freebie.bundleFormat}</span></a></Button>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <DownloadLink href={freebie.a4Download} slug={freebie.slug} format="a4_pdf" label="A4 PDF" note="International" />
              <DownloadLink href={freebie.usLetterDownload} slug={freebie.slug} format="us_letter_pdf" label="US Letter PDF" note="US & Canada" />
            </div>
          </aside>
        </section>
        <section className="border-y border-border/60 bg-background" aria-labelledby="helps-heading">
          <div className="mx-auto grid max-w-[1100px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div>
              <Target className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 id="helps-heading" className="mt-4 text-3xl font-bold tracking-tight">{freebie.helpsTitle}</h2>
              <div className="mt-6 space-y-4 leading-7 text-muted-foreground">{freebie.helpsWith.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
            </div>
            <div>
              <ClipboardCheck className="h-8 w-8 text-primary" aria-hidden="true" />
              <h2 className="mt-4 text-3xl font-bold tracking-tight">How to Use It</h2>
              <ol className="mt-6 space-y-4">{freebie.howToUse.map((step, index) => <li key={step} className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{index + 1}</span><span className="pt-0.5 leading-6 text-foreground/80">{step}</span></li>)}</ol>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-[1100px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_.8fr] lg:px-8 lg:py-20">
          <div className="rounded-3xl border border-border/60 bg-sage-soft p-7">
            <Lightbulb className="h-8 w-8 text-sage-foreground" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight">Practical Tips</h2>
            <ul className="mt-6 space-y-4">{freebie.practicalTips.map((tip) => <li key={tip} className="flex items-start gap-3"><span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-sage-foreground" aria-hidden="true" /><span className="leading-6 text-foreground/80">{tip}</span></li>)}</ul>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card p-7 shadow-sm">
            <Users className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight">Who It&apos;s For</h2>
            <p className="mt-5 leading-7 text-muted-foreground">{freebie.whoItsFor}</p>
            <p className="mt-5 text-sm font-semibold text-sage-foreground">{freebie.ageRange ? `${freebie.ageRange} • ` : ''}{freebie.audience}</p>
          </div>
        </section>
        {relatedFreebies.length ? <section className="border-y border-border/60 bg-background"><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold tracking-tight">You Might Also Like</h2><div className="mt-7 grid gap-5 sm:grid-cols-2">{relatedFreebies.map((related) => <Link key={related.slug} href={`/freebies/${related.slug}`} className="group rounded-2xl border border-border/60 bg-secondary/30 p-6 outline-none transition hover:border-primary/60 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-foreground">{freebieCategories[related.category].label}</p><h3 className="mt-2 text-xl font-bold">{related.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{related.description}</p><span className="mt-4 inline-flex items-center gap-2 font-semibold text-primary">View freebie <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" /></span></Link>)}</div></div></section> : null}
        {freebie.relatedLinks.length ? <section><div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8"><h2 className="text-2xl font-bold tracking-tight">Try These Free Tools Too</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{freebie.relatedLinks.map((link) => <Link key={link.href} href={link.href} className="rounded-2xl border border-border/60 bg-card p-5 outline-none transition hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><h3 className="font-bold text-primary">{link.label}</h3>{link.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{link.description}</p> : null}</Link>)}</div></div></section> : null}
      </main>
      <SiteFooter />
    </div>
  );
}

function DownloadLink({ href, slug, format, label, note }: { href: string; slug: string; format: string; label: string; note: string }) {
  return <a href={href} download data-ga-event="freebie_download" data-ga-label={slug} data-ga-format={format} className="flex min-h-12 items-center gap-3 rounded-xl border border-input px-4 py-3 outline-none transition hover:border-primary/70 hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><FileText className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /><span><strong className="block text-sm">{label}</strong><span className="block text-xs text-muted-foreground">{note}</span></span></a>;
}
