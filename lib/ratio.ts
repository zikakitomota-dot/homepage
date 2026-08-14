export type Rational = { numerator: bigint; denominator: bigint };
export type RatioMode = 'simplify' | 'scale' | 'proportion' | 'three';

export type SimplifiedRatio = {
  original: string;
  integerEquivalent: string;
  simplified: string;
  divisor: string;
  calculation: string;
  fraction?: string;
  totalParts?: string;
  firstShare?: string;
  secondShare?: string;
};

export type ScaledRatio = {
  original: string;
  scaled: string;
  simplified: string;
  calculation: string;
};

export type ProportionResult = { answer: string; equation: string; steps: string[] };

const DECIMAL_PATTERN = /^-?(?:\d+(?:\.\d*)?|\.\d+)$/;
const MAX_DIGITS = 100;
const ZERO = BigInt(0);
const ONE = BigInt(1);
const TEN = BigInt(10);

function absolute(value: bigint) {
  return value < ZERO ? -value : value;
}

export function ratioGcd(first: bigint, second: bigint) {
  let a = absolute(first);
  let b = absolute(second);
  while (b !== ZERO) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

function gcdMany(values: bigint[]) {
  return values.reduce((current, value) => ratioGcd(current, value), ZERO) || ONE;
}

function normalize(numerator: bigint, denominator: bigint): Rational {
  if (denominator === ZERO) throw new Error('Division by zero is undefined.');
  if (numerator === ZERO) return { numerator: ZERO, denominator: ONE };
  const sign = denominator < ZERO ? BigInt(-1) : ONE;
  const divisor = ratioGcd(numerator, denominator);
  return { numerator: numerator / divisor * sign, denominator: absolute(denominator) / divisor };
}

function powerOfTen(exponent: number) {
  let result = ONE;
  for (let index = 0; index < exponent; index += 1) result *= TEN;
  return result;
}

type ParsedNumber = Rational & { decimalPlaces: number; unscaled: bigint; display: string };

export function parseRatioNumber(input: string, label: string): ParsedNumber {
  const text = input.trim();
  if (!text) throw new Error(`Enter ${label}.`);
  if (!DECIMAL_PATTERN.test(text)) throw new Error(`${label} must be a valid whole or decimal number.`);
  if (text.replace(/[-.]/g, '').length > MAX_DIGITS) throw new Error(`${label} must contain no more than ${MAX_DIGITS} digits.`);

  const negative = text.startsWith('-');
  const unsigned = negative ? text.slice(1) : text;
  const [whole = '0', decimals = ''] = unsigned.split('.');
  const digits = `${whole || '0'}${decimals}`.replace(/^0+(?=\d)/, '') || '0';
  const unscaled = BigInt(`${negative ? '-' : ''}${digits}`);
  const denominator = powerOfTen(decimals.length);
  const value = normalize(unscaled, denominator);
  return { ...value, decimalPlaces: decimals.length, unscaled, display: formatRational(value).value };
}

function toCommonDecimalIntegers(values: ParsedNumber[]) {
  const maximumPlaces = Math.max(...values.map((value) => value.decimalPlaces));
  return values.map((value) => value.unscaled * powerOfTen(maximumPlaces - value.decimalPlaces));
}

function normalizeRatioSigns(values: bigint[]) {
  return values.every((value) => value <= ZERO) && values.some((value) => value < ZERO)
    ? values.map((value) => -value)
    : values;
}

function formatRatio(values: bigint[]) {
  return values.join(' : ');
}

export function formatRational(value: Rational, maximumPlaces = 6) {
  const normalized = normalize(value.numerator, value.denominator);
  if (normalized.denominator === ONE) return { value: normalized.numerator.toString(), approximate: false };
  const sign = normalized.numerator < ZERO ? '-' : '';
  const magnitude = absolute(normalized.numerator);
  const whole = magnitude / normalized.denominator;
  let remainder = magnitude % normalized.denominator;
  let decimals = '';
  for (let place = 0; place < maximumPlaces && remainder !== ZERO; place += 1) {
    remainder *= TEN;
    decimals += (remainder / normalized.denominator).toString();
    remainder %= normalized.denominator;
  }
  return { value: `${sign}${whole}.${decimals}`, approximate: remainder !== ZERO };
}

function displayRational(value: Rational) {
  const formatted = formatRational(value);
  return `${formatted.approximate ? '≈ ' : ''}${formatted.value}`;
}

export function simplifyRatio(inputs: string[]): SimplifiedRatio {
  if (inputs.length !== 2 && inputs.length !== 3) throw new Error('Enter either two or three ratio values.');
  const parsed = inputs.map((value, index) => parseRatioNumber(value, `ratio value ${index + 1}`));
  let integers = toCommonDecimalIntegers(parsed);
  if (integers.every((value) => value === ZERO)) throw new Error('A ratio containing only zeros is undefined. Enter at least one non-zero value.');
  const divisor = gcdMany(integers);
  let simplified = integers.map((value) => value / divisor);
  simplified = normalizeRatioSigns(simplified);
  integers = normalizeRatioSigns(integers);

  const result: SimplifiedRatio = {
    original: parsed.map((value) => value.display).join(' : '),
    integerEquivalent: formatRatio(integers),
    simplified: formatRatio(simplified),
    divisor: divisor.toString(),
    calculation: `${integers.map((value) => `${value} ÷ ${divisor}`).join(' : ')} = ${formatRatio(simplified)}`,
  };

  if (simplified.length === 2) {
    if (simplified[1] !== ZERO) result.fraction = `${simplified[0]}/${simplified[1]}`;
    const total = simplified[0] + simplified[1];
    if (simplified.every((value) => value >= ZERO) && total > ZERO) {
      result.totalParts = total.toString();
      const first = normalize(simplified[0], total);
      const second = normalize(simplified[1], total);
      const firstPercent = displayRational(normalize(first.numerator * BigInt(100), first.denominator));
      const secondPercent = displayRational(normalize(second.numerator * BigInt(100), second.denominator));
      result.firstShare = `${first.numerator}/${first.denominator} = ${firstPercent}%`;
      result.secondShare = `${second.numerator}/${second.denominator} = ${secondPercent}%`;
    }
  }
  return result;
}

export function scaleRatio(firstInput: string, secondInput: string, factorInput: string): ScaledRatio {
  const first = parseRatioNumber(firstInput, 'Ratio A');
  const second = parseRatioNumber(secondInput, 'Ratio B');
  const factor = parseRatioNumber(factorInput, 'the scale factor');
  if (first.numerator === ZERO && second.numerator === ZERO) throw new Error('0 : 0 is undefined and cannot be scaled.');
  if (factor.numerator === ZERO) throw new Error('The scale factor must be non-zero to preserve an equivalent ratio.');
  if (factor.numerator < ZERO) throw new Error('Enter a positive scale factor greater than zero.');
  const scaledFirst = normalize(first.numerator * factor.numerator, first.denominator * factor.denominator);
  const scaledSecond = normalize(second.numerator * factor.numerator, second.denominator * factor.denominator);
  const scaledFirstText = displayRational(scaledFirst);
  const scaledSecondText = displayRational(scaledSecond);
  return {
    original: `${first.display} : ${second.display}`,
    scaled: `${scaledFirstText} : ${scaledSecondText}`,
    simplified: simplifyRatio([firstInput, secondInput]).simplified,
    calculation: `${first.display} × ${factor.display} : ${second.display} × ${factor.display} = ${scaledFirstText} : ${scaledSecondText}`,
  };
}

function isUnknown(value: string) {
  const text = value.trim().toLowerCase();
  return !text || text === 'x';
}

export function solveProportion(inputs: [string, string, string, string]): ProportionResult {
  const labels = ['A', 'B', 'C', 'D'];
  const unknowns = inputs.map(isUnknown);
  const unknownCount = unknowns.filter(Boolean).length;
  if (unknownCount !== 1) throw new Error(unknownCount === 0 ? 'Leave exactly one value empty or enter x for the unknown.' : 'Only one proportion value can be unknown.');
  const unknownIndex = unknowns.indexOf(true);
  const values = inputs.map((input, index) => unknowns[index] ? null : parseRatioNumber(input, labels[index]));
  if (values[1]?.numerator === ZERO || values[3]?.numerator === ZERO) throw new Error('B and D are denominator positions and must be non-zero.');

  const known = (index: number) => values[index] as ParsedNumber;
  let numerator: Rational;
  let crossStep: string;
  let divisionStep: string;
  if (unknownIndex === 0) {
    numerator = normalize(known(1).numerator * known(2).numerator * known(3).denominator, known(1).denominator * known(2).denominator * known(3).numerator);
    crossStep = `${known(3).display} × x = ${known(1).display} × ${known(2).display}`;
    divisionStep = `x = (${known(1).display} × ${known(2).display}) ÷ ${known(3).display}`;
  } else if (unknownIndex === 1) {
    if (known(2).numerator === ZERO) throw new Error('This proportion has no single valid value for B because C is zero.');
    numerator = normalize(known(0).numerator * known(3).numerator * known(2).denominator, known(0).denominator * known(3).denominator * known(2).numerator);
    crossStep = `${known(0).display} × ${known(3).display} = x × ${known(2).display}`;
    divisionStep = `x = (${known(0).display} × ${known(3).display}) ÷ ${known(2).display}`;
  } else if (unknownIndex === 2) {
    numerator = normalize(known(0).numerator * known(3).numerator * known(1).denominator, known(0).denominator * known(3).denominator * known(1).numerator);
    crossStep = `${known(1).display} × x = ${known(0).display} × ${known(3).display}`;
    divisionStep = `x = (${known(0).display} × ${known(3).display}) ÷ ${known(1).display}`;
  } else {
    if (known(0).numerator === ZERO) throw new Error('This proportion has no single valid value for D because A is zero.');
    numerator = normalize(known(1).numerator * known(2).numerator * known(0).denominator, known(1).denominator * known(2).denominator * known(0).numerator);
    crossStep = `${known(0).display} × x = ${known(1).display} × ${known(2).display}`;
    divisionStep = `x = (${known(1).display} × ${known(2).display}) ÷ ${known(0).display}`;
  }
  if ((unknownIndex === 1 || unknownIndex === 3) && numerator.numerator === ZERO) throw new Error('The missing denominator would be zero, so this proportion is invalid.');
  const answer = displayRational(numerator);
  const equationValues = inputs.map((input, index) => unknowns[index] ? 'x' : (values[index] as ParsedNumber).display);
  return {
    answer: `x = ${answer}`,
    equation: `${equationValues[0]} : ${equationValues[1]} = ${equationValues[2]} : ${equationValues[3]}`,
    steps: ['Use A × D = B × C.', crossStep, divisionStep, `x = ${answer}`],
  };
}
