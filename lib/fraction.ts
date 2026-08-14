export type Fraction = { numerator: bigint; denominator: bigint };
export type FractionOperation = 'add' | 'subtract' | 'multiply' | 'divide';
export type FractionInput = { whole: string; numerator: string; denominator: string };

export type FractionCalculation = {
  result: Fraction;
  mixed: string;
  improper: string;
  decimal: string;
  decimalIsApproximate: boolean;
  steps: string[];
};

const INTEGER_PATTERN = /^-?\d+$/;
const MAX_DIGITS = 100;

function absolute(value: bigint) {
  return value < BigInt(0) ? -value : value;
}

export function greatestCommonDivisor(first: bigint, second: bigint) {
  let a = absolute(first);
  let b = absolute(second);
  while (b !== BigInt(0)) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a || BigInt(1);
}

export function simplifyFraction(numerator: bigint, denominator: bigint): Fraction {
  if (denominator === BigInt(0)) throw new Error('A denominator cannot be zero.');
  if (numerator === BigInt(0)) return { numerator: BigInt(0), denominator: BigInt(1) };
  const sign = denominator < BigInt(0) ? BigInt(-1) : BigInt(1);
  const divisor = greatestCommonDivisor(numerator, denominator);
  return { numerator: (numerator / divisor) * sign, denominator: absolute(denominator) / divisor };
}

function parseInteger(value: string, label: string, optional = false) {
  const trimmed = value.trim();
  if (!trimmed && optional) return BigInt(0);
  if (!trimmed) throw new Error(`Enter the ${label}.`);
  if (!INTEGER_PATTERN.test(trimmed)) throw new Error(`${label} must be a whole number.`);
  if (trimmed.replace('-', '').length > MAX_DIGITS) throw new Error(`${label} must contain no more than ${MAX_DIGITS} digits.`);
  return BigInt(trimmed);
}

export function parseFractionInput(input: FractionInput, label: string): Fraction {
  const whole = parseInteger(input.whole, `${label} whole number`, true);
  const numerator = parseInteger(input.numerator, `${label} numerator`);
  const denominator = parseInteger(input.denominator, `${label} denominator`);
  if (denominator === BigInt(0)) throw new Error(`${label} denominator cannot be zero.`);
  if (whole !== BigInt(0) && numerator < BigInt(0)) {
    throw new Error(`Use the minus sign on the ${label} whole number, not on both parts of a mixed number.`);
  }

  const denominatorMagnitude = absolute(denominator);
  const signedFractionNumerator = denominator < BigInt(0) ? -numerator : numerator;
  const combinedNumerator = whole < BigInt(0) && denominator > BigInt(0)
    ? whole * denominatorMagnitude - numerator
    : whole * denominatorMagnitude + signedFractionNumerator;
  return simplifyFraction(combinedNumerator, denominatorMagnitude);
}

export function formatImproperFraction(fraction: Fraction) {
  return fraction.denominator === BigInt(1)
    ? fraction.numerator.toString()
    : `${fraction.numerator}/${fraction.denominator}`;
}

export function formatMixedNumber(fraction: Fraction) {
  const { numerator, denominator } = fraction;
  if (denominator === BigInt(1)) return numerator.toString();
  const magnitude = absolute(numerator);
  const whole = magnitude / denominator;
  const remainder = magnitude % denominator;
  const sign = numerator < BigInt(0) ? '-' : '';
  if (whole === BigInt(0)) return `${sign}${remainder}/${denominator}`;
  if (remainder === BigInt(0)) return `${sign}${whole}`;
  return `${sign}${whole} ${remainder}/${denominator}`;
}

export function formatDecimal(fraction: Fraction, maximumPlaces = 8) {
  const sign = fraction.numerator < BigInt(0) ? '-' : '';
  const magnitude = absolute(fraction.numerator);
  const whole = magnitude / fraction.denominator;
  let remainder = magnitude % fraction.denominator;
  if (remainder === BigInt(0)) return { value: `${sign}${whole}`, approximate: false };

  let decimals = '';
  for (let place = 0; place < maximumPlaces && remainder !== BigInt(0); place += 1) {
    remainder *= BigInt(10);
    decimals += (remainder / fraction.denominator).toString();
    remainder %= fraction.denominator;
  }
  return { value: `${sign}${whole}.${decimals}`, approximate: remainder !== BigInt(0) };
}

function rawOperation(first: Fraction, second: Fraction, operation: FractionOperation): Fraction {
  if (operation === 'add') return { numerator: first.numerator * second.denominator + second.numerator * first.denominator, denominator: first.denominator * second.denominator };
  if (operation === 'subtract') return { numerator: first.numerator * second.denominator - second.numerator * first.denominator, denominator: first.denominator * second.denominator };
  if (operation === 'multiply') return { numerator: first.numerator * second.numerator, denominator: first.denominator * second.denominator };
  if (second.numerator === BigInt(0)) throw new Error('Cannot divide by zero. Enter a non-zero second fraction.');
  return { numerator: first.numerator * second.denominator, denominator: first.denominator * second.numerator };
}

function buildSteps(first: Fraction, second: Fraction, operation: FractionOperation, raw: Fraction, result: Fraction) {
  const a = first.numerator;
  const b = first.denominator;
  const c = second.numerator;
  const d = second.denominator;
  const rawText = `${raw.numerator}/${raw.denominator}`;
  const resultText = formatImproperFraction(result);
  const steps: string[] = [];

  if (operation === 'add' || operation === 'subtract') {
    const symbol = operation === 'add' ? '+' : '−';
    steps.push(`Use a common denominator: ${b} × ${d} = ${b * d}.`);
    steps.push(`Rewrite and ${operation}: (${a} × ${d} ${symbol} ${c} × ${b}) / ${b * d} = ${rawText}.`);
  } else if (operation === 'multiply') {
    steps.push(`Multiply the numerators and denominators: (${a} × ${c}) / (${b} × ${d}) = ${rawText}.`);
  } else {
    steps.push(`Keep the first fraction and invert the second: ${a}/${b} × ${d}/${c}.`);
    steps.push(`Multiply: (${a} × ${d}) / (${b} × ${c}) = ${rawText}.`);
  }

  const normalizedRaw = simplifyFraction(raw.numerator, raw.denominator);
  if (raw.numerator !== normalizedRaw.numerator || raw.denominator !== normalizedRaw.denominator) {
    const divisor = greatestCommonDivisor(raw.numerator, raw.denominator);
    steps.push(`Simplify by dividing the numerator and denominator by ${divisor}: ${resultText}.`);
  } else {
    steps.push(`${resultText} is already in simplest form.`);
  }
  const mixed = formatMixedNumber(result);
  if (mixed !== resultText) steps.push(`Write the improper fraction as a mixed number: ${mixed}.`);
  return steps;
}

export function calculateFractions(first: Fraction, second: Fraction, operation: FractionOperation): FractionCalculation {
  const raw = rawOperation(first, second, operation);
  const result = simplifyFraction(raw.numerator, raw.denominator);
  const decimal = formatDecimal(result);
  return {
    result,
    mixed: formatMixedNumber(result),
    improper: formatImproperFraction(result),
    decimal: decimal.value,
    decimalIsApproximate: decimal.approximate,
    steps: buildSteps(first, second, operation, raw, result),
  };
}

