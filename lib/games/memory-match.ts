export const MEMORY_GAME_ID = 'memory-match';
export const memoryDifficulties = {
  easy: { label: 'Easy', pairs: 4 }, medium: { label: 'Medium', pairs: 6 }, challenge: { label: 'Challenge', pairs: 8 },
} as const;
export type MemoryDifficulty = keyof typeof memoryDifficulties;
export type MemorySymbol = { id: string; label: string; paths: readonly string[]; colour: string };
// Original outline drawings on a shared 48×48 canvas. Each pair shares one
// definition; identity differs by silhouette, never only by its colour.
const drawings: [string, string, string[]][] = [
  ['sun', 'Sun', ['M32 24a8 8 0 1 1-16 0a8 8 0 1 1 16 0', 'M24 4v5M24 39v5M4 24h5M39 24h5M10 10l4 4M34 34l4 4M10 38l4-4M34 14l4-4']],
  ['moon', 'Crescent moon', ['M34 7a19 19 0 1 0 7 27A20 20 0 0 1 34 7Z']],
  ['cloud', 'Cloud', ['M12 35a9 9 0 1 1 1-18a12 12 0 0 1 23-1a10 10 0 1 1 0 19Z']],
  ['drop', 'Water drop', ['M24 4C21 11 9 23 9 31a15 15 0 0 0 30 0C39 23 27 11 24 4Z', 'M16 29c-1 5 1 8 5 9']],
  ['snowflake', 'Snowflake', ['M24 4v40M7 14l34 20M7 34l34-20M18 7l6 6l6-6M18 41l6-6l6 6M7 21l8-3l-1-8M34 38l-1-8l8-3M7 27l8 3l-1 8M34 10l-1 8l8 3']],
  ['leaf', 'Leaf', ['M8 38C1 15 20 5 41 7C43 30 29 46 8 38Z', 'M6 43L33 15M17 32l-2-11M24 25l10 1']],
  ['flower', 'Tulip', ['M12 5l12 8L36 5v12c0 15-24 15-24 0Z', 'M24 29v15M24 36l-9-7M24 39l10-8']],
  ['tree', 'Pine tree', ['M24 3L10 19h7L7 31h13v13h8V31h13L31 19h7Z']],
  ['mushroom', 'Mushroom', ['M5 25C6 2 42 2 43 25ZM19 25l-2 18h14l-2-18M15 17h1M25 12h1M34 19h1']],
  ['butterfly', 'Butterfly', ['M24 18C7-3-5 24 20 26C-2 32 13 48 24 31C35 48 50 32 28 26C53 24 41-3 24 18Z', 'M24 17v19M24 17l-6-8M24 17l6-8']],
  ['fish', 'Fish', ['M8 24C17 6 31 6 39 24C31 42 17 42 8 24ZM8 24L2 14v20ZM31 20h1M20 14l3-7M20 34l3 7']],
  ['bird', 'Bird', ['M5 18l10 4C11 4 31 3 34 18l10 5l-9 3c-5 15-23 15-30-8Z', 'M17 23l10 7l4-9M29 15h1M22 36v7M29 34v9']],
  ['cat', 'Cat face', ['M8 20V5l12 9h8l12-9v15C47 48 1 48 8 20Z', 'M16 24h1M31 24h1M21 30l3 3l3-3M24 33v5M4 29l10 2M3 36l11-1M34 31l10-2M34 35l11 1']],
  ['apple', 'Apple', ['M24 14C5 2 1 27 13 40c5 7 8 1 11 1s6 6 11-1C47 27 43 2 24 14Z', 'M24 14V5M25 8C29 2 37 3 36 4C33 10 28 11 25 8']],
  ['carrot', 'Carrot', ['M7 42L17 13c5-5 16 2 15 7ZM21 13L21 3M26 14L34 5M30 17L42 14M15 23l5 3M11 32l5 2']],
  ['cup', 'Cup', ['M7 12h27v22c0 12-27 12-27 0ZM34 16h5c10 0 10 14-5 14M3 44h35']],
  ['key', 'Key', ['M23 15a10 10 0 1 1-20 0a10 10 0 1 1 20 0ZM21 22l20 20h5v-8h-7v-7h-7l-6-6']],
  ['house', 'House', ['M3 22L24 4l21 18M9 18v26h30V18M20 44V29h10v15M14 23h5v6h-5']],
  ['boat', 'Sailboat', ['M4 31h40l-8 12H13ZM24 3v28M21 7L7 27h14ZM28 10l13 17H28']],
  ['rocket', 'Rocket', ['M18 33C10 14 24 3 24 3s14 11 6 30ZM17 24L7 34l10-1M31 24l10 10l-11-1M19 38l-2 7M24 38v8M29 38l2 7', 'M28 17a4 4 0 1 1-8 0a4 4 0 1 1 8 0']],
  ['book', 'Open book', ['M24 12C16 5 7 7 3 9v30c7-3 15-2 21 4c6-6 14-7 21-4V9c-4-2-13-4-21 3ZM24 12v31M8 16l10 1M8 23l10 1M30 17l10-1M30 24l10-1']],
  ['music', 'Music note', ['M18 35V10l23-5v25M18 18l23-5M18 35c0 10-15 10-15 2c0-7 15-10 15-2ZM41 30c0 10-15 10-15 2c0-7 15-10 15-2Z']],
  ['bell', 'Bell', ['M8 34c5-5 4-12 5-17c2-13 20-13 22 0c1 5 0 12 5 17ZM18 39c1 8 11 8 12 0M24 4V1']],
  ['umbrella', 'Umbrella', ['M3 24C3 0 45 0 45 24c-5-5-9-5-14 0c-5-5-9-5-14 0c-5-5-9-5-14 0ZM24 24v15c0 10 13 10 13 1']],
];
const colours = ['#6b21a8', '#1d4ed8', '#047857', '#be123c', '#9a3412', '#334155'];
export const memorySymbols: readonly MemorySymbol[] = drawings.map(([id, label, paths], index) => ({ id, label, paths, colour: colours[index % colours.length] }));
export type MemoryCard = { id: string; symbolId: string };
export type MemoryRound = {
  id: string; difficulty: MemoryDifficulty; board: readonly MemoryCard[];
  open: readonly number[]; matched: readonly number[]; attempts: number;
  phase: 'playing' | 'mismatch' | 'complete';
};
function randomFromSeed(seed: string) {
  let n = 2166136261;
  for (const char of seed) n = Math.imul(n ^ char.charCodeAt(0), 16777619);
  return () => { n += 0x6D2B79F5; let x = n; x = Math.imul(x ^ x >>> 15, x | 1); x ^= x + Math.imul(x ^ x >>> 7, x | 61); return ((x ^ x >>> 14) >>> 0) / 4294967296; };
}
function shuffle<T>(items: readonly T[], random: () => number) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [result[i], result[j]] = [result[j], result[i]]; }
  return result;
}
export function createMemoryRound(difficulty: MemoryDifficulty, seed: string, id = seed): MemoryRound {
  const random = randomFromSeed(seed);
  const symbols = shuffle(memorySymbols, random).slice(0, memoryDifficulties[difficulty].pairs);
  const board = shuffle(symbols.flatMap(symbol => [{ id: `${symbol.id}-a`, symbolId: symbol.id }, { id: `${symbol.id}-b`, symbolId: symbol.id }]), random);
  return { id, difficulty, board, open: [], matched: [], attempts: 0, phase: 'playing' };
}
export function revealMemoryCard(round: MemoryRound, index: number): MemoryRound {
  if (round.phase !== 'playing' || !Number.isInteger(index) || index < 0 || index >= round.board.length || round.matched.includes(index) || round.open.includes(index)) return round;
  if (!round.open.length) return { ...round, open: [index] };
  const first = round.open[0]; const attempts = round.attempts + 1;
  if (round.board[first].symbolId !== round.board[index].symbolId) return { ...round, open: [first, index], attempts, phase: 'mismatch' };
  const matched = [...round.matched, first, index];
  return { ...round, open: [], matched, attempts, phase: matched.length === round.board.length ? 'complete' : 'playing' };
}
export function hideMemoryMismatch(round: MemoryRound, expectedRoundId: string): MemoryRound {
  return round.id === expectedRoundId && round.phase === 'mismatch' ? { ...round, open: [], phase: 'playing' } : round;
}
export function memoryScore(round: MemoryRound) {
  const pairs = round.matched.length / 2;
  return { correct: pairs, questions: round.attempts, percentage: round.attempts ? Math.round(pairs / round.attempts * 100) : 0 };
}
export function memoryCardLabel(round: MemoryRound, index: number) {
  const matched = round.matched.includes(index), revealed = matched || round.open.includes(index);
  if (!revealed) return `Card ${index + 1}, face down`;
  const symbol = memorySymbols.find(s => s.id === round.board[index].symbolId)!;
  return `Card ${index + 1}, ${symbol.label}, ${matched ? 'matched' : 'revealed'}`;
}
