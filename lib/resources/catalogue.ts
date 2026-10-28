import { gameRegistry } from '../games/registry';
import { missions } from '../games/missions';
import { publishedFreebies, freebieCategories } from '../freebies';
import { guides } from '../guides';
import { moneyTools } from '../money-tools';
import { educationTools } from '../education-tools';
import { mathTools } from '../math-tools';
import { workTimeTools } from '../work-time';
import { SITE_URL } from '../site';
import { resourceCategories, resourceTypes, type Resource, type ResourceCategory, type ResourceType } from './types';

// Health is a separately built Astro tree. These seven discovery summaries belong
// to the MAIN checkout; do not introduce a build-time dependency on its sibling.
const healthTools = [
  ['bmi', 'BMI Calculator', 'Estimate adult body mass index from height and weight, with screening limitations.', 'body mass index height weight'],
  ['bmr', 'BMR Calculator', 'Estimate resting energy using the Mifflin–St Jeor equation and read its assumptions.', 'basal metabolic rate resting calories'],
  ['tdee', 'TDEE Calculator', 'Estimate daily energy expenditure using resting energy and an activity multiplier.', 'total daily energy expenditure calories activity'],
  ['ideal-weight', 'Reference Weight Calculator', 'Compare historical height-based formulas; the estimates are not personal health targets.', 'ideal weight reference weight height formulas'],
  ['calorie-deficit', 'Calorie Deficit Calculator', 'Explore a mathematical calorie-deficit scenario with stated assumptions and limitations.', 'calories deficit energy'],
  ['water-intake', 'Water Intake Calculator', 'Explore a rough total-water planning estimate and the factors it cannot capture.', 'water hydration fluid'],
  ['walking-calories', 'Walking Calories Calculator', 'Estimate walking energy from weight, pace and duration using MET values.', 'walk walking calories pace duration'],
] as const;

const typeOrder: Record<ResourceType, number> = { worksheet: 0, calculator: 1, game: 2, mission: 3, freebie: 4, guide: 5 };
// Topic names for games whose learner-friendly titles do not name the skill.
const englishTopics: Readonly<Record<string, readonly string[]>> = {
  'a-or-an': ['articles'], 'one-or-many': ['singular', 'plural', 'nouns'],
  'he-she-it': ['personal pronouns'], 'who-is-it': ['personal pronouns'],
  'whose-is-it': ['possessives', 'ownership'], 'where-is-it': ['prepositions', 'position'],
  'is-am-are': ['verbs'], 'can-or-cant': ['modal verbs', 'ability'],
  'this-that-these-those': ['demonstratives'], 'has-or-have': ['verbs'],
};
function resource(type: ResourceType, index: number, id: string, title: string, description: string, href: string, categories: readonly ResourceCategory[], keywords: readonly string[] = []): Resource {
  return { id: `${type}:${id}`, title, description, href, canonicalUrl: `${SITE_URL}${href}`, type, categories, keywords, status: 'available', access: 'free', displayOrder: index * 10 + typeOrder[type] };
}
const guideCategory = (href: string): ResourceCategory => href.includes('pre-writing') ? 'early-learning' : href.includes('percentage') ? 'mathematics' : 'finance';
const freebieCategory = (slug: string, category: string): ResourceCategory[] => {
  if (category === 'money-budgeting') return ['finance'];
  if (slug === 'first-phonics-activities') return ['english', 'early-learning'];
  if (slug === 'numbers-1-10-activity-pack') return ['mathematics', 'early-learning'];
  return [category === 'school-study' ? 'education' : 'early-learning'];
};
const calculators = [
  ...moneyTools.map(tool => ({ ...tool, href: `/finance/${tool.slug}`, category: 'finance' as const })),
  ...workTimeTools.map(tool => ({ ...tool, href: `/work-time/${tool.slug}`, category: 'work-time' as const })),
  ...educationTools.map(tool => ({ ...tool, href: `/education/${tool.slug}`, category: 'education' as const })),
  ...mathTools.map(tool => ({ ...tool, href: `/math/${tool.slug}`, category: 'mathematics' as const })),
  ...healthTools.map(([slug, title, description, terms]) => ({ slug, title, description, href: `/health/calculators/${slug}`, category: 'health' as const, terms })),
];

export const resourceCatalogue: readonly Resource[] = [
  resource('worksheet', 0, 'studio', 'Custom Worksheet Studio', 'Generate Mathematics or English Level 1 practice, then print or download an A4 worksheet with a matching answer key.', '/worksheets', ['mathematics', 'english'], ['addition', 'subtraction', 'missing number', 'grammar', 'articles', 'plurals', 'pronouns', 'verbs', 'possessives', 'prepositions', 'demonstratives', 'printable']),
  ...gameRegistry.filter(game => game.status === 'available' && game.route).map((game, index) => resource('game', index, game.gameId, game.title, game.description, game.route!, [game.subjectId], game.subjectId === 'english' ? ['grammar', game.gameId, ...(englishTopics[game.gameId] ?? [])] : [game.gameId])),
  ...missions.map((mission, index) => resource('mission', index, mission.id, mission.title, mission.shortDescription, `/games/missions/${mission.id}`, [mission.subject.toLowerCase() as ResourceCategory], mission.activities.flatMap(activity => [activity.title, activity.description]))),
  ...publishedFreebies.map((freebie, index) => resource('freebie', index, freebie.slug, freebie.title, freebie.description, `/freebies/${freebie.slug}`, freebieCategory(freebie.slug, freebie.category), [freebie.slug, freebieCategories[freebie.category].label, 'printable', freebie.format])),
  ...guides.map((guide, index) => resource('guide', index, guide.href.split('/').at(-1)!, guide.title, guide.description, guide.href, [guideCategory(guide.href)], [guide.category, guide.href.split('/').at(-1)!])),
  ...calculators.map((tool, index) => resource('calculator', index, `${tool.category}:${tool.slug}`, tool.title, tool.description, tool.href, [tool.category], [tool.slug, ...('terms' in tool ? [tool.terms] : []), ...(tool.slug === 'business-days-calculator' ? ['public holidays', 'weekends', 'working days', 'date'] : [])])),
];

export function validateResourceCatalogue(entries: readonly Resource[]) {
  const errors: string[] = []; const ids = new Set<string>(); const urls = new Set<string>();
  for (const entry of entries) {
    if (ids.has(entry.id)) errors.push(`Duplicate ID: ${entry.id}`);
    if (urls.has(entry.canonicalUrl)) errors.push(`Duplicate canonical: ${entry.canonicalUrl}`);
    ids.add(entry.id); urls.add(entry.canonicalUrl);
    if (!entry.id.trim() || !entry.title.trim() || !entry.description.trim() || !entry.categories.length || !entry.keywords.length) errors.push(`Missing metadata: ${entry.id}`);
    if (!(entry.type in resourceTypes) || entry.categories.some(category => !(category in resourceCategories))) errors.push(`Invalid classification: ${entry.id}`);
    if (entry.status !== 'available' || entry.access !== 'free') errors.push(`Unavailable or paid resource: ${entry.id}`);
    if (!/^\/[a-z0-9/-]+$/.test(entry.href) || entry.href.endsWith('/') || entry.href.includes('//') || entry.canonicalUrl !== `${SITE_URL}${entry.href}`) errors.push(`Invalid canonical path: ${entry.id}`);
    if (!Number.isFinite(entry.displayOrder)) errors.push(`Invalid display order: ${entry.id}`);
  }
  return errors;
}
const catalogueErrors = validateResourceCatalogue(resourceCatalogue);
if (catalogueErrors.length) throw new Error(catalogueErrors.join('\n'));
