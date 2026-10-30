import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const output = mkdtempSync(join(tmpdir(), 'zalea-money-match-'));
const compile = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', 'lib/games/money-match.ts', 'lib/games/time-detective.ts', 'lib/games/learning-journey.ts', 'lib/games/missions.ts', 'lib/resources/catalogue.ts', 'lib/resources/search.ts', '--rootDir', 'lib', '--module', 'commonjs', '--target', 'es2022', '--outDir', output, '--esModuleInterop', '--skipLibCheck'], { encoding: 'utf8' });
if (compile.status !== 0) throw Error(compile.stdout + compile.stderr);
const require = createRequire(import.meta.url);
const money = require(join(output, 'games/money-match.js'));
const time = require(join(output, 'games/time-detective.js'));
const journey = require(join(output, 'games/learning-journey.js'));
const { gameRegistry } = require(join(output, 'games/registry.js'));
const { missions } = require(join(output, 'games/missions.js'));
const { resourceCatalogue, validateResourceCatalogue } = require(join(output, 'resources/catalogue.js'));
const { searchResources } = require(join(output, 'resources/search.js'));
process.on('exit', () => rmSync(output, { recursive: true, force: true }));

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, value); }
  removeItem(key) { this.values.delete(key); }
}

test('MYR and USD configurations contain the verified denominations and extensible unit rules', () => {
  assert.deepEqual(money.moneyCurrencyCodes, ['MYR', 'USD']);
  for (const code of money.moneyCurrencyCodes) {
    const config = money.moneyCurrencies[code];
    assert.deepEqual(money.validateCurrencyConfig(config), []);
    assert.equal(config.code, code); assert.equal(config.minorUnitsPerMajor, 100); assert.equal(config.minorUnitDigits, 2); assert.equal(config.smallestExerciseIncrement, 5);
    assert.ok(config.cashGuidance.length > 70);
    assert.ok(config.denominations.every(item => item.accessibleLabel && item.visual.pattern && item.visual.shape));
  }
  assert.deepEqual(money.moneyCurrencies.MYR.denominations.map(item => item.value), [5, 10, 20, 50, 100, 500, 1000, 2000, 5000, 10000]);
  assert.deepEqual(money.moneyCurrencies.USD.denominations.map(item => item.value), [1, 5, 10, 25, 100, 500, 1000, 2000, 5000, 10000]);
  assert.equal(money.getMoneyDenomination('USD', 'usd-1').educational, false);
  assert.equal(money.getMoneyDenomination('MYR', 'myr-100').kind, 'banknote');
});

test('formatting and labels use integer minor units without symbol-only speech', () => {
  assert.equal(money.formatMoney(5, 'MYR'), 'RM0.05');
  assert.equal(money.formatMoney(1235, 'MYR'), 'RM12.35');
  assert.equal(money.formatMoney(5, 'USD'), '$0.05');
  assert.equal(money.formatMoney(1025, 'USD'), '$10.25');
  assert.equal(money.formatAccessibleMoney(5, 'MYR'), '5 sen');
  assert.equal(money.formatAccessibleMoney(125, 'MYR'), '1 ringgit and 25 sen');
  assert.equal(money.formatAccessibleMoney(100, 'USD'), '1 dollar');
  assert.equal(money.formatAccessibleMoney(225, 'USD'), '2 dollars and 25 cents');
  assert.throws(() => money.formatMoney(1.5, 'USD'), /integer minor units/);
});

test('each currency has 80 unique challenges balanced across four mechanics', () => {
  for (const code of money.moneyCurrencyCodes) {
    const bank = money.moneyChallengeBanks[code];
    assert.equal(bank.length, 80); assert.equal(new Set(bank.map(challenge => challenge.id)).size, 80);
    assert.deepEqual(Object.fromEntries(money.moneyMechanics.map(mechanic => [mechanic, bank.filter(challenge => challenge.mechanic === mechanic).length])), { count: 20, match: 20, pay: 20, change: 20 });
    assert.ok(bank.every(challenge => challenge.currency === code && challenge.answerAmount % 5 === 0));
    assert.ok(bank.flatMap(challenge => [...challenge.displayMoney, ...challenge.choices.flatMap(choice => choice.denominationIds)]).every(id => id !== 'usd-1'));
  }
});

