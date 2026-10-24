export type SubtractionQuestionType = 'picture' | 'number' | 'missing-number' | 'number-line';

export type SubtractionQuestion = {
  id: string;
  type: SubtractionQuestionType;
  minuend: number;
  subtrahend: number;
  correctAnswer: number;
  prompt: string;
  choices: readonly number[];
  explanation: string;
  object: string;
  level: 'level-1';
};

type Pair = readonly [number, number];
type RandomSource = () => number;

const picturePairs: readonly Pair[] = [[4, 1], [5, 2], [6, 1], [6, 3], [7, 2], [7, 4], [8, 1], [8, 3], [8, 5], [9, 2], [9, 4], [9, 6], [10, 3], [10, 5], [10, 7]];
const numberPairs: readonly Pair[] = [[6, 2], [7, 1], [7, 3], [8, 2], [8, 4], [9, 1], [9, 3], [9, 5], [10, 2], [10, 4], [11, 3], [12, 5], [14, 6], [16, 7], [19, 8]];
const missingPairs: readonly Pair[] = [[5, 3], [6, 4], [7, 5], [8, 6], [9, 7], [10, 1], [10, 6], [11, 2], [12, 4], [13, 5], [14, 7], [15, 6], [17, 8], [18, 9], [20, 7]];
const numberLinePairs: readonly Pair[] = [[4, 2], [5, 4], [6, 5], [7, 6], [8, 7], [9, 8], [10, 8], [11, 4], [12, 7], [13, 8], [14, 9], [15, 7], [16, 9], [18, 6], [20, 9]];
const objects = ['🍎', '⭐', '🐞', '🧸', '🍊'] as const;

function choicesFor(answer: number, seed: number) {
  const candidates = Array.from({ length: 21 }, (_, value) => value).filter((value) => value !== answer);
  return [answer, candidates[(seed * 3) % candidates.length], candidates[(seed * 7 + 2) % candidates.length], candidates[(seed * 11 + 5) % candidates.length]];
}

function makeQuestion(type: SubtractionQuestionType, pair: Pair, index: number): SubtractionQuestion {
  const [minuend, subtrahend] = pair;
  const remainder = minuend - subtrahend;
  const answer = type === 'missing-number' ? subtrahend : remainder;
  const object = objects[index % objects.length];
  const base = { id: `${type}-${minuend}-${subtrahend}`, type, minuend, subtrahend, correctAnswer: answer, choices: choicesFor(answer, index + minuend + subtrahend), object, level: 'level-1' as const };
  if (type === 'picture') return { ...base, prompt: `Start with ${minuend} objects. Cross out ${subtrahend}. How many remain?`, explanation: `Start with ${minuend}. Take away ${subtrahend}: ${minuend} − ${subtrahend} = ${remainder}.` };
  if (type === 'number') return { ...base, prompt: `${minuend} − ${subtrahend} = ?`, explanation: `Count back ${subtrahend} from ${minuend} to reach ${remainder}.` };
  if (type === 'missing-number') return { ...base, prompt: `${minuend} − ? = ${remainder}`, explanation: `${subtrahend} is missing because ${minuend} − ${subtrahend} = ${remainder}.` };
  return { ...base, prompt: `Start at ${minuend}. Move backwards ${subtrahend} spaces. Where do you land?`, explanation: `Move back ${subtrahend} steps from ${minuend}: ${minuend} − ${subtrahend} = ${remainder}.` };
}

export const subtractionQuestions: readonly SubtractionQuestion[] = [
  ...picturePairs.map((pair, index) => makeQuestion('picture', pair, index)),
  ...numberPairs.map((pair, index) => makeQuestion('number', pair, index)),
  ...missingPairs.map((pair, index) => makeQuestion('missing-number', pair, index)),
  ...numberLinePairs.map((pair, index) => makeQuestion('number-line', pair, index)),
];

function shuffle<T>(items: readonly T[], random: RandomSource): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function generateSubtractionRound(random: RandomSource = Math.random): SubtractionQuestion[] {
  const counts: Record<SubtractionQuestionType, number> = { picture: 3, number: 3, 'missing-number': 2, 'number-line': 2 };
  const selected = (Object.entries(counts) as [SubtractionQuestionType, number][]).flatMap(([type, count]) =>
    shuffle(subtractionQuestions.filter((question) => question.type === type), random).slice(0, count).map((question) => ({ ...question, choices: shuffle(question.choices, random) })),
  );
  return shuffle(selected, random);
}
