export const MONEY_GAME_ID = 'money-match';
export const MONEY_CURRENCY_STORAGE_KEY = 'zalea-money-match-currency-v1';

export const moneyCurrencyCodes = ['MYR', 'USD'] as const;
export const moneyModes = ['intro', 'full'] as const;
export const moneyMechanics = ['count', 'match', 'pay', 'change'] as const;
export type MoneyCurrencyCode = typeof moneyCurrencyCodes[number];
export type MoneyMode = typeof moneyModes[number];
export type MoneyMechanic = typeof moneyMechanics[number];
export type MoneyPieceKind = 'coin' | 'banknote';

export type MoneyVisual = {
  shape: 'round' | 'scalloped' | 'note';
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  background: string;
  foreground: string;
  pattern: 'dots' | 'lines' | 'rings' | 'waves' | 'grid' | 'stars';
};

export type MoneyDenomination = {
  id: string;
  value: number;
  kind: MoneyPieceKind;
  shortLabel: string;
  accessibleLabel: string;
  educational: boolean;
  visual: MoneyVisual;
};

export type MoneyCurrencyConfig = {
  code: MoneyCurrencyCode;
  displayName: string;
  symbol: string;
  minorUnitsPerMajor: number;
  minorUnitDigits: number;
  majorUnit: { singular: string; plural: string };
  minorUnit: { singular: string; plural: string };
  smallestExerciseIncrement: number;
  cashGuidance: string;
  denominations: readonly MoneyDenomination[];
};

const coin = (id: string, value: number, shortLabel: string, accessibleLabel: string, visual: MoneyVisual, educational = true): MoneyDenomination => ({ id, value, shortLabel, accessibleLabel, kind: 'coin', educational, visual });
const note = (id: string, value: number, shortLabel: string, accessibleLabel: string, visual: MoneyVisual, educational: boolean): MoneyDenomination => ({ id, value, shortLabel, accessibleLabel, kind: 'banknote', educational, visual });

const coinVisuals: readonly MoneyVisual[] = [
  { shape: 'round', size: 'xs', background: '#e2e8f0', foreground: '#334155', pattern: 'rings' },
  { shape: 'round', size: 'sm', background: '#fde68a', foreground: '#78350f', pattern: 'dots' },
  { shape: 'scalloped', size: 'md', background: '#d9f99d', foreground: '#365314', pattern: 'lines' },
  { shape: 'round', size: 'lg', background: '#fed7aa', foreground: '#7c2d12', pattern: 'waves' },
] as const;
const noteVisuals: readonly MoneyVisual[] = [
  { shape: 'note', size: 'sm', background: '#dbeafe', foreground: '#1e3a8a', pattern: 'waves' },
  { shape: 'note', size: 'md', background: '#dcfce7', foreground: '#14532d', pattern: 'grid' },
  { shape: 'note', size: 'lg', background: '#fee2e2', foreground: '#7f1d1d', pattern: 'stars' },
  { shape: 'note', size: 'lg', background: '#ffedd5', foreground: '#7c2d12', pattern: 'lines' },
  { shape: 'note', size: 'xl', background: '#cffafe', foreground: '#164e63', pattern: 'dots' },
  { shape: 'note', size: 'xl', background: '#f3e8ff', foreground: '#581c87', pattern: 'rings' },
] as const;

