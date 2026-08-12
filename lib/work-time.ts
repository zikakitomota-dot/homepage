export const workDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;

export const workTimeTools = [
  {
    slug: 'work-hours-calculator',
    title: 'Work Hours Calculator',
    description: 'Calculate daily and weekly hours, subtract unpaid breaks, track overtime and estimate pay.',
    icon: 'clock',
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
