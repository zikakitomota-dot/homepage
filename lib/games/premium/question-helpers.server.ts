import 'server-only';

import type { AcademyGameSummary, EnglishGame, GameDifficulty, GameQuestion } from '../types';

export type QuestionSeed = {
  prompt: string;
  choices: readonly string[];
  answer: string;
  explanation: string;
  illustration?: string;
  illustrationLabel?: string;
};

export function makeQuestions(slug: string, difficulty: GameDifficulty, seeds: readonly QuestionSeed[]): GameQuestion[] {
  return seeds.map((seed, index) => ({
    id: `${slug}-${difficulty}-${index + 1}`,
    prompt: seed.prompt,
    choices: seed.choices,
    correctAnswer: seed.answer,
    explanation: seed.explanation,
    illustration: seed.illustration,
    illustrationLabel: seed.illustrationLabel,
    difficulty,
  }));
}

export function buildPremiumGame(
  summary: AcademyGameSummary,
  seeds: Record<GameDifficulty, readonly QuestionSeed[]>,
  details: { instructions: string; whatItTeaches: string; parentTip: string },
): EnglishGame {
  const questions = (["easy", "normal", "challenge"] as const).flatMap((difficulty) => makeQuestions(summary.slug, difficulty, seeds[difficulty]));
  return {
    ...summary,
    seoDescription: `${summary.title} is a protected Zalea English Academy game for child-friendly ${summary.category.toLowerCase()} practice.`,
    instructions: details.instructions,
    whatItTeaches: details.whatItTeaches,
    parentTip: details.parentTip,
    questions,
    interaction: summary.interaction,
  };
}

export function rotateChoices(words: readonly string[], correctIndex: number, size: 2 | 3 | 4) {
  const correct = words[correctIndex % words.length];
  const choices = [correct];
  for (let offset = 1; choices.length < size; offset += 1) {
    const candidate = words[(correctIndex + offset * 3) % words.length];
    if (!choices.includes(candidate)) choices.push(candidate);
  }
  return choices.sort((a, b) => a.localeCompare(b));
}

export function auditPremiumGames(games: readonly EnglishGame[]) {
  const slugs = new Set<string>();
  for (const game of games) {
    if (slugs.has(game.slug)) throw new Error(`Duplicate premium game slug: ${game.slug}`);
    slugs.add(game.slug);
    const ids = new Set<string>();
    for (const difficulty of ['easy', 'normal', 'challenge'] as const) {
      const questions = game.questions.filter((question) => question.difficulty === difficulty);
      if (questions.length !== 15) throw new Error(`${game.slug} must have exactly 15 ${difficulty} questions.`);
      const signatures = new Set<string>();
      for (const question of questions) {
        if (ids.has(question.id)) throw new Error(`Duplicate question id: ${question.id}`);
        ids.add(question.id);
        if (!question.prompt.trim() || !question.explanation.trim()) throw new Error(`Incomplete question: ${question.id}`);
        if (question.choices.length < 2 || new Set(question.choices).size !== question.choices.length) throw new Error(`Invalid choices: ${question.id}`);
        if (game.interaction !== 'wordOrder' && !question.choices.includes(question.correctAnswer)) throw new Error(`Missing correct answer: ${question.id}`);
        if (game.interaction === 'wordOrder' && !question.choices.every((choice) => question.correctAnswer.includes(choice))) throw new Error(`Invalid word-order answer: ${question.id}`);
        const signature = JSON.stringify([question.prompt, question.choices, question.illustration]);
        if (signatures.has(signature)) throw new Error(`Repeated ${difficulty} question: ${question.id}`);
        signatures.add(signature);
      }
    }
  }
}
