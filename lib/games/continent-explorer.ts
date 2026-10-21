export const continentIds = ['africa', 'antarctica', 'asia', 'europe', 'north-america', 'south-america', 'australia'] as const;
export type ContinentId = (typeof continentIds)[number];
export type ContinentQuestionType = 'identify' | 'country' | 'map' | 'fact';
export type ContinentDifficulty = 'level-1';

export type Continent = {
  id: ContinentId;
  name: string;
  shortFact: string;
  colour: string;
};

export type ContinentQuestion = {
  id: string;
  type: ContinentQuestionType;
  prompt: string;
  correctAnswer: ContinentId;
  options?: readonly ContinentId[];
  explanation: string;
  visualId?: ContinentId;
  difficulty: ContinentDifficulty;
};

type RandomSource = () => number;

export const continents: readonly Continent[] = [
  { id: 'africa', name: 'Africa', colour: '#e99355', shortFact: 'Africa lies on both sides of the Equator and is home to 54 widely recognised countries.' },
  { id: 'antarctica', name: 'Antarctica', colour: '#81b9cc', shortFact: 'Antarctica surrounds the South Pole and is the coldest continent.' },
  { id: 'asia', name: 'Asia', colour: '#e4bd4f', shortFact: 'Asia is the largest continent by land area.' },
  { id: 'europe', name: 'Europe', colour: '#8f78c7', shortFact: 'Europe lies west of Asia; the two share one large landmass called Eurasia.' },
  { id: 'north-america', name: 'North America', colour: '#5aa97a', shortFact: 'North America stretches from the Arctic in the north to Central America in the south.' },
  { id: 'south-america', name: 'South America', colour: '#d9707c', shortFact: 'South America lies mostly in the Southern Hemisphere and is joined to North America.' },
  { id: 'australia', name: 'Australia', colour: '#4e91c5', shortFact: 'Australia is the smallest continent; Oceania is the wider Pacific region around it.' },
] as const;

const allOptions = continentIds;
const q = (question: Omit<ContinentQuestion, 'difficulty'>): ContinentQuestion => ({ ...question, difficulty: 'level-1' });

