export type GameStatus = 'available' | 'coming-soon' | 'planned';

export type GameRegistryEntry = {
  subjectId: 'english' | 'mathematics' | 'science' | 'geography';
  subjectName: string;
  gameId: string;
  title: string;
  level: number;
  description: string;
  route?: string;
  status: GameStatus;
  displayOrder: number;
  releaseDate?: string;
  isNew?: boolean;
  icon: string;
};

export const gameRegistry: readonly GameRegistryEntry[] = [
  { subjectId: 'english', subjectName: 'English', gameId: 'a-or-an', title: 'A or An?', level: 1, description: 'Choose the correct article before a noun.', route: '/games/english/a-or-an', status: 'available', displayOrder: 1, icon: '🍎' },
  { subjectId: 'english', subjectName: 'English', gameId: 'one-or-many', title: 'One or Many?', level: 1, description: 'Practise singular and plural nouns.', route: '/games/english/one-or-many', status: 'available', displayOrder: 2, icon: '🐱' },
  { subjectId: 'english', subjectName: 'English', gameId: 'he-she-it', title: 'He, She, It', level: 1, description: 'Choose the correct personal pronoun.', route: '/games/english/he-she-it', status: 'available', displayOrder: 3, icon: '👧' },
  { subjectId: 'english', subjectName: 'English', gameId: 'is-am-are', title: 'Is, Am, Are', level: 1, description: 'Practise the verb “to be”.', route: '/games/english/is-am-are', status: 'available', displayOrder: 4, icon: '💬' },
  { subjectId: 'english', subjectName: 'English', gameId: 'can-or-cant', title: "Can or Can't?", level: 1, description: 'Learn how to talk about ability.', route: '/games/english/can-or-cant', status: 'available', displayOrder: 5, icon: '🐦' },
  { subjectId: 'english', subjectName: 'English', gameId: 'who-is-it', title: 'Who Is It?', level: 1, description: 'Practise I, you, he, she, it, we and they.', route: '/games/english/who-is-it', status: 'available', displayOrder: 6, icon: '👥' },
  { subjectId: 'english', subjectName: 'English', gameId: 'whose-is-it', title: 'Whose Is It?', level: 1, description: 'Practise words that show who owns something.', route: '/games/english/whose-is-it', status: 'available', displayOrder: 7, icon: '🎒' },
  { subjectId: 'english', subjectName: 'English', gameId: 'where-is-it', title: 'Where Is It?', level: 1, description: 'Practise useful position words.', route: '/games/english/where-is-it', status: 'available', displayOrder: 8, icon: '📦' },
  { subjectId: 'english', subjectName: 'English', gameId: 'this-that-these-those', title: 'This, That, These or Those?', level: 1, description: 'Use number and distance clues.', route: '/games/english/this-that-these-those', status: 'available', displayOrder: 9, icon: '👉' },
  { subjectId: 'english', subjectName: 'English', gameId: 'has-or-have', title: 'Has or Have?', level: 1, description: 'Choose the correct form of “have”.', route: '/games/english/has-or-have', status: 'available', displayOrder: 10, icon: '✏️' },
  { subjectId: 'mathematics', subjectName: 'Mathematics', gameId: 'addition-level-1', title: 'Addition Level 1', level: 1, description: 'Join quantities and solve addition within 10 and 20.', route: '/games/math/addition-level-1', status: 'available', displayOrder: 1, icon: '➕' },
  { subjectId: 'science', subjectName: 'Science', gameId: 'animal-habitats', title: 'Where Do I Live?', level: 1, description: 'Match animals to the habitats that meet their needs.', route: '/games/science/animal-habitats', status: 'available', displayOrder: 1, icon: '🦉' },
  { subjectId: 'geography', subjectName: 'Geography', gameId: 'continent-explorer', title: 'Continent Explorer', level: 1, description: 'Find continents and connect countries with their place in the world.', route: '/games/geography/continent-explorer', status: 'available', displayOrder: 1, isNew: true, icon: '🌍' },
  { subjectId: 'geography', subjectName: 'Geography', gameId: 'ocean-explorer', title: 'Ocean Explorer', level: 1, description: 'Find five oceans and use nearby continents as clues.', route: '/games/geography/ocean-explorer', status: 'available', displayOrder: 2, isNew: true, icon: '🌊' },
  { subjectId: 'geography', subjectName: 'Geography', gameId: 'flag-detective', title: 'Flag Detective', level: 1, description: 'Use colours, symbols and patterns to recognise national flags.', route: '/games/geography/flag-detective', status: 'available', displayOrder: 3, isNew: true, icon: '🚩' },
  { subjectId: 'geography', subjectName: 'Geography', gameId: 'landmark-explorer', title: 'Landmark Explorer', level: 1, description: 'Discover famous landmarks and the places they call home.', status: 'coming-soon', displayOrder: 4, icon: '🏛️' },
];

export const subjectOrder = ['english', 'mathematics', 'science', 'geography'] as const;

export function getRoadmapBySubject() {
  return subjectOrder.map((subjectId) => ({
    subjectId,
    subjectName: gameRegistry.find((game) => game.subjectId === subjectId)!.subjectName,
    games: gameRegistry.filter((game) => game.subjectId === subjectId).sort((a, b) => a.displayOrder - b.displayOrder),
  }));
}
