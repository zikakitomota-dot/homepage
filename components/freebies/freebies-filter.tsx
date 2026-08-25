'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FreebiePreview } from '@/components/freebies/freebie-preview';
import { buttonVariants } from '@/components/ui/button';
import { freebieCategories, type Freebie, type FreebieCategory } from '@/lib/freebies';
import { cn } from '@/lib/utils';

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
          <article key={freebie.slug} className="flex overflow-hidden rounded-3xl border border-border/60 bg-card shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
            <div className="flex w-full flex-col">
              <FreebiePreview freebie={freebie} compact />
              <div className="flex flex-1 flex-col p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sage-foreground">{freebieCategories[freebie.category].label}</p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground">{freebie.title}</h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{freebie.description}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-foreground/80">
                  <span className="rounded-full bg-sage-soft px-3 py-1">{freebie.ageRange ?? `For ${freebie.audience}`}</span>
                  <span className="rounded-full bg-secondary px-3 py-1">{freebie.pageCount} pages</span>
                </div>
                <Link href={`/freebies/${freebie.slug}`} className={cn(buttonVariants(), 'mt-6 min-h-11 gap-2 rounded-xl')}>
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
    <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-11 rounded-full border px-5 py-2 text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${active ? 'border-primary bg-primary text-primary-foreground shadow-sm' : 'border-input bg-background text-foreground/80 hover:border-primary/70 hover:text-primary'}`}>
      {children}{active ? <span className="sr-only"> (selected)</span> : null}
    </button>
  );
}
