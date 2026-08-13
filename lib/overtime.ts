export type OvertimeResult = {
  regularHours: number;
  overtimeHours: number;
  regularRate: number;
  overtimeRate: number;
  regularPay: number;
  overtimePay: number;
  totalPay: number;
};

export type OvertimeInputs = {
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  multiplier: number;
};

export function calculateDirectOvertime({ regularHours, overtimeHours, hourlyRate, multiplier }: OvertimeInputs): OvertimeResult {
  const overtimeRate = hourlyRate * multiplier;
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * overtimeRate;
  return { regularHours, overtimeHours, regularRate: hourlyRate, overtimeRate, regularPay, overtimePay, totalPay: regularPay + overtimePay };
}

export function calculateWeeklyOvertime(totalHours: number, hourlyRate: number, threshold: number, multiplier: number): OvertimeResult {
  const overtimeHours = Math.max(totalHours - threshold, 0);
  const regularHours = totalHours - overtimeHours;
  return calculateDirectOvertime({ regularHours, overtimeHours, hourlyRate, multiplier });
}

export const overtimeCurrencies = [
  { code: 'USD', label: 'USD $', locale: 'en-US' },
  { code: 'MYR', label: 'MYR RM', locale: 'en-MY' },
  { code: 'GBP', label: 'GBP £', locale: 'en-GB' },
  { code: 'EUR', label: 'EUR €', locale: 'en-IE' },
  { code: 'SGD', label: 'SGD S$', locale: 'en-SG' },
  { code: 'AUD', label: 'AUD A$', locale: 'en-AU' },
  { code: 'CAD', label: 'CAD C$', locale: 'en-CA' },
] as const;

export type OvertimeCurrency = (typeof overtimeCurrencies)[number]['code'];

export function formatOvertimeMoney(value: number, currency: OvertimeCurrency) {
  const config = overtimeCurrencies.find((item) => item.code === currency) ?? overtimeCurrencies[0];
  return new Intl.NumberFormat(config.locale, { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
}
