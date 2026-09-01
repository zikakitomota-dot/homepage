'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check, RotateCcw, Settings2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { generateHabitatRound, type Animal, type Habitat, type HabitatDifficulty, type HabitatQuestion } from '@/lib/games/animal-habitats';

type Phase = 'intro' | 'playing' | 'results';

const difficulties = ['easy', 'medium', 'hard'] as const satisfies readonly HabitatDifficulty[];
const details: Record<HabitatDifficulty, { label: string; description: string; note: string }> = {
  easy: { label: 'Easy', description: '2 habitat choices', note: 'Best for beginners' },
  medium: { label: 'Medium', description: '3 habitat choices', note: 'More animals' },
  hard: { label: 'Hard', description: '4 habitats + clues', note: 'For confident explorers' },
};
const positiveMessages = ['Great job!', 'You got it!', 'That’s right!'];
// Set to true only after the final WebP files listed in the artwork READMEs are supplied.
const USE_FINAL_ARTWORK = false;

function Artwork({ src, alt, emoji, habitat = false }: { src: string; alt: string; emoji: string; habitat?: boolean }) {
  const [missing, setMissing] = useState(false);
  useEffect(() => setMissing(false), [src]);

  return <div data-artwork-kind={habitat ? 'habitat' : 'animal'} className={`relative flex w-full items-center justify-center overflow-hidden ${habitat ? 'aspect-[4/3]' : 'h-44 px-2 sm:h-52 sm:px-3'}`}>
    {USE_FINAL_ARTWORK && !missing && <img src={src} alt={alt} decoding="async" draggable={false} onError={() => setMissing(true)} className={`absolute inset-0 h-full w-full ${habitat ? 'object-cover' : 'object-contain'}`} />}
    {(!USE_FINAL_ARTWORK || missing) && <span className={habitat ? 'text-5xl' : 'text-7xl sm:text-8xl'} aria-hidden="true">{emoji}</span>}
  </div>;
}

