'use client';

import { useMemo, useState } from 'react';
import { Download, Eye, EyeOff, FileText, Printer, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trackEvent } from '@/lib/analytics';
import { createMathematicsWorksheetPdf } from '@/lib/worksheets/mathematics-pdf';
import {
  createVariationSeed,
  generateMathematicsWorksheet,
  type MathematicsWorksheet,
  type WorksheetConfig,
  type WorksheetLayout,
  type WorksheetQuestion,
  type WorksheetQuestionCount,
  type WorksheetRange,
  type WorksheetTopic,
} from '@/lib/worksheets/mathematics-level-one';

const initialConfig: WorksheetConfig = { topic: 'addition', layout: 'classic', range: 10, questionCount: 10, seed: 'zalea-maths-1' };

function configurationDimensions(config: WorksheetConfig) {
  return { topic: config.topic, layout: config.layout, question_count: String(config.questionCount), number_range: String(config.range) };
}

export function MathematicsWorksheetStudio() {
  const [config, setConfig] = useState<WorksheetConfig>(initialConfig);
  const [worksheet, setWorksheet] = useState(() => generateMathematicsWorksheet(initialConfig));
  const [showAnswers, setShowAnswers] = useState(false);
  const [variation, setVariation] = useState(1);
  const [message, setMessage] = useState('A starter worksheet is ready. Change the settings and generate when you are ready.');

  const worksheetPages = useMemo(() => chunk(worksheet.questions, 10), [worksheet]);
  const update = <Key extends keyof WorksheetConfig>(key: Key, value: WorksheetConfig[Key]) => setConfig((current) => ({ ...current, [key]: value }));
  const generate = (nextConfig = config) => {
    const next = generateMathematicsWorksheet(nextConfig);
    setWorksheet(next); setConfig(nextConfig); setShowAnswers(false); setMessage(`Generated ${next.questions.length} unique questions. Worksheet ID: ${next.id}.`);
    trackEvent('worksheet_generated', configurationDimensions(nextConfig));
  };
  const generateVariation = () => {
    const nextVariation = variation + 1;
    const nextConfig = { ...config, seed: createVariationSeed(config.seed, nextVariation) };
    setVariation(nextVariation); generate(nextConfig);
  };
  const printWorksheet = () => {
    trackEvent('worksheet_printed', configurationDimensions(worksheet.config));
    window.print();
  };
  const downloadPdf = () => {
    const blob = createMathematicsWorksheetPdf(worksheet, showAnswers);
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href; link.download = `${worksheet.id}${showAnswers ? '-with-answers' : ''}.pdf`; link.click(); URL.revokeObjectURL(href);
    setMessage(`Downloaded ${showAnswers ? 'the worksheet and answer key' : 'the worksheet'} as an A4 PDF.`);
    trackEvent('worksheet_pdf_downloaded', configurationDimensions(worksheet.config));
  };

  return <div className="grid gap-8 xl:grid-cols-[350px_minmax(0,1fr)]">
    <aside className="h-fit rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6 xl:sticky xl:top-24" aria-labelledby="worksheet-settings">
      <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><Sparkles className="h-5 w-5" aria-hidden="true" /></span><div><p className="text-sm font-bold uppercase tracking-wider text-blue-700">Mathematics · Level 1</p><h2 id="worksheet-settings" className="text-2xl font-bold">Worksheet settings</h2></div></div>
      <div className="mt-6 space-y-5">
        <SelectField id="worksheet-topic" label="Topic" value={config.topic} onChange={(value) => update('topic', value as WorksheetTopic)} options={[['addition','Addition'],['subtraction','Subtraction'],['mixed','Mixed addition and subtraction']]} />
        <SelectField id="worksheet-range" label="Number range" value={String(config.range)} onChange={(value) => update('range', Number(value) as WorksheetRange)} options={[['10','Within 10'],['20','Within 20']]} />
        <SelectField id="worksheet-count" label="Questions" value={String(config.questionCount)} onChange={(value) => update('questionCount', Number(value) as WorksheetQuestionCount)} options={[['10','10 questions'],['20','20 questions'],['30','30 questions']]} />
        <SelectField id="worksheet-layout" label="Layout" value={config.layout} onChange={(value) => update('layout', value as WorksheetLayout)} options={[['classic','Classic Practice'],['visual','Visual Maths'],['missing-number','Missing Number']]} />
        <div className="space-y-2"><Label htmlFor="worksheet-seed">Optional seed</Label><Input id="worksheet-seed" value={config.seed} maxLength={60} onChange={(event) => update('seed', event.target.value)} aria-describedby="seed-help" /><p id="seed-help" className="text-xs leading-5 text-muted-foreground">Use the same settings and seed to reproduce the same questions. No name or learner information is needed.</p></div>
      </div>
      <div className="mt-7 grid gap-3"><Button type="button" size="lg" className="min-h-12" onClick={() => generate()}><Sparkles className="mr-2 h-5 w-5" aria-hidden="true" />Generate worksheet</Button><Button type="button" size="lg" variant="outline" className="min-h-12" onClick={generateVariation}><RefreshCw className="mr-2 h-5 w-5" aria-hidden="true" />Generate another variation</Button></div>
      <div className="mt-6 border-t pt-6"><p className="text-sm font-bold">Preview controls</p><div className="mt-3 grid gap-3"><Button type="button" variant="outline" onClick={() => setShowAnswers((current) => !current)}>{showAnswers ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}{showAnswers ? 'Hide answer key' : 'Show answer key'}</Button><Button type="button" variant="outline" onClick={printWorksheet}><Printer className="mr-2 h-4 w-4" aria-hidden="true" />Print</Button><Button type="button" variant="outline" onClick={downloadPdf}><Download className="mr-2 h-4 w-4" aria-hidden="true" />Download as PDF</Button></div></div>
      <p className="mt-5 min-h-12 text-sm leading-5 text-muted-foreground" role="status" aria-live="polite">{message}</p>
    </aside>

    <section aria-labelledby="worksheet-preview-heading"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold uppercase tracking-wider text-blue-700">Interactive preview</p><h2 id="worksheet-preview-heading" className="text-2xl font-bold sm:text-3xl">Your printable worksheet</h2></div><span className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-muted-foreground">A4 portrait · {worksheetPages.length} worksheet page{worksheetPages.length === 1 ? '' : 's'}</span></div>
      <div className="worksheet-print-root space-y-6" data-worksheet-id={worksheet.id}>
        {worksheetPages.map((questions, pageIndex) => <WorksheetPage key={`${worksheet.id}-${pageIndex}`} worksheet={worksheet} questions={questions} pageIndex={pageIndex} pageTotal={worksheetPages.length} />)}
        {showAnswers && <AnswerKey worksheet={worksheet} />}
      </div>
    </section>
  </div>;
}

