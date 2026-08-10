import 'server-only';

import { grammarPremiumGames } from './grammar.server';
import { auditPremiumGames } from './question-helpers.server';
import { vocabularyPremiumGames } from './vocabulary.server';

export const premiumEnglishGames = [...grammarPremiumGames, ...vocabularyPremiumGames];
auditPremiumGames(premiumEnglishGames);

export function getPremiumEnglishGame(slug: string) {
  return premiumEnglishGames.find((game) => game.slug === slug);
}

export const premiumQuestionCountReport = premiumEnglishGames.map((game) => ({
  game: game.title,
  slug: game.slug,
  easy: game.questions.filter((question) => question.difficulty === 'easy').length,
  normal: game.questions.filter((question) => question.difficulty === 'normal').length,
  challenge: game.questions.filter((question) => question.difficulty === 'challenge').length,
  total: game.questions.length,
}));