export const moneyCurrencies: Readonly<Record<MoneyCurrencyCode, MoneyCurrencyConfig>> = {
  MYR: {
    code: 'MYR', displayName: 'Malaysian Ringgit', symbol: 'RM', minorUnitsPerMajor: 100, minorUnitDigits: 2,
    majorUnit: { singular: 'ringgit', plural: 'ringgit' }, minorUnit: { singular: 'sen', plural: 'sen' },
    smallestExerciseIncrement: 5,
    cashGuidance: 'Game amounts use valid five-sen increments. Malaysia applies a nearest-five-sen rounding mechanism to over-the-counter totals.',
    denominations: [
      coin('myr-5', 5, '5 sen', '5 sen coin', coinVisuals[0]),
      coin('myr-10', 10, '10 sen', '10 sen coin', coinVisuals[1]),
      coin('myr-20', 20, '20 sen', '20 sen coin', coinVisuals[2]),
      coin('myr-50', 50, '50 sen', '50 sen coin', coinVisuals[3]),
      note('myr-100', 100, 'RM1', '1 ringgit banknote', noteVisuals[0], true),
      note('myr-500', 500, 'RM5', '5 ringgit banknote', noteVisuals[1], true),
      note('myr-1000', 1000, 'RM10', '10 ringgit banknote', noteVisuals[2], true),
      note('myr-2000', 2000, 'RM20', '20 ringgit banknote', noteVisuals[3], false),
      note('myr-5000', 5000, 'RM50', '50 ringgit banknote', noteVisuals[4], false),
      note('myr-10000', 10000, 'RM100', '100 ringgit banknote', noteVisuals[5], false),
    ],
  },
  USD: {
    code: 'USD', displayName: 'US Dollar', symbol: '$', minorUnitsPerMajor: 100, minorUnitDigits: 2,
    majorUnit: { singular: 'dollar', plural: 'dollars' }, minorUnit: { singular: 'cent', plural: 'cents' },
    smallestExerciseIncrement: 5,
    cashGuidance: 'This game uses five-cent increments for consistent exact-payment practice. It does not claim that every US cash transaction must be rounded.',
    denominations: [
      coin('usd-1', 1, '1¢', '1 cent penny', coinVisuals[0], false),
      coin('usd-5', 5, '5¢', '5 cent nickel', coinVisuals[1]),
      coin('usd-10', 10, '10¢', '10 cent dime', coinVisuals[2]),
      coin('usd-25', 25, '25¢', '25 cent quarter', coinVisuals[3]),
      note('usd-100', 100, '$1', '1 dollar banknote', noteVisuals[0], true),
      note('usd-500', 500, '$5', '5 dollar banknote', noteVisuals[1], true),
      note('usd-1000', 1000, '$10', '10 dollar banknote', noteVisuals[2], true),
      note('usd-2000', 2000, '$20', '20 dollar banknote', noteVisuals[3], false),
      note('usd-5000', 5000, '$50', '50 dollar banknote', noteVisuals[4], false),
      note('usd-10000', 10000, '$100', '100 dollar banknote', noteVisuals[5], false),
    ],
  },
};

export const moneyMechanicLabels: Record<MoneyMechanic, string> = {
  count: 'Count the Money', match: 'Match the Price', pay: 'Pay the Exact Amount', change: 'Find the Change',
};

export type MoneyChoice = { id: string; amount: number; denominationIds: readonly string[] };
export type MoneyChallenge = {
  id: string;
  currency: MoneyCurrencyCode;
  mechanic: MoneyMechanic;
  interaction: 'choice' | 'payment';
  item: string;
  prompt: string;
  instruction: string;
  displayMoney: readonly string[];
  price: number | null;
  paid: number | null;
  answerAmount: number;
  choices: readonly MoneyChoice[];
  correctChoiceId: string | null;
  explanation: string;
};

const items = ['notebook', 'pencil set', 'fruit cup', 'bus ticket', 'craft paper', 'water bottle', 'bookmark', 'snack box', 'plant pot', 'puzzle book'] as const;
const targetMultipliers = [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 35, 40, 50, 100, 110, 150, 200] as const;
const changePaid = [100, 100, 100, 100, 200, 200, 200, 200, 500, 500, 500, 500, 1000, 1000, 1000, 1000, 1500, 1500, 2000, 2000] as const;
const changeAmounts = [5, 10, 15, 25, 5, 20, 50, 75, 10, 25, 100, 150, 25, 50, 200, 250, 100, 300, 250, 500] as const;

export function getMoneyCurrency(code: MoneyCurrencyCode) { return moneyCurrencies[code]; }
export function getEducationalDenominations(code: MoneyCurrencyCode) { return moneyCurrencies[code].denominations.filter(denomination => denomination.educational); }
export function getMoneyDenomination(code: MoneyCurrencyCode, id: string) { return moneyCurrencies[code].denominations.find(denomination => denomination.id === id); }

