'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Brain, Check, RotateCcw, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLearningSession } from '@/hooks/use-learning-session';
import { trackEvent } from '@/lib/analytics';
import { createSessionId } from '@/lib/games/learning-journey';
import { describeToken, generatePatternSession, PATTERN_GAME_ID, typeLabels, type PatternPuzzle, type Token } from '@/lib/games/pattern-detective';

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-700 focus-visible:ring-offset-2';
const eventDimensions = { game: PATTERN_GAME_ID, subject: 'logic', level: '1' };

export function PatternDetectiveGame() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [puzzles, setPuzzles] = useState<PatternPuzzle[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const answered = useRef(false); const finished = useRef(false); const running = useRef(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultHeading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const { startLearningSession, completeLearningSession } = useLearningSession(PATTERN_GAME_ID, { trackAchievementEvents: false });
  const question = puzzles[index]; const selected = answers[index] ?? null;
  const score = answers.reduce((sum, answer, position) => sum + Number(answer === puzzles[position].correctChoiceId), 0);
  useEffect(() => {
    let target: HTMLElement | null = null;
    if (phase === 'playing') {
      target = selected ? nextButton.current : questionHeading.current;
    } else if (phase === 'results') target = resultHeading.current;
    // Explicit instant scrolling avoids inheriting the site's smooth-scroll
    // behaviour when moving keyboard focus, including reduced-motion mode.
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [phase, index, selected]);
  const start = () => {
    if (running.current) return;
    running.current = true;
    setPuzzles(generatePatternSession(createSessionId())); setIndex(0); setAnswers([]);
    answered.current = false; finished.current = false; startLearningSession(); setPhase('playing');
    trackEvent('game_started', eventDimensions);
  };
  const choose = (id: string) => {
    if (answered.current || !question.choices.some(choice => choice.id === id)) return;
    answered.current = true; setAnswers(current => [...current, id]);
  };
  const next = () => {
    if (!answered.current || finished.current) return;
    if (index === 9) {
      finished.current = true; running.current = false; completeLearningSession(score, 10); setPhase('results');
      trackEvent('game_completed', eventDimensions);
    } else { answered.current = false; setIndex(current => current + 1); }
  };

  if (phase === 'intro') return <section className="mx-auto max-w-3xl rounded-3xl border border-purple-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="pattern-welcome" data-game-phase="intro">
    <Brain className="h-12 w-12 text-purple-800" aria-hidden="true" /><p className="mt-4 text-sm font-bold text-purple-800">Logic &amp; Brain Games · Level 1</p>
    <h2 id="pattern-welcome" className="mt-2 text-3xl font-bold">Ready, Pattern Detective?</h2>
    <p className="mt-4 leading-7">Find repeating groups, count growing groups, spot one different item, and use row and column clues. Each session has ten puzzles. Take your time: there is no timer or penalty.</p>
    <ol className="mt-5 list-decimal space-y-2 pl-5 leading-7"><li>Look at the pictures or read their text descriptions in order.</li><li>Choose one answer. Every puzzle has one answer that fits its stated rule.</li><li>Read the explanation, then move to the next puzzle.</li></ol>
    <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-purple-50 p-4" aria-hidden="true">{(['circle', 'triangle', 'square', 'star'] as const).map(shape => <TokenPicture key={shape} token={{ shape, count: 1, turn: 0 }} />)}</div>
    <Button onClick={start} className="mt-6 min-h-12 w-full bg-purple-800 hover:bg-purple-900 sm:w-auto">Start detective session<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
    <p className="mt-4 text-sm text-muted-foreground">Use Tab to move between answers and Enter or Space to choose. Your completed score stays in My Learning Journey on this browser.</p>
  </section>;
  if (phase === 'results') return <section className="mx-auto max-w-3xl rounded-3xl border border-purple-200 bg-white p-5 shadow-sm sm:p-8" data-game-phase="results" aria-labelledby="pattern-results">
    <Trophy className="h-12 w-12 text-purple-800" aria-hidden="true" /><h2 id="pattern-results" ref={resultHeading} tabIndex={-1} className="mt-4 scroll-mt-24 text-3xl font-bold outline-none">Detective session complete</h2>
    <p className="mt-4 text-2xl font-bold">You solved {score} of 10 puzzles.</p><p className="mt-3 leading-7">Every explanation is a new clue for next time. A score is a record of practice, not a test of intelligence.</p>
    <h3 className="mt-6 text-xl font-bold">Clues you practised</h3><ul className="mt-3 grid gap-2 sm:grid-cols-2">{Object.values(typeLabels).map(label => <li key={label} className="rounded-lg bg-purple-50 p-3">{label}</li>)}</ul>
    <div className="mt-6 flex flex-wrap gap-3"><Button onClick={start} className="min-h-12 bg-purple-800 hover:bg-purple-900"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Play a new session</Button><Button asChild variant="outline" className="min-h-12"><Link href="/games/my-learning-journey">My Learning Journey</Link></Button></div>
    <p className="mt-5 leading-7"><Link href="/games/logic" className={`inline-flex min-h-12 items-center rounded text-purple-800 underline ${focusClass}`}>Logic &amp; Brain Games</Link><span className="mx-2" aria-hidden="true">·</span><Link href="/games/math/subtraction-level-1" className={`inline-flex min-h-12 items-center rounded text-purple-800 underline ${focusClass}`}>Try Subtraction Adventure</Link></p>
  </section>;

  const choice = question.choices.find(option => option.id === selected);
  const correct = selected === question.correctChoiceId;
  const missingPicture = selected ? choice?.token : undefined;
  return <section className="mx-auto max-w-3xl min-w-0 rounded-3xl border border-purple-200 bg-white p-4 shadow-sm sm:p-7" data-game-phase="playing" data-puzzle-id={question.id} data-puzzle-type={question.type} aria-labelledby="pattern-question">
    <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold"><span>Puzzle {index + 1} of 10</span><span>Score: {score}</span></div>
    <div role="progressbar" aria-label={`Puzzle ${index + 1} of 10`} aria-valuemin={0} aria-valuemax={10} aria-valuenow={index + 1} className="mt-3 h-3 overflow-hidden rounded-full bg-purple-100"><div className="h-full rounded-full bg-purple-700 motion-safe:transition-[width]" style={{ width: `${(index + 1) * 10}%` }} /></div>
    <p className="mt-5 text-sm font-bold text-purple-800">{typeLabels[question.type]}</p><h2 id="pattern-question" ref={questionHeading} tabIndex={-1} className="mt-2 scroll-mt-24 text-2xl font-bold outline-none sm:text-3xl">{question.prompt}</h2>
    <p id="pattern-instruction" className="mt-3 leading-7">{question.instruction}</p>
    {question.type === 'grid' && question.rule.kind === 'grid' ? <div className="mt-5 rounded-xl border border-purple-200 bg-purple-50/50 p-2 sm:p-4"><table className="mx-auto w-full max-w-sm table-fixed border-separate border-spacing-1" aria-describedby="pattern-instruction"><caption className="sr-only">Pattern grid, {question.rule.rows} rows and {question.rule.columns} columns. One cell is missing.</caption><tbody>{Array.from({ length: question.rule.rows }, (_, row) => <tr key={row}>{Array.from({ length: question.rule.kind === 'grid' ? question.rule.columns : 0 }, (_, column) => {
      const columns = question.rule.kind === 'grid' ? question.rule.columns : 0; const cell = question.cells[row * columns + column];
      return <td key={column} className="rounded-lg border border-purple-200 bg-white p-1 text-center"><span className="sr-only">Row {row + 1}, column {column + 1}: </span>{cell ? <TokenPicture token={cell} /> : <MissingCell chosen={missingPicture} />}</td>;
    })}</tr>)}</tbody></table></div> : question.type !== 'odd' ? <ol className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-purple-50 p-3 sm:grid-cols-5" aria-label="Sequence in numbered order" aria-describedby="pattern-instruction">{question.cells.map((cell, position) => <li key={position} className="min-w-0 rounded-lg border border-purple-200 bg-white p-1 text-center"><span className="text-xs font-semibold text-muted-foreground">{position + 1}</span>{cell ? <TokenPicture token={cell} /> : <MissingCell chosen={missingPicture} />}</li>)}</ol> : <p className="mt-5 rounded-xl bg-purple-50 p-3 text-sm">The four items below are the puzzle. Choose the one that breaks the group.</p>}
    <fieldset className="mt-5" aria-describedby="pattern-instruction"><legend className="font-semibold">{question.type === 'odd' ? 'Choose the different item' : 'Choose the missing item'}</legend><div className="mt-3 grid grid-cols-2 gap-3">{question.choices.map(option => {
      const isRight = selected !== null && option.id === question.correctChoiceId; const isWrong = selected === option.id && !isRight;
      const label = question.type === 'odd' ? `Item ${option.id.slice(5)}: ${describeToken(option.token)}` : describeToken(option.token);
      return <button key={option.id} type="button" disabled={selected !== null} onClick={() => choose(option.id)} aria-label={label} aria-pressed={selected === option.id} data-choice-id={option.id} className={`min-h-28 min-w-0 rounded-xl border-2 p-3 text-center ${focusClass} disabled:opacity-100 ${isRight ? 'border-emerald-700 bg-emerald-50' : isWrong ? 'border-orange-700 bg-orange-50' : 'border-purple-200 bg-white hover:border-purple-700'}`}><TokenPicture token={option.token} decorative /><span className="mt-1 block text-sm font-semibold">{label}</span>{isRight && <span className="mt-1 block text-sm font-bold"><Check className="mr-1 inline h-4 w-4" aria-hidden="true" />Fits the rule</span>}{isWrong && <span className="mt-1 block text-sm font-bold"><X className="mr-1 inline h-4 w-4" aria-hidden="true" />Your choice</span>}</button>;
    })}</div></fieldset>
    <div role="status" aria-live="polite" aria-atomic="true" className="mt-5">{selected && <div className={`rounded-xl border p-4 ${correct ? 'border-emerald-300 bg-emerald-50' : 'border-orange-300 bg-orange-50'}`}><p className="font-bold">{correct ? 'That fits the rule!' : 'Good try. Look at the clue.'}</p><p className="mt-2 leading-7">{question.explanation}</p>{!correct && question.type !== 'odd' && <p className="mt-2 text-sm">Your chosen picture fills the gap so you can compare it with the rule. The answer marked “Fits the rule” is the one to use.</p>}</div>}</div>
    {selected && <Button ref={nextButton} onClick={next} className="mt-4 min-h-12 w-full scroll-mt-24 bg-purple-800 hover:bg-purple-900 sm:w-auto">{index === 9 ? 'See results' : 'Next puzzle'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>}
  </section>;
}

function MissingCell({ chosen }: { chosen?: Token }) {
  return <div className="rounded border-2 border-dashed border-purple-500 p-1">{chosen ? <><span className="sr-only">Your chosen item: </span><TokenPicture token={chosen} /></> : <><span className="sr-only">Missing item</span><span className="flex h-16 items-center justify-center text-3xl font-bold text-purple-800" aria-hidden="true">?</span></>}</div>;
}
export function TokenPicture({ token, decorative = false }: { token: Token; decorative?: boolean }) {
  const columns = Math.ceil(Math.sqrt(token.count)); const size = token.count === 1 ? 42 : 19;
  const paths = { triangle: 'M0 -18 L18 16 L-18 16 Z', diamond: 'M0 -20 L17 0 L0 20 L-17 0 Z', star: 'M0 -20 L5 -6 L20 -6 L8 3 L13 19 L0 10 L-13 19 L-8 3 L-20 -6 L-5 -6 Z', arrow: 'M0 -20 L18 -2 L7 -2 L7 19 L-7 19 L-7 -2 L-18 -2 Z' };
  return <span className="block"><svg viewBox="0 0 72 72" className="mx-auto h-16 w-full max-w-20 text-purple-900" aria-hidden="true" focusable="false">{Array.from({ length: token.count }, (_, i) => {
    const rows = Math.ceil(token.count / columns); const x = token.count === 1 ? 36 : 36 + (i % columns - (columns - 1) / 2) * 23; const y = token.count === 1 ? 36 : 36 + (Math.floor(i / columns) - (rows - 1) / 2) * 23;
    return <g key={i} transform={`translate(${x} ${y}) scale(${size / 42}) rotate(${token.turn * 90})`} fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">{token.shape === 'circle' ? <circle r="18" /> : token.shape === 'square' ? <rect x="-17" y="-17" width="34" height="34" rx="1" /> : <path d={paths[token.shape]} />}</g>;
  })}</svg>{!decorative && <span className="sr-only">{describeToken(token)}</span>}</span>;
}
