export const habitatIds = ['forest', 'desert', 'ocean', 'ice-and-snow'] as const;
export type HabitatId = (typeof habitatIds)[number];
export type HabitatDifficulty = 'easy' | 'medium' | 'hard';

export type Habitat = {
  id: HabitatId;
  name: string;
  imagePath: string;
  emoji: string;
  palette: string;
};

export type Animal = {
  id: string;
  name: string;
  habitat: HabitatId;
  imagePath: string;
  difficulties: readonly HabitatDifficulty[];
  fact: string;
  clue: string;
  emoji: string;
};

export type HabitatQuestion = {
  animal: Animal;
  choices: Habitat[];
  useClue: boolean;
};

type RandomSource = () => number;

export const habitats: readonly Habitat[] = [
  { id: 'forest', name: 'Forest', imagePath: '/games/animal-habitats/habitats/forest.webp', emoji: '🌲', palette: 'bg-[#e7f0df] border-[#91aa79] text-[#29422c]' },
  { id: 'desert', name: 'Desert', imagePath: '/games/animal-habitats/habitats/desert.webp', emoji: '🏜️', palette: 'bg-[#f8e8c8] border-[#d5aa65] text-[#5b3b1e]' },
  { id: 'ocean', name: 'Ocean', imagePath: '/games/animal-habitats/habitats/ocean.webp', emoji: '🌊', palette: 'bg-[#dceef0] border-[#73aeb8] text-[#173e49]' },
  { id: 'ice-and-snow', name: 'Ice & Snow', imagePath: '/games/animal-habitats/habitats/ice-and-snow.webp', emoji: '❄️', palette: 'bg-[#edf3f5] border-[#9db8c2] text-[#294653]' },
] as const;

const allDifficulties = ['medium', 'hard'] as const;
const easyDifficulties = ['easy', 'medium', 'hard'] as const;