export function validateCurrencyConfig(config: MoneyCurrencyConfig) {
  const errors: string[] = [];
  if (!/^[A-Z]{3}$/.test(config.code)) errors.push('Invalid ISO code');
  if (!Number.isInteger(config.minorUnitsPerMajor) || config.minorUnitsPerMajor < 1) errors.push('Invalid minor-unit scale');
  if (!Number.isInteger(config.smallestExerciseIncrement) || config.smallestExerciseIncrement < 1) errors.push('Invalid cash increment');
  const ids = new Set<string>(); const values = new Set<number>();
  for (const denomination of config.denominations) {
    if (ids.has(denomination.id)) errors.push(`Duplicate denomination ID: ${denomination.id}`);
    if (values.has(denomination.value)) errors.push(`Duplicate denomination value: ${denomination.value}`);
    ids.add(denomination.id); values.add(denomination.value);
    if (!Number.isInteger(denomination.value) || denomination.value < 1) errors.push(`Invalid denomination: ${denomination.id}`);
    if (!denomination.shortLabel || !denomination.accessibleLabel) errors.push(`Missing denomination label: ${denomination.id}`);
  }
  if (!config.denominations.some(item => item.educational && item.value === config.smallestExerciseIncrement)) errors.push('Smallest increment is not playable');
  return errors;
}

function plural(value: number, units: { singular: string; plural: string }) { return value === 1 ? units.singular : units.plural; }
export function formatMoney(amount: number, code: MoneyCurrencyCode) {
  if (!Number.isInteger(amount) || amount < 0) throw new Error('Money amounts must be non-negative integer minor units.');
  const config = moneyCurrencies[code];
  const major = Math.floor(amount / config.minorUnitsPerMajor);
  const minor = amount % config.minorUnitsPerMajor;
  return `${config.symbol}${major.toLocaleString('en-US')}.${String(minor).padStart(config.minorUnitDigits, '0')}`;
}

export function formatAccessibleMoney(amount: number, code: MoneyCurrencyCode) {
  if (!Number.isInteger(amount) || amount < 0) throw new Error('Money amounts must be non-negative integer minor units.');
  const config = moneyCurrencies[code];
  const major = Math.floor(amount / config.minorUnitsPerMajor);
  const minor = amount % config.minorUnitsPerMajor;
  if (!major) return `${minor} ${plural(minor, config.minorUnit)}`;
  if (!minor) return `${major} ${plural(major, config.majorUnit)}`;
  return `${major} ${plural(major, config.majorUnit)} and ${minor} ${plural(minor, config.minorUnit)}`;
}

export function sumMoney(denominationIds: readonly string[], code: MoneyCurrencyCode) {
  return denominationIds.reduce((total, id) => {
    const denomination = getMoneyDenomination(code, id);
    if (!denomination) throw new Error(`Unknown ${code} denomination: ${id}`);
    return total + denomination.value;
  }, 0);
}

export function describeMoneyGroup(denominationIds: readonly string[], code: MoneyCurrencyCode) {
  const counts = new Map<string, number>();
  for (const id of denominationIds) counts.set(id, (counts.get(id) ?? 0) + 1);
  return Array.from(counts.entries()).map(([id, count]) => {
    const denomination = getMoneyDenomination(code, id)!;
    return `${count} × ${denomination.accessibleLabel}`;
  }).join(', ');
}

export function isValidExerciseAmount(amount: number, code: MoneyCurrencyCode) {
  const config = moneyCurrencies[code];
  return Number.isInteger(amount) && amount > 0 && amount % config.smallestExerciseIncrement === 0;
}

export function isExactPayment(denominationIds: readonly string[], target: number, code: MoneyCurrencyCode) {
  return isValidExerciseAmount(target, code) && sumMoney(denominationIds, code) === target;
}

