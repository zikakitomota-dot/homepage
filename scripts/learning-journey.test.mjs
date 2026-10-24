import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const output = mkdtempSync(join(tmpdir(), 'zalea-learning-journey-'));
const compile = spawnSync(process.execPath, [
  'node_modules/typescript/bin/tsc', 'lib/games/learning-journey.ts', 'lib/games/registry.ts',
  '--module', 'commonjs', '--target', 'es2022', '--outDir', output, '--esModuleInterop', '--skipLibCheck',
], { cwd: process.cwd(), encoding: 'utf8' });
if (compile.status !== 0) throw new Error(`Test compilation failed:\n${compile.stdout}\n${compile.stderr}`);
const require = createRequire(import.meta.url);
const journey = require(join(output, 'learning-journey.js'));
process.on('exit', () => rmSync(output, { recursive: true, force: true }));

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

test('first-time visitor has no invented progress', () => {
  const progress = journey.readLearningJourney(new MemoryStorage());
  assert.equal(progress.version, 1);
  assert.deepEqual(progress.games, {});
});

test('a started and completed game records reliable totals', () => {
  const storage = new MemoryStorage();
  journey.recordLearningSessionStart('a-or-an', 'one', storage, '2026-01-01T00:00:00Z');
  journey.recordLearningSessionCompletion('a-or-an', 'one', 8, 10, storage, '2026-01-01T00:01:00Z');
  const game = journey.readLearningJourney(storage).games['a-or-an'];
  assert.deepEqual([game.sessionCount, game.completedSessionCount, game.totalCorrectAnswers, game.totalQuestionsAttempted], [1, 1, 8, 10]);
});

test('duplicate completion callbacks are idempotent', () => {
  const storage = new MemoryStorage();
  journey.recordLearningSessionStart('a-or-an', 'same', storage);
  journey.recordLearningSessionCompletion('a-or-an', 'same', 7, 10, storage);
  journey.recordLearningSessionCompletion('a-or-an', 'same', 7, 10, storage);
  assert.equal(journey.readLearningJourney(storage).games['a-or-an'].completedSessionCount, 1);
});

test('lower replay does not replace a personal best and higher replay does', () => {
  const storage = new MemoryStorage();
  for (const [id, score] of [['a', 8], ['b', 5], ['c', 10]]) {
    journey.recordLearningSessionStart('a-or-an', id, storage);
    journey.recordLearningSessionCompletion('a-or-an', id, score, 10, storage);
  }
  const game = journey.readLearningJourney(storage).games['a-or-an'];
  assert.equal(game.personalBest.percentage, 100);
  assert.equal(game.completedSessionCount, 3);
});

test('abandoned sessions count as tried but not completed', () => {
  const storage = new MemoryStorage();
  journey.recordLearningSessionStart('animal-habitats', 'abandoned', storage);
  const game = journey.readLearningJourney(storage).games['animal-habitats'];
  assert.deepEqual([game.sessionCount, game.completedSessionCount], [1, 0]);
});

test('switching subjects and registry-backed suggestions work', () => {
  const storage = new MemoryStorage();
  journey.recordLearningSessionStart('animal-habitats', 'science', storage, '2026-01-02T00:00:00Z');
  journey.recordLearningSessionStart('a-or-an', 'english', storage, '2026-01-01T00:00:00Z');
  assert.equal(journey.getSuggestedGame(journey.readLearningJourney(storage)).gameId, 'living-or-non-living');
});

test('unknown and non-playable IDs are excluded', () => {
  const storage = new MemoryStorage();
  assert.equal(journey.recordLearningSessionStart('coming-soon-example', 'x', storage), null);
  const imported = journey.parseLearningJourneyImport(JSON.stringify({ version: 1, updatedAt: new Date().toISOString(), games: { unknown: { sessionCount: 99 } }, achievements: [], recordedSessions: [] }));
  assert.deepEqual(imported.games, {});
});

