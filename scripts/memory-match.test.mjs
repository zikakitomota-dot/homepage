import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { mkdtempSync, readFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const output = mkdtempSync(join(tmpdir(), 'zalea-memory-'));
const compile = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', 'lib/games/memory-match.ts', 'lib/games/learning-journey.ts', 'lib/games/missions.ts', 'lib/resources/catalogue.ts', 'lib/resources/search.ts', '--rootDir', 'lib', '--module', 'commonjs', '--target', 'es2022', '--outDir', output, '--esModuleInterop', '--skipLibCheck'], { encoding: 'utf8' });
if (compile.status !== 0) throw Error(compile.stdout + compile.stderr);
const require = createRequire(import.meta.url);
const m = require(join(output, 'games/memory-match.js'));
const j = require(join(output, 'games/learning-journey.js'));
const { gameRegistry } = require(join(output, 'games/registry.js'));
const { missions, getMissionProgress } = require(join(output, 'games/missions.js'));
const { resourceCatalogue, validateResourceCatalogue } = require(join(output, 'resources/catalogue.js'));
const { searchResources } = require(join(output, 'resources/search.js'));
process.on('exit', () => rmSync(output, { recursive: true, force: true }));
class MemoryStorage {
  values = new Map(); getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); } removeItem(key) { this.values.delete(key); }
}
const pairsFor = round => [...new Set(round.board.map(c => c.symbolId))].map(id => round.board.flatMap((c, i) => c.symbolId === id ? [i] : []));
function finish(round) { for (const pair of pairsFor(round)) for (const index of pair) round = m.revealMemoryCard(round, index); return round; }

