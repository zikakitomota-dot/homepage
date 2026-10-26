import { gameRegistry } from './registry';
import type { LearningJourney } from './learning-journey';

export type MissionId = 'maths-explorer' | 'world-explorer' | 'science-detective' | 'english-adventurer';
export type MissionState = 'not-started' | 'in-progress' | 'completed';
export type MissionActivity = {
  id: string;
  kind: 'game' | 'worksheet';
  title: string;
  description: string;
  href: string;
  gameId?: string;
  evidenceId?: string;
};
export type Mission = {
  id: MissionId;
  title: string;
  subject: string;
  shortDescription: string;
  introduction: string;
  icon: string;
  accent: string;
  activities: readonly MissionActivity[];
};

const gameActivity = (gameId: string): MissionActivity => {
  const game = gameRegistry.find((entry) => entry.gameId === gameId && entry.status === 'available' && entry.route);
  if (!game?.route) throw new Error(`Mission references unavailable game: ${gameId}`);
  return { id: game.gameId, kind: 'game', title: game.title, description: game.description, href: game.route, gameId: game.gameId };
};

export const missions: readonly Mission[] = [
  {
    id: 'maths-explorer', title: 'Maths Explorer', subject: 'Mathematics', icon: '🧭', accent: 'blue',
    shortDescription: 'Complete two number adventures and finish a worksheet you prepare.',
    introduction: 'Practise joining and taking away in the games, then use a printable worksheet for an off-screen activity.',
    activities: [
      gameActivity('addition-level-1'),
      gameActivity('subtraction-level-1'),
      { id: 'worksheet', kind: 'worksheet', title: 'Worksheet practice', description: 'Prepare or download a Level 1 worksheet, complete it away from the screen, then confirm here.', href: '/worksheets', evidenceId: 'maths-explorer:worksheet' },
    ],
  },
  {
    id: 'world-explorer', title: 'World Explorer', subject: 'Geography', icon: '🌍', accent: 'sky',
    shortDescription: 'Explore continents, oceans and flags across three geography games.',
    introduction: 'Use map clues, nearby continents, colours and symbols to make connections around the world.',
    activities: [gameActivity('continent-explorer'), gameActivity('ocean-explorer'), gameActivity('flag-detective')],
  },
  {
    id: 'science-detective', title: 'Science Detective', subject: 'Science', icon: '🔎', accent: 'emerald',
    shortDescription: 'Investigate habitats and classify living, non-living and once-living things.',
    introduction: 'Look for evidence about what animals need and what makes something living.',
    activities: [gameActivity('animal-habitats'), gameActivity('living-or-non-living')],
  },
  {
    id: 'english-adventurer', title: 'English Adventurer', subject: 'English', icon: '📚', accent: 'violet',
    shortDescription: 'Practise articles, plurals and pronouns through three short games.',
    introduction: 'Notice sound, number and person clues as you choose the word that completes each sentence.',
    activities: [gameActivity('a-or-an'), gameActivity('one-or-many'), gameActivity('he-she-it')],
  },
] as const;

export function getMission(id: string) {
  return missions.find((mission) => mission.id === id);
}

export function isActivityComplete(activity: MissionActivity, progress: LearningJourney) {
  if (activity.kind === 'game') return (progress.games[activity.gameId!]?.completedSessionCount ?? 0) > 0;
  return progress.missionEvidence.some((entry) => entry.id === activity.evidenceId);
}

export function getMissionProgress(mission: Mission, progress: LearningJourney) {
  const completed = mission.activities.filter((activity) => isActivityComplete(activity, progress)).length;
  const total = mission.activities.length;
  const state: MissionState = completed === 0 ? 'not-started' : completed === total ? 'completed' : 'in-progress';
  const completionDates = mission.activities.flatMap((activity) => {
    if (activity.kind === 'game') return progress.games[activity.gameId!]?.firstCompletedAt ?? [];
    return progress.missionEvidence.find((entry) => entry.id === activity.evidenceId)?.completedAt ?? [];
  }).filter(Boolean).sort();
  return { completed, total, percentage: Math.round((completed / total) * 100), state, completedAt: state === 'completed' ? completionDates.at(-1) ?? progress.updatedAt : null };
}
