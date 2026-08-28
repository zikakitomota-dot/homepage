import assert from 'node:assert/strict';
import test from 'node:test';
import { generateAdditionRound, getAdditionRoundMix } from '../lib/games/addition-level-one.ts';

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

for (const difficulty of ['easy', 'normal', 'challenge']) {
  test(`${difficulty} rounds stay mathematically valid`, () => {
    const expectedMix = getAdditionRoundMix(difficulty);
    const maximumAnswer = difficulty === 'easy' ? 10 : 20;

    for (let seed = 1; seed <= 250; seed += 1) {
      const round = generateAdditionRound(difficulty, seededRandom(seed));
      assert.equal(round.length, 10);
      assert.equal(round.filter((question) => question.kind === 'equation').length, expectedMix.equations);
      assert.equal(round.filter((question) => question.kind === 'wordProblem').length, expectedMix.wordProblems);

      const pairKeys = new Set();
      for (const question of round) {
        const [first, second] = question.operands;
        assert.equal(question.correctAnswer, first + second);
        assert.ok(question.correctAnswer >= 1 && question.correctAnswer <= maximumAnswer);
        assert.equal(question.choices.length, 4);
        assert.equal(new Set(question.choices).size, 4);
        assert.ok(question.choices.includes(question.correctAnswer));
        assert.ok(question.choices.every((choice) => Number.isInteger(choice) && choice >= 1));
        assert.equal(question.difficulty, difficulty);
        assert.ok(!question.prompt.includes('−') && !question.prompt.includes('×'));

        const pairKey = [first, second].sort((a, b) => a - b).join('+');
        assert.ok(!pairKeys.has(pairKey), `duplicate pair ${pairKey}`);
        pairKeys.add(pairKey);
      }
    }
  });
}

test('different random seeds produce a fresh round', () => {
  const first = generateAdditionRound('normal', seededRandom(101));
  const second = generateAdditionRound('normal', seededRandom(102));
  assert.notDeepEqual(first.map((question) => question.id), second.map((question) => question.id));
});

