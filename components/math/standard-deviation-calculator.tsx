'use client';

import { useState, type FormEvent } from 'react';
import { ChartNoAxesCombined, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { formatStatistic } from '@/lib/average';
import { calculateStandardDeviation, parseStandardDeviationInput, type StandardDeviationStatistics } from '@/lib/standard-deviation';

const EXAMPLE = '2, 4, 4, 4, 5, 5, 7, 9';
const TABLE_LIMIT = 20;

export function StandardDeviationCalculator() {
  const [input, setInput] = useState(EXAMPLE);
  const [result, setResult] = useState<StandardDeviationStatistics | null>(() => calculateStandardDeviation(parseStandardDeviationInput(EXAMPLE)));
  const [error, setError] = useState<string | null>(null);

  const calculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) {
      setResult(null);
      setError('Enter at least one number to calculate standard deviation.');
      return;
    }

    try {
      setResult(calculateStandardDeviation(parseStandardDeviationInput(input)));
      setError(null);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : 'Check the numbers and try again.');
    }
  };

  const reset = () => { setInput(''); setResult(null); setError(null); };

  return <Card className="overflow-hidden border-border/60 shadow-lg">
    <CardHeader className="border-b border-border/60 bg-card">
      <h2 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight"><ChartNoAxesCombined className="h-6 w-6 text-primary" aria-hidden="true" />Enter your dataset</h2>
      <p className="mt-2 text-sm text-muted-foreground">Enter one set of values to compare sample and population results. Your data stays in your browser.</p>
    </CardHeader>
    <CardContent className="p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <form onSubmit={calculate} noValidate aria-label="Standard deviation calculator inputs">
          <Label htmlFor="standard-deviation-numbers" className="text-base font-semibold">Enter numbers</Label>
          <Textarea id="standard-deviation-numbers" value={input} onChange={(event) => { setInput(event.target.value); setResult(null); setError(null); }} placeholder="10, 12, 15, 18, 20" rows={8} spellCheck={false} autoComplete="off" aria-describedby={error ? 'standard-deviation-help standard-deviation-error' : 'standard-deviation-help'} className="mt-3 min-h-44 resize-y text-base leading-relaxed" />
          <p id="standard-deviation-help" className="mt-2 text-sm text-muted-foreground">Separate numbers with commas, spaces or new lines. Decimals, negatives and scientific notation are supported.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Button type="submit">Calculate</Button><Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button></div>
          {error && <p id="standard-deviation-error" role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{error}</p>}
        </form>
        <ResultPanel result={result} />
      </div>
    </CardContent>
  </Card>;
}

function ResultPanel({ result }: { result: StandardDeviationStatistics | null }) {
  return <section className="rounded-2xl bg-blue-50/70 p-5 sm:p-6" aria-labelledby="standard-deviation-result" aria-live="polite">
    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p>
    <h3 id="standard-deviation-result" className="mt-2 text-xl font-bold">Sample and Population Results</h3>
    {!result ? <p className="mt-4 leading-relaxed text-muted-foreground">Enter one or more valid numbers, then select Calculate. Sample standard deviation requires at least two values.</p> : <>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <PrimaryResult label="Sample Standard Deviation (s)" value={formatNullable(result.sampleStandardDeviation)} description={result.sampleStandardDeviation === null ? 'At least two values are required to calculate sample standard deviation.' : 'Use when the values are a sample from a larger population.'} />
        <PrimaryResult label="Population Standard Deviation (σ)" value={formatStatistic(result.populationStandardDeviation)} description="Use when the values represent the entire population." />
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"><ResultItem label="Sample Variance (s²)" value={formatNullable(result.sampleVariance)} /><ResultItem label="Population Variance (σ²)" value={formatStatistic(result.populationVariance)} /><ResultItem label="Mean" value={formatStatistic(result.mean)} /><ResultItem label="Count" value={result.count.toLocaleString()} /><ResultItem label="Sum" value={formatStatistic(result.sum)} /><ResultItem label="Minimum" value={formatStatistic(result.minimum)} /><ResultItem label="Maximum" value={formatStatistic(result.maximum)} /></dl>
      <CalculationSteps result={result} />
      <div className="mt-5 rounded-xl border border-primary/15 bg-background p-4"><h4 className="font-semibold">Which result should I use?</h4><p className="mt-2 text-sm leading-relaxed text-muted-foreground"><strong className="text-foreground">Population:</strong> every member of the group is included. <strong className="text-foreground">Sample:</strong> the data represents only part of a larger group.</p></div>
    </>}
  </section>;
}

