'use client';

import { useMemo, useRef, useState } from 'react';
import { CheckCircle2, Plus, RotateCcw, Scale, Sparkles, Trash2, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateWeightedGrade, weightedContribution, type WeightedGradeResult } from '@/lib/weighted-grade';

type CategoryRow = { id: number; name: string; grade: string; weight: string };
const maximumGrade = 1_000_000_000;
const blankRows = (): CategoryRow[] => ['Homework', 'Quizzes', 'Midterm', 'Final Exam'].map((name, index) => ({ id: index + 1, name, grade: '', weight: '' }));
const exampleRows: CategoryRow[] = [
  { id: 1, name: 'Homework', grade: '85', weight: '20' },
  { id: 2, name: 'Quizzes', grade: '78', weight: '20' },
  { id: 3, name: 'Midterm', grade: '82', weight: '25' },
  { id: 4, name: 'Final Exam', grade: '90', weight: '35' },
];

export function WeightedGradeCalculator() {
  const [rows, setRows] = useState<CategoryRow[]>(blankRows);
  const nextId = useRef(5);
  const state = useMemo(() => {
    const entered = rows.filter((row) => row.grade.trim() !== '' || row.weight.trim() !== '');
    if (entered.length === 0) return { result: null, error: null };
    for (const row of entered) {
      const error = validateRow(row);
      if (error) return { result: null, error: `${row.name.trim() || 'Untitled category'}: ${error}` };
    }
    return { result: calculateWeightedGrade(entered.map((row) => ({ grade: Number(row.grade || 0), weight: Number(row.weight) }))), error: null };
  }, [rows]);

  const updateRow = (id: number, field: keyof Omit<CategoryRow, 'id'>, value: string) => setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
  const addRow = () => { const id = nextId.current++; setRows((current) => [...current, { id, name: `Category ${current.length + 1}`, grade: '', weight: '' }]); };
  const removeRow = (id: number) => setRows((current) => current.length === 1 ? current : current.filter((row) => row.id !== id));
  const loadExample = () => { setRows(exampleRows.map((row) => ({ ...row }))); nextId.current = 5; };
  const reset = () => { setRows(blankRows()); nextId.current = 5; };

  return <Card className="overflow-hidden border-border/60 shadow-lg"><CardHeader className="border-b border-border/60 bg-card"><CardTitle className="flex items-center gap-2 text-2xl"><Scale className="h-6 w-6 text-primary" aria-hidden="true" />Calculate your weighted grade</CardTitle><p className="mt-2 text-sm text-muted-foreground">Enter categories or individual assignments with their percentage weights. Values stay in your browser.</p></CardHeader><CardContent className="p-4 sm:p-6"><div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
    <section aria-label="Weighted grade categories"><div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(6rem,0.9fr)_3rem] gap-3 px-3 pb-2 text-sm font-semibold text-muted-foreground md:grid" aria-hidden="true"><span>Item / Category</span><span>Grade (%)</span><span>Weight (%)</span><span>Contribution</span><span>Remove</span></div><div className="space-y-3">{rows.map((row, index) => { const error = validateRow(row); const contribution = error ? null : weightedContribution(Number(row.grade || 0), Number(row.weight)); return <fieldset key={row.id} className="grid gap-3 rounded-xl border border-border/60 p-3 md:grid-cols-[minmax(0,1.5fr)_minmax(0,0.8fr)_minmax(0,0.8fr)_minmax(6rem,0.9fr)_3rem] md:items-end"><legend className="sr-only">Weighted category row {index + 1}</legend><div className="space-y-2"><Label htmlFor={`weighted-name-${row.id}`} className="md:sr-only">Item / Category</Label><Input id={`weighted-name-${row.id}`} value={row.name} maxLength={80} onChange={(event) => updateRow(row.id, 'name', event.target.value)} className="h-11" /></div><NumberField id={`weighted-grade-${row.id}`} label="Grade (%)" value={row.grade} max={String(maximumGrade)} onChange={(value) => updateRow(row.id, 'grade', value)} /><NumberField id={`weighted-weight-${row.id}`} label="Weight (%)" value={row.weight} max="100" onChange={(value) => updateRow(row.id, 'weight', value)} /><div><span className="mb-2 block text-sm font-medium md:sr-only">Contribution</span><output className="flex h-11 items-center rounded-md bg-secondary/50 px-3 font-semibold" title={contribution !== null ? `${row.grade || 0} × ${row.weight}% = ${format(contribution)} percentage points` : undefined}>{contribution !== null ? format(contribution) : '—'}</output></div><Button type="button" variant="outline" size="icon" className="h-11 w-full md:w-11" onClick={() => removeRow(row.id)} disabled={rows.length === 1} aria-label={`Remove ${row.name || `category ${index + 1}`}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></Button></fieldset>; })}</div><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button type="button" onClick={addRow}><Plus className="mr-2 h-4 w-4" aria-hidden="true" />Add Category</Button><Button type="button" variant="outline" onClick={loadExample}><Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />Load Example</Button><Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button></div>{state.error && <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{state.error}</p>}</section>
    <WeightedResultPanel result={state.result} />
  </div></CardContent></Card>;
}

