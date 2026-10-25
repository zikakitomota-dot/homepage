export type WorksheetTopic = 'addition' | 'subtraction' | 'mixed';
export type WorksheetLayout = 'classic' | 'visual' | 'missing-number';
export type WorksheetRange = 10 | 20;
export type WorksheetQuestionCount = 10 | 20 | 30;

export type WorksheetConfig = {
  topic: WorksheetTopic;
  layout: WorksheetLayout;
  range: WorksheetRange;
  questionCount: WorksheetQuestionCount;
  seed: string;
};

export type WorksheetQuestion = {
  id: string;
  operator: '+' | '−';
  first: number;
  second: number;
  answer: number;
  missingValue: number | null;
  prompt: string;
};

export type MathematicsWorksheet = {
  id: string;
  createdAt: string;
  config: WorksheetConfig;
  questions: WorksheetQuestion[];
};

type Pair = { operator: '+' | '−'; first: number; second: number; answer: number };

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: string) {
  let state = hashSeed(seed) || 1;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: readonly T[], random: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const next = Math.floor(random() * (index + 1));
    [result[index], result[next]] = [result[next], result[index]];
  }
  return result;
}

function additionPairs(maximum: WorksheetRange): Pair[] {
  const pairs: Pair[] = [];
  for (let first = 0; first <= maximum; first += 1) {
    for (let second = first; second <= maximum; second += 1) {
      const answer = first + second;
      if (answer >= 1 && answer <= maximum) pairs.push({ operator: '+', first, second, answer });
    }
  }
  return pairs;
}

function subtractionPairs(maximum: WorksheetRange): Pair[] {
  const pairs: Pair[] = [];
  for (let first = 1; first <= maximum; first += 1) {
    for (let second = 0; second <= first; second += 1) {
      pairs.push({ operator: '−', first, second, answer: first - second });
    }
  }
  return pairs;
}

function questionFromPair(pair: Pair, index: number, layout: WorksheetLayout): WorksheetQuestion {
  const missingValue = layout === 'missing-number' ? pair.second : null;
  return {
    id: `${pair.operator === '+' ? 'a' : 's'}-${pair.first}-${pair.second}-${index + 1}`,
    ...pair,
    missingValue,
    prompt: layout === 'missing-number'
      ? `${pair.first} ${pair.operator} __ = ${pair.answer}`
      : `${pair.first} ${pair.operator} ${pair.second} = ____`,
  };
}

export function generateMathematicsWorksheet(config: WorksheetConfig, createdAt = new Date().toISOString()): MathematicsWorksheet {
  const normalizedSeed = config.seed.trim() || 'zalea-maths-level-1';
  const normalized = { ...config, seed: normalizedSeed };
  const random = seededRandom(`${normalizedSeed}|${config.topic}|${config.layout}|${config.range}|${config.questionCount}`);
  const additions = shuffle(additionPairs(config.range), random);
  const subtractions = shuffle(subtractionPairs(config.range), random);
  let selected: Pair[];

  if (config.topic === 'addition') selected = additions.slice(0, config.questionCount);
  else if (config.topic === 'subtraction') selected = subtractions.slice(0, config.questionCount);
  else {
    const additionCount = Math.ceil(config.questionCount / 2);
    selected = shuffle([
      ...additions.slice(0, additionCount),
      ...subtractions.slice(0, config.questionCount - additionCount),
    ], random);
  }

  if (selected.length !== config.questionCount) throw new Error('This worksheet configuration does not have enough unique questions.');
  return {
    id: `maths-l1-${hashSeed(`${normalizedSeed}|${config.topic}|${config.layout}|${config.range}|${config.questionCount}`).toString(36)}`,
    createdAt,
    config: normalized,
    questions: selected.map((pair, index) => questionFromPair(pair, index, config.layout)),
  };
}

export function validateMathematicsWorksheet(worksheet: MathematicsWorksheet) {
  const errors: string[] = [];
  const seen = new Set<string>();
  let additions = 0;
  let subtractions = 0;

  if (worksheet.questions.length !== worksheet.config.questionCount) errors.push('Question count does not match the configuration.');
  worksheet.questions.forEach((question, index) => {
    const expected = question.operator === '+' ? question.first + question.second : question.first - question.second;
    const key = `${question.operator}|${question.operator === '+' ? Math.min(question.first, question.second) : question.first}|${question.operator === '+' ? Math.max(question.first, question.second) : question.second}`;
    if (question.answer !== expected) errors.push(`Question ${index + 1} has an incorrect answer.`);
    if (question.answer < 0) errors.push(`Question ${index + 1} has a negative answer.`);
    if (question.first > worksheet.config.range || question.second > worksheet.config.range || question.answer > worksheet.config.range) errors.push(`Question ${index + 1} exceeds the selected range.`);
    if (seen.has(key)) errors.push(`Question ${index + 1} duplicates an earlier calculation.`);
    seen.add(key);
    if (question.operator === '+') additions += 1; else subtractions += 1;
    if (worksheet.config.layout === 'missing-number' && question.missingValue !== question.second) errors.push(`Question ${index + 1} has an inconsistent missing value.`);
  });
  if (worksheet.config.topic === 'mixed' && Math.abs(additions - subtractions) > 1) errors.push('Mixed worksheet is not balanced.');
  return errors;
}

export function createVariationSeed(currentSeed: string, variation: number) {
  return `${currentSeed.trim() || 'zalea-maths-level-1'}-variation-${variation}`;
}
