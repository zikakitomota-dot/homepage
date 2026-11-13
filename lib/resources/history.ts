import { initialResourceFilters, resourceCategories, resourceTypes, type ResourceFilters } from './types';

export const finderHistoryKey = 'zaleaResourceFinderV1';
export type FinderSnapshot = { filters: ResourceFilters; scrollY: number };

// Only this tab's history entry is used: never a URL, analytics or persistent storage.
export function readFinderSnapshot(state: unknown): FinderSnapshot {
  const entry = state && typeof state === 'object' ? (state as Record<string, unknown>)[finderHistoryKey] : null;
  const value = entry && typeof entry === 'object' ? entry as Record<string, unknown> : {};
  const filters = value.filters && typeof value.filters === 'object' ? value.filters as Record<string, unknown> : {};
  return {
    filters: {
      query: typeof filters.query === 'string' ? filters.query.slice(0, 120) : '',
      type: filters.type === 'all' || typeof filters.type === 'string' && Object.hasOwn(resourceTypes, filters.type) ? filters.type as ResourceFilters['type'] : initialResourceFilters.type,
      category: filters.category === 'all' || typeof filters.category === 'string' && Object.hasOwn(resourceCategories, filters.category) ? filters.category as ResourceFilters['category'] : initialResourceFilters.category,
      sort: filters.sort === 'title' ? 'title' : 'relevance',
    },
    scrollY: typeof value.scrollY === 'number' && Number.isFinite(value.scrollY) ? Math.max(0, Math.min(1000000, value.scrollY)) : 0,
  };
}

export function withFinderSnapshot(state: unknown, snapshot: FinderSnapshot) {
  // Preserve the router's private history fields.
  return { ...(state && typeof state === 'object' ? state : {}), [finderHistoryKey]: snapshot };
}