function PrimaryResult({ label, value, description }: { label: string; value: string; description: string }) {
  return <div className="rounded-xl bg-background p-5 shadow-sm"><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-2 break-words text-3xl font-bold tracking-tight text-primary sm:text-4xl">{value}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p></div>;
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-xl bg-background p-3 sm:p-4"><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-base font-semibold sm:text-lg">{value}</dd></div>;
}

function CalculationSteps({ result }: { result: StandardDeviationStatistics }) {
  const shownValues = result.values.slice(0, TABLE_LIMIT);
  return <div className="mt-5 rounded-xl bg-background p-4">
    <h4 className="font-semibold">Step-by-step calculation</h4>
    <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
      <li>Find the mean: {formatStatistic(result.sum)} ÷ {result.count.toLocaleString()} = <strong className="text-foreground">{formatStatistic(result.mean)}</strong>.</li>
      <li>Subtract the mean from each value and square every deviation.</li>
      <li>Add the squared deviations: Σ(x − mean)² = <strong className="text-foreground">{formatStatistic(result.sumSquaredDeviations)}</strong>.</li>
      <li>Population variance: {formatStatistic(result.sumSquaredDeviations)} ÷ {result.count.toLocaleString()} = <strong className="text-foreground">{formatStatistic(result.populationVariance)}</strong>.</li>
      <li>Population standard deviation: √{formatStatistic(result.populationVariance)} = <strong className="text-foreground">{formatStatistic(result.populationStandardDeviation)}</strong>.</li>
      {result.sampleVariance === null ? <li>Sample variance and standard deviation are not defined because n − 1 equals zero.</li> : <><li>Sample variance: {formatStatistic(result.sumSquaredDeviations)} ÷ {result.count - 1} = <strong className="text-foreground">{formatStatistic(result.sampleVariance)}</strong>.</li><li>Sample standard deviation: √{formatStatistic(result.sampleVariance)} = <strong className="text-foreground">{formatStatistic(result.sampleStandardDeviation!)}</strong>.</li></>}
    </ol>
    <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[480px] border-collapse text-left text-sm"><caption className="mb-3 text-left font-semibold text-foreground">Deviation table</caption><thead><tr className="border-b border-border"><th scope="col" className="px-3 py-2 font-semibold">Value (x)</th><th scope="col" className="px-3 py-2 font-semibold">x − Mean</th><th scope="col" className="px-3 py-2 font-semibold">(x − Mean)²</th></tr></thead><tbody>{shownValues.map((value, index) => { const deviation = value - result.mean; return <tr key={`${index}-${value}`} className="border-b border-border/60 last:border-0"><td className="px-3 py-2">{formatStatistic(value)}</td><td className="px-3 py-2">{formatStatistic(deviation)}</td><td className="px-3 py-2">{formatStatistic(deviation * deviation)}</td></tr>; })}</tbody></table></div>
    {result.count > TABLE_LIMIT && <p className="mt-3 text-sm text-muted-foreground">Showing the first {TABLE_LIMIT} of {result.count.toLocaleString()} values. All values are included in the calculations.</p>}
  </div>;
}

function formatNullable(value: number | null) {
  return value === null ? 'Not defined' : formatStatistic(value);
}

