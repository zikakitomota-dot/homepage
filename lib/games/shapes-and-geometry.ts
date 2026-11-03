export const GEOMETRY_GAME_ID = 'shapes-and-geometry';

export const geometryMechanics = ['name', 'count', 'object', 'symmetry'] as const;
export type GeometryMechanic = typeof geometryMechanics[number];

export const geometryMechanicLabels: Record<GeometryMechanic, string> = {
  name: 'Name the Shape',
  count: 'Count Sides or Corners',
  object: 'Shape in Everyday Objects',
  symmetry: 'Find the Symmetrical Figure',
};

export const supportedShapes = ['circle', 'triangle', 'square', 'rectangle', 'oval', 'star', 'heart', 'diamond', 'pentagon', 'hexagon'] as const;
export type GeometryShape = typeof supportedShapes[number];

export type ShapeFact = {
  sides: number | null;
  corners: number | null;
  description: string;
  explanation: string;
};

export const shapeFacts: Record<GeometryShape, ShapeFact> = {
  circle: { sides: null, corners: null, description: 'a round closed outline with no straight edges or corners', explanation: 'A circle is round all the way around. It has no straight sides and no corners.' },
  triangle: { sides: 3, corners: 3, description: 'a closed outline made from three straight edges meeting at three points', explanation: 'A triangle has three straight sides and three corners.' },
  square: { sides: 4, corners: 4, description: 'a closed four-edged outline whose edges are all the same length', explanation: 'A square has four equal straight sides and four corners.' },
  rectangle: { sides: 4, corners: 4, description: 'a wide closed outline with four straight edges and four square corners', explanation: 'A rectangle has four straight sides and four corners. Opposite sides are the same length.' },
  oval: { sides: null, corners: null, description: 'a stretched round closed outline with no straight edges or corners', explanation: 'An oval is a stretched round shape. It has no straight sides and no corners.' },
  star: { sides: null, corners: null, description: 'a closed outline with five outward points and five inward notches', explanation: 'This is a five-point star. Its points and notches make it easy to recognise.' },
  heart: { sides: null, corners: null, description: 'a closed outline with two rounded humps at the top and one point at the bottom', explanation: 'A heart has two rounded humps at the top and a point at the bottom.' },
  diamond: { sides: 4, corners: 4, description: 'a closed four-edged outline standing on one point, with all four edges the same length', explanation: 'A diamond has four equal straight sides and four corners. In geometry, this kind of shape is also called a rhombus.' },
  pentagon: { sides: 5, corners: 5, description: 'a closed outline made from five straight edges meeting at five points', explanation: 'A pentagon has five straight sides and five corners.' },
  hexagon: { sides: 6, corners: 6, description: 'a closed outline made from six straight edges meeting at six points', explanation: 'A hexagon has six straight sides and six corners.' },
};

export const objectShapes = {
  clock: 'circle', plate: 'circle', 'pizza-slice': 'triangle', pennant: 'triangle', window: 'rectangle', door: 'rectangle',
  tile: 'square', 'sticky-note': 'square', egg: 'oval', mirror: 'oval', 'heart-card': 'heart', 'heart-balloon': 'heart',
  kite: 'diamond', 'road-sign': 'diamond', 'star-badge': 'star',
} as const satisfies Record<string, GeometryShape>;
export type GeometryObject = keyof typeof objectShapes;

export const objectLabels: Record<GeometryObject, string> = {
  clock: 'wall clock', plate: 'round plate', 'pizza-slice': 'pizza slice', pennant: 'triangle pennant', window: 'window', door: 'door',
  tile: 'floor tile', 'sticky-note': 'sticky note', egg: 'egg', mirror: 'oval mirror', 'heart-card': 'heart card', 'heart-balloon': 'heart balloon',
  kite: 'kite', 'road-sign': 'diamond road sign', 'star-badge': 'star badge',
};