test('all challenge arithmetic, distractors, prices and change are exact', () => {
  for (const code of money.moneyCurrencyCodes) for (const challenge of money.moneyChallengeBanks[code]) {
    assert.ok(challenge.prompt.length > 12 && challenge.instruction.length > 20 && challenge.explanation.length > 35, challenge.id);
    if (challenge.mechanic === 'count') assert.equal(money.sumMoney(challenge.displayMoney, code), challenge.answerAmount, challenge.id);
    if (challenge.mechanic === 'match') assert.equal(challenge.price, challenge.answerAmount, challenge.id);
    if (challenge.mechanic === 'pay') {
      assert.equal(challenge.interaction, 'payment'); assert.deepEqual(challenge.choices, []); assert.equal(challenge.correctChoiceId, null);
      assert.ok(money.canPayExact(challenge.answerAmount, code), challenge.id);
    } else {
      assert.equal(challenge.interaction, 'choice'); assert.equal(challenge.choices.length, 4, challenge.id);
      assert.equal(new Set(challenge.choices.map(choice => choice.amount)).size, 4, challenge.id);
      assert.equal(challenge.choices.filter(choice => choice.id === challenge.correctChoiceId).length, 1, challenge.id);
      assert.equal(challenge.choices.find(choice => choice.id === challenge.correctChoiceId).amount, challenge.answerAmount, challenge.id);
      for (const choice of challenge.choices) assert.equal(money.sumMoney(choice.denominationIds, code), choice.amount, `${challenge.id}:${choice.id}`);
    }
    if (challenge.mechanic === 'change') {
      assert.ok(challenge.paid >= challenge.price, challenge.id);
      assert.equal(challenge.paid - challenge.price, challenge.answerAmount, challenge.id);
      assert.equal(money.sumMoney(challenge.displayMoney, code), challenge.paid, challenge.id);
    }
  }
});

test('every mathematically valid exact-payment combination is accepted by total', () => {
  assert.ok(money.isExactPayment(['myr-100'], 100, 'MYR'));
  assert.ok(money.isExactPayment(['myr-50', 'myr-50'], 100, 'MYR'));
  assert.ok(money.isExactPayment(['myr-20', 'myr-20', 'myr-20', 'myr-20', 'myr-20'], 100, 'MYR'));
  assert.ok(money.isExactPayment(['usd-100'], 100, 'USD'));
  assert.ok(money.isExactPayment(['usd-25', 'usd-25', 'usd-25', 'usd-25'], 100, 'USD'));
  assert.ok(money.isExactPayment(['usd-10', 'usd-10', 'usd-10', 'usd-10', 'usd-10', 'usd-10', 'usd-10', 'usd-10', 'usd-10', 'usd-10'], 100, 'USD'));
  assert.equal(money.isExactPayment(['usd-25', 'usd-25'], 100, 'USD'), false);
  for (const code of money.moneyCurrencyCodes) for (let amount = 5; amount <= 2000; amount += 5) assert.ok(money.canPayExact(amount, code), `${code}:${amount}`);
});

test('1,600 generated sessions are deterministic, unique and mode-correct', () => {
  const expected = { intro: { count: 4, match: 3, pay: 3, change: 0 }, full: { count: 3, match: 3, pay: 2, change: 2 } };
  for (const code of money.moneyCurrencyCodes) for (const mode of money.moneyModes) {
    const sequences = new Set();
    for (let seed = 0; seed < 400; seed++) {
      const session = money.generateMoneySession(seed, code, mode);
      assert.deepEqual(session, money.generateMoneySession(seed, code, mode));
      assert.equal(session.length, 10); assert.equal(new Set(session.map(challenge => challenge.id)).size, 10);
      assert.deepEqual(Object.fromEntries(money.moneyMechanics.map(mechanic => [mechanic, session.filter(challenge => challenge.mechanic === mechanic).length])), expected[mode]);
      assert.ok(session.every(challenge => challenge.currency === code));
      sequences.add(session.map(challenge => challenge.id).join(','));
    }
    assert.ok(sequences.size > 250, `${code}:${mode} variation`);
  }
});

test('explicit currency preference is browser-local, validated and defaults to MYR', () => {
  const storage = new MemoryStorage(); assert.equal(money.readMoneyCurrencyPreference(storage), 'MYR');
  assert.equal(money.saveMoneyCurrencyPreference('USD', storage), true); assert.equal(money.readMoneyCurrencyPreference(storage), 'USD');
  storage.setItem(money.MONEY_CURRENCY_STORAGE_KEY, 'GBP'); assert.equal(money.readMoneyCurrencyPreference(storage), 'MYR');
});

