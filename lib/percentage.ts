export type PercentageMode = 'of' | 'ratio' | 'change' | 'adjust' | 'reverse';
export type Direction = 'increase' | 'decrease';

export type PercentageResult = {
  primary: number;
  sentence: string;
  calculation: string;
  secondary?: string;
};

const maximumMagnitude = 1_000_000_000_000_000;

export function isSafePercentageInput(value: number) {
  return Number.isFinite(value) && Math.abs(value) <= maximumMagnitude;
}

export function percentageOf(percentage: number, value: number): PercentageResult | null {
  if (![percentage, value].every(isSafePercentageInput)) return null;
  const result = percentage / 100 * value;
  if (!Number.isFinite(result)) return null;
  return {
    primary: result,
    sentence: `${formatNumber(percentage)}% of ${formatNumber(value)} is ${formatNumber(result)}.`,
    calculation: `${formatNumber(percentage)} ÷ 100 × ${formatNumber(value)} = ${formatNumber(result)}`,
  };
}

export function percentageRatio(part: number, whole: number): PercentageResult | null {
  if (![part, whole].every(isSafePercentageInput) || whole === 0) return null;
  const result = part / whole * 100;
  if (!Number.isFinite(result)) return null;
  return {
    primary: result,
    sentence: `${formatNumber(part)} is ${formatNumber(result)}% of ${formatNumber(whole)}.`,
    calculation: `${formatNumber(part)} ÷ ${formatNumber(whole)} × 100 = ${formatNumber(result)}%`,
  };
}

export function percentageChange(original: number, next: number): PercentageResult | null {
  if (![original, next].every(isSafePercentageInput) || original <= 0) return null;
  const difference = next - original;
  const result = difference / original * 100;
  if (!Number.isFinite(result) || !Number.isFinite(difference)) return null;
  const direction = difference > 0 ? 'increase' : difference < 0 ? 'decrease' : 'no change';
  return {
    primary: result,
    sentence: direction === 'no change'
      ? `The value did not change from ${formatNumber(original)}.`
      : `The value ${direction === 'increase' ? 'increased' : 'decreased'} from ${formatNumber(original)} to ${formatNumber(next)}.`,
    secondary: `Difference: ${formatSignedNumber(difference)}`,
    calculation: `(${formatNumber(next)} − ${formatNumber(original)}) ÷ ${formatNumber(original)} × 100 = ${formatNumber(result)}%`,
  };
}

export function adjustByPercentage(startingValue: number, percentage: number, direction: Direction): PercentageResult | null {
  if (![startingValue, percentage].every(isSafePercentageInput) || percentage < 0) return null;
  const amount = startingValue * percentage / 100;
  const result = direction === 'increase' ? startingValue + amount : startingValue - amount;
  if (![amount, result].every(Number.isFinite)) return null;
  const operator = direction === 'increase' ? '+' : '−';
  return {
    primary: result,
    sentence: `${formatNumber(startingValue)} ${direction === 'increase' ? 'increased' : 'decreased'} by ${formatNumber(percentage)}% is ${formatNumber(result)}.`,
    secondary: `Amount ${direction === 'increase' ? 'added' : 'removed'}: ${formatNumber(Math.abs(amount))}`,
    calculation: `${formatNumber(startingValue)} × (1 ${operator} ${formatNumber(percentage)} ÷ 100) = ${formatNumber(result)}`,
  };
}

export function reversePercentage(finalValue: number, percentage: number, direction: Direction): PercentageResult | null {
  if (![finalValue, percentage].every(isSafePercentageInput) || percentage < 0 || (direction === 'decrease' && percentage === 100)) return null;
  const divisor = direction === 'increase' ? 1 + percentage / 100 : 1 - percentage / 100;
  const result = finalValue / divisor;
  if (!Number.isFinite(result)) return null;
  const operator = direction === 'increase' ? '+' : '−';
  return {
    primary: result,
    sentence: `The original value was ${formatNumber(result)} before the ${formatNumber(percentage)}% ${direction}.`,
    calculation: `${formatNumber(finalValue)} ÷ (1 ${operator} ${formatNumber(percentage)} ÷ 100) = ${formatNumber(result)}`,
  };
}

export function formatNumber(value: number) {
  if (Object.is(value, -0) || Math.abs(value) < 1e-12) return '0';
  if (Math.abs(value) >= 1e15 || Math.abs(value) < 1e-7) return value.toExponential(6).replace(/\.?(0+)e/, 'e');
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 10 }).format(value);
}

function formatSignedNumber(value: number) {
  if (value > 0) return `+${formatNumber(value)}`;
  return formatNumber(value);
}
