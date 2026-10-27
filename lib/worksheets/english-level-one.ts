import { englishGames } from '../games/english-games';

export const englishWorksheetTopics = [
  'a-or-an', 'one-or-many', 'he-she-it', 'is-am-are', 'can-or-cant',
  'who-is-it', 'whose-is-it', 'where-is-it', 'this-that-these-those', 'has-or-have',
] as const;

export type EnglishWorksheetTopic = (typeof englishWorksheetTopics)[number] | 'mixed';
export type EnglishWorksheetLayout = 'fill-blank' | 'choose-correct' | 'mixed-practice';
export type EnglishWorksheetQuestionCount = 10 | 20 | 30;

export type EnglishWorksheetConfig = {
  topic: EnglishWorksheetTopic;
  layout: EnglishWorksheetLayout;
  questionCount: EnglishWorksheetQuestionCount;
  seed: string;
};

export type EnglishWorksheetQuestion = {
  id: string;
  sourceId: string;
  topic: Exclude<EnglishWorksheetTopic, 'mixed'>;
  topicTitle: string;
  prompt: string;
  choices: readonly string[];
  answer: string;
  explanation: string;
  format: 'fill-blank' | 'choose-correct';
};

export type EnglishWorksheet = {
  id: string;
  createdAt: string;
  config: EnglishWorksheetConfig;
  questions: EnglishWorksheetQuestion[];
};

const gameByTopic = new Map(englishGames.map((game) => [game.slug, game]));

// Worksheet-only clarifications: keep the interactive game banks unchanged.
const positionClues: Record<string, string> = {
  in: 'inside', on: 'touching the top or surface', under: 'below',
  behind: 'at the back', 'in front of': 'before the front', 'next to': 'beside',
};
const excludedPrompts = new Set([
  'Nora waters the plant because ___ looks dry.',
  'Mei puts on her coat because ___ is cold.',
  'A bird lands beside Ben. ___ watches it quietly.',
  'The kitten follows Ava because ___ has food. Who does the blank describe?',
]);

function worksheetSourceQuestions(topic: (typeof englishWorksheetTopics)[number]) {
  const game = gameByTopic.get(topic)!;
  return game.questions.filter((question) => !excludedPrompts.has(question.prompt)).map((question) => {
    let prompt = question.prompt.replace('🐶', 'one dog');
    let explanation = question.explanation;
    explanation = explanation.replace(/([.!?]\s+)(he|she|it|we|they|this|that|these|those)\b/g, (_match, punctuation: string, word: string) => punctuation + word[0].toUpperCase() + word.slice(1));
    explanation = explanation.replace('Puppies is plural', 'The noun “puppies” is plural');
    if (topic === 'where-is-it') {
      const clue = positionClues[question.correctAnswer];
      prompt = `Position clue: ${clue}. ${prompt}`;
      explanation = `The clue means “${question.correctAnswer}”: ${clue}.`;
    }
    if (question.id === 'have-challenge-extra-2') {
      prompt = 'Mia ___ a kite, and her friends have one too. Fill the blank.';
    }
    if (question.id === 'ability-1') {
      prompt = 'A sparrow ___ fly.';
      explanation = 'A sparrow can fly. Use “can” for this ability.';
    }
    if (topic === 'can-or-cant' && /Ben ___ tie|Mia ___ draw/.test(prompt)) {
      prompt = `After learning and practising, ${prompt}`;
    }
    return { ...question, prompt, explanation };
  });
}

export const englishTopicOptions = englishWorksheetTopics.map((slug) => {
  const game = gameByTopic.get(slug)!;
  return { value: slug, label: game.title };
});

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

