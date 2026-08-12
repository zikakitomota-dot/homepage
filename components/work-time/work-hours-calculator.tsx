'use client';

import { useMemo, useState } from 'react';
import { Check, Clipboard, Clock3, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  calculateWorkDay,
  decimalHours,
  emptyWorkEntries,
  formatDuration,
  splitWeeklyMinutes,
  workDays,
  type WorkDay,
  type WorkEntry,
} from '@/lib/work-time';

type CurrencyCode = 'USD' | 'MYR' | 'GBP' | 'EUR' | 'SGD' | 'AUD' | 'CAD';
const currencies: { code: CurrencyCode; label: string; locale: string }[] = [
  { code: 'USD', label: 'USD $', locale: 'en-US' },
  { code: 'MYR', label: 'MYR RM', locale: 'en-MY' },
  { code: 'GBP', label: 'GBP £', locale: 'en-GB' },
  { code: 'EUR', label: 'EUR €', locale: 'en-IE' },
  { code: 'SGD', label: 'SGD S$', locale: 'en-SG' },
  { code: 'AUD', label: 'AUD A$', locale: 'en-AU' },
  { code: 'CAD', label: 'CAD C$', locale: 'en-CA' },
];

function formatCurrency(value: number, currency: CurrencyCode) {
  const config = currencies.find((item) => item.code === currency) ?? currencies[0];
  return new Intl.NumberFormat(config.locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(value);
}

function initialEntries() {
  const entries = emptyWorkEntries();
  for (const day of workDays.slice(0, 5)) entries[day] = { start: '09:00', end: '17:00', breakMinutes: '60' };
  return entries;
}

export function WorkHoursCalculator() {
  const [entries, setEntries] = useState(initialEntries);
  const [timeFormat, setTimeFormat] = useState<'12' | '24'>('12');
  const [overtimeThreshold, setOvertimeThreshold] = useState('40');
  const [hourlyRate, setHourlyRate] = useState('');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const results = useMemo(() => Object.fromEntries(
    workDays.map((day) => [day, calculateWorkDay(entries[day])]),
  ) as Record<WorkDay, ReturnType<typeof calculateWorkDay>>, [entries]);

  const totalMinutes = workDays.reduce((total, day) => total + (results[day]?.error ? 0 : results[day]?.workedMinutes ?? 0), 0);
  const thresholdValue = Number(overtimeThreshold);
  const thresholdValid = Number.isFinite(thresholdValue) && thresholdValue > 0;
  const { regularMinutes, overtimeMinutes } = splitWeeklyMinutes(totalMinutes, thresholdValid ? thresholdValue : 40);
  const rateValue = hourlyRate.trim() === '' ? null : Number(hourlyRate);
  const rateValid = rateValue === null || (Number.isFinite(rateValue) && rateValue >= 0);
  const multiplierValue = Number(overtimeMultiplier);
  const multiplierValid = Number.isFinite(multiplierValue) && multiplierValue > 0;
  const showPay = rateValue !== null && rateValid && multiplierValid;
  const regularPay = showPay ? regularMinutes / 60 * rateValue : 0;
  const overtimePay = showPay ? overtimeMinutes / 60 * rateValue * multiplierValue : 0;

  const updateEntry = (day: WorkDay, field: keyof WorkEntry, value: string) => {
    setEntries((current) => ({ ...current, [day]: { ...current[day], [field]: value } }));
  };

  const clearAll = () => {
    setEntries(emptyWorkEntries());
    setHourlyRate('');
    setOvertimeThreshold('40');
    setOvertimeMultiplier('1.5');
    setCopyStatus('idle');
  };

  const summaryText = () => {
    const lines = ['Work Hours Summary', ''];
    for (const day of workDays) {
      const result = results[day];
      if (result && !result.error) lines.push(`${day}: ${decimalHours(result.workedMinutes)} hours`);
    }
    lines.push('', `Total: ${decimalHours(totalMinutes)} hours`);
    lines.push(`Regular: ${decimalHours(regularMinutes)} hours`, `Overtime: ${decimalHours(overtimeMinutes)} hours`);
    if (showPay) lines.push(`Estimated pay: ${formatCurrency(regularPay + overtimePay, currency)}`);
    return lines.join('\n');
  };

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summaryText());
      setCopyStatus('copied');
    } catch {
      setCopyStatus('error');
    }
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-lg">
      <CardHeader className="border-b border-border/60 bg-card">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl"><Clock3 className="h-6 w-6 text-primary" aria-hidden="true" />Weekly timesheet</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">Enter only the days you worked. Overnight shifts are supported.</p>
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
        <div className="hidden grid-cols-[minmax(7rem,1.1fr)_repeat(3,minmax(8rem,1fr))_minmax(9rem,1.2fr)] gap-3 px-3 pb-2 text-sm font-semibold text-muted-foreground md:grid" aria-hidden="true">
          <span>Day</span><span>Start time</span><span>End time</span><span>Unpaid break</span><span>Worked</span>
        </div>
        <div className="space-y-3">
          {workDays.map((day) => {
            const result = results[day];
            const errorId = `${day.toLowerCase()}-error`;
            return (
              <fieldset key={day} className="grid gap-3 rounded-xl border border-border/60 bg-secondary/20 p-4 md:grid-cols-[minmax(7rem,1.1fr)_repeat(3,minmax(8rem,1fr))_minmax(9rem,1.2fr)] md:items-start md:p-3">
                <legend className="sr-only">{day}</legend>
                <p className="pt-1 font-bold md:pt-3">{day}</p>
                <TimeField id={`${day}-start`} label="Start" value={entries[day].start} format={timeFormat} describedBy={result?.error ? errorId : undefined} onChange={(value) => updateEntry(day, 'start', value)} />
                <TimeField id={`${day}-end`} label="End" value={entries[day].end} format={timeFormat} describedBy={result?.error ? errorId : undefined} onChange={(value) => updateEntry(day, 'end', value)} />
                <div className="space-y-1.5">
                  <Label htmlFor={`${day}-break`} className="md:sr-only">Unpaid break in minutes</Label>
                  <div className="relative"><Input id={`${day}-break`} type="number" inputMode="numeric" min="0" step="1" value={entries[day].breakMinutes} onChange={(event) => updateEntry(day, 'breakMinutes', event.target.value)} aria-describedby={result?.error ? errorId : undefined} placeholder="0" className="h-11 pr-14 text-base" /><span className="pointer-events-none absolute right-3 top-3 text-sm text-muted-foreground">min</span></div>
                </div>
                <div className="min-h-11 rounded-lg bg-background px-3 py-2 text-sm" aria-live="polite">
                  <span className="font-semibold md:hidden">Result: </span>
                  {result?.error ? <span id={errorId} className="text-destructive">{result.error}</span> : result ? <><span className="font-bold">{formatDuration(result.workedMinutes)}</span><span className="block text-muted-foreground">{decimalHours(result.workedMinutes)} hours</span></> : <span className="text-muted-foreground">Not entered</span>}
                </div>
              </fieldset>
            );
          })}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <section className="rounded-2xl border border-border/60 p-5" aria-labelledby="settings-heading">
            <h2 id="settings-heading" className="text-xl font-bold">Optional settings</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <NumberField id="overtime-threshold" label="Weekly overtime starts after" suffix="hours" value={overtimeThreshold} min="0.01" step="0.25" onChange={setOvertimeThreshold} error={!thresholdValid ? 'Enter an overtime threshold greater than zero.' : undefined} />
              <NumberField id="overtime-multiplier" label="Overtime multiplier" suffix="×" value={overtimeMultiplier} min="0.01" step="0.1" onChange={setOvertimeMultiplier} error={!multiplierValid ? 'Enter a multiplier greater than zero.' : undefined} />
              <NumberField id="hourly-rate" label="Hourly rate (optional)" value={hourlyRate} min="0" step="0.01" onChange={setHourlyRate} error={!rateValid ? 'Enter a valid hourly rate of zero or more.' : undefined} />
              <div className="space-y-2"><Label htmlFor="work-currency">Currency</Label><select id="work-currency" value={currency} onChange={(event) => setCurrency(event.target.value as CurrencyCode)} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{currencies.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">Overtime rules vary by employer, employment agreement and jurisdiction. This calculator is a planning aid, not legal or payroll advice.</p>
          </section>

          <section className="rounded-2xl bg-blue-50/70 p-5" aria-labelledby="summary-heading" aria-live="polite">
            <h2 id="summary-heading" className="text-xl font-bold">Weekly summary</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SummaryItem label="Total hours worked" value={formatDuration(totalMinutes)} emphasis />
              <SummaryItem label="Decimal hours" value={`${decimalHours(totalMinutes)} hours`} />
              <SummaryItem label="Regular hours" value={formatDuration(regularMinutes)} />
              <SummaryItem label="Overtime hours" value={formatDuration(overtimeMinutes)} />
              {showPay && <><SummaryItem label="Regular pay" value={formatCurrency(regularPay, currency)} /><SummaryItem label="Overtime pay" value={formatCurrency(overtimePay, currency)} /><div className="sm:col-span-2"><SummaryItem label="Estimated total pay" value={formatCurrency(regularPay + overtimePay, currency)} emphasis /></div></>}
            </div>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={clearAll}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Clear All</Button>
              <Button type="button" onClick={copySummary}>{copyStatus === 'copied' ? <Check className="mr-2 h-4 w-4" aria-hidden="true" /> : <Clipboard className="mr-2 h-4 w-4" aria-hidden="true" />}{copyStatus === 'copied' ? 'Copied' : 'Copy Summary'}</Button>
            </div>
            {copyStatus === 'error' && <p role="status" className="mt-3 text-sm text-destructive">Could not copy automatically. Please try again or copy the results manually.</p>}
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

function TimeField({ id, label, value, format, describedBy, onChange }: { id: string; label: string; value: string; format: '12' | '24'; describedBy?: string; onChange: (value: string) => void }) {
  return <div className="space-y-1.5"><Label htmlFor={id} className="md:sr-only">{label} time</Label><Input id={id} type="time" lang={format === '12' ? 'en-US' : 'en-GB'} value={value} onChange={(event) => onChange(event.target.value)} aria-describedby={describedBy} className="h-11 text-base" /></div>;
}

function NumberField({ id, label, value, suffix, min, step, error, onChange }: { id: string; label: string; value: string; suffix?: string; min: string; step: string; error?: string; onChange: (value: string) => void }) {
  const errorId = `${id}-error`;
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><div className="relative"><Input id={id} type="number" inputMode="decimal" min={min} step={step} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className={`h-11 text-base ${suffix ? 'pr-14' : ''}`} />{suffix && <span className="pointer-events-none absolute right-3 top-3 text-sm text-muted-foreground">{suffix}</span>}</div>{error && <p id={errorId} className="text-sm text-destructive">{error}</p>}</div>;
}

function SummaryItem({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return <div className={`rounded-xl p-4 ${emphasis ? 'bg-primary text-primary-foreground' : 'bg-background'}`}><p className="text-sm font-medium opacity-80">{label}</p><p className="mt-1 text-xl font-bold">{value}</p></div>;
}
