'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, Compass, RotateCcw, Sparkles, Waves, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { continentMapPaths } from '@/lib/games/continent-map-paths';
import { generateOceanRound, getOcean, oceans, type OceanId, type OceanQuestion } from '@/lib/games/ocean-explorer';
import { useLearningSession } from '@/hooks/use-learning-session';

type Phase = 'intro' | 'playing' | 'results';

const GAME_ID = 'ocean_explorer';
const positiveMessages = ['Wonderful navigating!', 'You found it!', 'Great ocean knowledge!'];
const markerLocations: Record<OceanId, readonly { x: number; y: number; label: string }[]> = {
  pacific: [{ x: 72, y: 225, label: 'western map edge' }, { x: 792, y: 225, label: 'eastern map edge' }],
  atlantic: [{ x: 368, y: 215, label: 'between the Americas and Europe and Africa' }],
  indian: [{ x: 570, y: 280, label: 'between Africa and Australia' }],
  southern: [{ x: 432, y: 382, label: 'around Antarctica' }],
  arctic: [{ x: 432, y: 43, label: 'around the North Pole' }],
};

function OceanMap({ target, selected, resolved, interactive, onSelect }: { target?: OceanId; selected?: OceanId | null; resolved?: boolean; interactive?: boolean; onSelect?: (id: OceanId) => void }) {
  const titleId = useId();
  const descriptionId = useId();
  const answer = target;
  return <div className="overflow-hidden rounded-2xl border border-cyan-200 bg-gradient-to-b from-cyan-50 to-blue-100 p-1 sm:p-4">
    <div className="relative" role={interactive ? 'group' : undefined} aria-labelledby={`${titleId} ${descriptionId}`}>
    <svg viewBox="0 0 864 432" role="img" aria-hidden={interactive ? 'true' : undefined} aria-labelledby={!interactive ? `${titleId} ${descriptionId}` : undefined} className="h-auto w-full drop-shadow-sm">
      <title id={titleId}>World map with five labelled ocean markers</title>
      <desc id={descriptionId}>{interactive ? 'Choose an ocean marker. The Pacific has linked markers on both edges.' : target ? `${getOcean(target).name} is marked.` : 'The five named oceans are shown around the continents.'}</desc>
      <rect width="864" height="432" rx="18" fill="#dff5fb" />
      {[...Array(5)].map((_, index) => <line key={`lat-${index}`} x1="0" x2="864" y1={(index + 1) * 72} y2={(index + 1) * 72} stroke="#acd8e6" strokeWidth="1" strokeDasharray="4 7" />)}
      {[...Array(11)].map((_, index) => <line key={`lon-${index}`} y1="0" y2="432" x1={(index + 1) * 72} x2={(index + 1) * 72} stroke="#acd8e6" strokeWidth="1" strokeDasharray="4 7" />)}
      {Object.values(continentMapPaths).flatMap((paths, groupIndex) => paths.map((path, pathIndex) => <path key={`${groupIndex}-${pathIndex}`} d={path} fill="#d8dfd6" fillRule="evenodd" stroke="#ffffff" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />))}
    </svg>
      {oceans.flatMap((ocean) => markerLocations[ocean.id].map((marker, markerIndex) => {
        const isSelected = selected === ocean.id;
        const isCorrect = resolved && answer === ocean.id;
        const isWrong = resolved && isSelected && answer !== ocean.id;
        const isTarget = !interactive && target === ocean.id;
        const muted = !interactive && target && !isTarget;
        const fill = isCorrect ? '#15803d' : isWrong ? '#c2410c' : isTarget ? ocean.colour : muted ? '#94a3b8' : ocean.colour;
        const activate = () => interactive && !resolved && onSelect?.(ocean.id);
        const shortLabel = ocean.id === 'pacific' ? 'Pac' : ocean.id === 'atlantic' ? 'Atl' : ocean.id === 'southern' ? 'Sth' : ocean.id === 'arctic' ? 'Arc' : 'Ind';
        return <button key={`${ocean.id}-${markerIndex}`} type="button" disabled={!interactive || resolved} aria-label={interactive ? `Choose ${ocean.name}, ${marker.label}` : `${ocean.name}, ${marker.label}`} onClick={activate} style={{ left: `${(marker.x / 864) * 100}%`, top: `${(marker.y / 432) * 100}%`, backgroundColor: fill }} className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-white text-[11px] font-extrabold text-white shadow-md transition-transform motion-reduce:transition-none disabled:opacity-100 ${interactive && !resolved ? 'cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-slate-900 focus-visible:ring-offset-2' : 'cursor-default'} ${isSelected || isTarget || isCorrect ? 'scale-110' : ''}`}>
          {shortLabel}<span className="sr-only"> {ocean.name}</span>
        </button>;
      }))}
    </div>
    <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-700" aria-hidden="true"><span>Pac · Pacific</span><span>Atl · Atlantic</span><span>Ind · Indian</span><span>Sth · Southern</span><span>Arc · Arctic</span></div>
    <p className="mt-1 text-center text-xs text-slate-600">Markers show approximate ocean locations · Both Pacific markers choose the same ocean</p>
  </div>;
}

export function OceanExplorerGame() {
  const { startLearningSession, completeLearningSession } = useLearningSession('ocean-explorer');
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<OceanQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<OceanId | null>(null);
  const [score, setScore] = useState(0);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (phase === 'playing') questionHeading.current?.focus();
    if (phase === 'results') resultsHeading.current?.focus();
  }, [phase, questionIndex]);

  const startGame = (eventName: 'game_started' | 'play_again' = 'game_started') => {
    const round = generateOceanRound();
    setQuestions(round);
    setQuestionIndex(0);
    setSelected(null);
    setScore(0);
    setPhase('playing');
    startLearningSession();
    trackEvent(eventName, { game: GAME_ID, difficulty: 'level_1', questions: String(round.length) });
  };

  const submitAnswer = (answer: OceanId) => {
    if (selected !== null) return;
    const question = questions[questionIndex];
    const correct = answer === question.correctAnswer;
    setSelected(answer);
    if (correct) setScore((current) => current + 1);
    trackEvent('answer_submitted', { game: GAME_ID, question: question.id, question_type: question.type, correct: String(correct) });
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      completeLearningSession(score, questions.length);
      setPhase('results');
      trackEvent('game_completed', { game: GAME_ID, difficulty: 'level_1', correct: String(score), questions: String(questions.length) });
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelected(null);
  };

  if (phase === 'intro') return <Card className="mx-auto max-w-4xl overflow-hidden border-cyan-200 bg-white shadow-[0_18px_48px_rgba(8,145,178,0.14)]" data-game-phase="intro"><CardContent className="px-4 py-8 sm:px-8 sm:py-10">
    <div className="mx-auto max-w-2xl text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-100 text-cyan-700"><Waves className="h-11 w-11" aria-hidden="true" /></span><p className="mt-5 text-sm font-bold uppercase tracking-wider text-cyan-800">Geography · Level 1 · Free</p><h2 className="mt-2 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Ocean Explorer</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">Navigate the five named oceans, notice the continents around them, and learn why one global ocean matters.</p></div>
    <div className="mt-7"><OceanMap /></div>
    <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-3"><div className="rounded-xl bg-cyan-50 p-4"><strong className="block">10 challenges</strong><span className="text-sm text-muted-foreground">A fresh mix each voyage</span></div><div className="rounded-xl bg-blue-50 p-4"><strong className="block">Choose markers</strong><span className="text-sm text-muted-foreground">Tap, click, or use a keyboard</span></div><div className="rounded-xl bg-emerald-50 p-4"><strong className="block">Learn as you go</strong><span className="text-sm text-muted-foreground">Read a fact after every answer</span></div></div>
    <div className="text-center"><Button onClick={() => startGame()} size="lg" className="mt-7 min-h-12 w-full bg-cyan-700 text-base hover:bg-cyan-800 sm:w-auto sm:min-w-52">Start Exploring<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button></div>
  </CardContent></Card>;

  if (phase === 'results') {
    const message = score === questions.length ? 'Ocean Master!' : score >= 8 ? 'Brilliant Navigator!' : score >= 6 ? 'Great Voyage!' : 'A Strong Start!';
    return <Card className="mx-auto max-w-2xl border-cyan-200 bg-white shadow-lg" data-game-phase="results"><CardContent className="flex min-h-[470px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10"><Sparkles className="h-12 w-12 text-amber-500 motion-safe:animate-pulse" aria-hidden="true" /><h2 ref={resultsHeading} tabIndex={-1} className="mt-4 text-4xl font-extrabold outline-none">{message}</h2><p className="mt-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Your score</p><p className="mt-1 text-6xl font-extrabold text-cyan-700">{score} <span className="text-3xl text-muted-foreground">/ {questions.length}</span></p><p className="mt-5 max-w-md text-lg text-muted-foreground">You completed all four challenge types. Replay for a reshuffled voyage from the 40-question bank.</p><Button onClick={() => startGame('play_again')} size="lg" className="mt-8 min-h-12 w-full bg-cyan-700 hover:bg-cyan-800 sm:w-auto sm:min-w-52"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Explore Again</Button><Link href="/games/geography" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Back to Geography</Link></CardContent></Card>;
  }

  const question = questions[questionIndex];
  const correct = selected === question.correctAnswer;
  const isMapQuestion = question.type === 'map';
  const progress = ((questionIndex + 1) / questions.length) * 100;
  return <Card className="mx-auto max-w-4xl overflow-hidden border-cyan-200 bg-white shadow-[0_18px_48px_rgba(8,145,178,0.14)]" data-game-phase="playing"><CardContent className="p-2.5 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-muted-foreground"><span>Challenge {questionIndex + 1} of {questions.length}</span><span>Level 1 · Score: {score}</span></div>
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-cyan-100" role="progressbar" aria-label="Game progress" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={questionIndex + 1}><div className="h-full rounded-full bg-cyan-600 transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
    <div className="py-5 text-center"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-cyan-700">{question.type === 'map' ? 'Map discovery' : question.type === 'identify' ? 'Name the ocean' : question.type === 'relationship' ? 'Ocean and continent' : 'Ocean fact'}</p><h2 ref={questionHeading} tabIndex={-1} className="mt-2 text-balance text-2xl font-extrabold outline-none sm:text-3xl">{question.prompt}</h2></div>
    {(isMapQuestion || question.type === 'identify') && <OceanMap target={question.correctAnswer} selected={selected} resolved={selected !== null} interactive={isMapQuestion} onSelect={submitAnswer} />}
    {!isMapQuestion && <div className={`mt-6 grid gap-3 ${question.options && question.options.length > 4 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`} aria-label="Answer choices">{question.options?.map((option) => { const optionCorrect = selected !== null && option === question.correctAnswer; const optionWrong = selected === option && option !== question.correctAnswer; return <button key={option} type="button" disabled={selected !== null} onClick={() => submitAnswer(option)} className={`min-h-14 rounded-xl border-2 px-4 py-3 text-base font-bold transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-100 ${optionCorrect ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : optionWrong ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-border bg-white hover:border-cyan-600 hover:bg-cyan-50'}`}>{optionCorrect && <Check className="mr-2 inline h-5 w-5" aria-hidden="true" />}{optionWrong && <X className="mr-2 inline h-5 w-5" aria-hidden="true" />}{getOcean(option).name}</button>; })}</div>}
    {selected !== null && <div className={`mt-5 rounded-2xl border p-4 sm:p-5 ${correct ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`} role="status" aria-live="polite"><p className="text-lg font-extrabold">{correct ? `✓ ${positiveMessages[questionIndex % positiveMessages.length]}` : `Good try. The answer is ${getOcean(question.correctAnswer).name}.`}</p><p className="mt-2 leading-relaxed">{question.explanation}</p><Button onClick={nextQuestion} className="mt-4 min-h-12 w-full bg-cyan-700 text-base hover:bg-cyan-800 sm:w-auto">{questionIndex === questions.length - 1 ? 'See Results' : 'Next Challenge'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button></div>}
    {isMapQuestion && selected === null && <p className="mt-3 flex items-center justify-center gap-2 text-center text-sm font-medium text-muted-foreground"><Compass className="h-4 w-4" aria-hidden="true" />Choose a labelled marker. Use Tab and Enter or Space with a keyboard.</p>}
  </CardContent></Card>;
}
