'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw, Sparkles, Target, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateRequiredFinal, projectCourseGrade, type FinalGradeResult } from '@/lib/final-grade';

const maximumGrade = 1_000_000_000;
const example = { current: '82', weight: '30', desired: '85' };
const projectionScores = [50, 60, 70, 80, 90, 100] as const;

export function FinalGradeCalculator() {
  const [currentGrade, setCurrentGrade] = useState(example.current);
  const [finalWeight, setFinalWeight] = useState(example.weight);
  const [desiredGrade, setDesiredGrade] = useState(example.desired);

  const validation = useMemo(() => validateInputs(currentGrade, finalWeight, desiredGrade), [currentGrade, desiredGrade, finalWeight]);
  const result = useMemo(() => validation ? null : calculateRequiredFinal(Number(currentGrade), Number(finalWeight), Number(desiredGrade)), [currentGrade, desiredGrade, finalWeight, validation]);
  const projections = useMemo(() => result ? projectionScores.map((score) => ({ score, courseGrade: projectCourseGrade(result.currentGrade, result.finalWeightPercent, score) as number })) : [], [result]);

  const loadExample = () => { setCurrentGrade(example.current); setFinalWeight(example.weight); setDesiredGrade(example.desired); };
  const reset = () => { setCurrentGrade(''); setFinalWeight(''); setDesiredGrade(''); };

  return <Card className="overflow-hidden border-border/60 shadow-lg"><CardHeader className="border-b border-border/60 bg-card"><CardTitle className="flex items-center gap-2 text-2xl"><Target className="h-6 w-6 text-primary" aria-hidden="true" />What grade do you need on your final?</CardTitle><p className="mt-2 text-sm text-muted-foreground">Enter percentages from your course gradebook. Values stay in your browser and are not saved.</p></CardHeader><CardContent className="p-4 sm:p-6"><div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
    <section aria-label="Final grade inputs"><div className="space-y-5"><PercentField id="current-grade" label="Current Grade (%)" helper="Your current course grade before the final exam." value={currentGrade} onChange={setCurrentGrade} /><PercentField id="final-exam-weight" label="Final Exam Weight (%)" helper="The percentage of your total course grade that comes from the final exam." value={finalWeight} onChange={setFinalWeight} max="100" /><PercentField id="desired-course-grade" label="Desired Course Grade (%)" helper="The overall course grade you want after the final exam." value={desiredGrade} onChange={setDesiredGrade} /></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button type="button" onClick={loadExample}><Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />Load Example</Button><Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button></div>{validation && <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{validation}</p>}</section>
    <ResultPanel result={result} projections={projections} />
  </div></CardContent></Card>;
}

function ResultPanel({ result, projections }: { result: FinalGradeResult | null; projections: { score: number; courseGrade: number }[] }) {
  return <section className="rounded-2xl bg-blue-50/70 p-5" aria-labelledby="final-grade-result" aria-live="polite"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p><h2 id="final-grade-result" className="mt-2 text-xl font-bold">Required Final Exam Score</h2>{result ? <>
    {result.state === 'secured' ? <div className="mt-5"><p className="flex items-start gap-2 text-2xl font-bold text-emerald-700"><CheckCircle2 className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />You have already secured your target grade.</p><p className="mt-4 leading-relaxed text-muted-foreground">Even with a 0% on the final exam, your overall course grade would be {formatPercent(result.projectedAtZero)}%, which remains at or above your {formatPercent(result.desiredGrade)}% target.</p><p className="mt-3 text-sm text-muted-foreground">The formula result is {formatPercent(result.requiredFinal)}%.</p></div> : <div className="mt-5"><p className={`break-words text-4xl font-bold tracking-tight ${result.state === 'above-100' ? 'text-amber-700' : 'text-primary'}`}>{formatPercent(result.requiredFinal)}%</p><p className="mt-4 leading-relaxed text-muted-foreground">{result.state === 'above-100' ? `You would need ${formatPercent(result.requiredFinal)}% on your final exam. Based on the values entered, the target grade may not be achievable without extra credit or another grading adjustment.` : `You need approximately ${formatPercent(result.requiredFinal)}% on your final exam to finish the course with a ${formatPercent(result.desiredGrade)}% overall grade.`}</p>{result.state === 'above-100' && <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-800"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Required score is above 100% and has not been capped.</p>}</div>}
    <div className="mt-7 border-t border-primary/15 pt-6"><h3 className="font-bold">How Different Final Scores Affect Your Grade</h3><div className="mt-4 overflow-hidden rounded-xl border border-border/60 bg-background"><table className="w-full text-left text-sm"><thead className="bg-secondary/70"><tr><th scope="col" className="px-3 py-3 font-semibold sm:px-4">Final Exam Score</th><th scope="col" className="px-3 py-3 font-semibold sm:px-4">Final Course Grade</th></tr></thead><tbody className="divide-y divide-border">{projections.map((projection) => <tr key={projection.score}><td className="px-3 py-3 sm:px-4">{projection.score}%</td><td className="px-3 py-3 font-semibold sm:px-4">{formatPercent(projection.courseGrade)}%</td></tr>)}</tbody></table></div></div>
  </> : <p className="mt-4 leading-relaxed text-muted-foreground">Enter valid percentages to calculate the final exam score needed and view projected course grades.</p>}</section>;
}

function PercentField({ id, label, helper, value, max = String(maximumGrade), onChange }: { id: string; label: string; helper: string; value: string; max?: string; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type="number" inputMode="decimal" min="0" max={max} step="any" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 text-base" aria-describedby={`${id}-help`} /><p id={`${id}-help`} className="text-sm leading-relaxed text-muted-foreground">{helper}</p></div>;
}

function validateInputs(currentText: string, weightText: string, desiredText: string) {
  if (currentText.trim() === '' || weightText.trim() === '' || desiredText.trim() === '') return 'Enter the current grade, final exam weight and desired course grade.';
  const current = Number(currentText); const weight = Number(weightText); const desired = Number(desiredText);
  if (![current, weight, desired].every(Number.isFinite)) return 'Enter valid numeric percentages.';
  if (current < 0) return 'Current grade must be zero or greater.';
  if (desired < 0) return 'Desired course grade must be zero or greater.';
  if (weight <= 0 || weight > 100) return 'Final exam weight must be greater than 0% and no more than 100%.';
  if (current > maximumGrade || desired > maximumGrade) return `Grades must be no more than ${maximumGrade.toLocaleString()}%.`;
  return null;
}

function formatPercent(value: number) { return value.toFixed(2); }