export function canPayExact(target: number, code: MoneyCurrencyCode) {
  if (!isValidExerciseAmount(target, code)) return false;
  const possible = Array.from({ length: target + 1 }, () => false); possible[0] = true;
  for (let amount = 1; amount <= target; amount++) possible[amount] = getEducationalDenominations(code).some(denomination => amount >= denomination.value && possible[amount - denomination.value]);
  return possible[target];
}

function seededRandom(seed: string | number) {
  let value = 2166136261;
  for (const character of String(seed)) value = Math.imul(value ^ character.charCodeAt(0), 16777619);
  return () => { value += 0x6D2B79F5; let number = value; number = Math.imul(number ^ number >>> 15, number | 1); number ^= number + Math.imul(number ^ number >>> 7, number | 61); return ((number ^ number >>> 14) >>> 0) / 4294967296; };
}

function shuffled<T>(items: readonly T[], random: () => number) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index--) { const other = Math.floor(random() * (index + 1)); [result[index], result[other]] = [result[other], result[index]]; }
  return result;
}

export function makeMoneyCombination(amount: number, code: MoneyCurrencyCode, variant = 0) {
  if (!canPayExact(amount, code)) throw new Error(`${formatMoney(amount, code)} cannot be built from the educational denominations.`);
  const denominations = [...getEducationalDenominations(code)].sort((a, b) => b.value - a.value);
  const smallestFirst = [...denominations].sort((a, b) => a.value - b.value);
  let remaining = amount; const result: string[] = [];
  if (variant % 3) {
    const starter = smallestFirst[Math.min(variant % 3 - 1, smallestFirst.length - 1)];
    if (starter.value <= remaining) { result.push(starter.id); remaining -= starter.value; }
  }
  while (remaining > 0) {
    const denomination = denominations.find(item => item.value <= remaining);
    if (!denomination) throw new Error(`No exact denomination for ${remaining} ${code} minor units.`);
    result.push(denomination.id); remaining -= denomination.value;
  }
  if (result.length <= 8) return result;
  remaining = amount; result.length = 0;
  while (remaining > 0) {
    const denomination = denominations.find(item => item.value <= remaining)!;
    result.push(denomination.id); remaining -= denomination.value;
  }
  return result;
}

function amountChoices(answer: number, code: MoneyCurrencyCode, seed: number) {
  const step = moneyCurrencies[code].smallestExerciseIncrement;
  const offsets = [step, -step, step * 2, -step * 2, step * 5, -step * 5, step * 10];
  const amounts = [answer, ...offsets.map(offset => answer + offset)].filter((amount, index, all) => amount > 0 && all.indexOf(amount) === index).slice(0, 4);
  return shuffled(amounts.map((amount, index) => ({ id: `amount-${amount}`, amount, denominationIds: makeMoneyCombination(amount, code, seed + index) })), seededRandom(`${code}-${seed}-${answer}`));
}