function SelectField({ id, label, value, onChange, options }: { id: string; label: string; value: string; onChange: (value: string) => void; options: Array<[string,string]> }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Select value={value} onValueChange={onChange}><SelectTrigger id={id} className="min-h-11"><SelectValue /></SelectTrigger><SelectContent>{options.map(([option, text]) => <SelectItem key={option} value={option}>{text}</SelectItem>)}</SelectContent></Select></div>;
}

function WorksheetPage({ worksheet, questions, pageIndex, pageTotal }: { worksheet: MathematicsWorksheet; questions: WorksheetQuestion[]; pageIndex: number; pageTotal: number }) {
  const topic = worksheet.config.topic === 'mixed' ? 'Mixed addition and subtraction' : worksheet.config.topic[0].toUpperCase() + worksheet.config.topic.slice(1);
  return <article className="worksheet-page mx-auto aspect-[210/297] w-full max-w-[794px] overflow-hidden bg-white p-[5%] text-slate-950 shadow-lg ring-1 ring-slate-200" aria-label={`Worksheet page ${pageIndex + 1} of ${pageTotal}`}>
    <header className="border-b-2 border-slate-800 pb-4"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em]">Zalea Studio · Mathematics Level 1</p><h3 className="mt-1 text-xl font-bold sm:text-2xl">{topic} within {worksheet.config.range}</h3></div><FileText className="h-7 w-7" aria-hidden="true" /></div><div className="mt-4 grid gap-3 text-sm sm:grid-cols-2"><p>Name: <span className="inline-block w-40 border-b border-slate-700">&nbsp;</span></p><p>Date: <span className="inline-block w-32 border-b border-slate-700">&nbsp;</span></p></div></header>
    <ol start={pageIndex * 10 + 1} className={`mt-6 ${worksheet.config.layout === 'visual' ? 'grid gap-3' : 'grid grid-cols-2 gap-x-8 gap-y-7 sm:gap-y-10'}`}>
      {questions.map((question, questionIndex) => <li key={question.id} className="break-inside-avoid pl-1 text-base font-semibold sm:text-lg"><QuestionBody question={question} layout={worksheet.config.layout} number={pageIndex * 10 + questionIndex + 1} /></li>)}
    </ol>
    <footer className="mt-auto pt-4 text-center text-[10px] text-slate-600">Free practice worksheet · zaleastudio.com/worksheets · Page {pageIndex + 1} of {pageTotal}</footer>
  </article>;
}

