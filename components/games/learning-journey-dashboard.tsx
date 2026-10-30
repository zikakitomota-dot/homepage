'use client';

import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Download, Eraser, Gamepad2, Sparkles, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trackEvent } from '@/lib/analytics';
import { gameRegistry, subjectOrder } from '@/lib/games/registry';
import {
  achievementDefinitions,
  clearLearningJourney,
  exportLearningJourney,
  getSuggestedGame,
  importLearningJourney,
  LEARNING_JOURNEY_EVENT,
  type LearningJourney,
  parseLearningJourneyImport,
  readLearningJourney,
} from '@/lib/games/learning-journey';

const subjectStyles = {
  logic: { label: 'Logic & Brain Games', bar: 'bg-purple-600', panel: 'border-purple-200 bg-purple-50/50' },
  english: { label: 'English', bar: 'bg-blue-600', panel: 'border-blue-200 bg-blue-50/50' },
  mathematics: { label: 'Mathematics', bar: 'bg-amber-600', panel: 'border-amber-200 bg-amber-50/50' },
  science: { label: 'Science', bar: 'bg-emerald-600', panel: 'border-emerald-200 bg-emerald-50/50' },
  geography: { label: 'Geography', bar: 'bg-sky-600', panel: 'border-sky-200 bg-sky-50/50' },
  'life-skills': { label: 'Life Skills', bar: 'bg-orange-600', panel: 'border-orange-200 bg-orange-50/50' },
} as const;

const availableGames = gameRegistry.filter((game) => game.status === 'available' && game.route);

