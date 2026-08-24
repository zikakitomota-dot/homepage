import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Download, Sparkles } from 'lucide-react';
import { FreebiesFilter } from '@/components/freebies/freebies-filter';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { publishedCategoryKeys, publishedFreebies } from '@/lib/freebies';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Zalea Freebies | Zalea Studio';
const description = 'Explore free Zalea Studio printables, trackers and early learning activities for students, parents, teachers and kids.';
const path = '/freebies';

export const metadata: Metadata = {
  title: { absolute: title }, description, alternates: { canonical: path },
  openGraph: { title, description, url: path, type: 'website' },
  twitter: { card: 'summary', title, description },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Freebies', item: `${SITE_URL}${path}` },
  ],
};

export default function FreebiesPage() {
  return (
    <div className="min-h-screen bg-[#fbfaf6] text-slate-900">
      <SiteHeader />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
        <section className="border-b border-stone-200 bg-gradient-to-br from-[#f7f4eb] via-white to-emerald-50/70">
          <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <nav aria-label="Breadcrumb" className="text-sm text-slate-600"><Link href="/" className="hover:text-emerald-800 hover:underline">Home</Link><span className="mx-2" aria-hidden="true">/</span><span aria-current="page">Freebies</span></nav>
            <div className="mt-8 max-w-3xl">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-emerald-800"><Sparkles className="h-4 w-4" aria-hidden="true" /> Zalea Freebies</p>
              <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">Free Printables &amp; Downloads</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">A growing collection of simple printables, trackers and activities made to download, print and use.</p>
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="browse-freebies">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div><p className="text-sm font-semibold text-emerald-800">Ready when you are</p><h2 id="browse-freebies" className="mt-2 text-3xl font-bold tracking-tight">Browse the collection</h2></div>
            <Download className="hidden h-9 w-9 text-emerald-700 sm:block" aria-hidden="true" />
          </div>
          <FreebiesFilter freebies={publishedFreebies} categories={publishedCategoryKeys} />
        </section>
        <section className="border-y border-stone-200 bg-white">
          <div className="mx-auto flex max-w-[1000px] flex-col items-start justify-between gap-6 px-4 py-12 sm:px-6 md:flex-row md:items-center lg:px-8">
            <div><h2 className="text-2xl font-bold tracking-tight">More practical tools from Zalea</h2><p className="mt-2 max-w-2xl text-slate-600">Use free calculators and learning tools alongside your printables.</p></div>
            <Link href="/education" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-2.5 font-semibold text-slate-800 outline-none hover:border-emerald-700 hover:text-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2">Explore education tools <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