function QuestionBody({ question, layout, number }: { question: WorksheetQuestion; layout: WorksheetLayout; number: number }) {
  if (layout !== 'visual') return <div><span>{number}. {question.prompt}</span><span className="mt-4 block w-full border-b border-slate-400" aria-hidden="true" /></div>;
  const total = question.operator === '+' ? question.first + question.second : question.first;
  return <div className="grid grid-cols-[minmax(125px,0.7fr)_1fr] items-center gap-3"><span>{number}. {question.prompt}</span><span className="flex flex-wrap gap-1.5" aria-label={`${question.first} ${question.operator === '+' ? 'plus' : 'minus'} ${question.second} countable squares`}>
    {Array.from({ length: total }, (_, index) => {
      const crossed = question.operator === '−' && index >= total - question.second;
      return <span key={index} className={`relative h-4 w-4 border-2 border-slate-800 ${crossed ? 'after:absolute after:left-[-2px] after:top-[5px] after:h-0.5 after:w-4 after:rotate-45 after:bg-slate-900' : ''}`} aria-hidden="true" />;
    })}
  </span></div>;
}

function AnswerKey({ worksheet }: { worksheet: MathematicsWorksheet }) {
  return <article className="worksheet-page worksheet-answer-page mx-auto aspect-[210/297] w-full max-w-[794px] bg-white p-[7%] text-slate-950 shadow-lg ring-1 ring-slate-200" aria-label="Answer key"><p className="text-xs font-bold uppercase tracking-[0.18em]">Zalea Studio · Mathematics Level 1</p><h3 className="mt-2 text-3xl font-bold">Answer Key</h3><p className="mt-2 text-sm text-slate-600">Matches worksheet {worksheet.id}</p><ol className="mt-8 grid grid-cols-2 gap-x-12 gap-y-5 sm:grid-cols-3">{worksheet.questions.map((question, index) => <li key={question.id} className="border-b pb-2 text-lg font-bold">{index + 1}. {worksheet.config.layout === 'missing-number' ? question.missingValue : question.answer}</li>)}</ol><p className="mt-10 text-xs text-slate-600">Answers correspond to the numbered questions in the generated worksheet. Generating another variation creates a new worksheet and matching key.</p></article>;
}

function chunk<T>(items: T[], size: number) {
  return Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, (index + 1) * size));
}
