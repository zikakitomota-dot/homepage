import { parseNumberList } from './average';

export type StandardDeviationStatistics = {
  values: number[];
  mean: number;
  sum: number;
  count: number;
  minimum: number;
  maximum: number;
  sumSquaredDeviations: number;
  populationVariance: number;
  populationStandardDeviation: number;
  sampleVariance: number | null;
  sampleStandardDeviation: number | null;
};

export function parseStandardDeviationInput(input: string) {
  return parseNumberList(input);
}

export function calculateStandardDeviation(values: number[]): StandardDeviationStatistics {
  if (values.length === 0) throw new Error('Enter at least one number to calculate standard deviation.');

  const sum = compensatedSum(values);
  if (!Number.isFinite(sum)) throw new Error('The combined total is too large to calculate safely.');
  const mean = sum / values.length;
  const squaredDeviations = values.map((value) => {
    const deviation = value - mean;
    return deviation * deviation;
  });
  const sumSquaredDeviations = compensatedSum(squaredDeviations);
  if (!Number.isFinite(sumSquaredDeviations)) throw new Error('These values are too widely spread to calculate safely.');

  const populationVariance = normalizeZero(sumSquaredDeviations / values.length);
  const sampleVariance = values.length > 1 ? normalizeZero(sumSquaredDeviations / (values.length - 1)) : null;

  return {
    values: [...values],
    mean: normalizeZero(mean),
    sum: normalizeZero(sum),
    count: values.length,
    minimum: values.reduce((minimum, value) => Math.min(minimum, value), values[0]),
    maximum: values.reduce((maximum, value) => Math.max(maximum, value), values[0]),
    sumSquaredDeviations: normalizeZero(sumSquaredDeviations),
    populationVariance,
    populationStandardDeviation: normalizeZero(Math.sqrt(populationVariance)),
    sampleVariance,
    sampleStandardDeviation: sampleVariance === null ? null : normalizeZero(Math.sqrt(sampleVariance)),
  };
}

function compensatedSum(values: number[]) {
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

function normalizeZero(value: number) {
  return Object.is(value, -0) ? 0 : value;
}