export const animals: readonly Animal[] = [
  { id: 'deer', name: 'Deer', habitat: 'forest', imagePath: '/games/animal-habitats/animals/deer.webp', difficulties: easyDifficulties, emoji: '🦌', fact: 'Many deer find food and shelter among trees and woodland plants.', clue: 'This animal walks quietly among trees and eats leaves and grass.' },
  { id: 'owl', name: 'Owl', habitat: 'forest', imagePath: '/games/animal-habitats/animals/owl.webp', difficulties: easyDifficulties, emoji: '🦉', fact: 'Many owls rest and nest in trees in forests and woodlands.', clue: 'This bird often rests in trees during the day and hunts at night.' },
  { id: 'red-squirrel', name: 'Red Squirrel', habitat: 'forest', imagePath: '/games/animal-habitats/animals/red-squirrel.webp', difficulties: allDifficulties, emoji: '🐿️', fact: 'Red squirrels live in woodlands where they find seeds, cones and shelter.', clue: 'This small animal climbs trees and collects seeds and pine cones.' },
  { id: 'raccoon', name: 'Raccoon', habitat: 'forest', imagePath: '/games/animal-habitats/animals/raccoon.webp', difficulties: allDifficulties, emoji: '🦝', fact: 'Raccoons often make their homes in wooded areas near water.', clue: 'This night-time animal often shelters in hollow trees near water.' },
  { id: 'camel', name: 'Camel', habitat: 'desert', imagePath: '/games/animal-habitats/animals/camel.webp', difficulties: easyDifficulties, emoji: '🐪', fact: 'Camels are well suited to hot, dry deserts.', clue: 'This animal can travel for long distances in hot, dry places.' },
  { id: 'fennec-fox', name: 'Fennec Fox', habitat: 'desert', imagePath: '/games/animal-habitats/animals/fennec-fox.webp', difficulties: allDifficulties, emoji: '🦊', fact: 'Fennec foxes live in sandy deserts in North Africa.', clue: 'This small fox has very large ears that help it stay cool in hot, dry places.' },
  { id: 'meerkat', name: 'Meerkat', habitat: 'desert', imagePath: '/games/animal-habitats/animals/meerkat.webp', difficulties: easyDifficulties, emoji: '🐾', fact: 'Meerkats live in burrows in dry deserts and grasslands of southern Africa.', clue: 'This small animal stands tall to watch for danger near its burrow.' },
  { id: 'desert-tortoise', name: 'Desert Tortoise', habitat: 'desert', imagePath: '/games/animal-habitats/animals/desert-tortoise.webp', difficulties: allDifficulties, emoji: '🐢', fact: 'Desert tortoises shelter in burrows to escape extreme heat.', clue: 'This slow animal has a hard shell and rests in a burrow when it is very hot.' },
  { id: 'dolphin', name: 'Dolphin', habitat: 'ocean', imagePath: '/games/animal-habitats/animals/dolphin.webp', difficulties: easyDifficulties, emoji: '🐬', fact: 'Dolphins live in oceans and seas around the world.', clue: 'This clever mammal breathes air but spends its life swimming in the sea.' },
  { id: 'shark', name: 'Shark', habitat: 'ocean', imagePath: '/games/animal-habitats/animals/shark.webp', difficulties: easyDifficulties, emoji: '🦈', fact: 'Sharks are fish that live in oceans around the world.', clue: 'This fish uses gills to breathe and has rows of teeth.' },
  { id: 'octopus', name: 'Octopus', habitat: 'ocean', imagePath: '/games/animal-habitats/animals/octopus.webp', difficulties: allDifficulties, emoji: '🐙', fact: 'Octopuses live in salt water, often hiding among rocks or coral.', clue: 'This sea animal has eight arms and can squeeze into small hiding places.' },
  { id: 'sea-turtle', name: 'Sea Turtle', habitat: 'ocean', imagePath: '/games/animal-habitats/animals/sea-turtle.webp', difficulties: allDifficulties, emoji: '🐢', fact: 'Sea turtles spend most of their lives in the ocean and come ashore to lay eggs.', clue: 'This animal uses flippers to swim and comes onto beaches to lay eggs.' },
  { id: 'polar-bear', name: 'Polar Bear', habitat: 'ice-and-snow', imagePath: '/games/animal-habitats/animals/polar-bear.webp', difficulties: easyDifficulties, emoji: '🐻‍❄️', fact: 'Polar bears live in the cold Arctic and hunt on sea ice.', clue: 'This large white bear lives in the Arctic and walks across sea ice.' },
  { id: 'penguin', name: 'Penguin', habitat: 'ice-and-snow', imagePath: '/games/animal-habitats/animals/penguin.webp', difficulties: easyDifficulties, emoji: '🐧', fact: 'Many penguins live in cold southern places, including Antarctica, and none live wild in the Arctic.', clue: 'This bird uses flippers to move through very cold water and cannot fly.' },
  { id: 'walrus', name: 'Walrus', habitat: 'ice-and-snow', imagePath: '/games/animal-habitats/animals/walrus.webp', difficulties: allDifficulties, emoji: '🦭', fact: 'Walruses live in cold Arctic seas and rest on ice or land.', clue: 'This large Arctic animal has long tusks and rests on ice near the sea.' },
  { id: 'arctic-fox', name: 'Arctic Fox', habitat: 'ice-and-snow', imagePath: '/games/animal-habitats/animals/arctic-fox.webp', difficulties: allDifficulties, emoji: '🦊', fact: 'Arctic foxes live on the cold, treeless Arctic tundra.', clue: 'This small fox grows a thick coat to stay warm on the Arctic tundra.' },
] as const;

const settings: Record<HabitatDifficulty, { questionCount: number; choiceCount: number }> = {
  easy: { questionCount: 8, choiceCount: 2 },
  medium: { questionCount: 10, choiceCount: 3 },
  hard: { questionCount: 10, choiceCount: 4 },
};

export function shuffle<T>(items: readonly T[], random: RandomSource = Math.random): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function generateHabitatRound(difficulty: HabitatDifficulty, random: RandomSource = Math.random): HabitatQuestion[] {
  const { questionCount, choiceCount } = settings[difficulty];
  const pool = animals.filter((animal) => animal.difficulties.includes(difficulty));
  return shuffle(pool, random).slice(0, questionCount).map((animal, index) => {
    const correctHabitat = habitats.find((habitat) => habitat.id === animal.habitat)!;
    const distractors = shuffle(habitats.filter((habitat) => habitat.id !== animal.habitat), random).slice(0, choiceCount - 1);
    return {
      animal,
      choices: shuffle([correctHabitat, ...distractors], random),
      useClue: difficulty === 'hard' && index % 2 === 0,
    };
  });
}

export function getHabitatSettings(difficulty: HabitatDifficulty) {
  return settings[difficulty];
}