test('24 original symbol definitions have distinct labels, silhouettes and valid SVG metadata', () => {
  assert.ok(m.memorySymbols.length >= 24); assert.equal(new Set(m.memorySymbols.map(s => s.id)).size, m.memorySymbols.length);
  assert.equal(new Set(m.memorySymbols.map(s => s.label)).size, m.memorySymbols.length);
  assert.equal(new Set(m.memorySymbols.map(s => s.paths.join('|'))).size, m.memorySymbols.length);
  for (const symbol of m.memorySymbols) { assert.ok(symbol.paths.length && symbol.paths.every(p => /^M/.test(p))); assert.match(symbol.colour, /^#[0-9a-f]{6}$/); assert.ok(symbol.label.length > 2); }
});
test('600 boards: each difficulty has exact pairs, deterministic shuffling and useful variation', () => {
  const selected = new Set();
  for (const [difficulty, pairs] of [['easy', 4], ['medium', 6], ['challenge', 8]]) {
    const arrangements = new Set(), firstSymbols = new Set();
    for (let seed = 0; seed < 200; seed++) {
      const round = m.createMemoryRound(difficulty, String(seed));
      assert.deepEqual(round, m.createMemoryRound(difficulty, String(seed)));
      assert.equal(round.board.length, pairs * 2); assert.equal(new Set(round.board.map(c => c.id)).size, pairs * 2);
      const counts = new Map(); for (const card of round.board) { counts.set(card.symbolId, (counts.get(card.symbolId) ?? 0) + 1); selected.add(card.symbolId); }
      assert.equal(counts.size, pairs); assert.ok([...counts.values()].every(n => n === 2));
      assert.ok([...counts.keys()].every(id => m.memorySymbols.some(s => s.id === id)));
      arrangements.add(round.board.map(c => c.id).join(',')); firstSymbols.add(round.board[0].symbolId);
      assert.equal(round.phase, 'playing'); assert.equal(round.attempts, 0);
    }
    assert.equal(arrangements.size, 200); assert.ok(firstSymbols.size > 12);
  }
  assert.equal(selected.size, m.memorySymbols.length);
});
test('first reveal, same-card rapid activation and matching leave the board fixed', () => {
  let round = m.createMemoryRound('easy', 'fixed'); const board = round.board; const [a, b] = pairsFor(round)[0];
  round = m.revealMemoryCard(round, a); assert.deepEqual(round.open, [a]); assert.equal(round.attempts, 0);
  assert.strictEqual(m.revealMemoryCard(round, a), round);
  for (let i = 0; i < 100; i++) round = m.revealMemoryCard(round, a);
  round = m.revealMemoryCard(round, b); assert.equal(round.attempts, 1); assert.deepEqual(round.matched, [a, b]);
  assert.deepEqual(round.open, []); assert.strictEqual(round.board, board); assert.strictEqual(m.revealMemoryCard(round, a), round);
  for (const invalid of [-1, 100, NaN, 0.5]) assert.strictEqual(m.revealMemoryCard(round, invalid), round);
});
test('mismatch locks a third card, recovers, and stale callbacks cannot alter replay or difficulty', () => {
  let round = m.createMemoryRound('easy', 'mismatch', 'old'); const original = JSON.stringify(round.board);
  const other = round.board.findIndex(c => c.symbolId !== round.board[0].symbolId);
  round = m.revealMemoryCard(m.revealMemoryCard(round, 0), other);
  assert.equal(round.phase, 'mismatch'); assert.equal(round.open.length, 2); assert.equal(round.attempts, 1);
  for (let i = 0; i < round.board.length; i++) assert.strictEqual(m.revealMemoryCard(round, i), round);
  assert.strictEqual(m.hideMemoryMismatch(round, 'wrong-round'), round);
  const recovered = m.hideMemoryMismatch(round, 'old'); assert.equal(recovered.phase, 'playing'); assert.deepEqual(recovered.open, []); assert.equal(recovered.attempts, 1);
  assert.equal(JSON.stringify(recovered.board), original);
  for (const difficulty of Object.keys(m.memoryDifficulties)) {
    const next = m.createMemoryRound(difficulty, 'new-seed', 'new');
    assert.strictEqual(m.hideMemoryMismatch(next, 'old'), next);
    assert.equal(next.board.length, m.memoryDifficulties[difficulty].pairs * 2);
  }
});
test('hidden states never name symbols; revealed and matched states do', () => {
  let round = m.createMemoryRound('easy', 'labels');
  for (let i = 0; i < round.board.length; i++) assert.equal(m.memoryCardLabel(round, i), `Card ${i + 1}, face down`);
  const [a, b] = pairsFor(round)[0]; const symbol = m.memorySymbols.find(s => s.id === round.board[a].symbolId);
  round = m.revealMemoryCard(round, a); assert.equal(m.memoryCardLabel(round, a), `Card ${a + 1}, ${symbol.label}, revealed`);
  round = m.revealMemoryCard(round, b); assert.equal(m.memoryCardLabel(round, a), `Card ${a + 1}, ${symbol.label}, matched`);
});
test('all modes complete; accuracy counts mismatches and does not reward eventual completion as perfect', () => {
  for (const difficulty of Object.keys(m.memoryDifficulties)) {
    let round = m.createMemoryRound(difficulty, 'score'); const other = round.board.findIndex(c => c.symbolId !== round.board[0].symbolId);
    round = m.revealMemoryCard(m.revealMemoryCard(round, 0), other); round = m.hideMemoryMismatch(round, round.id);
    round = finish(round); const pairs = m.memoryDifficulties[difficulty].pairs;
    assert.equal(round.phase, 'complete'); assert.equal(round.matched.length, pairs * 2);
    assert.deepEqual(m.memoryScore(round), { correct: pairs, questions: pairs + 1, percentage: Math.round(pairs / (pairs + 1) * 100) });
    assert.strictEqual(m.revealMemoryCard(round, 0), round);
    const perfect = finish(m.createMemoryRound(difficulty, 'perfect')); assert.equal(m.memoryScore(perfect).percentage, 100);
  }
});
test('Journey records one completion, preserves Pattern, treats abandoned boards as unfinished and respects best accuracy', () => {
  const storage = new MemoryStorage(); j.recordLearningSessionStart('pattern-detective', 'pattern', storage); j.recordLearningSessionCompletion('pattern-detective', 'pattern', 7, 10, storage);
  const pattern = structuredClone(j.readLearningJourney(storage).games['pattern-detective']);
  j.recordLearningSessionStart(m.MEMORY_GAME_ID, 'abandoned', storage);
  assert.equal(j.readLearningJourney(storage).games[m.MEMORY_GAME_ID].completedSessionCount, 0);
  let round = m.createMemoryRound('easy', 'journey'); const other = round.board.findIndex(c => c.symbolId !== round.board[0].symbolId);
  round = m.hideMemoryMismatch(m.revealMemoryCard(m.revealMemoryCard(round, 0), other), round.id); round = finish(round);
  const score = m.memoryScore(round); j.recordLearningSessionStart(m.MEMORY_GAME_ID, 'finished', storage);
  j.recordLearningSessionCompletion(m.MEMORY_GAME_ID, 'finished', score.correct, score.questions, storage); j.recordLearningSessionCompletion(m.MEMORY_GAME_ID, 'finished', score.correct, score.questions, storage);
  let progress = j.readLearningJourney(storage); assert.equal(progress.games[m.MEMORY_GAME_ID].sessionCount, 2); assert.equal(progress.games[m.MEMORY_GAME_ID].completedSessionCount, 1);
  assert.equal(progress.games[m.MEMORY_GAME_ID].personalBest.percentage, 80); assert.ok(!progress.achievements.some(a => a.id === 'perfect-round'));
  j.recordLearningSessionStart(m.MEMORY_GAME_ID, 'perfect', storage); j.recordLearningSessionCompletion(m.MEMORY_GAME_ID, 'perfect', 6, 6, storage);
  j.recordLearningSessionStart(m.MEMORY_GAME_ID, 'lower', storage); j.recordLearningSessionCompletion(m.MEMORY_GAME_ID, 'lower', 8, 12, storage);
  progress = j.readLearningJourney(storage); assert.equal(progress.games[m.MEMORY_GAME_ID].personalBest.percentage, 100); assert.ok(progress.achievements.some(a => a.id === 'perfect-round'));
  assert.deepEqual(progress.games['pattern-detective'], pattern); assert.ok(gameRegistry.some(g => g.gameId === j.getSuggestedGame(progress).gameId));
  for (const mission of missions) assert.equal(getMissionProgress(mission, progress).completed, 0);
});
test('old exports merge without erasing either Logic game or original subjects', () => {
  const oldStorage = new MemoryStorage(); j.recordLearningSessionStart('a-or-an', 'old', oldStorage); j.recordLearningSessionCompletion('a-or-an', 'old', 6, 10, oldStorage);
  const old = JSON.parse(j.exportLearningJourney(j.readLearningJourney(oldStorage))); old.version = 1; delete old.missionEvidence;
  const storage = new MemoryStorage(); for (const game of ['pattern-detective', m.MEMORY_GAME_ID]) { j.recordLearningSessionStart(game, game, storage); j.recordLearningSessionCompletion(game, game, 4, 5, storage); }
  j.importLearningJourney(j.parseLearningJourneyImport(JSON.stringify(old)), 'merge', storage);
  const result = j.readLearningJourney(storage); assert.equal(Object.keys(result.games).length, 3); assert.equal(result.games[m.MEMORY_GAME_ID].personalBest.percentage, 80);
  assert.deepEqual(j.parseLearningJourneyImport(j.exportLearningJourney(result)), result);
});
test('two Logic games, 70 registry-backed resources, route and sitemap are integrated without ads', () => {
  assert.equal(gameRegistry.filter(g => g.status === 'available').length, 20);
  assert.deepEqual(gameRegistry.filter(g => g.subjectId === 'logic').map(g => g.gameId), ['pattern-detective', 'memory-match']);
  assert.deepEqual(validateResourceCatalogue(resourceCatalogue), []); assert.equal(resourceCatalogue.length, 70);
  for (const query of ['memory', 'matching', 'pairs', 'cards', 'recall']) assert.ok(searchResources(resourceCatalogue, { query, type: 'game', category: 'logic', sort: 'relevance' }).some(r => r.href === '/games/logic/memory-match'));
  assert.ok(existsSync('app/games/logic/memory-match/page.tsx')); assert.ok(readFileSync('app/sitemap.ts', 'utf8').includes("'/games/logic/memory-match'"));
  assert.ok(!readFileSync('lib/adsense.ts', 'utf8').includes('/games/logic'));
});
test('UI uses guarded local state, timer cleanup, descriptive controls and minimal analytics', () => {
  const source = readFileSync('components/games/memory-match-game.tsx', 'utf8');
  for (const text of ['clearTimeout(timer)', 'hide(id)', 'current.current', 'aria-disabled={disabled}', 'aria-label={memoryCardLabel(round, index)}', 'aria-live="polite"', "manual: null", 'userRequested', 'trackAchievementEvents: false', 'ArrowRight', 'Enter or Space', 'motion-safe:transition-colors']) assert.ok(source.includes(text), text);
  assert.ok(source.includes('const symbol = faceUp ?')); assert.equal((source.match(/trackEvent\(/g) ?? []).length, 2);
  for (const line of source.split('\n').filter(line => line.includes('trackEvent('))) assert.ok(!/score:|attempts:|symbolId:|board:|sessionId:/.test(line));
});
