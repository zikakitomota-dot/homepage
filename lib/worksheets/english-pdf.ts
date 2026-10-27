import type { EnglishWorksheet, EnglishWorksheetQuestion } from './english-level-one';

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

function ascii(text: string) {
  return text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'").replace(/—/g, '-').replace(/…/g, '...').replace(/[^\x20-\x7E]/g, '');
}
function escapePdf(text: string) { return ascii(text).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)'); }
function textLine(text: string, x: number, y: number, size = 11, bold = false) { return `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${y} Td (${escapePdf(text)}) Tj ET`; }
function wrap(text: string, max = 82) {
  const words = ascii(text).split(/\s+/); const lines: string[] = []; let line = '';
  words.forEach((word) => { const next = line ? `${line} ${word}` : word; if (next.length > max && line) { lines.push(line); line = word; } else line = next; });
  if (line) lines.push(line); return lines;
}
function rowHeight(question: EnglishWorksheetQuestion, answerKey: boolean, number: number) {
  if (answerKey) return Math.max(58, wrap(`${number}. ${question.answer}`, 68).length * 15 + wrap(question.explanation, 86).length * 12 + 14);
  return Math.max(60, wrap(`${number}. ${question.prompt}`, 68).length * 14 + (question.format === 'choose-correct' ? wrap(`Choose: ${question.choices.join(' / ')}`, 82).length * 11 : 20) + 18);
}
function paginate(questions: EnglishWorksheetQuestion[], answerKey: boolean) {
  const pages: { questions: EnglishWorksheetQuestion[]; start: number }[] = [];
  let page: EnglishWorksheetQuestion[] = []; let used = 0; let start = 0;
  questions.forEach((question, index) => {
    const height = rowHeight(question, answerKey, index + 1);
    if (page.length && (page.length === 10 || used + height > 640)) { pages.push({ questions: page, start }); page = []; used = 0; start = index; }
    page.push(question); used += height;
  });
  if (page.length) pages.push({ questions: page, start });
  return pages;
}

function worksheetPage(worksheet: EnglishWorksheet, questions: EnglishWorksheetQuestion[], start: number, pageIndex: number, pageTotal: number) {
  const layoutName = worksheet.config.layout === 'fill-blank' ? 'Fill in the Blank' : worksheet.config.layout === 'choose-correct' ? 'Choose the Correct Word' : 'Mixed Grammar Practice';
  const lines = ['0 G 0 g 0.8 w', textLine('Zalea Studio - English Level 1 Worksheet', 42, 800, 17, true), textLine(`Topic: ${worksheet.config.topic === 'mixed' ? 'Mixed English practice' : questions[0]?.topicTitle} | ${layoutName}`, 42, 778, 10), textLine('Name: ______________________________    Date: __________________', 42, 748, 11), '42 735 m 553 735 l S'];
  let y = 704;
  questions.forEach((question, index) => {
    const number = start + index + 1;
    const promptLines = wrap(`${number}. ${question.prompt}`, 68);
    promptLines.forEach((line, lineIndex) => lines.push(textLine(line, 48, y - lineIndex * 14, 11, lineIndex === 0)));
    const choicesY = y - promptLines.length * 14 - 4;
    if (question.format === 'choose-correct') wrap(`Choose: ${question.choices.join(' / ')}`, 82).forEach((line, lineIndex) => lines.push(textLine(line, 68, choicesY - lineIndex * 11, 9)));
    else lines.push(`68 ${choicesY - 10} m 525 ${choicesY - 10} l S`);
    y -= rowHeight(question, false, number);
  });
  lines.push(textLine(`Worksheet ${worksheet.id} | zaleastudio.com/worksheets | Page ${pageIndex + 1} of ${pageTotal}`, 42, 25, 8));
  return lines.join('\n');
}

function answerPage(worksheet: EnglishWorksheet, questions: EnglishWorksheetQuestion[], start: number, pageIndex: number, pageTotal: number) {
  const lines = ['0 G 0 g', textLine('English Level 1 Answer Key', 42, 800, 19, true), textLine(`Matches worksheet ${worksheet.id}`, 42, 778, 9), '42 765 m 553 765 l S'];
  let y = 725;
  questions.forEach((question, index) => {
    const number = start + index + 1;
    const answerLines = wrap(`${number}. ${question.answer}`, 68);
    answerLines.forEach((line, lineIndex) => lines.push(textLine(line, 48, y - lineIndex * 15, 11, true)));
    wrap(question.explanation, 86).forEach((line, lineIndex) => lines.push(textLine(line, 68, y - answerLines.length * 15 - 1 - lineIndex * 12, 8)));
    y -= rowHeight(question, true, number);
  });
  lines.push(textLine(`zaleastudio.com/worksheets | Answer key ${pageIndex + 1} of ${pageTotal}`, 42, 25, 8));
  return lines.join('\n');
}

export function createEnglishWorksheetPdf(worksheet: EnglishWorksheet, includeAnswers: boolean) {
  const pages = paginate(worksheet.questions, false);
  const answers = paginate(worksheet.questions, true);
  const streams = [...pages.map(({questions, start}, index) => worksheetPage(worksheet, questions, start, index, pages.length)), ...(includeAnswers ? answers.map(({questions, start}, index) => answerPage(worksheet, questions, start, index, answers.length)) : [])];
  const objects: string[] = []; const add = (value: string) => { objects.push(value); return objects.length; };
  const catalog = add(''); const pagesObject = add(''); const font = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'); const bold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>'); const refs: number[] = [];
  streams.forEach((stream) => { const content = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`); refs.push(add(`<< /Type /Page /Parent ${pagesObject} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${font} 0 R /F2 ${bold} 0 R >> >> /Contents ${content} 0 R >>`)); });
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObject} 0 R >>`; objects[pagesObject - 1] = `<< /Type /Pages /Kids [${refs.map((ref) => `${ref} 0 R`).join(' ')}] /Count ${refs.length} >>`;
  let pdf = '%PDF-1.4\n'; const offsets = [0]; objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; }); const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`; offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; }); pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}
