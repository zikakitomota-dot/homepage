'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Feather, FlaskConical, Leaf, MoveRight, RotateCcw, Search, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { generateLivingRound, type LifeClassification, type LivingItem, type LivingQuestion } from '@/lib/games/living-or-non-living';
import { useLearningSession } from '@/hooks/use-learning-session';

type Phase = 'intro' | 'playing' | 'results';
const GAME_ID = 'living_or_non_living';
const typeLabels = { identify: 'Identify It', sorting: 'Sorting Laboratory', evidence: 'Spot the Evidence', detective: 'Science Detective' } as const;

export function LivingOrNonLivingGame() {
  const { startLearningSession, completeLearningSession } = useLearningSession('living-or-non-living');
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<LivingQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<LifeClassification | null>(null);
  const [assignments, setAssignments] = useState<Record<string, LifeClassification>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [resolved, setResolved] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (phase !== 'intro') headingRef.current?.focus();
  }, [phase, questionIndex]);

  const startGame = (eventName: 'game_started' | 'play_again' = 'game_started') => {
    const round = generateLivingRound();
    setQuestions(round); setQuestionIndex(0); setScore(0); setSelectedAnswer(null); setAssignments({}); setSelectedItem(null); setResolved(false); setWasCorrect(false); setPhase('playing');
    startLearningSession();
    trackEvent(eventName, { game: GAME_ID, difficulty: 'level_1', questions: String(round.length) });
  };

  const resolve = (correct: boolean, answer: string) => {
    if (resolved) return;
    setWasCorrect(correct); setResolved(true);
    if (correct) setScore((value) => value + 1);
    const question = questions[questionIndex];
    trackEvent('answer_submitted', { game: GAME_ID, difficulty: 'level_1', question_id: question.id, question_type: question.type, answer, correct: String(correct) });
  };

  const chooseAnswer = (answer: LifeClassification) => {
    const question = questions[questionIndex];
    if (resolved || question.type === 'sorting') return;
    setSelectedAnswer(answer);
    resolve(answer === question.correctAnswer, answer);
  };

  const assignSelected = (classification: LifeClassification) => {
    if (!selectedItem || resolved) return;
    setAssignments((current) => ({ ...current, [selectedItem]: classification }));
    setSelectedItem(null);
  };

  const checkSorting = () => {
    const question = questions[questionIndex];
    if (question.type !== 'sorting' || resolved || question.items.some((entry) => !assignments[entry.id])) return;
    const correct = question.items.every((entry) => assignments[entry.id] === entry.classification);
    resolve(correct, question.items.map((entry) => `${entry.id}:${assignments[entry.id]}`).join(','));
  };

  const nextQuestion = () => {
    const nextScore = score;
    if (questionIndex === questions.length - 1) {
      completeLearningSession(nextScore, questions.length);
      setPhase('results');
      trackEvent('game_completed', { game: GAME_ID, difficulty: 'level_1', correct: String(nextScore), questions: String(questions.length) });
      return;
    }
    setQuestionIndex((value) => value + 1); setSelectedAnswer(null); setAssignments({}); setSelectedItem(null); setResolved(false); setWasCorrect(false);
  };

  if (phase === 'intro') return <Intro onStart={() => startGame()} />;
  if (phase === 'results') return <Results score={score} onReplay={() => startGame('play_again')} headingRef={headingRef} />;

  const question = questions[questionIndex];
  const progress = ((questionIndex + 1) / questions.length) * 100;
  return <Card className="mx-auto max-w-3xl overflow-hidden border-[#bdc8aa] bg-[#fffdf8] shadow-[0_16px_40px_rgba(64,81,56,0.12)]" data-game-phase="playing">
    <CardContent className="p-3 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-sm font-bold text-[#52604f]"><span>Challenge {questionIndex + 1} of 10</span><span>Level 1 · Score: {score}</span></div>
      <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#e5eadc]" role="progressbar" aria-label="Game progress" aria-valuemin={1} aria-valuemax={10} aria-valuenow={questionIndex + 1}><div className="h-full rounded-full bg-[#6f8b64] transition-[width] motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
      <div className="py-5 text-center sm:py-7">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#68785f]">{typeLabels[question.type]}</p>
        <h2 ref={headingRef} tabIndex={-1} className="mt-2 text-balance text-2xl font-extrabold tracking-tight outline-none sm:text-3xl">{question.prompt}</h2>
      </div>

      {question.type === 'sorting'
        ? <SortingLaboratory question={question} assignments={assignments} selectedItem={selectedItem} setSelectedItem={setSelectedItem} assignSelected={assignSelected} check={checkSorting} resolved={resolved} />
        : <ChoiceChallenge question={question} selected={selectedAnswer} choose={chooseAnswer} resolved={resolved} />}

      {resolved && <div className={`mt-6 rounded-2xl border p-5 ${wasCorrect ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`} role="status" aria-live="polite">
        <p className="flex items-center gap-2 text-lg font-extrabold">{wasCorrect ? <Check className="h-6 w-6 text-emerald-700" aria-hidden="true" /> : <X className="h-6 w-6 text-amber-700" aria-hidden="true" />}{wasCorrect ? 'Excellent science thinking!' : 'Let’s look at the evidence.'}</p>
        <p className="mt-2 leading-relaxed">{question.explanation}</p>
        {question.type === 'sorting' && <ul className="mt-3 space-y-1 text-sm text-muted-foreground">{question.items.filter((entry) => entry.lifeState === 'once-living').map((entry) => <li key={entry.id}><strong className="text-foreground">{entry.name}:</strong> {entry.explanation}</li>)}</ul>}
        {question.type !== 'sorting' && question.item.lifeState === 'once-living' && <p className="mt-3 inline-flex rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900">Once living · non-living now</p>}
        <Button onClick={nextQuestion} className="mt-5 min-h-12 w-full bg-[#52704d] hover:bg-[#435e40] sm:w-auto">{questionIndex === 9 ? 'See My Results' : 'Next Challenge'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
      </div>}
    </CardContent>
  </Card>;
}

