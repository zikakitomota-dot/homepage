'use client';

import { useMemo, useState } from 'react';
import { Ratio, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { scaleRatio, simplifyRatio, solveProportion, type RatioMode, type ScaledRatio, type SimplifiedRatio, type ProportionResult } from '@/lib/ratio';

const modes: { id: RatioMode; label: string; shortLabel: string }[] = [
  { id: 'simplify', label: 'Simplify Ratio', shortLabel: 'Simplify' },
  { id: 'scale', label: 'Equivalent / Scale Ratio', shortLabel: 'Scale' },
  { id: 'proportion', label: 'Solve Proportion', shortLabel: 'Proportion' },
  { id: 'three', label: 'Three-Number Ratio', shortLabel: '3 Numbers' },
];

const examples: Record<RatioMode, string[]> = {
  simplify: ['12', '18'],
  scale: ['2', '3', '4'],
  proportion: ['2', '3', '', '12'],
  three: ['6', '9', '12'],
};

type Calculation =
  | { kind: 'simplify' | 'three'; result: SimplifiedRatio }
  | { kind: 'scale'; result: ScaledRatio }
  | { kind: 'proportion'; result: ProportionResult };

export function RatioCalculator() {
  const [mode, setMode] = useState<RatioMode>('simplify');
  const [values, setValues] = useState(examples.simplify);
  const calculation = useMemo(() => calculate(mode, values), [mode, values]);

  const changeMode = (nextMode: RatioMode) => {
    setMode(nextMode);
    setValues(examples[nextMode]);
  };
  const updateValue = (index: number, value: string) => setValues((current) => current.map((item, itemIndex) => itemIndex === index ? value : item));
  const reset = () => setValues(examples[mode].map(() => ''));

  return <Card className="overflow-hidden border-border/60 shadow-lg">
    <CardHeader className="border-b border-border/60 bg-card">
      <h2 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight"><Ratio className="h-6 w-6 text-primary" aria-hidden="true" />Calculate a ratio</h2>
      <p className="mt-2 text-sm text-muted-foreground">Choose a calculation and enter whole or decimal values. Results update instantly and stay in your browser.</p>
    </CardHeader>
    <CardContent className="p-4 sm:p-6">
      <div role="tablist" aria-label="Ratio calculation mode" className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1 lg:grid-cols-4">{modes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} aria-controls="ratio-panel" onClick={() => changeMode(item.id)} className={`min-h-12 rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${mode === item.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><span className="sm:hidden">{item.shortLabel}</span><span className="hidden sm:inline">{item.label}</span></button>)}</div>
      <div id="ratio-panel" role="tabpanel" className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section aria-label="Ratio inputs">
          <ModeFields mode={mode} values={values} onChange={updateValue} />
          <Button type="button" variant="outline" className="mt-6" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button>
          {calculation.error && <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{calculation.error}</p>}
        </section>
        <ResultPanel calculation={calculation.result} />
      </div>
    </CardContent>
  </Card>;
}

function ModeFields({ mode, values, onChange }: { mode: RatioMode; values: string[]; onChange: (index: number, value: string) => void }) {
  if (mode === 'proportion') {
    return <fieldset><legend className="font-semibold">A : B = C : D</legend><p className="mt-2 text-sm text-muted-foreground">Leave exactly one field empty or enter x for the missing value.</p><div className="mt-4 grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr]">
      <NumberField id="ratio-a" label="A" value={values[0] ?? ''} onChange={(value) => onChange(0, value)} placeholder="2" allowUnknown />
      <Separator>:</Separator>
      <NumberField id="ratio-b" label="B" value={values[1] ?? ''} onChange={(value) => onChange(1, value)} placeholder="3" allowUnknown />
      <Separator>=</Separator>
      <NumberField id="ratio-c" label="C" value={values[2] ?? ''} onChange={(value) => onChange(2, value)} placeholder="x" allowUnknown />
      <Separator>:</Separator>
      <NumberField id="ratio-d" label="D" value={values[3] ?? ''} onChange={(value) => onChange(3, value)} placeholder="12" allowUnknown />
    </div></fieldset>;
  }

  const fieldCount = mode === 'simplify' ? 2 : 3;
  const labels = mode === 'scale' ? ['Ratio A', 'Ratio B', 'Scale factor'] : mode === 'three' ? ['Ratio A', 'Ratio B', 'Ratio C'] : ['Ratio A', 'Ratio B'];
  return <fieldset><legend className="font-semibold">{mode === 'scale' ? 'Scale an equivalent ratio' : mode === 'three' ? 'Simplify a three-number ratio' : 'Simplify a two-number ratio'}</legend><div className={`mt-4 grid gap-4 ${fieldCount === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>{labels.map((label, index) => <NumberField key={label} id={`${mode}-${index}`} label={label} value={values[index] ?? ''} onChange={(value) => onChange(index, value)} />)}</div></fieldset>;
}

function NumberField({ id, label, value, placeholder, allowUnknown, onChange }: { id: string; label: string; value: string; placeholder?: string; allowUnknown?: boolean; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type="text" inputMode="decimal" autoComplete="off" value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} aria-description={allowUnknown ? 'Enter a number, x, or leave empty for the unknown value.' : undefined} className="h-11 text-base" /></div>;
}

function Separator({ children }: { children: React.ReactNode }) {
  return <span className="hidden h-11 items-center justify-center text-xl font-bold text-muted-foreground sm:flex" aria-hidden="true">{children}</span>;
}

function ResultPanel({ calculation }: { calculation: Calculation | null }) {
  return <section className="rounded-2xl bg-blue-50/70 p-5 sm:p-6" aria-labelledby="ratio-result" aria-live="polite">
    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p>
    <h3 id="ratio-result" className="mt-2 text-xl font-bold">Your Ratio Calculation</h3>
    {!calculation && <p className="mt-4 leading-relaxed text-muted-foreground">Enter valid values to see the answer and step-by-step calculation.</p>}
    {calculation && (calculation.kind === 'simplify' || calculation.kind === 'three') && <SimplifyResult result={calculation.result} three={calculation.kind === 'three'} />}
    {calculation?.kind === 'scale' && <ScaleResult result={calculation.result} />}
    {calculation?.kind === 'proportion' && <ProportionResultPanel result={calculation.result} />}
  </section>;
}

function SimplifyResult({ result, three }: { result: SimplifiedRatio; three: boolean }) {
  return <><p className="mt-5 break-words text-4xl font-bold tracking-tight text-primary sm:text-5xl">{result.simplified}</p><dl className="mt-6 grid gap-3 sm:grid-cols-2"><ResultItem label="Original ratio" value={result.original} /><ResultItem label="Greatest common divisor" value={result.divisor} />{result.integerEquivalent !== result.original && <ResultItem label="Integer equivalent" value={result.integerEquivalent} />}{!three && result.fraction && <ResultItem label="Ratio fraction A/B" value={result.fraction} />}</dl><Steps steps={[`Convert to an integer ratio: ${result.integerEquivalent}.`, `Divide every value by ${result.divisor}.`, result.calculation]} />{!three && result.totalParts && <div className="mt-5 rounded-xl bg-background p-4"><h4 className="font-semibold">Part-to-whole insight</h4><p className="mt-2 text-sm text-muted-foreground">Total parts: {result.totalParts}</p><p className="mt-2 text-sm text-muted-foreground">First quantity: {result.firstShare}</p><p className="mt-1 text-sm text-muted-foreground">Second quantity: {result.secondShare}</p></div>}</>;
}

function ScaleResult({ result }: { result: ScaledRatio }) {
  return <><p className="mt-5 break-words text-4xl font-bold tracking-tight text-primary sm:text-5xl">{result.scaled}</p><dl className="mt-6 grid gap-3 sm:grid-cols-2"><ResultItem label="Original ratio" value={result.original} /><ResultItem label="Simplest form" value={result.simplified} /></dl><Steps steps={['Multiply every ratio value by the same scale factor.', result.calculation, `${result.scaled} is equivalent to ${result.original}.`]} /></>;
}

function ProportionResultPanel({ result }: { result: ProportionResult }) {
  return <><p className="mt-5 break-words text-4xl font-bold tracking-tight text-primary sm:text-5xl">{result.answer}</p><dl className="mt-6"><ResultItem label="Proportion" value={result.equation} /></dl><Steps steps={result.steps} /></>;
}

function ResultItem({ label, value, className = '' }: { label: string; value: string; className?: string }) {
  return <div className={`rounded-xl bg-background p-4 ${className}`}><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-lg font-semibold">{value}</dd></div>;
}

function Steps({ steps }: { steps: string[] }) {
  return <div className="mt-5 rounded-xl bg-background p-4"><h4 className="font-semibold">Step-by-step solution</h4><ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{steps.map((step, index) => <li key={`${index}-${step}`}>{step}</li>)}</ol></div>;
}

function calculate(mode: RatioMode, values: string[]): { result: Calculation | null; error: string | null } {
  try {
    if (mode === 'simplify') return { result: { kind: mode, result: simplifyRatio(values.slice(0, 2)) }, error: null };
    if (mode === 'three') return { result: { kind: mode, result: simplifyRatio(values.slice(0, 3)) }, error: null };
    if (mode === 'scale') return { result: { kind: mode, result: scaleRatio(values[0] ?? '', values[1] ?? '', values[2] ?? '') }, error: null };
    return { result: { kind: mode, result: solveProportion([values[0] ?? '', values[1] ?? '', values[2] ?? '', values[3] ?? '']) }, error: null };
  } catch (error) {
    return { result: null, error: error instanceof Error ? error.message : 'Check the values and try again.' };
  }
}
