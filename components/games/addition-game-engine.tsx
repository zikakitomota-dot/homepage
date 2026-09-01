'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RotateCcw, Settings2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateAdditionRound, type AdditionDifficulty, type AdditionQuestion } from '@/lib/games/addition-level-one';
import { getDifficultyProgress, readPreferredDifficulty, readProgress, recordGameResult, writePreferredDifficulty } from '@/lib/games/progress';

type Phase = 'intro' | 'playing' | 'results';

const GAME_SLUG = 'addition-level-1';
const difficulties = ['easy', 'normal', 'challenge'] as const satisfies readonly AdditionDifficulty[];
const difficultyDetails: Record<AdditionDifficulty, { label: string; icon: string; description: string }> = {
  easy: { label: 'Easy', icon: '🟢', description: 'Addition within 10' },
  normal: { label: 'Medium', icon: '🔵', description: 'Within 20 + 3 word problems' },
  challenge: { label: 'Hard', icon: '🟣', description: 'Within 20 + 5 word problems' },
};
const correctMessages = ['Great job!', 'Correct!', 'Nice work!'];

export function AdditionGameEngine() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<AdditionQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<AdditionDifficulty>('easy');
  const [bestScores, setBestScores] = useState<Record<AdditionDifficulty, number>>({ easy: 0, normal: 0, challenge: 0 });

  useEffect(() => {
    const preferred = readPreferredDifficulty() as AdditionDifficulty;
    const validDifficulty = difficulties.includes(preferred) ? preferred : 'easy';
    const progress = readProgress();
    setDifficulty(validDifficulty);
    setBestScores(Object.fromEntries(difficulties.map((mode) => [mode, getDifficultyProgress(progress, GAME_SLUG, mode).bestScore])) as Record<AdditionDifficulty, number>);
  }, []);

  const chooseDifficulty = (nextDifficulty: AdditionDifficulty) => {
    setDifficulty(nextDifficulty);
    writePreferredDifficulty(nextDifficulty);
  };

  const startGame = () => {
    setQuestions(generateAdditionRound(difficulty));
    setQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setPhase('playing');
  };

  const selectAnswer = (answer: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    if (answer === questions[questionIndex].correctAnswer) setScore((current) => current + 1);
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      recordGameResult(GAME_SLUG, difficulty, score);
      setBestScores((current) => ({ ...current, [difficulty]: Math.max(current[difficulty], score) }));
      setPhase('results');
      return;
    }
    setQuestionIndex((current) => current + 1);
    setSelectedAnswer(null);
  };

  if (phase === 'intro') {
    return <Card className="mx-auto max-w-2xl overflow-hidden border-blue-200 bg-white shadow-lg" data-game-phase="intro">
      <CardContent className="flex min-h-[420px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10">
        <span className="text-6xl" aria-hidden="true">➕</span>
        <p className="mt-5 text-sm font-bold uppercase tracking-wider text-primary">Math · Level 1 · Free</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Addition Level 1</h2>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted-foreground">Choose a difficulty, then solve 10 friendly addition questions.</p>
        <fieldset className="mt-7 w-full max-w-lg">
          <legend className="mb-3 text-sm font-bold text-foreground">Choose difficulty</legend>
          <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-3" role="radiogroup" aria-label="Choose difficulty">
            {difficulties.map((mode) => {
              const selected = difficulty === mode;
              const detail = difficultyDetails[mode];
              return <button key={mode} type="button" role="radio" aria-checked={selected} onClick={() => chooseDifficulty(mode)} className={`min-h-[72px] rounded-xl border-2 px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${selected ? 'border-primary bg-blue-50 text-primary' : 'border-border bg-white hover:border-primary/60'}`}>
                <span className="block font-bold"><span aria-hidden="true">{detail.icon}</span> {detail.label}</span>
                <span className="mt-1 block text-xs font-medium text-muted-foreground">{detail.description}</span>
              </button>;
            })}
          </div>
        </fieldset>
        {bestScores[difficulty] > 0 && <p className="mt-4 rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">{difficultyDetails[difficulty].label} best: {bestScores[difficulty]}/10</p>}
        <Button onClick={startGame} size="lg" className="mt-8 min-h-12 w-full text-base sm:w-auto sm:min-w-48">Start Game<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
      </CardContent>
    </Card>;
  }

  if (phase === 'results') {
    const percentage = score * 10;
    const message = score === 10 ? 'Amazing work! 🌟' : score >= 8 ? 'Great job! 🎉' : score >= 6 ? 'Nice work — keep practising! 👍' : 'Good try! Play again and see if you can improve. 🌱';
    return <Card className="mx-auto max-w-2xl overflow-hidden border-blue-200 bg-white shadow-lg" data-game-phase="results">
      <CardContent className="flex min-h-[440px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10">
        <Sparkles className="h-12 w-12 text-amber-500 motion-safe:animate-pulse" aria-hidden="true" />
        <h2 className="mt-4 text-4xl font-bold">Well Done!</h2>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Score</p>
        <p className="mt-1 text-6xl font-bold text-primary">{score} <span className="text-3xl text-muted-foreground">/ 10</span></p>
        <p className="mt-2 text-lg font-semibold">{percentage}%</p>
        <p className="mt-3 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-primary">Difficulty: {difficultyDetails[difficulty].label}</p>
        <p className="mt-5 text-xl font-semibold">{message}</p>
        <div className="mt-6 grid w-full grid-cols-1 gap-2 min-[360px]:grid-cols-3" aria-label="Best scores by difficulty">
          {difficulties.map((mode) => <div key={mode} className="rounded-xl border border-border bg-secondary/30 px-3 py-2 text-sm"><span className="font-semibold">{difficultyDetails[mode].label}</span><br />Best: {bestScores[mode]}/10</div>)}
        </div>
        <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
          <Button onClick={startGame} size="lg" className="min-h-12"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Play Again</Button>
          <Button onClick={() => setPhase('intro')} size="lg" variant="outline" className="min-h-12"><Settings2 className="mr-2 h-5 w-5" aria-hidden="true" />Change Difficulty</Button>
        </div>
        <Link href="/games" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Back to Learning Games</Link>
      </CardContent>
    </Card>;
  }

  const question = questions[questionIndex];
  const answeredCorrectly = selectedAnswer === question.correctAnswer;
  const progress = ((questionIndex + 1) / questions.length) * 100;

  return <Card className="mx-auto max-w-2xl overflow-hidden border-blue-200 bg-white shadow-lg" data-game-phase="playing">
    <CardContent className="p-4 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-2 text-sm font-bold text-muted-foreground">
        <span>Question {questionIndex + 1} of {questions.length}</span>
        <span>{difficultyDetails[difficulty].label} · Score: {score}</span>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-blue-100" role="progressbar" aria-label="Game progress" aria-valuemin={0} aria-valuemax={10} aria-valuenow={questionIndex + 1}>
        <div className="h-full rounded-full bg-primary transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} />
      </div>

      <div className="flex min-h-48 flex-col items-center justify-center py-6 text-center sm:min-h-52 sm:py-7">
        {question.kind === 'wordProblem' && <p className="mb-3 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">Word problem</p>}
        <h2 className="text-balance text-2xl font-bold leading-relaxed sm:text-3xl">{question.prompt}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3" aria-label="Answer choices">
        {question.choices.map((choice) => {
          const isSelected = selectedAnswer === choice;
          const isCorrectChoice = selectedAnswer !== null && choice === question.correctAnswer;
          const stateClass = isCorrectChoice ? 'border-green-600 bg-green-50 text-green-800' : isSelected ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-border bg-white hover:border-primary hover:bg-blue-50';
          return <button key={choice} type="button" disabled={selectedAnswer !== null} onClick={() => selectAnswer(choice)} className={`min-h-14 rounded-xl border-2 px-4 py-3 text-xl font-bold transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-100 ${stateClass}`}>
            {choice}{isCorrectChoice ? ' ✓' : isSelected ? ' ✗' : ''}
          </button>;
        })}
      </div>

      {selectedAnswer !== null && <div className={`mt-5 rounded-xl border p-4 ${answeredCorrectly ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`} role="status" aria-live="polite">
        <p className="text-lg font-bold">{answeredCorrectly ? `✓ ${correctMessages[questionIndex % correctMessages.length]}` : `Almost! The answer is ${question.correctAnswer}.`}</p>
        <p className="mt-2 text-sm leading-relaxed">{question.explanation}</p>
        <Button onClick={nextQuestion} className="mt-4 min-h-12 w-full text-base sm:w-auto">{questionIndex === questions.length - 1 ? 'See Results' : 'Next Question'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
      </div>}
    </CardContent>
  </Card>;
}
