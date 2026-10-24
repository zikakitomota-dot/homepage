'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Landmark as LandmarkIcon, MapPin, RotateCcw, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { generateLandmarkRound, getLandmark, type LandmarkQuestion } from '@/lib/games/landmark-explorer';
import { useLearningSession } from '@/hooks/use-learning-session';

type Phase = 'intro' | 'playing' | 'results';
const GAME_ID = 'landmark_explorer';
const praise = ['Excellent exploring!', 'Landmark located!', 'Brilliant clue work!'];

function LandmarkPicture({ landmarkId, concealed = false, eager = false }: { landmarkId: string; concealed?: boolean; eager?: boolean }) {
  const item = getLandmark(landmarkId);
  return <figure className="overflow-hidden rounded-2xl border border-sky-200 bg-sky-50">
    <div className="relative aspect-[3/2] w-full"><Image src={item.image} alt={concealed ? `Landmark to identify: ${item.imageDescription}` : `${item.name}: ${item.imageDescription}`} fill sizes="(max-width: 640px) calc(100vw - 56px), 640px" loading={eager ? 'eager' : 'lazy'} className="object-contain" /></div>
    {!concealed && <figcaption className="border-t border-sky-100 px-3 py-2 text-center text-sm font-semibold text-sky-950">{item.name} · {item.country}</figcaption>}
  </figure>;
}

