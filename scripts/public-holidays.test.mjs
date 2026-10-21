import test from 'node:test';
import assert from 'node:assert/strict';
import Holidays from 'date-holidays';

function publicDates(country, state, year) {
  const calendar = state
    ? new Holidays(country, state, { languages: ['en'] })
    : new Holidays(country, { languages: ['en'] });
  return calendar.getHolidays(year, 'en')
    .filter((holiday) => holiday.type === 'public')
    .map((holiday) => ({ date: holiday.date.slice(0, 10), name: holiday.name, substitute: Boolean(holiday.substitute) }));
}

test('matches verified Singapore national and substitute holidays', () => {
  const holidays = publicDates('SG', undefined, 2024);
  assert.ok(holidays.some((holiday) => holiday.date === '2024-08-09' && holiday.name === 'National Day'));
  assert.ok(holidays.some((holiday) => holiday.date === '2024-02-12' && holiday.substitute));
});

test('includes the verified NSW Labour Day regional holiday', () => {
  assert.ok(publicDates('AU', 'nsw', 2024).some((holiday) => holiday.date === '2024-10-07' && holiday.name === 'Labour Day'));
});

test('includes Malaysia federal and Selangor state holidays', () => {
  const holidays = publicDates('MY', '10', 2024);
  assert.ok(holidays.some((holiday) => holiday.date === '2024-08-31' && holiday.name === 'Independence Day'));
  assert.ok(holidays.some((holiday) => holiday.date === '2024-12-11' && holiday.name.includes('Selangor')));
});

test('loads adjacent years for cross-year calculations', () => {
  const dates = [...publicDates('US', undefined, 2021), ...publicDates('US', undefined, 2022)];
  assert.ok(dates.some((holiday) => holiday.date === '2021-12-31' && holiday.substitute));
  assert.ok(dates.some((holiday) => holiday.date === '2022-01-01'));
});

test('deduplicates overlapping official and manual exclusion dates', () => {
  const official = publicDates('SG', undefined, 2024).map((holiday) => holiday.date);
  const manual = ['2024-08-09', '2024-08-12'];
  assert.equal(new Set([...official, ...manual]).size, new Set(official).size + 1);
});
