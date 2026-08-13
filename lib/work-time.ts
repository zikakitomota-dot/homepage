export const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const workTimeTools = [
  {
    slug: 'work-hours-calculator',
    title: 'Work Hours Calculator',
    description: 'Calculate daily and weekly hours, subtract unpaid breaks, track overtime and estimate pay.',
    icon: 'clock',
  },
  {
    slug: 'business-days-calculator',
    title: 'Business Days Calculator',
    description: 'Count working days between dates or add and subtract business days from any date.',
    icon: 'calendar',
  },
  {
    slug: 'time-duration-calculator',
    title: 'Time Duration Calculator',
    description: 'Calculate the time between two times, add or subtract time, and convert durations into decimal hours.',
    icon: 'timer',
  },
  {
    slug: 'overtime-calculator',
    title: 'Overtime Calculator',
    description: 'Calculate overtime hours and estimate overtime pay using your hourly rate and overtime multiplier.',
    icon: 'overtime',
  },
] as const;

export type WorkDay = (typeof workDays)[number];
export type WorkEntry = { start: string; end: string; breakMinutes: string };
export type WorkDayResult = { elapsedMinutes: number; workedMinutes: number; error?: string };

export const emptyWorkEntries = (): Record<WorkDay, WorkEntry> => Object.fromEntries(
  workDays.map((day) => [day, { start: '', end: '', breakMinutes: '' }]),
) as Record<WorkDay, WorkEntry>;

function parseTime(value: string) {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  return hours <= 23 && minutes <= 59 ? hours * 60 + minutes : null;
}

export function calculateWorkDay(entry: WorkEntry): WorkDayResult | null {
  const hasStart = entry.start.trim() !== '';
  const hasEnd = entry.end.trim() !== '';
  if (!hasStart && !hasEnd) return null;
  if (!hasStart || !hasEnd) return { elapsedMinutes: 0, workedMinutes: 0, error: 'Enter both a start and end time.' };

  const start = parseTime(entry.start);
  const end = parseTime(entry.end);
  if (start === null || end === null) return { elapsedMinutes: 0, workedMinutes: 0, error: 'Enter valid start and end times.' };
  if (start === end) return { elapsedMinutes: 0, workedMinutes: 0, error: 'Start and end time cannot be the same.' };

  const breakValue = entry.breakMinutes.trim() === '' ? 0 : Number(entry.breakMinutes);
  if (!Number.isFinite(breakValue) || breakValue < 0) return { elapsedMinutes: 0, workedMinutes: 0, error: 'Break must be zero or more minutes.' };

  const elapsedMinutes = end > start ? end - start : 24 * 60 - start + end;
  if (breakValue > elapsedMinutes) return { elapsedMinutes, workedMinutes: 0, error: 'Break cannot be longer than the shift.' };

  return { elapsedMinutes, workedMinutes: Math.round(elapsedMinutes - breakValue) };
}

export function splitWeeklyMinutes(totalMinutes: number, overtimeThresholdHours: number) {
  const thresholdMinutes = Math.max(0, overtimeThresholdHours) * 60;
  const regularMinutes = Math.min(totalMinutes, thresholdMinutes);
  return { regularMinutes, overtimeMinutes: Math.max(0, totalMinutes - regularMinutes) };
}

export function formatDuration(totalMinutes: number) {
  const safeMinutes = Math.max(0, Math.round(totalMinutes));
  const hours = Math.floor(safeMinutes / 60);
  const minutes = safeMinutes % 60;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}

export function decimalHours(totalMinutes: number) {
  return (Math.max(0, totalMinutes) / 60).toFixed(2);
}

export type DateKey = `${number}-${number}-${number}`;
export type CalendarDate = { year: number; month: number; day: number };
export type ExcludedDate = { date: string; label?: string };
export type BusinessDayOptions = {
  workingDays: ReadonlySet<number>;
  excludedDates?: readonly ExcludedDate[];
};
export type BusinessDayCount = {
  calendarDays: number;
  businessDays: number;
  nonWorkingDays: number;
  excludedDays: number;
};

const dateKeyPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const millisecondsPerDay = 86_400_000;

