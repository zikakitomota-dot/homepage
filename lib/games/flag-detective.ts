export const regionIds = ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'] as const;
export type FlagRegion = (typeof regionIds)[number];
export type FlagQuestionType = 'guess-country' | 'find-flag' | 'detective-clue' | 'flag-fact';

export type FlagCountry = {
  id: string;
  name: string;
  iso2: string;
  region: FlagRegion;
  asset: string;
  description: string;
  fact: string;
};

export type FlagQuestion = {
  id: string;
  type: FlagQuestionType;
  prompt: string;
  correctAnswer: string;
  options: readonly string[];
  explanation: string;
  flagId: string;
  level: 'level-1';
};

const country = (iso2: string, name: string, region: FlagRegion, description: string, fact: string): FlagCountry => ({ id: iso2.toLowerCase(), iso2, name, region, asset: `/flags/${iso2.toLowerCase()}.svg`, description, fact });

export const flagCountries: readonly FlagCountry[] = [
  country('MY', 'Malaysia', 'Asia', 'red and white stripes, a blue corner, a yellow crescent and star', 'Malaysia’s flag has fourteen stripes and a fourteen-point star.'),
  country('JP', 'Japan', 'Asia', 'a red circle centred on a white field', 'The simple red disc makes Japan’s flag especially easy to recognise.'),
  country('KR', 'South Korea', 'Asia', 'a red-and-blue circle with four groups of black bars on white', 'South Korea’s flag has a central red-and-blue circle and four black trigrams.'),
  country('CN', 'China', 'Asia', 'one large yellow star and four smaller stars on red', 'China’s five yellow stars sit in the upper-left part of its red flag.'),
  country('IN', 'India', 'Asia', 'orange, white and green bands with a navy wheel', 'India’s central navy wheel has twenty-four spokes.'),
  country('TH', 'Thailand', 'Asia', 'red, white and blue horizontal bands with a wide blue centre', 'Thailand’s central blue stripe is twice as wide as each neighbouring stripe.'),
  country('SG', 'Singapore', 'Asia', 'red above white with a white crescent and five stars', 'Singapore’s crescent and five stars appear in the upper-left corner.'),
  country('ID', 'Indonesia', 'Asia', 'a red horizontal band above a white band', 'Indonesia’s flag is a simple red-over-white bicolour.'),
  country('PH', 'Philippines', 'Asia', 'blue and red bands with a white triangle, sun and three stars', 'The Philippines flag has a golden sun inside its white triangle.'),

  country('FR', 'France', 'Europe', 'three vertical bands of blue, white and red', 'France uses a vertical blue-white-red tricolour.'),
  country('DE', 'Germany', 'Europe', 'three horizontal bands of black, red and gold', 'Germany’s flag reads black, red and gold from top to bottom.'),
  country('IT', 'Italy', 'Europe', 'three vertical bands of green, white and red', 'Italy’s green-white-red bands run vertically.'),
  country('ES', 'Spain', 'Europe', 'red, yellow and red horizontal bands with a coat of arms', 'Spain has a wide yellow band between two red bands.'),
  country('GB', 'United Kingdom', 'Europe', 'overlapping red and white crosses on blue', 'The United Kingdom’s flag combines several crosses.'),
  country('IE', 'Ireland', 'Europe', 'three vertical bands of green, white and orange', 'Ireland’s tricolour is green, white and orange.'),
  country('SE', 'Sweden', 'Europe', 'a yellow Nordic cross on blue', 'Sweden uses a yellow cross extending to the flag’s edges.'),
  country('NO', 'Norway', 'Europe', 'a dark blue cross outlined in white on red', 'Norway’s Nordic cross is blue with a white border.'),
  country('CH', 'Switzerland', 'Europe', 'a white cross centred on a square red field', 'Switzerland is one of the few countries with a square national flag.'),

  country('EG', 'Egypt', 'Africa', 'red, white and black horizontal bands with a golden eagle', 'Egypt’s golden eagle is centred in the white band.'),
  country('ZA', 'South Africa', 'Africa', 'a multicoloured design with a green sideways Y shape', 'South Africa’s flag is recognisable by its green Y-shaped band.'),
  country('KE', 'Kenya', 'Africa', 'black, red and green bands with a shield and crossed spears', 'Kenya’s central shield is placed over crossed spears.'),
  country('NG', 'Nigeria', 'Africa', 'vertical green, white and green bands', 'Nigeria’s flag has a white centre between two green bands.'),
  country('GH', 'Ghana', 'Africa', 'red, yellow and green bands with a black star', 'Ghana’s black star sits in the centre of the yellow band.'),
  country('MA', 'Morocco', 'Africa', 'a green five-pointed star on red', 'Morocco’s flag places a green outlined star in the centre.'),
  country('ET', 'Ethiopia', 'Africa', 'green, yellow and red bands with a blue disc and yellow star', 'Ethiopia’s blue central disc contains a yellow star.'),
  country('TZ', 'Tanzania', 'Africa', 'green and blue triangles divided by a black diagonal band', 'Tanzania has a black diagonal stripe edged in yellow.'),
  country('UG', 'Uganda', 'Africa', 'black, yellow and red stripes with a bird in a white disc', 'Uganda’s crested crane appears in a white central disc.'),

  country('CA', 'Canada', 'North America', 'a red maple leaf on white between two red bands', 'Canada’s flag centres a single red maple leaf.'),
  country('US', 'United States', 'North America', 'red and white stripes with white stars in a blue corner', 'The United States flag has fifty stars and thirteen stripes.'),
  country('MX', 'Mexico', 'North America', 'vertical green, white and red bands with a central eagle emblem', 'Mexico’s coat of arms is centred in the white band.'),
  country('CR', 'Costa Rica', 'North America', 'blue, white and red horizontal bands with a wide red centre', 'Costa Rica’s central red band is wider than the blue and white bands.'),
  country('JM', 'Jamaica', 'North America', 'a yellow diagonal cross separating green and black areas', 'Jamaica’s flag has a golden diagonal cross.'),
  country('CU', 'Cuba', 'North America', 'blue and white stripes with a red triangle and white star', 'Cuba has a single white star inside a red triangle.'),
  country('PA', 'Panama', 'North America', 'four white, red and blue quarters with two stars', 'Panama’s flag is divided into four rectangles.'),
  country('BS', 'Bahamas', 'North America', 'a black triangle beside aqua and gold horizontal bands', 'The Bahamas flag has a black triangle at the hoist.'),
  country('DO', 'Dominican Republic', 'North America', 'a white cross dividing blue and red quarters with a central emblem', 'A broad white cross divides the Dominican Republic flag.'),

  country('BR', 'Brazil', 'South America', 'a yellow diamond and blue globe on green', 'Brazil’s flag is famous for its yellow diamond and starry blue globe.'),
  country('AR', 'Argentina', 'South America', 'light blue, white and light blue bands with a golden sun', 'Argentina’s Sun of May appears in the white centre band.'),
  country('CL', 'Chile', 'South America', 'white and red bands with a blue corner and one white star', 'Chile has one white star in a blue square.'),
  country('PE', 'Peru', 'South America', 'vertical red, white and red bands', 'Peru’s national flag uses a simple red-white-red vertical design.'),
  country('CO', 'Colombia', 'South America', 'yellow, blue and red horizontal bands with a wide yellow top', 'Colombia’s yellow band fills the upper half of the flag.'),
  country('VE', 'Venezuela', 'South America', 'yellow, blue and red bands with an arc of white stars', 'Venezuela’s white stars form an arc across the blue band.'),
  country('EC', 'Ecuador', 'South America', 'yellow, blue and red bands with a central coat of arms', 'Ecuador has a wide yellow band and a central coat of arms.'),
  country('UY', 'Uruguay', 'South America', 'white and blue stripes with a golden sun in the corner', 'Uruguay’s Sun of May appears in the upper-left corner.'),
  country('BO', 'Bolivia', 'South America', 'red, yellow and green horizontal bands', 'Bolivia’s civil flag has three equal horizontal bands.'),

  country('AU', 'Australia', 'Oceania', 'a blue field with the Union Jack and white stars', 'Australia’s flag includes the Commonwealth Star and Southern Cross.'),
  country('NZ', 'New Zealand', 'Oceania', 'a blue field with the Union Jack and four red stars', 'New Zealand shows four red Southern Cross stars.'),
  country('FJ', 'Fiji', 'Oceania', 'a light blue field with the Union Jack and a shield', 'Fiji’s flag uses a distinctive light blue background.'),
  country('PG', 'Papua New Guinea', 'Oceania', 'diagonal red and black halves with a bird and white stars', 'Papua New Guinea’s flag shows a yellow bird-of-paradise.'),
  country('WS', 'Samoa', 'Oceania', 'a red field with a blue corner containing white stars', 'Samoa’s blue corner contains stars of the Southern Cross.'),
  country('TO', 'Tonga', 'Oceania', 'a red field with a white corner containing a red cross', 'Tonga has a red cross inside a white rectangle.'),
  country('SB', 'Solomon Islands', 'Oceania', 'blue and green triangles divided by yellow with white stars', 'The Solomon Islands flag has five white stars on blue.'),
  country('VU', 'Vanuatu', 'Oceania', 'red and green areas with a black-and-yellow Y shape', 'Vanuatu’s flag uses a bold horizontal Y design.'),
  country('KI', 'Kiribati', 'Oceania', 'a red sky with a golden bird and sun above blue-and-white waves', 'Kiribati’s flag shows an ocean sunrise and a frigatebird.'),
] as const;

