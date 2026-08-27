'use client';

import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, GraduationCap, Plus, RotateCcw, Sparkles, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateGrade, calculateOverallGrade, type GradeResult } from '@/lib/education-tools';

type Mode = 'single' | 'multiple';
type AssignmentRow = { id: number; name: string; earned: string; possible: string };
const maximumPoints = 1_000_000_000_000;

const blankRows = (): AssignmentRow[] => [1, 2, 3].map((id) => ({ id, name: `Assignment ${id}`, earned: '', possible: '' }));
const sampleRows: AssignmentRow[] = [
  { id: 1, name: 'Homework 1', earned: '18', possible: '20' },
  { id: 2, name: 'Quiz 1', earned: '42', possible: '50' },
  { id: 3, name: 'Midterm', earned: '78', possible: '100' },
  { id: 4, name: 'Project', earned: '45', possible: '50' },
];

export function GradeCalculator() {
  const [mode, setMode] = useState<Mode>('single');
  const [earned, setEarned] = useState('42');
  const [possible, setPossible] = useState('50');
  const [rows, setRows] = useState<AssignmentRow[]>(blankRows);
  const nextId = useRef(4);

  const singleValidation = useMemo(() => validatePoints(earned, possible), [earned, possible]);
  const singleResult = useMemo(() => singleValidation ? null : calculateGrade(Number(earned), Number(possible)), [earned, possible, singleValidation]);

  const multipleState = useMemo(() => {
    const enteredRows = rows.filter((row) => row.earned.trim() !== '' || row.possible.trim() !== '');
    if (enteredRows.length === 0) return { result: null, error: null };
    for (const row of enteredRows) {
      const error = validatePoints(row.earned, row.possible);
      if (error) return { result: null, error: `${row.name.trim() || 'Untitled assignment'}: ${error}` };
    }
    return { result: calculateOverallGrade(enteredRows.map((row) => ({ earned: Number(row.earned), possible: Number(row.possible) }))), error: null };
  }, [rows]);

  const updateRow = (id: number, field: keyof Omit<AssignmentRow, 'id'>, value: string) => setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
  const addRow = () => { const id = nextId.current++; setRows((current) => [...current, { id, name: `Assignment ${current.length + 1}`, earned: '', possible: '' }]); };
  const removeRow = (id: number) => setRows((current) => current.length === 1 ? current : current.filter((row) => row.id !== id));
  const loadExample = () => { setRows(sampleRows.map((row) => ({ ...row }))); nextId.current = 5; };
  const reset = () => { setEarned('42'); setPossible('50'); setRows(blankRows()); nextId.current = 4; };
  const activeResult = mode === 'single' ? singleResult : multipleState.result;
  const activeError = mode === 'single' ? singleValidation : multipleState.error;

  return <Card className="overflow-hidden border-border/60 shadow-lg"><CardHeader className="border-b border-border/60 bg-card"><CardTitle className="flex items-center gap-2 text-2xl"><GraduationCap className="h-6 w-6 text-primary" aria-hidden="true" />Calculate a points-based grade</CardTitle><p className="mt-2 text-sm text-muted-foreground">Enter the points earned and total points possible. Scores stay in your browser and are not saved or submitted.</p></CardHeader><CardContent className="p-4 sm:p-6">
    <div role="tablist" aria-label="Grade calculator mode" className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1"><ModeTab selected={mode === 'single'} controls="grade-panel" onClick={() => setMode('single')}>Single Grade</ModeTab><ModeTab selected={mode === 'multiple'} controls="grade-panel" onClick={() => setMode('multiple')}>Multiple Assignments</ModeTab></div>
    <div id="grade-panel" role="tabpanel" className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <section aria-label="Grade inputs">
        {mode === 'single' ? <div className="grid gap-5 sm:grid-cols-2"><NumberField id="points-earned" label="Points Earned" value={earned} onChange={setEarned} /><NumberField id="total-points" label="Total Points Possible" value={possible} onChange={setPossible} /></div> : <>
          <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(5rem,0.8fr)_3rem] gap-3 px-3 pb-2 text-sm font-semibold text-muted-foreground md:grid" aria-hidden="true"><span>Assignment</span><span>Points Earned</span><span>Points Possible</span><span>Percentage</span><span>Remove</span></div>
          <div className="space-y-3">{rows.map((row, index) => { const rowError = validatePoints(row.earned, row.possible); const rowResult = rowError ? null : calculateGrade(Number(row.earned), Number(row.possible)); return <fieldset key={row.id} className="grid gap-3 rounded-xl border border-border/60 p-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(5rem,0.8fr)_3rem] md:items-end"><legend className="sr-only">Assignment row {index + 1}</legend><div className="space-y-2"><Label htmlFor={`assignment-name-${row.id}`} className="md:sr-only">Assignment</Label><Input id={`assignment-name-${row.id}`} value={row.name} maxLength={80} onChange={(event) => updateRow(row.id, 'name', event.target.value)} className="h-11" /></div><NumberField id={`assignment-earned-${row.id}`} label="Points Earned" mobileLabel value={row.earned} onChange={(value) => updateRow(row.id, 'earned', value)} /><NumberField id={`assignment-possible-${row.id}`} label="Points Possible" mobileLabel value={row.possible} onChange={(value) => updateRow(row.id, 'possible', value)} /><div><span className="mb-2 block text-sm font-medium md:sr-only">Percentage</span><output className={`flex h-11 items-center rounded-md bg-secondary/50 px-3 font-semibold ${rowResult?.isExtraCredit ? 'text-emerald-700' : ''}`}>{rowResult ? `${formatPercentage(rowResult.percentage)}%` : '—'}</output></div><Button type="button" variant="outline" size="icon" className="h-11 w-full md:w-11" onClick={() => removeRow(row.id)} disabled={rows.length === 1} aria-label={`Remove ${row.name || `assignment ${index + 1}`}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></Button></fieldset>; })}</div>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button type="button" onClick={addRow}><Plus className="mr-2 h-4 w-4" aria-hidden="true" />Add Assignment</Button><Button type="button" variant="outline" onClick={loadExample}><Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />Load Example</Button><Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button></div>
        </>}
        {mode === 'single' && <Button type="button" variant="outline" className="mt-5" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button>}
        {activeError && <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{activeError}</p>}
        {activeResult?.isExtraCredit && <p role="status" className="mt-5 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-sm font-medium text-emerald-800">This result is above 100%, which can happen when extra credit is included.</p>}
      </section>
      <GradeResultPanel result={activeResult} mode={mode} />
    </div>
  </CardContent></Card>;
}

function GradeResultPanel({ result, mode }: { result: GradeResult | null; mode: Mode }) {
  return <section className="rounded-2xl bg-blue-50/70 p-5" aria-labelledby="grade-result" aria-live="polite"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p><h2 id="grade-result" className="mt-2 text-xl font-bold">{mode === 'single' ? 'Your Grade' : 'Your Overall Grade'}</h2>{result ? <><div className="mt-5 flex flex-wrap items-center gap-4"><p className="text-4xl font-bold tracking-tight text-primary">{formatPercentage(result.percentage)}%</p><span className="flex min-h-14 min-w-14 items-center justify-center rounded-xl bg-primary px-3 text-2xl font-bold text-primary-foreground" aria-label={`Estimated letter grade ${result.letter}`}>{result.letter}</span></div><p className="mt-5 flex items-start gap-2 font-semibold"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />{formatPoints(result.earned)} points earned out of {formatPoints(result.possible)} possible</p><p className="mt-4 leading-relaxed text-muted-foreground">{mode === 'single' ? `You earned ${formatPoints(result.earned)} out of ${formatPoints(result.possible)} possible points, giving you a grade of ${formatPercentage(result.percentage)}%.` : `Based on the point-based scores entered, your current overall grade is approximately ${formatPercentage(result.percentage)}%.`}</p><p className="mt-3 text-sm text-muted-foreground">Estimated letter grade: <strong className="text-foreground">{result.letter}</strong>. Grading cutoffs vary by school, teacher and institution.</p></> : <p className="mt-4 leading-relaxed text-muted-foreground">Enter valid scores to calculate your grade percentage and estimated letter grade.</p>}</section>;
}

function ModeTab({ selected, controls, onClick, children }: { selected: boolean; controls: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={selected} aria-controls={controls} onClick={onClick} className={`min-h-12 rounded-lg px-2 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 ${selected ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{children}</button>;
}

function NumberField({ id, label, value, mobileLabel = false, onChange }: { id: string; label: string; value: string; mobileLabel?: boolean; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label htmlFor={id} className={mobileLabel ? 'md:sr-only' : ''}>{label}</Label><Input id={id} type="number" inputMode="decimal" min="0" max={maximumPoints} step="any" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 text-base" /></div>;
}

function validatePoints(earnedText: string, possibleText: string) {
  if (earnedText.trim() === '' || possibleText.trim() === '') return 'Enter both points earned and total points possible.';
  const earned = Number(earnedText); const possible = Number(possibleText);
  if (!Number.isFinite(earned) || !Number.isFinite(possible)) return 'Enter valid numeric values.';
  if (earned < 0 || possible < 0) return 'Points cannot be negative.';
  if (possible === 0) return 'Total points possible must be greater than zero.';
  if (earned > maximumPoints || possible > maximumPoints) return `Points must be no more than ${maximumPoints.toLocaleString()}.`;
  return null;
}

function formatPercentage(value: number) { return value.toFixed(2); }
function formatPoints(value: number) { return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(value); }