export const mondayToFriday = new Set([1, 2, 3, 4, 5]);
export const sundayToThursday = new Set([0, 1, 2, 3, 4]);

export function parseDateKey(value: string): CalendarDate | null {
  const match = dateKeyPattern.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));
  if (probe.getUTCFullYear() !== year || probe.getUTCMonth() !== month - 1 || probe.getUTCDate() !== day) return null;
  return { year, month, day };
}

function dateSerial(date: CalendarDate) {
  return Math.floor(Date.UTC(date.year, date.month - 1, date.day) / millisecondsPerDay);
}

function dateFromSerial(serial: number): CalendarDate {
  const date = new Date(serial * millisecondsPerDay);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function toDateKey(date: CalendarDate): DateKey {
  return `${date.year.toString().padStart(4, '0')}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}` as DateKey;
}

export function localTodayKey(date = new Date()): DateKey {
  return toDateKey({ year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() });
}

export function addCalendarDays(value: string, amount: number): DateKey | null {
  const date = parseDateKey(value);
  if (!date || !Number.isInteger(amount)) return null;
  return toDateKey(dateFromSerial(dateSerial(date) + amount));
}

export function weekdayForDate(value: string) {
  const date = parseDateKey(value);
  if (!date) return null;
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

function excludedDateSet(excludedDates: readonly ExcludedDate[] = []) {
  return new Set(excludedDates.map((item) => item.date).filter((date) => parseDateKey(date)));
}

export function isBusinessDay(value: string, options: BusinessDayOptions) {
  const weekday = weekdayForDate(value);
  if (weekday === null || !options.workingDays.has(weekday)) return false;
  return !excludedDateSet(options.excludedDates).has(value);
}

export function countBusinessDays(
  startValue: string,
  endValue: string,
  options: BusinessDayOptions & { includeStart?: boolean; includeEnd?: boolean },
): BusinessDayCount | null {
  const start = parseDateKey(startValue);
  const end = parseDateKey(endValue);
  if (!start || !end || options.workingDays.size === 0) return null;
  let first = dateSerial(start) + (options.includeStart === false ? 1 : 0);
  let last = dateSerial(end) - (options.includeEnd === false ? 1 : 0);
  if (dateSerial(start) > dateSerial(end)) return null;
  if (first > last) return { calendarDays: 0, businessDays: 0, nonWorkingDays: 0, excludedDays: 0 };

  const excluded = excludedDateSet(options.excludedDates);
  let businessDays = 0;
  let nonWorkingDays = 0;
  let excludedDays = 0;
  for (let serial = first; serial <= last; serial += 1) {
    const key = toDateKey(dateFromSerial(serial));
    const weekday = weekdayForDate(key);
    if (weekday === null || !options.workingDays.has(weekday)) nonWorkingDays += 1;
    else if (excluded.has(key)) excludedDays += 1;
    else businessDays += 1;
  }
  return { calendarDays: last - first + 1, businessDays, nonWorkingDays, excludedDays };
}

export function shiftBusinessDays(
  startValue: string,
  amount: number,
  options: BusinessDayOptions,
): DateKey | null {
  const start = parseDateKey(startValue);
  if (!start || !Number.isInteger(amount) || options.workingDays.size === 0) return null;
  if (amount === 0) return toDateKey(start);

  const direction = amount > 0 ? 1 : -1;
  let remaining = Math.abs(amount);
  let serial = dateSerial(start);
  const excluded = excludedDateSet(options.excludedDates);
  while (remaining > 0) {
    serial += direction;
    const key = toDateKey(dateFromSerial(serial));
    const weekday = weekdayForDate(key);
    if (weekday !== null && options.workingDays.has(weekday) && !excluded.has(key)) remaining -= 1;
  }
  return toDateKey(dateFromSerial(serial));
}

export function formatCalendarDate(value: string, locale?: string) {
  const date = parseDateKey(value);
  if (!date) return '';
  return new Intl.DateTimeFormat(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(date.year, date.month - 1, date.day, 12));
}

export function formatShortCalendarDate(value: string, locale?: string) {
  const date = parseDateKey(value);
  if (!date) return '';
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(date.year, date.month - 1, date.day, 12));
}
