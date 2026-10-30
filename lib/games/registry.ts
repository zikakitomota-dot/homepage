export type GameStatus = 'available' | 'coming-soon' | 'planned';

export type GameRegistryEntry = {
  subjectId: 'english' | 'mathematics' | 'science' | 'geography' | 'logic' | 'life-skills';
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
  searchKeywords?: readonly string[];
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
  { subjectId: 'mathematics', subjectName: 'Mathematics', gameId: 'subtraction-level-1', title: 'Subtraction Adventure', level: 1, description: 'Take away objects, find missing numbers and move backwards on a number line.', route: '/games/math/subtraction-level-1', status: 'available', displayOrder: 2, isNew: true, icon: '➖' },
  { subjectId: 'science', subjectName: 'Science', gameId: 'animal-habitats', title: 'Where Do I Live?', level: 1, description: 'Match animals to the habitats that meet their needs.', route: '/games/science/animal-habitats', status: 'available', displayOrder: 1, icon: '🦉' },
  { subjectId: 'science', subjectName: 'Science', gameId: 'living-or-non-living', title: 'Living or Non-Living?', level: 1, description: 'Use evidence to classify organisms, objects and once-living materials.', route: '/games/science/living-or-non-living', status: 'available', displayOrder: 2, isNew: true, icon: '🌱' },
  { subjectId: 'geography', subjectName: 'Geography', gameId: 'continent-explorer', title: 'Continent Explorer', level: 1, description: 'Find continents and connect countries with their place in the world.', route: '/games/geography/continent-explorer', status: 'available', displayOrder: 1, isNew: true, icon: '🌍' },
  { subjectId: 'geography', subjectName: 'Geography', gameId: 'ocean-explorer', title: 'Ocean Explorer', level: 1, description: 'Find five oceans and use nearby continents as clues.', route: '/games/geography/ocean-explorer', status: 'available', displayOrder: 2, isNew: true, icon: '🌊' },
  { subjectId: 'geography', subjectName: 'Geography', gameId: 'flag-detective', title: 'Flag Detective', level: 1, description: 'Use colours, symbols and patterns to recognise national flags.', route: '/games/geography/flag-detective', status: 'available', displayOrder: 3, isNew: true, icon: '🚩' },
  { subjectId: 'geography', subjectName: 'Geography', gameId: 'landmark-explorer', title: 'Landmark Explorer', level: 1, description: 'Recognise famous landmarks and connect them with countries and continents.', route: '/games/geography/landmark-explorer', status: 'available', displayOrder: 4, isNew: true, icon: '🏛️' },
  { subjectId: 'logic', subjectName: 'Logic & Brain Games', gameId: 'pattern-detective', title: 'Pattern Detective — Level 1', level: 1, description: 'Solve repeating patterns, growing sequences, odd-one-out puzzles and visual grids with explained clues.', route: '/games/logic/pattern-detective', status: 'available', displayOrder: 1, isNew: true, icon: '🧩', searchKeywords: ['pattern', 'puzzle', 'sequence', 'brain', 'reasoning', 'observation', 'logic'] },
  { subjectId: 'logic', subjectName: 'Logic & Brain Games', gameId: 'memory-match', title: 'Memory Match — Level 1', level: 1, description: 'Reveal picture cards and find matching pairs to practise visual memory, attention and recall.', route: '/games/logic/memory-match', status: 'available', displayOrder: 2, isNew: true, icon: '🃏', searchKeywords: ['memory', 'matching', 'pairs', 'cards', 'recall', 'brain'] },
  { subjectId: 'life-skills', subjectName: 'Life Skills', gameId: 'time-detective', title: 'Time Detective — Level 1', level: 1, description: 'Read and set analogue clocks through full hours, half hours, quarter hours and five-minute times.', route: '/games/life-skills/time-detective', status: 'available', displayOrder: 1, isNew: true, icon: '🕰️', searchKeywords: ['time', 'clock', 'analogue', 'digital', 'hour', 'minute', 'quarter past', 'quarter to', 'daily routine'] },
  { subjectId: 'life-skills', subjectName: 'Life Skills', gameId: 'money-match', title: 'Money Match — Level 1', level: 1, description: 'Recognise coins and notes, count money, match prices, pay exact amounts and calculate simple change in MYR or USD.', route: '/games/life-skills/money-match', status: 'available', displayOrder: 2, isNew: true, icon: '🪙', searchKeywords: ['money', 'currency', 'coins', 'banknotes', 'notes', 'ringgit', 'MYR', 'dollar', 'USD', 'price', 'payment', 'change'] },
  { subjectId: 'life-skills', subjectName: 'Life Skills', gameId: 'daily-routine-builder', title: 'Daily Routine Builder', level: 1, description: 'Explore how activities can be ordered into a clear, flexible routine.', status: 'planned', displayOrder: 3, icon: '📋' },
  { subjectId: 'life-skills', subjectName: 'Life Skills', gameId: 'needs-vs-wants', title: 'Needs vs Wants', level: 1, description: 'Use simple scenarios to discuss needs, wants and thoughtful choices.', status: 'planned', displayOrder: 4, icon: '💭' },
];

export const subjectOrder = ['english', 'mathematics', 'science', 'geography', 'logic', 'life-skills'] as const;

export function getRoadmapBySubject() {
  return subjectOrder.map((subjectId) => ({
    subjectId,
    subjectName: gameRegistry.find((game) => game.subjectId === subjectId)!.subjectName,
    games: gameRegistry.filter((game) => game.subjectId === subjectId).sort((a, b) => a.displayOrder - b.displayOrder),
  }));
}