function ChoiceChallenge({ question, selected, choose, resolved }: { question: Exclude<LivingQuestion, { type: 'sorting' }>; selected: LifeClassification | null; choose: (answer: LifeClassification) => void; resolved: boolean }) {
  return <div>
    <div className="mx-auto flex min-h-48 max-w-sm flex-col items-center justify-center rounded-[1.75rem] border border-[#d8d5c7] bg-[#f5f1e7] p-5 text-center shadow-sm">
      <ItemIllustration item={question.item} large />
      <p className="mt-3 text-2xl font-extrabold text-[#2f3b2d]">{question.item.name}</p>
    </div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2" aria-label="Classification choices">{question.choices.map((choice) => {
      const correct = resolved && choice === question.correctAnswer;
      const wrong = resolved && selected === choice && choice !== question.correctAnswer;
      return <button key={choice} type="button" disabled={resolved} onClick={() => choose(choice)} className={`min-h-16 rounded-2xl border-2 px-5 py-4 text-xl font-extrabold capitalize transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 ${correct ? 'border-emerald-600 bg-emerald-50' : wrong ? 'border-amber-600 bg-amber-50' : 'border-[#cbd5bd] bg-white hover:border-[#52704d] hover:bg-[#f1f6ed]'}`}>{correct && <Check className="mr-2 inline h-5 w-5" aria-hidden="true" />}{wrong && <X className="mr-2 inline h-5 w-5" aria-hidden="true" />}{choice === 'non-living' ? 'Non-Living' : 'Living'}</button>;
    })}</div>
  </div>;
}

function SortingLaboratory({ question, assignments, selectedItem, setSelectedItem, assignSelected, check, resolved }: { question: Extract<LivingQuestion, { type: 'sorting' }>; assignments: Record<string, LifeClassification>; selectedItem: string | null; setSelectedItem: (id: string) => void; assignSelected: (classification: LifeClassification) => void; check: () => void; resolved: boolean }) {
  const unplaced = question.items.filter((entry) => !assignments[entry.id]);
  const selected = question.items.find((entry) => entry.id === selectedItem);
  return <div className="rounded-2xl border border-[#cad6bd] bg-[#f1f6ed] p-3 sm:p-5">
    <p className="text-center font-semibold" aria-live="polite">{selected ? `${selected.name} selected. Choose a zone.` : `${unplaced.length} of ${question.items.length} items left to place.`}</p>
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="Items to sort">{question.items.map((entry) => {
      const active = selectedItem === entry.id;
      const placed = assignments[entry.id];
      return <button key={entry.id} type="button" disabled={resolved} aria-pressed={active} onClick={() => setSelectedItem(entry.id)} className={`min-h-24 rounded-xl border-2 p-2 text-center transition motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-100 ${active ? 'border-[#52704d] bg-white ring-2 ring-[#52704d]' : placed ? 'border-[#aebca3] bg-white/70' : 'border-[#cbd5bd] bg-white hover:border-[#52704d]'}`}><ItemIllustration item={entry} /><span className="mt-1 block text-sm font-bold">{entry.name}</span>{placed && <span className="mt-1 block text-xs font-semibold text-[#52604f]">In {placed === 'living' ? 'Living' : 'Non-Living'}</span>}</button>;
    })}</div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2" aria-label="Sorting zones">
      <Zone label="Living" description="Plants, animals and other organisms" icon={<Leaf className="h-6 w-6" />} selected={selected} onClick={() => assignSelected('living')} disabled={!selected || resolved} />
      <Zone label="Non-Living" description="Objects and things not alive now" icon={<FlaskConical className="h-6 w-6" />} selected={selected} onClick={() => assignSelected('non-living')} disabled={!selected || resolved} />
    </div>
    <p className="mt-3 text-center text-sm text-muted-foreground"><MoveRight className="mr-1 inline h-4 w-4" aria-hidden="true" />Select an item, then choose its zone. Select a placed item to move it.</p>
    <Button onClick={check} disabled={unplaced.length > 0 || resolved} className="mx-auto mt-5 flex min-h-12 w-full bg-[#52704d] hover:bg-[#435e40] sm:w-auto">Check My Sorting</Button>
  </div>;
}

