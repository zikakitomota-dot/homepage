import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const output = mkdtempSync(join(tmpdir(), 'zalea-english-worksheet-'));
const compile = spawnSync(process.execPath, ['node_modules/typescript/bin/tsc', 'lib/worksheets/english-level-one.ts', 'lib/worksheets/english-pdf.ts', 'lib/games/english-games.ts', 'lib/games/article-questions.ts', 'lib/games/level-one-expansions.ts', 'lib/games/types.ts', '--module', 'commonjs', '--target', 'es2022', '--outDir', output, '--esModuleInterop', '--skipLibCheck', '--lib', 'es2022,dom'], { cwd: process.cwd(), encoding: 'utf8' });
if (compile.status !== 0) throw new Error(`Test compilation failed:\n${compile.stdout}\n${compile.stderr}`);
const require = createRequire(import.meta.url);
const generator = require(join(output, 'worksheets', 'english-level-one.js'));
const pdf = require(join(output, 'worksheets', 'english-pdf.js'));
process.on('exit', () => rmSync(output, { recursive: true, force: true }));

const layouts = ['fill-blank', 'choose-correct', 'mixed-practice'];
const counts = [10, 20, 30];

test('297 English worksheet combinations remain valid and balanced', () => {
  let runs = 0;
  for (const topic of [...generator.englishWorksheetTopics, 'mixed']) for (const layout of layouts) for (const questionCount of counts) for (let seed = 1; seed <= 3; seed += 1) {
    const config = { topic, layout, questionCount, seed: `english-validation-${seed}` };
    const worksheet = generator.generateEnglishWorksheet(config, '2026-01-01T00:00:00.000Z');
    assert.deepEqual(generator.validateEnglishWorksheet(worksheet), [], `${topic}/${layout}/${questionCount}/${seed}`);
    assert.equal(worksheet.questions.length, questionCount);
    assert.equal(new Set(worksheet.questions.map((question) => question.id)).size, questionCount);
    if (topic !== 'mixed') assert.ok(worksheet.questions.every((question) => question.topic === topic));
    runs += 1;
  }
  assert.equal(runs, 297);
});

test('seeds reproduce exact English worksheets and variations differ', () => {
  const config = { topic: 'mixed', layout: 'mixed-practice', questionCount: 30, seed: 'repeatable' };
  const first = generator.generateEnglishWorksheet(config, '2026-01-01T00:00:00.000Z');
  const second = generator.generateEnglishWorksheet(config, '2026-02-01T00:00:00.000Z');
  assert.equal(first.id, second.id);
  assert.deepEqual(first.questions, second.questions);
  assert.notDeepEqual(first.questions, generator.generateEnglishWorksheet({ ...config, seed: 'different' }).questions);
});

test('mixed worksheets never repeat shared prompts across grammar subjects', () => {
  for (const layout of layouts) for (let seed = 0; seed < 200; seed += 1) {
    const worksheet = generator.generateEnglishWorksheet({ topic: 'mixed', layout, questionCount: 30, seed: `duplicate-audit-${seed}` });
    assert.deepEqual(generator.validateEnglishWorksheet(worksheet), []);
    assert.equal(new Set(worksheet.questions.map(({prompt}) => prompt)).size, 30);
  }
});

test('answers stay tied to reviewed choices and explanations', () => {
  for (const topic of generator.englishWorksheetTopics) {
    const worksheet = generator.generateEnglishWorksheet({ topic, layout: 'choose-correct', questionCount: 30, seed: 'answer-audit' });
    worksheet.questions.forEach((question) => {
      assert.ok(question.choices.includes(question.answer));
      assert.ok(question.explanation.length > 10);
    });
  }
});

test('A4 PDF contains complete worksheet and answer-key page sets', async () => {
  const worksheet = generator.generateEnglishWorksheet({ topic: 'mixed', layout: 'mixed-practice', questionCount: 30, seed: 'pdf-audit' });
  const blob = pdf.createEnglishWorksheetPdf(worksheet, true);
  const source = Buffer.from(await blob.arrayBuffer()).toString('latin1');
  assert.ok(source.startsWith('%PDF-1.4'));
  assert.ok((source.match(/\/Type \/Page\b/g) ?? []).length >= 6);
  assert.match(source, new RegExp(worksheet.id));
  const text = [...source.matchAll(/\((.*)\) Tj/g)].map((match) => match[1].replace(/\\([()\\])/g, '$1')).join(' ').replace(/\s+/g, ' ');
  worksheet.questions.forEach((question, index) => assert.ok(text.includes(`${index + 1}. ${question.answer.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/—/g, '-').replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ')}`)));
});

test('paper questions retain required choices and explicit position clues', () => {
  for (const topic of generator.englishWorksheetTopics) {
    for (let seed = 0; seed < 20; seed += 1) {
      const worksheet = generator.generateEnglishWorksheet({ topic, layout: 'fill-blank', questionCount: 30, seed: `content-${seed}` });
      for (const question of worksheet.questions) {
        if (question.prompt.includes('Write the answer:')) question.choices.forEach((choice) => assert.ok(question.prompt.includes(choice)));
        if (topic === 'where-is-it') assert.match(question.prompt, /^Position clue:/);
        assert.ok(!question.prompt.includes('🐶'));
        if (question.sourceId === 'have-challenge-extra-2') assert.equal((question.prompt.match(/___/g) ?? []).length, 1);
      }
    }
  }
});

test('long question text, options and explanations are never truncated in PDF output', async () => {
  const worksheet = generator.generateEnglishWorksheet({ topic: 'a-or-an', layout: 'fill-blank', questionCount: 30, seed: 'long-paper-audit' });
  const source = await pdf.createEnglishWorksheetPdf(worksheet, true).text();
  const text = [...source.matchAll(/\((.*)\) Tj/g)].map((match) => match[1].replace(/\\([()\\])/g, '$1')).join(' ').replace(/\s+/g, ' ');
  const clean = (value) => value.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/—/g, '-').replace(/…/g, '...').replace(/[^\x20-\x7E]/g, '').replace(/\s+/g, ' ');
  worksheet.questions.forEach((question, index) => {
    assert.ok(text.includes(clean(`${index + 1}. ${question.prompt}`)), question.id);
    assert.ok(text.includes(clean(question.explanation)), question.id);
  });
});