export function LearningJourneyDashboard() {
  const [progress, setProgress] = useState<LearningJourney | null>(null);
  const [message, setMessage] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const viewTracked = useRef(false);

  useEffect(() => {
    const refresh = () => setProgress(readLearningJourney());
    refresh();
    if (!viewTracked.current) {
      trackEvent('learning_journey_view');
      viewTracked.current = true;
    }
    window.addEventListener('storage', refresh);
    window.addEventListener(LEARNING_JOURNEY_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(LEARNING_JOURNEY_EVENT, refresh);
    };
  }, []);

  const summary = useMemo(() => {
    if (!progress) return null;
    const games = Object.values(progress.games);
    return {
      tried: games.filter((game) => game.sessionCount > 0).length,
      completed: games.reduce((sum, game) => sum + game.completedSessionCount, 0),
      questions: games.reduce((sum, game) => sum + game.totalQuestionsAttempted, 0),
      recent: games.filter((game) => game.lastPlayedAt).sort((a, b) => Date.parse(b.lastPlayedAt!) - Date.parse(a.lastPlayedAt!)).slice(0, 4),
    };
  }, [progress]);

  if (!progress || !summary) {
    return <p className="rounded-2xl border bg-white p-6 text-muted-foreground" role="status">Loading progress saved on this device…</p>;
  }

  const suggested = getSuggestedGame(progress);
  const earned = new Set(progress.achievements.map((achievement) => achievement.id));

  const exportProgress = () => {
    const blob = new Blob([exportLearningJourney(progress)], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `zalea-learning-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(href);
    setMessage('Your progress file has been downloaded.');
    trackEvent('progress_export');
  };

  const importProgress = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const incoming = parseLearningJourneyImport(await file.text());
      const merge = window.confirm('Choose OK to merge this file with progress on this device. Choose Cancel to continue to the replace option.');
      const mode = merge ? 'merge' : window.confirm('Replace all Zalea learning progress on this device with the imported file?') ? 'replace' : null;
      if (!mode) { setMessage('Import cancelled. Your progress was not changed.'); return; }
      const result = importLearningJourney(incoming, mode);
      if (!result.saved) throw new Error('Browser storage is unavailable, so the file could not be saved.');
      setProgress(result.progress);
      setMessage(mode === 'merge' ? 'Progress merged successfully.' : 'Progress replaced successfully.');
      trackEvent('progress_import', { mode });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'The progress file could not be imported.');
    }
  };

  const clearProgress = () => {
    if (!window.confirm('Clear only your saved Zalea learning progress on this device? This cannot be undone unless you exported a backup.')) return;
    if (clearLearningJourney()) {
      setProgress(readLearningJourney());
      setMessage('Your Zalea learning progress has been cleared.');
    } else setMessage('Browser storage is unavailable, so progress could not be cleared.');
  };

  return <div className="space-y-12">
    {summary.tried === 0 ? <section className="rounded-3xl border border-blue-200 bg-blue-50/60 p-6 text-center sm:p-10" aria-labelledby="empty-journey-heading">
      <Sparkles className="mx-auto h-10 w-10 text-amber-500" aria-hidden="true" />
      <h2 id="empty-journey-heading" className="mt-4 text-2xl font-bold">Your next adventure starts here</h2>
      <p className="mx-auto mt-3 max-w-xl leading-relaxed text-muted-foreground">Play any available Level 1 game. This page will then show the games you tried, completed sessions, best scores, and achievements saved on this device.</p>
      <Button asChild size="lg" className="mt-6"><Link href="/games">Start Playing<ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" /></Link></Button>
    </section> : <>
      <section aria-labelledby="journey-summary"><h2 id="journey-summary" className="text-3xl font-bold tracking-tight">Your journey so far</h2><div className="mt-6 grid gap-4 sm:grid-cols-3">
        <SummaryCard value={summary.tried} label="Games tried" note={`of ${availableGames.length} available`} />
        <SummaryCard value={summary.completed} label="Completed sessions" note="finished through the result screen" />
        <SummaryCard value={summary.questions} label="Questions / pair attempts" note="from completed sessions" />
      </div></section>

      <section aria-labelledby="subject-progress"><h2 id="subject-progress" className="text-3xl font-bold tracking-tight">Subject progress</h2><div className="mt-6 grid gap-4 md:grid-cols-2">
        {subjectOrder.map((subjectId) => {
          const games = availableGames.filter((game) => game.subjectId === subjectId);
          const tried = games.filter((game) => progress.games[game.gameId]?.sessionCount > 0).length;
          const percentage = Math.round((tried / games.length) * 100);
          const style = subjectStyles[subjectId];
          return <Card key={subjectId} className={style.panel}><CardHeader><CardTitle className="flex items-center justify-between gap-3"><span>{style.label}</span><span className="text-base font-semibold text-muted-foreground">{tried} of {games.length} tried</span></CardTitle></CardHeader><CardContent><div className="h-3 overflow-hidden rounded-full bg-white" role="progressbar" aria-label={`${style.label}: ${tried} of ${games.length} available games tried`} aria-valuemin={0} aria-valuemax={games.length} aria-valuenow={tried}><div className={`h-full rounded-full ${style.bar}`} style={{ width: `${percentage}%` }} /></div></CardContent></Card>;
        })}
      </div></section>

      <section aria-labelledby="game-progress"><h2 id="game-progress" className="text-3xl font-bold tracking-tight">Game progress</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableGames.map((game) => { const item = progress.games[game.gameId]; return <Link key={game.gameId} href={game.route!} className="group rounded-2xl border bg-white p-5 shadow-sm outline-none transition hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><div className="flex items-start justify-between gap-3"><span className="text-3xl" aria-hidden="true">{game.icon}</span><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{item?.sessionCount ? 'Played' : 'Not Played'}</span></div><h3 className="mt-4 text-lg font-bold">{game.title}</h3><p className="mt-1 text-sm text-muted-foreground">{game.subjectName}</p><p className="mt-4 font-semibold text-primary">{item?.personalBest ? `Personal Best: ${item.personalBest.correct}/${item.personalBest.questions} (${item.personalBest.percentage}%)` : 'No completed score yet'}</p></Link>; })}
      </div></section>
    </>}

    {suggested?.route && <section className="rounded-3xl border border-violet-200 bg-violet-50/60 p-6 sm:p-8" aria-labelledby="suggested-game"><p className="text-sm font-bold uppercase tracking-wider text-violet-700">A simple suggestion</p><h2 id="suggested-game" className="mt-2 text-2xl font-bold">Try {suggested.title} next</h2><p className="mt-3 max-w-2xl text-muted-foreground">{suggested.description} Suggestions prioritise an untried game in your most recently played subject, then other untried Level 1 games.</p><Button asChild className="mt-5"><Link href={suggested.route} onClick={() => trackEvent('recommended_game_click', { game: suggested.gameId })}>Play {suggested.title}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></section>}

    <section className="rounded-3xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8" aria-labelledby="journey-missions"><Compass className="h-7 w-7 text-blue-700" aria-hidden="true" /><h2 id="journey-missions" className="mt-3 text-2xl font-bold">Continue with a Learning Mission</h2><p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">Mission paths use the same verified completed game sessions shown here, so your existing progress counts automatically.</p><Button asChild className="mt-5"><Link href="/games/missions">View Learning Missions<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></section>

    <section aria-labelledby="achievements"><h2 id="achievements" className="text-3xl font-bold tracking-tight">Achievements</h2><p className="mt-3 text-muted-foreground">Achievements celebrate completed sessions and genuine exploration. They are not rankings or formal assessments.</p><div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{achievementDefinitions.map((achievement) => <Card key={achievement.id} className={earned.has(achievement.id) ? 'border-amber-300 bg-amber-50/60' : 'border-border/60 bg-secondary/20'}><CardContent className="p-5"><span className={`text-3xl ${earned.has(achievement.id) ? '' : 'grayscale opacity-40'}`} aria-hidden="true">{achievement.icon}</span><h3 className="mt-3 font-bold">{achievement.name}</h3><p className="mt-1 text-sm text-muted-foreground">{achievement.description}</p><p className="mt-3 text-xs font-bold uppercase tracking-wide">{earned.has(achievement.id) ? 'Earned' : 'Not earned yet'}</p></CardContent></Card>)}</div></section>

    {summary.recent.length > 0 && <section aria-labelledby="recent-games"><h2 id="recent-games" className="text-3xl font-bold tracking-tight">Recently played</h2><div className="mt-5 flex flex-wrap gap-3">{summary.recent.map((item) => { const game = availableGames.find((entry) => entry.gameId === item.gameId)!; return <Button key={item.gameId} asChild variant="outline"><Link href={game.route!}>{game.icon} {game.title}</Link></Button>; })}</div></section>}

    <section className="rounded-3xl border bg-secondary/25 p-6 sm:p-8" aria-labelledby="progress-controls"><h2 id="progress-controls" className="text-2xl font-bold">Keep a copy of your progress</h2><p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">Export a JSON backup, restore a previous backup, or clear only this learning progress. Imports are checked for file size, schema version, valid values, and known game IDs before anything is saved.</p><div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><Button onClick={exportProgress} variant="outline"><Download className="mr-2 h-4 w-4" aria-hidden="true" />Export My Progress</Button><Button onClick={() => fileInput.current?.click()} variant="outline"><Upload className="mr-2 h-4 w-4" aria-hidden="true" />Import My Progress</Button><input ref={fileInput} type="file" accept="application/json,.json" className="sr-only" onChange={importProgress} aria-label="Choose a Zalea learning progress JSON file" /><Button onClick={clearProgress} variant="outline" className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"><Eraser className="mr-2 h-4 w-4" aria-hidden="true" />Clear My Progress</Button></div><p className="mt-5 text-sm font-medium">Your progress is saved on this device. Clearing browser data may remove it.</p><p className="mt-2 text-sm text-muted-foreground">No names, email addresses, individual answers, or exported files are sent to Zalea Studio.</p><p className="mt-4 min-h-6 text-sm font-semibold" role="status" aria-live="polite">{message}</p></section>
  </div>;
}

function SummaryCard({ value, label, note }: { value: number; label: string; note: string }) {
  return <Card><CardContent className="p-6"><Gamepad2 className="h-6 w-6 text-primary" aria-hidden="true" /><p className="mt-4 text-4xl font-bold">{value}</p><h3 className="mt-1 font-bold">{label}</h3><p className="mt-1 text-sm text-muted-foreground">{note}</p></CardContent></Card>;
}
