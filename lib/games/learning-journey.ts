import { gameRegistry, subjectOrder, type GameRegistryEntry } from './registry';

export const LEARNING_JOURNEY_VERSION = 2 as const;
export const LEARNING_JOURNEY_STORAGE_KEY = 'zalea-learning-journey-v1';
export const LEARNING_JOURNEY_EVENT = 'zalea-learning-journey-changed';
export const MAX_IMPORT_BYTES = 256 * 1024;

export type SubjectId = GameRegistryEntry['subjectId'];

export type BestScore = {
  correct: number;
  questions: number;
  percentage: number;
};

export type JourneyGameProgress = {
  gameId: string;
  subjectId: SubjectId;
  sessionCount: number;
  completedSessionCount: number;
  totalCorrectAnswers: number;
  totalQuestionsAttempted: number;
  personalBest: BestScore | null;
  lastPlayedAt: string | null;
  firstCompletedAt: string | null;
};

export type EarnedAchievement = { id: AchievementId; earnedAt: string };
export type RecordedSession = { id: string; gameId: string; completed: boolean };
export type MissionEvidence = { id: string; completedAt: string };

export type LearningJourney = {
  version: typeof LEARNING_JOURNEY_VERSION;
  updatedAt: string;
  games: Record<string, JourneyGameProgress>;
  achievements: EarnedAchievement[];
  recordedSessions: RecordedSession[];
  missionEvidence: MissionEvidence[];
};

export type AchievementId = 'first-adventure' | 'curious-explorer' | 'subject-explorer' | 'perfect-round' | 'keep-practising' | 'world-explorer';

export const achievementDefinitions: ReadonlyArray<{ id: AchievementId; name: string; description: string; icon: string }> = [
  { id: 'first-adventure', name: 'First Adventure', description: 'Complete your first game.', icon: '🌟' },
  { id: 'curious-explorer', name: 'Curious Explorer', description: 'Try three different games.', icon: '🔎' },
  { id: 'subject-explorer', name: 'Subject Explorer', description: 'Try every available game in one subject.', icon: '📚' },
  { id: 'perfect-round', name: 'Perfect Round', description: 'Score 100% in a completed session.', icon: '🏆' },
  { id: 'keep-practising', name: 'Keep Practising', description: 'Complete ten sessions.', icon: '💪' },
  { id: 'world-explorer', name: 'World Explorer', description: 'Complete three different Geography games.', icon: '🌍' },
] as const;

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
type MutationResult = { progress: LearningJourney; newlyEarned: AchievementId[]; saved: boolean };

const availableGames = gameRegistry.filter((game) => game.status === 'available' && game.route);
const availableById = new Map(availableGames.map((game) => [game.gameId, game]));

export function createEmptyJourney(now = new Date().toISOString()): LearningJourney {
  return { version: LEARNING_JOURNEY_VERSION, updatedAt: now, games: {}, achievements: [], recordedSessions: [], missionEvidence: [] };
}

const allowedMissionEvidence = new Set(['maths-explorer:worksheet']);

function finiteInteger(value: unknown, max = 1_000_000) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.min(max, Math.floor(value)) : 0;
}

function validDate(value: unknown): string | null {
  return typeof value === 'string' && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;
}

function sanitizeBestScore(value: unknown): BestScore | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const questions = finiteInteger(source.questions, 10_000);
  const correct = Math.min(questions, finiteInteger(source.correct, 10_000));
  if (questions < 1) return null;
  return { correct, questions, percentage: Math.round((correct / questions) * 100) };
}

