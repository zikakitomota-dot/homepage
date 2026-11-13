import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const output = mkdtempSync(join(tmpdir(), 'zalea-shapes-geometry-'));
const compile = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', 'lib/games/shapes-and-geometry.ts', 'lib/games/learning-journey.ts', 'lib/games/missions.ts', 'lib/resources/catalogue.ts', 'lib/resources/search.ts', '--rootDir', 'lib', '--module', 'commonjs', '--target', 'es2022', '--outDir', output, '--esModuleInterop', '--skipLibCheck'], { encoding: 'utf8' });
if (compile.status !== 0) throw Error(compile.stdout + compile.stderr);
const require = createRequire(import.meta.url);
const geometry = require(join(output, 'games/shapes-and-geometry.js'));
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

test('60 reviewed challenges are balanced across four mechanics', () => {
  assert.equal(geometry.geometryChallenges.length, 60);
  assert.equal(new Set(geometry.geometryChallenges.map(challenge => challenge.id)).size, 60);
  assert.deepEqual(Object.fromEntries(geometry.geometryMechanics.map(mechanic => [mechanic, geometry.geometryChallenges.filter(challenge => challenge.mechanic === mechanic).length])), { name: 15, count: 15, object: 15, symmetry: 15 });
  for (const required of ['circle', 'triangle', 'square', 'rectangle', 'oval', 'star', 'heart', 'diamond']) assert.ok(geometry.supportedShapes.includes(required), required);
});

test('every challenge has one valid answer, useful instructions and an explanation', () => {
  for (const challenge of geometry.geometryChallenges) {
    assert.equal(challenge.choices.length, 4, challenge.id);
    assert.equal(new Set(challenge.choices.map(choice => choice.id)).size, 4, challenge.id);
    assert.equal(challenge.choices.filter(choice => choice.id === challenge.correctChoiceId).length, 1, challenge.id);
    assert.ok(challenge.prompt.length > 15, challenge.id);
    assert.ok(challenge.instruction.length > 35, challenge.id);
    assert.ok(challenge.explanation.length > 45, challenge.id);
  }
});

test('shape naming and side or corner facts stay consistent', () => {
  const names = geometry.geometryChallenges.filter(challenge => challenge.mechanic === 'name');
  for (const challenge of names) {
    const shape = challenge.visual.shape;
    assert.equal(challenge.correctChoiceId, `shape-${shape}`);
    assert.ok(geometry.supportedShapes.includes(shape));
    assert.match(challenge.explanation.toLowerCase(), new RegExp(shape));
  }
  const counts = geometry.geometryChallenges.filter(challenge => challenge.mechanic === 'count');
  assert.equal(counts.length, 15);
  for (const challenge of counts) {
    const shape = challenge.visual.shape;
    assert.ok(!['circle', 'oval', 'star', 'heart'].includes(shape), challenge.id);
    const expected = geometry.shapeFacts[shape][challenge.countProperty];
    assert.equal(challenge.correctChoiceId, `number-${expected}`, challenge.id);
    assert.equal(challenge.choices.filter(choice => Number(choice.label) === expected).length, 1, challenge.id);
  }
});

test('object matches and symmetry figures are unambiguous', () => {
  const objects = geometry.geometryChallenges.filter(challenge => challenge.mechanic === 'object');
  assert.equal(objects.length, 15);
  for (const challenge of objects) {
    const expected = geometry.objectShapes[challenge.visual.object];
    assert.equal(challenge.correctChoiceId, `shape-${expected}`, challenge.id);
    assert.match(challenge.explanation, new RegExp(geometry.objectLabels[challenge.visual.object], 'i'));
  }
  const symmetry = geometry.geometryChallenges.filter(challenge => challenge.mechanic === 'symmetry');
  assert.equal(symmetry.length, 15);
  for (const challenge of symmetry) {
    const valid = challenge.choices.filter(choice => geometry.isSymmetricalFigure(choice.figure));
    assert.equal(valid.length, 1, challenge.id);
    assert.equal(valid[0].id, challenge.correctChoiceId, challenge.id);
  }
});

test('200 seeded sessions are deterministic, unique and balanced 3/3/2/2', () => {
  const sequences = new Set();
  const answerPositions = new Set();
  for (let seed = 0; seed < 200; seed++) {
    const session = geometry.generateGeometrySession(seed);
    assert.deepEqual(session, geometry.generateGeometrySession(seed));
    assert.equal(session.length, 10);
    assert.equal(new Set(session.map(challenge => challenge.id)).size, 10);
    assert.deepEqual(Object.fromEntries(geometry.geometryMechanics.map(mechanic => [mechanic, session.filter(challenge => challenge.mechanic === mechanic).length])), { name: 3, count: 3, object: 2, symmetry: 2 });
    for (const challenge of session) {
      assert.equal(challenge.choices.filter(choice => choice.id === challenge.correctChoiceId).length, 1);
      answerPositions.add(challenge.choices.findIndex(choice => choice.id === challenge.correctChoiceId));
    }
    sequences.add(session.map(challenge => challenge.id).join(','));
  }
  assert.ok(sequences.size > 180);
  assert.deepEqual(answerPositions, new Set([0, 1, 2, 3]));
});

