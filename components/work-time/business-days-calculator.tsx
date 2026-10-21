'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Check, Clipboard, Globe2, Loader2, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  addCalendarDays,
  countBusinessDays,
  formatCalendarDate,
  formatShortCalendarDate,
  localTodayKey,
  mondayToFriday,
  parseDateKey,
  shiftBusinessDays,
  sundayToThursday,
  type ExcludedDate,
} from '@/lib/work-time';

type Mode = 'count' | 'shift' | 'today';
type Direction = 'add' | 'subtract';
type WeekPreset = 'monday-friday' | 'sunday-thursday' | 'custom';
type ExclusionRow = ExcludedDate & { id: number };
type CountryOption = { code: string; name: string };
type RegionOption = { code: string; name: string };
type PublicHoliday = ExcludedDate & { name: string; substitute: boolean };

const modeOptions: { value: Mode; label: string; shortLabel: string }[] = [
  { value: 'count', label: 'Count Business Days', shortLabel: 'Count days' },
  { value: 'shift', label: 'Add / Subtract Business Days', shortLabel: 'Add / subtract' },
  { value: 'today', label: 'Business Days From Today', shortLabel: 'From today' },
];
const weekdays = [
  { value: 1, short: 'Mon', full: 'Monday' },
  { value: 2, short: 'Tue', full: 'Tuesday' },
  { value: 3, short: 'Wed', full: 'Wednesday' },
  { value: 4, short: 'Thu', full: 'Thursday' },
  { value: 5, short: 'Fri', full: 'Friday' },
  { value: 6, short: 'Sat', full: 'Saturday' },
  { value: 0, short: 'Sun', full: 'Sunday' },
];
const quickDays = [5, 10, 15, 20, 30, 60];
const maximumBusinessDays = 100_000;

function validWholeDays(value: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= maximumBusinessDays ? parsed : null;
}