export function AnimalHabitatsGame() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [difficulty, setDifficulty] = useState<HabitatDifficulty>('easy');
  const [questions, setQuestions] = useState<HabitatQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [attempts, setAttempts] = useState<string[]>([]);
  const [resolved, setResolved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [firstAttemptCorrect, setFirstAttemptCorrect] = useState(0);

  useEffect(() => {
    if (!USE_FINAL_ARTWORK || questions.length === 0) return;
    const sources = new Set([
      ...questions.map(({ animal }) => animal.imagePath),
      ...questions.flatMap(({ choices }) => choices.map(({ imagePath }) => imagePath)),
    ]);
    sources.forEach((src) => {
      const image = new window.Image();
      image.decoding = 'async';
      image.src = src;
    });
  }, [questions]);

  const chooseDifficulty = (mode: HabitatDifficulty) => {
    setDifficulty(mode);
    trackEvent('difficulty_selected', { game: 'animal_habitats', difficulty: mode });
  };

  const startGame = (eventName: 'game_started' | 'play_again' = 'game_started') => {
    const round = generateHabitatRound(difficulty);
    setQuestions(round);
    setQuestionIndex(0);
    setAttempts([]);
    setResolved(false);
    setRevealed(false);
    setCorrectAnswers(0);
    setFirstAttemptCorrect(0);
    setPhase('playing');
    trackEvent(eventName, { game: 'animal_habitats', difficulty, questions: String(round.length) });
  };

  const submitAnswer = (habitat: Habitat) => {
    if (resolved || attempts.includes(habitat.id)) return;
    const question = questions[questionIndex];
    const nextAttempts = [...attempts, habitat.id];
    const correct = habitat.id === question.animal.habitat;
    setAttempts(nextAttempts);
    trackEvent('answer_submitted', { game: 'animal_habitats', difficulty, animal: question.animal.id, correct: String(correct), attempt: String(nextAttempts.length) });

    if (correct) {
      setCorrectAnswers((score) => score + 1);
      if (nextAttempts.length === 1) setFirstAttemptCorrect((score) => score + 1);
      setResolved(true);
      return;
    }

    if (difficulty === 'hard' && nextAttempts.length === 2) {
      setRevealed(true);
      setResolved(true);
    }
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      setPhase('results');
      trackEvent('game_completed', { game: 'animal_habitats', difficulty, correct: String(correctAnswers), first_attempt_correct: String(firstAttemptCorrect), questions: String(questions.length) });
      return;
    }
    setQuestionIndex((index) => index + 1);
    setAttempts([]);
    setResolved(false);
    setRevealed(false);
  };

  if (phase === 'intro') return <Intro difficulty={difficulty} chooseDifficulty={chooseDifficulty} startGame={() => startGame()} />;
  if (phase === 'results') return <Results difficulty={difficulty} score={correctAnswers} firstTry={firstAttemptCorrect} total={questions.length} playAgain={() => startGame('play_again')} changeDifficulty={() => setPhase('intro')} />;

  const question = questions[questionIndex];
  const progress = ((questionIndex + 1) / questions.length) * 100;
  const answerWasCorrect = resolved && !revealed && attempts.at(-1) === question.animal.habitat;

  return <Card className="mx-auto max-w-3xl overflow-hidden border-[#bdc8aa] bg-[#fffdf8] shadow-[0_16px_40px_rgba(64,81,56,0.12)]" data-game-phase="playing">
    <CardContent className="p-3 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm font-bold text-[#52604f]">
        <span>Question {questionIndex + 1} of {questions.length}</span>
        <span>{details[difficulty].label} · {correctAnswers} correct</span>
      </div>
      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#e5eadc]" role="progressbar" aria-label="Game progress" aria-valuemin={1} aria-valuemax={questions.length} aria-valuenow={questionIndex + 1}>
        <div className="h-full rounded-full bg-[#6f8b64] transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} />
      </div>

      <div className="py-5 text-center sm:py-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#728069]">Animal Habitats</p>
        <h2 className="mt-2 text-balance text-2xl font-bold sm:text-3xl">{question.useClue ? 'Which habitat matches this clue?' : 'Where does this animal live?'}</h2>
        {question.useClue && <p className="mx-auto mt-3 max-w-xl rounded-2xl bg-[#f8edcf] px-4 py-3 text-base font-medium leading-relaxed text-[#634d28]">“{question.animal.clue}”</p>}
      </div>

      <div className="mx-auto max-w-sm rounded-[1.75rem] border border-[#d8d5c7] bg-[#f5f1e7] p-4 text-center shadow-sm">
        <Artwork src={question.animal.imagePath} alt={`${question.animal.name} illustration`} emoji={question.animal.emoji} />
        <p className="mt-2 text-2xl font-extrabold text-[#2f3b2d]">{question.animal.name}</p>
      </div>

      <div className={`mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 ${question.choices.length === 3 ? 'sm:grid-cols-3' : question.choices.length === 4 ? 'sm:grid-cols-4' : 'sm:grid-cols-2'}`} aria-label="Habitat choices">
        {question.choices.map((habitat) => {
          const tried = attempts.includes(habitat.id);
          const isCorrect = resolved && habitat.id === question.animal.habitat;
          const state = isCorrect ? 'ring-4 ring-[#4b7d51] ring-offset-2' : tried ? 'ring-4 ring-[#bc754f] ring-offset-2' : 'hover:-translate-y-0.5 hover:shadow-md';
          return <button key={habitat.id} type="button" disabled={resolved || tried} onClick={() => submitAnswer(habitat)} aria-label={`Choose ${habitat.name}${tried ? ', already tried' : ''}`} className={`relative min-h-40 overflow-hidden rounded-2xl border-2 p-2.5 font-bold transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#355d77] focus-visible:ring-offset-2 disabled:cursor-default disabled:opacity-100 sm:min-h-44 ${habitat.palette} ${state}`}>
            <Artwork src={habitat.imagePath} alt={`${habitat.name} habitat`} emoji={habitat.emoji} habitat />
            <span className="mt-1 flex items-center justify-center gap-1.5 text-base sm:text-lg">{isCorrect && <Check className="h-5 w-5" aria-hidden="true" />}{tried && !isCorrect && <X className="h-5 w-5" aria-hidden="true" />}{habitat.name}</span>
          </button>;
        })}
      </div>

      {attempts.length > 0 && !resolved && <div className="mt-5 rounded-2xl border border-[#e4c38d] bg-[#fff7e8] p-4 text-center" role="status" aria-live="polite"><p className="text-lg font-bold text-[#765127]">Try again!</p><p className="mt-1 text-sm text-[#765127]">Choose another habitat.</p></div>}
      {resolved && <div className={`mt-5 rounded-2xl border p-4 sm:p-5 ${answerWasCorrect ? 'border-[#a8c9a5] bg-[#edf6e9]' : 'border-[#e4c38d] bg-[#fff7e8]'}`} role="status" aria-live="polite">
        <p className="text-lg font-extrabold">{answerWasCorrect ? `✓ ${positiveMessages[questionIndex % positiveMessages.length]}` : `The answer is ${question.choices.find((item) => item.id === question.animal.habitat)?.name}.`}</p>
        <p className="mt-2 leading-relaxed">{question.animal.fact}</p>
        <Button onClick={nextQuestion} className="mt-4 min-h-12 w-full bg-[#52704d] text-base hover:bg-[#435e40] sm:w-auto">{questionIndex === questions.length - 1 ? 'See Results' : 'Next'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
      </div>}
    </CardContent>
  </Card>;
}

