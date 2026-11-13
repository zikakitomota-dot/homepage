import audioData from './sounds.json';
export const difficulties = ['beginner', 'intermediate', 'challenge'] as const;
export type SoundDifficulty = typeof difficulties[number];
export type Sound = {
  id: string; name: string; label: string; category: string; description: string; path: string; duration: number; format: string;
  sourceUrl: string; sourceTitle: string; creator: string; licence: string; licenceUrl: string; attribution: string; changes: string;
  verification: string; difficulty: SoundDifficulty[]; ambiguity: string; icon: string;
};
export const sounds: readonly Sound[] = audioData as Sound[];
export const soundById = Object.fromEntries(sounds.map(sound => [sound.id, sound])) as Record<string, Sound>;
export const difficultyLabels: Record<SoundDifficulty, string> = { beginner: 'Permulaan', intermediate: 'Pertengahan', challenge: 'Cabaran' };
export type ListeningQuestion = { id: string; soundIds: string[]; correctId: string; choices: string[]; prompt: string; explanation: string; kind: 'single' | 'sequence' };
export function seededRandom(seed: string) {
  let state = 2166136261;
  for (const char of seed) state = Math.imul(state ^ char.charCodeAt(0), 16777619);
  return () => { state += 0x6D2B79F5; let t = state; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
export function shuffled<T>(values: readonly T[], random: () => number): T[] {
  const result = [...values]; for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; } return result;
}
export function createSoundSession(mode: SoundDifficulty, seed: string): ListeningQuestion[] {
  const random = seededRandom(seed);
  const pool = sounds.filter(sound => sound.difficulty.includes(mode));
  // Round-robin across categories before repeating one category.
  const categories = shuffled(Array.from(new Set(pool.map(sound => sound.category))), random);
  const groups = categories.map(category => shuffled(pool.filter(sound => sound.category === category), random));
  const ordered: Sound[] = [];
  while (groups.some(group => group.length)) for (const group of groups) { const sound = group.shift(); if (sound) ordered.push(sound); }
  const count = mode === 'beginner' ? 8 : 10;
  return ordered.slice(0, count).map((sound, index) => {
    const sequence = mode === 'challenge' && index >= 6;
    const first = sequence && index % 2 === 0;
    const other = ordered[(index + 3) % ordered.length];
    const soundIds = sequence ? first ? [sound.id, other.id] : [other.id, sound.id] : [sound.id];
    let distractors = pool.filter(candidate => candidate.id !== sound.id);
    if (mode === 'beginner') distractors = distractors.filter(candidate => candidate.category !== sound.category);
    else distractors = [...shuffled(distractors.filter(candidate => candidate.category === sound.category), random), ...shuffled(distractors.filter(candidate => candidate.category !== sound.category), random)];
    const choices = shuffled([sound.id, ...(mode === 'beginner' ? shuffled(distractors, random) : distractors).slice(0, mode === 'beginner' ? 2 : 3).map(candidate => candidate.id)], random);
    const ordinal = first ? 'pertama' : 'kedua';
    return { id: mode + ':' + sound.id + ':' + (sequence ? ordinal : 'single'), soundIds, correctId: sound.id, choices, kind: sequence ? 'sequence' : 'single',
      prompt: sequence ? 'Dengar dua bunyi berturutan. Apakah bunyi ' + ordinal + '?' : 'Apakah bunyi yang kamu dengar?',
      explanation: (sequence ? 'Bunyi ' + ordinal + ' ialah ' : 'Itu bunyi ') + sound.name.toLowerCase() + '. ' + sound.description };
  });
}
export function scoreListening(answers: readonly boolean[]) { return { attempted: answers.length, correct: answers.filter(Boolean).length, incorrect: answers.filter(answer => !answer).length, percentage: answers.length ? Math.round(100 * answers.filter(Boolean).length / answers.length) : 0 }; }
