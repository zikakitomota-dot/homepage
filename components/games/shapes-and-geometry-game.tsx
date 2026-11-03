'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, RotateCcw, Shapes, Sparkles, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLearningSession } from '@/hooks/use-learning-session';
import { trackEvent } from '@/lib/analytics';
import { createSessionId } from '@/lib/games/learning-journey';
import {
  GEOMETRY_GAME_ID,
  generateGeometrySession,
  geometryMechanicLabels,
  objectLabels,
  shapeFacts,
  type GeometryChallenge,
  type GeometryChoice,
  type GeometryObject,
  type GeometryShape,
  type SymmetryFigure,
  type SymmetryMark,
} from '@/lib/games/shapes-and-geometry';

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2';
const eventDimensions = { game: GEOMETRY_GAME_ID, subject: 'mathematics', level: '1' };

export function ShapesAndGeometryGame() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [questions, setQuestions] = useState<GeometryChallenge[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const running = useRef(false);
  const finished = useRef(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const { startLearningSession, completeLearningSession } = useLearningSession(GEOMETRY_GAME_ID, { trackAchievementEvents: false });
  const question = questions[index];
  const selected = answers[index] ?? null;
  const score = answers.reduce((total, answer, position) => total + Number(answer === questions[position].correctChoiceId), 0);

  useEffect(() => {
    const target = phase === 'results' ? resultsHeading.current : phase === 'playing' ? selected ? nextButton.current : questionHeading.current : null;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [phase, index, selected]);

  const start = () => {
    if (running.current) return;
    running.current = true;
    finished.current = false;
    setQuestions(generateGeometrySession(createSessionId()));
    setIndex(0);
    setAnswers([]);
    startLearningSession();
    setPhase('playing');
    trackEvent('game_started', eventDimensions);
  };

  const choose = (id: string) => {
    if (selected || !question.choices.some(choice => choice.id === id)) return;
    setAnswers(current => [...current, id]);
  };

  const next = () => {
    if (!selected || finished.current) return;
    if (index === 9) {
      finished.current = true;
      running.current = false;
      completeLearningSession(score, 10);
      setPhase('results');
      trackEvent('game_completed', eventDimensions);
    } else setIndex(current => current + 1);
  };

  if (phase === 'intro') return <section className="mx-auto max-w-3xl rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="geometry-welcome" data-geometry-phase="intro">
    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-800"><Shapes className="h-8 w-8" aria-hidden="true" /></span>
    <p className="mt-5 text-sm font-bold uppercase tracking-wider text-blue-800">Mathematics · Level 1 · Free</p>
    <h2 id="geometry-welcome" className="mt-2 text-balance text-3xl font-extrabold sm:text-4xl">Ready to explore shapes?</h2>
    <p className="mt-4 max-w-2xl leading-7">Name familiar 2D shapes, count straight sides and corners, match objects to their main outlines, and find figures with matching halves. Every session has ten questions and no timer or penalty.</p>
    <div className="mt-6 grid grid-cols-4 gap-2 rounded-2xl bg-blue-50 p-4" aria-hidden="true">{(['circle', 'triangle', 'square', 'heart'] as const).map(shape => <ShapePicture key={shape} shape={shape} decorative compact />)}</div>
    <ol className="mt-6 list-decimal space-y-2 pl-5 leading-7"><li>Look at the outline or everyday object.</li><li>Choose one answer using touch, mouse or keyboard.</li><li>Read the short explanation before continuing.</li></ol>
    <Button onClick={start} className="mt-7 min-h-12 w-full bg-blue-800 hover:bg-blue-900 sm:w-auto">Start geometry session<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
    <p className="mt-4 text-sm leading-6 text-muted-foreground">Use Tab to reach every answer and Enter or Space to choose. Your completed score stays in My Learning Journey on this browser.</p>
  </section>;

  if (phase === 'results') return <section className="mx-auto max-w-3xl rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="geometry-results" data-geometry-phase="results">
    <Trophy className="h-12 w-12 text-amber-500" aria-hidden="true" />
    <h2 id="geometry-results" ref={resultsHeading} tabIndex={-1} className="mt-4 scroll-mt-24 text-3xl font-extrabold outline-none">Geometry session complete</h2>
    <p className="mt-4 text-2xl font-bold">You solved {score} of 10 shape challenges.</p>
    <p className="mt-3 leading-7">Each outline, object and symmetry clue is useful practice. The score records this session; it is not a formal assessment.</p>
    <h3 className="mt-6 text-xl font-bold">Skills you practised</h3>
    <ul className="mt-3 grid gap-2 sm:grid-cols-2">{Object.values(geometryMechanicLabels).map(label => <li key={label} className="rounded-lg bg-blue-50 p-3">{label}</li>)}</ul>
    <div className="mt-6 flex flex-wrap gap-3"><Button onClick={start} className="min-h-12 bg-blue-800 hover:bg-blue-900"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Play a new session</Button><Button asChild variant="outline" className="min-h-12"><Link href="/games/my-learning-journey">My Learning Journey</Link></Button></div>
    <nav aria-label="Continue learning" className="mt-5 flex flex-wrap gap-4"><Link href="/games/math" className={`inline-flex min-h-12 items-center rounded font-semibold text-blue-800 underline ${focusClass}`}>Mathematics Games</Link><Link href="/games/math/addition-level-1" className={`inline-flex min-h-12 items-center rounded font-semibold text-blue-800 underline ${focusClass}`}>Play Addition Level 1</Link><Link href="/games/math/subtraction-level-1" className={`inline-flex min-h-12 items-center rounded font-semibold text-blue-800 underline ${focusClass}`}>Play Subtraction Adventure</Link></nav>
  </section>;

  const correct = selected === question.correctChoiceId;
  const correctChoice = question.choices.find(choice => choice.id === question.correctChoiceId)!;
  return <section className="mx-auto max-w-3xl min-w-0 rounded-3xl border border-blue-200 bg-white p-4 shadow-sm sm:p-7" aria-labelledby="geometry-question" data-geometry-phase="playing" data-challenge-id={question.id} data-mechanic={question.mechanic}>
    <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold"><span>Question {index + 1} of 10</span><span>Score: {score}</span></div>
    <div role="progressbar" aria-label={`Question ${index + 1} of 10`} aria-valuemin={0} aria-valuemax={10} aria-valuenow={index + 1} className="mt-3 h-3 overflow-hidden rounded-full bg-blue-100"><div className="h-full rounded-full bg-blue-700 motion-safe:transition-[width]" style={{ width: `${(index + 1) * 10}%` }} /></div>
    <p className="mt-5 text-sm font-bold uppercase tracking-wider text-blue-800">{geometryMechanicLabels[question.mechanic]}</p>
    <h2 id="geometry-question" ref={questionHeading} tabIndex={-1} className="mt-2 scroll-mt-24 text-balance text-2xl font-extrabold outline-none sm:text-3xl">{question.prompt}</h2>
    <p id="geometry-instruction" className="mt-3 leading-7">{question.instruction}</p>
    <QuestionVisual question={question} />
    <fieldset className="mt-6" aria-describedby="geometry-instruction"><legend className="sr-only">Choose one answer</legend><div className={`grid gap-3 ${question.mechanic === 'symmetry' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2'}`}>{question.choices.map((choice, choiceIndex) => {
      const right = selected !== null && choice.id === question.correctChoiceId;
      const wrong = selected === choice.id && !right;
      return <button key={choice.id} type="button" data-choice-id={choice.id} disabled={selected !== null} aria-pressed={selected === choice.id} aria-label={choice.figure ? `${choice.label}. ${describeSymmetryFigure(choice.figure)}` : `Choose ${choice.label}`} onClick={() => choose(choice.id)} className={`min-h-20 min-w-0 rounded-2xl border-2 p-3 text-center ${focusClass} disabled:opacity-100 ${right ? 'border-emerald-700 bg-emerald-50' : wrong ? 'border-orange-700 bg-orange-50' : 'border-blue-200 bg-white hover:border-blue-700 hover:bg-blue-50/40'}`}>
        <ChoicePicture choice={choice} index={choiceIndex} /><span className="mt-2 block text-lg font-bold">{choice.label}</span>{right && <span className="mt-2 block text-sm font-bold text-emerald-900"><Check className="mr-1 inline h-4 w-4" aria-hidden="true" />Correct answer</span>}{wrong && <span className="mt-2 block text-sm font-bold text-orange-900"><X className="mr-1 inline h-4 w-4" aria-hidden="true" />Your choice</span>}
      </button>;
    })}</div></fieldset>
    <div role="status" aria-live="polite" aria-atomic="true" className="mt-5">{selected && <div className={`rounded-2xl border p-4 ${correct ? 'border-emerald-300 bg-emerald-50' : 'border-orange-300 bg-orange-50'}`}><p className="font-bold">{correct ? 'That geometry clue matches!' : `Good try. The matching answer is ${correctChoice.label}.`}</p><p className="mt-2 leading-7">{question.explanation}</p></div>}</div>
    {selected && <Button ref={nextButton} onClick={next} className="mt-4 min-h-12 w-full scroll-mt-24 bg-blue-800 hover:bg-blue-900 sm:w-auto">{index === 9 ? 'See results' : 'Next question'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>}
  </section>;
}

function QuestionVisual({ question }: { question: GeometryChallenge }) {
  if (question.visual.kind === 'shape') return <div className="mx-auto mt-5 max-w-xs rounded-2xl border border-blue-200 bg-blue-50/40 p-5"><ShapePicture shape={question.visual.shape} label={question.mechanic === 'name' ? shapeFacts[question.visual.shape].description : `A ${question.visual.shape} outline`} /></div>;
  if (question.visual.kind === 'object') return <div className="mx-auto mt-5 max-w-xs rounded-2xl border border-blue-200 bg-blue-50/40 p-5"><ObjectPicture object={question.visual.object} /></div>;
  return <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50/40 p-4 text-center"><Sparkles className="mx-auto h-8 w-8 text-blue-700" aria-hidden="true" /><p className="mt-2 font-semibold">Compare both sides of the dotted line in each answer.</p></div>;
}

function ChoicePicture({ choice, index }: { choice: GeometryChoice; index: number }) {
  if (choice.figure) return <SymmetryPicture figure={choice.figure} label={`Figure ${index + 1}`} />;
  if (choice.shape) return <ShapePicture shape={choice.shape} decorative compact />;
  return null;
}

export function ShapePicture({ shape, label, decorative = false, compact = false }: { shape: GeometryShape; label?: string; decorative?: boolean; compact?: boolean }) {
  const common = { fill: '#dbeafe', stroke: '#1e3a8a', strokeWidth: 5, strokeLinejoin: 'round' as const };
  return <svg viewBox="0 0 160 140" className={`mx-auto block w-full ${compact ? 'max-w-24' : 'max-w-56'}`} role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : label} focusable="false">
    {shape === 'circle' && <circle cx="80" cy="70" r="48" {...common} />}
    {shape === 'triangle' && <path d="M80 15 L142 122 L18 122 Z" {...common} />}
    {shape === 'square' && <rect x="28" y="18" width="104" height="104" rx="2" {...common} />}
    {shape === 'rectangle' && <rect x="15" y="34" width="130" height="72" rx="2" {...common} />}
    {shape === 'oval' && <ellipse cx="80" cy="70" rx="62" ry="42" {...common} />}
    {shape === 'star' && <path d="M80 10 L94 50 L137 50 L102 75 L115 118 L80 93 L45 118 L58 75 L23 50 L66 50 Z" {...common} />}
    {shape === 'heart' && <path d="M80 122 C62 105 25 82 25 49 C25 20 62 14 80 41 C98 14 135 20 135 49 C135 82 98 105 80 122 Z" {...common} />}
    {shape === 'diamond' && <path d="M80 10 L143 70 L80 130 L17 70 Z" {...common} />}
    {shape === 'pentagon' && <path d="M80 10 L143 56 L119 130 L41 130 L17 56 Z" {...common} />}
    {shape === 'hexagon' && <path d="M45 12 L115 12 L150 70 L115 128 L45 128 L10 70 Z" {...common} />}
  </svg>;
}

function ObjectPicture({ object }: { object: GeometryObject }) {
  const shape = ({ clock: 'circle', plate: 'circle', 'pizza-slice': 'triangle', pennant: 'triangle', window: 'rectangle', door: 'rectangle', tile: 'square', 'sticky-note': 'square', egg: 'oval', mirror: 'oval', 'heart-card': 'heart', 'heart-balloon': 'heart', kite: 'diamond', 'road-sign': 'diamond', 'star-badge': 'star' } as const)[object];
  return <div role="img" aria-label={`A simple illustration of a ${objectLabels[object]}`}><svg viewBox="0 0 180 160" className="mx-auto block w-full max-w-60" aria-hidden="true" focusable="false"><g transform="translate(10 10)"><ShapePictureSvg shape={shape} />{object === 'clock' && <><line x1="80" y1="70" x2="80" y2="37" stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round" /><line x1="80" y1="70" x2="108" y2="83" stroke="#1e3a8a" strokeWidth="5" strokeLinecap="round" /><circle cx="80" cy="70" r="5" fill="#1e3a8a" /></>}{object === 'window' && <><line x1="80" y1="35" x2="80" y2="105" stroke="#1e3a8a" strokeWidth="4" /><line x1="20" y1="70" x2="140" y2="70" stroke="#1e3a8a" strokeWidth="4" /></>}{object === 'door' && <circle cx="119" cy="72" r="5" fill="#1e3a8a" />}{object === 'pizza-slice' && <><circle cx="80" cy="70" r="6" fill="#dc2626" /><circle cx="95" cy="92" r="6" fill="#dc2626" /></>}{object === 'sticky-note' && <path d="M100 122 L132 90 L132 122 Z" fill="#bfdbfe" stroke="#1e3a8a" strokeWidth="3" />}{object === 'kite' && <path d="M80 130 C95 140 55 145 80 155" fill="none" stroke="#1e3a8a" strokeWidth="3" />}{object === 'heart-balloon' && <path d="M80 122 C95 138 65 143 80 155" fill="none" stroke="#1e3a8a" strokeWidth="3" />}{object === 'road-sign' && <><line x1="80" y1="130" x2="80" y2="157" stroke="#475569" strokeWidth="6" /><line x1="56" y1="157" x2="104" y2="157" stroke="#475569" strokeWidth="6" /></>}</g></svg></div>;
}

function ShapePictureSvg({ shape }: { shape: GeometryShape }) {
  const common = { fill: '#dbeafe', stroke: '#1e3a8a', strokeWidth: 5, strokeLinejoin: 'round' as const };
  if (shape === 'circle') return <circle cx="80" cy="70" r="48" {...common} />;
  if (shape === 'triangle') return <path d="M80 15 L142 122 L18 122 Z" {...common} />;
  if (shape === 'square') return <rect x="28" y="18" width="104" height="104" rx="2" {...common} />;
  if (shape === 'rectangle') return <rect x="15" y="34" width="130" height="72" rx="2" {...common} />;
  if (shape === 'oval') return <ellipse cx="80" cy="70" rx="62" ry="42" {...common} />;
  if (shape === 'heart') return <path d="M80 122 C62 105 25 82 25 49 C25 20 62 14 80 41 C98 14 135 20 135 49 C135 82 98 105 80 122 Z" {...common} />;
  if (shape === 'diamond') return <path d="M80 10 L143 70 L80 130 L17 70 Z" {...common} />;
  return <path d="M80 10 L94 50 L137 50 L102 75 L115 118 L80 93 L45 118 L58 75 L23 50 L66 50 Z" {...common} />;
}

function describeSymmetryFigure(figure: SymmetryFigure) {
  const left = figure.marks.filter(mark => mark.side === 'left').length;
  const right = figure.marks.filter(mark => mark.side === 'right').length;
  return `${left} marks on the left and ${right} marks on the right of a vertical dotted line. Compare their shapes, sizes and heights.`;
}

function markPath(mark: SymmetryMark) {
  const x = mark.side === 'left' ? 34 : 86;
  const size = mark.size;
  if (mark.shape === 'circle') return <circle cx={x} cy={mark.y} r={size} />;
  if (mark.shape === 'square') return <rect x={x - size} y={mark.y - size} width={size * 2} height={size * 2} rx="1" />;
  if (mark.shape === 'triangle') return <path d={`M${x} ${mark.y - size} L${x + size} ${mark.y + size} L${x - size} ${mark.y + size} Z`} />;
  return <path d={`M${x} ${mark.y - size} L${x + size} ${mark.y} L${x} ${mark.y + size} L${x - size} ${mark.y} Z`} />;
}

function SymmetryPicture({ figure, label }: { figure: SymmetryFigure; label: string }) {
  return <svg viewBox="0 0 120 110" className="mx-auto block w-full max-w-44" role="img" aria-label={`${label}. ${describeSymmetryFigure(figure)}`} focusable="false"><line x1="60" y1="8" x2="60" y2="102" stroke="#64748b" strokeWidth="2" strokeDasharray="5 4" /><g fill="#dbeafe" stroke="#1e3a8a" strokeWidth="3" strokeLinejoin="round">{figure.marks.map((mark, index) => <g key={`${mark.side}-${index}`}>{markPath(mark)}</g>)}</g></svg>;
}
