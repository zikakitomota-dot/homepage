const STORAGE_KEY = 'zalea-english-game-progress-v1';

export type GameProgress = Record<string, { bestScore: number; completed: number }>;

export function readProgress(): GameProgress {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as GameProgress;
  } catch {
    return {};
  }
}

export function recordGameResult(slug: string, score: number) {
  if (typeof window === 'undefined') return;
  const progress = readProgress();
  const current = progress[slug] ?? { bestScore: 0, completed: 0 };
  progress[slug] = {
    bestScore: Math.max(current.bestScore, score),
    completed: current.completed + 1,
  };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // A full or blocked storage area should never prevent a child from playing.
  }
}
