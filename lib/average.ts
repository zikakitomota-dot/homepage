export const MAX_AVERAGE_VALUES = 10_000;
export const MAX_ABSOLUTE_VALUE = 1e100;

const NUMBER_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

export type AverageStatistics = {
  values: number[];
  sortedValues: number[];
  mean: number;
  median: number;
  modes: number[];
  range: number;
  sum: number;
  count: number;
  minimum: number;
  maximum: number;
};

export function parseNumberList(input: string): number[] {
  const trimmed = input.trim();
  if (!trimmed) throw new Error('Enter at least one number to calculate the average.');

  const tokens = trimmed.split(/[\s,]+/).filter(Boolean);
  if (tokens.length > MAX_AVERAGE_VALUES) {
    throw new Error(`Enter no more than ${MAX_AVERAGE_VALUES.toLocaleString()} numbers at a time.`);
  }

  return tokens.map((token) => {
    if (!NUMBER_PATTERN.test(token)) {
      throw new Error(`“${shorten(token)}” is not a valid number. Separate values with commas, spaces or new lines.`);
    }
    const value = Number(token);
    if (!Number.isFinite(value) || Math.abs(value) > MAX_ABSOLUTE_VALUE) {
      throw new Error(`“${shorten(token)}” is too large. Enter finite numbers with an absolute value no greater than 1e100.`);
    }
    return Object.is(value, -0) ? 0 : value;
  });
}

export function calculateAverageStatistics(values: number[]): AverageStatistics {
  if (values.length === 0) throw new Error('Enter at least one number to calculate the average.');

  const sortedValues = [...values].sort((a, b) => a - b);
  const sum = compensatedSum(values);
  if (!Number.isFinite(sum)) throw new Error('The combined total is too large to calculate safely.');

  const middle = Math.floor(sortedValues.length / 2);
  const median = sortedValues.length % 2
    ? sortedValues[middle]
    : (sortedValues[middle - 1] + sortedValues[middle]) / 2;

  const frequencies = new Map<number, number>();
  for (const value of values) frequencies.set(value, (frequencies.get(value) ?? 0) + 1);
  const frequencyValues = Array.from(frequencies.values());
  const highestFrequency = Math.max(...frequencyValues);
  const modes = highestFrequency === 1 || frequencyValues.every((frequency) => frequency === highestFrequency)
    ? []
    : Array.from(frequencies.entries())
        .filter(([, frequency]) => frequency === highestFrequency)
        .map(([value]) => value)
        .sort((a, b) => a - b);

  const minimum = sortedValues[0];
  const maximum = sortedValues[sortedValues.length - 1];

  return {
    values: [...values],
    sortedValues,
    mean: sum / values.length,
    median,
    modes,
    range: maximum - minimum,
    sum,
    count: values.length,
    minimum,
    maximum,
  };
}

export function formatStatistic(value: number): string {
  if (!Number.isFinite(value)) return 'Unable to calculate';
  const rounded = Math.abs(value) < 5e-13 ? 0 : Number(value.toPrecision(12));
  if (Math.abs(rounded) >= 1e15 || (Math.abs(rounded) > 0 && Math.abs(rounded) < 1e-6)) {
    return rounded.toExponential(6).replace(/\.?(0+)e/, 'e').replace(/e\+/, 'e');
  }
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(rounded);
}

function compensatedSum(values: number[]): number {
  let sum = 0;
  let correction = 0;
  for (const value of values) {
    const adjusted = value - correction;
    const next = sum + adjusted;
    correction = (next - sum) - adjusted;
    sum = next;
  }
  return sum;
}

function shorten(value: string) {
  return value.length > 24 ? `${value.slice(0, 21)}…` : value;
}

