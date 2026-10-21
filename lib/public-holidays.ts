export type PublicHolidayRecord = {
  date: string;
  name: string;
  substitute: boolean;
};

type RawHoliday = PublicHolidayRecord & { start?: Date; end?: Date };
type Correction = { remove?: string[]; add?: PublicHolidayRecord[] };

const malaysiaCommon2026: Correction = {
  remove: ['2026-03-06', '2026-03-20', '2026-06-16'],
  add: [
    { date: '2026-03-22', name: 'Hari Raya Puasa (Day 2)', substitute: false },
    { date: '2026-06-17', name: 'Awal Muharram', substitute: false },
  ],
};

// One-off corrections are based on 2026 government calendars and gazettes. They
// supplement rules that had not yet reached the packaged date-holidays dataset.
const corrections: Record<string, Correction> = {
  'MY::2026': {
    remove: malaysiaCommon2026.remove,
    add: [
      ...malaysiaCommon2026.add!,
      { date: '2026-03-07', name: 'Nuzul Al-Quran', substitute: false },
      { date: '2026-06-02', name: 'Wesak Day (substitute day)', substitute: true },
      { date: '2026-11-08', name: 'Deepavali', substitute: false },
    ],
  },
  'MY:14:2026': {
    remove: malaysiaCommon2026.remove,
    add: [
      ...malaysiaCommon2026.add!,
      { date: '2026-03-20', name: 'Additional public holiday for Hari Raya Puasa', substitute: true },
      { date: '2026-03-23', name: 'Hari Raya Puasa (substitute day)', substitute: true },
      { date: '2026-02-02', name: 'Federal Territory Day / Thaipusam (substitute day)', substitute: true },
      { date: '2026-03-07', name: 'Nuzul Al-Quran', substitute: false },
      { date: '2026-06-02', name: 'Wesak Day (substitute day)', substitute: true },
      { date: '2026-11-08', name: 'Deepavali', substitute: false },
    ],
  },
  'MY:10:2026': {
    remove: malaysiaCommon2026.remove,
    add: [
      ...malaysiaCommon2026.add!,
      { date: '2026-03-20', name: 'Additional public holiday for Hari Raya Puasa', substitute: true },
      { date: '2026-03-23', name: 'Hari Raya Puasa (substitute day)', substitute: true },
      { date: '2026-02-02', name: 'Thaipusam (substitute day)', substitute: true },
      { date: '2026-03-07', name: 'Nuzul Al-Quran', substitute: false },
      { date: '2026-06-02', name: 'Wesak Day (substitute day)', substitute: true },
      { date: '2026-11-08', name: 'Deepavali', substitute: false },
    ],
  },
  'MY:01:2026': {
    remove: [...malaysiaCommon2026.remove!, '2026-07-20'],
    add: [
      ...malaysiaCommon2026.add!,
      { date: '2026-03-20', name: 'Additional public holiday for Hari Raya Puasa', substitute: true },
      { date: '2026-02-02', name: 'Thaipusam (substitute day)', substitute: true },
      { date: '2026-06-02', name: 'Wesak Day (substitute day)', substitute: true },
      { date: '2026-07-21', name: 'Hari Hol of Sultan Iskandar of Johor', substitute: false },
      { date: '2026-03-24', name: 'Hari Raya Puasa (replacement day)', substitute: true },
      { date: '2026-11-08', name: 'Deepavali', substitute: false },
    ],
  },
  'MY:12:2026': {
    remove: [...malaysiaCommon2026.remove!, '2026-03-20', '2026-10-03'],
    add: [
      ...malaysiaCommon2026.add!,
      { date: '2026-03-30', name: "Sabah Governor's Birthday", substitute: false },
      { date: '2026-11-08', name: 'Deepavali', substitute: false },
    ],
  },
  'MY:13:2026': {
    remove: [...malaysiaCommon2026.remove!, '2026-03-20'],
    add: [
      ...malaysiaCommon2026.add!,
      { date: '2026-03-23', name: 'Hari Raya Puasa (substitute day)', substitute: true },
      { date: '2026-06-03', name: 'Wesak Day (substitute day)', substitute: true },
      { date: '2026-06-04', name: 'Gawai Dayak (substitute day)', substitute: true },
    ],
  },
  'SG::2026': {
    remove: ['2026-03-20', '2026-11-09'],
    add: [
      { date: '2026-03-21', name: 'Hari Raya Puasa', substitute: false },
      { date: '2026-05-31', name: 'Vesak Day', substitute: false },
      { date: '2026-06-01', name: 'Vesak Day (substitute day)', substitute: true },
      { date: '2026-11-08', name: 'Deepavali', substitute: false },
      { date: '2026-11-09', name: 'Deepavali (substitute day)', substitute: true },
    ],
  },
  'AU:NSW:2026': { add: [{ date: '2026-04-27', name: 'Additional public holiday for Anzac Day', substitute: true }] },
  'AU:NSW:2027': { add: [{ date: '2027-04-26', name: 'Additional public holiday for Anzac Day', substitute: true }] },
};

function addDateDays(date: string, amount: number) {
  const parsed = new Date(`${date}T00:00:00Z`);
  parsed.setUTCDate(parsed.getUTCDate() + amount);
  return parsed.toISOString().slice(0, 10);
}

export function normalizePublicHolidays(raw: RawHoliday[], country: string, region: string | undefined, year: number) {
  const expanded: PublicHolidayRecord[] = [];
  for (const holiday of raw) {
    const duration = holiday.start && holiday.end
      ? Math.max(1, Math.round((holiday.end.getTime() - holiday.start.getTime()) / 86_400_000))
      : 1;
    for (let offset = 0; offset < duration; offset += 1) {
      expanded.push({ date: addDateDays(holiday.date.slice(0, 10), offset), name: holiday.name, substitute: holiday.substitute });
    }
  }

  const correction = corrections[`${country}:${region ?? ''}:${year}`];
  const removed = new Set(correction?.remove ?? []);
  const merged = [...expanded.filter((holiday) => !removed.has(holiday.date)), ...(correction?.add ?? [])];
  const unique = new Map<string, PublicHolidayRecord>();
  for (const holiday of merged) {
    const key = `${holiday.date}|${holiday.name}`;
    if (!unique.has(key)) unique.set(key, holiday);
  }
  return Array.from(unique.values()).sort((a, b) => a.date.localeCompare(b.date) || a.name.localeCompare(b.name));
}
