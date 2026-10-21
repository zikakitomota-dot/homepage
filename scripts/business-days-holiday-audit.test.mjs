import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

async function importTypescript(file) {
  const source = await fs.readFile(path.resolve(file), 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 } }).outputText;
  return import(`data:text/javascript;base64,${Buffer.from(output).toString('base64')}`);
}

const workTime = await importTypescript('lib/work-time.ts');
const holidayTools = await importTypescript('lib/public-holidays.ts');
const mondayFriday = new Set([1, 2, 3, 4, 5]);

function exclusions(dates) {
  return dates.map((date) => ({ date }));
}

const countCases = [
  ['Kuala Lumpur substitute day', '2026-02-01', '2026-02-06', ['2026-02-01', '2026-02-02'], 4],
  ['Selangor ruler birthday', '2026-12-07', '2026-12-14', ['2026-12-11'], 5],
  ['Johor Hari Hol corrected date', '2026-07-20', '2026-07-22', ['2026-07-21'], 2],
  ['Sabah Governor birthday corrected date', '2026-03-27', '2026-03-31', ['2026-03-30'], 2],
  ['Sarawak overlapping June substitutes', '2026-06-01', '2026-06-05', ['2026-06-01', '2026-06-02', '2026-06-03', '2026-06-04'], 1],
  ['Singapore weekend holiday', '2026-03-20', '2026-03-23', ['2026-03-21'], 2],
  ['NSW Anzac additional holiday', '2026-04-24', '2026-04-28', ['2026-04-25', '2026-04-27'], 2],
  ['WA Anzac substitute holiday', '2026-04-24', '2026-04-28', ['2026-04-25', '2026-04-27'], 2],
  ['US Independence Day observed', '2026-07-01', '2026-07-06', ['2026-07-03', '2026-07-04'], 3],
  ['UK Christmas substitute day', '2026-12-24', '2026-12-29', ['2026-12-25', '2026-12-26', '2026-12-28'], 2],
  ['US cross-year range', '2026-12-24', '2027-01-04', ['2026-12-25', '2027-01-01'], 6],
  ['UK cross-year range', '2026-12-24', '2027-01-04', ['2026-12-25', '2026-12-28', '2027-01-01'], 5],
];

for (const [name, start, end, holidayDates, expected] of countCases) {
  test(name, () => {
    const result = workTime.countBusinessDays(start, end, { workingDays: mondayFriday, excludedDates: exclusions(holidayDates) });
    assert.equal(result.businessDays, expected);
    assert.equal(result.businessDays + result.nonWorkingDays + result.excludedDays, result.calendarDays);
  });
}

test('boundary exclusions do not count an omitted holiday boundary', () => {
  const result = workTime.countBusinessDays('2026-12-25', '2026-12-29', { workingDays: mondayFriday, excludedDates: exclusions(['2026-12-25', '2026-12-28']), includeStart: false });
  assert.deepEqual(result, { calendarDays: 4, businessDays: 1, nonWorkingDays: 2, excludedDays: 1 });
});

test('custom Saturday–Wednesday workweek excludes a Saturday public holiday once', () => {
  const result = workTime.countBusinessDays('2026-03-20', '2026-03-23', { workingDays: new Set([0, 1, 2, 3, 6]), excludedDates: exclusions(['2026-03-21']) });
  assert.deepEqual(result, { calendarDays: 4, businessDays: 2, nonWorkingDays: 1, excludedDays: 1 });
});

test('overlapping manual and official dates are counted once', () => {
  const result = workTime.countBusinessDays('2026-07-01', '2026-07-06', { workingDays: mondayFriday, excludedDates: exclusions(['2026-07-03', '2026-07-03', '2026-07-04']) });
  assert.deepEqual(result, { calendarDays: 6, businessDays: 3, nonWorkingDays: 2, excludedDays: 1 });
});

test('forward and backward shifts use observed holidays', () => {
  const options = { workingDays: mondayFriday, excludedDates: exclusions(['2026-07-03', '2026-07-04']) };
  assert.equal(workTime.shiftBusinessDays('2026-06-30', 3, options), '2026-07-06');
  assert.equal(workTime.shiftBusinessDays('2026-07-06', -3, options), '2026-06-30');
});

