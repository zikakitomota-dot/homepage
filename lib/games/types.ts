export type GameAccess = 'free' | 'premium';

export type GameQuestion = {
  id: string;
  prompt: string;
  choices: readonly string[];
  correctAnswer: string;
  explanation: string;
  illustration?: string;
};

export type EnglishGame = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  seoDescription: string;
  category: 'Grammar';
  level: 1;
  access: GameAccess;
  icon: string;
  instructions: string;
  whatItTeaches: string;
  learningObjective: string;
  parentTip: string;
  questions: readonly GameQuestion[];
};
