export const oceanIds = ['pacific', 'atlantic', 'indian', 'southern', 'arctic'] as const;
export type OceanId = (typeof oceanIds)[number];
export type OceanQuestionType = 'identify' | 'map' | 'relationship' | 'fact';

export type OceanQuestion = {
  id: string;
  type: OceanQuestionType;
  prompt: string;
  correctAnswer: OceanId;
  options?: readonly OceanId[];
  explanation: string;
  mapIdentifier?: OceanId;
  difficulty: 'level-1';
};

type RandomSource = () => number;

export const oceans = [
  { id: 'pacific', name: 'Pacific Ocean', colour: '#2563eb', shortFact: 'The Pacific is the largest and deepest ocean basin. It appears on both edges of many flat world maps.' },
  { id: 'atlantic', name: 'Atlantic Ocean', colour: '#0891b2', shortFact: 'The Atlantic lies mainly between the Americas and Europe and Africa.' },
  { id: 'indian', name: 'Indian Ocean', colour: '#0d9488', shortFact: 'The Indian Ocean lies between Africa, Asia and Australia.' },
  { id: 'southern', name: 'Southern Ocean', colour: '#7c3aed', shortFact: 'The Southern Ocean circles Antarctica.' },
  { id: 'arctic', name: 'Arctic Ocean', colour: '#0284c7', shortFact: 'The Arctic Ocean is centred around the North Pole and is the smallest ocean basin.' },
] as const;

const allOptions = oceanIds;
const q = (question: Omit<OceanQuestion, 'difficulty'>): OceanQuestion => ({ ...question, difficulty: 'level-1' });

