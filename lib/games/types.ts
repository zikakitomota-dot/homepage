export type GameAccess = 'free' | 'premium';
export type GameCategory = 'Grammar' | 'Vocabulary';
export type GameDifficulty = 'easy' | 'normal' | 'challenge';

export const gameDifficulties = ['easy', 'normal', 'challenge'] as const satisfies readonly GameDifficulty[];

export type GameQuestion = {
  id: string;
  prompt: string;
  choices: readonly string[];
  correctAnswer: string;
  explanation: string;
  illustration?: string;
  illustrationLabel?: string;
  difficulty: GameDifficulty;
};

export type GameSummary = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: GameCategory;
  level: 1 | 2;
  access: GameAccess;
  icon: string;
  learningObjective: string;
};

export type EnglishGame = GameSummary & {
  seoDescription: string;
  instructions: string;
  whatItTeaches: string;
  parentTip: string;
  questions: readonly GameQuestion[];
  interaction?: AcademyGameSummary['interaction'];
};

export type AcademyGameSummary = GameSummary & {
  questionCount: number;
  difficultyQuestionCounts: Record<GameDifficulty, number>;
  interaction: 'multipleChoice' | 'visualMultipleChoice' | 'wordOrder';
};
