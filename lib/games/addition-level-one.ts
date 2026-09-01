export type AdditionDifficulty = 'easy' | 'normal' | 'challenge';
export type AdditionQuestionKind = 'equation' | 'wordProblem';

export type AdditionQuestion = {
  id: string;
  prompt: string;
  choices: readonly number[];
  correctAnswer: number;
  explanation: string;
  difficulty: AdditionDifficulty;
  kind: AdditionQuestionKind;
  operands: readonly [number, number];
};

type RandomSource = () => number;
type NumberPair = readonly [number, number];

const roundMix: Record<AdditionDifficulty, { equations: number; wordProblems: number }> = {
  easy: { equations: 10, wordProblems: 0 },
  normal: { equations: 7, wordProblems: 3 },
  challenge: { equations: 5, wordProblems: 5 },
};

const wordProblems = [
  (a: number, b: number) => `Mia has ${a} apples and gets ${b} more. How many apples does she have now?`,
  (a: number, b: number) => `Leo sees ${a} stars, then spots ${b} more. How many stars does he see altogether?`,
  (a: number, b: number) => `Sam has ${a} toy cars. A friend gives him ${b} more. How many toy cars does Sam have altogether?`,
  (a: number, b: number) => `Ava has ${a} books and gets ${b} more. How many books does she have now?`,
  (a: number, b: number) => `There are ${a} balloons, and ${b} more are added. How many balloons are there altogether?`,
  (a: number, b: number) => `Eli has ${a} crayons and finds ${b} more. How many crayons does Eli have now?`,
  (a: number, b: number) => `There are ${a} ducks in a pond. ${b} more ducks join them. How many ducks are there now?`,
] as const;

function shuffled<T>(items: readonly T[], random: RandomSource) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

function pairPool(difficulty: AdditionDifficulty): NumberPair[] {
  const pairs: NumberPair[] = [];
  const minimumOperand = difficulty === 'easy' ? 1 : 2;
  const minimumTotal = difficulty === 'challenge' ? 10 : 2;
  const maximumTotal = difficulty === 'easy' ? 10 : 20;

  for (let first = minimumOperand; first <= maximumTotal; first += 1) {
    for (let second = first; second <= maximumTotal; second += 1) {
      const total = first + second;
      if (total >= minimumTotal && total <= maximumTotal) pairs.push([first, second]);
    }
  }
  return pairs;
}

function answerChoices(answer: number, random: RandomSource) {
  const offsets = shuffled([-1, 1, -2, 2, -3, 3, -4, 4], random);
  const choices = new Set<number>([answer]);
  for (const offset of offsets) {
    const candidate = answer + offset;
    if (candidate >= 1) choices.add(candidate);
    if (choices.size === 4) break;
  }
  return shuffled(Array.from(choices), random);
}

export function generateAdditionRound(difficulty: AdditionDifficulty, random: RandomSource = Math.random): AdditionQuestion[] {
  const mix = roundMix[difficulty];
  const kinds: AdditionQuestionKind[] = [
    ...Array.from({ length: mix.equations }, () => 'equation' as const),
    ...Array.from({ length: mix.wordProblems }, () => 'wordProblem' as const),
  ];
  const pairs = shuffled(pairPool(difficulty), random).slice(0, kinds.length);

  return shuffled(kinds.map((kind, index) => {
    const pair = pairs[index];
    const [low, high] = pair;
    const reverse = random() >= 0.5;
    const first = reverse ? high : low;
    const second = reverse ? low : high;
    const correctAnswer = first + second;
    const prompt = kind === 'equation'
      ? `${first} + ${second} = ?`
      : wordProblems[index % wordProblems.length](first, second);

    return {
      id: `${difficulty}-${kind}-${index}-${low}-${high}`,
      prompt,
      choices: answerChoices(correctAnswer, random),
      correctAnswer,
      explanation: `${first} + ${second} = ${correctAnswer}.`,
      difficulty,
      kind,
      operands: [first, second] as const,
    };
  }), random);
}

export function getAdditionRoundMix(difficulty: AdditionDifficulty) {
  return roundMix[difficulty];
}
