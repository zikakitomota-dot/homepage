'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { readProgress, recordGameResult } from '@/lib/games/progress';
import type { EnglishGame, GameQuestion } from '@/lib/games/types';

type Phase = 'intro' | 'playing' | 'results';

function shuffled<T>(items: readonly T[]) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
  }
  return copy;
}

export function GameEngine({ game, nextGame }: { game: EnglishGame; nextGame?: Pick<EnglishGame, 'slug' | 'title'> }) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);

  useEffect(() => {
    setBestScore(readProgress()[game.slug]?.bestScore ?? 0);
  }, [game.slug]);

  const startGame = () => {
    setQuestions(shuffled(game.questions).slice(0, 10));
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setPhase('playing');
  };

  const selectAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === questions[questionIndex].correctAnswer) setScore((current) => current + 1);
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      recordGameResult(game.slug, score);
      setBestScore((current) => Math.max(current, score));
      setPhase('results');
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  if (phase === 'intro') {
    return (
      <Card className="mx-auto max-w-2xl overflow-hidden border-blue-200 bg-white shadow-lg">
        <CardContent className="flex min-h-[420px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10">
          <span className="text-6xl" aria-hidden="true">{game.icon}</span>
          <p className="mt-5 text-sm font-bold uppercase tracking-wider text-primary">Grammar · Level 1 · Free</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{game.title}</h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">{game.instructions}</p>
          {bestScore > 0 && <p className="mt-4 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">Best score: {bestScore}/10</p>}
          <Button onClick={startGame} size="lg" className="mt-8 min-h-12 w-full text-base sm:w-auto sm:min-w-48">Start Game<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
        </CardContent>
      </Card>
    );
  }

  if (phase === 'results') {
    const percentage = score * 10;
    const message = score === 10 ? 'Amazing! Perfect score! 🌟' : score >= 8 ? 'Fantastic work! 🎉' : score >= 6 ? 'Great job! Keep practising! 👍' : 'Nice try! Practice makes progress! 🌱';
    return (
      <Card className="mx-auto max-w-2xl overflow-hidden border-blue-200 bg-white shadow-lg">
        <CardContent className="flex min-h-[440px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10">
          <Sparkles className="h-12 w-12 text-amber-500 motion-safe:animate-pulse" aria-hidden="true" />
          <h2 className="mt-4 text-4xl font-bold">Well Done!</h2>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Score</p>
          <p className="mt-1 text-6xl font-bold text-primary">{score} <span className="text-3xl text-muted-foreground">/ 10</span></p>
          <p className="mt-2 text-lg font-semibold">{percentage}%</p>
          <p className="mt-5 text-xl font-semibold">{message}</p>
          <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
            <Button onClick={startGame} size="lg" className="min-h-12"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Play Again</Button>
            <Button asChild size="lg" variant="outline" className="min-h-12"><Link href="/games/english"><ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />English Games</Link></Button>
          </div>
          {nextGame && <Link href={`/games/english/${nextGame.slug}`} className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Try another game: {nextGame.title}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>}
        </CardContent>
      </Card>
    );
  }

  const question = questions[questionIndex];
  const answeredCorrectly = selectedAnswer === question.correctAnswer;
  const progress = ((questionIndex + 1) / questions.length) * 100;

  return (
    <Card className="mx-auto max-w-2xl overflow-hidden border-blue-200 bg-white shadow-lg">
      <CardContent className="p-4 sm:p-8">
        <div className="flex items-center justify-between gap-3 text-sm font-bold text-muted-foreground">
          <span>Question {questionIndex + 1} of {questions.length}</span><span>Score: {score}</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-blue-100" role="progressbar" aria-label="Game progress" aria-valuemin={0} aria-valuemax={10} aria-valuenow={questionIndex + 1}>
          <div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex min-h-52 flex-col items-center justify-center py-7 text-center">
          {question.illustration && <span className="mb-4 text-6xl" aria-hidden="true">{question.illustration}</span>}
          <h2 className="text-balance text-2xl font-bold leading-relaxed sm:text-3xl">{question.prompt}</h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {question.choices.map((choice) => {
            const isSelected = selectedAnswer === choice;
            const isCorrectChoice = selectedAnswer && choice === question.correctAnswer;
            const stateClass = isCorrectChoice ? 'border-green-600 bg-green-50 text-green-800' : isSelected ? 'border-red-500 bg-red-50 text-red-800' : 'border-border bg-white hover:border-primary hover:bg-blue-50';
            return <button key={choice} type="button" disabled={selectedAnswer !== null} onClick={() => selectAnswer(choice)} className={`min-h-14 rounded-xl border-2 px-4 py-3 text-base font-bold capitalize transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-100 ${stateClass}`}>
              {choice}{isCorrectChoice ? ' ✓' : isSelected ? ' ✗' : ''}
            </button>;
          })}
        </div>

        {selectedAnswer && (
          <div className={`mt-5 rounded-xl border p-4 ${answeredCorrectly ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`} role="status" aria-live="polite">
            <p className="text-lg font-bold">{answeredCorrectly ? '✓ Great job!' : 'Not quite!'}</p>
            {!answeredCorrectly && <p className="mt-1 font-semibold">The correct answer is “{question.correctAnswer}”.</p>}
            <p className="mt-2 text-sm leading-relaxed">{question.explanation}</p>
            <Button onClick={nextQuestion} className="mt-4 min-h-12 w-full text-base sm:w-auto">{questionIndex === questions.length - 1 ? 'See Results' : 'Next Question'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