test('achievement rules are deterministic and completion-based where required', () => {
  const storage = new MemoryStorage();
  ['continent-explorer', 'ocean-explorer', 'flag-detective'].forEach((gameId, index) => {
    journey.recordLearningSessionStart(gameId, `geo-${index}`, storage);
    journey.recordLearningSessionCompletion(gameId, `geo-${index}`, index === 0 ? 10 : 7, 10, storage);
  });
  const ids = journey.getEarnedAchievementIds(journey.readLearningJourney(storage));
  assert.ok(ids.includes('first-adventure'));
  assert.ok(ids.includes('curious-explorer'));
  assert.ok(ids.includes('perfect-round'));
  assert.ok(ids.includes('world-explorer'));
});

test('imports cannot claim achievements that stored progress has not earned', () => {
  const imported = journey.parseLearningJourneyImport(JSON.stringify({
    version: 1, updatedAt: new Date().toISOString(), games: {},
    achievements: [{ id: 'perfect-round', earnedAt: new Date().toISOString() }], recordedSessions: [],
  }));
  assert.deepEqual(imported.achievements, []);
});

test('corrupted storage returns a safe empty state', () => {
  const storage = new MemoryStorage();
  storage.setItem(journey.LEARNING_JOURNEY_STORAGE_KEY, '{broken');
  assert.deepEqual(journey.readLearningJourney(storage).games, {});
});

test('unavailable and quota-limited storage do not throw', () => {
  const storage = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); }, removeItem() {} };
  assert.deepEqual(journey.readLearningJourney(storage).games, {});
  assert.equal(journey.recordLearningSessionStart('a-or-an', 'quota', storage).saved, false);
});

test('version 0 data migrates without inventing answer totals', () => {
  const migrated = journey.sanitizeJourney({ version: 0, updatedAt: '2026-01-01T00:00:00Z', games: { 'a-or-an': { plays: 3, completions: 2, bestCorrect: 9, bestQuestions: 10 } } });
  assert.equal(migrated.version, 1);
  assert.equal(migrated.games['a-or-an'].sessionCount, 3);
  assert.equal(migrated.games['a-or-an'].totalQuestionsAttempted, 0);
  assert.equal(migrated.games['a-or-an'].personalBest.percentage, 90);
});

test('export/import validates version, values, identifiers and size', () => {
  const storage = new MemoryStorage();
  journey.recordLearningSessionStart('a-or-an', 'exported', storage);
  const exported = journey.exportLearningJourney(journey.readLearningJourney(storage));
  assert.equal(journey.parseLearningJourneyImport(exported).games['a-or-an'].sessionCount, 1);
  assert.throws(() => journey.parseLearningJourneyImport('{"version":99,"games":{}}'), /supported progress schema/);
  assert.throws(() => journey.parseLearningJourneyImport('x'.repeat(journey.MAX_IMPORT_BYTES + 1)), /larger than 256 KB/);
});

test('merge is idempotent and does not double imported counters', () => {
  const storage = new MemoryStorage();
  journey.recordLearningSessionStart('a-or-an', 'merge', storage);
  journey.recordLearningSessionCompletion('a-or-an', 'merge', 9, 10, storage);
  const current = journey.readLearningJourney(storage);
  const merged = journey.mergeLearningJourneys(current, current);
  assert.equal(merged.games['a-or-an'].completedSessionCount, 1);
});

test('clear resets only the journey storage value', () => {
  const storage = new MemoryStorage();
  storage.setItem('unrelated', 'keep');
  journey.recordLearningSessionStart('a-or-an', 'clear', storage);
  assert.equal(journey.clearLearningJourney(storage), true);
  assert.deepEqual(journey.readLearningJourney(storage).games, {});
  assert.equal(storage.getItem('unrelated'), 'keep');
});

test('SSR reads return an empty state without browser APIs', () => {
  assert.deepEqual(journey.readLearningJourney().games, {});
});