export function getFlagCountry(id: string) {
  return flagCountries.find((item) => item.id === id)!;
}

function optionSet(target: string, offset: number): string[] {
  const index = flagCountries.findIndex((item) => item.id === target);
  const options = [target];
  for (const step of [offset + 7, offset + 23, offset + 41, offset + 13, offset + 31]) {
    const candidate = flagCountries[(index + step) % flagCountries.length].id;
    if (!options.includes(candidate)) options.push(candidate);
    if (options.length === 4) break;
  }
  return options;
}

const q = (question: Omit<FlagQuestion, 'level'>): FlagQuestion => ({ ...question, level: 'level-1' });

const guessQuestions = flagCountries.map((item, index) => q({ id: `guess-${item.id}`, type: 'guess-country', prompt: 'Which country does this flag belong to?', correctAnswer: item.id, options: optionSet(item.id, index % 5), flagId: item.id, explanation: `${item.name} is in ${item.region}. ${item.fact}` }));

const findIds = ['my', 'jp', 'in', 'fr', 'de', 'gb', 'za', 'ke', 'gh', 'ca', 'us', 'mx', 'br', 'ar', 'cl', 'au', 'nz', 'fj'];
const findQuestions = findIds.map((id, index) => { const item = getFlagCountry(id); return q({ id: `find-${id}`, type: 'find-flag', prompt: `Which of these is the flag of ${item.name}?`, correctAnswer: id, options: optionSet(id, index + 2), flagId: id, explanation: `${item.description[0].toUpperCase()}${item.description.slice(1)}. ${item.fact}` }); });