test('Journey records optional currency/mode context without changing score or legacy data', () => {
  const storage = new MemoryStorage();
  journey.recordLearningSessionStart(time.TIME_GAME_ID, 'time-old', storage); journey.recordLearningSessionCompletion(time.TIME_GAME_ID, 'time-old', 8, 10, storage);
  const previousTime = structuredClone(journey.readLearningJourney(storage).games[time.TIME_GAME_ID]);
  journey.recordLearningSessionStart(money.MONEY_GAME_ID, 'myr-intro', storage, '2026-10-29T00:00:00.000Z', { currency: 'MYR', mode: 'intro' });
  journey.recordLearningSessionCompletion(money.MONEY_GAME_ID, 'myr-intro', 6, 10, storage, '2026-10-29T00:01:00.000Z');
  journey.recordLearningSessionCompletion(money.MONEY_GAME_ID, 'myr-intro', 6, 10, storage, '2026-10-29T00:02:00.000Z');
  journey.recordLearningSessionStart(money.MONEY_GAME_ID, 'usd-full', storage, '2026-10-29T00:03:00.000Z', { currency: 'USD', mode: 'full' });
  journey.recordLearningSessionCompletion(money.MONEY_GAME_ID, 'usd-full', 9, 10, storage, '2026-10-29T00:04:00.000Z');
  const progress = journey.readLearningJourney(storage);
  assert.deepEqual(progress.games[time.TIME_GAME_ID], previousTime);
  assert.deepEqual([progress.games[money.MONEY_GAME_ID].sessionCount, progress.games[money.MONEY_GAME_ID].completedSessionCount, progress.games[money.MONEY_GAME_ID].personalBest.correct], [2, 2, 9]);
  assert.deepEqual(progress.recordedSessions.filter(session => session.gameId === money.MONEY_GAME_ID).map(session => session.context), [{ currency: 'MYR', mode: 'intro' }, { currency: 'USD', mode: 'full' }]);
  const imported = journey.parseLearningJourneyImport(journey.exportLearningJourney(progress)); assert.deepEqual(imported, progress);
  const legacy = JSON.parse(journey.exportLearningJourney(progress)); legacy.version = 1; delete legacy.missionEvidence; assert.ok(journey.sanitizeJourney(legacy));
});

test('registry, Finder, Missions, sitemap and AdSense safeguards are integrated', () => {
  assert.equal(gameRegistry.filter(game => game.status === 'available').length, 22);
  assert.deepEqual(missions.map(mission => mission.id), ['maths-explorer', 'world-explorer', 'science-detective', 'english-adventurer']);
  assert.ok(missions.every(mission => mission.activities.every(activity => activity.gameId !== money.MONEY_GAME_ID)));
  assert.deepEqual(validateResourceCatalogue(resourceCatalogue), []); assert.equal(resourceCatalogue.length, 72); assert.equal(resourceCatalogue.filter(resource => resource.type === 'game').length, 22);
  for (const query of ['money', 'coins', 'banknotes', 'ringgit', 'MYR', 'dollar', 'USD', 'exact payment', 'change']) {
    const results = searchResources(resourceCatalogue, { query, type: 'game', category: 'life-skills', sort: 'relevance' });
    assert.equal(results[0]?.href, '/games/life-skills/money-match', query);
  }
  assert.ok(existsSync('app/games/life-skills/money-match/page.tsx'));
  const sitemap = readFileSync('app/sitemap.ts', 'utf8'); assert.ok(sitemap.includes("'/games/life-skills/money-match'"));
  assert.ok(!readFileSync('lib/adsense.ts', 'utf8').includes('/games/life-skills'));
});

test('UI includes accessible payment controls, locked running settings and minimal analytics', () => {
  const source = readFileSync('components/games/money-match-game.tsx', 'utf8');
  for (const required of ['data-denomination-id', 'data-remove-denomination', 'Reset selected money', 'aria-live="polite"', 'formatAccessibleMoney', 'phase !== \'settings\'', 'MONEY_CURRENCY_STORAGE_KEY', 'motion-safe:', 'trackAchievementEvents: false']) assert.ok(source.includes(required), required);
  assert.equal((source.match(/trackEvent\(/g) ?? []).length, 2);
  for (const line of source.split('\n').filter(line => line.includes('trackEvent('))) assert.ok(!/currency|answer|payment|score|sessionId/.test(line));
  assert.ok(!/fetch\(|<img|https?:\/\//.test(source));
});
