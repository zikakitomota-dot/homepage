'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Footprints, Minus, RotateCcw, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { generateSubtractionRound, type SubtractionQuestion } from '@/lib/games/subtraction-level-one';
import { useLearningSession } from '@/hooks/use-learning-session';

type Phase = 'intro' | 'playing' | 'results';
const GAME_ID = 'subtraction_adventure';
const typeLabels: Record<SubtractionQuestion['type'], string> = { picture: 'Picture subtraction', number: 'Number challenge', 'missing-number': 'Missing number', 'number-line': 'Number line adventure' };
const praise = ['Great taking away!', 'Correct counting!', 'Brilliant backwards thinking!'];

export function SubtractionAdventureGame() {
  const { startLearningSession, completeLearningSession } = useLearningSession('subtraction-level-1');
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<SubtractionQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [removed, setRemoved] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (phase === 'playing') questionHeading.current?.focus();
    if (phase === 'results') resultsHeading.current?.focus();
  }, [phase, questionIndex]);

  const startGame = (eventName: 'game_started' | 'play_again' = 'game_started') => {
    const round = generateSubtractionRound();
    setQuestions(round); setQuestionIndex(0); setSelectedAnswer(null); setRemoved([]); setScore(0); setPhase('playing');
    startLearningSession();
    trackEvent(eventName, { game: GAME_ID, difficulty: 'level_1', questions: String(round.length) });
  };

  const submitAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    const question = questions[questionIndex];
    const correct = answer === question.correctAnswer;
    setSelectedAnswer(answer);
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
    setQuestionIndex((value) => value + 1); setSelectedAnswer(null); setRemoved([]);
  };

  if (phase === 'intro') return <Card className="mx-auto max-w-3xl overflow-hidden border-blue-200 bg-white shadow-[0_18px_48px_rgba(37,99,235,0.12)]" data-game-phase="intro"><CardContent className="px-5 py-10 text-center sm:px-10">
    <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-800"><Minus className="h-12 w-12" aria-hidden="true" /></span><p className="mt-5 text-sm font-bold uppercase tracking-wider text-blue-700">Mathematics · Level 1 · Free</p><h2 className="mt-2 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Subtraction Adventure</h2><p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">Take objects away, solve number puzzles and hop backwards along a number line. Every journey has 10 challenges and no answer is below zero.</p>
    <div className="mx-auto mt-7 grid max-w-2xl gap-3 sm:grid-cols-4"><div className="rounded-xl bg-blue-50 p-4"><strong className="block">🍎 Pictures</strong><span className="text-sm text-muted-foreground">Cross objects out</span></div><div className="rounded-xl bg-amber-50 p-4"><strong className="block">9 − 4</strong><span className="text-sm text-muted-foreground">Solve expressions</span></div><div className="rounded-xl bg-violet-50 p-4"><strong className="block">10 − ?</strong><span className="text-sm text-muted-foreground">Find missing parts</span></div><div className="rounded-xl bg-emerald-50 p-4"><strong className="block">← ← ←</strong><span className="text-sm text-muted-foreground">Move backwards</span></div></div>
    <Button onClick={() => startGame()} size="lg" className="mt-8 min-h-12 w-full text-base sm:w-auto sm:min-w-52">Start Adventure<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
  </CardContent></Card>;

  if (phase === 'results') {
    const message = score === 10 ? 'Subtraction Superstar!' : score >= 8 ? 'Amazing Adventurer!' : score >= 6 ? 'Great Backwards Thinking!' : 'A Strong Start!';
    return <Card className="mx-auto max-w-2xl border-blue-200 bg-white shadow-lg" data-game-phase="results"><CardContent className="flex min-h-[470px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10"><Sparkles className="h-12 w-12 text-amber-500 motion-safe:animate-pulse" aria-hidden="true" /><h2 ref={resultsHeading} tabIndex={-1} className="mt-4 text-4xl font-extrabold outline-none">{message}</h2><p className="mt-6 text-sm font-bold uppercase tracking-wider text-muted-foreground">Your score</p><p className="mt-1 text-6xl font-extrabold text-blue-700">{score} <span className="text-3xl text-muted-foreground">/ 10</span></p><p className="mt-5 max-w-md text-lg text-muted-foreground">You practised taking away with objects, expressions, missing numbers and number-line steps.</p><Button onClick={() => startGame('play_again')} size="lg" className="mt-8 min-h-12 w-full sm:w-auto sm:min-w-52"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Play Again</Button><Link href="/games/math" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Back to Mathematics</Link></CardContent></Card>;
  }

  const question = questions[questionIndex];
  const correct = selectedAnswer === question.correctAnswer;
  const progress = ((questionIndex + 1) / questions.length) * 100;
  const remaining = question.minuend - removed.length;

  return <Card className="mx-auto max-w-4xl overflow-hidden border-blue-200 bg-white shadow-[0_18px_48px_rgba(37,99,235,0.12)]" data-game-phase="playing"><CardContent className="p-3 sm:p-8">
    <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-muted-foreground"><span>Challenge {questionIndex + 1} of 10</span><span>Level 1 · Score: {score}</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-blue-100" role="progressbar" aria-label="Game progress" aria-valuemin={1} aria-valuemax={10} aria-valuenow={questionIndex + 1}><div className="h-full rounded-full bg-blue-600 transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
    <div className="py-5 text-center"><p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-700">{typeLabels[question.type]}</p><h2 ref={questionHeading} tabIndex={-1} className="mt-2 text-balance text-2xl font-extrabold outline-none sm:text-3xl">{question.prompt}</h2></div>
    {question.type === 'picture' && <PictureInteraction question={question} removed={removed} setRemoved={setRemoved} disabled={selectedAnswer !== null} remaining={remaining} onCheck={() => submitAnswer(remaining)} />}
    {question.type === 'number-line' && <NumberLineInteraction question={question} selected={selectedAnswer} onSelect={submitAnswer} />}
    {(question.type === 'number' || question.type === 'missing-number') && <AnswerChoices question={question} selected={selectedAnswer} onSelect={submitAnswer} />}
    {selectedAnswer !== null && <div className={`mt-5 rounded-2xl border p-4 sm:p-5 ${correct ? 'border-emerald-200 bg-emerald-50' : 'border-orange-200 bg-orange-50'}`} role="status" aria-live="polite"><p className="text-lg font-extrabold">{correct ? `✓ ${praise[questionIndex % praise.length]}` : `Good try. The answer is ${question.correctAnswer}.`}</p><p className="mt-2 leading-relaxed">{question.explanation}</p><Button onClick={nextQuestion} className="mt-4 min-h-12 w-full text-base sm:w-auto">{questionIndex === 9 ? 'See Results' : 'Next Challenge'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button></div>}
  </CardContent></Card>;
}

