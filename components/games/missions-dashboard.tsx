'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Circle, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { trackEvent } from '@/lib/analytics';
import { LEARNING_JOURNEY_EVENT, readLearningJourney, setMissionEvidence, type LearningJourney } from '@/lib/games/learning-journey';
import { getMissionProgress, isActivityComplete, missions, type Mission } from '@/lib/games/missions';

const stateLabel = { 'not-started': 'Not Started', 'in-progress': 'In Progress', completed: 'Completed' } as const;

function useJourney() {
  const [progress, setProgress] = useState<LearningJourney | null>(null);
  useEffect(() => {
    const refresh = () => setProgress(readLearningJourney());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener(LEARNING_JOURNEY_EVENT, refresh);
    return () => { window.removeEventListener('storage', refresh); window.removeEventListener(LEARNING_JOURNEY_EVENT, refresh); };
  }, []);
  return progress;
}

export function MissionsDashboard() {
  const progress = useJourney();
  const tracked = useRef(false);
  useEffect(() => { if (!tracked.current) { trackEvent('mission_viewed', { mission_id: 'missions_hub' }); tracked.current = true; } }, []);
  if (!progress) return <p role="status">Loading missions saved on this device…</p>;
  return <div className="grid gap-6 md:grid-cols-2">{missions.map((mission) => {
    const summary = getMissionProgress(mission, progress);
    return <Card key={mission.id} className="border-border/70 shadow-sm"><CardHeader><div className="flex items-start justify-between gap-4"><span className="text-4xl" aria-hidden="true">{mission.icon}</span><span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold">{stateLabel[summary.state]}</span></div><CardTitle className="mt-3 text-2xl">{mission.title}</CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{mission.shortDescription}</p><div className="mt-5 flex items-center justify-between text-sm font-semibold"><span>{summary.completed} of {summary.total} activities</span><span>{summary.percentage}%</span></div><Progress className="mt-2" value={summary.percentage} aria-label={`${mission.title}: ${summary.completed} of ${summary.total} activities completed`} /><Button asChild className="mt-6"><Link href={`/games/missions/${mission.id}`}>View Mission<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></CardContent></Card>;
  })}</div>;
}

export function MissionDetail({ mission }: { mission: Mission }) {
  const progress = useJourney();
  const trackedView = useRef(false);
  const previousState = useRef<string | null>(null);
  useEffect(() => { if (!trackedView.current) { trackEvent('mission_viewed', { mission_id: mission.id }); trackedView.current = true; } }, [mission.id]);
  useEffect(() => {
    if (!progress) return;
    const next = getMissionProgress(mission, progress).state;
    if (previousState.current && previousState.current !== next) {
      if (next === 'in-progress') trackEvent('mission_started', { mission_id: mission.id });
      if (next === 'completed') trackEvent('mission_completed', { mission_id: mission.id });
    }
    previousState.current = next;
  }, [mission, progress]);
  if (!progress) return <p role="status">Loading mission progress…</p>;
  const summary = getMissionProgress(mission, progress);
  const nextActivity = mission.activities.find((activity) => !isActivityComplete(activity, progress));
  const toggleWorksheet = (evidenceId: string, completed: boolean) => setMissionEvidence(evidenceId, completed);
  return <div className="space-y-10">
    <section aria-labelledby="mission-progress-heading"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-primary">{stateLabel[summary.state]}</p><h2 id="mission-progress-heading" className="mt-2 text-3xl font-bold">Mission progress</h2></div><p className="font-semibold">{summary.completed} of {summary.total} activities completed</p></div><Progress className="mt-5 h-4" value={summary.percentage} aria-label={`${summary.completed} of ${summary.total} mission activities completed`} /></section>
    {nextActivity && <section className="rounded-2xl border border-blue-200 bg-blue-50/50 p-5" aria-labelledby="next-mission-action"><p className="text-sm font-bold uppercase tracking-wider text-blue-700">Recommended next action</p><h2 id="next-mission-action" className="mt-1 text-xl font-bold">Continue with {nextActivity.title}</h2><p className="mt-2 text-sm text-muted-foreground">Activities may be completed in any order. This is simply the next unfinished item.</p></section>}
    <section aria-labelledby="mission-activities"><h2 id="mission-activities" className="text-3xl font-bold">Activities</h2><ol className="mt-6 grid gap-5">{mission.activities.map((activity, index) => {
      const complete = isActivityComplete(activity, progress);
      return <li key={activity.id}><Card className={complete ? 'border-emerald-300 bg-emerald-50/40' : ''}><CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4">{complete ? <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" /> : <Circle className="mt-1 h-6 w-6 shrink-0 text-muted-foreground" aria-hidden="true" />}<div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Activity {index + 1}</p><h3 className="mt-1 text-xl font-bold">{activity.title}</h3><p className="mt-2 max-w-2xl text-muted-foreground">{activity.description}</p><p className="mt-2 text-sm font-semibold" role="status">{complete ? 'Completed' : 'Not completed yet'}</p></div></div><div className="flex shrink-0 flex-col gap-2 sm:items-end"><Button asChild variant={complete ? 'outline' : 'default'}><Link href={activity.href} onClick={() => trackEvent('mission_activity_clicked', { mission_id: mission.id, activity_id: activity.id, activity_kind: activity.kind })}>{activity.kind === 'game' ? 'Play game' : 'Prepare worksheet'}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>{activity.kind === 'worksheet' && <Button variant="ghost" onClick={() => toggleWorksheet(activity.evidenceId!, !complete)}>{complete ? 'Undo completion' : 'I finished my worksheet'}</Button>}</div></CardContent></Card></li>;
    })}</ol>{mission.id === 'maths-explorer' && <p className="mt-4 text-sm text-muted-foreground">Preparing or downloading a worksheet does not complete this activity. Mark it only after the worksheet has been finished. You can undo the confirmation at any time.</p>}</section>
    {summary.state === 'completed' && <Certificate mission={mission} date={summary.completedAt!} />}
    <section className="rounded-2xl border bg-secondary/25 p-6"><h2 className="text-xl font-bold">Private progress</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Mission progress stays in this browser and uses completed game sessions already recorded by My Learning Journey. It does not store names, individual answers or worksheet content.</p></section>
  </div>;
}

function Certificate({ mission, date }: { mission: Mission; date: string }) {
  const formatted = new Intl.DateTimeFormat('en', { dateStyle: 'long' }).format(new Date(date));
  return <section id="mission-certificate" className="mission-certificate rounded-3xl border-4 border-double border-blue-700 bg-white p-8 text-center sm:p-12" aria-labelledby="certificate-title"><p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Zalea Studio Learning Mission</p><h2 id="certificate-title" className="mt-6 text-4xl font-bold">Mission Completed</h2><p className="mt-6 text-lg">This certificate recognises completion of the activities in</p><p className="mt-3 text-3xl font-bold text-blue-800">{mission.title}</p><p className="mt-6 text-muted-foreground">Completed on {formatted}</p><p className="mt-3 text-sm text-muted-foreground">A celebration of practice, not formal accreditation.</p><Button className="mission-print-button mt-8" onClick={() => { trackEvent('mission_certificate_printed', { mission_id: mission.id }); window.print(); }}><Printer className="mr-2 h-4 w-4" aria-hidden="true" />Print Certificate</Button></section>;
}
