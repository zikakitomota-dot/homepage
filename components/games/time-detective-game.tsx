'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, Clock3, RotateCcw, Trophy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLearningSession } from '@/hooks/use-learning-session';
import { trackEvent } from '@/lib/analytics';
import { createSessionId } from '@/lib/games/learning-journey';
import {
  adjustClockTime,
  clockAngles,
  describeClockHands,
  formatClockTime,
  generateTimeSession,
  initialClockSetting,
  isSameClockTime,
  TIME_GAME_ID,
  timeMechanicLabels,
  timeStageLabels,
  type ClockTime,
  type TimeChallenge,
  type TimeSessionMode,
} from '@/lib/games/time-detective';

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-700 focus-visible:ring-offset-2';
const baseEvent = { game: TIME_GAME_ID, subject: 'life-skills', level: '1' };

export function TimeDetectiveGame() {
  const [phase, setPhase] = useState<'intro' | 'playing' | 'results'>('intro');
  const [mode, setMode] = useState<TimeSessionMode>('intro');
  const [challenges, setChallenges] = useState<TimeChallenge[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [setting, setSetting] = useState<ClockTime>({ hour: 12, minute: 0 });
  const [submittedTime, setSubmittedTime] = useState<ClockTime | null>(null);
  const running = useRef(false);
  const completed = useRef(false);
  const questionHeading = useRef<HTMLHeadingElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const { startLearningSession, completeLearningSession } = useLearningSession(TIME_GAME_ID, { trackAchievementEvents: false });
  const challenge = challenges[index];
  const answered = selectedChoice !== null || submittedTime !== null;
  const score = answers.filter(Boolean).length;
  const correct = challenge ? challenge.interaction === 'set'
    ? submittedTime !== null && isSameClockTime(submittedTime, challenge.answer)
    : selectedChoice === challenge.correctChoiceId : false;

  useEffect(() => {
    const target = phase === 'results' ? resultsHeading.current : phase === 'playing' ? answered ? nextButton.current : questionHeading.current : null;
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [phase, index, answered]);

  const start = () => {
    if (running.current) return;
    const session = generateTimeSession(createSessionId(), mode);
    running.current = true; completed.current = false;
    setChallenges(session); setIndex(0); setAnswers([]); setSelectedChoice(null); setSubmittedTime(null);
    setSetting(initialClockSetting(session[0].answer)); setPhase('playing'); startLearningSession();
    trackEvent('game_started', { ...baseEvent, mode });
  };

  const choose = (id: string) => {
    if (answered || challenge.interaction !== 'choice' || !challenge.choices.some(choice => choice.id === id)) return;
    setSelectedChoice(id); setAnswers(current => [...current, id === challenge.correctChoiceId]);
  };

  const submitClock = () => {
    if (answered || challenge.interaction !== 'set') return;
    setSubmittedTime(setting); setAnswers(current => [...current, isSameClockTime(setting, challenge.answer)]);
  };

  const next = () => {
    if (!answered || completed.current) return;
    if (index === 9) {
      completed.current = true; running.current = false;
      completeLearningSession(score, 10); setPhase('results');
      trackEvent('game_completed', { ...baseEvent, mode });
      return;
    }
    const following = challenges[index + 1];
    setSelectedChoice(null); setSubmittedTime(null); setSetting(initialClockSetting(following.answer)); setIndex(current => current + 1);
  };

  if (phase === 'intro') return <section className="mx-auto max-w-3xl rounded-3xl border border-orange-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="time-welcome" data-time-phase="intro">
    <Clock3 className="h-12 w-12 text-orange-800" aria-hidden="true" /><p className="mt-4 text-sm font-bold text-orange-800">Life Skills · Level 1</p>
    <h2 id="time-welcome" className="mt-2 text-3xl font-bold">Ready, Time Detective?</h2>
    <p className="mt-4 leading-7">Use the short hour hand and the long minute hand to read, match and set clocks. Each session has ten challenges and all four activity types. There is no countdown or penalty.</p>
    <fieldset className="mt-6"><legend className="font-bold">Choose a Level 1 starting point</legend><div className="mt-3 grid gap-3 sm:grid-cols-2">
      <ModeButton selected={mode === 'intro'} onClick={() => setMode('intro')} title="Start with the basics" description="Whole hours and half hours, with all four activities." />
      <ModeButton selected={mode === 'full'} onClick={() => setMode('full')} title="Full Level 1 practice" description="Whole, half, quarter and five-minute times in a gentle progression." />
    </div></fieldset>
    <div className="mt-6 grid gap-4 rounded-2xl bg-orange-50 p-4 sm:grid-cols-[160px_1fr]"><ClockFace time={{ hour: 4, minute: 30 }} label="Example clock. The shorter hour hand is halfway between 4 and 5. The longer minute hand points to 6." /><div><h3 className="font-bold">Two hands, two jobs</h3><ul className="mt-2 space-y-2 text-sm leading-6"><li><strong>Short hand:</strong> shows the hour and moves gradually towards the next number.</li><li><strong>Long hand:</strong> shows minutes. Each number is five minutes.</li></ul></div></div>
    <Button onClick={start} className="mt-6 min-h-12 w-full bg-orange-800 hover:bg-orange-900 sm:w-auto">Start detective session<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>
    <p className="mt-4 text-sm leading-6 text-muted-foreground">Use Tab to reach controls. Sliders work with arrow keys, and every clock-setting control also has a large step button for touch. Your completed score stays in My Learning Journey on this browser.</p>
  </section>;

  if (phase === 'results') return <section className="mx-auto max-w-3xl rounded-3xl border border-orange-200 bg-white p-5 shadow-sm sm:p-8" aria-labelledby="time-results" data-time-phase="results">
    <Trophy className="h-12 w-12 text-orange-800" aria-hidden="true" /><h2 id="time-results" ref={resultsHeading} tabIndex={-1} className="mt-4 scroll-mt-24 text-3xl font-bold outline-none">Detective session complete</h2>
    <p className="mt-4 text-2xl font-bold">You solved {score} of 10 time challenges.</p><p className="mt-3 leading-7">The hands become easier to follow with practice. Your score records this session; it is not a race or a formal assessment.</p>
    <h3 className="mt-6 text-xl font-bold">Skills you practised</h3><ul className="mt-3 grid gap-2 sm:grid-cols-2">{Object.values(timeMechanicLabels).map(label => <li key={label} className="rounded-lg bg-orange-50 p-3">{label}</li>)}</ul>
    <div className="mt-6 flex flex-wrap gap-3"><Button onClick={start} className="min-h-12 bg-orange-800 hover:bg-orange-900"><RotateCcw className="mr-2 h-5 w-5" aria-hidden="true" />Play a new session</Button><Button asChild variant="outline" className="min-h-12"><Link href="/games/my-learning-journey">My Learning Journey</Link></Button></div>
    <nav aria-label="Continue learning" className="mt-5 flex flex-wrap gap-4"><Link href="/games/life-skills" className={`inline-flex min-h-12 items-center rounded text-orange-800 underline ${focusClass}`}>Life Skills Games</Link><Link href="/games/math" className={`inline-flex min-h-12 items-center rounded text-orange-800 underline ${focusClass}`}>Explore Mathematics</Link></nav>
  </section>;

  return <section className="mx-auto max-w-3xl min-w-0 rounded-3xl border border-orange-200 bg-white p-4 shadow-sm sm:p-7" aria-labelledby="time-question" data-time-phase="playing" data-challenge-id={challenge.id} data-mechanic={challenge.mechanic} data-stage={challenge.stage}>
    <div className="flex flex-wrap justify-between gap-2 text-sm font-semibold"><span>Challenge {index + 1} of 10</span><span>Score: {score}</span></div>
    <div role="progressbar" aria-label={`Challenge ${index + 1} of 10`} aria-valuemin={0} aria-valuemax={10} aria-valuenow={index + 1} className="mt-3 h-3 overflow-hidden rounded-full bg-orange-100"><div className="h-full rounded-full bg-orange-700 motion-safe:transition-[width]" style={{ width: `${(index + 1) * 10}%` }} /></div>
    <div className="mt-5 flex flex-wrap gap-2 text-sm font-bold"><span className="rounded-full bg-orange-100 px-3 py-1 text-orange-900">{timeMechanicLabels[challenge.mechanic]}</span><span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">{timeStageLabels[challenge.stage]}</span></div>
    <h2 id="time-question" ref={questionHeading} tabIndex={-1} className="mt-3 scroll-mt-24 text-2xl font-bold outline-none sm:text-3xl">{challenge.prompt}</h2><p id="time-instruction" className="mt-3 leading-7">{challenge.instruction}</p>

    {challenge.mechanic === 'read' && <div className="mx-auto mt-5 max-w-xs rounded-2xl border border-orange-200 bg-orange-50/40 p-4"><ClockFace time={challenge.answer} label={describeClockHands(challenge.answer)} /></div>}
    {challenge.interaction === 'set' ? <ClockSetter value={setting} onChange={setSetting} disabled={answered} /> : <fieldset className="mt-6" aria-describedby="time-instruction"><legend className="font-semibold">{challenge.mechanic === 'read' ? 'Choose the digital time' : 'Choose the matching clock'}</legend><div className={`mt-3 grid gap-3 ${challenge.mechanic === 'read' ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>{challenge.choices.map((choice, choiceIndex) => {
      const right = answered && choice.id === challenge.correctChoiceId; const wrong = selectedChoice === choice.id && !right;
      return <button key={choice.id} type="button" disabled={answered} aria-pressed={selectedChoice === choice.id} aria-label={challenge.mechanic === 'read' ? `Choose ${formatClockTime(choice.time)}` : `Clock option ${choiceIndex + 1}. ${describeClockHands(choice.time)}`} onClick={() => choose(choice.id)} className={`min-h-20 min-w-0 rounded-xl border-2 p-3 ${focusClass} disabled:opacity-100 ${right ? 'border-emerald-700 bg-emerald-50' : wrong ? 'border-orange-700 bg-orange-50' : 'border-orange-200 bg-white hover:border-orange-700'}`}>{challenge.mechanic === 'read' ? <span className="text-2xl font-bold">{formatClockTime(choice.time)}</span> : <ClockFace time={choice.time} decorative compact />}{right && <span className="mt-2 block text-sm font-bold"><Check className="mr-1 inline h-4 w-4" aria-hidden="true" />Correct clock</span>}{wrong && <span className="mt-2 block text-sm font-bold"><X className="mr-1 inline h-4 w-4" aria-hidden="true" />Your choice</span>}</button>;
    })}</div></fieldset>}
    {challenge.interaction === 'set' && <Button type="button" onClick={submitClock} disabled={answered} className="mt-5 min-h-12 w-full bg-orange-800 hover:bg-orange-900 sm:w-auto">Check my clock</Button>}
    <div role="status" aria-live="polite" aria-atomic="true" className="mt-5">{answered && <div className={`rounded-xl border p-4 ${correct ? 'border-emerald-300 bg-emerald-50' : 'border-orange-300 bg-orange-50'}`}><p className="font-bold">{correct ? 'That time matches!' : 'Good try. Follow both hands.'}</p>{submittedTime && !correct && <p className="mt-2">Your clock showed {formatClockTime(submittedTime)}.</p>}<p className="mt-2 leading-7">{challenge.explanation}</p></div>}</div>
    {answered && <Button ref={nextButton} onClick={next} className="mt-4 min-h-12 w-full scroll-mt-24 bg-orange-800 hover:bg-orange-900 sm:w-auto">{index === 9 ? 'See results' : 'Next challenge'}<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Button>}
  </section>;
}

function ModeButton({ selected, onClick, title, description }: { selected: boolean; onClick: () => void; title: string; description: string }) {
  return <button type="button" aria-pressed={selected} onClick={onClick} className={`min-h-24 rounded-xl border-2 p-4 text-left ${focusClass} ${selected ? 'border-orange-700 bg-orange-50' : 'border-orange-200 bg-white'}`}><strong className="block">{title}</strong><span className="mt-1 block text-sm leading-6">{description}</span></button>;
}

function ClockSetter({ value, onChange, disabled }: { value: ClockTime; onChange: (value: ClockTime) => void; disabled: boolean }) {
  return <fieldset className="mt-6 rounded-2xl border border-orange-200 bg-orange-50/40 p-4 sm:p-6"><legend className="px-2 font-bold">Set your clock</legend><div className="mx-auto max-w-xs"><ClockFace time={value} label={`Adjustable clock currently showing ${formatClockTime(value)}. ${describeClockHands(value)}`} /></div><div className="mt-5 grid gap-5 sm:grid-cols-2">
    <ClockControl label="Hour" value={value.hour} min={1} max={12} step={1} disabled={disabled} valueText={`${value.hour} o'clock hour position`} onSlider={hour => onChange({ ...value, hour })} onDown={() => onChange(adjustClockTime(value, 'hour', -1))} onUp={() => onChange(adjustClockTime(value, 'hour', 1))} />
    <ClockControl label="Minute" value={value.minute} min={0} max={55} step={5} disabled={disabled} valueText={`${value.minute} minutes`} onSlider={minute => onChange({ ...value, minute })} onDown={() => onChange(adjustClockTime(value, 'minute', -5))} onUp={() => onChange(adjustClockTime(value, 'minute', 5))} />
  </div><p className="mt-4 text-center text-xl font-bold" aria-live="polite">Your clock: {formatClockTime(value)}</p></fieldset>;
}

function ClockControl({ label, value, min, max, step, disabled, valueText, onSlider, onDown, onUp }: { label: string; value: number; min: number; max: number; step: number; disabled: boolean; valueText: string; onSlider: (value: number) => void; onDown: () => void; onUp: () => void }) {
  const id = `time-${label.toLowerCase()}`;
  return <div><label htmlFor={id} className="font-semibold">{label}: {String(value).padStart(2, '0')}</label><input id={id} type="range" min={min} max={max} step={step} value={value} disabled={disabled} aria-valuetext={valueText} onChange={event => onSlider(Number(event.target.value))} className={`mt-3 block h-12 w-full accent-orange-700 ${focusClass}`} /><div className="mt-2 grid grid-cols-2 gap-2"><Button type="button" variant="outline" disabled={disabled} onClick={onDown} className="min-h-12 border-orange-300 text-lg" aria-label={`Decrease ${label.toLowerCase()} by ${step}`}>− {step}</Button><Button type="button" variant="outline" disabled={disabled} onClick={onUp} className="min-h-12 border-orange-300 text-lg" aria-label={`Increase ${label.toLowerCase()} by ${step}`}>+ {step}</Button></div></div>;
}

export function ClockFace({ time, label, decorative = false, compact = false }: { time: ClockTime; label?: string; decorative?: boolean; compact?: boolean }) {
  const angles = clockAngles(time);
  return <svg viewBox="0 0 200 200" className={`mx-auto block ${compact ? 'h-auto w-full max-w-32' : 'h-auto w-full max-w-56'}`} role={decorative ? undefined : 'img'} aria-hidden={decorative || undefined} aria-label={decorative ? undefined : label} focusable="false">
    <circle cx="100" cy="100" r="94" fill="white" stroke="#9a3412" strokeWidth="5" />
    {Array.from({ length: 60 }, (_, index) => { const angle = index * 6; const major = index % 5 === 0; return <line key={index} x1="100" y1={major ? 14 : 10} x2="100" y2={major ? 23 : 16} stroke={major ? '#9a3412' : '#fdba74'} strokeWidth={major ? 3 : 1.5} transform={`rotate(${angle} 100 100)`} />; })}
    {Array.from({ length: 12 }, (_, index) => { const number = index + 1; const radians = number * Math.PI / 6; const x = 100 + 72 * Math.sin(radians); const y = 106 - 72 * Math.cos(radians); return <text key={number} x={x} y={y} textAnchor="middle" fontSize="15" fontWeight="700" fill="#431407">{number}</text>; })}
    <line x1="100" y1="105" x2="100" y2="58" stroke="#431407" strokeWidth="8" strokeLinecap="round" transform={`rotate(${angles.hour} 100 100)`} />
    <line x1="100" y1="108" x2="100" y2="31" stroke="#c2410c" strokeWidth="5" strokeLinecap="round" transform={`rotate(${angles.minute} 100 100)`} />
    <circle cx="100" cy="100" r="7" fill="#431407" /><circle cx="100" cy="100" r="3" fill="#fed7aa" />
  </svg>;
}
