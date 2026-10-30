import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const output = mkdtempSync(join(tmpdir(), 'zalea-time-detective-'));
const compile = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', 'lib/games/time-detective.ts', 'lib/games/learning-journey.ts', 'lib/games/missions.ts', 'lib/resources/catalogue.ts', 'lib/resources/search.ts', '--rootDir', 'lib', '--module', 'commonjs', '--target', 'es2022', '--outDir', output, '--esModuleInterop', '--skipLibCheck'], { encoding: 'utf8' });
if (compile.status !== 0) throw Error(compile.stdout + compile.stderr);
const require = createRequire(import.meta.url);
const time = require(join(output, 'games/time-detective.js'));
const journey = require(join(output, 'games/learning-journey.js'));
const { gameRegistry, subjectOrder } = require(join(output, 'games/registry.js'));
const { missions, getMissionProgress } = require(join(output, 'games/missions.js'));
const { resourceCatalogue, validateResourceCatalogue } = require(join(output, 'resources/catalogue.js'));
const { searchResources } = require(join(output, 'resources/search.js'));
process.on('exit', () => rmSync(output, { recursive: true, force: true }));

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

test('60 reviewed challenges are balanced across four mechanics and four stages', () => {
  assert.equal(time.timeChallenges.length, 60);
  assert.equal(new Set(time.timeChallenges.map(challenge => challenge.id)).size, 60);
  for (const mechanic of time.timeMechanics) {
    const challenges = time.timeChallenges.filter(challenge => challenge.mechanic === mechanic);
    assert.equal(challenges.length, 15);
    assert.deepEqual(Object.fromEntries(time.timeStages.map(stage => [stage, challenges.filter(challenge => challenge.stage === stage).length])), { whole: 4, half: 4, quarter: 4, five: 3 });
  }
  assert.equal(time.timeChallenges.filter(challenge => challenge.interaction === 'set').length, 22);
});

test('every clock uses mathematically correct continuous hand geometry', () => {
  for (const challenge of time.timeChallenges) {
    const normalized = time.normalizeClockTime(challenge.answer);
    const angles = time.clockAngles(challenge.answer);
    assert.equal(angles.minute, normalized.minute * 6, challenge.id);
    assert.equal(angles.hour, (normalized.hour % 12) * 30 + normalized.minute * 0.5, challenge.id);
    assert.equal(time.formatClockTime(challenge.answer), `${normalized.hour}:${String(normalized.minute).padStart(2, '0')}`);
    assert.match(time.describeClockHands(challenge.answer), /shorter hour hand/);
    assert.match(time.describeClockHands(challenge.answer), /longer minute hand/);
    if (normalized.minute > 0) assert.notEqual(angles.hour, (normalized.hour % 12) * 30, challenge.id);
  }
  assert.deepEqual(time.clockAngles({ hour: 12, minute: 0 }), { hour: 0, minute: 0 });
  assert.deepEqual(time.clockAngles({ hour: 12, minute: 30 }), { hour: 15, minute: 180 });
  assert.deepEqual(time.clockAngles({ hour: 11, minute: 55 }), { hour: 357.5, minute: 330 });
  assert.deepEqual(time.adjustClockTime({ hour: 12, minute: 55 }, 'minute', 5), { hour: 1, minute: 0 });
  assert.deepEqual(time.adjustClockTime({ hour: 1, minute: 0 }, 'minute', -5), { hour: 12, minute: 55 });
});

test('answers and distractors are exact, distinct and mathematically valid', () => {
  for (const challenge of time.timeChallenges) {
    assert.ok(challenge.prompt.length > 12 && challenge.instruction.length > 25 && challenge.explanation.length > 50, challenge.id);
    if (challenge.interaction === 'set') {
      assert.equal(challenge.correctChoiceId, null); assert.deepEqual(challenge.choices, []);
      assert.ok(time.isSameClockTime(challenge.answer, { ...challenge.answer }));
      assert.ok(!time.isSameClockTime(challenge.answer, time.adjustClockTime(challenge.answer, 'minute', 5)));
    } else {
      assert.equal(challenge.choices.length, 4);
      assert.equal(new Set(challenge.choices.map(choice => time.clockTimeKey(choice.time))).size, 4);
      assert.equal(challenge.choices.filter(choice => choice.id === challenge.correctChoiceId).length, 1);
      assert.ok(challenge.choices.every(choice => choice.id === time.clockTimeKey(choice.time)));
      assert.equal(challenge.correctChoiceId, time.clockTimeKey(challenge.answer));
    }
  }
});

test('200 seeded sessions per mode are deterministic, distinct and progressive', () => {
  for (const mode of ['intro', 'full']) {
    const sequences = new Set();
    for (let seed = 0; seed < 200; seed++) {
      const session = time.generateTimeSession(seed, mode);
      assert.deepEqual(session, time.generateTimeSession(seed, mode));
      assert.equal(session.length, 10); assert.equal(new Set(session.map(challenge => challenge.id)).size, 10);
      assert.deepEqual(Object.fromEntries(time.timeMechanics.map(mechanic => [mechanic, session.filter(challenge => challenge.mechanic === mechanic).length])), { read: 3, set: 3, match: 2, routine: 2 });
      const stageOrder = session.map(challenge => time.timeStages.indexOf(challenge.stage));
      assert.deepEqual(stageOrder, [...stageOrder].sort((left, right) => left - right));
      assert.deepEqual(new Set(session.map(challenge => challenge.stage)), mode === 'intro' ? new Set(['whole', 'half']) : new Set(['whole', 'half', 'quarter', 'five']));
      sequences.add(session.map(challenge => challenge.id).join(','));
    }
    assert.ok(sequences.size > 100, `${mode} session variation`);
  }
});