export type SymmetryMark = { shape: 'circle' | 'square' | 'triangle' | 'diamond'; side: 'left' | 'right'; y: number; size: number };
export type SymmetryFigure = { id: string; marks: readonly SymmetryMark[] };
export type GeometryChoice = { id: string; label: string; shape?: GeometryShape; figure?: SymmetryFigure };
export type GeometryChallenge = {
  id: string;
  mechanic: GeometryMechanic;
  prompt: string;
  instruction: string;
  explanation: string;
  visual: { kind: 'shape'; shape: GeometryShape } | { kind: 'object'; object: GeometryObject } | { kind: 'symmetry' };
  choices: GeometryChoice[];
  correctChoiceId: string;
  countProperty?: 'sides' | 'corners';
};

const title = (shape: GeometryShape) => shape.charAt(0).toUpperCase() + shape.slice(1);
const shapeChoice = (shape: GeometryShape): GeometryChoice => ({ id: `shape-${shape}`, label: title(shape), shape });

function shapeChoices(answer: GeometryShape, index: number) {
  const alternatives = supportedShapes.filter(shape => shape !== answer);
  return [shapeChoice(answer), ...Array.from({ length: 3 }, (_, offset) => shapeChoice(alternatives[(index * 3 + offset * 2) % alternatives.length]))];
}

const nameSpecs: readonly GeometryShape[] = ['circle', 'triangle', 'square', 'rectangle', 'oval', 'star', 'heart', 'diamond', 'pentagon', 'hexagon', 'circle', 'triangle', 'rectangle', 'heart', 'diamond'];
const nameChallenges = nameSpecs.map((shape, index): GeometryChallenge => ({
  id: `name-${index + 1}`,
  mechanic: 'name',
  prompt: index % 2 === 0 ? 'What shape is this?' : 'Which name matches this outline?',
  instruction: 'Look at the whole outline. Choose the shape name that matches its edges, curves and points.',
  visual: { kind: 'shape', shape },
  choices: shapeChoices(shape, index),
  correctChoiceId: `shape-${shape}`,
  explanation: `${shapeFacts[shape].explanation} That makes the outline a ${shape}.`,
}));

const countSpecs: readonly [GeometryShape, 'sides' | 'corners'][] = [
  ['triangle', 'sides'], ['triangle', 'corners'], ['square', 'sides'], ['square', 'corners'], ['rectangle', 'sides'],
  ['rectangle', 'corners'], ['diamond', 'sides'], ['diamond', 'corners'], ['pentagon', 'sides'], ['pentagon', 'corners'],
  ['hexagon', 'sides'], ['hexagon', 'corners'], ['triangle', 'sides'], ['pentagon', 'corners'], ['hexagon', 'sides'],
];

function numberChoices(answer: number, index: number): GeometryChoice[] {
  const candidates = [answer, Math.max(0, answer - 1), answer + 1, answer === 3 ? 5 : 3 + index % 4];
  const distinct: number[] = [];
  for (const value of candidates) if (!distinct.includes(value)) distinct.push(value);
  for (let value = 0; distinct.length < 4; value++) if (!distinct.includes(value)) distinct.push(value);
  return distinct.slice(0, 4).map(value => ({ id: `number-${value}`, label: String(value) }));
}

const countChallenges = countSpecs.map(([shape, property], index): GeometryChallenge => {
  const answer = shapeFacts[shape][property]!;
  return {
    id: `count-${index + 1}`,
    mechanic: 'count',
    prompt: `How many ${property} does this ${shape} have?`,
    instruction: property === 'sides' ? 'Trace each straight edge once, then choose the total.' : 'Count each point where two straight sides meet.',
    visual: { kind: 'shape', shape },
    choices: numberChoices(answer, index),
    correctChoiceId: `number-${answer}`,
    countProperty: property,
    explanation: `${title(shape)}: ${shapeFacts[shape].explanation} So it has ${answer} ${property}.`,
  };
});

const objectSpecs = Object.keys(objectShapes) as GeometryObject[];
const objectChallenges = objectSpecs.map((object, index): GeometryChallenge => {
  const answer = objectShapes[object];
  return {
    id: `object-${index + 1}`,
    mechanic: 'object',
    prompt: `Which shape best matches this ${objectLabels[object]}?`,
    instruction: 'Ignore small decorations and look at the main outside outline of the object.',
    visual: { kind: 'object', object },
    choices: shapeChoices(answer, index + 4),
    correctChoiceId: `shape-${answer}`,
    explanation: `The main outline of the ${objectLabels[object]} matches a ${answer}. ${shapeFacts[answer].explanation}`,
  };
});