export function sanitizeJourney(value: unknown): LearningJourney | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  if (source.version === 0 && source.games && typeof source.games === 'object' && !Array.isArray(source.games)) {
    const migratedGames = Object.fromEntries(Object.entries(source.games as Record<string, unknown>).flatMap(([gameId, raw]) => {
      const registryGame = availableById.get(gameId);
      if (!registryGame || !raw || typeof raw !== 'object' || Array.isArray(raw)) return [];
      const item = raw as Record<string, unknown>;
      const sessionCount = finiteInteger(item.plays);
      const completedSessionCount = Math.min(sessionCount, finiteInteger(item.completions));
      const questions = finiteInteger(item.bestQuestions, 10_000);
      const correct = Math.min(questions, finiteInteger(item.bestCorrect, 10_000));
      return [[gameId, {
        gameId, subjectId: registryGame.subjectId, sessionCount, completedSessionCount,
        totalCorrectAnswers: 0, totalQuestionsAttempted: 0,
        personalBest: questions > 0 ? { correct, questions, percentage: Math.round((correct / questions) * 100) } : null,
        lastPlayedAt: null, firstCompletedAt: null,
      }]];
    }));
    return sanitizeJourney({ version: LEARNING_JOURNEY_VERSION, updatedAt: source.updatedAt, games: migratedGames, achievements: [], recordedSessions: [], missionEvidence: [] });
  }
  if (source.version !== 1 && source.version !== LEARNING_JOURNEY_VERSION || !source.games || typeof source.games !== 'object' || Array.isArray(source.games)) return null;
  const now = new Date().toISOString();
  const games: Record<string, JourneyGameProgress> = {};
  for (const [gameId, raw] of Object.entries(source.games as Record<string, unknown>)) {
    const registryGame = availableById.get(gameId);
    if (!registryGame || !raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const item = raw as Record<string, unknown>;
    const sessionCount = finiteInteger(item.sessionCount);
    const completedSessionCount = Math.min(sessionCount, finiteInteger(item.completedSessionCount));
    const totalQuestionsAttempted = finiteInteger(item.totalQuestionsAttempted, 10_000_000);
    games[gameId] = {
      gameId,
      subjectId: registryGame.subjectId,
      sessionCount,
      completedSessionCount,
      totalCorrectAnswers: Math.min(totalQuestionsAttempted, finiteInteger(item.totalCorrectAnswers, 10_000_000)),
      totalQuestionsAttempted,
      personalBest: sanitizeBestScore(item.personalBest),
      lastPlayedAt: validDate(item.lastPlayedAt),
      firstCompletedAt: validDate(item.firstCompletedAt),
    };
  }
  const achievements = Array.isArray(source.achievements) ? source.achievements.flatMap((raw) => {
    if (!raw || typeof raw !== 'object') return [];
    const item = raw as Record<string, unknown>;
    const definition = achievementDefinitions.find((entry) => entry.id === item.id);
    const earnedAt = validDate(item.earnedAt);
    return definition && earnedAt ? [{ id: definition.id, earnedAt }] : [];
  }).filter((entry, index, all) => all.findIndex((candidate) => candidate.id === entry.id) === index) : [];
  const recordedSessions = Array.isArray(source.recordedSessions) ? source.recordedSessions.flatMap((raw) => {
    if (!raw || typeof raw !== 'object') return [];
    const item = raw as Record<string, unknown>;
    return typeof item.id === 'string' && item.id.length <= 100 && typeof item.gameId === 'string' && availableById.has(item.gameId) && typeof item.completed === 'boolean'
      ? [{ id: item.id, gameId: item.gameId, completed: item.completed }]
      : [];
  }).slice(-250) : [];
  const missionEvidence = Array.isArray(source.missionEvidence) ? source.missionEvidence.flatMap((raw) => {
    if (!raw || typeof raw !== 'object') return [];
    const item = raw as Record<string, unknown>;
    const completedAt = validDate(item.completedAt);
    return typeof item.id === 'string' && allowedMissionEvidence.has(item.id) && completedAt ? [{ id: item.id, completedAt }] : [];
  }).filter((entry, index, all) => all.findIndex((candidate) => candidate.id === entry.id) === index) : [];
  const result: LearningJourney = { version: LEARNING_JOURNEY_VERSION, updatedAt: validDate(source.updatedAt) ?? now, games, achievements, recordedSessions, missionEvidence };
  const verifiedAchievements = new Set(getEarnedAchievementIds({ ...result, achievements: [] }));
  result.achievements = result.achievements.filter((entry) => verifiedAchievements.has(entry.id));
  return result;
}

function getStorage(storage?: StorageLike): StorageLike | null {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch { return null; }
}

export function readLearningJourney(storage?: StorageLike): LearningJourney {
  const target = getStorage(storage);
  if (!target) return createEmptyJourney();
  try {
    const raw = target.getItem(LEARNING_JOURNEY_STORAGE_KEY);
    if (!raw) return createEmptyJourney();
    return sanitizeJourney(JSON.parse(raw)) ?? createEmptyJourney();
  } catch { return createEmptyJourney(); }
}

