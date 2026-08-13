'use client';

import { useMemo, useState } from 'react';
import { BadgeDollarSign, Check, Clipboard, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  calculateDirectOvertime,
  calculateWeeklyOvertime,
  formatOvertimeMoney,
  overtimeCurrencies,
  type OvertimeCurrency,
} from '@/lib/overtime';

type Mode = 'weekly' | 'direct';
const maximumValue = 1_000_000;

export function OvertimeCalculator() {
  const [mode, setMode] = useState<Mode>('weekly');
  const [totalHours, setTotalHours] = useState('45');
  const [regularHours, setRegularHours] = useState('40');
  const [overtimeHours, setOvertimeHours] = useState('6');
  const [hourlyRate, setHourlyRate] = useState('20');
  const [threshold, setThreshold] = useState('40');
  const [multiplier, setMultiplier] = useState('1.5');
  const [currency, setCurrency] = useState<OvertimeCurrency>('USD');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const validation = useMemo(() => {
    const rate = Number(hourlyRate);
    const multiple = Number(multiplier);
    if (hourlyRate.trim() === '' || !Number.isFinite(rate) || rate <= 0 || rate > maximumValue) return `Hourly rate must be greater than zero and no more than ${maximumValue.toLocaleString()}.`;
    if (multiplier.trim() === '' || !Number.isFinite(multiple) || multiple <= 0 || multiple > 100) return 'Overtime multiplier must be greater than zero and no more than 100.';
    const fields = mode === 'weekly'
      ? [{ label: 'Total hours', value: totalHours }, { label: 'Overtime threshold', value: threshold }]
      : [{ label: 'Regular hours', value: regularHours }, { label: 'Overtime hours', value: overtimeHours }];
    for (const field of fields) {
      const value = Number(field.value);
      if (field.value.trim() === '' || !Number.isFinite(value) || value < 0 || value > maximumValue) return `${field.label} must be between 0 and ${maximumValue.toLocaleString()}.`;
    }
    return null;
  }, [hourlyRate, mode, multiplier, overtimeHours, regularHours, threshold, totalHours]);

  const result = useMemo(() => {
    if (validation) return null;
    return mode === 'weekly'
      ? calculateWeeklyOvertime(Number(totalHours), Number(hourlyRate), Number(threshold), Number(multiplier))
      : calculateDirectOvertime({ regularHours: Number(regularHours), overtimeHours: Number(overtimeHours), hourlyRate: Number(hourlyRate), multiplier: Number(multiplier) });
  }, [hourlyRate, mode, multiplier, overtimeHours, regularHours, threshold, totalHours, validation]);

  const reset = () => {
    setMode('weekly'); setTotalHours('45'); setRegularHours('40'); setOvertimeHours('6');
    setHourlyRate('20'); setThreshold('40'); setMultiplier('1.5'); setCurrency('USD'); setCopyStatus('idle');
  };

  const copyResult = async () => {
    if (!result) return;
    const lines = [
      'Overtime Pay Calculation', '',
      ...(mode === 'weekly' ? [`Total hours: ${formatHours(Number(totalHours))}`] : []),
      `Regular hours: ${formatHours(result.regularHours)}`,
      `Overtime hours: ${formatHours(result.overtimeHours)}`, '',
      `Regular rate: ${formatOvertimeMoney(result.regularRate, currency)}/hour`,
      `Overtime rate: ${formatOvertimeMoney(result.overtimeRate, currency)}/hour`, '',
      `Regular pay: ${formatOvertimeMoney(result.regularPay, currency)}`,
      `Overtime pay: ${formatOvertimeMoney(result.overtimePay, currency)}`, '',
      `Estimated total pay: ${formatOvertimeMoney(result.totalPay, currency)}`, '',
      'Generated with Zalea Studio Overtime Calculator',
    ];
    try { await navigator.clipboard.writeText(lines.join('\n')); setCopyStatus('copied'); }
    catch { setCopyStatus('error'); }
  };

  return (
    <Card className="overflow-hidden border-border/60 shadow-lg">
      <CardHeader className="border-b border-border/60 bg-card">
        <CardTitle className="flex items-center gap-2 text-2xl"><BadgeDollarSign className="h-6 w-6 text-primary" aria-hidden="true" />Estimate overtime pay</CardTitle>
        <p className="mt-2 text-sm text-muted-foreground">Choose how you want to enter your hours. Decimal hours such as 42.5 are supported.</p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div role="tablist" aria-label="Overtime calculation mode" className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
          <ModeTab selected={mode === 'weekly'} controls="overtime-panel" onClick={() => { setMode('weekly'); setCopyStatus('idle'); }}>Weekly Hours</ModeTab>
          <ModeTab selected={mode === 'direct'} controls="overtime-panel" onClick={() => { setMode('direct'); setCopyStatus('idle'); }}>Enter Overtime Directly</ModeTab>
        </div>

        <div id="overtime-panel" role="tabpanel" className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
          <section aria-label="Overtime inputs">
            <div className="grid gap-5 sm:grid-cols-2">
              {mode === 'weekly' ? <>
                <NumberField id="total-hours" label="Total Hours Worked" value={totalHours} onChange={setTotalHours} step="0.01" suffix="hours" />
                <NumberField id="overtime-threshold" label="Overtime Starts After" value={threshold} onChange={setThreshold} step="0.01" suffix="hours" />
              </> : <>
                <NumberField id="regular-hours" label="Regular Hours" value={regularHours} onChange={setRegularHours} step="0.01" suffix="hours" />
                <NumberField id="overtime-hours" label="Overtime Hours" value={overtimeHours} onChange={setOvertimeHours} step="0.01" suffix="hours" />
              </>}
              <NumberField id="hourly-rate" label="Regular Hourly Rate" value={hourlyRate} onChange={setHourlyRate} step="0.01" />
              <div className="space-y-2"><Label htmlFor="overtime-currency">Currency</Label><select id="overtime-currency" value={currency} onChange={(event) => setCurrency(event.target.value as OvertimeCurrency)} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{overtimeCurrencies.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></div>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold">Overtime Multiplier</legend>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {['1', '1.5', '2'].map((value) => <button key={value} type="button" aria-pressed={multiplier === value} onClick={() => setMultiplier(value)} className={`min-h-11 rounded-lg border px-3 py-2 font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${multiplier === value ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:bg-accent'}`}>{Number(value).toFixed(1)}×</button>)}
              </div>
              <div className="mt-3"><NumberField id="custom-multiplier" label="Custom multiplier" value={multiplier} onChange={setMultiplier} step="0.01" suffix="×" max="100" /></div>
            </fieldset>

            {validation && <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{validation}</p>}
            <p className="mt-5 rounded-lg bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">Overtime rules, thresholds and pay multipliers vary by country, employer, employment agreement and worker classification. This calculator provides a general estimate only.</p>
          </section>

          <section className="rounded-2xl bg-blue-50/70 p-5" aria-labelledby="overtime-result" aria-live="polite">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p>
            <h2 id="overtime-result" className="mt-2 text-xl font-bold">Estimated Total Pay</h2>
            {result ? <>
              <p className="mt-4 break-words text-3xl font-bold tracking-tight text-primary sm:text-4xl">{formatOvertimeMoney(result.totalPay, currency)}</p>
              <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                <Result label="Regular Hours" value={formatHours(result.regularHours)} />
                <Result label="Overtime Hours" value={formatHours(result.overtimeHours)} />
                <Result label="Regular Rate" value={`${formatOvertimeMoney(result.regularRate, currency)}/hour`} />
                <Result label="Overtime Rate" value={`${formatOvertimeMoney(result.overtimeRate, currency)}/hour`} />
                <Result label="Regular Pay" value={formatOvertimeMoney(result.regularPay, currency)} />
                <Result label="Overtime Pay" value={formatOvertimeMoney(result.overtimePay, currency)} />
              </dl>
            </> : <p className="mt-4 text-muted-foreground">Correct the input to see a safe estimate.</p>}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button>
              <Button type="button" onClick={copyResult} disabled={!result}>{copyStatus === 'copied' ? <Check className="mr-2 h-4 w-4" aria-hidden="true" /> : <Clipboard className="mr-2 h-4 w-4" aria-hidden="true" />}{copyStatus === 'copied' ? 'Copied' : 'Copy Result'}</Button>
            </div>
            {copyStatus === 'error' && <p role="status" className="mt-3 text-sm text-destructive">Could not copy automatically. Please try again or copy the result manually.</p>}
          </section>
        </div>
      </CardContent>
    </Card>
  );
}

function ModeTab({ selected, controls, onClick, children }: { selected: boolean; controls: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={selected} aria-controls={controls} onClick={onClick} className={`min-h-12 rounded-lg px-2 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 ${selected ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{children}</button>;
}

function NumberField({ id, label, value, suffix, step, max = String(maximumValue), onChange }: { id: string; label: string; value: string; suffix?: string; step: string; max?: string; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><div className="relative"><Input id={id} type="number" inputMode="decimal" min="0" max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} className={`h-11 text-base ${suffix ? 'pr-16' : ''}`} />{suffix && <span className="pointer-events-none absolute right-3 top-3 text-sm text-muted-foreground">{suffix}</span>}</div></div>;
}

function Result({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-background p-4"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-lg font-bold">{value}</dd></div>;
}

function formatHours(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}
