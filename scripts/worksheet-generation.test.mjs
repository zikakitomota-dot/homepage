import assert from 'node:assert/strict';
import test from 'node:test';
import { generateMathematicsWorksheet, validateMathematicsWorksheet } from '../lib/worksheets/mathematics-level-one.ts';

const topics = ['addition', 'subtraction', 'mixed'];
const layouts = ['classic', 'visual', 'missing-number'];
const ranges = [10, 20];
const counts = [10, 20, 30];

test('216 worksheet configurations remain mathematically valid', () => {
  let runs = 0;
  for (const topic of topics) for (const layout of layouts) for (const range of ranges) for (const questionCount of counts) for (let seed = 1; seed <= 4; seed += 1) {
    const config = { topic, layout, range, questionCount, seed: `validation-${seed}` };
    const worksheet = generateMathematicsWorksheet(config, '2026-01-01T00:00:00.000Z');
    assert.deepEqual(validateMathematicsWorksheet(worksheet), [], `${topic}/${layout}/${range}/${questionCount}/${seed}`);
    assert.equal(worksheet.questions.length, questionCount);
    assert.equal(new Set(worksheet.questions.map((question) => `${question.operator}|${question.operator === '+' ? [question.first, question.second].sort((a, b) => a - b).join('|') : `${question.first}|${question.second}`}`)).size, questionCount);
    if (topic === 'subtraction' || topic === 'mixed') assert.ok(worksheet.questions.filter((question) => question.operator === '−').every((question) => question.answer >= 0));
    if (layout === 'missing-number') assert.ok(worksheet.questions.every((question) => question.prompt.includes('__') && question.missingValue === question.second));
    runs += 1;
  }
  assert.equal(runs, 216);
});

test('the same seed and configuration reproduce the exact worksheet', () => {
  const config = { topic: 'mixed', layout: 'visual', range: 20, questionCount: 30, seed: 'repeatable' };
  const first = generateMathematicsWorksheet(config, '2026-01-01T00:00:00.000Z');
  const second = generateMathematicsWorksheet(config, '2026-02-01T00:00:00.000Z');
  assert.equal(first.id, second.id);
  assert.deepEqual(first.questions, second.questions);
});

test('different seeds provide a different valid variation', () => {
  const base = { topic: 'addition', layout: 'classic', range: 10, questionCount: 10 };
  const first = generateMathematicsWorksheet({ ...base, seed: 'one' });
  const second = generateMathematicsWorksheet({ ...base, seed: 'two' });
  assert.notDeepEqual(first.questions, second.questions);
  assert.deepEqual(validateMathematicsWorksheet(first), []);
  assert.deepEqual(validateMathematicsWorksheet(second), []);
});
