export type TimeParts = { hours: number; minutes: number; seconds: number };
export type DateParts = { year: number; month: number; day: number };

const secondsPerDay = 86_400;
const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/;
const timePattern = /^(\d{2}):(\d{2})(?::(\d{2}))?$/;

export function parseClockTime(value: string): TimeParts | null {
  const match = timePattern.exec(value);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  const seconds = Number(match[3] ?? 0);
  return hours <= 23 && minutes <= 59 && seconds <= 59 ? { hours, minutes, seconds } : null;
}

export function parseLocalDate(value: string): DateParts | null {
  const match = datePattern.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));
  return probe.getUTCFullYear() === year && probe.getUTCMonth() === month - 1 && probe.getUTCDate() === day
    ? { year, month, day }
    : null;
}

export function localDateSerial(date: DateParts) {
  return Math.floor(Date.UTC(date.year, date.month - 1, date.day) / (secondsPerDay * 1000));
}

export function dateFromSerial(serial: number): DateParts {
  const date = new Date(serial * secondsPerDay * 1000);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

export function formatDateKey(date: DateParts) {
  return `${date.year.toString().padStart(4, '0')}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
}

export function secondsSinceMidnight(time: TimeParts) {
  return time.hours * 3600 + time.minutes * 60 + time.seconds;
}

export function durationBetween(startTime: string, endTime: string, startDate?: string, endDate?: string) {
  const start = parseClockTime(startTime);
  const end = parseClockTime(endTime);
  if (!start || !end) return null;
  const startSeconds = secondsSinceMidnight(start);
  const endSeconds = secondsSinceMidnight(end);
  if (startDate || endDate) {
    const firstDate = parseLocalDate(startDate ?? '');
    const lastDate = parseLocalDate(endDate ?? '');
    if (!firstDate || !lastDate) return null;
    return (localDateSerial(lastDate) - localDateSerial(firstDate)) * secondsPerDay + endSeconds - startSeconds;
  }
  return endSeconds >= startSeconds ? endSeconds - startSeconds : secondsPerDay - startSeconds + endSeconds;
}

export function shiftTime(timeValue: string, amountSeconds: number, dateValue?: string) {
  const time = parseClockTime(timeValue);
  if (!time || !Number.isSafeInteger(amountSeconds)) return null;
  const date = dateValue ? parseLocalDate(dateValue) : null;
  if (dateValue && !date) return null;
  const initial = secondsSinceMidnight(time);
  const total = initial + amountSeconds;
  const dayOffset = Math.floor(total / secondsPerDay);
  const clockSeconds = ((total % secondsPerDay) + secondsPerDay) % secondsPerDay;
  return {
    clockSeconds,
    dayOffset,
    date: date ? dateFromSerial(localDateSerial(date) + dayOffset) : null,
  };
}

export function formatClock(totalSeconds: number, format: '12' | '24', includeSeconds = false) {
  const normalized = ((totalSeconds % secondsPerDay) + secondsPerDay) % secondsPerDay;
  const hours = Math.floor(normalized / 3600);
  const minutes = Math.floor((normalized % 3600) / 60);
  const seconds = normalized % 60;
  const minuteText = minutes.toString().padStart(2, '0');
  const secondText = includeSeconds ? `:${seconds.toString().padStart(2, '0')}` : '';
  if (format === '24') return `${hours.toString().padStart(2, '0')}:${minuteText}${secondText}`;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  return `${displayHour}:${minuteText}${secondText} ${period}`;
}

export function formatLongDate(date: DateParts, locale?: string) {
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(date.year, date.month - 1, date.day, 12));
}

export function formatDurationWords(totalSeconds: number, includeSeconds = false) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const days = Math.floor(safe / secondsPerDay);
  const hours = Math.floor((safe % secondsPerDay) / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  if (hours) parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  if (includeSeconds && seconds) parts.push(`${seconds} ${seconds === 1 ? 'second' : 'seconds'}`);
  return parts.length ? parts.join(' ') : includeSeconds ? '0 seconds' : '0 minutes';
}