export const continentQuestions: readonly ContinentQuestion[] = [
  ...continents.flatMap((continent) => [
    q({ id: `identify-${continent.id}`, type: 'identify', prompt: 'Which continent is highlighted on the map?', correctAnswer: continent.id, options: allOptions, visualId: continent.id, explanation: continent.shortFact }),
    q({ id: `find-${continent.id}`, type: 'map', prompt: `Find ${continent.name} on the world map.`, correctAnswer: continent.id, visualId: continent.id, explanation: continent.shortFact }),
  ]),

  q({ id: 'country-egypt', type: 'country', prompt: 'Which continent is Egypt in?', correctAnswer: 'africa', options: ['africa', 'asia', 'europe', 'south-america'], explanation: 'Egypt is in northeastern Africa. The Sinai Peninsula extends into Asia, but Egypt is conventionally grouped with Africa.' }),
  q({ id: 'country-kenya', type: 'country', prompt: 'Which continent is Kenya in?', correctAnswer: 'africa', options: ['africa', 'asia', 'australia', 'south-america'], explanation: 'Kenya is in eastern Africa and sits on the Equator.' }),
  q({ id: 'country-nigeria', type: 'country', prompt: 'Which continent is Nigeria in?', correctAnswer: 'africa', options: ['africa', 'europe', 'asia', 'north-america'], explanation: 'Nigeria is in western Africa, beside the Gulf of Guinea.' }),
  q({ id: 'country-japan', type: 'country', prompt: 'Which continent is Japan in?', correctAnswer: 'asia', options: ['asia', 'europe', 'australia', 'north-america'], explanation: 'Japan is an island country in eastern Asia.' }),
  q({ id: 'country-india', type: 'country', prompt: 'Which continent is India in?', correctAnswer: 'asia', options: ['asia', 'africa', 'europe', 'australia'], explanation: 'India is in southern Asia.' }),
  q({ id: 'country-thailand', type: 'country', prompt: 'Which continent is Thailand in?', correctAnswer: 'asia', options: ['asia', 'africa', 'europe', 'south-america'], explanation: 'Thailand is in Southeast Asia.' }),
  q({ id: 'country-france', type: 'country', prompt: 'Which continent is France in?', correctAnswer: 'europe', options: ['europe', 'asia', 'africa', 'north-america'], explanation: 'Metropolitan France is in western Europe.' }),
  q({ id: 'country-italy', type: 'country', prompt: 'Which continent is Italy in?', correctAnswer: 'europe', options: ['europe', 'africa', 'asia', 'south-america'], explanation: 'Italy is in southern Europe and reaches into the Mediterranean Sea.' }),
  q({ id: 'country-norway', type: 'country', prompt: 'Which continent is Norway in?', correctAnswer: 'europe', options: ['europe', 'north-america', 'asia', 'antarctica'], explanation: 'Norway is in northern Europe.' }),
  q({ id: 'country-canada', type: 'country', prompt: 'Which continent is Canada in?', correctAnswer: 'north-america', options: ['north-america', 'south-america', 'europe', 'asia'], explanation: 'Canada is in North America, north of the United States.' }),
  q({ id: 'country-mexico', type: 'country', prompt: 'Which continent is Mexico in?', correctAnswer: 'north-america', options: ['north-america', 'south-america', 'europe', 'africa'], explanation: 'Mexico is in the southern part of North America.' }),
  q({ id: 'country-costa-rica', type: 'country', prompt: 'Which continent is Costa Rica in?', correctAnswer: 'north-america', options: ['north-america', 'south-america', 'australia', 'asia'], explanation: 'Costa Rica is in Central America, which is the southern part of North America.' }),
  q({ id: 'country-brazil', type: 'country', prompt: 'Which continent is Brazil in?', correctAnswer: 'south-america', options: ['south-america', 'north-america', 'africa', 'asia'], explanation: 'Brazil is the largest country in South America by land area.' }),
  q({ id: 'country-peru', type: 'country', prompt: 'Which continent is Peru in?', correctAnswer: 'south-america', options: ['south-america', 'north-america', 'europe', 'africa'], explanation: 'Peru is on the western side of South America.' }),
  q({ id: 'country-argentina', type: 'country', prompt: 'Which continent is Argentina in?', correctAnswer: 'south-america', options: ['south-america', 'north-america', 'antarctica', 'europe'], explanation: 'Argentina is in southern South America.' }),
  q({ id: 'country-australia', type: 'country', prompt: 'The country of Australia is on which continent?', correctAnswer: 'australia', options: ['australia', 'asia', 'antarctica', 'africa'], explanation: 'Australia is both a country and the largest landmass of the continent called Australia.' }),
  q({ id: 'country-new-zealand', type: 'country', prompt: 'New Zealand belongs to which wider world region in this game?', correctAnswer: 'australia', options: ['australia', 'asia', 'south-america', 'antarctica'], explanation: 'New Zealand is part of Oceania, the wider Pacific region grouped with Australia for this beginner seven-continent game.' }),
  q({ id: 'country-papua-new-guinea', type: 'country', prompt: 'Papua New Guinea belongs to which wider world region in this game?', correctAnswer: 'australia', options: ['australia', 'asia', 'africa', 'north-america'], explanation: 'Papua New Guinea is part of Oceania, which this game groups with the continent label Australia.' }),

  q({ id: 'fact-largest', type: 'fact', prompt: 'Which is the largest continent by land area?', correctAnswer: 'asia', options: ['asia', 'africa', 'north-america', 'antarctica'], explanation: 'Asia is the largest of the seven continents by land area.' }),
  q({ id: 'fact-smallest', type: 'fact', prompt: 'Which is the smallest continent by land area?', correctAnswer: 'australia', options: ['australia', 'europe', 'antarctica', 'south-america'], explanation: 'Australia is the smallest continent by land area.' }),
  q({ id: 'fact-coldest', type: 'fact', prompt: 'Which continent is the coldest?', correctAnswer: 'antarctica', options: ['antarctica', 'europe', 'north-america', 'asia'], explanation: 'Antarctica is the coldest continent and is almost completely covered by ice.' }),
  q({ id: 'fact-south-pole', type: 'fact', prompt: 'Which continent surrounds the South Pole?', correctAnswer: 'antarctica', options: ['antarctica', 'australia', 'south-america', 'africa'], explanation: 'The South Pole is on Antarctica.' }),
  q({ id: 'fact-sahara', type: 'fact', prompt: 'On which continent is the Sahara Desert?', correctAnswer: 'africa', options: ['africa', 'asia', 'australia', 'south-america'], explanation: 'The Sahara stretches across northern Africa.' }),
  q({ id: 'fact-amazon', type: 'fact', prompt: 'On which continent is most of the Amazon Rainforest?', correctAnswer: 'south-america', options: ['south-america', 'africa', 'asia', 'north-america'], explanation: 'Most of the Amazon Rainforest is in South America, especially in Brazil.' }),
  q({ id: 'fact-europe-asia', type: 'fact', prompt: 'Which continent lies directly west of Asia?', correctAnswer: 'europe', options: ['europe', 'north-america', 'africa', 'australia'], explanation: 'Europe lies west of Asia. Together, they form the large connected landmass called Eurasia.' }),
  q({ id: 'fact-arctic-south', type: 'fact', prompt: 'Which continent reaches from the Arctic toward Central America?', correctAnswer: 'north-america', options: ['north-america', 'south-america', 'europe', 'asia'], explanation: 'North America includes northern Arctic lands and extends south through Central America.' }),
  q({ id: 'fact-no-countries', type: 'fact', prompt: 'Which continent has no countries of its own?', correctAnswer: 'antarctica', options: ['antarctica', 'australia', 'europe', 'africa'], explanation: 'Antarctica has research stations and territorial claims, but it is not divided into countries.' }),
  q({ id: 'fact-equator', type: 'fact', prompt: 'Which continent is crossed by both the Equator and the Prime Meridian?', correctAnswer: 'africa', options: ['africa', 'asia', 'south-america', 'europe'], explanation: 'Both the Equator and the Prime Meridian cross Africa.' }),
] as const;

export function getContinent(id: ContinentId) {
  return continents.find((continent) => continent.id === id)!;
}

export function shuffle<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function generateContinentRound(random: RandomSource = Math.random, count = 10): ContinentQuestion[] {
  const shuffled = shuffle(continentQuestions, random);
  const selected: ContinentQuestion[] = [];
  const types: ContinentQuestionType[] = ['map', 'identify', 'country', 'fact'];

  for (const type of types) {
    const match = shuffled.find((question) => question.type === type);
    if (match) selected.push(match);
  }
  for (const question of shuffled) {
    if (selected.length >= count) break;
    if (!selected.some((item) => item.id === question.id)) selected.push(question);
  }

  return shuffle(selected, random).map((question) => ({
    ...question,
    options: question.options ? shuffle(question.options, random) : undefined,
  }));
}
