'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LockKeyhole, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { readProgress } from '@/lib/games/progress';
import type { GameSummary } from '@/lib/games/types';

export function GameCard({ game }: { game: GameSummary }) {
  const [bestScore, setBestScore] = useState(0);
  useEffect(() => {
    if (game.access === 'free') setBestScore(readProgress()[game.slug]?.bestScore ?? 0);
  }, [game.access, game.slug]);

  const premium = game.access === 'premium';
  const difficulty = game.level === 1 ? 'Beginner' : 'Growing skills';

  return (
    <Card className={`flex h-full flex-col bg-white shadow-sm transition-shadow hover:shadow-md ${premium ? 'border-violet-200 ring-1 ring-violet-100' : 'border-border/60'}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3"><span className="text-4xl" aria-hidden="true">{game.icon}</span><Badge className={premium ? 'bg-violet-100 text-violet-800 hover:bg-violet-100' : 'bg-green-100 text-green-800 hover:bg-green-100'}>{premium && <LockKeyhole className="mr-1 h-3.5 w-3.5" aria-hidden="true" />}{premium ? 'ACADEMY' : 'FREE'}{premium && <Sparkles className="ml-1 h-3.5 w-3.5" aria-hidden="true" />}</Badge></div>
        <CardTitle className="pt-3 text-xl">{game.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1"><p className="leading-relaxed text-muted-foreground">{game.shortDescription}</p>{premium && <><div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-violet-50 px-2.5 py-1 text-violet-800">{game.category}</span><span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">Level {game.level}</span><span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{difficulty}</span></div><p className="mt-4 text-sm leading-relaxed text-muted-foreground"><span className="font-semibold text-foreground">Learning objective:</span> {game.learningObjective}</p></>}{!premium && bestScore > 0 && <p className="mt-4 text-sm font-semibold text-green-700">Best score: {bestScore}/10</p>}</CardContent>
      <CardFooter><Button asChild variant={premium ? 'outline' : 'default'} className={premium ? 'min-h-11 w-full border-violet-300 text-violet-800 hover:bg-violet-50 hover:text-violet-900' : 'min-h-11 w-full'}><Link href={premium ? '/games/english/academy#access' : `/games/english/${game.slug}`}>{premium ? "See What's Included" : 'Play'}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></CardFooter>
    </Card>
  );
}
