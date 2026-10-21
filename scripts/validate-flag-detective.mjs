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

const { flagCountries, flagQuestions, generateFlagRound, regionIds } = loadTypeScriptModule('lib/games/flag-detective.ts');
const expectedTypes = new Set(['guess-country', 'find-flag', 'detective-clue', 'flag-fact']);

assert.equal(flagCountries.length, 54, 'The dataset must contain 54 countries.');
assert.equal(new Set(flagCountries.map(({ id }) => id)).size, 54, 'Country IDs must be unique.');
assert.equal(new Set(flagCountries.map(({ iso2 }) => iso2)).size, 54, 'ISO codes must be unique.');
for (const region of regionIds) assert.equal(flagCountries.filter((item) => item.region === region).length, 9, `${region} must contain nine countries.`);
for (const item of flagCountries) {
  assert.match(item.iso2, /^[A-Z]{2}$/, `${item.id} has an invalid ISO alpha-2 code.`);
  assert.ok(fs.existsSync(`public${item.asset}`), `${item.id} is missing its local SVG asset.`);
  assert.match(fs.readFileSync(`public${item.asset}`, 'utf8'), /<svg[\s>]/i, `${item.id} is not an SVG.`);
}

assert.equal(flagQuestions.length, 96, 'The question bank must contain 96 questions.');
assert.equal(new Set(flagQuestions.map(({ id }) => id)).size, 96, 'Question IDs must be unique.');
assert.deepEqual(new Set(flagQuestions.map(({ type }) => type)), expectedTypes, 'All four question types must be present.');
for (const question of flagQuestions) {
  assert.equal(question.level, 'level-1', `${question.id} has an invalid level.`);
  assert.equal(question.options.length, 4, `${question.id} must have four options.`);
  assert.equal(new Set(question.options).size, 4, `${question.id} has duplicate options.`);
  assert.ok(question.options.includes(question.correctAnswer), `${question.id} omits its correct answer.`);
  for (const option of question.options) assert.ok(flagCountries.some(({ id }) => id === option), `${question.id} has an unknown option.`);
}

for (let run = 0; run < 200; run += 1) {
  const round = generateFlagRound();
  assert.equal(round.length, 10, 'A session must contain ten questions.');
  assert.equal(new Set(round.map(({ id }) => id)).size, 10, 'A session must not repeat question IDs.');
  assert.equal(new Set(round.map(({ correctAnswer }) => correctAnswer)).size, 10, 'A session must not repeat target countries.');
  assert.deepEqual(new Set(round.map(({ type }) => type)), expectedTypes, 'Every session must contain all four types.');
  for (const question of round) assert.ok(question.options.includes(question.correctAnswer), `${question.id} lost its answer while shuffling.`);
}

console.log('Flag Detective validation passed: 54 countries, 96 questions, six balanced regions, and 200 valid sessions.');