test('the sixth subject preserves 20 existing games, four Missions and previous progress', () => {
  const available = gameRegistry.filter(game => game.status === 'available');
  assert.equal(available.length, 22); assert.equal(available.filter(game => game.gameId !== time.TIME_GAME_ID).length, 21);
  assert.deepEqual(subjectOrder, ['english', 'mathematics', 'science', 'geography', 'logic', 'life-skills']);
  assert.deepEqual(missions.map(mission => mission.id), ['maths-explorer', 'world-explorer', 'science-detective', 'english-adventurer']);
  assert.ok(missions.every(mission => mission.activities.every(activity => activity.gameId !== time.TIME_GAME_ID)));
  const storage = new MemoryStorage();
  journey.recordLearningSessionStart('pattern-detective', 'old', storage); journey.recordLearningSessionCompletion('pattern-detective', 'old', 7, 10, storage);
  const previous = structuredClone(journey.readLearningJourney(storage).games['pattern-detective']);
  for (const [id, score] of [['time-low', 4], ['time-high', 9]]) {
    journey.recordLearningSessionStart(time.TIME_GAME_ID, id, storage); journey.recordLearningSessionCompletion(time.TIME_GAME_ID, id, score, 10, storage); journey.recordLearningSessionCompletion(time.TIME_GAME_ID, id, score, 10, storage);
  }
  const progress = journey.readLearningJourney(storage);
  assert.deepEqual(progress.games['pattern-detective'], previous);
  assert.deepEqual([progress.games[time.TIME_GAME_ID].sessionCount, progress.games[time.TIME_GAME_ID].completedSessionCount, progress.games[time.TIME_GAME_ID].personalBest.correct], [2, 2, 9]);
  for (const mission of missions) assert.equal(getMissionProgress(mission, progress).completed, 0);
});

test('legacy exports merge without losing old subjects or new Time Detective progress', () => {
  const oldStorage = new MemoryStorage();
  for (const gameId of ['a-or-an', 'addition-level-1', 'animal-habitats', 'continent-explorer', 'pattern-detective']) {
    journey.recordLearningSessionStart(gameId, gameId, oldStorage); journey.recordLearningSessionCompletion(gameId, gameId, 6, 10, oldStorage);
  }
  const legacy = JSON.parse(journey.exportLearningJourney(journey.readLearningJourney(oldStorage))); legacy.version = 1; delete legacy.missionEvidence;
  const currentStorage = new MemoryStorage(); journey.recordLearningSessionStart(time.TIME_GAME_ID, 'time', currentStorage); journey.recordLearningSessionCompletion(time.TIME_GAME_ID, 'time', 8, 10, currentStorage);
  journey.importLearningJourney(journey.parseLearningJourneyImport(JSON.stringify(legacy)), 'merge', currentStorage);
  const merged = journey.readLearningJourney(currentStorage);
  assert.equal(Object.keys(merged.games).length, 6); assert.equal(merged.games[time.TIME_GAME_ID].personalBest.correct, 8);
  assert.deepEqual(journey.parseLearningJourneyImport(journey.exportLearningJourney(merged)), merged);
});

test('Life Skills routes, Finder, sitemap and ad safeguards are integrated', () => {
  assert.deepEqual(validateResourceCatalogue(resourceCatalogue), []); assert.equal(resourceCatalogue.length, 72);
  assert.equal(resourceCatalogue.filter(resource => resource.type === 'game').length, 22);
  for (const query of ['time', 'clock', 'analogue', 'quarter past', 'daily routine']) {
    const results = searchResources(resourceCatalogue, { query, type: 'game', category: 'life-skills', sort: 'relevance' });
    assert.ok(results.some(result => result.href === '/games/life-skills/time-detective'), query);
  }
  for (const path of ['app/games/life-skills/page.tsx', 'app/games/life-skills/time-detective/page.tsx']) assert.ok(existsSync(path));
  const sitemap = readFileSync('app/sitemap.ts', 'utf8'); assert.ok(sitemap.includes("'/games/life-skills', '/games/life-skills/time-detective'"));
  assert.ok(!readFileSync('lib/adsense.ts', 'utf8').includes('/games/life-skills'));
});

test('UI provides non-revealing descriptions, touch and keyboard controls, focus and minimal analytics', () => {
  const source = readFileSync('components/games/time-detective-game.tsx', 'utf8');
  for (const required of ['type="range"', 'aria-valuetext', 'Decrease ${label.toLowerCase()}', 'Increase ${label.toLowerCase()}', 'describeClockHands', 'aria-live="polite"', 'resultsHeading', 'questionHeading', 'motion-safe:', 'trackAchievementEvents: false', 'role={decorative ? undefined : \'img\'}']) assert.ok(source.includes(required), required);
  assert.equal((source.match(/trackEvent\(/g) ?? []).length, 2);
  for (const line of source.split('\n').filter(line => line.includes('trackEvent('))) assert.ok(!/score:|answer:|selected|sessionId/.test(line));
  assert.ok(!/fetch\(|localStorage|answer_submitted/.test(source));
});
