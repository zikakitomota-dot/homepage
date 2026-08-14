'use client';

import { useMemo, useState } from 'react';
import { Divide, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateFractions, parseFractionInput, type FractionInput, type FractionOperation } from '@/lib/fraction';

const operations: { id: FractionOperation; label: string; symbol: string }[] = [
  { id: 'add', label: 'Add', symbol: '+' },
  { id: 'subtract', label: 'Subtract', symbol: '−' },
  { id: 'multiply', label: 'Multiply', symbol: '×' },
  { id: 'divide', label: 'Divide', symbol: '÷' },
];

const exampleFirst: FractionInput = { whole: '0', numerator: '1', denominator: '2' };
const exampleSecond: FractionInput = { whole: '0', numerator: '3', denominator: '4' };
const emptyInput: FractionInput = { whole: '', numerator: '', denominator: '' };

export function FractionCalculator() {
  const [first, setFirst] = useState<FractionInput>(exampleFirst);
  const [second, setSecond] = useState<FractionInput>(exampleSecond);
  const [operation, setOperation] = useState<FractionOperation>('add');

  const calculation = useMemo(() => {
    try {
      const firstFraction = parseFractionInput(first, 'first');
      const secondFraction = parseFractionInput(second, 'second');
      return { result: calculateFractions(firstFraction, secondFraction, operation), error: null };
    } catch (error) {
      return { result: null, error: error instanceof Error ? error.message : 'Check the fraction values and try again.' };
    }
  }, [first, operation, second]);

  const reset = () => {
    setFirst(emptyInput);
    setSecond(emptyInput);
    setOperation('add');
  };

  return <Card className="overflow-hidden border-border/60 shadow-lg">
    <CardHeader className="border-b border-border/60 bg-card">
      <h2 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight"><Divide className="h-6 w-6 text-primary" aria-hidden="true" />Calculate with fractions</h2>
      <p className="mt-2 text-sm text-muted-foreground">Enter ordinary fractions, mixed numbers or improper fractions. Results update instantly and stay in your browser.</p>
    </CardHeader>
    <CardContent className="p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <section aria-label="Fraction inputs" className="space-y-6">
          <FractionFields legend="First fraction" prefix="first-fraction" value={first} onChange={setFirst} />
          <OperationPicker operation={operation} onChange={setOperation} />
          <FractionFields legend="Second fraction" prefix="second-fraction" value={second} onChange={setSecond} />
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button>
            <Button type="button" variant="secondary" onClick={() => { setFirst(exampleFirst); setSecond(exampleSecond); setOperation('add'); }}>Load example</Button>
          </div>
          {calculation.error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{calculation.error}</p>}
        </section>
        <ResultPanel result={calculation.result} />
      </div>
    </CardContent>
  </Card>;
}

function FractionFields({ legend, prefix, value, onChange }: { legend: string; prefix: string; value: FractionInput; onChange: (value: FractionInput) => void }) {
  const update = (field: keyof FractionInput, nextValue: string) => onChange({ ...value, [field]: nextValue });
  return <fieldset className="rounded-xl border border-border/60 bg-secondary/20 p-4">
    <legend className="px-2 font-semibold">{legend}</legend>
    <div className="grid gap-4 sm:grid-cols-3">
      <IntegerField id={`${prefix}-whole`} label="Whole number" hint="Optional" value={value.whole} onChange={(next) => update('whole', next)} />
      <IntegerField id={`${prefix}-numerator`} label="Numerator" value={value.numerator} onChange={(next) => update('numerator', next)} />
      <IntegerField id={`${prefix}-denominator`} label="Denominator" value={value.denominator} onChange={(next) => update('denominator', next)} />
    </div>
  </fieldset>;
}

function IntegerField({ id, label, hint, value, onChange }: { id: string; label: string; hint?: string; value: string; onChange: (value: string) => void }) {
  return <div className="space-y-2">
    <Label htmlFor={id}>{label}{hint && <span className="ml-1 font-normal text-muted-foreground">({hint})</span>}</Label>
    <Input id={id} type="text" inputMode="numeric" autoComplete="off" pattern="-?[0-9]*" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 text-base" />
  </div>;
}

function OperationPicker({ operation, onChange }: { operation: FractionOperation; onChange: (value: FractionOperation) => void }) {
  return <fieldset>
    <legend className="text-sm font-medium">Operation</legend>
    <div role="radiogroup" aria-label="Fraction operation" className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">{operations.map((item) => <button key={item.id} type="button" role="radio" aria-checked={operation === item.id} onClick={() => onChange(item.id)} className={`flex min-h-12 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${operation === item.id ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background hover:bg-secondary/40'}`}>
      <span className="text-lg" aria-hidden="true">{item.symbol}</span>{item.label}
    </button>)}</div>
  </fieldset>;
}

function ResultPanel({ result }: { result: ReturnType<typeof calculateFractions> | null }) {
  return <section className="rounded-2xl bg-blue-50/70 p-5 sm:p-6" aria-labelledby="fraction-result" aria-live="polite">
    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p>
    <h3 id="fraction-result" className="mt-2 text-xl font-bold">Your Fraction Calculation</h3>
    {result ? <>
      <p className="mt-5 break-words text-4xl font-bold tracking-tight text-primary sm:text-5xl">{result.mixed}</p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-background p-4"><dt className="text-sm font-medium text-muted-foreground">Improper fraction</dt><dd className="mt-1 break-words text-xl font-semibold">{result.improper}</dd></div>
        <div className="rounded-xl bg-background p-4"><dt className="text-sm font-medium text-muted-foreground">Decimal</dt><dd className="mt-1 break-words text-xl font-semibold">{result.decimalIsApproximate ? '≈ ' : ''}{result.decimal}</dd></div>
      </dl>
      <div className="mt-5 rounded-xl bg-background p-4">
        <h4 className="font-semibold">Step-by-step solution</h4>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">{result.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </div>
    </> : <p className="mt-4 leading-relaxed text-muted-foreground">Enter valid fractions to see the simplified answer, decimal value and calculation steps.</p>}
  </section>;
}

