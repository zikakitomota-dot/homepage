export const PATTERN_GAME_ID = 'pattern-detective';
export const patternTypes = ['repeat', 'grow', 'odd', 'grid'] as const;
export type PatternType = typeof patternTypes[number];
export type Shape = 'circle' | 'square' | 'triangle' | 'star' | 'diamond' | 'arrow';
export type Token = { shape: Shape; count: number; turn: number };
export type PatternChoice = { id: string; token: Token };
export type PatternPuzzle = {
  id: string; type: PatternType; family: string; prompt: string; instruction: string;
  cells: (Token | null)[]; choices: PatternChoice[]; correctChoiceId: string; explanation: string;
  rule: { kind: 'repeat'; unit: Token[] } | { kind: 'count'; start: number; step: number }
    | { kind: 'turn'; start: number; step: number } | { kind: 'odd'; attribute: 'shape' | 'count' | 'turn' }
    | { kind: 'grid'; columns: number; rows: number; shift: number; unit: Token[] };
};
export const typeLabels: Record<PatternType, string> = {
  repeat: 'Complete the Pattern', grow: 'What Comes Next?', odd: 'Odd One Out', grid: 'Pattern Grid Detective',
};
const shapes: Shape[] = ['circle', 'square', 'triangle', 'star', 'diamond'];
const token = (shape: Shape, count = 1, turn = 0): Token => ({ shape, count, turn });
export const tokenKey = (item: Token) => `${item.shape}:${item.count}:${item.turn}`;
export function describeToken(item: Token) {
  if (item.shape === 'arrow') return `arrow pointing ${['up', 'right', 'down', 'left'][item.turn]}`;
  return `${item.count} ${item.shape}${item.count === 1 ? '' : 's'}`;
}
function choicesFor(answer: Token): PatternChoice[] {
  const candidates = answer.shape === 'arrow' ? [0, 1, 2, 3].map(turn => token('arrow', 1, turn))
    : answer.count > 1 ? Array.from({ length: 9 }, (_, i) => token(answer.shape, i + 1))
      : shapes.map(shape => token(shape));
  const alternatives = candidates.filter(item => tokenKey(item) !== tokenKey(answer));
  // Nearby counts keep all four choices plausible; ordering is shuffled per session.
  alternatives.sort((a, b) => Math.abs(a.count - answer.count) - Math.abs(b.count - answer.count));
  return [answer, ...alternatives.slice(0, 3)].map(item => ({ id: tokenKey(item), token: item }));
}
function makePuzzle(data: Omit<PatternPuzzle, 'choices' | 'correctChoiceId'>, answer: Token): PatternPuzzle {
  return { ...data, choices: choicesFor(answer), correctChoiceId: tokenKey(answer) };
}
// Fifteen explicit visual rule specifications per mechanic. Content stays local;
// the generator only selects and orders these reviewed structures.
const repeats: [string, Shape, Shape, Shape?][] = [
  ['AB', 'circle', 'square'], ['AB', 'triangle', 'star'], ['AB', 'diamond', 'circle'], ['AB', 'star', 'square'],
  ['AAB', 'circle', 'triangle'], ['AAB', 'star', 'square'], ['AAB', 'diamond', 'star'], ['AAB', 'square', 'circle'],
  ['ABB', 'triangle', 'star'], ['ABB', 'circle', 'diamond'], ['ABB', 'square', 'triangle'], ['ABB', 'star', 'circle'],
  ['ABC', 'circle', 'square', 'triangle'], ['ABC', 'star', 'diamond', 'circle'], ['ABC', 'triangle', 'star', 'square'],
];
const repeatBank = repeats.map(([pattern, a, b, c], i) => {
  const map = { A: token(a), B: token(b), C: token(c ?? 'diamond') };
  const unit = pattern.split('').map(letter => map[letter as keyof typeof map]);
  const missing = unit.length * 2 + i % unit.length;
  const answer = unit[missing % unit.length];
  return makePuzzle({ id: `repeat-${i + 1}`, type: 'repeat', family: `repeat-${pattern}`,
    prompt: 'Which item completes the repeating pattern?', instruction: 'Read the numbered sequence in order. Look for the small group that repeats.',
    cells: [...Array.from({ length: missing }, (_, index) => unit[index % unit.length]), null], rule: { kind: 'repeat', unit },
    explanation: `The repeating group is ${unit.map(describeToken).join(', ')}. After the last shown item, the next place in that group is ${describeToken(answer)}.`,
  }, answer);
});
const growthSpecs: [Shape, number, number][] = [
  ['star', 1, 1], ['circle', 2, 1], ['square', 3, 1], ['triangle', 1, 2], ['diamond', 2, 2],
  ['square', 3, 2], ['diamond', 1, 1], ['star', 2, 2], ['triangle', 2, 1],
];
const growthBank: PatternPuzzle[] = growthSpecs.map(([shape, start, step], i) => {
  const answer = token(shape, start + step * 3);
  return makePuzzle({ id: `grow-count-${i + 1}`, type: 'grow', family: `count-${step}`,
    prompt: 'How many objects belong in the next group?', instruction: 'Count each group in order. The same number of objects is added each time.',
    cells: [token(shape, start), token(shape, start + step), token(shape, start + step * 2), null],
    rule: { kind: 'count', start, step }, explanation: `The groups have ${start}, ${start + step}, then ${start + step * 2} objects. Add ${step} each time: the next group has ${answer.count} ${shape}s.`,
  }, answer);
});
for (const [i, [start, step]] of Array.from(([[0, 1], [1, 1], [2, 1], [0, -1], [1, -1], [3, -1]] as const).entries())) {
  const turnAt = (position: number) => (start + step * position + 12) % 4;
  const answer = token('arrow', 1, turnAt(3));
  growthBank.push(makePuzzle({ id: `grow-turn-${i + 1}`, type: 'grow', family: `turn-${step}`,
    prompt: 'Which way will the arrow point next?', instruction: `Follow the arrows in order. Each arrow turns one quarter-turn ${step === 1 ? 'clockwise' : 'anticlockwise'}.`,
    cells: [token('arrow', 1, turnAt(0)), token('arrow', 1, turnAt(1)), token('arrow', 1, turnAt(2)), null],
    rule: { kind: 'turn', start, step }, explanation: `The arrow turns a quarter-turn ${step === 1 ? 'clockwise' : 'anticlockwise'} each time. After ${describeToken(token('arrow', 1, turnAt(2)))}, the next is an ${describeToken(answer)}.`,
  }, answer));
}
const oddSpecs: [Token, Token, 'shape' | 'count' | 'turn'][] = [
  ...shapes.map((shape, i): [Token, Token, 'shape'] => [token(shape), token(shapes[(i + 1) % shapes.length]), 'shape']),
  ...shapes.map((shape, i): [Token, Token, 'count'] => [token(shape, 2 + i % 3), token(shape, 3 + i % 3), 'count']),
  ...([[0, 2], [1, 3], [2, 0], [3, 1], [0, 1]] as const).map(([a, b]): [Token, Token, 'turn'] => [token('arrow', 1, a), token('arrow', 1, b), 'turn']),
];
const oddBank = oddSpecs.map(([common, different, attribute], i): PatternPuzzle => {
  const oddIndex = (i * 3 + 1) % 4;
  const cells = Array.from({ length: 4 }, (_, index) => index === oddIndex ? different : common);
  const ruleName = attribute === 'count' ? 'number of objects' : attribute === 'turn' ? 'direction' : 'shape';
  return { id: `odd-${i + 1}`, type: 'odd', family: `odd-${attribute}`,
    prompt: `Which item has a different ${ruleName}?`, instruction: `Three items have the same ${ruleName}. Choose the one that differs. Compare the pictures, not their position numbers.`,
    cells, choices: cells.map((item, index) => ({ id: `item-${index + 1}`, token: item })), correctChoiceId: `item-${oddIndex + 1}`,
    rule: { kind: 'odd', attribute }, explanation: `Three items show ${describeToken(common)}. Item ${oddIndex + 1} shows ${describeToken(different)}, so only its ${ruleName} is different.`,
  };
});
const gridBank = Array.from({ length: 15 }, (_, i) => {
  const mode = Math.floor(i / 5); const columns = mode === 0 ? 2 : 3; const rows = mode === 0 ? 2 : 3;
  const shift = mode === 0 ? 0 : 1; const unit = Array.from({ length: mode === 2 ? 2 : columns }, (_, offset) => token(shapes[(i + offset) % shapes.length]));
  const missing = columns * (rows - 1) + i % columns;
  const at = (index: number) => unit[(Math.floor(index / columns) * shift + index % columns) % unit.length];
  const answer = at(missing);
  return makePuzzle({ id: `grid-${i + 1}`, type: 'grid', family: `grid-${mode}`,
    prompt: 'Which shape belongs in the missing grid cell?',
    instruction: mode === 0 ? 'Read across each row. The second row repeats the first row in the same order.'
      : mode === 1 ? 'Read rows left to right. Each row follows the same three-shape cycle, starting one shape later than the row above.'
        : 'Two shapes alternate across every row and down every column. Read rows left to right and columns top to bottom.',
    cells: Array.from({ length: columns * rows }, (_, index) => index === missing ? null : at(index)),
    rule: { kind: 'grid', rows, columns, shift, unit },
    explanation: `At row ${Math.floor(missing / columns) + 1}, column ${missing % columns + 1}, ${describeToken(answer)} continues the ${mode === 0 ? 'same order as the row above' : mode === 1 ? 'three-shape cycle across rows and columns' : 'alternation across the row and down the column'}.`,
  }, answer);
});
export const patternPuzzles: readonly PatternPuzzle[] = [...repeatBank, ...growthBank, ...oddBank, ...gridBank];

