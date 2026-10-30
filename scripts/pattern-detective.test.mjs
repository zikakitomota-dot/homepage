import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const output = mkdtempSync(join(tmpdir(), 'zalea-pattern-'));
const compile = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', 'lib/games/pattern-detective.ts', 'lib/games/learning-journey.ts', 'lib/games/missions.ts', 'lib/resources/catalogue.ts', 'lib/resources/search.ts', '--rootDir', 'lib', '--module', 'commonjs', '--target', 'es2022', '--outDir', output, '--esModuleInterop', '--skipLibCheck'], { encoding: 'utf8' });
if (compile.status !== 0) throw Error(compile.stdout + compile.stderr);
const require = createRequire(import.meta.url);
const p = require(join(output, 'games/pattern-detective.js'));
const j = require(join(output, 'games/learning-journey.js'));
const { gameRegistry, subjectOrder } = require(join(output, 'games/registry.js'));
const { missions, getMissionProgress } = require(join(output, 'games/missions.js'));
const { resourceCatalogue, validateResourceCatalogue } = require(join(output, 'resources/catalogue.js'));
const { searchResources } = require(join(output, 'resources/search.js'));
process.on('exit', () => rmSync(output, { recursive: true, force: true }));
class MemoryStorage {
  values = new Map(); getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); } removeItem(key) { this.values.delete(key); }
}
const key = t => [t.shape, t.count, t.turn].join(':');

function checkMeaning(q) {
  assert.ok(q.explanation.length > 30 && q.instruction.length > 25 && q.prompt.length > 10, q.id);
  assert.equal(q.choices.length, 4); assert.equal(new Set(q.choices.map(c => c.id)).size, 4);
  assert.equal(q.choices.filter(c => c.id === q.correctChoiceId).length, 1);
  for (const t of [...q.cells.filter(Boolean), ...q.choices.map(c => c.token)]) {
    assert.ok(['circle', 'square', 'triangle', 'star', 'diamond', 'arrow'].includes(t.shape));
    assert.ok(Number.isInteger(t.count) && t.count >= 1 && t.count <= 9);
    assert.ok(Number.isInteger(t.turn) && t.turn >= 0 && t.turn <= 3);
    if (t.shape !== 'arrow') assert.equal(t.turn, 0, 'symmetric shapes must not hide meaningless rotation differences');
    else assert.equal(t.count, 1);
    assert.ok(p.describeToken(t).length > 5);
  }
  if (q.type === 'odd') {
    const counts = new Map(); for (const t of q.cells) counts.set(key(t), (counts.get(key(t)) ?? 0) + 1);
    assert.deepEqual([...counts.values()].sort(), [1, 3], q.id + ' requires three identical pictures and one different picture');
    const singleton = q.cells.findIndex(t => counts.get(key(t)) === 1);
    assert.equal(q.correctChoiceId, `item-${singleton + 1}`);
    const common = q.cells.find(t => counts.get(key(t)) === 3), odd = q.cells[singleton];
    const changed = ['shape', 'count', 'turn'].filter(field => common[field] !== odd[field]);
    assert.deepEqual(changed, [q.rule.attribute], q.id + ' must differ in one declared feature only');
    for (const c of q.choices) assert.deepEqual(c.token, q.cells[Number(c.id.slice(5)) - 1], 'shuffling must preserve item labels/pictures');
    return;
  }
  const missing = q.cells.indexOf(null); assert.equal(q.cells.filter(c => c === null).length, 1);
  const answer = q.choices.find(c => c.id === q.correctChoiceId).token;
  assert.equal(new Set(q.choices.map(c => key(c.token))).size, 4, 'no visually identical answer choices');
  if (q.type === 'repeat') {
    assert.ok(missing >= q.rule.unit.length * 2, 'show two complete cycles');
    assert.ok([2, 3].includes(q.rule.unit.length));
    for (let i = 0; i < missing; i++) assert.equal(key(q.cells[i]), key(q.rule.unit[i % q.rule.unit.length]));
    assert.equal(key(answer), key(q.cells[missing - q.rule.unit.length]), 'answer must repeat the visible earlier position');
  } else if (q.rule.kind === 'count') {
    const values = [...q.cells.slice(0, missing), answer];
    assert.ok([1, 2].includes(q.rule.step));
    values.forEach((t, i) => { assert.equal(t.shape, values[0].shape); if (i) assert.equal(t.count - values[i - 1].count, q.rule.step); });
  } else if (q.rule.kind === 'turn') {
    const values = [...q.cells.slice(0, missing), answer];
    values.forEach((t, i) => { assert.equal(t.shape, 'arrow'); if (i) assert.equal((t.turn - values[i - 1].turn + 4) % 4, (q.rule.step + 4) % 4); });
  } else {
    const { rows, columns, shift, unit } = q.rule;
    assert.ok([2, 3].includes(rows) && [2, 3].includes(columns)); assert.equal(q.cells.length, rows * columns);
    assert.ok(missing >= columns, 'leave the full first row visible');
    const completed = q.cells.map(t => t ?? answer);
    // Independently read visible row/column transitions, not a marked answer ID.
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      const at = row * columns + col;
      if (row) assert.equal(key(completed[at]), key(completed[(row - 1) * columns + (col + shift) % unit.length]));
      if (col) {
        const previous = unit.findIndex(t => key(t) === key(completed[at - 1]));
        assert.equal(key(completed[at]), key(unit[(previous + 1) % unit.length]));
      }
    }
  }
  assert.equal(p.expectedPatternAnswer(q), q.correctChoiceId);
}

