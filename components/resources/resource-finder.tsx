'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trackEvent } from '@/lib/analytics';
import { searchResources } from '@/lib/resources/search';
import { initialResourceFilters, resourceCategories, resourceTypes, type Resource, type ResourceCategory, type ResourceFilters } from '@/lib/resources/types';

const startingPoints: { label: string; type: ResourceFilters['type']; category: ResourceFilters['category'] }[] = [
  { label: 'Practise English', type: 'all', category: 'english' },
  { label: 'Explore Geography', type: 'all', category: 'geography' },
  { label: 'Generate a Worksheet', type: 'worksheet', category: 'all' },
  { label: 'Find a Calculator', type: 'calculator', category: 'all' },
  { label: 'Browse Free Printables', type: 'freebie', category: 'all' },
];
const selectClass = 'min-h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export function ResourceFinder({ resources }: { resources: readonly Resource[] }) {
  const [filters, setFilters] = useState<ResourceFilters>(initialResourceFilters);
  const results = useMemo(() => searchResources(resources, filters), [resources, filters]);
  const categories = Object.entries(resourceCategories).filter(([key]) => resources.some(resource => resource.categories.includes(key as ResourceCategory)));
  const setType = (type: ResourceFilters['type']) => {
    setFilters(current => ({ ...current, type }));
    trackEvent('resource_type_selected', { resource_type: type });
  };
  const reset = () => setFilters({ ...initialResourceFilters });

  return <div className="space-y-8">
    <section aria-labelledby="resource-starting-points" className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5 sm:p-6">
      <h2 id="resource-starting-points" className="text-xl font-bold">Not sure where to start?</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Choose a starting point, then narrow it down by task or topic.</p>
      <div className="mt-4 flex flex-wrap gap-2">{startingPoints.map(point => <Button key={point.label} type="button" variant="outline" className="min-h-11 max-w-full whitespace-normal text-left" onClick={() => {
        setFilters({ ...initialResourceFilters, type: point.type, category: point.category });
        trackEvent('resource_filter_selected', { resource_type: point.type, category: point.category });
      }}>{point.label}</Button>)}</div>
    </section>

    <section aria-labelledby="resource-search-heading" className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6">
      <h2 id="resource-search-heading" className="text-2xl font-bold">Find a resource</h2>
      <label htmlFor="resource-query" className="mt-5 block text-sm font-semibold">Search by keyword or task</label>
      <div className="mt-2 flex gap-2"><div className="relative min-w-0 flex-1"><Search className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" aria-hidden="true" /><Input id="resource-query" type="search" maxLength={120} autoComplete="off" spellCheck={false} value={filters.query} onChange={event => setFilters(current => ({ ...current, query: event.target.value }))} placeholder="Try subtraction, holidays or savings" className="min-h-12 pl-10" aria-describedby="resource-search-note" /></div><Button type="button" variant="outline" className="min-h-12" onClick={() => setFilters(current => ({ ...current, query: '' }))} disabled={!filters.query}>Clear search</Button></div>
      <p id="resource-search-note" className="mt-2 text-xs leading-5 text-muted-foreground">Search stays on this page. Search terms are not saved or sent to analytics.</p>
      <fieldset className="mt-6"><legend className="text-sm font-semibold">Resource type</legend><div className="mt-2 flex flex-wrap gap-2">{([['all', 'All types'], ...Object.entries(resourceTypes)] as [ResourceFilters['type'], string][]).map(([type, label]) => <Button key={type} type="button" variant={filters.type === type ? 'default' : 'outline'} className="min-h-11" aria-pressed={filters.type === type} onClick={() => setType(type)}>{label}</Button>)}</div></fieldset>
      <div className="mt-6 grid gap-4 sm:grid-cols-2"><div><label htmlFor="resource-category" className="text-sm font-semibold">Subject or topic</label><select id="resource-category" className={`${selectClass} mt-2`} value={filters.category} onChange={event => {
        const category = event.target.value as ResourceCategory | 'all'; setFilters(current => ({ ...current, category })); trackEvent('resource_filter_selected', { category });
      }}><option value="all">All subjects &amp; topics</option>{categories.map(([category, label]) => <option key={category} value={category}>{label}</option>)}</select></div><div><label htmlFor="resource-sort" className="text-sm font-semibold">Sort results</label><select id="resource-sort" className={`${selectClass} mt-2`} value={filters.sort} onChange={event => setFilters(current => ({ ...current, sort: event.target.value as ResourceFilters['sort'] }))}><option value="relevance">Best match</option><option value="title">Title A–Z</option></select></div></div>
      <Button type="button" variant="outline" className="mt-5 min-h-11" onClick={reset}>Reset all filters</Button>
    </section>

    <section aria-labelledby="resource-results-heading"><div className="mb-5 flex flex-wrap items-baseline justify-between gap-2"><h2 id="resource-results-heading" className="text-2xl font-bold">Resources</h2><p role="status" aria-live="polite" aria-atomic="true" className="font-semibold text-muted-foreground">{results.length} {results.length === 1 ? 'resource' : 'resources'} found</p></div>
      {results.length ? <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Resource results">{results.map(resource => <li key={resource.id} className="min-w-0"><article className="flex h-full flex-col rounded-2xl border border-border/70 bg-white p-6 shadow-sm"><div className="flex flex-wrap items-center gap-2 text-xs font-semibold"><span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">{resourceTypes[resource.type]}</span><span className="text-muted-foreground">Free</span></div><h3 className="mt-4 break-words text-xl font-bold">{resource.title}</h3><p className="mt-2 text-xs font-semibold text-primary">{resource.categories.map(category => resourceCategories[category]).join(' · ')}</p><p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{resource.description}</p><Link href={resource.href} prefetch={false} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" onClick={() => trackEvent('resource_result_clicked', { resource_id: resource.id, resource_type: resource.type })}>Open {resourceTypes[resource.type].toLowerCase()}<span className="sr-only">: {resource.title}</span><ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></article></li>)}</ul> : <div className="rounded-2xl border border-dashed p-8 text-center"><h3 className="text-xl font-bold">No resources match those choices</h3><p className="mx-auto mt-3 max-w-lg text-muted-foreground">Try a shorter keyword, choose All types, or use a broader subject. You can also reset everything to browse the full collection.</p><Button type="button" className="mt-5 min-h-11" onClick={reset}>Show all resources</Button></div>}
    </section>
  </div>;
}