function saveJourney(progress: LearningJourney, storage?: StorageLike) {
  const target = getStorage(storage);
  if (!target) return false;
  try {
    target.setItem(LEARNING_JOURNEY_STORAGE_KEY, JSON.stringify(progress));
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(LEARNING_JOURNEY_EVENT));
    return true;
  } catch { return false; }
}

export function getEarnedAchievementIds(progress: LearningJourney): AchievementId[] {
  const tried = Object.values(progress.games).filter((game) => game.sessionCount > 0);
  const completed = Object.values(progress.games).filter((game) => game.completedSessionCount > 0);
  const totalCompleted = completed.reduce((sum, game) => sum + game.completedSessionCount, 0);
  const wholeSubjectTried = subjectOrder.some((subjectId) => {
    const available = availableGames.filter((game) => game.subjectId === subjectId);
    return available.length > 0 && available.every((game) => progress.games[game.gameId]?.sessionCount > 0);
  });
  const ids: AchievementId[] = [];
  if (totalCompleted >= 1) ids.push('first-adventure');
  if (tried.length >= 3) ids.push('curious-explorer');
  if (wholeSubjectTried) ids.push('subject-explorer');
  if (completed.some((game) => game.personalBest?.percentage === 100)) ids.push('perfect-round');
  if (totalCompleted >= 10) ids.push('keep-practising');
  if (completed.filter((game) => game.subjectId === 'geography').length >= 3) ids.push('world-explorer');
  return ids;
}

function applyAchievements(progress: LearningJourney, now: string) {
  const previouslyEarned = new Set(progress.achievements.map((entry) => entry.id));
  const newlyEarned = getEarnedAchievementIds(progress).filter((id) => !previouslyEarned.has(id));
  progress.achievements.push(...newlyEarned.map((id) => ({ id, earnedAt: now })));
  return newlyEarned;
}

