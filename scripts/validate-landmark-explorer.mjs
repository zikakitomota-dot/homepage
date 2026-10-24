import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function loadTypeScriptModule(path) {
  const source = fs.readFileSync(path, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const loadedModule = { exports: {} };
  vm.runInNewContext(output, { module: loadedModule, exports: loadedModule.exports, Math, Set, Error });
  return loadedModule.exports;
}

const { landmarkContinents, landmarks, landmarkQuestions, generateLandmarkRound } = loadTypeScriptModule('lib/games/landmark-explorer.ts');
const sources = JSON.parse(fs.readFileSync('public/images/landmarks/sources.json', 'utf8'));
const expectedTypes = new Set(['recognise-landmark', 'find-country', 'match-continent', 'landmark-detective']);

assert.equal(landmarks.length, 30, 'The dataset must contain 30 landmarks.');
assert.equal(new Set(landmarks.map(({ id }) => id)).size, 30, 'Landmark IDs must be unique.');
assert.ok(landmarks.some(({ kind }) => kind === 'built'), 'Built landmarks are required.');
assert.ok(landmarks.some(({ kind }) => kind === 'natural'), 'Natural landmarks are required.');
for (const continent of landmarkContinents) assert.equal(landmarks.filter((item) => item.continent === continent).length, 5, `${continent} must contain five landmarks.`);
for (const item of landmarks) {
  assert.ok(fs.existsSync(`public${item.image}`), `${item.id} is missing its local image.`);
  assert.ok(item.imageDescription && !item.imageDescription.toLowerCase().includes(item.name.toLowerCase()), `${item.id} needs a non-revealing image description.`);
  assert.ok(item.features.length >= 3, `${item.id} needs at least three features.`);
  const source = sources.find(({ id }) => id === item.id);
  assert.ok(source, `${item.id} is missing from the source manifest.`);
  assert.ok(source.author, `${item.id} is missing its public author credit.`);
  assert.ok(source.license === 'Public domain' || source.licenseUrl, `${item.id} is missing its licence URL.`);
  assert.equal(item.sourcePage, source.sourcePage, `${item.id} source URL differs from the verified manifest.`);
  assert.equal(item.licence.toLowerCase(), source.license.toLowerCase(), `${item.id} licence differs from the verified manifest.`);
}

assert.equal(landmarkQuestions.length, 60, 'The question bank must contain 60 questions.');
assert.equal(new Set(landmarkQuestions.map(({ id }) => id)).size, 60, 'Question IDs must be unique.');
assert.deepEqual(new Set(landmarkQuestions.map(({ type }) => type)), expectedTypes, 'All four question types must be present.');
for (const type of expectedTypes) assert.equal(landmarkQuestions.filter((question) => question.type === type).length, 15, `${type} must contain 15 questions.`);
for (const question of landmarkQuestions) {
  assert.equal(question.options.length, question.type === 'match-continent' ? 6 : 4, `${question.id} has the wrong number of options.`);
  assert.equal(new Set(question.options).size, question.options.length, `${question.id} has duplicate options.`);
  assert.ok(question.options.includes(question.correctAnswer), `${question.id} omits its answer.`);
  assert.equal(question.level, 'level-1', `${question.id} has an invalid level.`);
}

for (let run = 0; run < 200; run += 1) {
  const round = generateLandmarkRound();
  assert.equal(round.length, 10, 'A session must contain ten questions.');
  assert.equal(new Set(round.map(({ id }) => id)).size, 10, 'A session must not repeat question IDs.');
  assert.equal(new Set(round.map(({ landmarkId }) => landmarkId)).size, 10, 'A session must not repeat target landmarks.');
  assert.deepEqual(new Set(round.map(({ type }) => type)), expectedTypes, 'Every session must contain all four question types.');
  for (const question of round) assert.ok(question.options.includes(question.correctAnswer), `${question.id} lost its answer while shuffling.`);
}

console.log('Landmark Explorer validation passed: 30 landmarks, six balanced regions, 60 questions, four balanced types, verified local assets, and 200 valid sessions.');
