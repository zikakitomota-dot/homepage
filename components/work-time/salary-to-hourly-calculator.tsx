'use client';

import { useMemo, useState } from 'react';
import { Banknote, Check, Clipboard, RotateCcw, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatOvertimeMoney, overtimeCurrencies, type OvertimeCurrency } from '@/lib/overtime';
import { convertHourlyToSalary, convertSalaryToHourly, type SalaryPeriod } from '@/lib/salary-converter';

type Mode = 'salary' | 'hourly';
const maximumPay = 1_000_000_000;

export function SalaryToHourlyCalculator() {
  const [mode, setMode] = useState<Mode>('salary');
  const [salary, setSalary] = useState('60000');
  const [salaryPeriod, setSalaryPeriod] = useState<SalaryPeriod>('annual');
  const [hourlyRate, setHourlyRate] = useState('25');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [weeksPerYear, setWeeksPerYear] = useState('52');
  const [currency, setCurrency] = useState<OvertimeCurrency>('USD');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');

  const validation = useMemo(() => {
    const payLabel = mode === 'salary' ? 'Salary' : 'Hourly rate';
    const payText = mode === 'salary' ? salary : hourlyRate;
    const pay = Number(payText);
    if (payText.trim() === '' || !Number.isFinite(pay) || pay <= 0 || pay > maximumPay) return `${payLabel} must be greater than zero and no more than ${maximumPay.toLocaleString()}.`;
    const scheduleFields = [
      { label: 'Hours per day', text: hoursPerDay, maximum: 24 },
      { label: 'Days per week', text: daysPerWeek, maximum: 7 },
      { label: 'Weeks per year', text: weeksPerYear, maximum: 52 },
    ];
    for (const field of scheduleFields) {
      const value = Number(field.text);
      if (field.text.trim() === '' || !Number.isFinite(value) || value <= 0 || value > field.maximum) return `${field.label} must be greater than zero and no more than ${field.maximum}.`;
    }
    return null;
  }, [daysPerWeek, hourlyRate, hoursPerDay, mode, salary, weeksPerYear]);

  const result = useMemo(() => {
    if (validation) return null;
    const schedule = { hoursPerDay: Number(hoursPerDay), daysPerWeek: Number(daysPerWeek), weeksPerYear: Number(weeksPerYear) };
    return mode === 'salary'
      ? convertSalaryToHourly(Number(salary), salaryPeriod, schedule)
      : convertHourlyToSalary(Number(hourlyRate), schedule);
  }, [daysPerWeek, hourlyRate, hoursPerDay, mode, salary, salaryPeriod, validation, weeksPerYear]);

  const useStandardSchedule = () => { setHoursPerDay('8'); setDaysPerWeek('5'); setWeeksPerYear('52'); setCopyStatus('idle'); };
  const reset = () => {
    setMode('salary'); setSalary('60000'); setSalaryPeriod('annual'); setHourlyRate('25');
    setHoursPerDay('8'); setDaysPerWeek('5'); setWeeksPerYear('52'); setCurrency('USD'); setCopyStatus('idle');
  };

  const copyResult = async () => {
    if (!result) return;
    const lines = [
      'Salary and Hourly Pay Conversion', '',
      `Annual: ${formatOvertimeMoney(result.annual, currency)}`,
      `Monthly: ${formatOvertimeMoney(result.monthly, currency)}`,
      `Weekly: ${formatOvertimeMoney(result.weekly, currency)}`,
      `Daily: ${formatOvertimeMoney(result.daily, currency)}`,
      `Hourly: ${formatOvertimeMoney(result.hourly, currency)}`, '',
      `Schedule: ${formatNumber(result.hoursPerWeek)} hours/week, ${formatNumber(result.hoursPerYear)} hours/year`,
      'Generated with Zalea Studio Salary to Hourly Calculator',
    ];
    try { await navigator.clipboard.writeText(lines.join('\n')); setCopyStatus('copied'); }
    catch { setCopyStatus('error'); }
  };

  return <Card className="overflow-hidden border-border/60 shadow-lg">
    <CardHeader className="border-b border-border/60 bg-card"><CardTitle className="flex items-center gap-2 text-2xl"><Banknote className="h-6 w-6 text-primary" aria-hidden="true" />Convert salary and hourly pay</CardTitle><p className="mt-2 text-sm text-muted-foreground">Use your actual work schedule for a more meaningful estimate. Decimal values are supported.</p></CardHeader>
    <CardContent className="p-4 sm:p-6">
      <div role="tablist" aria-label="Pay conversion direction" className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
        <ModeTab selected={mode === 'salary'} controls="salary-converter-panel" onClick={() => { setMode('salary'); setCopyStatus('idle'); }}>Salary → Hourly</ModeTab>
        <ModeTab selected={mode === 'hourly'} controls="salary-converter-panel" onClick={() => { setMode('hourly'); setCopyStatus('idle'); }}>Hourly → Salary</ModeTab>
      </div>
      <div id="salary-converter-panel" role="tabpanel" className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.05fr]">
        <section aria-label="Pay and schedule inputs">
          <div className="grid gap-5 sm:grid-cols-2">
            {mode === 'salary' ? <>
              <NumberField id="salary-amount" label="Salary" value={salary} onChange={setSalary} step="0.01" />
              <div className="space-y-2"><Label htmlFor="salary-period">Salary Period</Label><select id="salary-period" value={salaryPeriod} onChange={(event) => setSalaryPeriod(event.target.value as SalaryPeriod)} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><option value="annual">Annual</option><option value="monthly">Monthly</option><option value="weekly">Weekly</option></select></div>
            </> : <NumberField id="salary-hourly-rate" label="Hourly Rate" value={hourlyRate} onChange={setHourlyRate} step="0.01" />}
            <div className="space-y-2"><Label htmlFor="salary-currency">Currency</Label><select id="salary-currency" value={currency} onChange={(event) => setCurrency(event.target.value as OvertimeCurrency)} className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">{overtimeCurrencies.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}</select></div>
          </div>

          <fieldset className="mt-7 rounded-xl border border-border/60 p-4"><legend className="px-2 font-semibold">Work schedule</legend><div className="grid gap-5 sm:grid-cols-3"><NumberField id="salary-hours-day" label="Hours per Day" value={hoursPerDay} onChange={setHoursPerDay} step="0.25" max="24" /><NumberField id="salary-days-week" label="Days per Week" value={daysPerWeek} onChange={setDaysPerWeek} step="0.5" max="7" /><NumberField id="salary-weeks-year" label="Weeks per Year" value={weeksPerYear} onChange={setWeeksPerYear} step="0.5" max="52" /></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Reduce weeks per year if you take unpaid weeks away from work. Paid leave normally remains part of annual salary.</p><Button type="button" variant="outline" size="sm" className="mt-3" onClick={useStandardSchedule}><WandSparkles className="mr-2 h-4 w-4" aria-hidden="true" />Use standard 8 × 5 × 52 schedule</Button></fieldset>

          {mode === 'salary' && <div className="mt-5"><p className="text-sm font-semibold">Quick salary examples</p><div className="mt-2 flex flex-wrap gap-2">{['40000', '50000', '60000', '75000', '100000'].map((value) => <Button key={value} type="button" variant="outline" size="sm" onClick={() => { setSalary(value); setSalaryPeriod('annual'); setCopyStatus('idle'); }}>{formatOvertimeMoney(Number(value), currency)}</Button>)}</div></div>}
          {validation && <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm font-medium text-destructive">{validation}</p>}
          <p className="mt-5 rounded-lg bg-secondary/40 p-4 text-sm leading-relaxed text-muted-foreground">This calculator provides gross pay equivalents before tax, deductions, overtime, bonuses or benefits. It is an estimate, not payroll, tax or financial advice.</p>
        </section>

        <section className="rounded-2xl bg-blue-50/70 p-5" aria-labelledby="salary-result" aria-live="polite">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p><h2 id="salary-result" className="mt-2 text-xl font-bold">Pay equivalents</h2>
          {result ? <><p className="mt-4 break-words text-3xl font-bold tracking-tight text-primary sm:text-4xl">{mode === 'salary' ? `${formatOvertimeMoney(result.hourly, currency)}/hour` : `${formatOvertimeMoney(result.annual, currency)}/year`}</p><p className="mt-2 text-sm text-muted-foreground">Based on {formatNumber(result.hoursPerWeek)} hours per week and {formatNumber(result.hoursPerYear)} hours per year.</p><dl className="mt-6 grid gap-3 sm:grid-cols-2"><Result label="Annual" value={`${formatOvertimeMoney(result.annual, currency)}/year`} /><Result label="Monthly" value={`${formatOvertimeMoney(result.monthly, currency)}/month`} /><Result label="Weekly" value={`${formatOvertimeMoney(result.weekly, currency)}/week`} /><Result label="Daily" value={`${formatOvertimeMoney(result.daily, currency)}/day`} /><Result label="Hourly" value={`${formatOvertimeMoney(result.hourly, currency)}/hour`} /></dl></> : <p className="mt-4 text-muted-foreground">Correct the input to see a safe estimate.</p>}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button><Button type="button" onClick={copyResult} disabled={!result}>{copyStatus === 'copied' ? <Check className="mr-2 h-4 w-4" aria-hidden="true" /> : <Clipboard className="mr-2 h-4 w-4" aria-hidden="true" />}{copyStatus === 'copied' ? 'Copied' : 'Copy Result'}</Button></div>
          {copyStatus === 'error' && <p role="status" className="mt-3 text-sm text-destructive">Could not copy automatically. Please try again or copy the result manually.</p>}
        </section>
      </div>
    </CardContent>
  </Card>;
}

function ModeTab({ selected, controls, onClick, children }: { selected: boolean; controls: string; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" role="tab" aria-selected={selected} aria-controls={controls} onClick={onClick} className={`min-h-12 rounded-lg px-2 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4 ${selected ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>{children}</button>;
}

function NumberField({ id, label, value, step, max = String(maximumPay), onChange }: { id: string; label: string; value: string; step: string; max?: string; onChange: (value: string) => void }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type="number" inputMode="decimal" min="0" max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} className="h-11 text-base" /></div>;
}

function Result({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-background p-4"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="mt-1 break-words text-lg font-bold">{value}</dd></div>;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value);
}
