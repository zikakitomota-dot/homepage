'use client';

import { useMemo, useState } from 'react';
import { BadgePercent, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adjustByPercentage, formatNumber, isSafePercentageInput, percentageChange, percentageOf, percentageRatio, reversePercentage, type Direction, type PercentageMode, type PercentageResult } from '@/lib/percentage';

const modes: { id: PercentageMode; label: string; shortLabel: string }[] = [
  { id: 'of', label: 'What is X% of Y?', shortLabel: 'Percentage of' },
  { id: 'ratio', label: 'X is what percent of Y?', shortLabel: 'Percent of total' },
  { id: 'change', label: 'Percentage increase or decrease', shortLabel: 'Percentage change' },
  { id: 'adjust', label: 'Increase or decrease by a percentage', shortLabel: 'Change a value' },
  { id: 'reverse', label: 'Reverse percentage', shortLabel: 'Find original' },
];

const examples: Record<PercentageMode, [string, string]> = { of: ['20', '150'], ratio: ['30', '150'], change: ['100', '125'], adjust: ['200', '15'], reverse: ['120', '20'] };

export function PercentageCalculator() {
  const [mode, setMode] = useState<PercentageMode>('of');
  const [first, setFirst] = useState(examples.of[0]);
  const [second, setSecond] = useState(examples.of[1]);
  const [direction, setDirection] = useState<Direction>('increase');
  const validation = useMemo(() => validate(mode, first, second, direction), [direction, first, mode, second]);
  const result = useMemo(() => validation ? null : calculate(mode, Number(first), Number(second), direction), [direction, first, mode, second, validation]);

  const changeMode = (next: PercentageMode) => { setMode(next); setFirst(examples[next][0]); setSecond(examples[next][1]); setDirection('increase'); };
  const reset = () => { setFirst(''); setSecond(''); setDirection('increase'); };

  return <Card className="overflow-hidden border-border/60 shadow-lg"><CardHeader className="border-b border-border/60 bg-card"><h2 className="flex items-center gap-2 text-2xl font-semibold leading-none tracking-tight"><BadgePercent className="h-6 w-6 text-primary" aria-hidden="true" />Calculate a percentage</h2><p className="mt-2 text-sm text-muted-foreground">Choose a calculation, then enter your numbers. Values stay in your browser and are not saved.</p></CardHeader><CardContent className="p-4 sm:p-6">
    <div role="tablist" aria-label="Percentage calculation type" className="grid gap-1 rounded-xl bg-secondary p-1 sm:grid-cols-2 lg:grid-cols-5">{modes.map((item) => <button key={item.id} type="button" role="tab" aria-selected={mode === item.id} aria-controls="percentage-panel" onClick={() => changeMode(item.id)} className={`min-h-12 rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${mode === item.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}><span className="lg:hidden">{item.shortLabel}</span><span className="hidden lg:inline">{item.label}</span></button>)}</div>
    <div id="percentage-panel" role="tabpanel" className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"><section aria-label="Percentage inputs"><ModeFields mode={mode} first={first} second={second} direction={direction} onFirst={setFirst} onSecond={setSecond} onDirection={setDirection} /><Button type="button" variant="outline" className="mt-6" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button>{validation && <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{validation}</p>}</section><ResultPanel mode={mode} result={result} /></div>
  </CardContent></Card>;
}

function ModeFields({ mode, first, second, direction, onFirst, onSecond, onDirection }: { mode: PercentageMode; first: string; second: string; direction: Direction; onFirst: (value: string) => void; onSecond: (value: string) => void; onDirection: (value: Direction) => void }) {
  if (mode === 'of') return <div className="space-y-5"><NumberField id="percentage-x" label="Percentage (X)" suffix="%" value={first} onChange={onFirst} /><NumberField id="percentage-y" label="Number (Y)" value={second} onChange={onSecond} /><Prompt>What is {first || 'X'}% of {second || 'Y'}?</Prompt></div>;
  if (mode === 'ratio') return <div className="space-y-5"><NumberField id="ratio-part" label="First Number (X)" value={first} onChange={onFirst} /><NumberField id="ratio-whole" label="Second Number (Y)" value={second} onChange={onSecond} /><Prompt>{first || 'X'} is what percent of {second || 'Y'}?</Prompt></div>;
  if (mode === 'change') return <div className="space-y-5"><NumberField id="change-original" label="Original Value" value={first} onChange={onFirst} /><NumberField id="change-new" label="New Value" value={second} onChange={onSecond} /></div>;
  if (mode === 'adjust') return <div className="space-y-5"><NumberField id="adjust-start" label="Starting Value" value={first} onChange={onFirst} /><NumberField id="adjust-percentage" label="Percentage" suffix="%" value={second} onChange={onSecond} /><DirectionPicker name="adjust-direction" direction={direction} onChange={onDirection} labels={['Increase', 'Decrease']} /></div>;
  return <div className="space-y-5"><NumberField id="reverse-final" label="Final Value" value={first} onChange={onFirst} /><NumberField id="reverse-percentage" label="Percentage Change" suffix="%" value={second} onChange={onSecond} /><DirectionPicker name="reverse-direction" direction={direction} onChange={onDirection} labels={['After an increase', 'After a decrease']} /></div>;
}

function ResultPanel({ mode, result }: { mode: PercentageMode; result: PercentageResult | null }) {
  let primary = result ? formatNumber(result.primary) : '—';
  if (result && (mode === 'ratio' || mode === 'change')) {
    if (mode === 'change') { const label = result.primary > 0 ? 'increase' : result.primary < 0 ? 'decrease' : 'no change'; primary = `${formatNumber(Math.abs(result.primary))}% ${label}`; }
    else primary = `${primary}%`;
  }
  return <section className="rounded-2xl bg-blue-50/70 p-5" aria-labelledby="percentage-result" aria-live="polite"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p><h3 id="percentage-result" className="mt-2 text-xl font-bold">Your Percentage Calculation</h3>{result ? <><p className="mt-5 break-words text-4xl font-bold tracking-tight text-primary">{primary}</p><p className="mt-4 leading-relaxed text-muted-foreground">{result.sentence}</p>{result.secondary && <p className="mt-3 font-semibold">{result.secondary}</p>}<div className="mt-5 rounded-xl bg-background p-4"><h4 className="font-semibold">Calculation</h4><p className="mt-2 break-words text-sm leading-relaxed text-muted-foreground">{result.calculation}</p></div></> : <p className="mt-4 leading-relaxed text-muted-foreground">Enter valid numbers to see the answer and calculation steps.</p>}</section>;
}

function NumberField({ id, label, suffix, value, onChange }: { id: string; label: string; suffix?: string; value: string; onChange: (value: string) => void }) { return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><div className="relative"><Input id={id} type="number" inputMode="decimal" step="any" value={value} onChange={(event) => onChange(event.target.value)} className={`h-11 text-base ${suffix ? 'pr-10' : ''}`} />{suffix && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted-foreground" aria-hidden="true">{suffix}</span>}</div></div>; }
function Prompt({ children }: { children: React.ReactNode }) { return <p className="rounded-lg bg-secondary/50 p-3 text-sm font-medium">{children}</p>; }
function DirectionPicker({ name, direction, labels, onChange }: { name: string; direction: Direction; labels: [string, string]; onChange: (value: Direction) => void }) { return <fieldset><legend className="text-sm font-medium">Calculation direction</legend><div className="mt-2 grid grid-cols-2 gap-2">{(['increase', 'decrease'] as const).map((value, index) => <label key={value} className={`flex min-h-11 cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-center text-sm font-semibold ${direction === value ? 'border-primary bg-primary/10 text-primary' : 'border-input bg-background'}`}><input className="sr-only" type="radio" name={name} value={value} checked={direction === value} onChange={() => onChange(value)} />{labels[index]}</label>)}</div></fieldset>; }

function calculate(mode: PercentageMode, first: number, second: number, direction: Direction) { if (mode === 'of') return percentageOf(first, second); if (mode === 'ratio') return percentageRatio(first, second); if (mode === 'change') return percentageChange(first, second); if (mode === 'adjust') return adjustByPercentage(first, second, direction); return reversePercentage(first, second, direction); }
function validate(mode: PercentageMode, firstText: string, secondText: string, direction: Direction) { if (!firstText.trim() || !secondText.trim()) return 'Enter both values to calculate the result.'; const first = Number(firstText); const second = Number(secondText); if (![first, second].every(isSafePercentageInput)) return 'Enter valid numbers no larger than 1 quadrillion in magnitude.'; if (mode === 'ratio' && second === 0) return 'The second number cannot be zero because division by zero is undefined.'; if (mode === 'change' && first <= 0) return 'The original value must be greater than zero for a meaningful percentage change.'; if (mode === 'adjust' && first < 0) return 'Starting value must be zero or greater for an increase or decrease calculation.'; if ((mode === 'adjust' || mode === 'reverse') && second < 0) return 'Enter a percentage of zero or greater and use the increase or decrease option.'; if (mode === 'reverse' && direction === 'decrease' && second === 100) return 'An original value cannot be recovered after a 100% decrease.'; return null; }
