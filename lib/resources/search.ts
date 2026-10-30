import { resourceCategories, resourceTypes, type Resource, type ResourceFilters } from './types';

const synonyms: Record<string, string> = {
  math: 'mathematics', maths: 'mathematics', minus: 'subtraction', subtract: 'subtraction',
  add: 'addition', adding: 'addition', holidays: 'holiday', working: 'work',
  printables: 'printable', worksheets: 'worksheet', plurals: 'plural', pronouns: 'pronoun',
  colors: 'colours', color: 'colours', money: 'finance', budgeting: 'budget',
  games: 'game', missions: 'mission', guides: 'guide', calculators: 'calculator', freebies: 'freebie',
  articles: 'article', nouns: 'noun', verbs: 'verb', possessives: 'possessive',
  prepositions: 'preposition', demonstratives: 'demonstrative',
  clocks: 'clock', hours: 'hour', minutes: 'minute', analog: 'analogue', currencies: 'currency', dollars: 'dollar', coins: 'coin', banknotes: 'banknote',
};
export function normaliseResourceQuery(value: string) {
  return value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, ' ').trim().replace(/\s+/g, ' ');
}
function words(value: string) { return normaliseResourceQuery(value).split(' ').filter(Boolean).map(word => synonyms[word] ?? word); }
function matches(haystack: string[], token: string) { return haystack.some(word => word.includes(token)); }
export function searchResources(entries: readonly Resource[], filters: ResourceFilters): Resource[] {
  const tokens = Array.from(new Set(words(filters.query.slice(0, 120))));
  return entries.filter(entry => entry.status === 'available' && entry.access === 'free' && (filters.type === 'all' || entry.type === filters.type) && (filters.category === 'all' || entry.categories.includes(filters.category)))
    .map(entry => {
      const title = words(entry.title); const description = words(entry.description);
      const keywords = entry.keywords.flatMap(words); const categories = [...entry.categories.flatMap(category => words(resourceCategories[category])), ...words(resourceTypes[entry.type])];
      const score = tokens.reduce((total, token) => total + (matches(title, token) ? 10 : matches(keywords, token) ? 6 : matches(categories, token) ? 4 : matches(description, token) ? 2 : 0), 0);
      const relevant = tokens.every(token => matches([...title, ...keywords, ...categories, ...description], token));
      return { entry, score, relevant };
    }).filter(result => result.relevant)
    .sort((a, b) => filters.sort === 'title' ? a.entry.title.localeCompare(b.entry.title, 'en') || a.entry.id.localeCompare(b.entry.id) : b.score - a.score || a.entry.displayOrder - b.entry.displayOrder || a.entry.id.localeCompare(b.entry.id))
    .map(result => result.entry);
}