export function LandmarkExplorerGame() {
  const { startLearningSession, completeLearningSession } = useLearningSession('landmark-explorer');
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<LandmarkQuestion[]>([]);
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
    const round = generateLandmarkRound();
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
    <div className="mx-auto max-w-2xl text-center"><span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-800"><LandmarkIcon className="h-11 w-11" aria-hidden="true" /></span><p className="mt-5 text-sm font-bold uppercase tracking-wider text-sky-800">Geography · Level 1 · Free</p><h2 className="mt-2 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Landmark Explorer</h2><p className="mt-4 text-lg leading-relaxed text-muted-foreground">Use real photographs and friendly clues to recognise famous places, then connect each one with its country and continent.</p></div>
    <div className="mx-auto mt-7 grid max-w-2xl grid-cols-3 gap-2 sm:gap-3" aria-hidden="true"><LandmarkPicture landmarkId="petronas-towers" /><LandmarkPicture landmarkId="eiffel-tower" /><LandmarkPicture landmarkId="uluru" /></div>
    <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-3"><div className="rounded-xl bg-sky-50 p-4"><strong className="block">10 stops</strong><span className="text-sm text-muted-foreground">A new route each time</span></div><div className="rounded-xl bg-amber-50 p-4"><strong className="block">30 landmarks</strong><span className="text-sm text-muted-foreground">Built and natural wonders</span></div><div className="rounded-xl bg-emerald-50 p-4"><strong className="block">4 challenge types</strong><span className="text-sm text-muted-foreground">Pictures, places and clues</span></div></div>
    <div className="text-center"><Button onClick={() => startGame()} size="lg" className="mt-7 min-h-12 w-full bg-sky-700 text-base hover:bg-sky-800 sm:w-auto sm:min-w-52">Start Exploring<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button></div>
  </CardContent></Card>;

  if (phase === 'results') {
    const message = score === 10 ? 'World Landmark Expert!' : score >= 8 ? 'Amazing Explorer!' : score >= 6 ? 'Great Journey!' : 'A Strong Start!';
    return <Card className="mx-auto max-w-2xl border-sky-200 bg-white shadow-lg" data-game-phase="results"><CardContent className="flex min-h-[470px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10"><Sparkles className="h-12 w-12 text-amber-500 motion-safe:animate-pulse" aria-hidden="true" /><h2 ref={resultsHeading} tabIndex={-1} className="mt-4 text-4xl font-extrabold outline-none">{message}</h2><p className="mt-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Your score</p><p className="mt-1 text-6xl font-extrabold text-sky-700">{score} <span className="text-3xl text-muted-foreground">/ 10</span></p><p className="mt-5 max-w-md text-lg text-muted-foreground">You completed picture, country, continent and detective challenges. Replay to visit a different mix of landmarks.</p><Button onClick={() => startGame('play_again')} size="lg" className="mt-8 min-h-12 w-full bg-sky-700 hover:bg-sky-800 sm:w-auto sm:min-w-52"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Explore Again</Button><Link href="/games/geography" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Back to Geography</Link></CardContent></Card>;
  }

  const question = questions[questionIndex];
  const item = getLandmark(question.landmarkId);
  const correct = selected === question.correctAnswer;
  const progress = ((questionIndex + 1) / 10) * 100;
  const labels: Record<LandmarkQuestion['type'], string> = { 'recognise-landmark': 'Recognise the landmark', 'find-country': 'Find the country', 'match-continent': 'Match the continent', 'landmark-detective': 'Landmark detective' };

  return <Card className="mx-auto max-w-4xl overflow-hidden border-sky-200 bg-white shadow-[0_18px_48px_rgba(14,116,144,0.12)]" data-game-phase="playing"><CardContent className="p-3 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-muted-foreground"><span>Stop {questionIndex + 1} of 10</span><span>Level 1 · Score: {score}</span></div>
    <div className="mt-3 h-3 overflow-hidden rounded-full bg-sky-100" role="progressbar" aria-label="Game progress" aria-valuemin={1} aria-valuemax={10} aria-valuenow={questionIndex + 1}><div className="h-full rounded-full bg-sky-600 transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
    <div className="py-5 text-center"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-sky-700">{labels[question.type]}</p><h2 ref={questionHeading} tabIndex={-1} className="mt-2 text-balance text-2xl font-extrabold outline-none sm:text-3xl">{question.prompt}</h2></div>
    {question.showImage && <div className="mx-auto max-w-2xl"><LandmarkPicture landmarkId={question.landmarkId} concealed={selected === null && question.type === 'recognise-landmark'} eager /></div>}
    {!question.showImage && <div className="mx-auto flex max-w-2xl items-center justify-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950"><MapPin className="h-7 w-7 shrink-0" aria-hidden="true" /><p className="font-semibold">Use the words in the question as your clue. A photograph appears after you answer.</p></div>}
    <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="Answer choices">{question.options.map((option) => { const optionCorrect = selected !== null && option === question.correctAnswer; const optionWrong = selected === option && option !== question.correctAnswer; return <button key={option} type="button" disabled={selected !== null} onClick={() => submitAnswer(option)} className={`min-h-14 rounded-xl border-2 px-4 py-3 text-base font-bold transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 ${optionCorrect ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : optionWrong ? 'border-orange-500 bg-orange-50 text-orange-950' : 'border-border bg-white hover:border-sky-600 hover:bg-sky-50'}`}>{optionCorrect && <Check className="mr-2 inline h-5 w-5" aria-hidden="true" />}{optionWrong && <X className="mr-2 inline h-5 w-5" aria-hidden="true" />}{option}</button>; })}</div>
    {selected !== null && <div className={`mt-5 rounded-2xl border p-4 sm:p-5 ${correct ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`} role="status" aria-live="polite"><p className="text-lg font-extrabold">{correct ? `✓ ${praise[questionIndex % praise.length]}` : `Good try. The answer is ${question.correctAnswer}.`}</p><p className="mt-2 leading-relaxed">{question.explanation}</p>{!question.showImage && <div className="mt-4 max-w-md"><LandmarkPicture landmarkId={item.id} /></div>}<Button onClick={nextQuestion} className="mt-4 min-h-12 w-full bg-sky-700 text-base hover:bg-sky-800 sm:w-auto">{questionIndex === 9 ? 'See Results' : 'Next Stop'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button></div>}
  </CardContent></Card>;
}