export function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return `session-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function recordLearningSessionStart(gameId: string, sessionId: string, storage?: StorageLike, now = new Date().toISOString()): MutationResult | null {
  const registryGame = availableById.get(gameId);
  if (!registryGame || !sessionId || sessionId.length > 100) return null;
  const progress = readLearningJourney(storage);
  if (progress.recordedSessions.some((session) => session.id === sessionId)) return { progress, newlyEarned: [], saved: true };
  const current = progress.games[gameId] ?? {
    gameId, subjectId: registryGame.subjectId, sessionCount: 0, completedSessionCount: 0, totalCorrectAnswers: 0,
    totalQuestionsAttempted: 0, personalBest: null, lastPlayedAt: null, firstCompletedAt: null,
  };
  progress.games[gameId] = { ...current, sessionCount: current.sessionCount + 1, lastPlayedAt: now };
  progress.recordedSessions = [...progress.recordedSessions, { id: sessionId, gameId, completed: false }].slice(-250);
  progress.updatedAt = now;
  const newlyEarned = applyAchievements(progress, now);
  return { progress, newlyEarned, saved: saveJourney(progress, storage) };
}

export function recordLearningSessionCompletion(gameId: string, sessionId: string, correct: number, questions: number, storage?: StorageLike, now = new Date().toISOString()): MutationResult | null {
  const total = finiteInteger(questions, 10_000);
  if (!availableById.has(gameId) || total < 1) return null;
  const score = Math.min(total, finiteInteger(correct, total));
  const progress = readLearningJourney(storage);
  const session = progress.recordedSessions.find((entry) => entry.id === sessionId && entry.gameId === gameId);
  if (!session || session.completed) return { progress, newlyEarned: [], saved: true };
  session.completed = true;
  const current = progress.games[gameId];
  if (!current) return null;
  const candidate = { correct: score, questions: total, percentage: Math.round((score / total) * 100) };
  const personalBest = !current.personalBest || candidate.percentage > current.personalBest.percentage || (candidate.percentage === current.personalBest.percentage && candidate.correct > current.personalBest.correct) ? candidate : current.personalBest;
  progress.games[gameId] = {
    ...current,
    completedSessionCount: current.completedSessionCount + 1,
    totalCorrectAnswers: current.totalCorrectAnswers + score,
    totalQuestionsAttempted: current.totalQuestionsAttempted + total,
    personalBest,
    firstCompletedAt: current.firstCompletedAt ?? now,
    lastPlayedAt: now,
  };
  progress.updatedAt = now;
  const newlyEarned = applyAchievements(progress, now);
  return { progress, newlyEarned, saved: saveJourney(progress, storage) };
}

export function clearLearningJourney(storage?: StorageLike) {
  return saveJourney(createEmptyJourney(), storage);
}

export function setMissionEvidence(id: string, completed: boolean, storage?: StorageLike, now = new Date().toISOString()) {
  if (!allowedMissionEvidence.has(id)) return null;
  const progress = readLearningJourney(storage);
  const exists = progress.missionEvidence.some((entry) => entry.id === id);
  if (exists === completed) return { progress, saved: true };
  progress.missionEvidence = completed
    ? [...progress.missionEvidence, { id, completedAt: now }]
    : progress.missionEvidence.filter((entry) => entry.id !== id);
  progress.updatedAt = now;
  return { progress, saved: saveJourney(progress, storage) };
}

export function exportLearningJourney(progress: LearningJourney) {
  return JSON.stringify(sanitizeJourney(progress) ?? createEmptyJourney(), null, 2);
}

export function parseLearningJourneyImport(text: string): LearningJourney {
  if (new TextEncoder().encode(text).length > MAX_IMPORT_BYTES) throw new Error('The progress file is larger than 256 KB.');
  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new Error('This is not a valid JSON progress file.'); }
  const progress = sanitizeJourney(parsed);
  if (!progress) throw new Error(`This file does not use supported progress schema version ${LEARNING_JOURNEY_VERSION}.`);
  return progress;
}

export function mergeLearningJourneys(current: LearningJourney, incoming: LearningJourney, now = new Date().toISOString()): LearningJourney {
  const merged = createEmptyJourney(now);
  for (const game of availableGames) {
    const a = current.games[game.gameId];
    const b = incoming.games[game.gameId];
    if (!a && !b) continue;
    const values = [a, b].filter(Boolean) as JourneyGameProgress[];
    const best = values.map((item) => item.personalBest).filter(Boolean).sort((x, y) => y!.percentage - x!.percentage || y!.correct - x!.correct)[0] ?? null;
    const dates = values.map((item) => item.lastPlayedAt).filter(Boolean).sort();
    const firstDates = values.map((item) => item.firstCompletedAt).filter(Boolean).sort();
    merged.games[game.gameId] = {
      gameId: game.gameId, subjectId: game.subjectId,
      sessionCount: Math.max(...values.map((item) => item.sessionCount)),
      completedSessionCount: Math.max(...values.map((item) => item.completedSessionCount)),
      totalCorrectAnswers: Math.max(...values.map((item) => item.totalCorrectAnswers)),
      totalQuestionsAttempted: Math.max(...values.map((item) => item.totalQuestionsAttempted)),
      personalBest: best,
      lastPlayedAt: dates.at(-1) ?? null,
      firstCompletedAt: firstDates[0] ?? null,
    };
  }
  const earnedAt = new Map([...current.achievements, ...incoming.achievements].map((entry) => [entry.id, entry.earnedAt]));
  merged.achievements = getEarnedAchievementIds(merged).map((id) => ({ id, earnedAt: earnedAt.get(id) ?? now }));
  merged.recordedSessions = [...current.recordedSessions, ...incoming.recordedSessions].filter((entry, index, all) => all.findIndex((candidate) => candidate.id === entry.id) === index).slice(-250);
  merged.missionEvidence = [...current.missionEvidence, ...incoming.missionEvidence]
    .filter((entry, index, all) => all.findIndex((candidate) => candidate.id === entry.id) === index);
  return merged;
}

export function importLearningJourney(incoming: LearningJourney, mode: 'replace' | 'merge', storage?: StorageLike) {
  const next = mode === 'merge' ? mergeLearningJourneys(readLearningJourney(storage), incoming) : incoming;
  return { progress: next, saved: saveJourney(next, storage) };
}

export function getSuggestedGame(progress: LearningJourney) {
  const tried = Object.values(progress.games).filter((game) => game.sessionCount > 0).sort((a, b) => Date.parse(b.lastPlayedAt ?? '') - Date.parse(a.lastPlayedAt ?? ''));
  const recentSubject = tried[0]?.subjectId;
  const untried = availableGames.filter((game) => !progress.games[game.gameId]?.sessionCount);
  return untried.find((game) => game.subjectId === recentSubject) ?? untried[0] ?? availableGames
    .filter((game) => progress.games[game.gameId])
    .sort((a, b) => (progress.games[a.gameId].personalBest?.percentage ?? 0) - (progress.games[b.gameId].personalBest?.percentage ?? 0))[0] ?? null;
}
