import { gameDifficulties, type GameDifficulty } from './types';

const LEGACY_STORAGE_KEY = 'zalea-english-game-progress-v1';
const STORAGE_KEY = 'zalea-english-game-progress-v2';
const DIFFICULTY_KEY = 'zalea-english-game-difficulty-v1';

export type DifficultyProgress = { bestScore: number; completed: number };
export type GameProgress = Record<string, Partial<Record<GameDifficulty, DifficultyProgress>>>;

function safeParse(value: string | null): unknown {
  try { return JSON.parse(value ?? '{}'); } catch { return {}; }
}

function migrateLegacyProgress(): GameProgress {
  if (typeof window === 'undefined') return {};
  const legacy = safeParse(window.localStorage.getItem(LEGACY_STORAGE_KEY));
  if (!legacy || typeof legacy !== 'object' || Array.isArray(legacy)) return {};
  return Object.fromEntries(Object.entries(legacy).flatMap(([slug, value]) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return [];
    const result = value as { bestScore?: unknown; completed?: unknown };
    if (typeof result.bestScore !== 'number' || typeof result.completed !== 'number') return [];
    return [[slug, { easy: { bestScore: result.bestScore, completed: result.completed } }]];
  }));
}

export function readProgress(): GameProgress {
  if (typeof window === 'undefined') return {};
  try {
    const stored = safeParse(window.localStorage.getItem(STORAGE_KEY));
    if (stored && typeof stored === 'object' && !Array.isArray(stored) && Object.keys(stored).length > 0) return stored as GameProgress;
    const migrated = migrateLegacyProgress();
    if (Object.keys(migrated).length > 0) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  } catch {
    return {};
  }
}

export function getDifficultyProgress(progress: GameProgress, slug: string, difficulty: GameDifficulty): DifficultyProgress {
  return progress[slug]?.[difficulty] ?? { bestScore: 0, completed: 0 };
}

export function getOverallBestScore(progress: GameProgress, slug: string) {
  return Math.max(0, ...gameDifficulties.map((difficulty) => getDifficultyProgress(progress, slug, difficulty).bestScore));
}

export function readPreferredDifficulty(): GameDifficulty {
  if (typeof window === 'undefined') return 'easy';
  const value = window.localStorage.getItem(DIFFICULTY_KEY);
  return gameDifficulties.includes(value as GameDifficulty) ? value as GameDifficulty : 'easy';
}

export function writePreferredDifficulty(difficulty: GameDifficulty) {
  if (typeof window === 'undefined') return;
  try { window.localStorage.setItem(DIFFICULTY_KEY, difficulty); } catch { /* Playing must still work. */ }
}

export function recordGameResult(slug: string, difficulty: GameDifficulty, score: number) {
  if (typeof window === 'undefined') return;
  const progress = readProgress();
  const current = getDifficultyProgress(progress, slug, difficulty);
  progress[slug] = { ...progress[slug], [difficulty]: { bestScore: Math.max(current.bestScore, score), completed: current.completed + 1 } };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // A full or blocked storage area should never prevent a child from playing.
  }
}
