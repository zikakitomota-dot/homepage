'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Coins, RotateCcw, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLearningSession } from '@/hooks/use-learning-session';
import { trackEvent } from '@/lib/analytics';
import { createSessionId } from '@/lib/games/learning-journey';
import {
  describeMoneyGroup,
  formatAccessibleMoney,
  formatMoney,
  generateMoneySession,
  getEducationalDenominations,
  getMoneyCurrency,
  getMoneyDenomination,
  MONEY_CURRENCY_STORAGE_KEY,
  MONEY_GAME_ID,
  moneyCurrencyCodes,
  moneyMechanicLabels,
  moneyMechanics,
  readMoneyCurrencyPreference,
  saveMoneyCurrencyPreference,
  sumMoney,
  type MoneyChallenge,
  type MoneyCurrencyCode,
  type MoneyDenomination,
  type MoneyMode,
  type MoneyVisual,
} from '@/lib/games/money-match';

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2';
const baseEvent = { game: MONEY_GAME_ID, subject: 'life-skills', level: '1' };

export function MoneyMatchGame() {
  const [phase, setPhase] = useState<'settings' | 'playing' | 'results'>('settings');
  const [currency, setCurrency] = useState<MoneyCurrencyCode>('MYR');
  const [mode, setMode] = useState<MoneyMode>('intro');
  const [challenges, setChallenges] = useState<MoneyChallenge[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [payment, setPayment] = useState<string[]>([]);
  const [submittedPayment, setSubmittedPayment] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [settingsMessage, setSettingsMessage] = useState('Malaysian Ringgit is selected by default.');
  const running = useRef(false);
  const completed = useRef(false);
  const settingsHeading = useRef<HTMLHeadingElement>(null);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const { startLearningSession, completeLearningSession } = useLearningSession(MONEY_GAME_ID, { trackAchievementEvents: false });
  const challenge = challenges[index];
  const answered = selectedChoice !== null || submittedPayment !== null;
  const score = answers.filter(Boolean).length;
  const paymentTotal = challenge ? sumMoney(payment, challenge.currency) : 0;
  const correct = challenge ? challenge.interaction === 'payment'
    ? submittedPayment === challenge.answerAmount
    : selectedChoice === challenge.correctChoiceId : false;

  useEffect(() => {
    const saved = readMoneyCurrencyPreference(); setCurrency(saved);
    const onStorage = (event: StorageEvent) => {
      if (event.key === MONEY_CURRENCY_STORAGE_KEY && phase === 'settings' && moneyCurrencyCodes.includes(event.newValue as MoneyCurrencyCode)) {
        const next = event.newValue as MoneyCurrencyCode; setCurrency(next); setSettingsMessage(`${getMoneyCurrency(next).displayName} was selected in another tab.`);
      }
    };
    window.addEventListener('storage', onStorage); return () => window.removeEventListener('storage', onStorage);
  }, [phase]);

  useEffect(() => {
    const target = phase === 'settings' ? settingsHeading.current : phase === 'results' ? resultsHeading.current : answered ? nextButton.current : questionHeading.current;
    target?.focus({ preventScroll: true }); target?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [phase, index, answered]);

  const selectCurrency = (next: MoneyCurrencyCode) => {
    if (phase !== 'settings') return;
    setCurrency(next); saveMoneyCurrencyPreference(next); setSettingsMessage(`${getMoneyCurrency(next).displayName} selected and saved on this browser.`);
  };

  const start = () => {
    if (running.current) return;
    const session = generateMoneySession(createSessionId(), currency, mode);
    running.current = true; completed.current = false;
    setChallenges(session); setIndex(0); setAnswers([]); setSelectedChoice(null); setPayment([]); setSubmittedPayment(null); setAnnouncement(''); setPhase('playing');
    startLearningSession({ currency, mode });
    trackEvent('game_started', { ...baseEvent, mode });
  };

  const choose = (id: string) => {
    if (answered || challenge.interaction !== 'choice' || !challenge.choices.some(choice => choice.id === id)) return;
    setSelectedChoice(id); setAnswers(current => [...current, id === challenge.correctChoiceId]);
  };

  const addMoney = (denomination: MoneyDenomination) => {
    if (answered) return;
    setPayment(current => [...current, denomination.id]);
    setAnnouncement(`${denomination.accessibleLabel} added. New total ${formatAccessibleMoney(paymentTotal + denomination.value, challenge.currency)}.`);
  };

  const removeMoney = (denomination: MoneyDenomination) => {
    if (answered) return;
    const last = payment.lastIndexOf(denomination.id); if (last < 0) return;
    const next = payment.filter((_, indexValue) => indexValue !== last); setPayment(next);
    setAnnouncement(`${denomination.accessibleLabel} removed. New total ${formatAccessibleMoney(sumMoney(next, challenge.currency), challenge.currency)}.`);
  };

  const resetPayment = () => {
    if (answered || !payment.length) return;
    setPayment([]); setAnnouncement('Selected money cleared. Current total is zero.');
  };

  const submitPayment = () => {
    if (answered || challenge.interaction !== 'payment' || !payment.length) return;
    setSubmittedPayment(paymentTotal); setAnswers(current => [...current, paymentTotal === challenge.answerAmount]);
  };

  const next = () => {
    if (!answered || completed.current) return;
    if (index === 9) {
      completed.current = true; running.current = false;
      completeLearningSession(score, 10); setPhase('results');
      trackEvent('game_completed', { ...baseEvent, mode });
      return;
    }
    setSelectedChoice(null); setPayment([]); setSubmittedPayment(null); setAnnouncement(''); setIndex(current => current + 1);
  };

  const returnToSettings = () => {
    if (running.current) return;
    setCurrency(readMoneyCurrencyPreference()); setPhase('settings'); setSettingsMessage('Choose the currency and starting point for the next session.');
  };

  if (phase === 'settings') return <section className="mx-auto max-w-3xl rounded-3xl border border-orange-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="money-settings" data-money-phase="settings">
    <Coins className="h-12 w-12 text-orange-800" aria-hidden="true" /><p className="mt-4 text-sm font-bold text-orange-800">Life Skills · Level 1</p>
    <h2 id="money-settings" ref={settingsHeading} tabIndex={-1} className="mt-2 scroll-mt-24 text-3xl font-bold outline-none">Choose your Money Match session</h2>
    <p className="mt-4 leading-7">Recognise, count and use simplified educational money illustrations. There is no timer, exchange-rate conversion or penalty.</p>
    <fieldset className="mt-6"><legend className="font-bold">Choose a currency</legend><p className="mt-1 text-sm leading-6 text-muted-foreground">Your explicit choice is saved only on this browser. It is not inferred from your location.</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{moneyCurrencyCodes.map(code => {
      const config = getMoneyCurrency(code); return <button key={code} type="button" aria-pressed={currency === code} onClick={() => selectCurrency(code)} className={`min-h-24 rounded-xl border-2 p-4 text-left ${focusClass} ${currency === code ? 'border-orange-700 bg-orange-50' : 'border-orange-200 bg-white'}`}><strong className="block">{config.displayName}</strong><span className="mt-1 block text-sm leading-6">{code} · {config.symbol} · {config.smallestExerciseIncrement} {config.minorUnit.plural} steps</span></button>;
    })}</div></fieldset>
    <p className="mt-3 min-h-6 text-sm font-semibold text-orange-900" role="status" aria-live="polite">{settingsMessage}</p>
    <fieldset className="mt-6"><legend className="font-bold">Choose a Level 1 starting point</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">
      <ModeButton selected={mode === 'intro'} onClick={() => setMode('intro')} title="Start with the basics" description="Recognise and count money, match prices and build exact payments." />
      <ModeButton selected={mode === 'full'} onClick={() => setMode('full')} title="Full Level 1 practice" description="Use all four activities, including simple change calculations." />
    </div></fieldset>
    <div className="mt-6 rounded-2xl bg-orange-50 p-4"><h3 className="font-bold">Educational illustrations</h3><p className="mt-2 text-sm leading-6">Values, sizes, shapes and patterns help distinguish each piece. These original drawings are learning aids, not reproductions of official currency.</p><div className="mt-4 flex flex-wrap items-end gap-3">{getEducationalDenominations(currency).slice(0, 5).map(denomination => <MoneyPiece key={denomination.id} denomination={denomination} currency={currency} />)}</div></div>
    <Button onClick={start} className="mt-6 min-h-12 w-full bg-orange-800 hover:bg-orange-900 sm:w-auto">Start Money Match<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
  </section>;

  if (phase === 'results') {
    const practised = moneyMechanics.filter(mechanic => challenges.some(item => item.mechanic === mechanic));
    return <section className="mx-auto max-w-3xl rounded-3xl border border-orange-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="money-results" data-money-phase="results">
      <Trophy className="h-12 w-12 text-orange-800" aria-hidden="true" /><h2 id="money-results" ref={resultsHeading} tabIndex={-1} className="mt-4 scroll-mt-24 text-3xl font-bold outline-none">Money Match session complete</h2>
      <p className="mt-4 text-2xl font-bold">You solved {score} of 10 money challenges.</p><p className="mt-3 leading-7">{getMoneyCurrency(currency).displayName} · {mode === 'intro' ? 'Start with the basics' : 'Full Level 1 practice'}. Your score is saved privately in My Learning Journey.</p>
      <h3 className="mt-6 text-xl font-bold">Skills you practised</h3><ul className="mt-3 grid gap-2 sm:grid-cols-2">{practised.map(mechanic => <li key={mechanic} className="rounded-lg bg-orange-50 p-3">{moneyMechanicLabels[mechanic]}</li>)}</ul>
      <div className="mt-6 flex flex-wrap gap-3"><Button onClick={start} className="min-h-12 bg-orange-800 hover:bg-orange-900"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />New session, same settings</Button><Button onClick={returnToSettings} variant="outline" className="min-h-12">Change currency or mode</Button></div>
      <nav aria-label="Continue learning" className="mt-5 flex flex-wrap gap-4"><Link href="/games/my-learning-journey" className={`inline-flex min-h-12 items-center rounded text-orange-800 underline ${focusClass}`}>My Learning Journey</Link><Link href="/games/life-skills/time-detective" className={`inline-flex min-h-12 items-center rounded text-orange-800 underline ${focusClass}`}>Play Time Detective</Link><Link href="/games/life-skills" className={`inline-flex min-h-12 items-center rounded text-orange-800 underline ${focusClass}`}>Life Skills Games</Link></nav>
    </section>;
  }

  return <section className="mx-auto max-w-3xl min-w-0 rounded-3xl border border-orange-200 bg-white p-4 shadow-sm sm:p-7" aria-labelledby="money-question" data-money-phase="playing" data-challenge-id={challenge.id} data-mechanic={challenge.mechanic} data-currency={challenge.currency} data-mode={mode}>
    <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold"><span>Challenge {index + 1} of 10</span><span>Score: {score}</span></div>
    <div role="progressbar" aria-label={`Challenge ${index + 1} of 10`} aria-valuemin={0} aria-valuemax={10} aria-valuenow={index + 1} className="mt-3 h-3 overflow-hidden rounded-full bg-orange-100"><div className="h-full rounded-full bg-orange-700 motion-safe:transition-[width]" style={{ width: `${(index + 1) * 10}%` }} /></div>
    <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold"><span className="rounded-full bg-orange-100 px-3 py-1 text-orange-900">{moneyMechanicLabels[challenge.mechanic]}</span><span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">{challenge.currency}</span></div>
    <h2 id="money-question" ref={questionHeading} tabIndex={-1} className="mt-3 scroll-mt-24 text-2xl font-bold outline-none sm:text-3xl">{challenge.prompt}</h2><p id="money-instruction" className="mt-3 leading-7">{challenge.instruction}</p>

    {(challenge.mechanic === 'count' || challenge.mechanic === 'change') && <div className="mt-5 rounded-2xl border border-orange-200 bg-orange-50/40 p-4"><p className="mb-3 text-sm font-bold text-orange-900">{challenge.mechanic === 'change' ? `Money paid: ${formatMoney(challenge.paid!, challenge.currency)}` : 'Money to count'}</p><MoneyGroup denominationIds={challenge.displayMoney} currency={challenge.currency} /></div>}
    {challenge.interaction === 'choice' && <fieldset className="mt-6" aria-describedby="money-instruction"><legend className="font-semibold">{challenge.mechanic === 'match' ? 'Choose the matching money group' : 'Choose the amount'}</legend><div className={`mt-3 grid gap-3 ${challenge.mechanic === 'match' ? 'sm:grid-cols-2' : 'grid-cols-2'}`}>{challenge.choices.map((choice, choiceIndex) => {
      const right = answered && choice.id === challenge.correctChoiceId; const wrong = selectedChoice === choice.id && !right;
      return <button key={choice.id} type="button" data-choice-id={choice.id} disabled={answered} aria-pressed={selectedChoice === choice.id} aria-label={challenge.mechanic === 'match' ? `Option ${choiceIndex + 1}: ${describeMoneyGroup(choice.denominationIds, challenge.currency)}` : `Choose ${formatAccessibleMoney(choice.amount, challenge.currency)}`} onClick={() => choose(choice.id)} className={`min-h-20 min-w-0 rounded-xl border-2 p-3 ${focusClass} disabled:opacity-100 ${right ? 'border-emerald-700 bg-emerald-50' : wrong ? 'border-orange-700 bg-orange-50' : 'border-orange-200 bg-white hover:border-orange-700'}`}>{challenge.mechanic === 'match' ? <MoneyGroup denominationIds={choice.denominationIds} currency={challenge.currency} decorative compact /> : <span className="text-xl font-bold sm:text-2xl">{formatMoney(choice.amount, challenge.currency)}</span>}{right && <span className="mt-2 block text-sm font-bold"><Check className="mr-1 inline h-4 w-4" aria-hidden="true" />Correct</span>}{wrong && <span className="mt-2 block text-sm font-bold"><X className="mr-1 inline h-4 w-4" aria-hidden="true" />Your choice</span>}</button>;
    })}</div></fieldset>}
    {challenge.interaction === 'payment' && <PaymentBuilder currency={challenge.currency} target={challenge.answerAmount} payment={payment} total={paymentTotal} answered={answered} announcement={announcement} onAdd={addMoney} onRemove={removeMoney} onReset={resetPayment} onSubmit={submitPayment} />}
    <div role="status" aria-live="polite" aria-atomic="true" className="mt-5">{answered && <div className={`rounded-xl border p-4 ${correct ? 'border-emerald-300 bg-emerald-50' : 'border-orange-300 bg-orange-50'}`}><p className="font-bold">{correct ? 'That money matches!' : 'Good try. Check each value.'}</p>{submittedPayment !== null && !correct && <p className="mt-2">Your payment total was {formatMoney(submittedPayment, challenge.currency)}.</p>}<p className="mt-2 leading-7">{challenge.explanation}</p></div>}</div>
    {answered && <Button ref={nextButton} onClick={next} className="mt-4 min-h-12 w-full scroll-mt-24 bg-orange-800 hover:bg-orange-900 sm:w-auto">{index === 9 ? 'See results' : 'Next challenge'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>}
  </section>;
}

function ModeButton({ selected, onClick, title, description }: { selected: boolean; onClick: () => void; title: string; description: string }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`min-h-24 rounded-xl border-2 p-4 text-left ${focusClass} ${selected ? 'border-orange-700 bg-orange-50' : 'border-orange-200 bg-white'}`}><strong className="block">{title}</strong><span className="mt-1 block text-sm leading-6">{description}</span></button>;
}

function PaymentBuilder({ currency, target, payment, total, answered, announcement, onAdd, onRemove, onReset, onSubmit }: { currency: MoneyCurrencyCode; target: number; payment: readonly string[]; total: number; answered: boolean; announcement: string; onAdd: (denomination: MoneyDenomination) => void; onRemove: (denomination: MoneyDenomination) => void; onReset: () => void; onSubmit: () => void }) {
  const denominations = getEducationalDenominations(currency);
  const selected = useMemo(() => denominations.map(denomination => ({ denomination, count: payment.filter(id => id === denomination.id).length })).filter(item => item.count), [denominations, payment]);
  return <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50/40 p-4 sm:p-6"><h3 className="font-bold">Build a payment of {formatMoney(target, currency)}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Choose any combination that reaches the exact total. Activate a denomination more than once to add more than one.</p>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{denominations.map(denomination => <button key={denomination.id} type="button" data-denomination-id={denomination.id} disabled={answered} onClick={() => onAdd(denomination)} aria-label={`Add ${denomination.accessibleLabel}`} className={`flex min-h-28 min-w-0 flex-col items-center justify-center rounded-xl border-2 border-orange-200 bg-white p-2 hover:border-orange-700 disabled:opacity-60 ${focusClass}`}><MoneyPiece denomination={denomination} currency={currency} decorative /><span className="mt-2 text-xs font-bold">Add {denomination.shortLabel}</span></button>)}</div>
    <div className="mt-5 rounded-xl bg-white p-4"><div className="flex flex-wrap items-baseline justify-between gap-2"><h4 className="font-bold">Selected money</h4><p className="text-xl font-bold" data-payment-total={total}>{formatMoney(total, currency)}</p></div>{selected.length ? <ul className="mt-3 grid gap-2 sm:grid-cols-2">{selected.map(({ denomination, count }) => <li key={denomination.id} className="flex min-w-0 items-center justify-between gap-2 rounded-lg border p-2"><span className="min-w-0 text-sm font-semibold">{count} × {denomination.shortLabel}</span><Button type="button" variant="outline" size="sm" disabled={answered} data-remove-denomination={denomination.id} onClick={() => onRemove(denomination)} aria-label={`Remove one ${denomination.accessibleLabel}`} className="min-h-10 shrink-0">Remove one</Button></li>)}</ul> : <p className="mt-3 text-sm text-muted-foreground">No money selected yet.</p>}</div>
    <p className="mt-3 min-h-6 text-sm font-semibold" aria-live="polite" aria-atomic="true">{announcement}</p><div className="mt-3 flex flex-wrap gap-3"><Button type="button" onClick={onSubmit} disabled={answered || !payment.length} className="min-h-12 bg-orange-800 hover:bg-orange-900">Check payment</Button><Button type="button" variant="outline" onClick={onReset} disabled={answered || !payment.length} className="min-h-12">Reset selected money</Button></div>
  </div>;
}

function patternImage(pattern: MoneyVisual['pattern'], colour: string) {
  if (pattern === 'dots') return `radial-gradient(${colour}55 1px, transparent 1px)`;
  if (pattern === 'lines') return `repeating-linear-gradient(45deg, transparent 0 6px, ${colour}33 6px 8px)`;
  if (pattern === 'rings') return `radial-gradient(circle, transparent 35%, ${colour}33 36% 42%, transparent 43%)`;
  if (pattern === 'waves') return `repeating-radial-gradient(ellipse at 0 50%, transparent 0 8px, ${colour}33 9px 11px)`;
  if (pattern === 'grid') return `linear-gradient(${colour}22 1px, transparent 1px), linear-gradient(90deg, ${colour}22 1px, transparent 1px)`;
  return `radial-gradient(${colour}44 1.5px, transparent 2px)`;
}

export function MoneyPiece({ denomination, currency, decorative = false }: { denomination: MoneyDenomination; currency: MoneyCurrencyCode; decorative?: boolean }) {
  const coinSizes = { xs: 'h-14 w-14', sm: 'h-16 w-16', md: 'h-[4.5rem] w-[4.5rem]', lg: 'h-20 w-20', xl: 'h-20 w-20' } as const;
  const noteSizes = { xs: 'h-12 w-20', sm: 'h-14 w-24', md: 'h-16 w-28', lg: 'h-[4.5rem] w-32', xl: 'h-20 w-36' } as const;
  const rounded = denomination.visual.shape === 'round' ? 'rounded-full' : denomination.visual.shape === 'scalloped' ? 'rounded-[38%]' : 'rounded-lg';
  return <span data-money-piece={denomination.id} role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : denomination.accessibleLabel} className={`relative flex shrink-0 flex-col items-center justify-center overflow-hidden border-2 border-current p-1 text-center shadow-sm ${rounded} ${denomination.kind === 'coin' ? coinSizes[denomination.visual.size] : noteSizes[denomination.visual.size]}`} style={{ backgroundColor: denomination.visual.background, color: denomination.visual.foreground, backgroundImage: patternImage(denomination.visual.pattern, denomination.visual.foreground), backgroundSize: denomination.visual.pattern === 'grid' ? '12px 12px' : '18px 18px' }}><span className="relative z-10 rounded bg-white/75 px-1 text-sm font-black leading-tight sm:text-base">{denomination.shortLabel}</span><span className="relative z-10 mt-0.5 text-[9px] font-bold uppercase tracking-wide">{currency} · EDU</span></span>;
}

function MoneyGroup({ denominationIds, currency, decorative = false, compact = false }: { denominationIds: readonly string[]; currency: MoneyCurrencyCode; decorative?: boolean; compact?: boolean }) {
  const label = describeMoneyGroup(denominationIds, currency);
  return <div role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : `Educational money group: ${label}`} className={`flex min-w-0 flex-wrap items-end justify-center ${compact ? 'gap-1.5' : 'gap-3'}`}>{denominationIds.map((id, index) => <MoneyPiece key={`${id}-${index}`} denomination={getMoneyDenomination(currency, id)!} currency={currency} decorative />)}</div>;
}