export function BusinessDaysCalculator() {
  const [mode, setMode] = useState<Mode>('count');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [includeStart, setIncludeStart] = useState(true);
  const [includeEnd, setIncludeEnd] = useState(true);
  const [shiftDate, setShiftDate] = useState('');
  const [shiftAmount, setShiftAmount] = useState('10');
  const [shiftDirection, setShiftDirection] = useState<Direction>('add');
  const [todayAmount, setTodayAmount] = useState('10');
  const [todayDirection, setTodayDirection] = useState<Direction>('add');
  const [today, setToday] = useState('');
  const [weekPreset, setWeekPreset] = useState<WeekPreset>('monday-friday');
  const [customDays, setCustomDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [exclusions, setExclusions] = useState<ExclusionRow[]>([]);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countrySearch, setCountrySearch] = useState('');
  const [country, setCountry] = useState('');
  const [regions, setRegions] = useState<RegionOption[]>([]);
  const [region, setRegion] = useState('');
  const [automaticHolidays, setAutomaticHolidays] = useState(false);
  const [publicHolidays, setPublicHolidays] = useState<PublicHoliday[]>([]);
  const [holidayStatus, setHolidayStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [holidayError, setHolidayError] = useState('');
  const [holidayWarning, setHolidayWarning] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const nextExclusionId = useRef(1);

  useEffect(() => {
    const current = localTodayKey();
    setToday(current);
    setStartDate(current);
    setEndDate(addCalendarDays(current, 30) ?? current);
    setShiftDate(current);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/public-holidays?action=countries', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setCountries(data.countries ?? []))
      .catch((error) => { if (error?.name !== 'AbortError') setHolidayError('Country list could not be loaded.'); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    setRegion('');
    setRegions([]);
    setPublicHolidays([]);
    if (!country) { setAutomaticHolidays(false); setHolidayStatus('idle'); return; }
    setAutomaticHolidays(true);
    const controller = new AbortController();
    fetch(`/api/public-holidays?action=regions&country=${country}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then((data) => setRegions(data.regions ?? []))
      .catch(() => setRegions([]));
    return () => controller.abort();
  }, [country]);

  const workingDays = useMemo(() => {
    if (weekPreset === 'monday-friday') return mondayToFriday;
    if (weekPreset === 'sunday-thursday') return sundayToThursday;
    return new Set(customDays);
  }, [customDays, weekPreset]);

  const validExclusions = useMemo(() => exclusions.filter((item) => parseDateKey(item.date)), [exclusions]);
  const duplicateDates = useMemo(() => {
    const seen = new Set<string>();
    return validExclusions.some((item) => seen.has(item.date) || !seen.add(item.date));
  }, [validExclusions]);
  const activeShiftDate = mode === 'today' ? today : shiftDate;
  const activeAmountText = mode === 'today' ? todayAmount : shiftAmount;
  const activeDirection = mode === 'today' ? todayDirection : shiftDirection;
  const activeAmount = validWholeDays(activeAmountText);
  const holidayYears = useMemo(() => {
    const first = mode === 'count' ? startDate : activeShiftDate;
    if (!parseDateKey(first)) return null;
    let last = endDate;
    if (mode !== 'count') {
      const workingPerWeek = Math.max(workingDays.size, 1);
      const baseDistance = Math.ceil(((activeAmount ?? 0) / workingPerWeek) * 7);
      const estimatedYears = Math.ceil(baseDistance / 365);
      const calendarDistance = baseDistance + estimatedYears * 40 + 370;
      last = addCalendarDays(first, (activeDirection === 'add' ? 1 : -1) * calendarDistance) ?? first;
    }
    if (!parseDateKey(last)) return null;
    const startYear = Number((first < last ? first : last).slice(0, 4));
    const endYear = Number((first > last ? first : last).slice(0, 4));
    return { startYear, endYear, tooLarge: endYear - startYear + 1 > 100 };
  }, [activeAmount, activeDirection, activeShiftDate, endDate, mode, startDate, workingDays.size]);

  useEffect(() => {
    setPublicHolidays([]);
    setHolidayError('');
    setHolidayWarning('');
    if (!country || !automaticHolidays || !holidayYears) { setHolidayStatus('idle'); return; }
    if (holidayYears.tooLarge) { setHolidayStatus('error'); setHolidayError('Automatic holiday lookup supports ranges up to 100 years. Reduce the range or turn it off.'); return; }
    const controller = new AbortController();
    setHolidayStatus('loading');
    const params = new URLSearchParams({ action: 'holidays', country, startYear: String(holidayYears.startYear), endYear: String(holidayYears.endYear) });
    if (region) params.set('region', region);
    fetch(`/api/public-holidays?${params}`, { signal: controller.signal })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); return data; })
      .then((data) => { setPublicHolidays(data.holidays ?? []); setHolidayWarning(data.warning ?? ''); setHolidayStatus('ready'); })
      .catch((error) => { if (error?.name !== 'AbortError') { setHolidayStatus('error'); setHolidayError(error?.message || 'Public holidays could not be loaded.'); } });
    return () => controller.abort();
  }, [automaticHolidays, country, holidayYears, region]);

  const officialExclusions = useMemo(() => automaticHolidays ? publicHolidays.map(({ date, name }) => ({ date, label: name })) : [], [automaticHolidays, publicHolidays]);
  const allExclusions = useMemo(() => [...validExclusions, ...officialExclusions], [officialExclusions, validExclusions]);
  const options = useMemo(() => ({ workingDays, excludedDates: allExclusions }), [allExclusions, workingDays]);

  const countError = useMemo(() => {
    if (!startDate || !endDate) return '';
    if (!parseDateKey(startDate) || !parseDateKey(endDate)) return 'Enter valid start and end dates.';
    if (startDate > endDate) return 'The start date must be on or before the end date.';
    return '';
  }, [endDate, startDate]);
  const weekError = workingDays.size === 0 ? 'Select at least one working day.' : '';
  const holidaysPending = automaticHolidays && (holidayStatus === 'loading' || holidayStatus === 'error');
  const countResult = !countError && !weekError && !holidaysPending && startDate && endDate
    ? countBusinessDays(startDate, endDate, { ...options, includeStart, includeEnd })
    : null;

  const shiftError = activeAmountText !== '' && activeAmount === null
    ? `Enter a whole number from 0 to ${maximumBusinessDays.toLocaleString()}.`
    : '';
  const shiftedDate = !weekError && !shiftError && !holidaysPending && activeShiftDate && activeAmount !== null
    ? shiftBusinessDays(activeShiftDate, activeDirection === 'add' ? activeAmount : -activeAmount, options)
    : null;

  const filteredCountries = countries.filter((item) => item.code === country || `${item.name} ${item.code}`.toLowerCase().includes(countrySearch.trim().toLowerCase()));
  const selectedCountry = countries.find((item) => item.code === country);
  const selectedRegion = regions.find((item) => item.code === region);
  const previewStart = mode === 'count'
    ? (includeStart ? startDate : addCalendarDays(startDate, 1) ?? startDate)
    : activeAmount === 0 ? '' : activeDirection === 'add' ? addCalendarDays(activeShiftDate, 1) ?? activeShiftDate : shiftedDate ?? activeShiftDate;
  const previewEnd = mode === 'count'
    ? (includeEnd ? endDate : addCalendarDays(endDate, -1) ?? endDate)
    : activeAmount === 0 ? '' : activeDirection === 'add' ? shiftedDate ?? activeShiftDate : addCalendarDays(activeShiftDate, -1) ?? activeShiftDate;
  const previewHolidays = publicHolidays.filter((holiday) => holiday.date >= previewStart && holiday.date <= previewEnd);
  const officialDateSet = new Set(publicHolidays.map((holiday) => holiday.date));
  const manualAdditionalCount = new Set(validExclusions.filter((item) => !officialDateSet.has(item.date) && item.date >= previewStart && item.date <= previewEnd && workingDays.has(new Date(`${item.date}T12:00:00Z`).getUTCDay())).map((item) => item.date)).size;
  const officialCount = new Set(previewHolidays.filter((item) => workingDays.has(new Date(`${item.date}T12:00:00Z`).getUTCDay())).map((item) => item.date)).size;
  const workingWeekLabel = weekPreset === 'monday-friday' ? 'Monday–Friday' : weekPreset === 'sunday-thursday' ? 'Sunday–Thursday' : weekdays.filter((day) => customDays.includes(day.value)).map((day) => day.short).join(', ');

  const addExclusion = () => {
    if (exclusions.length >= 25) return;
    setExclusions((current) => [...current, { id: nextExclusionId.current++, date: '', label: '' }]);
  };
  const updateExclusion = (id: number, field: 'date' | 'label', value: string) => {
    setExclusions((current) => current.map((item) => item.id === id ? { ...item, [field]: value } : item));
  };
  const removeExclusion = (id: number) => setExclusions((current) => current.filter((item) => item.id !== id));
  const toggleCustomDay = (day: number) => setCustomDays((current) => current.includes(day) ? current.filter((value) => value !== day) : [...current, day]);
  const changeCountry = (value: string) => {
    setPublicHolidays([]);
    setRegion('');
    setRegions([]);
    setHolidayError('');
    setHolidayWarning('');
    setHolidayStatus(value ? 'loading' : 'idle');
    setAutomaticHolidays(Boolean(value));
    setCountry(value);
  };
  const changeRegion = (value: string) => {
    setPublicHolidays([]);
    setHolidayError('');
    setHolidayWarning('');
    setHolidayStatus(automaticHolidays ? 'loading' : 'idle');
    setRegion(value);
  };

  const reset = () => {
    const current = localTodayKey();
    setMode('count');
    setStartDate(current);
    setEndDate(addCalendarDays(current, 30) ?? current);
    setIncludeStart(true);
    setIncludeEnd(true);
    setShiftDate(current);
    setShiftAmount('10');
    setShiftDirection('add');
    setToday(current);
    setTodayAmount('10');
    setTodayDirection('add');
    setWeekPreset('monday-friday');
    setCustomDays([1, 2, 3, 4, 5]);
    setExclusions([]);
    setCountrySearch('');
    setCountry('');
    setRegion('');
    setAutomaticHolidays(false);
    setPublicHolidays([]);
    setHolidayStatus('idle');
    setHolidayError('');
    setHolidayWarning('');
    setCopyStatus('idle');
  };

  const resultText = () => {
    if (mode === 'count' && countResult) {
      return [
        'Business Days Calculation', '',
        `Start: ${formatShortCalendarDate(startDate)}`,
        `End: ${formatShortCalendarDate(endDate)}`, '',
        `Business days: ${countResult.businessDays}`,
        `Calendar days: ${countResult.calendarDays}`,
        `Non-working days: ${countResult.nonWorkingDays}`,
        `Official public holidays excluded: ${officialCount}`,
        `Manual exclusions: ${manualAdditionalCount}`,
        `Working week: ${workingWeekLabel}`,
        selectedCountry ? `Holiday calendar: ${selectedCountry.name}${selectedRegion ? ` — ${selectedRegion.name}` : ''}` : 'Holiday calendar: None',
        '', 'Generated with Zalea Studio Business Days Calculator',
      ].join('\n');
    }
    if (shiftedDate && activeAmount !== null) {
      const action = activeDirection === 'add' ? 'from' : 'before';
      return [
        'Business Days Calculation', '',
        `Result: ${formatCalendarDate(shiftedDate)}`,
        `${activeAmount} business ${activeAmount === 1 ? 'day' : 'days'} ${action} ${formatShortCalendarDate(activeShiftDate)}`,
        `Working week: ${workingWeekLabel}`,
        `Official public holidays skipped: ${officialCount}`,
        `Manual exclusions skipped: ${manualAdditionalCount}`,
        selectedCountry ? `Holiday calendar: ${selectedCountry.name}${selectedRegion ? ` — ${selectedRegion.name}` : ''}` : 'Holiday calendar: None',
        '', 'Generated with Zalea Studio Business Days Calculator',
      ].join('\n');
    }
    return '';
  };

  const copyResult = async () => {
    const text = resultText();
    if (!text) return;
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
        <CardTitle className="flex items-center gap-2 text-2xl"><CalendarDays className="h-6 w-6 text-primary" aria-hidden="true" />Business-day calculation</CardTitle>
        <p className="text-sm leading-relaxed text-muted-foreground">Choose a mode, set your working week, and add any holidays or dates that should be skipped.</p>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div role="tablist" aria-label="Calculation mode" className="grid gap-2 rounded-xl bg-secondary/60 p-1 sm:grid-cols-3">
          {modeOptions.map((option) => <button key={option.value} type="button" role="tab" aria-selected={mode === option.value} aria-controls={`${option.value}-panel`} id={`${option.value}-tab`} onClick={() => { setMode(option.value); setCopyStatus('idle'); }} className={`min-h-11 rounded-lg px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${mode === option.value ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-background hover:text-foreground'}`}><span className="sm:hidden">{option.shortLabel}</span><span className="hidden sm:inline">{option.label}</span></button>)}
        </div>

        <div className="mt-6">
          {mode === 'count' && <section role="tabpanel" id="count-panel" aria-labelledby="count-tab" className="rounded-2xl border border-border/60 p-4 sm:p-5">
            <h2 className="text-xl font-bold">Count business days between two dates</h2>
            <p className="mt-2 text-sm text-muted-foreground">Enter a start date and end date to count the working days in the range. With the default Monday–Friday week, Saturdays and Sundays are excluded automatically.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <DateField id="business-start" label="Start Date" value={startDate} onChange={setStartDate} />
              <DateField id="business-end" label="End Date" value={endDate} onChange={setEndDate} />
            </div>
            <fieldset className="mt-5"><legend className="text-sm font-semibold">Include dates in the count</legend><div className="mt-3 flex flex-wrap gap-3"><CheckOption id="include-start" label="Include start date" checked={includeStart} onChange={setIncludeStart} /><CheckOption id="include-end" label="Include end date" checked={includeEnd} onChange={setIncludeEnd} /></div><p className="mt-2 text-xs text-muted-foreground">Both dates are included by default when they are working days. Turn either option off to exclude that boundary from the range.</p></fieldset>
            {countError && <p role="alert" className="mt-4 text-sm font-medium text-destructive">{countError}</p>}
          </section>}

          {mode === 'shift' && <section role="tabpanel" id="shift-panel" aria-labelledby="shift-tab" className="rounded-2xl border border-border/60 p-4 sm:p-5">
            <h2 className="text-xl font-bold">Add or Subtract Business Days</h2>
            <p className="mt-2 text-sm text-muted-foreground">The starting date is not counted unless you enter zero days.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr]">
              <DateField id="shift-start" label="Starting Date" value={shiftDate} onChange={setShiftDate} />
              <DirectionField value={shiftDirection} onChange={setShiftDirection} />
              <NumberOfDaysField id="shift-days" value={shiftAmount} onChange={setShiftAmount} error={shiftError} />
            </div>
          </section>}

          {mode === 'today' && <section role="tabpanel" id="today-panel" aria-labelledby="today-tab" className="rounded-2xl border border-border/60 p-4 sm:p-5">
            <h2 className="text-xl font-bold">Business Days From Today</h2>
            <p className="mt-2 text-sm text-muted-foreground">Today is set from your device: <strong className="text-foreground">{today ? formatCalendarDate(today) : 'Loading…'}</strong></p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <DirectionField value={todayDirection} onChange={setTodayDirection} />
              <NumberOfDaysField id="today-days" value={todayAmount} onChange={setTodayAmount} error={shiftError} />
            </div>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Quick number of business days">{quickDays.map((days) => <Button key={days} type="button" size="sm" variant={todayAmount === String(days) ? 'default' : 'outline'} onClick={() => setTodayAmount(String(days))}>{days} days</Button>)}</div>
          </section>}
        </div>

        <section className="mt-6 rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 sm:p-5" aria-labelledby="holiday-calendar-heading">
          <div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><Globe2 className="h-5 w-5" aria-hidden="true" /></span><div><h2 id="holiday-calendar-heading" className="text-xl font-bold">Location &amp; Public Holidays</h2><p className="mt-1 text-sm text-muted-foreground">Choose a country to automatically skip official public holidays and observed or substitute days. Dates are calculated locally—no holiday API is contacted.</p></div></div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
            <div className="space-y-2"><Label htmlFor="country-search">Search countries</Label><Input id="country-search" type="search" value={countrySearch} onChange={(event) => setCountrySearch(event.target.value)} placeholder="Type a country name" className="h-11 text-base" /><Label htmlFor="holiday-country" className="sr-only">Country</Label><select id="holiday-country" value={country} onChange={(event) => changeCountry(event.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="">Select a country</option>{filteredCountries.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select></div>
            <div className="space-y-2"><Label htmlFor="holiday-region">State or region</Label><select id="holiday-region" value={region} onChange={(event) => changeRegion(event.target.value)} disabled={!country || regions.length === 0} className="h-11 w-full rounded-md border border-input bg-background px-3 text-base disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="">{regions.length ? 'National holidays only' : country ? 'No regional calendar available' : 'Select a country first'}</option>{regions.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}</select><p className="text-xs text-muted-foreground">Select a region when local public holidays should also count.</p></div>
            <CheckOption id="automatic-holidays" label="Automatically Exclude Public Holidays" checked={automaticHolidays} onChange={setAutomaticHolidays} disabled={!country} />
          </div>
          {holidayStatus === 'loading' && <p role="status" className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />Loading public holidays…</p>}
          {holidayError && <p role="alert" className="mt-4 text-sm font-medium text-destructive">{holidayError}</p>}
          {holidayWarning && holidayStatus === 'ready' && <p role="status" className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">{holidayWarning}</p>}
          {automaticHolidays && holidayStatus === 'ready' && <details open className="mt-5 rounded-xl border border-border/60 bg-background p-4"><summary className="cursor-pointer font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Public Holidays Applied · {officialCount} excluded</summary><p className="mt-2 text-xs font-medium text-muted-foreground">{selectedCountry?.name}{selectedRegion ? ` · ${selectedRegion.name}` : ' · Nationwide calendar; regional holidays are not included'}</p>{previewHolidays.length ? <ul className="mt-3 grid gap-2 sm:grid-cols-2">{previewHolidays.slice(0, 12).map((holiday, index) => { const excluded = workingDays.has(new Date(`${holiday.date}T12:00:00Z`).getUTCDay()); return <li key={`${holiday.date}-${holiday.name}-${index}`} className="rounded-lg bg-secondary/50 px-3 py-2 text-sm"><span className="font-medium">{formatShortCalendarDate(holiday.date)}</span><span className="block text-muted-foreground">{holiday.name}{holiday.substitute ? ' · Substitute day' : ''}</span><span className={excluded ? 'text-emerald-700' : 'text-muted-foreground'}>{excluded ? 'Excluded from business days' : 'Already a non-working day'}</span></li>; })}</ul> : <p className="mt-3 text-sm text-muted-foreground">No public holidays fall within the current calculation range.</p>}{previewHolidays.length > 12 && <p className="mt-3 text-xs text-muted-foreground">Showing 12 of {previewHolidays.length} holidays in this range.</p>}</details>}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-border/60 p-4 sm:p-5" aria-labelledby="working-week-heading">
            <h2 id="working-week-heading" className="text-xl font-bold">Working Week</h2>
            <fieldset className="mt-4"><legend className="sr-only">Choose a working week</legend><div className="grid gap-2 sm:grid-cols-3">{[
              ['monday-friday', 'Monday – Friday'], ['sunday-thursday', 'Sunday – Thursday'], ['custom', 'Custom'],
            ].map(([value, label]) => <button key={value} type="button" aria-pressed={weekPreset === value} onClick={() => setWeekPreset(value as WeekPreset)} className={`min-h-11 rounded-lg border px-3 py-2 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${weekPreset === value ? 'border-primary bg-primary/10 text-primary' : 'border-border bg-background hover:bg-accent'}`}>{label}</button>)}</div></fieldset>
            {weekPreset === 'custom' && <fieldset className="mt-5"><legend className="text-sm font-semibold">Select working days</legend><div className="mt-3 flex flex-wrap gap-2">{weekdays.map((day) => <button key={day.value} type="button" aria-pressed={customDays.includes(day.value)} aria-label={`${day.full} is ${customDays.includes(day.value) ? 'a working day' : 'not a working day'}`} onClick={() => toggleCustomDay(day.value)} className={`min-h-11 min-w-12 rounded-lg border px-3 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${customDays.includes(day.value) ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}`}>{day.short}</button>)}</div></fieldset>}
            {weekError && <p role="alert" className="mt-3 text-sm font-medium text-destructive">{weekError}</p>}
          </section>

          <section className="rounded-2xl border border-border/60 p-4 sm:p-5" aria-labelledby="excluded-heading">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start"><div><h2 id="excluded-heading" className="text-xl font-bold">Additional Excluded Dates <span className="text-sm font-normal text-muted-foreground">(Optional)</span></h2><p className="mt-2 text-sm text-muted-foreground">Add company shutdowns, special office closures, personal non-working dates or any extra date to skip. Overlaps are counted only once.</p></div><Button type="button" variant="outline" size="sm" onClick={addExclusion} disabled={exclusions.length >= 25}><Plus className="mr-2 h-4 w-4" aria-hidden="true" />Add excluded date</Button></div>
            <div className="mt-4 space-y-3">{exclusions.length === 0 ? <p className="rounded-lg bg-secondary/50 p-3 text-sm text-muted-foreground">No excluded dates added.</p> : exclusions.map((item, index) => <div key={item.id} className="grid gap-3 rounded-xl bg-secondary/40 p-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end"><DateField id={`excluded-date-${item.id}`} label={`Excluded date ${index + 1}`} value={item.date} onChange={(value) => updateExclusion(item.id, 'date', value)} /><div className="space-y-2"><Label htmlFor={`excluded-label-${item.id}`}>Label <span className="font-normal text-muted-foreground">(optional)</span></Label><Input id={`excluded-label-${item.id}`} value={item.label ?? ''} maxLength={80} onChange={(event) => updateExclusion(item.id, 'label', event.target.value)} placeholder="e.g. National Day" className="h-11 text-base" /></div><Button type="button" variant="ghost" size="icon" onClick={() => removeExclusion(item.id)} aria-label={`Remove excluded date ${index + 1}`}><Trash2 className="h-5 w-5" aria-hidden="true" /></Button></div>)}</div>
            {duplicateDates && <p role="status" className="mt-3 text-sm text-amber-700">Duplicate dates are counted only once.</p>}
          </section>
        </div>

        <section className="mt-6 rounded-2xl bg-blue-50/70 p-5" aria-labelledby="business-result-heading" aria-live="polite">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Result</p>
          <div id="business-result-heading" className="mt-2">
            {weekError ? <p className="text-lg font-semibold text-destructive">Choose at least one working day to calculate a result.</p> : holidaysPending ? <p className="text-lg font-semibold text-muted-foreground">{holidayStatus === 'loading' ? 'Loading the selected holiday calendar…' : 'Resolve the holiday calendar message above to calculate.'}</p> : mode === 'count' ? <CountResult result={countResult} startDate={startDate} endDate={endDate} officialCount={officialCount} manualCount={manualAdditionalCount} /> : <ShiftResult date={shiftedDate} amount={activeAmount} direction={activeDirection} startDate={activeShiftDate} fromToday={mode === 'today'} officialCount={officialCount} manualCount={manualAdditionalCount} />}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">Working week: <strong className="text-foreground">{workingWeekLabel}</strong> · Automatic holidays: <strong className="text-foreground">{automaticHolidays && selectedCountry ? `${selectedCountry.name}${selectedRegion ? ` (${selectedRegion.name})` : ''}` : 'Off'}</strong></p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row"><Button type="button" variant="outline" onClick={reset}><RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />Reset</Button><Button type="button" onClick={copyResult} disabled={!resultText()}>{copyStatus === 'copied' ? <Check className="mr-2 h-4 w-4" aria-hidden="true" /> : <Clipboard className="mr-2 h-4 w-4" aria-hidden="true" />}{copyStatus === 'copied' ? 'Copied' : 'Copy Result'}</Button></div>
          {copyStatus === 'error' && <p role="status" className="mt-3 text-sm text-destructive">Could not copy automatically. Please try again or copy the result manually.</p>}
        </section>
      </CardContent>
    </Card>
  );
}

function DateField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  return <div className="min-w-0 space-y-2"><Label htmlFor={id}>{label}</Label><Input id={id} type="date" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 min-w-0 w-full text-base" /></div>;
}

function CheckOption({ id, label, checked, onChange, disabled = false }: { id: string; label: string; checked: boolean; onChange: (checked: boolean) => void; disabled?: boolean }) {
  return <label htmlFor={id} className={`flex min-h-11 items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}><input id={id} type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-primary" />{label}</label>;
}

function DirectionField({ value, onChange }: { value: Direction; onChange: (value: Direction) => void }) {
  return <fieldset><legend className="mb-2 text-sm font-semibold">Action</legend><div className="inline-flex h-11 rounded-lg border border-border bg-background p-1">{(['add', 'subtract'] as const).map((option) => <button key={option} type="button" aria-pressed={value === option} onClick={() => onChange(option)} className={`rounded-md px-4 text-sm font-semibold capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${value === option ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent'}`}>{option}</button>)}</div></fieldset>;
}

function NumberOfDaysField({ id, value, error, onChange }: { id: string; value: string; error: string; onChange: (value: string) => void }) {
  const errorId = `${id}-error`;
  return <div className="space-y-2"><Label htmlFor={id}>Number of Business Days</Label><Input id={id} type="number" inputMode="numeric" min="0" max={maximumBusinessDays} step="1" value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="h-11 text-base" />{error && <p id={errorId} role="alert" className="text-sm text-destructive">{error}</p>}</div>;
}

function CountResult({ result, startDate, endDate, officialCount, manualCount }: { result: ReturnType<typeof countBusinessDays>; startDate: string; endDate: string; officialCount: number; manualCount: number }) {
  if (!result) return <p className="text-lg font-semibold text-muted-foreground">Enter a valid date range to see the result.</p>;
  return <><h2 className="text-lg font-semibold text-foreground">Business Days</h2><p className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{result.businessDays} working {result.businessDays === 1 ? 'day' : 'days'}</p><p className="mt-2 text-muted-foreground">{formatShortCalendarDate(startDate)} to {formatShortCalendarDate(endDate)}</p><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"><ResultItem label="Calendar days" value={result.calendarDays} /><ResultItem label="Business days" value={result.businessDays} /><ResultItem label="Non-working days" value={result.nonWorkingDays} /><ResultItem label="Public holidays" value={officialCount} /><ResultItem label="Manual exclusions" value={manualCount} /></div></>;
}

function ShiftResult({ date, amount, direction, startDate, fromToday, officialCount, manualCount }: { date: string | null; amount: number | null; direction: Direction; startDate: string; fromToday: boolean; officialCount: number; manualCount: number }) {
  if (!date || amount === null) return <p className="text-lg font-semibold text-muted-foreground">Enter a valid number of business days to see the result.</p>;
  const relation = direction === 'add' ? 'from' : 'before';
  return <><h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{formatCalendarDate(date)}</h2><p className="mt-3 text-lg text-muted-foreground"><strong className="text-foreground">{amount} business {amount === 1 ? 'day' : 'days'}</strong> {relation} {fromToday ? 'today' : formatShortCalendarDate(startDate)}</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><ResultItem label="Public holidays skipped" value={officialCount} /><ResultItem label="Manual exclusions skipped" value={manualCount} /></div></>;
}

function ResultItem({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl bg-background p-4"><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>;
}
