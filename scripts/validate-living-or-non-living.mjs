import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = fs.readFileSync('lib/games/living-or-non-living.ts', 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const loadedModule = { exports: {} };
vm.runInNewContext(output, { module: loadedModule, exports: loadedModule.exports, Math, Set, Array, Object });
const { livingQuestions, generateLivingRound } = loadedModule.exports;
const types = new Set(['identify', 'sorting', 'evidence', 'detective']);
const validAnswers = new Set(['living', 'non-living']);

assert.equal(livingQuestions.length, 60, 'The bank must contain exactly 60 challenges.');
assert.equal(new Set(livingQuestions.map(({ id }) => id)).size, 60, 'Question IDs must be unique.');
assert.deepEqual(new Set(livingQuestions.map(({ type }) => type)), types, 'All four challenge types must be present.');
for (const type of types) assert.equal(livingQuestions.filter((question) => question.type === type).length, 15, `${type} must contain 15 challenges.`);

for (const question of livingQuestions) {
  assert.ok(question.prompt.length > 10, `${question.id} needs a clear prompt.`);
  assert.ok(question.explanation.length > 20, `${question.id} needs educational feedback.`);
  if (question.type === 'sorting') {
    assert.equal(question.items.length, 4, `${question.id} must contain four sorting items.`);
    assert.equal(new Set(question.items.map(({ id }) => id)).size, 4, `${question.id} repeats a sorting item.`);
    assert.ok(question.items.some(({ classification }) => classification === 'living'), `${question.id} has no living item.`);
    assert.ok(question.items.some(({ classification }) => classification === 'non-living'), `${question.id} has no non-living item.`);
    for (const sortingItem of question.items) {
      assert.ok(validAnswers.has(sortingItem.classification), `${sortingItem.id} has an invalid sorting classification.`);
      if (sortingItem.lifeState === 'once-living') assert.equal(sortingItem.classification, 'non-living', `${sortingItem.id} must be non-living now.`);
    }
  } else {
    assert.equal(question.choices.length, 2, `${question.id} must have two choices.`);
    assert.equal(new Set(question.choices).size, 2, `${question.id} has duplicate choices.`);
    assert.ok(question.choices.includes(question.correctAnswer), `${question.id} omits its answer.`);
    assert.equal(question.correctAnswer, question.item.classification, `${question.id} disagrees with its item classification.`);
    if (question.item.lifeState === 'once-living') assert.equal(question.correctAnswer, 'non-living', `${question.id} must say non-living now.`);
  }
}

for (let run = 0; run < 200; run += 1) {
  const round = generateLivingRound();
  assert.equal(round.length, 10, 'A session must contain ten challenges.');
  assert.equal(new Set(round.map(({ id }) => id)).size, 10, 'A session repeats a question ID.');
  assert.deepEqual(new Set(round.map(({ type }) => type)), types, 'A session omits a challenge type.');
  assert.equal(round.filter(({ type }) => type === 'identify').length, 3, 'A session must have three identify challenges.');
  assert.equal(round.filter(({ type }) => type === 'sorting').length, 3, 'A session must have three sorting challenges.');
  assert.equal(round.filter(({ type }) => type === 'evidence').length, 2, 'A session must have two evidence challenges.');
  assert.equal(round.filter(({ type }) => type === 'detective').length, 2, 'A session must have two detective challenges.');
}

console.log('Living or Non-Living validation passed: 60 balanced challenges, all sorting answers verified, and 200 valid ten-question sessions.');
