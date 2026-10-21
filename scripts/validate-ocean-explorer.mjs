import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadTypeScriptModule(path) {
  const source = fs.readFileSync(path, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(output, { module: loadedModule, exports: loadedModule.exports, Math });
  return loadedModule.exports;
}

const { oceanIds, oceanQuestions, generateOceanRound } = loadTypeScriptModule('lib/games/ocean-explorer.ts');
const expectedTypes = new Set(['identify', 'map', 'relationship', 'fact']);

assert.equal(oceanQuestions.length, 40, 'The Level 1 bank must contain 40 questions.');
assert.equal(new Set(oceanQuestions.map(({ id }) => id)).size, oceanQuestions.length, 'Question IDs must be unique.');
assert.deepEqual(new Set(oceanQuestions.map(({ type }) => type)), expectedTypes, 'All four question types must be present.');

for (const question of oceanQuestions) {
  assert.ok(oceanIds.includes(question.correctAnswer), `${question.id} has an invalid correct answer.`);
  assert.equal(question.difficulty, 'level-1', `${question.id} has an invalid difficulty.`);
  if (question.type !== 'map') assert.ok(question.options?.includes(question.correctAnswer), `${question.id} options omit the correct answer.`);
  if (question.type === 'identify' || question.type === 'map') assert.equal(question.mapIdentifier, question.correctAnswer, `${question.id} has an incorrect map identifier.`);
}

for (const ocean of oceanIds) {
  assert.ok(oceanQuestions.some((question) => question.type === 'identify' && question.correctAnswer === ocean), `${ocean} has no identify question.`);
  assert.ok(oceanQuestions.some((question) => question.type === 'map' && question.correctAnswer === ocean), `${ocean} has no map question.`);
}

for (let run = 0; run < 200; run += 1) {
  const round = generateOceanRound();
  assert.equal(round.length, 10, 'A session must contain 10 questions.');
  assert.equal(new Set(round.map(({ id }) => id)).size, 10, 'A session must not repeat a question.');
  assert.deepEqual(new Set(round.map(({ type }) => type)), expectedTypes, 'Every session must contain all four challenge types.');
  for (const question of round) {
    if (question.options) assert.ok(question.options.includes(question.correctAnswer), `${question.id} lost its answer while shuffling.`);
  }
}

console.log('Ocean Explorer validation passed: 40 questions, four types, five mapped oceans, and 200 unique 10-question sessions.');