export const oceanQuestions: readonly OceanQuestion[] = [
  ...oceans.map((ocean) => q({ id: `identify-${ocean.id}`, type: 'identify', prompt: 'Which ocean is marked on the world map?', correctAnswer: ocean.id, options: allOptions, mapIdentifier: ocean.id, explanation: ocean.shortFact })),
  ...oceans.map((ocean) => q({ id: `find-${ocean.id}`, type: 'map', prompt: `Find the ${ocean.name} on the world map.`, correctAnswer: ocean.id, mapIdentifier: ocean.id, explanation: ocean.shortFact })),

  q({ id: 'relation-africa-australia', type: 'relationship', prompt: 'Which ocean lies between Africa and Australia?', correctAnswer: 'indian', options: ['indian', 'atlantic', 'pacific', 'southern'], explanation: 'The Indian Ocean fills the broad space east of Africa and west of Australia.' }),
  q({ id: 'relation-americas-europe-africa', type: 'relationship', prompt: 'Which ocean separates the Americas from Europe and Africa?', correctAnswer: 'atlantic', options: ['atlantic', 'pacific', 'indian', 'arctic'], explanation: 'The Atlantic Ocean lies between the Americas to the west and Europe and Africa to the east.' }),
  q({ id: 'relation-antarctica', type: 'relationship', prompt: 'Which ocean surrounds Antarctica?', correctAnswer: 'southern', options: ['southern', 'arctic', 'indian', 'atlantic'], explanation: 'The Southern Ocean circles Antarctica in Earth’s far south.' }),
  q({ id: 'relation-north-america-asia', type: 'relationship', prompt: 'Which ocean lies between North America and Asia?', correctAnswer: 'pacific', options: ['pacific', 'atlantic', 'arctic', 'indian'], explanation: 'The Pacific Ocean stretches between Asia and Australia on one side and the Americas on the other.' }),
  q({ id: 'relation-north-pole', type: 'relationship', prompt: 'Which ocean is around the North Pole?', correctAnswer: 'arctic', options: ['arctic', 'southern', 'atlantic', 'pacific'], explanation: 'The Arctic Ocean surrounds the North Pole, north of North America, Europe and Asia.' }),
  q({ id: 'relation-east-africa', type: 'relationship', prompt: 'Which ocean touches the east coast of Africa?', correctAnswer: 'indian', options: ['indian', 'atlantic', 'pacific', 'arctic'], explanation: 'Africa’s east coast faces the Indian Ocean.' }),
  q({ id: 'relation-west-africa', type: 'relationship', prompt: 'Which ocean touches the west coast of Africa?', correctAnswer: 'atlantic', options: ['atlantic', 'indian', 'pacific', 'southern'], explanation: 'Africa’s west coast faces the Atlantic Ocean.' }),
  q({ id: 'relation-east-australia', type: 'relationship', prompt: 'Which ocean is east of Australia?', correctAnswer: 'pacific', options: ['pacific', 'indian', 'atlantic', 'southern'], explanation: 'Australia has the Pacific Ocean to its east and the Indian Ocean to its west.' }),
  q({ id: 'relation-north-antarctica', type: 'relationship', prompt: 'Sail north from Antarctica: which named ocean do you leave first?', correctAnswer: 'southern', options: ['southern', 'arctic', 'pacific', 'atlantic'], explanation: 'The Southern Ocean forms a ring of water immediately around Antarctica.' }),
  q({ id: 'relation-south-asia', type: 'relationship', prompt: 'Which ocean is directly south of India?', correctAnswer: 'indian', options: ['indian', 'pacific', 'atlantic', 'arctic'], explanation: 'India extends south into the northern part of the Indian Ocean.' }),
  q({ id: 'relation-east-united-states', type: 'relationship', prompt: 'Which ocean touches the east coast of the United States?', correctAnswer: 'atlantic', options: ['atlantic', 'pacific', 'indian', 'arctic'], explanation: 'The eastern United States faces the Atlantic Ocean.' }),
  q({ id: 'relation-west-south-america', type: 'relationship', prompt: 'Which ocean touches the west coast of South America?', correctAnswer: 'pacific', options: ['pacific', 'atlantic', 'indian', 'southern'], explanation: 'The long western coast of South America faces the Pacific Ocean.' }),
  q({ id: 'relation-north-europe', type: 'relationship', prompt: 'Which ocean lies north of Europe?', correctAnswer: 'arctic', options: ['arctic', 'atlantic', 'southern', 'indian'], explanation: 'The Arctic Ocean lies north of Europe, Asia and North America.' }),
  q({ id: 'relation-south-australia', type: 'relationship', prompt: 'Which ocean region circles the globe south of Australia?', correctAnswer: 'southern', options: ['southern', 'indian', 'pacific', 'arctic'], explanation: 'The Southern Ocean circles Antarctica and lies south of Australia.' }),
  q({ id: 'relation-west-australia', type: 'relationship', prompt: 'Which ocean is west of Australia?', correctAnswer: 'indian', options: ['indian', 'pacific', 'atlantic', 'southern'], explanation: 'Western Australia faces the Indian Ocean.' }),

  q({ id: 'fact-largest', type: 'fact', prompt: 'Which ocean is the largest?', correctAnswer: 'pacific', options: allOptions, explanation: 'The Pacific is by far the largest ocean basin and holds more than half of Earth’s free water.' }),
  q({ id: 'fact-smallest', type: 'fact', prompt: 'Which ocean is the smallest?', correctAnswer: 'arctic', options: allOptions, explanation: 'The Arctic is the smallest of the five named ocean basins.' }),
  q({ id: 'fact-deepest', type: 'fact', prompt: 'Which ocean is the deepest?', correctAnswer: 'pacific', options: ['pacific', 'atlantic', 'indian', 'arctic'], explanation: 'The Pacific is the deepest ocean basin and contains the Mariana Trench.' }),
  q({ id: 'fact-second-largest', type: 'fact', prompt: 'Which ocean is the second largest?', correctAnswer: 'atlantic', options: ['atlantic', 'indian', 'southern', 'arctic'], explanation: 'The Atlantic is the second-largest ocean basin, after the Pacific.' }),
  q({ id: 'fact-named-after-country', type: 'fact', prompt: 'Which ocean shares its name with the country India?', correctAnswer: 'indian', options: ['indian', 'atlantic', 'pacific', 'arctic'], explanation: 'The Indian Ocean takes its name from India, which lies along its northern edge.' }),
  q({ id: 'fact-polar-north', type: 'fact', prompt: 'Which ocean is centred on the North Pole?', correctAnswer: 'arctic', options: ['arctic', 'southern', 'pacific', 'atlantic'], explanation: 'The Arctic Ocean surrounds the North Pole.' }),
  q({ id: 'fact-polar-south', type: 'fact', prompt: 'Which ocean is named for its position in Earth’s far south?', correctAnswer: 'southern', options: ['southern', 'arctic', 'indian', 'atlantic'], explanation: 'The Southern Ocean is the ocean region around Antarctica in Earth’s far south.' }),
  q({ id: 'fact-flat-map-edges', type: 'fact', prompt: 'Which ocean often appears on both edges of a flat world map?', correctAnswer: 'pacific', options: ['pacific', 'atlantic', 'indian', 'arctic'], explanation: 'A flat world map is usually split through the Pacific, so the same ocean appears at both the left and right edges.' }),
  q({ id: 'fact-ring-of-fire', type: 'fact', prompt: 'The “Ring of Fire” surrounds much of which ocean?', correctAnswer: 'pacific', options: ['pacific', 'atlantic', 'indian', 'southern'], explanation: 'Many volcanoes and earthquake zones form a broad ring around the Pacific basin.' }),
  q({ id: 'fact-most-northern', type: 'fact', prompt: 'Which named ocean is the farthest north?', correctAnswer: 'arctic', options: ['arctic', 'atlantic', 'pacific', 'southern'], explanation: 'The Arctic Ocean occupies the region around Earth’s North Pole.' }),
  q({ id: 'fact-circles-continent', type: 'fact', prompt: 'Which ocean forms a continuous ring around a continent?', correctAnswer: 'southern', options: ['southern', 'atlantic', 'indian', 'arctic'], explanation: 'The Southern Ocean flows all the way around Antarctica.' }),
  q({ id: 'fact-between-largest', type: 'fact', prompt: 'Which ocean is larger: the Atlantic or the Indian?', correctAnswer: 'atlantic', options: ['atlantic', 'indian'], explanation: 'The Atlantic is the second-largest ocean basin, while the Indian is third.' }),
  q({ id: 'fact-one-global-ocean', type: 'fact', prompt: 'The five named oceans are all connected. Which one links Asia and the Americas?', correctAnswer: 'pacific', options: ['pacific', 'indian', 'atlantic', 'southern'], explanation: 'The Pacific connects the coasts of Asia and Australia with the coasts of the Americas as part of one global ocean.' }),
  q({ id: 'fact-ice-covered', type: 'fact', prompt: 'Which ocean is partly covered by sea ice throughout the year?', correctAnswer: 'arctic', options: ['arctic', 'indian', 'atlantic', 'pacific'], explanation: 'Sea ice covers part of the Arctic Ocean year-round, with a larger area in winter.' }),
  q({ id: 'fact-drake-passage', type: 'fact', prompt: 'The Drake Passage near Antarctica is part of which ocean region?', correctAnswer: 'southern', options: ['southern', 'arctic', 'indian', 'pacific'], explanation: 'The Drake Passage lies between South America and Antarctica within the Southern Ocean region.' }),
] as const;

export function getOcean(id: OceanId) {
  return oceans.find((ocean) => ocean.id === id)!;
}

export function shuffleOceanItems<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function generateOceanRound(random: RandomSource = Math.random, count = 10): OceanQuestion[] {
  const shuffled = shuffleOceanItems(oceanQuestions, random);
  const selected: OceanQuestion[] = [];
  const types: OceanQuestionType[] = ['map', 'identify', 'relationship', 'fact'];

  for (const type of types) {
    const match = shuffled.find((question) => question.type === type);
    if (match) selected.push(match);
  }
  for (const question of shuffled) {
    if (selected.length >= count) break;
    if (!selected.some((item) => item.id === question.id)) selected.push(question);
  }

  return shuffleOceanItems(selected, random).map((question) => ({
    ...question,
    options: question.options ? shuffleOceanItems(question.options, random) : undefined,
  }));
}