function nthWeekday(year, month, weekday, nth) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const day = 1 + ((weekday - first.getUTCDay() + 7) % 7) + (nth - 1) * 7;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function lastWeekday(year, month, weekday) {
  const last = new Date(Date.UTC(year, month, 0));
  const day = last.getUTCDate() - ((last.getUTCDay() - weekday + 7) % 7);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function observedFixed(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCDay() === 6) date.setUTCDate(date.getUTCDate() - 1);
  if (date.getUTCDay() === 0) date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function independentUsFederalHolidays(year) {
  return new Set([
    observedFixed(year, 1, 1), nthWeekday(year, 1, 1, 3), nthWeekday(year, 2, 1, 3),
    lastWeekday(year, 5, 1), observedFixed(year, 6, 19), observedFixed(year, 7, 4),
    nthWeekday(year, 9, 1, 1), nthWeekday(year, 10, 1, 2), observedFixed(year, 11, 11),
    nthWeekday(year, 11, 4, 4), observedFixed(year, 12, 25),
    observedFixed(year + 1, 1, 1),
  ]);
}

function independentShift(start, amount) {
  const holidays = new Set([...independentUsFederalHolidays(2026), ...independentUsFederalHolidays(2027), ...independentUsFederalHolidays(2028)]);
  const date = new Date(`${start}T00:00:00Z`);
  let remaining = amount;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const key = date.toISOString().slice(0, 10);
    if (date.getUTCDay() >= 1 && date.getUTCDay() <= 5 && !holidays.has(key)) remaining -= 1;
  }
  return date.toISOString().slice(0, 10);
}

test('large forward shift crosses multiple years', () => {
  const expected = independentShift('2026-01-02', 520);
  const holidays = [...independentUsFederalHolidays(2026), ...independentUsFederalHolidays(2027), ...independentUsFederalHolidays(2028)];
  assert.equal(expected, '2028-02-02');
  assert.equal(workTime.shiftBusinessDays('2026-01-02', 520, { workingDays: mondayFriday, excludedDates: exclusions(holidays) }), expected);
});

test('multi-date holidays expand through the end date', () => {
  const normalized = holidayTools.normalizePublicHolidays([{ date: '2026-05-04 00:00:00', name: 'Three-day closure', substitute: false, start: new Date('2026-05-04T00:00:00Z'), end: new Date('2026-05-07T00:00:00Z') }], 'ZZ', undefined, 2026);
  assert.deepEqual(normalized.map((holiday) => holiday.date), ['2026-05-04', '2026-05-05', '2026-05-06']);
  assert.equal(workTime.countBusinessDays('2026-05-04', '2026-05-08', { workingDays: mondayFriday, excludedDates: normalized }).businessDays, 2);
});

test('official correction layer replaces stale Malaysia and Singapore dates', () => {
  const malaysia = holidayTools.normalizePublicHolidays([
    { date: '2026-03-06', name: 'Nuzul', substitute: false },
    { date: '2026-06-16', name: 'Awal Muharram', substitute: false },
  ], 'MY', '14', 2026);
  assert.ok(!malaysia.some((holiday) => holiday.date === '2026-03-06' || holiday.date === '2026-06-16'));
  assert.ok(malaysia.some((holiday) => holiday.date === '2026-03-20' && holiday.name.includes('Additional public holiday')));
  assert.ok(malaysia.some((holiday) => holiday.date === '2026-03-07'));
  assert.ok(malaysia.some((holiday) => holiday.date === '2026-06-17'));
  const singapore = holidayTools.normalizePublicHolidays([{ date: '2026-03-20', name: 'Hari Raya Puasa', substitute: false }], 'SG', undefined, 2026);
  assert.ok(!singapore.some((holiday) => holiday.date === '2026-03-20'));
  assert.ok(singapore.some((holiday) => holiday.date === '2026-03-21'));
  assert.ok(singapore.some((holiday) => holiday.date === '2026-05-31' && holiday.name === 'Vesak Day'));
  assert.ok(singapore.some((holiday) => holiday.date === '2026-06-01' && holiday.substitute));
  assert.ok(singapore.some((holiday) => holiday.date === '2026-11-09' && holiday.substitute));
});

test('Malaysia regional corrections respect Peninsular and East Malaysia rules', () => {
  const stale = [
    { date: '2026-03-20', name: 'Hari Raya Puasa', substitute: false },
    { date: '2026-03-21', name: 'Hari Raya Puasa', substitute: false },
  ];
  const sabah = holidayTools.normalizePublicHolidays(stale, 'MY', '12', 2026);
  assert.ok(!sabah.some((holiday) => holiday.date === '2026-03-20'));
  assert.ok(!sabah.some((holiday) => holiday.date === '2026-03-23'));
  const sarawak = holidayTools.normalizePublicHolidays(stale, 'MY', '13', 2026);
  assert.ok(sarawak.some((holiday) => holiday.date === '2026-03-23' && holiday.substitute));
  const johor = holidayTools.normalizePublicHolidays(stale, 'MY', '01', 2026);
  assert.ok(johor.some((holiday) => holiday.date === '2026-03-20' && holiday.name.includes('Additional public holiday')));
  assert.ok(johor.some((holiday) => holiday.date === '2026-03-24' && holiday.substitute));
});
