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

const bank = loadTypeScriptModule('lib/games/continent-explorer.ts');
const map = loadTypeScriptModule('lib/games/continent-map-paths.ts');
const { continentIds, continentQuestions, generateContinentRound } = bank;

assert.equal(continentQuestions.length, 42, 'The Level 1 bank must contain 42 questions.');
assert.equal(new Set(continentQuestions.map(({ id }) => id)).size, continentQuestions.length, 'Question IDs must be unique.');
assert.deepEqual(new Set(continentQuestions.map(({ type }) => type)), new Set(['identify', 'country', 'map', 'fact']), 'All four question types must be present.');

for (const question of continentQuestions) {
  assert.ok(continentIds.includes(question.correctAnswer), `${question.id} has an invalid correct answer.`);
  assert.equal(question.difficulty, 'level-1', `${question.id} has an invalid difficulty.`);
  if (question.type !== 'map') assert.ok(question.options?.includes(question.correctAnswer), `${question.id} options omit the correct answer.`);
}

for (const continent of continentIds) {
  assert.ok(map.continentMapPaths[continent]?.length > 0, `${continent} has no map geometry.`);
}

for (let run = 0; run < 100; run += 1) {
  const round = generateContinentRound();
  assert.equal(round.length, 10, 'A session must contain 10 questions.');
  assert.equal(new Set(round.map(({ id }) => id)).size, 10, 'A session must not repeat a question.');
  assert.deepEqual(new Set(round.map(({ type }) => type)), new Set(['identify', 'country', 'map', 'fact']), 'Every session must contain all four challenge types.');
  for (const question of round) {
    if (question.options) assert.ok(question.options.includes(question.correctAnswer), `${question.id} lost its answer while shuffling.`);
  }
}

console.log('Continent Explorer validation passed: 42 questions, four types, seven mapped continents, and 100 unique 10-question sessions.');