function createMoneyChallengeBank(code: MoneyCurrencyCode): readonly MoneyChallenge[] {
  const config = moneyCurrencies[code]; const targets = targetMultipliers.map(value => value * config.smallestExerciseIncrement);
  const count = targets.map((answer, index): MoneyChallenge => {
    const displayMoney = makeMoneyCombination(answer, code, index);
    return { id: `${code.toLowerCase()}-count-${index + 1}`, currency: code, mechanic: 'count', interaction: 'choice', item: items[index % items.length], prompt: 'How much money is shown?', instruction: 'Count each educational coin or banknote, then choose the total.', displayMoney, price: null, paid: null, answerAmount: answer, choices: amountChoices(answer, code, index), correctChoiceId: `amount-${answer}`, explanation: `Count every value once: ${describeMoneyGroup(displayMoney, code)}. Together they make ${formatMoney(answer, code)}.` };
  });
  const match = targets.map((answer, index): MoneyChallenge => {
    const choices = amountChoices(answer, code, index + 40);
    return { id: `${code.toLowerCase()}-match-${index + 1}`, currency: code, mechanic: 'match', interaction: 'choice', item: items[(index + 2) % items.length], prompt: `Which money group matches the price of ${formatMoney(answer, code)}?`, instruction: 'Count every group. Choose the one whose total equals the price.', displayMoney: [], price: answer, paid: null, answerAmount: answer, choices, correctChoiceId: `amount-${answer}`, explanation: `The matching group totals ${formatMoney(answer, code)}, exactly the same as the price.` };
  });
  const pay = targets.map((answer, index): MoneyChallenge => ({ id: `${code.toLowerCase()}-pay-${index + 1}`, currency: code, mechanic: 'pay', interaction: 'payment', item: items[(index + 4) % items.length], prompt: `Pay exactly ${formatMoney(answer, code)}.`, instruction: 'Add any supported denominations that make the exact total. More than one combination can be correct.', displayMoney: [], price: answer, paid: null, answerAmount: answer, choices: [], correctChoiceId: null, explanation: `Any selection totalling ${formatMoney(answer, code)} is correct. This selection is checked by its total, not against one preset combination.` }));
  const change = changePaid.map((paid, index): MoneyChallenge => {
    const answer = changeAmounts[index]; const price = paid - answer; const displayMoney = makeMoneyCombination(paid, code, index + 80);
    return { id: `${code.toLowerCase()}-change-${index + 1}`, currency: code, mechanic: 'change', interaction: 'choice', item: items[(index + 6) % items.length], prompt: `The ${items[(index + 6) % items.length]} costs ${formatMoney(price, code)}. You pay ${formatMoney(paid, code)}. What is the change?`, instruction: 'Subtract the price from the amount paid, then choose the change.', displayMoney, price, paid, answerAmount: answer, choices: amountChoices(answer, code, index + 100), correctChoiceId: `amount-${answer}`, explanation: `${formatMoney(paid, code)} minus ${formatMoney(price, code)} equals ${formatMoney(answer, code)} change.` };
  });
  return [...count, ...match, ...pay, ...change];
}

export const moneyChallengeBanks: Readonly<Record<MoneyCurrencyCode, readonly MoneyChallenge[]>> = {
  MYR: createMoneyChallengeBank('MYR'), USD: createMoneyChallengeBank('USD'),
};

const sessionMechanics: Record<MoneyMode, readonly MoneyMechanic[]> = {
  intro: ['count', 'match', 'pay', 'count', 'match', 'pay', 'count', 'match', 'pay', 'count'],
  full: ['count', 'match', 'pay', 'count', 'match', 'change', 'pay', 'count', 'match', 'change'],
};

export function generateMoneySession(seed: string | number, code: MoneyCurrencyCode, mode: MoneyMode) {
  const random = seededRandom(`${code}-${mode}-${seed}`); const used = new Set<string>();
  return sessionMechanics[mode].map(mechanic => {
    const pool = shuffled(moneyChallengeBanks[code].filter(challenge => challenge.mechanic === mechanic && !used.has(challenge.id)), random);
    const challenge = pool[0]; used.add(challenge.id);
    return challenge.choices.length ? { ...challenge, choices: shuffled(challenge.choices, random) } : challenge;
  });
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;
function preferenceStorage(storage?: StorageLike) {
  if (storage) return storage;
  if (typeof window === 'undefined') return null;
  try { return window.localStorage; } catch { return null; }
}
export function readMoneyCurrencyPreference(storage?: StorageLike): MoneyCurrencyCode {
  const target = preferenceStorage(storage); if (!target) return 'MYR';
  try { const value = target.getItem(MONEY_CURRENCY_STORAGE_KEY); return moneyCurrencyCodes.includes(value as MoneyCurrencyCode) ? value as MoneyCurrencyCode : 'MYR'; } catch { return 'MYR'; }
}
export function saveMoneyCurrencyPreference(code: MoneyCurrencyCode, storage?: StorageLike) {
  const target = preferenceStorage(storage); if (!target || !moneyCurrencyCodes.includes(code)) return false;
  try { target.setItem(MONEY_CURRENCY_STORAGE_KEY, code); return true; } catch { return false; }
}