function Zone({ label, description, icon, selected, onClick, disabled }: { label: string; description: string; icon: React.ReactNode; selected?: LivingItem; onClick: () => void; disabled: boolean }) {
  return <button type="button" onClick={onClick} disabled={disabled} aria-label={`${label} zone${selected ? `; place ${selected.name}` : ''}`} className="min-h-24 rounded-2xl border-2 border-dashed border-[#77906d] bg-white p-4 text-left transition hover:bg-[#f9fcf7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"><span className="flex items-center gap-2 text-lg font-extrabold text-[#354b34]">{icon}{label}</span><span className="mt-1 block text-sm text-muted-foreground">{description}</span></button>;
}

function ItemIllustration({ item, large = false }: { item: LivingItem; large?: boolean }) {
  if (item.id === 'fallen-feather') return <span className={`mx-auto flex items-center justify-center text-[#52704d] ${large ? 'h-24 w-24' : 'h-12 w-12'}`} role="img" aria-label={`${item.name} illustration`}><Feather className={large ? 'h-20 w-20' : 'h-10 w-10'} strokeWidth={1.8} aria-hidden="true" /></span>;
  return <span className={large ? 'text-7xl sm:text-8xl' : 'block text-4xl'} role="img" aria-label={`${item.name} illustration`}>{item.emoji}</span>;
}

function Intro({ onStart }: { onStart: () => void }) {
  return <Card className="mx-auto max-w-3xl overflow-hidden border-[#bdc8aa] bg-[#fffdf8] shadow-[0_16px_40px_rgba(64,81,56,0.12)]" data-game-phase="intro"><CardContent className="p-5 text-center sm:p-9">
    <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#e7f0df] text-[#52704d]"><Search className="h-10 w-10" aria-hidden="true" /></span>
    <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.18em] text-[#68785f]">Science · Level 1 · Free</p>
    <h2 className="mt-2 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">Living or Non-Living?</h2>
    <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">Look for evidence, sort familiar items and discover why movement alone does not make something alive. Ten challenges use plants, animals, objects and once-living materials.</p>
    <div className="mx-auto mt-7 grid max-w-xl gap-3 text-left sm:grid-cols-2"><Feature emoji="🐈" title="Identify It">Classify familiar examples.</Feature><Feature emoji="🧪" title="Sorting Laboratory">Place every item in a zone.</Feature><Feature emoji="🌱" title="Spot the Evidence">Use growth and life-process clues.</Feature><Feature emoji="🔎" title="Science Detective">Think carefully about tricky observations.</Feature></div>
    <Button onClick={onStart} size="lg" className="mt-8 min-h-12 bg-[#52704d] px-8 hover:bg-[#435e40]">Start Science Adventure<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
  </CardContent></Card>;
}

function Feature({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) { return <div className="rounded-2xl border border-[#d8decf] bg-[#f5f1e7] p-4"><span className="text-2xl" aria-hidden="true">{emoji}</span><strong className="ml-2">{title}</strong><p className="mt-2 text-sm text-muted-foreground">{children}</p></div>; }

function Results({ score, onReplay, headingRef }: { score: number; onReplay: () => void; headingRef: React.Ref<HTMLHeadingElement> }) {
  const message = score >= 9 ? 'Science Superstar!' : score >= 7 ? 'Brilliant Observer!' : 'Curious Scientist!';
  return <Card className="mx-auto max-w-xl border-[#bdc8aa] bg-[#fffdf8] text-center shadow-[0_16px_40px_rgba(64,81,56,0.12)]" data-game-phase="results"><CardContent className="p-6 sm:p-10"><Sparkles className="mx-auto h-11 w-11 text-amber-500" aria-hidden="true" /><h2 ref={headingRef} tabIndex={-1} className="mt-4 text-3xl font-extrabold outline-none">{message}</h2><p className="mt-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">Your score</p><p className="mt-1 text-5xl font-extrabold text-[#52704d]">{score}<span className="text-xl text-muted-foreground"> / 10</span></p><p className="mt-5 leading-relaxed text-muted-foreground">You used evidence to classify living things, non-living objects and materials that were once alive.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><Button onClick={onReplay} className="min-h-12 bg-[#52704d] hover:bg-[#435e40]"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Play Again</Button><Button asChild variant="outline" className="min-h-12"><Link href="/games/science">Back to Science</Link></Button></div></CardContent></Card>;
}
