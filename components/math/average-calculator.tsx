'use client';

import { useState, type FormEvent } from 'react';
import { BarChart3, Calculator, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { calculateAverageStatistics, formatStatistic, parseNumberList, type AverageStatistics } from '@/lib/average';

const EXAMPLE = '10, 15, 20, 25, 30';
const EQUATION_LIMIT = 20;
const SORTED_VALUES_LIMIT = 50;

export function AverageCalculator() {
  const [input, setInput] = useState(EXAMPLE);
  const [result, setResult] = useState<AverageStatistics | null>(() => calculateAverageStatistics(parseNumberList(EXAMPLE)));
  const [error, setError] = useState<string | null>(null);

  const calculate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      setResult(calculateAverageStatistics(parseNumberList(input)));
      setError(null);
    } catch (caught) {
      setResult(null);
      setError(caught instanceof Error ? caught.message : 'Check the numbers and try again.');
    }
  };

  const reset = () => {
    setInput('');
    setResult(null);
    setError(null);
  };

  return <Card className="overflow-hidden border-border/60 shadow-lg">
    <CardHeader className="border-b border-border/60 bg-card">
      <h2 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight"><Calculator className="h-6 w-6 text-primary" aria-hidden="true" />Calculate an average</h2>
      <p className="mt-2 text-sm text-muted-foreground">Paste a list to find its mean and other descriptive statistics. Your values stay in your browser.</p>
    </CardHeader>
    <CardContent className="p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <form onSubmit={calculate} noValidate aria-label="Average calculator inputs">
          <Label htmlFor="average-numbers" className="text-base font-semibold">Enter numbers</Label>
          <Textarea id="average-numbers" value={input} onChange={(event) => { setInput(event.target.value); setResult(null); setError(null); }} placeholder="10, 15, 20, 25, 30" rows={8} spellCheck={false} autoComplete="off" aria-describedby={error ? 'average-help average-error' : 'average-help'} className="mt-3 min-h-44 resize-y text-base leading-relaxed" />
          <p id="average-help" className="mt-2 text-sm text-muted-foreground">Separate numbers with commas, spaces or new lines. Decimals, negatives and scientific notation are supported.</p>
          <div className="mt-5 flex flex-wrap gap-3"><Button type="submit">Calculate</Button><Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button></div>
          {error && <p id="average-error" role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{error}</p>}
        </form>
        <ResultPanel result={result} />
      </div>
    </CardContent>
  </Card>;
}

function ResultPanel({ result }: { result: AverageStatistics | null }) {
  return <section className="rounded-2xl bg-blue-50/70 p-5 sm:p-6" aria-labelledby="average-result" aria-live="polite">
    <p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p>
    <h3 id="average-result" className="mt-2 text-xl font-bold">Your Average Calculation</h3>
    {!result ? <p className="mt-4 leading-relaxed text-muted-foreground">Enter one or more valid numbers, then select Calculate to see the results and steps.</p> : <>
      <div className="mt-5 rounded-xl bg-background p-5 shadow-sm"><p className="text-sm font-medium text-muted-foreground">Average (Mean)</p><p className="mt-1 break-words text-4xl font-bold tracking-tight text-primary sm:text-5xl">{formatStatistic(result.mean)}</p></div>
      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3"><ResultItem label="Median" value={formatStatistic(result.median)} /><ResultItem label="Mode" value={result.modes.length ? result.modes.map(formatStatistic).join(', ') : 'No mode'} /><ResultItem label="Range" value={formatStatistic(result.range)} /><ResultItem label="Sum" value={formatStatistic(result.sum)} /><ResultItem label="Count" value={result.count.toLocaleString()} /><ResultItem label="Minimum" value={formatStatistic(result.minimum)} /><ResultItem label="Maximum" value={formatStatistic(result.maximum)} /></dl>
      <Explanation result={result} />
    </>}
  </section>;
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-xl bg-background p-3 sm:p-4"><dt className="text-sm font-medium text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-base font-semibold sm:text-lg">{value}</dd></div>;
}

function Explanation({ result }: { result: AverageStatistics }) {
  const formatted = result.values.map(formatStatistic);
  const showEquation = result.count <= EQUATION_LIMIT;
  const showSorted = result.count <= SORTED_VALUES_LIMIT;
  return <div className="mt-5 rounded-xl bg-background p-4">
    <h4 className="flex items-center gap-2 font-semibold"><BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />Calculation steps</h4>
    <ol className="mt-3 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-muted-foreground">
      <li><span className="font-medium text-foreground">Add the numbers.</span><br />{showEquation ? `${formatted.join(' + ')} = ${formatStatistic(result.sum)}` : `Sum of ${result.count.toLocaleString()} values = ${formatStatistic(result.sum)}`}</li>
      <li><span className="font-medium text-foreground">Count the numbers.</span><br />There {result.count === 1 ? 'is 1 value' : `are ${result.count.toLocaleString()} values`}.</li>
      <li><span className="font-medium text-foreground">Divide the sum by the count.</span><br />{formatStatistic(result.sum)} ÷ {result.count.toLocaleString()} = {formatStatistic(result.mean)}</li>
    </ol>
    <p className="mt-4 font-bold text-foreground">Average = {formatStatistic(result.mean)}</p>
    {showSorted && <div className="mt-4 border-t border-border/60 pt-4"><p className="font-semibold">Sorted values</p><p className="mt-2 break-words text-sm leading-relaxed text-muted-foreground">{result.sortedValues.map(formatStatistic).join(', ')}</p></div>}
  </div>;
}