function PictureInteraction({ question, removed, setRemoved, disabled, remaining, onCheck }: { question: SubtractionQuestion; removed: number[]; setRemoved: (value: number[]) => void; disabled: boolean; remaining: number; onCheck: () => void }) {
  const toggle = (index: number) => {
    if (disabled) return;
    if (removed.includes(index)) setRemoved(removed.filter((value) => value !== index));
    else if (removed.length < question.subtrahend) setRemoved([...removed, index]);
  };
  return <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 sm:p-6"><p className="text-center font-semibold" aria-live="polite">Crossed out {removed.length} of {question.subtrahend}. {remaining} objects are still showing.</p><div className="mx-auto mt-4 grid max-w-xl grid-cols-5 gap-2" aria-label={`${question.minuend} interactive objects. Cross out ${question.subtrahend}.`}>{Array.from({ length: question.minuend }, (_, index) => { const crossed = removed.includes(index); return <button key={index} type="button" disabled={disabled} aria-pressed={crossed} aria-label={`${question.object} ${index + 1}, ${crossed ? 'crossed out; activate to restore' : 'not crossed out; activate to remove'}`} onClick={() => toggle(index)} className={`relative flex min-h-14 items-center justify-center rounded-xl border-2 text-3xl transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 ${crossed ? 'border-slate-400 bg-slate-100 grayscale' : 'border-blue-200 bg-white hover:border-blue-500'}`}><span aria-hidden="true">{question.object}</span>{crossed && <span className="absolute h-1 w-10 rotate-[-35deg] rounded bg-red-600" aria-hidden="true" />}</button>; })}</div><Button onClick={onCheck} disabled={removed.length !== question.subtrahend || disabled} className="mx-auto mt-5 flex min-h-12 w-full sm:w-auto">Check {remaining} Remaining</Button></div>;
}

function NumberLineInteraction({ question, selected, onSelect }: { question: SubtractionQuestion; selected: number | null; onSelect: (answer: number) => void }) {
  const values = Array.from({ length: question.minuend + 1 }, (_, value) => value);
  return <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 sm:p-6"><p className="text-center font-semibold"><Footprints className="mr-2 inline h-5 w-5 text-emerald-700" aria-hidden="true" />Choose where you land after moving back {question.subtrahend} steps.</p><p className="mt-2 text-center text-sm text-muted-foreground sm:hidden">Swipe or scroll sideways to see the whole number line.</p><div className="mt-5 overflow-x-auto pb-3"><div className="relative mx-auto grid min-w-max gap-1 pt-7" style={{ gridTemplateColumns: `repeat(${values.length}, minmax(38px, 1fr))` }} aria-label={`Interactive number line from 0 to ${question.minuend}`}>{values.map((value) => { const inPath = selected !== null && value >= selected && value <= question.minuend; const chosen = selected === value; return <button key={value} type="button" disabled={selected !== null} onClick={() => onSelect(value)} aria-label={`${value}${value === question.minuend ? ', starting point' : ''}`} className={`relative min-h-12 min-w-10 rounded-lg border-2 font-extrabold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 ${chosen ? 'border-emerald-700 bg-emerald-200' : inPath ? 'border-amber-500 bg-amber-100' : value === question.minuend ? 'border-blue-600 bg-blue-100' : 'border-border bg-white hover:border-blue-500'}`}>{inPath && value < question.minuend && <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-amber-700" aria-hidden="true">←</span>}{value}</button>; })}</div></div><p className="text-center text-sm text-muted-foreground">Start at the blue number. Each arrow after your choice shows one backward step.</p></div>;
}

function AnswerChoices({ question, selected, onSelect }: { question: SubtractionQuestion; selected: number | null; onSelect: (answer: number) => void }) {
  return <div className="grid grid-cols-2 gap-3" aria-label="Answer choices">{question.choices.map((option) => { const optionCorrect = selected !== null && option === question.correctAnswer; const optionWrong = selected === option && option !== question.correctAnswer; return <button key={option} type="button" disabled={selected !== null} onClick={() => onSelect(option)} className={`min-h-16 rounded-xl border-2 px-4 py-3 text-xl font-extrabold transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 ${optionCorrect ? 'border-emerald-600 bg-emerald-50 text-emerald-950' : optionWrong ? 'border-orange-500 bg-orange-50 text-orange-950' : 'border-border bg-white hover:border-blue-600 hover:bg-blue-50'}`}>{optionCorrect && <Check className="mr-2 inline h-5 w-5" aria-hidden="true" />}{optionWrong && <X className="mr-2 inline h-5 w-5" aria-hidden="true" />}{option}</button>; })}</div>;
}
