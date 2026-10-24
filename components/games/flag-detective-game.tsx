'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Flag, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { generateFlagRound, getFlagCountry, type FlagQuestion } from '@/lib/games/flag-detective';
import { useLearningSession } from '@/hooks/use-learning-session';

type Phase = 'intro' | 'playing' | 'results';
const GAME_ID = 'flag_detective';
const praise = ['Sharp spotting!', 'Case solved!', 'Great detecting!'];

function FlagPicture({ countryId, concealedName = false, priority = false }: { countryId: string; concealedName?: boolean; priority?: boolean }) {
  const item = getFlagCountry(countryId);
  const alt = concealedName ? `National flag to identify: ${item.description}` : `Flag of ${item.name}: ${item.description}`;
  return <div className="flex min-h-28 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-3 sm:min-h-36">
    <Image src={item.asset} alt={alt} width={240} height={160} priority={priority} unoptimized className="h-auto max-h-28 w-auto max-w-full object-contain drop-shadow-sm sm:max-h-32" />
  </div>;
}

export function FlagDetectiveGame() {
  const { startLearningSession, completeLearningSession } = useLearningSession('flag-detective');
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<FlagQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (phase === 'playing') questionHeading.current?.focus();
    if (phase === 'results') resultsHeading.current?.focus();
  }, [phase, questionIndex]);

  const startGame = (eventName: 'game_started' | 'play_again' = 'game_started') => {
    const round = generateFlagRound();
    setQuestions(round); setQuestionIndex(0); setSelected(null); setScore(0); setPhase('playing');
    startLearningSession();
    trackEvent(eventName, { game: GAME_ID, difficulty: 'level_1', questions: String(round.length) });
  };

  const submitAnswer = (answer: string) => {
    if (selected !== null) return;
    const question = questions[questionIndex];
    const correct = answer === question.correctAnswer;
    setSelected(answer);
    if (correct) setScore((value) => value + 1);
    trackEvent('answer_submitted', { game: GAME_ID, question: question.id, question_type: question.type, correct: String(correct) });
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      completeLearningSession(score, questions.length);
      setPhase('results');
      trackEvent('game_completed', { game: GAME_ID, difficulty: 'level_1', correct: String(score), questions: String(questions.length) });
      return;
    }
    setQuestionIndex((value) => value + 1); setSelected(null);
  };

  if (phase === 'intro') return <Card className="mx-auto max-w-4xl overflow-hidden border-sky-200 bg-white shadow-[0_18px_48px_rgba(14,116,144,0.12)]" data-game-phase="intro"><CardContent className="px-4 py-8 sm:px-8 sm:py-10">
    <div className="mx-auto max-w-2xl text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-700"><Search className="h-11 w-11" aria-hidden="true" /></span><p className="mt-5 text-sm font-bold uppercase tracking-wider text-sky-800">Geography · Level 1 · Free</p><h2 className="mt-2 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Flag Detective</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">Look closely at colours, shapes and symbols to match national flags with countries around the world.</p></div>
    <div className="mx-auto mt-7 grid max-w-2xl grid-cols-3 gap-3" aria-hidden="true"><FlagPicture countryId="my" /><FlagPicture countryId="br" /><FlagPicture countryId="za" /></div>
    <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-3"><div className="rounded-xl bg-sky-50 p-4"><strong className="block">10 mysteries</strong><span className="text-sm text-muted-foreground">No country repeats</span></div><div className="rounded-xl bg-amber-50 p-4"><strong className="block">54 real flags</strong><span className="text-sm text-muted-foreground">From six world regions</span></div><div className="rounded-xl bg-emerald-50 p-4"><strong className="block">Clues after answers</strong><span className="text-sm text-muted-foreground">Learn what to notice</span></div></div>
    <div className="text-center"><Button onClick={() => startGame()} size="lg" className="mt-7 min-h-12 w-full bg-sky-700 text-base hover:bg-sky-800 sm:w-auto sm:min-w-52">Start Detecting<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button></div>
  </CardContent></Card>;

  if (phase === 'results') {
    const message = score === 10 ? 'Master Flag Detective!' : score >= 8 ? 'Brilliant Detective!' : score >= 6 ? 'Case Cracked!' : 'A Strong Start!';
    return <Card className="mx-auto max-w-2xl border-sky-200 bg-white shadow-lg" data-game-phase="results"><CardContent className="flex min-h-[470px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10"><Sparkles className="h-12 w-12 text-amber-500 motion-safe:animate-pulse" aria-hidden="true" /><h2 ref={resultsHeading} tabIndex={-1} className="mt-4 text-4xl font-extrabold outline-none">{message}</h2><p className="mt-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Your score</p><p className="mt-1 text-6xl font-extrabold text-sky-700">{score} <span className="text-3xl text-muted-foreground">/ 10</span></p><p className="mt-5 max-w-md text-lg text-muted-foreground">You completed all four detective challenge types. Replay for ten different countries and shuffled choices.</p><Button onClick={() => startGame('play_again')} size="lg" className="mt-8 min-h-12 w-full bg-sky-700 hover:bg-sky-800 sm:w-auto sm:min-w-52"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Investigate Again</Button><Link href="/games/geography" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Back to Geography</Link></CardContent></Card>;
  }

  const question = questions[questionIndex];
  const correct = selected === question.correctAnswer;
  const visualQuestion = question.type === 'guess-country';
  const flagOptions = question.type === 'find-flag';
  const progress = ((questionIndex + 1) / 10) * 100;

  return <Card className="mx-auto max-w-4xl overflow-hidden border-sky-200 bg-white shadow-[0_18px_48px_rgba(14,116,144,0.12)]" data-game-phase="playing"><CardContent className="p-3 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-muted-foreground"><span>Challenge {questionIndex + 1} of 10</span><span>Level 1 · Score: {score}</span></div>
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-sky-100" role="progressbar" aria-label="Game progress" aria-valuemin={1} aria-valuemax={10} aria-valuenow={questionIndex + 1}><div className="h-full rounded-full bg-sky-600 transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
    <div className="py-5 text-center"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-700">{question.type === 'guess-country' ? 'Guess the country' : question.type === 'find-flag' ? 'Find the flag' : question.type === 'detective-clue' ? 'Detective clue' : 'Flag fact'}</p><h2 ref={questionHeading} tabIndex={-1} className="mt-2 text-balance text-2xl font-extrabold outline-none sm:text-3xl">{question.prompt}</h2></div>
    {visualQuestion && <div className="mx-auto max-w-md"><FlagPicture countryId={question.flagId} concealedName priority /></div>}
    {flagOptions ? <div className="mt-5 grid grid-cols-2 gap-3" aria-label="Flag answer choices">{question.options.map((option, index) => { const item = getFlagCountry(option); const optionCorrect = selected !== null && option === question.correctAnswer; const optionWrong = selected === option && option !== question.correctAnswer; return <button key={option} type="button" disabled={selected !== null} onClick={() => submitAnswer(option)} aria-label={selected === null ? `Flag option ${index + 1}: ${item.description}` : `Flag option ${index + 1}, ${item.name}`} className={`min-h-36 rounded-xl border-2 p-2 transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 ${optionCorrect ? 'border-emerald-600 bg-emerald-50' : optionWrong ? 'border-orange-500 bg-orange-50' : 'border-border bg-white hover:border-sky-600 hover:bg-sky-50'}`}><FlagPicture countryId={option} concealedName={selected === null} />{selected !== null && <span className="mt-2 block font-bold">{optionCorrect && <Check className="mr-1 inline h-5 w-5" aria-hidden="true" />}{optionWrong && <X className="mr-1 inline h-5 w-5" aria-hidden="true" />}{item.name}</span>}</button>; })}</div> : <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="Answer choices">{question.options.map((option) => { const item = getFlagCountry(option); const optionCorrect = selected !== null && option === question.correctAnswer; const optionWrong = selected === option && option !== question.correctAnswer; return <button key={option} type="button" disabled={selected !== null} onClick={() => submitAnswer(option)} className={`min-h-14 rounded-xl border-2 px-4 py-3 text-base font-bold transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 ${optionCorrect ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : optionWrong ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-border bg-white hover:border-sky-600 hover:bg-sky-50'}`}>{optionCorrect && <Check className="mr-2 inline h-5 w-5" aria-hidden="true" />}{optionWrong && <X className="mr-2 inline h-5 w-5" aria-hidden="true" />}{item.name}</button>; })}</div>}
    {selected !== null && <div className={`mt-5 rounded-2xl border p-4 sm:p-5 ${correct ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`} role="status" aria-live="polite"><p className="text-lg font-extrabold">{correct ? `✓ ${praise[questionIndex % praise.length]}` : `Good try. The answer is ${getFlagCountry(question.correctAnswer).name}.`}</p><p className="mt-2 leading-relaxed">{question.explanation}</p><Button onClick={nextQuestion} className="mt-4 min-h-12 w-full bg-sky-700 text-base hover:bg-sky-800 sm:w-auto">{questionIndex === 9 ? 'See Results' : 'Next Challenge'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button></div>}
  </CardContent></Card>;
}