const symmetryShapes: readonly SymmetryMark['shape'][] = ['circle', 'square', 'triangle', 'diamond'];

function symmetryFigure(questionIndex: number, optionIndex: number, correct: boolean): SymmetryFigure {
  const first = symmetryShapes[(questionIndex + optionIndex) % symmetryShapes.length];
  const second = symmetryShapes[(questionIndex + optionIndex + 1) % symmetryShapes.length];
  const firstY = 31 + (questionIndex % 3) * 4;
  const secondY = 76 - (questionIndex % 4) * 3;
  const marks: SymmetryMark[] = [
    { shape: first, side: 'left', y: firstY, size: 12 },
    { shape: second, side: 'left', y: secondY, size: 9 },
    { shape: first, side: 'right', y: correct || optionIndex !== 1 ? firstY : firstY + 13, size: 12 },
    { shape: correct || optionIndex !== 2 ? second : first, side: 'right', y: secondY, size: correct || optionIndex !== 3 ? 9 : 5 },
  ];
  if (!correct && optionIndex === 0) marks.pop();
  return { id: `symmetry-${questionIndex + 1}-figure-${optionIndex + 1}`, marks };
}

export function isSymmetricalFigure(figure: SymmetryFigure) {
  const key = (mark: SymmetryMark) => `${mark.shape}:${mark.y}:${mark.size}`;
  const left = figure.marks.filter(mark => mark.side === 'left').map(key).sort();
  const right = figure.marks.filter(mark => mark.side === 'right').map(key).sort();
  return left.length > 0 && left.length === right.length && left.every((value, index) => value === right[index]);
}

const symmetryChallenges = Array.from({ length: 15 }, (_, index): GeometryChallenge => {
  const correctPosition = (index * 3 + 1) % 4;
  const choices = Array.from({ length: 4 }, (_, optionIndex): GeometryChoice => ({
    id: `symmetry-${index + 1}-option-${optionIndex + 1}`,
    label: `Figure ${optionIndex + 1}`,
    figure: symmetryFigure(index, optionIndex, optionIndex === correctPosition),
  }));
  return {
    id: `symmetry-${index + 1}`,
    mechanic: 'symmetry',
    prompt: 'Which figure is symmetrical across the dotted line?',
    instruction: 'Imagine folding on the vertical dotted line. Choose the figure whose marks would meet in matching places.',
    visual: { kind: 'symmetry' },
    choices,
    correctChoiceId: choices[correctPosition].id,
    explanation: 'The matching figure has the same shapes, sizes and heights on both sides of the dotted line. Its two halves would meet if it were folded on that line.',
  };
});

export const geometryChallenges: readonly GeometryChallenge[] = [...nameChallenges, ...countChallenges, ...objectChallenges, ...symmetryChallenges];

function seededRandom(seed: string | number) {
  let value = 2166136261;
  for (const character of String(seed)) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  return () => { value += 0x6D2B79F5; let number = value; number = Math.imul(number ^ number >>> 15, number | 1); number ^= number + Math.imul(number ^ number >>> 7, number | 61); return ((number ^ number >>> 14) >>> 0) / 4294967296; };
}

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) { const other = Math.floor(random() * (index + 1)); [result[index], result[other]] = [result[other], result[index]]; }
  return result;
}

export function generateGeometrySession(seed: string | number): GeometryChallenge[] {
  const random = seededRandom(seed);
  const distribution: ReadonlyArray<readonly [GeometryMechanic, number]> = [['name', 3], ['count', 3], ['object', 2], ['symmetry', 2]];
  const selected = distribution.flatMap(([mechanic, count]) => shuffled(geometryChallenges.filter(challenge => challenge.mechanic === mechanic), random).slice(0, count));
  return shuffled(selected.map(challenge => ({
    ...challenge,
    choices: shuffled(challenge.choices, random).map((choice, index) => challenge.mechanic === 'symmetry' ? { ...choice, label: `Figure ${index + 1}` } : choice),
  })), random);
}