function Intro({ difficulty, chooseDifficulty, startGame }: { difficulty: HabitatDifficulty; chooseDifficulty: (mode: HabitatDifficulty) => void; startGame: () => void }) {
  return <Card className="mx-auto max-w-3xl overflow-hidden border-[#bdc8aa] bg-[#fffdf8] shadow-[0_16px_40px_rgba(64,81,56,0.12)]" data-game-phase="intro">
    <CardContent className="px-4 py-9 text-center sm:px-9 sm:py-12">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e6eedc] text-5xl shadow-inner" aria-hidden="true">🦊</div>
      <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#68785f]">Animal Habitats</p>
      <h2 className="mt-2 text-balance text-4xl font-extrabold tracking-tight text-[#2f3b2d] sm:text-5xl">Where Do I Live?</h2>
      <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-[#586355]">Match each animal to its habitat.</p>
      <fieldset className="mx-auto mt-8 max-w-2xl"><legend className="sr-only">Choose difficulty</legend><div className="grid gap-3 sm:grid-cols-3">
        {difficulties.map((mode) => { const selected = difficulty === mode; return <button key={mode} type="button" aria-pressed={selected} onClick={() => chooseDifficulty(mode)} className={`min-h-28 rounded-2xl border-2 px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#355d77] focus-visible:ring-offset-2 ${selected ? 'border-[#52704d] bg-[#eaf2e3] shadow-sm' : 'border-[#d8d5c7] bg-white hover:border-[#91aa79]'}`}><span className="block text-xl font-extrabold">{details[mode].label}</span><span className="mt-1 block text-sm font-semibold text-[#596454]">{details[mode].description}</span><span className="mt-2 block text-xs text-muted-foreground">{details[mode].note}</span></button>; })}
      </div></fieldset>
      <Button onClick={startGame} size="lg" className="mt-7 min-h-12 w-full bg-[#52704d] text-base hover:bg-[#435e40] sm:w-auto sm:min-w-52">Start Game<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
    </CardContent>
  </Card>;
}

function Results({ difficulty, score, firstTry, total, playAgain, changeDifficulty }: { difficulty: HabitatDifficulty; score: number; firstTry: number; total: number; playAgain: () => void; changeDifficulty: () => void }) {
  const percentage = Math.round((score / total) * 100);
  const message = percentage >= 90 ? 'Habitat Expert!' : percentage >= 70 ? 'Great Exploring!' : 'Nice Try — Let’s Explore Again!';
  return <Card className="mx-auto max-w-2xl overflow-hidden border-[#bdc8aa] bg-[#fffdf8] shadow-[0_16px_40px_rgba(64,81,56,0.12)]" data-game-phase="results"><CardContent className="flex min-h-[470px] flex-col items-center justify-center px-5 py-10 text-center sm:px-10">
    <Sparkles className="h-12 w-12 text-[#c18a3d] motion-safe:animate-pulse" aria-hidden="true" />
    <h2 className="mt-4 text-4xl font-extrabold text-[#2f3b2d]">{message}</h2>
    <p className="mt-6 text-sm font-bold uppercase tracking-wider text-[#68785f]">Animals matched</p>
    <p className="mt-1 text-6xl font-extrabold text-[#52704d]">{score} <span className="text-3xl text-[#6a7466]">/ {total}</span></p>
    <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm font-bold"><span className="rounded-full bg-[#eaf2e3] px-4 py-2">{details[difficulty].label}</span><span className="rounded-full bg-[#f8edcf] px-4 py-2">First try: {firstTry}/{total}</span></div>
    <p className="mt-5 max-w-md text-lg text-[#586355]">You completed every question. Each round mixes the animals and habitats again.</p>
    <div className="mt-8 grid w-full gap-3 sm:grid-cols-2"><Button onClick={playAgain} size="lg" className="min-h-12 bg-[#52704d] hover:bg-[#435e40]"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Play Again</Button><Button onClick={changeDifficulty} size="lg" variant="outline" className="min-h-12 border-[#91aa79]"><Settings2 className="mr-2 h-5 w-5" aria-hidden="true" />Change Difficulty</Button></div>
    <Link href="/games" className="mt-6 inline-flex min-h-11 items-center font-semibold text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />Back to Learning Games</Link>
  </CardContent></Card>;
}