const clueSpecs: readonly [string, string][] = [
  ['br', 'Which country’s flag has a yellow diamond and a blue circle?'], ['ca', 'Which country’s flag has a single red maple leaf?'], ['jp', 'Which country’s flag has one red circle on white?'], ['za', 'Which country’s flag has a green sideways Y shape?'], ['jm', 'Which country’s flag has a yellow diagonal cross?'], ['gh', 'Which country’s flag has a black star on a yellow band?'], ['se', 'Which country’s flag has a yellow cross on blue?'], ['ch', 'Which country’s flag is square with a white cross?'], ['in', 'Which country’s flag has a navy wheel in its white band?'], ['ki', 'Which country’s flag shows waves, a rising sun and a bird?'], ['bs', 'Which country’s flag has a black triangle beside aqua and gold bands?'], ['tz', 'Which country’s flag has a black diagonal band edged in yellow?'],
];
const clueQuestions = clueSpecs.map(([id, prompt], index) => { const item = getFlagCountry(id); return q({ id: `clue-${id}`, type: 'detective-clue', prompt, correctAnswer: id, options: optionSet(id, index + 4), flagId: id, explanation: `${item.name} has ${item.description}.` }); });

const factSpecs: readonly [string, string][] = [
  ['kr', 'Which country’s flag has a red-and-blue circle and four groups of black bars?'], ['us', 'Which country’s flag has fifty stars?'], ['my', 'Which country’s flag has fourteen stripes and a yellow crescent?'], ['ph', 'Which country’s flag has a golden sun inside a white triangle?'], ['no', 'Which country’s blue cross is outlined in white on red?'], ['ng', 'Which country uses green-white-green vertical bands?'], ['ke', 'Which country’s flag shows a shield over crossed spears?'], ['ar', 'Which country’s flag has a golden sun between light-blue bands?'], ['ve', 'Which country’s flag has an arc of white stars across a blue band?'], ['nz', 'Which country’s flag has four red Southern Cross stars?'], ['pg', 'Which country’s flag shows a yellow bird-of-paradise?'], ['to', 'Which country’s flag has a red cross in a white corner?'],
];
const factQuestions = factSpecs.map(([id, prompt], index) => { const item = getFlagCountry(id); return q({ id: `fact-${id}`, type: 'flag-fact', prompt, correctAnswer: id, options: optionSet(id, index + 6), flagId: id, explanation: item.fact }); });

export const flagQuestions: readonly FlagQuestion[] = [...guessQuestions, ...findQuestions, ...clueQuestions, ...factQuestions];

type RandomSource = () => number;
export function shuffleFlagItems<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function generateFlagRound(random: RandomSource = Math.random, count = 10): FlagQuestion[] {
  const shuffled = shuffleFlagItems(flagQuestions, random);
  const selected: FlagQuestion[] = [];
  const usedCountries = new Set<string>();
  const types: FlagQuestionType[] = ['guess-country', 'find-flag', 'detective-clue', 'flag-fact'];
  for (const type of types) {
    const match = shuffled.find((question) => question.type === type && !usedCountries.has(question.correctAnswer));
    if (match) { selected.push(match); usedCountries.add(match.correctAnswer); }
  }
  for (const question of shuffled) {
    if (selected.length >= count) break;
    if (!usedCountries.has(question.correctAnswer)) { selected.push(question); usedCountries.add(question.correctAnswer); }
  }
  return shuffleFlagItems(selected, random).map((question) => ({ ...question, options: shuffleFlagItems(question.options, random) }));
}
