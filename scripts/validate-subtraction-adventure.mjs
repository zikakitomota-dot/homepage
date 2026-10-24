import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync('lib/games/subtraction-level-one.ts', 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loadedModule = { exports: {} };
vm.runInNewContext(output, { module: loadedModule, exports: loadedModule.exports, Math, Set, Array });
const { subtractionQuestions, generateSubtractionRound } = loadedModule.exports;
const types = new Set(['picture', 'number', 'missing-number', 'number-line']);

assert.equal(subtractionQuestions.length, 60, 'The question bank must contain 60 challenges.');
assert.equal(new Set(subtractionQuestions.map(({ id }) => id)).size, 60, 'Question IDs must be unique.');
assert.deepEqual(new Set(subtractionQuestions.map(({ type }) => type)), types, 'All four types must be present.');
for (const type of types) assert.equal(subtractionQuestions.filter((question) => question.type === type).length, 15, `${type} must contain 15 challenges.`);
assert.equal(new Set(subtractionQuestions.map(({ minuend, subtrahend }) => `${minuend}-${subtrahend}`)).size, 60, 'Equivalent calculations must not repeat in the bank.');

for (const question of subtractionQuestions) {
  const expected = question.type === 'missing-number' ? question.subtrahend : question.minuend - question.subtrahend;
  assert.equal(expected, question.correctAnswer, `${question.id} has an incorrect answer.`);
  assert.ok(question.correctAnswer >= 0, `${question.id} has a negative answer.`);
  assert.ok(question.minuend <= 20, `${question.id} exceeds Level 1 range.`);
  assert.equal(question.choices.length, 4, `${question.id} must have four choices.`);
  assert.equal(new Set(question.choices).size, 4, `${question.id} has duplicate choices.`);
  assert.ok(question.choices.includes(question.correctAnswer), `${question.id} omits its correct answer.`);
}

for (let run = 0; run < 200; run += 1) {
  const round = generateSubtractionRound();
  assert.equal(round.length, 10, 'A session must contain ten questions.');
  assert.equal(new Set(round.map(({ id }) => id)).size, 10, 'A session must have unique question IDs.');
  assert.deepEqual(new Set(round.map(({ type }) => type)), types, 'Every session must contain all four types.');
  for (const question of round) {
    const expected = question.type === 'missing-number' ? question.subtrahend : question.minuend - question.subtrahend;
    assert.equal(expected, question.correctAnswer, `${question.id} changed answer.`);
    assert.ok(question.choices.includes(question.correctAnswer), `${question.id} lost its correct choice.`);
  }
}

console.log('Subtraction Adventure validation passed: 60 unique calculations, four balanced types, and 200 valid ten-question sessions.');
