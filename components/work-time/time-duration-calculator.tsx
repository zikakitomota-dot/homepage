'use client';

import { useMemo, useState } from 'react';
import { Check, Clipboard, RotateCcw, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  durationBetween,
  formatClock,
  formatDurationWords,
  formatLongDate,
  parseClockTime,
  parseLocalDate,
  shiftTime,
} from '@/lib/time-duration';

type Mode = 'between' | 'add' | 'subtract';
type Calculation = {
  heading: string;
  primary: string;
  rows: { label: string; value: string }[];
  copyLines: string[];
  note?: string;
};

const modes: { id: Mode; label: string }[] = [
  { id: 'between', label: 'Time Between' },
  { id: 'add', label: 'Add Time' },
  { id: 'subtract', label: 'Subtract Time' },
];

const initial = {
  startTime: '09:15',
  endTime: '17:45',
  startDate: '',
  endDate: '',
  durationHours: '2',
  durationMinutes: '30',
  durationSeconds: '0',
};

export function TimeDurationCalculator() {
  const [mode, setMode] = useState<Mode>('between');
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('12');
  const [useDates, setUseDates] = useState(false);
  const [includeSeconds, setIncludeSeconds] = useState(false);
  const [values, setValues] = useState(initial);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const update = (field: keyof typeof initial, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setCopyStatus('idle');
  };

  const validation = useMemo(() => {
    if (!values.startTime) return 'Enter a start time.';
    if (!parseClockTime(values.startTime)) return 'Enter a valid start time.';
    if (mode === 'between') {
      if (!values.endTime) return 'Enter an end time.';
      if (!parseClockTime(values.endTime)) return 'Enter a valid end time.';
      if (useDates && (!parseLocalDate(values.startDate) || !parseLocalDate(values.endDate))) return 'Enter valid start and end dates.';
      const seconds = durationBetween(values.startTime, values.endTime, useDates ? values.startDate : undefined, useDates ? values.endDate : undefined);
      if (seconds === null) return 'Enter a valid date and time combination.';
      if (seconds < 0) return 'End date and time must not be before the start date and time.';
      return null;
    }
    if (useDates && !parseLocalDate(values.startDate)) return 'Enter a valid date.';
    const inputs = [values.durationHours, values.durationMinutes, includeSeconds ? values.durationSeconds : '0'];
    if (inputs.some((value) => value.trim() === '')) return 'Enter hours and minutes for the duration.';
    const [hours, minutes, seconds] = inputs.map(Number);
    if (![hours, minutes, seconds].every(Number.isInteger)) return 'Use whole numbers for hours, minutes and seconds.';
    if (hours < 0 || hours > 1_000_000) return 'Hours must be between 0 and 1,000,000.';
    if (minutes < 0 || minutes > 59) return 'Minutes must be between 0 and 59.';
    if (seconds < 0 || seconds > 59) return 'Seconds must be between 0 and 59.';
    return null;
  }, [includeSeconds, mode, useDates, values]);

  const calculation = useMemo<Calculation | null>(() => {
    if (validation) return null;
    const start = parseClockTime(values.startTime)!;
    const startLabel = formatClock(start.hours * 3600 + start.minutes * 60 + start.seconds, timeFormat, includeSeconds);
    if (mode === 'between') {
      const end = parseClockTime(values.endTime)!;
      const endLabel = formatClock(end.hours * 3600 + end.minutes * 60 + end.seconds, timeFormat, includeSeconds);
      const totalSeconds = durationBetween(values.startTime, values.endTime, useDates ? values.startDate : undefined, useDates ? values.endDate : undefined)!;
      const overnight = !useDates && totalSeconds > 0 && (end.hours * 3600 + end.minutes * 60 + end.seconds) < (start.hours * 3600 + start.minutes * 60 + start.seconds);
      const totalHours = totalSeconds / 3600;
      const rows = [
        { label: totalSeconds >= 86_400 ? 'Total hours' : 'Decimal hours', value: `${totalHours.toFixed(2)} hours` },
        { label: 'Total minutes', value: Math.floor(totalSeconds / 60).toLocaleString() },
        ...(includeSeconds ? [{ label: 'Total seconds', value: totalSeconds.toLocaleString() }] : []),
      ];
      const startFull = useDates ? `${formatLongDate(parseLocalDate(values.startDate)!)} at ${startLabel}` : startLabel;
      const endFull = useDates ? `${formatLongDate(parseLocalDate(values.endDate)!)} at ${endLabel}` : endLabel;
      return {
        heading: 'Time duration',
        primary: formatDurationWords(totalSeconds, includeSeconds),
        rows,
        note: overnight ? 'The end time was treated as the following day.' : totalSeconds === 0 ? 'The start and end are the same, so the duration is zero.' : undefined,
        copyLines: [`Start: ${startFull}`, `End: ${endFull}`, '', `Duration: ${formatDurationWords(totalSeconds, includeSeconds)}`, `${totalSeconds >= 86_400 ? 'Total' : 'Decimal'} hours: ${totalHours.toFixed(2)}`, `Total minutes: ${Math.floor(totalSeconds / 60).toLocaleString()}`],
      };
    }

    const amountSeconds = Number(values.durationHours) * 3600 + Number(values.durationMinutes) * 60 + (includeSeconds ? Number(values.durationSeconds) : 0);
    const signedAmount = mode === 'add' ? amountSeconds : -amountSeconds;
    const shifted = shiftTime(values.startTime, signedAmount, useDates ? values.startDate : undefined)!;
    const resultTime = formatClock(shifted.clockSeconds, timeFormat, includeSeconds);
    const resultDate = shifted.date ? formatLongDate(shifted.date) : null;
    const action = mode === 'add' ? 'Added' : 'Subtracted';
    const dayNote = !useDates && shifted.dayOffset !== 0
      ? `${Math.abs(shifted.dayOffset)} ${Math.abs(shifted.dayOffset) === 1 ? 'day' : 'days'} ${shifted.dayOffset > 0 ? 'later' : 'earlier'}`
      : undefined;
    return {
      heading: mode === 'add' ? 'New time' : 'Earlier time',
      primary: resultDate ? `${resultDate} at ${resultTime}` : resultTime,
      rows: [{ label: `${action} duration`, value: formatDurationWords(amountSeconds, includeSeconds) }],
      note: dayNote ? `The result is ${dayNote}.` : undefined,
      copyLines: [`Start: ${useDates ? `${formatLongDate(parseLocalDate(values.startDate)!)} at ` : ''}${startLabel}`, `${action}: ${formatDurationWords(amountSeconds, includeSeconds)}`, '', `Result: ${resultDate ? `${resultDate} at ` : ''}${resultTime}${dayNote ? ` (${dayNote})` : ''}`],
    };
  }, [includeSeconds, mode, timeFormat, useDates, validation, values]);

  const reset = () => {
    setValues(initial);
    setMode('between');
    setUseDates(false);
    setIncludeSeconds(false);
    setCopyStatus('idle');
  };

  const copyResult = async () => {
    if (!calculation) return;
    const text = ['Time Duration Calculation', '', ...calculation.copyLines, '', 'Generated with Zalea Studio Time Duration Calculator'].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-lg">
      <CardHeader className="border-b border-border/60 bg-card">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl"><Timer className="h-6 w-6 text-primary" aria-hidden="true" />Calculate time</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">Find an elapsed duration or shift a clock time instantly.</p>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Time format</legend>
            <div className="inline-flex rounded-lg border border-border bg-background p-1">
              {(['12', '24'] as const).map((format) => <button key={format} type="button" aria-pressed={timeFormat === format} onClick={() => setTimeFormat(format)} className={`rounded-md px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${timeFormat === format ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>{format}-hour</button>)}
            </div>
          </fieldset>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div role="tablist" aria-label="Calculation mode" className="grid grid-cols-3 gap-1 rounded-xl bg-secondary p-1">
          {modes.map((item) => <button key={item.id} id={`${item.id}-tab`} type="button" role="tab" aria-selected={mode === item.id} aria-controls="time-calculator-panel" onClick={() => { setMode(item.id); setCopyStatus('idle'); }} className={`min-h-12 rounded-lg px-2 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 ${mode === item.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{item.label}</button>)}
        </div>

        <div id="time-calculator-panel" role="tabpanel" aria-labelledby={`${mode}-tab`} className="mt-6 grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <section className="space-y-6" aria-label="Time inputs">
            <div className="flex flex-wrap gap-x-8 gap-y-4 rounded-xl border border-border/60 bg-secondary/20 p-4">
              <Toggle id="use-dates" label="Use dates" checked={useDates} onChange={setUseDates} />
              <Toggle id="include-seconds" label="Include seconds" checked={includeSeconds} onChange={setIncludeSeconds} />
            </div>

            {mode === 'between' ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <DateTimeFields prefix="start" label="Start" date={values.startDate} time={values.startTime} showDate={useDates} includeSeconds={includeSeconds} timeFormat={timeFormat} onDate={(value) => update('startDate', value)} onTime={(value) => update('startTime', value)} />
                <DateTimeFields prefix="end" label="End" date={values.endDate} time={values.endTime} showDate={useDates} includeSeconds={includeSeconds} timeFormat={timeFormat} onDate={(value) => update('endDate', value)} onTime={(value) => update('endTime', value)} />
              </div>
            ) : (
              <>
                <DateTimeFields prefix="shift-start" label="Start" date={values.startDate} time={values.startTime} showDate={useDates} includeSeconds={includeSeconds} timeFormat={timeFormat} onDate={(value) => update('startDate', value)} onTime={(value) => update('startTime', value)} />
                <fieldset>
                  <legend className="text-base font-bold">Time to {mode}</legend>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <DurationField id="duration-hours" label="Hours" value={values.durationHours} max="1000000" onChange={(value) => update('durationHours', value)} />
                    <DurationField id="duration-minutes" label="Minutes" value={values.durationMinutes} max="59" onChange={(value) => update('durationMinutes', value)} />
                    {includeSeconds && <DurationField id="duration-seconds" label="Seconds" value={values.durationSeconds} max="59" onChange={(value) => update('durationSeconds', value)} />}
                  </div>
                </fieldset>
              </>
            )}

            {!useDates && mode === 'between' && <p className="rounded-lg bg-blue-50/70 p-3 text-sm leading-relaxed text-muted-foreground">If the end time is earlier than the start time, it is treated as occurring the following day.</p>}
            {validation && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{validation}</p>}
          </section>

          <section className="rounded-2xl bg-blue-50/70 p-5" aria-labelledby="duration-result-heading" aria-live="polite">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p>
            <h2 id="duration-result-heading" className="mt-2 text-xl font-bold">{calculation?.heading ?? 'Ready to calculate'}</h2>
            {calculation ? <>
              <p className="mt-4 break-words text-3xl font-bold tracking-tight text-primary sm:text-4xl">{calculation.primary}</p>
              {calculation.note && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{calculation.note}</p>}
              <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {calculation.rows.map((row) => <div key={row.label} className="rounded-xl bg-background p-4"><dt className="text-sm text-muted-foreground">{row.label}</dt><dd className="mt-1 text-lg font-bold">{row.value}</dd></div>)}
              </dl>
            </> : <p className="mt-4 text-muted-foreground">Correct the input above to see a safe result.</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button>
              <Button type="button" onClick={copyResult} disabled={!calculation}>{copyStatus === 'copied' ? <Check className="mr-2 h-4 w-4" aria-hidden="true" /> : <Clipboard className="mr-2 h-4 w-4" aria-hidden="true" />}{copyStatus === 'copied' ? 'Copied' : 'Copy Result'}</Button>
            </div>
            {copyStatus === 'error' && <p role="status" className="mt-3 text-sm text-destructive">Could not copy automatically. Please try again or copy the result manually.</p>}
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

function Toggle({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return <div className="flex items-center gap-3"><Switch id={id} checked={checked} onCheckedChange={onChange} /><Label htmlFor={id} className="cursor-pointer font-semibold">{label}</Label></div>;
}

function DateTimeFields({ prefix, label, date, time, showDate, includeSeconds, timeFormat, onDate, onTime }: { prefix: string; label: string; date: string; time: string; showDate: boolean; includeSeconds: boolean; timeFormat: '12' | '24'; onDate: (value: string) => void; onTime: (value: string) => void }) {
  return <fieldset className="space-y-3"><legend className="text-base font-bold">{label}</legend>{showDate && <div className="space-y-2"><Label htmlFor={`${prefix}-date`}>{label} date</Label><Input id={`${prefix}-date`} type="date" value={date} onChange={(event) => onDate(event.target.value)} className="h-11 text-base" /></div>}<div className="space-y-2"><Label htmlFor={`${prefix}-time`}>{label} time</Label><Input id={`${prefix}-time`} type="time" lang={timeFormat === '12' ? 'en-US' : 'en-GB'} step={includeSeconds ? 1 : 60} value={time} onChange={(event) => onTime(event.target.value)} className="h-11 text-base" /></div></fieldset>;
}

function DurationField({ id, label, value, max, onChange }: { id: string; label: string; value: string; max: string; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type="number" inputMode="numeric" min="0" max={max} step="1" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 text-base" /></div>;
}
