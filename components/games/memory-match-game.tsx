'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import Link from 'next/link';
import { Check, Layers, RotateCcw, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLearningSession } from '@/hooks/use-learning-session';
import { trackEvent } from '@/lib/analytics';
import { createSessionId } from '@/lib/games/learning-journey';
import { createMemoryRound, hideMemoryMismatch, memoryCardLabel, memoryDifficulties, memoryScore, memorySymbols, MEMORY_GAME_ID, revealMemoryCard, type MemoryDifficulty, type MemoryRound, type MemorySymbol } from '@/lib/games/memory-match';

type RevealMode = 'standard' | 'long' | 'manual';
export const memoryRevealDelays: Record<RevealMode, number | null> = { standard: 4000, long: 8000, manual: null };
const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:ring-offset-2';
function focusWithoutMotion(element: HTMLElement | null) {
  element?.focus({ preventScroll: true }); element?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
}
export function MemoryMatchGame() {
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>('easy');
  const [revealMode, setRevealMode] = useState<RevealMode>('standard');
  const [round, setRound] = useState<MemoryRound | null>(null);
  const [message, setMessage] = useState('');
  const current = useRef<MemoryRound | null>(null);
  const completion = useRef<string | null>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const heading = useRef<HTMLHeadingElement>(null);
  const settingsHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const returnToSettings = useRef(false);
  const { startLearningSession, completeLearningSession, abandonLearningSession } = useLearningSession(MEMORY_GAME_ID, { trackAchievementEvents: false });
  const phase = round?.phase ?? 'settings';

  const hide = (id: string, userRequested = false) => {
    const before = current.current; if (!before) return;
    const next = hideMemoryMismatch(before, id); if (next === before) return;
    const last = before.open[1]; current.current = next; setRound(next);
    setMessage(`Both cards are face down again. ${next.matched.length / 2} of ${memoryDifficulties[next.difficulty].pairs} pairs found.`);
    // A timer never moves focus. Explicit Continue returns to the second card
    // so the learner can deliberately choose the next pair.
    if (userRequested) requestAnimationFrame(() => { if (current.current?.id === id) focusWithoutMotion(cards.current[last]); });
  };
  useEffect(() => {
    if (round?.phase !== 'mismatch' || memoryRevealDelays[revealMode] === null) return;
    const id = round.id;
    const timer = setTimeout(() => hide(id), memoryRevealDelays[revealMode]!);
    return () => clearTimeout(timer);
    // hide reads only the current round ref; an old callback cannot change a new board.
  }, [round?.phase, round?.id, revealMode]);
  useEffect(() => {
    if (phase === 'complete') focusWithoutMotion(resultsHeading.current);
    else if (phase === 'playing' && round?.attempts === 0 && round.open.length === 0) focusWithoutMotion(heading.current);
    else if (phase === 'settings' && returnToSettings.current) { focusWithoutMotion(settingsHeading.current); returnToSettings.current = false; }
  }, [phase, round?.id, round?.attempts, round?.open.length]);

  const start = () => {
    if (current.current && current.current.phase !== 'complete') return;
    abandonLearningSession(); const id = createSessionId();
    const next = createMemoryRound(difficulty, id); current.current = next; completion.current = null;
    cards.current = []; setRound(next); setMessage(`A new ${memoryDifficulties[difficulty].label} board is ready. Reveal two cards to find a pair.`);
    startLearningSession(); trackEvent('game_started', { game: MEMORY_GAME_ID, subject: 'logic', level: '1', difficulty });
  };
  const choose = (index: number) => {
    const before = current.current; if (!before) return;
    const next = revealMemoryCard(before, index); if (next === before) return;
    current.current = next; setRound(next);
    const symbol = memorySymbols.find(item => item.id === next.board[index].symbolId)!;
    if (next.phase === 'mismatch') {
      const first = memorySymbols.find(item => item.id === next.board[next.open[0]].symbolId)!;
      setMessage(`Not a match: ${first.label} and ${symbol.label}. ${memoryRevealDelays[revealMode] === null ? 'Choose Turn these cards back when you are ready.' : `They will turn back in ${memoryRevealDelays[revealMode]! / 1000} seconds. You can also turn them back yourself.`} ${next.matched.length / 2} pairs found.`);
    } else if (next.matched.length > before.matched.length) {
      const pairs = next.matched.length / 2, total = memoryDifficulties[next.difficulty].pairs;
      setMessage(next.phase === 'complete' ? `Board complete! All ${total} pairs found in ${next.attempts} attempts.` : `Match found: ${symbol.label}. ${pairs} of ${total} pairs found.`);
      if (next.phase === 'complete' && completion.current !== next.id) {
        completion.current = next.id; const score = memoryScore(next);
        completeLearningSession(score.correct, score.questions);
        trackEvent('game_completed', { game: MEMORY_GAME_ID, subject: 'logic', level: '1', difficulty: next.difficulty });
      }
    } else setMessage(`Card ${index + 1} revealed: ${symbol.label}. Choose another face-down card.`);
  };
  const settings = () => {
    abandonLearningSession(); current.current = null; setRound(null); setMessage('Choose a difficulty for your next board.'); returnToSettings.current = true;
  };
  const changeRevealMode = (mode: RevealMode) => {
    setRevealMode(mode);
    if (current.current?.phase === 'mismatch') setMessage(mode === 'manual'
      ? 'Cards will stay revealed. Choose Turn these cards back when you are ready.'
      : `Reveal time changed to ${memoryRevealDelays[mode]! / 1000} seconds. You can also choose Turn these cards back yourself.`);
  };
  const moveFocus = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = current.current?.board.length ?? 0;
    const shifts: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 4, ArrowUp: -4 };
    let next: number;
    if (event.key === 'Home') next = 0; else if (event.key === 'End') next = count - 1;
    else if (event.key in shifts) next = (index + shifts[event.key] + count) % count; else return;
    event.preventDefault(); focusWithoutMotion(cards.current[next]);
  };

  if (!round) return <section className="mx-auto max-w-3xl rounded-3xl border border-purple-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="memory-settings" data-memory-phase="settings">
    <Layers className="h-12 w-12 text-purple-800" aria-hidden="true" /><h2 id="memory-settings" ref={settingsHeading} tabIndex={-1} className="mt-4 scroll-mt-24 text-3xl font-bold outline-none">Find the matching pairs</h2>
    <p className="mt-4 text-lg leading-8">Turn over two cards. If their pictures match, they stay up. Find every pair at your own pace.</p>
    <fieldset className="mt-6"><legend className="font-bold">Choose your Level 1 board</legend><div className="mt-3 grid gap-3 sm:grid-cols-3">{Object.entries(memoryDifficulties).map(([value, mode]) => <button key={value} type="button" aria-pressed={difficulty === value} onClick={() => setDifficulty(value as MemoryDifficulty)} className={`min-h-20 rounded-xl border-2 p-4 text-left ${focusClass} ${difficulty === value ? 'border-purple-700 bg-purple-50' : 'border-purple-200 bg-white'}`}><strong className="block">{mode.label}</strong><span className="mt-1 block text-sm">{mode.pairs} pairs · {mode.pairs * 2} cards</span></button>)}</div></fieldset>
    <RevealSettings value={revealMode} onChange={changeRevealMode} />
    <Button onClick={start} className="mt-6 min-h-12 w-full bg-purple-800 hover:bg-purple-900 sm:w-auto">Start matching</Button>
    <p className="mt-4 text-sm leading-6 text-muted-foreground">No timer score or penalties. Use Tab or arrow keys to move between cards, then Enter or Space to reveal. You can keep unmatched cards up until you choose to continue.</p>
  </section>;

  const total = memoryDifficulties[round.difficulty].pairs, pairs = round.matched.length / 2, score = memoryScore(round);
  return <section className="mx-auto max-w-3xl min-w-0 rounded-3xl border border-purple-200 bg-white p-3 shadow-sm sm:p-7" aria-labelledby={round.phase === 'complete' ? 'memory-results' : 'memory-board-heading'} data-memory-phase={round.phase}>
    {round.phase === 'complete' ? <><Trophy className="h-10 w-10 text-purple-800" aria-hidden="true" /><h2 id="memory-results" ref={resultsHeading} tabIndex={-1} className="mt-3 scroll-mt-24 text-3xl font-bold outline-none">Every pair found!</h2><p className="mt-3 text-lg font-semibold">{pairs} pairs · {round.attempts} attempts · {memoryDifficulties[round.difficulty].label} · Level 1</p><p className="mt-2 leading-7">Match accuracy: {score.percentage}%. That means {score.correct} pairs found in {score.questions} two-card attempts. Finishing the board matters more than rushing.</p><p className="mt-2 text-sm leading-6 text-muted-foreground">Learning Journey records this accuracy, not a speed score. A board with mismatches does not automatically earn 100%.</p></>
      : <><h2 id="memory-board-heading" ref={heading} tabIndex={-1} className="scroll-mt-24 text-2xl font-bold outline-none">{memoryDifficulties[round.difficulty].label} board · Level 1</h2><div className="mt-3 flex flex-wrap justify-between gap-2 font-semibold"><p>{pairs} of {total} pairs found</p><p>Attempts: {round.attempts}</p></div><p id="memory-keyboard-help" className="mt-2 text-sm leading-6 text-muted-foreground">Reveal two cards. Tab or arrow keys move; Enter or Space reveals. Matched cards stay up.</p><RevealSettings value={revealMode} onChange={changeRevealMode} /></>}
    <ol className="mt-5 grid grid-cols-4 gap-2 sm:gap-3" aria-label={`Memory board: ${total} pairs`} aria-describedby={round.phase === 'complete' ? undefined : 'memory-keyboard-help'}>{round.board.map((card, index) => {
      const matched = round.matched.includes(index), faceUp = matched || round.open.includes(index);
      const disabled = round.phase !== 'playing' || matched || round.open.includes(index);
      const symbol = faceUp ? memorySymbols.find(item => item.id === card.symbolId)! : null;
      return <li key={card.id} className="min-w-0"><button ref={element => { cards.current[index] = element; }} type="button" data-card-index={index} aria-label={memoryCardLabel(round, index)} aria-pressed={faceUp} aria-disabled={disabled} onClick={() => choose(index)} onKeyDown={event => moveFocus(event, index)} className={`relative flex aspect-[4/5] min-h-16 w-full scroll-mt-24 flex-col items-center justify-center rounded-xl border-2 p-1 motion-safe:transition-colors ${focusClass} ${matched ? 'border-emerald-700 bg-emerald-50' : faceUp ? 'border-purple-700 bg-white' : 'border-purple-700 bg-purple-800 text-white hover:bg-purple-900'}`}>
        <span className={`absolute left-1.5 top-1 text-[10px] font-bold ${faceUp ? 'text-slate-600' : 'text-purple-100'}`} aria-hidden="true">{index + 1}</span>
        {symbol ? <MemoryPicture symbol={symbol} /> : <span className="text-3xl font-bold" aria-hidden="true">?</span>}
        {matched && <Check className="absolute bottom-1 right-1 h-3.5 w-3.5 text-emerald-800" aria-hidden="true" />}
      </button></li>;
    })}</ol>
    <p className="mt-4 min-h-12 rounded-xl bg-purple-50 p-3 text-sm font-semibold leading-6" role="status" aria-live="polite" aria-atomic="true">{message}</p>
    {round.phase !== 'complete' && <Button aria-disabled={round.phase !== 'mismatch'} onClick={() => hide(round.id, true)} className={`mt-3 min-h-12 w-full bg-purple-800 hover:bg-purple-900 sm:w-auto ${round.phase !== 'mismatch' ? 'opacity-50' : ''}`}>Turn these cards back</Button>}
    <div className="mt-5 flex flex-wrap gap-3">{round.phase === 'complete' && <Button onClick={start} className="min-h-12 bg-purple-800 hover:bg-purple-900"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />New board, same difficulty</Button>}<Button onClick={settings} variant="outline" className="h-auto min-h-12 whitespace-normal">{round.phase === 'complete' ? 'Change difficulty' : 'End board and choose again'}</Button></div>
    {round.phase === 'complete' && <nav aria-label="Continue learning" className="mt-5 flex flex-wrap gap-4"><Link href="/games/my-learning-journey" className={`inline-flex min-h-12 items-center rounded text-purple-800 underline ${focusClass}`}>My Learning Journey</Link><Link href="/games/logic/pattern-detective" className={`inline-flex min-h-12 items-center rounded text-purple-800 underline ${focusClass}`}>Play Pattern Detective</Link><Link href="/games/logic" className={`inline-flex min-h-12 items-center rounded text-purple-800 underline ${focusClass}`}>Logic &amp; Brain Games</Link></nav>}
  </section>;
}
function RevealSettings({ value, onChange }: { value: RevealMode; onChange: (value: RevealMode) => void }) {
  return <div className="mt-5"><label htmlFor="memory-reveal-mode" className="block text-sm font-semibold">When cards do not match</label><select id="memory-reveal-mode" value={value} onChange={event => onChange(event.target.value as RevealMode)} className={`mt-2 min-h-12 w-full rounded-lg border border-purple-200 bg-white px-3 text-base sm:max-w-sm ${focusClass}`}><option value="standard">Turn back after 4 seconds</option><option value="long">Give me 8 seconds</option><option value="manual">Wait until I choose to continue</option></select></div>;
}
export function MemoryPicture({ symbol }: { symbol: MemorySymbol }) {
  return <svg viewBox="0 0 48 48" className="h-10 w-10 max-w-full sm:h-14 sm:w-14" aria-hidden="true" focusable="false" fill="none" stroke={symbol.colour} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">{symbol.paths.map((path, index) => <path key={index} d={path} />)}</svg>;
}
