import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, Download, FileText, Gamepad2, GraduationCap, PencilRuler, ShoppingBag, Sparkles, WalletCards, type LucideIcon } from 'lucide-react';
import { FreebiesFilter } from '@/components/freebies/freebies-filter';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { publishedCategoryKeys, publishedFreebies } from '@/lib/freebies';
import { safeJsonLd } from '@/lib/seo';
import { SITE_URL } from '@/lib/site';

const title = 'Zalea Freebies | Zalea Studio';
const description = 'Explore free Zalea Studio printables, trackers and early learning activities for students, parents, teachers and kids in A4 and US Letter sizes.';
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
        <section className="border-y border-stone-200 bg-white" aria-labelledby="find-heading">
          <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="max-w-2xl"><p className="text-sm font-semibold text-emerald-800">Made for everyday use</p><h2 id="find-heading" className="mt-2 text-3xl font-bold tracking-tight">What You&apos;ll Find Here</h2><p className="mt-4 leading-7 text-slate-600">Each collection is designed around a practical task, with printable sizes that work in different regions.</p></div>
            <div className="mt-9 grid gap-5 md:grid-cols-3">
              <CollectionCard icon={BookOpen} title="School & Study">Plan study time, keep grades organised and record learning observations for students, teachers, tutors and parents.</CollectionCard>
              <CollectionCard icon={PencilRuler} title="Kids & Early Learning">Simple printable activities for early learners and the adults supporting relaxed, age-appropriate practice.</CollectionCard>
              <CollectionCard icon={WalletCards} title="Money & Budgeting">Planning sheets for savings goals, larger purchases and emergency funds. They offer general educational support, not financial advice.</CollectionCard>
            </div>
          </div>
        </section>
        <section className="mx-auto grid max-w-[1100px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
          <div className="rounded-3xl border border-stone-200 bg-white p-7 shadow-sm">
            <Download className="h-8 w-8 text-emerald-800" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight">How Downloads Work</h2>
            <ol className="mt-6 space-y-4 text-slate-700">
              {['Choose a freebie from the collection.', 'Preview what is included on its landing page.', 'Download A4, US Letter or the ZIP containing both sizes.', 'Print the pages you need and start using them.'].map((step, index) => <li key={step} className="flex gap-4"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-900">{index + 1}</span><span className="pt-0.5 leading-6">{step}</span></li>)}
            </ol>
          </div>
          <div className="rounded-3xl border border-stone-200 bg-[#f7f4eb] p-7">
            <FileText className="h-8 w-8 text-emerald-800" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-bold tracking-tight">A4 vs US Letter</h2>
            <div className="mt-6 space-y-4">
              <div><h3 className="font-bold">A4</h3><p className="mt-1 leading-6 text-slate-600">The common paper size used internationally.</p></div>
              <div><h3 className="font-bold">US Letter</h3><p className="mt-1 leading-6 text-slate-600">The common paper size used in the United States and Canada.</p></div>
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-600">Every current freebie includes both versions, so you can select the one that matches your printer settings.</p>
          </div>
        </section>
        <section className="border-y border-stone-200 bg-white" aria-labelledby="explore-zalea-heading">
          <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <h2 id="explore-zalea-heading" className="text-3xl font-bold tracking-tight">Explore More from Zalea Studio</h2>
            <p className="mt-3 max-w-2xl leading-7 text-slate-600">Continue with practical calculators, learning games and digital products when they fit what you are working on.</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ExploreLink href="/education" icon={Calculator} title="Calculators">Education and planning tools</ExploreLink>
              <ExploreLink href="/games/english/academy" icon={GraduationCap} title="Zalea Academy">Structured English practice</ExploreLink>
              <ExploreLink href="/games" icon={Gamepad2} title="Games">Free educational games</ExploreLink>
              <ExploreLink href="/shop" icon={ShoppingBag} title="Shop">Digital products and templates</ExploreLink>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function CollectionCard({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: React.ReactNode }) {
  return <article className="rounded-2xl border border-stone-200 bg-[#fbfaf6] p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800"><Icon className="h-6 w-6" aria-hidden={true} /></span><h3 className="mt-5 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{children}</p></article>;
}

function ExploreLink({ href, icon: Icon, title, children }: { href: string; icon: LucideIcon; title: string; children: React.ReactNode }) {
  return <Link href={href} className="group rounded-2xl border border-stone-200 bg-[#fbfaf6] p-5 outline-none transition hover:border-emerald-500 hover:shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-700"><Icon className="h-6 w-6 text-emerald-800" aria-hidden={true} /><h3 className="mt-4 font-bold">{title}</h3><p className="mt-1 text-sm text-slate-600">{children}</p><span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-emerald-800">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" /></span></Link>;
}
