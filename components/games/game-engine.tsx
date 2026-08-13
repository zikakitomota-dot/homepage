'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Undo2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AcademyResultsCta } from '@/components/games/academy-cta';
import { getDifficultyProgress, readPreferredDifficulty, readProgress, recordGameResult, writePreferredDifficulty } from '@/lib/games/progress';
import { gameDifficulties, type EnglishGame, type GameDifficulty, type GameQuestion } from '@/lib/games/types';

type Phase = 'intro' | 'playing' | 'results';
const difficultyLabels: Record<GameDifficulty, string> = { easy: 'Easy', normal: 'Medium', challenge: 'Hard' };
const difficultyDots: Record<GameDifficulty, string> = { easy: '🟢', normal: '🔵', challenge: '🟣' };

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
  const [difficulty, setDifficulty] = useState<GameDifficulty>('easy');
  const [bestScores, setBestScores] = useState<Record<GameDifficulty, number>>({ easy: 0, normal: 0, challenge: 0 });
  const [wordOrder, setWordOrder] = useState<number[]>([]);

  useEffect(() => {
    const preferred = readPreferredDifficulty();
    const progress = readProgress();
    setDifficulty(preferred);
    setBestScores(Object.fromEntries(gameDifficulties.map((mode) => [mode, getDifficultyProgress(progress, game.slug, mode).bestScore])) as Record<GameDifficulty, number>);
  }, [game.slug]);

  const chooseDifficulty = (nextDifficulty: GameDifficulty) => {
    setDifficulty(nextDifficulty);
    writePreferredDifficulty(nextDifficulty);
  };

  const startGame = () => {
    const pool = game.questions.filter((question) => question.difficulty === difficulty);
    if (pool.length < 10) {
      console.error(`[english-game] ${game.slug} has only ${pool.length} ${difficulty} questions; 10 are required.`);
      return;
    }
    setQuestions(shuffled(pool).slice(0, 10).map((question) => game.interaction === 'wordOrder' ? question : { ...question, choices: shuffled(question.choices) }));
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setWordOrder([]);
    setPhase('playing');
  };

  const selectAnswer = (answer: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    if (answer === questions[questionIndex].correctAnswer) setScore((current) => current + 1);
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      recordGameResult(game.slug, difficulty, score);
      setBestScores((current) => ({ ...current, [difficulty]: Math.max(current[difficulty], score) }));
      setPhase('results');
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
    setWordOrder([]);
  };

  if (phase === 'intro') {
    return (
      <Card className="mx-auto max-w-2xl overflow-hidden border-blue-200 bg-white shadow-lg">
        <CardContent className="flex min-h-[420px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10">
          <span className="text-6xl" aria-hidden="true">{game.icon}</span>
          <p className="mt-5 text-sm font-bold uppercase tracking-wider text-primary">{game.category} · Level {game.level} · {game.access === 'premium' ? 'Academy' : 'Free'}</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{game.title}</h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">{game.instructions}</p>
          <fieldset className="mt-7 w-full max-w-lg">
            <legend className="mb-3 text-sm font-bold text-foreground">Choose difficulty</legend>
            <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-3" role="radiogroup" aria-label="Choose difficulty">
              {gameDifficulties.map((mode) => {
                const selected = difficulty === mode;
                return <button key={mode} type="button" role="radio" aria-checked={selected} onClick={() => chooseDifficulty(mode)} className={`min-h-[48px] rounded-xl border-2 px-3 py-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? 'border-primary bg-blue-50 text-primary' : 'border-border bg-white hover:border-primary/60'}`}>
                  <span aria-hidden="true">{difficultyDots[mode]}</span> {difficultyLabels[mode]}
                </button>;
              })}
            </div>
          </fieldset>
          {bestScores[difficulty] > 0 && <p className="mt-4 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">{difficultyLabels[difficulty]} best: {bestScores[difficulty]}/10</p>}
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
          <p className="mt-3 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-primary">Difficulty: {difficultyLabels[difficulty]}</p>
          <p className="mt-5 text-xl font-semibold">{message}</p>
          <div className="mt-6 grid w-full grid-cols-1 gap-2 min-[360px]:grid-cols-3" aria-label="Best scores by difficulty">
            {gameDifficulties.map((mode) => <div key={mode} className="rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm"><span className="font-semibold">{difficultyLabels[mode]}</span><br />Best: {bestScores[mode]}/10</div>)}
          </div>
          <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
            <Button onClick={startGame} size="lg" className="min-h-12"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Play Again</Button>
            <Button asChild size="lg" variant="outline" className="min-h-12"><Link href="/games/english"><ArrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />English Games</Link></Button>
          </div>
          {nextGame && <Link href={`/games/english/${nextGame.slug}`} className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline">Try another game: {nextGame.title}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>}
          {game.access === 'free' && <AcademyResultsCta gameSlug={game.slug} score={score} />}
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
          <span>Question {questionIndex + 1} of {questions.length}</span><span>{difficultyLabels[difficulty]} · Score: {score}</span>
        </div>
        <div className="mt-3 h-3 overflow-hidden rounded-full bg-blue-100" role="progressbar" aria-label="Game progress" aria-valuemin={0} aria-valuemax={10} aria-valuenow={questionIndex + 1}>
          <div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} />
        </div>

        <div className="flex min-h-52 flex-col items-center justify-center py-7 text-center">
          {question.illustration && <div className="mb-4" role="img" aria-label={question.illustrationLabel ?? 'Question illustration'}><span className="block text-6xl" aria-hidden="true">{question.illustration}</span>{question.illustrationLabel && <span className="mt-2 block max-w-sm text-sm font-medium text-muted-foreground" aria-hidden="true">{question.illustrationLabel}</span>}</div>}
          <h2 className="text-balance text-2xl font-bold leading-relaxed sm:text-3xl">{question.prompt}</h2>
        </div>

        {game.interaction === 'wordOrder' ? <div className="space-y-4">
          <div className="min-h-20 rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 p-3" aria-label="Your sentence">
            {wordOrder.length === 0 ? <p className="py-2 text-center text-sm text-muted-foreground">Tap the words below to build your sentence.</p> : <div className="flex flex-wrap gap-2">{wordOrder.map((choiceIndex) => <span key={choiceIndex} className="rounded-lg bg-white px-3 py-2 font-semibold shadow-sm">{question.choices[choiceIndex]}</span>)}</div>}
          </div>
          <div className="flex flex-wrap justify-center gap-2" aria-label="Available words">{question.choices.map((choice, choiceIndex) => <button key={`${choice}-${choiceIndex}`} type="button" disabled={selectedAnswer !== null || wordOrder.includes(choiceIndex)} onClick={() => setWordOrder((current) => [...current, choiceIndex])} className="min-h-12 rounded-xl border-2 border-violet-200 bg-white px-4 py-2 font-bold hover:border-violet-500 disabled:opacity-40">{choice}</button>)}</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3"><Button type="button" variant="outline" disabled={selectedAnswer !== null || wordOrder.length === 0} onClick={() => setWordOrder((current) => current.slice(0, -1))}><Undo2 className="mr-2 h-4 w-4" />Undo</Button><Button type="button" variant="outline" disabled={selectedAnswer !== null || wordOrder.length === 0} onClick={() => setWordOrder([])}><X className="mr-2 h-4 w-4" />Clear</Button><Button type="button" className="col-span-2 sm:col-span-1" disabled={selectedAnswer !== null || wordOrder.length !== question.choices.length} onClick={() => selectAnswer(wordOrder.map((index) => question.choices[index]).join(' '))}>Check Answer</Button></div>
        </div> : <div className="grid gap-3 sm:grid-cols-2">
          {question.choices.map((choice) => {
            const isSelected = selectedAnswer === choice;
            const isCorrectChoice = selectedAnswer && choice === question.correctAnswer;
            const stateClass = isCorrectChoice ? 'border-green-600 bg-green-50 text-green-800' : isSelected ? 'border-red-500 bg-red-50 text-red-800' : 'border-border bg-white hover:border-primary hover:bg-blue-50';
            return <button key={choice} type="button" disabled={selectedAnswer !== null} onClick={() => selectAnswer(choice)} className={`min-h-14 rounded-xl border-2 px-4 py-3 text-base font-bold capitalize transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-100 ${stateClass}`}>
              {choice}{isCorrectChoice ? ' ✓' : isSelected ? ' ✗' : ''}
            </button>;
          })}
        </div>}

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
