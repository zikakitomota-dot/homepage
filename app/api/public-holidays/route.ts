import { NextRequest, NextResponse } from 'next/server';
import Holidays from 'date-holidays';
import { normalizePublicHolidays } from '@/lib/public-holidays';

export const runtime = 'nodejs';

const maxYearsPerRequest = 100;
const minimumSupportedYear = 1970;
const maximumSupportedYear = 2100;
const cacheHeaders = { 'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800' };

function dataResponse(data: unknown) {
  return NextResponse.json(data, { headers: cacheHeaders });
}

function errorResponse(error: string, status = 400) {
  return NextResponse.json({ error }, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const action = params.get('action') ?? 'countries';

  try {
    const catalog = new Holidays();
    if (action === 'countries') {
      const priority = ['MY', 'SG', 'AU', 'US', 'GB', 'IN', 'JP', 'NZ', 'ID', 'TH', 'PH'];
      const countries = Object.entries(catalog.getCountries('en'))
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => {
          const ai = priority.indexOf(a.code);
          const bi = priority.indexOf(b.code);
          if (ai !== -1 || bi !== -1) return (ai === -1 ? priority.length : ai) - (bi === -1 ? priority.length : bi);
          return a.name.localeCompare(b.name);
        });
      return dataResponse({ countries });
    }

    if (action !== 'regions' && action !== 'holidays') return errorResponse('Unknown action.');

    const country = (params.get('country') ?? '').toUpperCase();
    if (!/^[A-Z]{2}$/.test(country) || !catalog.getCountries('en')[country]) {
      return errorResponse('Choose a supported country.');
    }

    if (action === 'regions') {
      const regions = Object.entries(catalog.getStates(country, 'en') ?? {})
        .map(([code, name]) => ({ code, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
      return dataResponse({ regions });
    }

    const startYear = Number(params.get('startYear'));
    const endYear = Number(params.get('endYear'));
    const region = params.get('region') || undefined;
    if (!Number.isInteger(startYear) || !Number.isInteger(endYear) || startYear < minimumSupportedYear || endYear > maximumSupportedYear || endYear < startYear || endYear - startYear + 1 > maxYearsPerRequest) {
      return errorResponse(`Choose a valid year range between ${minimumSupportedYear} and ${maximumSupportedYear}, up to ${maxYearsPerRequest} years.`);
    }
    if (region && !(catalog.getStates(country, 'en') ?? {})[region]) {
      return errorResponse('Choose a supported state or region for this country.');
    }

    const holidayCalendar = region
      ? new Holidays(country, region, { languages: ['en'] })
      : new Holidays(country, { languages: ['en'] });
    const holidays = [];
    for (let year = startYear; year <= endYear; year += 1) {
      const publicHolidays = holidayCalendar.getHolidays(year, 'en')
        .filter((holiday) => holiday.type === 'public')
        .map((holiday) => ({ ...holiday, substitute: Boolean(holiday.substitute) }));
      holidays.push(...normalizePublicHolidays(publicHolidays, country, region, year));
    }
    if (holidays.length === 0) {
      return dataResponse({ holidays, warning: 'No official public-holiday records were available for this location and year range. Review the result before relying on it.' });
    }
    return dataResponse({ holidays, warning: 'Future and lunar-calendar holiday dates may change after official announcements. Verify critical deadlines with the relevant authority.' });
  } catch {
    return errorResponse('Holiday data is temporarily unavailable.', 500);
  }
}