export function expectedPatternAnswer(puzzle: PatternPuzzle): string {
  const rule = puzzle.rule; const missing = puzzle.cells.indexOf(null);
  if (rule.kind === 'odd') {
    const keys = puzzle.cells.map(cell => tokenKey(cell!));
    const index = keys.findIndex(key => keys.filter(value => value === key).length === 1);
    return `item-${index + 1}`;
  }
  if (rule.kind === 'repeat') return tokenKey(rule.unit[missing % rule.unit.length]);
  if (rule.kind === 'count') return tokenKey(token(puzzle.cells[0]!.shape, rule.start + rule.step * missing));
  if (rule.kind === 'turn') return tokenKey(token('arrow', 1, (rule.start + rule.step * missing + 16) % 4));
  return tokenKey(rule.unit[(Math.floor(missing / rule.columns) * rule.shift + missing % rule.columns) % rule.unit.length]);
}
export function patternSignature(puzzle: PatternPuzzle) {
  return `${puzzle.type}:${puzzle.cells.map(cell => cell ? tokenKey(cell) : '?').join('|')}`;
}
function seededRandom(seed: string | number) {
  let value = 2166136261;
  for (const letter of String(seed)) value = Math.imul(value ^ letter.charCodeAt(0), 16777619);
  return () => { value += 0x6D2B79F5; let n = value; n = Math.imul(n ^ n >>> 15, n | 1); n ^= n + Math.imul(n ^ n >>> 7, n | 61); return ((n ^ n >>> 14) >>> 0) / 4294967296; };
}
function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function generatePatternSession(seed: string | number): PatternPuzzle[] {
  const random = seededRandom(seed); const chosen: PatternPuzzle[] = [];
  for (const [type, count] of [['repeat', 3], ['grow', 3], ['odd', 2], ['grid', 2]] as const) {
    const pool = shuffled(patternPuzzles.filter(puzzle => puzzle.type === type), random); const families = new Set<string>();
    for (const puzzle of pool) {
      if (families.has(puzzle.family)) continue;
      families.add(puzzle.family);
      const choices = shuffled(puzzle.choices, random);
      if (puzzle.type === 'odd') {
        const correctPosition = choices.findIndex(choice => choice.id === puzzle.correctChoiceId);
        // Shuffle the actual items too, then number them in reading order. The
        // explanation, text alternatives and answer IDs must describe that order.
        chosen.push({ ...puzzle, cells: choices.map(choice => choice.token),
          choices: choices.map((choice, index) => ({ ...choice, id: `item-${index + 1}` })),
          correctChoiceId: `item-${correctPosition + 1}`,
          explanation: puzzle.explanation.replace(/Item \d+/, `Item ${correctPosition + 1}`),
        });
      } else chosen.push({ ...puzzle, choices });
      if (families.size === count) break;
    }
  }
  return shuffled(chosen, random);
}