test('Learning Journey records geometry without changing old progress or storage schema', () => {
  const available = gameRegistry.filter(game => game.status === 'available');
  assert.equal(available.length, 23);
  assert.equal(available.filter(game => game.subjectId === 'mathematics').length, 3);
  assert.deepEqual(subjectOrder, ['english', 'mathematics', 'science', 'geography', 'logic', 'life-skills']);
  const storage = new MemoryStorage();
  journey.recordLearningSessionStart('addition-level-1', 'old-add', storage);
  journey.recordLearningSessionCompletion('addition-level-1', 'old-add', 7, 10, storage);
  const previous = structuredClone(journey.readLearningJourney(storage).games['addition-level-1']);
  journey.recordLearningSessionStart(geometry.GEOMETRY_GAME_ID, 'geometry-low', storage);
  journey.recordLearningSessionCompletion(geometry.GEOMETRY_GAME_ID, 'geometry-low', 5, 10, storage);
  journey.recordLearningSessionCompletion(geometry.GEOMETRY_GAME_ID, 'geometry-low', 5, 10, storage);
  journey.recordLearningSessionStart(geometry.GEOMETRY_GAME_ID, 'geometry-high', storage);
  journey.recordLearningSessionCompletion(geometry.GEOMETRY_GAME_ID, 'geometry-high', 9, 10, storage);
  const progress = journey.readLearningJourney(storage);
  assert.deepEqual(progress.games['addition-level-1'], previous);
  assert.deepEqual([progress.games[geometry.GEOMETRY_GAME_ID].sessionCount, progress.games[geometry.GEOMETRY_GAME_ID].completedSessionCount, progress.games[geometry.GEOMETRY_GAME_ID].personalBest.correct], [2, 2, 9]);
  assert.equal(progress.games[geometry.GEOMETRY_GAME_ID].subjectId, 'mathematics');
  assert.equal(progress.version, 2);
});

test('legacy imports remain compatible and the existing Maths Mission is unchanged', () => {
  const legacyStorage = new MemoryStorage();
  for (const gameId of ['a-or-an', 'addition-level-1', 'animal-habitats', 'continent-explorer', 'pattern-detective', 'time-detective']) {
    journey.recordLearningSessionStart(gameId, gameId, legacyStorage);
    journey.recordLearningSessionCompletion(gameId, gameId, 6, 10, legacyStorage);
  }
  const legacy = JSON.parse(journey.exportLearningJourney(journey.readLearningJourney(legacyStorage)));
  legacy.version = 1;
  delete legacy.missionEvidence;
  const currentStorage = new MemoryStorage();
  journey.recordLearningSessionStart(geometry.GEOMETRY_GAME_ID, 'geometry', currentStorage);
  journey.recordLearningSessionCompletion(geometry.GEOMETRY_GAME_ID, 'geometry', 8, 10, currentStorage);
  journey.importLearningJourney(journey.parseLearningJourneyImport(JSON.stringify(legacy)), 'merge', currentStorage);
  const merged = journey.readLearningJourney(currentStorage);
  assert.equal(Object.keys(merged.games).length, 7);
  assert.equal(merged.games[geometry.GEOMETRY_GAME_ID].personalBest.correct, 8);
  assert.deepEqual(journey.parseLearningJourneyImport(journey.exportLearningJourney(merged)), merged);
  assert.deepEqual(missions.map(mission => mission.id), ['maths-explorer', 'world-explorer', 'science-detective', 'english-adventurer']);
  assert.deepEqual(missions.find(mission => mission.id === 'maths-explorer').activities.map(activity => activity.id), ['addition-level-1', 'subtraction-level-1', 'worksheet']);
  assert.ok(missions.every(mission => mission.activities.every(activity => activity.gameId !== geometry.GEOMETRY_GAME_ID)));
  assert.equal(getMissionProgress(missions[0], merged).total, 3);
});

test('Resource Finder, roadmap, route, sitemap and ad safeguards include the game', () => {
  assert.deepEqual(validateResourceCatalogue(resourceCatalogue), []);
  assert.equal(resourceCatalogue.length, 75);
  assert.equal(resourceCatalogue.filter(resource => resource.type === 'game').length, 25);
  for (const query of ['shape', 'shapes', 'geometry', 'sides', 'corners', 'symmetry', 'maths', 'math']) {
    const results = searchResources(resourceCatalogue, { query, type: 'game', category: 'mathematics', sort: 'relevance' });
    assert.ok(results.some(result => result.href === '/games/math/shapes-and-geometry'), query);
  }
  for (const path of ['app/games/math/page.tsx', 'app/games/math/shapes-and-geometry/page.tsx']) assert.ok(existsSync(path));
  const registry = gameRegistry.find(game => game.gameId === geometry.GEOMETRY_GAME_ID);
  assert.deepEqual([registry.status, registry.displayOrder, registry.route], ['available', 3, '/games/math/shapes-and-geometry']);
  const sitemap = readFileSync('app/sitemap.ts', 'utf8');
  assert.equal((sitemap.match(/games\/math\/shapes-and-geometry/g) ?? []).length, 1);
  assert.ok(!readFileSync('lib/adsense.ts', 'utf8').includes('/games/math/shapes-and-geometry'));
});

test('UI is keyboard friendly, screen-reader readable and analytics-minimal', () => {
  const source = readFileSync('components/games/shapes-and-geometry-game.tsx', 'utf8');
  for (const required of ['aria-live="polite"', 'role="progressbar"', 'questionHeading', 'resultsHeading', 'focus-visible:ring-2', 'motion-safe:', 'describeSymmetryFigure', 'role={decorative ? undefined : \'img\'}', 'trackAchievementEvents: false']) assert.ok(source.includes(required), required);
  assert.equal((source.match(/trackEvent\(/g) ?? []).length, 2);
  for (const line of source.split('\n').filter(line => line.includes('trackEvent('))) assert.ok(!/score:|answer:|selected|sessionId|question/.test(line));
  assert.ok(!/fetch\(|localStorage|answer_submitted|<img\b/.test(source));
  assert.ok(source.includes('min-h-20') && source.includes('min-h-12'));
});
