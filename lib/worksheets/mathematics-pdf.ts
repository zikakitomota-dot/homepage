import type { MathematicsWorksheet, WorksheetQuestion } from './mathematics-level-one';

const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

function escapePdf(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)').replace(/−/g, '-');
}

function textLine(text: string, x: number, y: number, size = 12, bold = false) {
  return `BT /${bold ? 'F2' : 'F1'} ${size} Tf ${x} ${y} Td (${escapePdf(text)}) Tj ET`;
}

function visualMarks(question: WorksheetQuestion, x: number, y: number) {
  const commands: string[] = [];
  const total = question.operator === '+' ? question.first + question.second : question.first;
  for (let index = 0; index < total; index += 1) {
    const px = x + (index % 10) * 16;
    const py = y - Math.floor(index / 10) * 16;
    commands.push(`${px} ${py} 8 8 re S`);
    if (question.operator === '−' && index >= total - question.second) {
      commands.push(`${px} ${py} m ${px + 8} ${py + 8} l S ${px + 8} ${py} m ${px} ${py + 8} l S`);
    }
  }
  return commands.join('\n');
}

function worksheetPage(worksheet: MathematicsWorksheet, questions: WorksheetQuestion[], pageIndex: number, pageTotal: number) {
  const title = 'Zalea Studio - Mathematics Level 1 Worksheet';
  const topic = worksheet.config.topic === 'mixed' ? 'Mixed addition and subtraction' : worksheet.config.topic[0].toUpperCase() + worksheet.config.topic.slice(1);
  const lines = [
    '0 G 0 g 0.8 w', textLine(title, 42, 800, 17, true),
    textLine(`${topic} within ${worksheet.config.range} | ${worksheet.config.layout.replace('-', ' ')}`, 42, 777, 10),
    textLine(`Name: ______________________________    Date: __________________`, 42, 748, 11),
    `42 735 m 553 735 l S`,
  ];
  const visual = worksheet.config.layout === 'visual';
  questions.forEach((question, localIndex) => {
    const number = pageIndex * 10 + localIndex + 1;
    if (visual) {
      const y = 690 - localIndex * 63;
      lines.push(textLine(`${number}. ${question.prompt}`, 48, y + 18, 13, true));
      lines.push(visualMarks(question, 78, y));
    } else {
      const column = localIndex % 2;
      const row = Math.floor(localIndex / 2);
      const x = 58 + column * 260;
      const y = 670 - row * 112;
      lines.push(textLine(`${number}.  ${question.prompt}`, x, y, 17, true));
      lines.push(`${x} ${y - 32} m ${x + 190} ${y - 32} l S`);
    }
  });
  lines.push(textLine(`zaleastudio.com/worksheets | Page ${pageIndex + 1} of ${pageTotal}`, 42, 25, 8));
  return lines.join('\n');
}

function answerPage(worksheet: MathematicsWorksheet, questions: WorksheetQuestion[], pageIndex: number, pageTotal: number) {
  const lines = ['0 G 0 g', textLine('Answer Key', 42, 800, 19, true), textLine(`Worksheet ${worksheet.id}`, 42, 778, 9), `42 765 m 553 765 l S`];
  questions.forEach((question, index) => {
    const globalIndex = pageIndex * 20 + index;
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = 58 + column * 260;
    const y = 725 - row * 62;
    const answer = worksheet.config.layout === 'missing-number' ? question.missingValue : question.answer;
    lines.push(textLine(`${globalIndex + 1}. ${answer}`, x, y, 13, true));
  });
  lines.push(textLine(`zaleastudio.com/worksheets | Answer key ${pageIndex + 1} of ${pageTotal}`, 42, 25, 8));
  return lines.join('\n');
}

function chunks<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));
}

export function createMathematicsWorksheetPdf(worksheet: MathematicsWorksheet, includeAnswers: boolean) {
  const worksheetChunks = chunks(worksheet.questions, 10);
  const answerChunks = includeAnswers ? chunks(worksheet.questions, 20) : [];
  const streams = [
    ...worksheetChunks.map((questions, index) => worksheetPage(worksheet, questions, index, worksheetChunks.length)),
    ...answerChunks.map((questions, index) => answerPage(worksheet, questions, index, answerChunks.length)),
  ];
  const objects: string[] = [];
  const add = (value: string) => { objects.push(value); return objects.length; };
  const catalog = add('');
  const pages = add('');
  const font = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  const boldFont = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  const pageRefs: number[] = [];
  streams.forEach((stream) => {
    const content = add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const page = add(`<< /Type /Page /Parent ${pages} 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] /Resources << /Font << /F1 ${font} 0 R /F2 ${boldFont} 0 R >> >> /Contents ${content} 0 R >>`);
    pageRefs.push(page);
  });
  objects[catalog - 1] = `<< /Type /Catalog /Pages ${pages} 0 R >>`;
  objects[pages - 1] = `<< /Type /Pages /Kids [${pageRefs.map((ref) => `${ref} 0 R`).join(' ')}] /Count ${pageRefs.length} >>`;
  let pdf = '%PDF-1.4\n';
  const offsets = [0];
  objects.forEach((object, index) => { offsets.push(pdf.length); pdf += `${index + 1} 0 obj\n${object}\nendobj\n`; });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => { pdf += `${String(offset).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return new Blob([pdf], { type: 'application/pdf' });
}