function WeightedResultPanel({ result }: { result: WeightedGradeResult | null }) {
  return <section className="rounded-2xl bg-blue-50/70 p-5" aria-labelledby="weighted-result" aria-live="polite"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p><h2 id="weighted-result" className="mt-2 text-xl font-bold">{result?.state === 'partial' ? 'Your Current Weighted Grade' : 'Your Weighted Grade'}</h2>{result ? <>{result.state === 'overweight' ? <div className="mt-5"><p className="flex items-start gap-2 text-2xl font-bold text-amber-700"><TriangleAlert className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />Total weight exceeds 100%.</p><p className="mt-4 leading-relaxed text-muted-foreground">Course weights normally total 100%. Please review the weights entered.</p></div> : <><div className="mt-5 flex flex-wrap items-center gap-4"><p className="text-4xl font-bold tracking-tight text-primary">{format(result.currentGrade)}%</p><span className="flex min-h-14 min-w-14 items-center justify-center rounded-xl bg-primary px-3 text-2xl font-bold text-primary-foreground" aria-label={`Estimated letter grade ${result.letter}`}>{result.letter}</span></div><p className="mt-4 leading-relaxed text-muted-foreground">{result.state === 'complete' ? `Your weighted contributions produce an overall grade of ${format(result.currentGrade)}%.` : `Based only on the categories entered, your current weighted grade is ${format(result.currentGrade)}%. These categories represent ${formatWeight(result.totalWeight)}% of the total course weight.`}</p></>}
    <div className={`mt-6 rounded-xl border p-4 ${result.state === 'complete' ? 'border-emerald-300 bg-emerald-50' : result.state === 'overweight' ? 'border-amber-300 bg-amber-50' : 'border-border/60 bg-background'}`}><p className="flex items-start gap-2 font-semibold">{result.state === 'complete' && <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />}Total Weight: {formatWeight(result.totalWeight)}%{result.state === 'complete' ? ' — Complete' : ''}</p>{result.state === 'partial' && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">You have entered {formatWeight(result.totalWeight)}% of the course weight. The calculator is showing your current grade based on the work entered so far.</p>}</div>
    {result.state !== 'overweight' && <div className="mt-4 rounded-xl bg-background p-4"><p className="text-sm text-muted-foreground">Contribution Toward Final Course Grade</p><p className="mt-1 text-xl font-bold">{format(result.contributionTotal)} percentage points</p></div>}
    {result.state !== 'overweight' && <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Estimated Letter Grade: <strong className="text-foreground">{result.letter}</strong>. Grading scales vary between schools, universities and countries. This uses a common US scale only as a general reference.</p>}
  </> : <p className="mt-4 leading-relaxed text-muted-foreground">Enter at least one valid grade and a positive weight to calculate your current weighted grade.</p>}</section>;
}

function NumberField({ id, label, value, max, onChange }: { id: string; label: string; value: string; max: string; onChange: (value: string) => void }) { return <div className="space-y-2"><Label htmlFor={id} className="md:sr-only">{label}</Label><Input id={id} type="number" inputMode="decimal" min="0" max={max} step="any" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 text-base" /></div>; }

function validateRow(row: CategoryRow) {
  const gradeBlank = row.grade.trim() === ''; const weightBlank = row.weight.trim() === '';
  if (gradeBlank && weightBlank) return null;
  if (weightBlank) return 'Enter a weight.';
  const weight = Number(row.weight);
  if (!Number.isFinite(weight)) return 'Enter a valid numeric weight.';
  if (weight < 0 || weight > 100) return 'Weight must be between 0% and 100%.';
  if (gradeBlank && weight === 0) return null;
  if (gradeBlank) return 'Enter a grade.';
  const grade = Number(row.grade);
  if (!Number.isFinite(grade)) return 'Enter a valid numeric grade.';
  if (grade < 0) return 'Grade must be zero or greater.';
  if (grade > maximumGrade) return `Grade must be no more than ${maximumGrade.toLocaleString()}%.`;
  return null;
}

function format(value: number) { return value.toFixed(2); }
function formatWeight(value: number) { return new Intl.NumberFormat(undefined, { maximumFractionDigits: 4 }).format(value); }