function questionsForTopic(topic: (typeof englishWorksheetTopics)[number], layout: EnglishWorksheetLayout, count: number, random: () => number, usedPrompts = new Set<string>()) {
  const game = gameByTopic.get(topic);
  if (!game) throw new Error(`Unknown English worksheet topic: ${topic}`);
  const source = worksheetSourceQuestions(topic);
  const unique = source.filter((question, index, all) => all.findIndex((candidate) => candidate.prompt === question.prompt) === index);
  const eligible = unique.filter((question) => !usedPrompts.has(question.prompt));
  if (eligible.length < count) throw new Error(`${game.title} has only ${eligible.length} eligible questions for ${layout}; ${count} required.`);
  const selected = shuffle(eligible, random).slice(0, count);
  selected.forEach((question) => usedPrompts.add(question.prompt));
  return selected.map((question, index): EnglishWorksheetQuestion => ({
    id: `${topic}-${question.id}-${index + 1}`,
    sourceId: question.id,
    topic,
    topicTitle: game.title,
    prompt: layout === 'fill-blank' && !question.prompt.includes('___') ? `${question.prompt} Options: [${question.choices.join(' / ')}]. Write the answer: ___.` : question.prompt,
    choices: question.choices,
    answer: question.correctAnswer,
    explanation: question.explanation,
    format: layout === 'fill-blank' ? 'fill-blank' : layout === 'choose-correct' ? 'choose-correct' : question.prompt.includes('___') && index % 2 === 0 ? 'fill-blank' : 'choose-correct',
  }));
}

export function createEnglishVariationSeed(seed: string, variation: number) {
  return `${seed.trim() || 'zalea-english'}-v${variation}`;
}

export function generateEnglishWorksheet(config: EnglishWorksheetConfig, createdAt = new Date().toISOString()): EnglishWorksheet {
  const random = seededRandom(`${config.topic}|${config.layout}|${config.questionCount}|${config.seed}`);
  let questions: EnglishWorksheetQuestion[];
  if (config.topic === 'mixed') {
    const orderedTopics = shuffle(englishWorksheetTopics, random);
    const base = Math.floor(config.questionCount / orderedTopics.length);
    const remainder = config.questionCount % orderedTopics.length;
    const usedPrompts = new Set<string>();
    questions = orderedTopics.flatMap((topic, index) => questionsForTopic(topic, config.layout, base + (index < remainder ? 1 : 0), random, usedPrompts));
    questions = shuffle(questions, random);
  } else {
    questions = questionsForTopic(config.topic, config.layout, config.questionCount, random);
  }
  const fingerprint = hashSeed(JSON.stringify({ config, questions })).toString(36);
  return { id: `english-l1-${fingerprint}`, createdAt, config: { ...config }, questions };
}

export function validateEnglishWorksheet(worksheet: EnglishWorksheet) {
  const errors: string[] = [];
  if (worksheet.questions.length !== worksheet.config.questionCount) errors.push('Question count does not match configuration.');
  if (new Set(worksheet.questions.map((question) => question.id)).size !== worksheet.questions.length) errors.push('Question IDs are not unique.');
  if (new Set(worksheet.questions.map((question) => `${question.topic}|${question.sourceId}`)).size !== worksheet.questions.length) errors.push('A source question is repeated.');
  if (new Set(worksheet.questions.map((question) => question.prompt)).size !== worksheet.questions.length) errors.push('A prompt is repeated.');
  worksheet.questions.forEach((question) => {
    if (!question.prompt.trim()) errors.push(`${question.id}: prompt is empty.`);
    if (!question.choices.includes(question.answer)) errors.push(`${question.id}: answer is not one of the reviewed choices.`);
    if (new Set(question.choices).size !== question.choices.length) errors.push(`${question.id}: choices are duplicated.`);
    if (question.format === 'fill-blank' && !question.prompt.includes('___')) errors.push(`${question.id}: fill-in question has no blank.`);
  });
  if (worksheet.config.topic === 'mixed') {
    const counts = englishWorksheetTopics.map((topic) => worksheet.questions.filter((question) => question.topic === topic).length);
    if (Math.max(...counts) - Math.min(...counts) > 1) errors.push('Mixed worksheet topic balance differs by more than one question.');
  }
  return errors;
}
