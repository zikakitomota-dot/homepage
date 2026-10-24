import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, FlaskConical, Globe2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRoadmapBySubject, type GameStatus } from '@/lib/games/registry';

const subjectStyles = {
  english: { icon: BookOpen, panel: 'border-blue-200 bg-blue-50/45', iconBox: 'bg-blue-100 text-blue-700' },
  mathematics: { icon: Calculator, panel: 'border-amber-200 bg-amber-50/45', iconBox: 'bg-amber-100 text-amber-800' },
  science: { icon: FlaskConical, panel: 'border-emerald-200 bg-emerald-50/45', iconBox: 'bg-emerald-100 text-emerald-800' },
  geography: { icon: Globe2, panel: 'border-sky-200 bg-sky-50/45', iconBox: 'bg-sky-100 text-sky-700' },
} as const;

const statusLabel: Record<GameStatus, string> = { available: 'Available', 'coming-soon': 'Coming Soon', planned: 'Planned' };

export function GameRoadmap() {
  return (
    <section className="border-y border-border/60 bg-secondary/20" aria-labelledby="game-roadmap-heading">
      <div className="mx-auto max-w-[1100px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Play now. See what is next.</p>
          <h2 id="game-roadmap-heading" className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Explore Our Game Roadmap</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">Discover games you can play today and get a sneak peek at the adventures we&apos;re creating next.</p>
        </div>

        <div className="mt-10 space-y-6">
          {getRoadmapBySubject().map(({ subjectId, subjectName, games }) => {
            const styles = subjectStyles[subjectId];
            const SubjectIcon = styles.icon;
            const available = games.filter((game) => game.status === 'available').length;
            return (
              <section key={subjectId} className={`rounded-3xl border p-4 sm:p-6 ${styles.panel}`} aria-labelledby={`roadmap-${subjectId}`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${styles.iconBox}`}><SubjectIcon className="h-6 w-6" aria-hidden="true" /></span>
                    <div><h3 id={`roadmap-${subjectId}`} className="text-2xl font-bold">{subjectName}</h3><p className="text-sm text-muted-foreground">Level 1 · {available} {available === 1 ? 'game' : 'games'} ready</p></div>
                  </div>
                  {subjectId === 'geography' && <p className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-sky-800">4 of 4 games ready</p>}
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {games.map((game) => {
                    const content = <><div className="flex items-start justify-between gap-3"><span className="text-3xl" aria-hidden="true">{game.icon}</span><div className="flex flex-wrap justify-end gap-1.5"><Badge variant="secondary">Level {game.level}</Badge>{game.isNew && <Badge className="bg-violet-100 text-violet-800 hover:bg-violet-100">New</Badge>}<Badge className={game.status === 'available' ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-amber-100 text-amber-900 hover:bg-amber-100'}>{statusLabel[game.status]}</Badge></div></div><h4 className="mt-4 text-lg font-bold leading-snug">{game.title}</h4><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{game.description}</p>{game.status === 'available' && <span className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary">Play Game<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></span>}{game.status !== 'available' && <p className="mt-4 flex min-h-11 items-center text-sm font-semibold text-amber-900">More details will be shared when this game is ready.</p>}</>;
                    return game.status === 'available' && game.route ? <Link key={game.gameId} href={game.route} className="flex min-w-0 flex-col rounded-2xl border border-border/70 bg-white p-5 shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" aria-label={`Play ${game.title}, ${game.subjectName} Level ${game.level}`}>{content}</Link> : <article key={game.gameId} className="flex min-w-0 flex-col rounded-2xl border border-amber-200 bg-white/90 p-5" aria-label={`${game.title}, ${statusLabel[game.status]}`}>{content}</article>;
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
