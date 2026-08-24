'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FreebiePreview } from '@/components/freebies/freebie-preview';
import { freebieCategories, type Freebie, type FreebieCategory } from '@/lib/freebies';

type Filter = 'all' | FreebieCategory;

export function FreebiesFilter({ freebies, categories }: { freebies: readonly Freebie[]; categories: readonly FreebieCategory[] }) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const visibleFreebies = activeFilter === 'all' ? freebies : freebies.filter((freebie) => freebie.category === activeFilter);

  return (
    <>
      <div className="flex flex-wrap gap-3" role="group" aria-label="Filter freebies by category">
        <FilterButton active={activeFilter === 'all'} onClick={() => setActiveFilter('all')}>All</FilterButton>
        {categories.map((category) => (
          <FilterButton key={category} active={activeFilter === category} onClick={() => setActiveFilter(category)}>
            {freebieCategories[category].label}
          </FilterButton>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">Showing {visibleFreebies.length} {visibleFreebies.length === 1 ? 'freebie' : 'freebies'}.</p>
      <div className="mt-8 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {visibleFreebies.map((freebie) => (
          <article key={freebie.slug} className="flex overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex w-full flex-col">
              <FreebiePreview freebie={freebie} compact />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-800">{freebieCategories[freebie.category].label}</p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900">{freebie.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{freebie.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
                  <span className="rounded-full bg-stone-100 px-3 py-1">{freebie.ageRange ?? `For ${freebie.audience}`}</span>
                  <span className="rounded-full bg-stone-100 px-3 py-1">{freebie.pageCount} pages</span>
                </div>
                <Link href={`/freebies/${freebie.slug}`} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white outline-none transition hover:bg-emerald-800 focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2">
                  View &amp; Download <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-11 rounded-full border px-5 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 ${active ? 'border-emerald-800 bg-emerald-800 text-white shadow-sm' : 'border-stone-300 bg-white text-slate-700 hover:border-emerald-700 hover:text-emerald-800'}`}>
      {children}{active ? <span className="sr-only"> (selected)</span> : null}
    </button>
  );
}