test('60 complete puzzles have the four required banks and unique rendered structures', () => {
  assert.equal(p.patternPuzzles.length, 60); assert.equal(new Set(p.patternPuzzles.map(q => q.id)).size, 60);
  assert.equal(new Set(p.patternPuzzles.map(p.patternSignature)).size, 60);
  for (const type of p.patternTypes) assert.equal(p.patternPuzzles.filter(q => q.type === type).length, 15);
  p.patternPuzzles.forEach(checkMeaning);
  assert.deepEqual(new Set(p.patternPuzzles.filter(q => q.type === 'repeat').map(q => q.family)), new Set(['repeat-AB', 'repeat-AAB', 'repeat-ABB', 'repeat-ABC']));
});
test('200 seeded sessions preserve meaning, distribution, novelty and shuffled positions', () => {
  const seen = new Set(), sequences = new Set(), correctPositions = new Set();
  for (let seed = 0; seed < 200; seed++) {
    const session = p.generatePatternSession(seed);
    assert.deepEqual(session, p.generatePatternSession(seed)); assert.equal(session.length, 10);
    assert.equal(new Set(session.map(q => q.id)).size, 10); assert.equal(new Set(session.map(p.patternSignature)).size, 10);
    for (const [type, count] of [['repeat', 3], ['grow', 3], ['odd', 2], ['grid', 2]]) {
      const subset = session.filter(q => q.type === type); assert.equal(subset.length, count);
      assert.equal(new Set(subset.map(q => q.family)).size, count, 'no repeated rule family within a mechanic');
    }
    for (const q of session) { checkMeaning(q); seen.add(q.id); correctPositions.add(q.choices.findIndex(c => c.id === q.correctChoiceId)); }
    sequences.add(session.map(q => q.id).join(','));
  }
  assert.equal(seen.size, 60); assert.equal(sequences.size, 200); assert.equal(correctPositions.size, 4);
});
test('Logic remains intact after the sixth subject and leaves four Missions unchanged', () => {
  assert.equal(gameRegistry.filter(g => g.status === 'available').length, 22);
  assert.equal(gameRegistry.filter(g => !['logic', 'life-skills'].includes(g.subjectId)).length, 18);
  assert.deepEqual(subjectOrder, ['english', 'mathematics', 'science', 'geography', 'logic', 'life-skills']);
  assert.deepEqual(missions.map(m => m.id), ['maths-explorer', 'world-explorer', 'science-detective', 'english-adventurer']);
  assert.ok(missions.every(m => m.activities.every(a => a.gameId !== p.PATTERN_GAME_ID)));
});
test('Logic scoring, personal bests, idempotency and old scores use the same Journey', () => {
  const storage = new MemoryStorage();
  j.recordLearningSessionStart('a-or-an', 'old-session', storage); j.recordLearningSessionCompletion('a-or-an', 'old-session', 6, 10, storage);
  const original = structuredClone(j.readLearningJourney(storage).games['a-or-an']);
  for (const [i, score] of [8, 2, 10].entries()) {
    j.recordLearningSessionStart(p.PATTERN_GAME_ID, `logic-${i}`, storage);
    j.recordLearningSessionCompletion(p.PATTERN_GAME_ID, `logic-${i}`, score, 10, storage);
    j.recordLearningSessionCompletion(p.PATTERN_GAME_ID, `logic-${i}`, score, 10, storage);
    const item = j.readLearningJourney(storage).games[p.PATTERN_GAME_ID];
    assert.equal(item.personalBest.correct, i === 2 ? 10 : 8); assert.equal(item.completedSessionCount, i + 1);
  }
  // Both currently available Logic games count toward Subject Explorer.
  j.recordLearningSessionStart('memory-match', 'try-second-logic', storage);
  const progress = j.readLearningJourney(storage); const item = progress.games[p.PATTERN_GAME_ID];
  assert.equal(item.subjectId, 'logic'); assert.equal(item.sessionCount, 3); assert.equal(item.totalCorrectAnswers, 20); assert.equal(item.totalQuestionsAttempted, 30);
  assert.deepEqual(progress.games['a-or-an'], original);
  assert.ok(progress.achievements.some(a => a.id === 'perfect-round'));
  assert.ok(progress.achievements.some(a => a.id === 'subject-explorer'));
  assert.ok(gameRegistry.some(g => g.gameId === j.getSuggestedGame(progress).gameId));
  assert.equal(getMissionProgress(missions[0], progress).completed, 0);
});
test('old four-subject imports merge without erasing Logic or changing Mission evidence', () => {
  const oldStorage = new MemoryStorage();
  for (const game of ['a-or-an', 'addition-level-1', 'animal-habitats', 'continent-explorer']) {
    j.recordLearningSessionStart(game, game, oldStorage); j.recordLearningSessionCompletion(game, game, 7, 10, oldStorage);
  }
  const old = JSON.parse(j.exportLearningJourney(j.readLearningJourney(oldStorage))); old.version = 1; delete old.missionEvidence;
  const parsed = j.parseLearningJourneyImport(JSON.stringify(old)); assert.equal(parsed.version, 2);
  const storage = new MemoryStorage(); j.recordLearningSessionStart(p.PATTERN_GAME_ID, 'new-logic', storage); j.recordLearningSessionCompletion(p.PATTERN_GAME_ID, 'new-logic', 9, 10, storage);
  const before = structuredClone(j.readLearningJourney(storage).games[p.PATTERN_GAME_ID]);
  j.importLearningJourney(parsed, 'merge', storage);
  const restored = j.readLearningJourney(storage); assert.deepEqual(restored.games[p.PATTERN_GAME_ID], before); assert.equal(Object.keys(restored.games).length, 5);
  assert.deepEqual(restored.missionEvidence, []);
  const roundTrip = j.parseLearningJourneyImport(j.exportLearningJourney(restored)); assert.deepEqual(roundTrip, restored);
});
test('Logic is searchable, has two static source routes and no ad expansion', () => {
  assert.deepEqual(validateResourceCatalogue(resourceCatalogue), []); assert.equal(resourceCatalogue.length, 72);
  for (const query of ['pattern', 'puzzle', 'sequence', 'brain', 'reasoning', 'logic']) {
    const results = searchResources(resourceCatalogue, { query, type: 'game', category: 'logic', sort: 'relevance' });
    assert.ok(results.some(result => result.href === '/games/logic/pattern-detective'));
  }
  for (const path of ['app/games/logic/page.tsx', 'app/games/logic/pattern-detective/page.tsx']) assert.ok(existsSync(path));
  const sitemap = readFileSync('app/sitemap.ts', 'utf8'); assert.ok(sitemap.includes("'/games/logic', '/games/logic/pattern-detective'"));
  assert.ok(!readFileSync('lib/adsense.ts', 'utf8').includes('/games/logic'));
});
test('new UI contains text equivalents, semantic grid, focus and aggregate-only telemetry', () => {
  const source = readFileSync('components/games/pattern-detective-game.tsx', 'utf8');
  for (const required of ['<table', '<caption', 'Row {row + 1}', 'describeToken', 'aria-live="polite"', 'resultHeading', 'questionHeading', 'motion-safe:', 'trackAchievementEvents: false']) assert.ok(source.includes(required), required);
  assert.equal((source.match(/trackEvent\(/g) ?? []).length, 2);
  assert.ok(source.includes("trackEvent('game_started', eventDimensions)")); assert.ok(source.includes("trackEvent('game_completed', eventDimensions)"));
  assert.ok(!/fetch\(|localStorage|answer_submitted/.test(source));
  assert.ok(source.includes("const eventDimensions = { game: PATTERN_GAME_ID, subject: 'logic', level: '1' }"));
});
