export type GameAccess = 'free' | 'premium';
export type GameCategory = 'Grammar' | 'Vocabulary';

export type GameQuestion = {
  id: string;
  prompt: string;
  choices: readonly string[];
  correctAnswer: string;
  explanation: string;
  illustration?: string;
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
};

export type AcademyGameSummary = GameSummary & {
  questionCount: number;
  interaction: 'multipleChoice' | 'visualMultipleChoice' | 'wordOrder';
};
