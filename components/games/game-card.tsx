'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, LockKeyhole } from 'lucide-react';
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

  return (
    <Card className="flex h-full flex-col border-border/60 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3"><span className="text-4xl" aria-hidden="true">{game.icon}</span><Badge className={premium ? 'bg-violet-100 text-violet-800 hover:bg-violet-100' : 'bg-green-100 text-green-800 hover:bg-green-100'}>{premium && <LockKeyhole className="mr-1 h-3.5 w-3.5" aria-hidden="true" />}{premium ? 'ACADEMY' : 'FREE'}</Badge></div>
        <CardTitle className="pt-3 text-xl">{game.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1"><p className="leading-relaxed text-muted-foreground">{game.shortDescription}</p>{!premium && bestScore > 0 && <p className="mt-4 text-sm font-semibold text-green-700">Best score: {bestScore}/10</p>}</CardContent>
      <CardFooter><Button asChild variant={premium ? 'outline' : 'default'} className="min-h-11 w-full"><Link href={premium ? '/games/english/academy#access' : `/games/english/${game.slug}`}>{premium ? 'View Academy' : 'Play'}<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></CardFooter>
    </Card>
  );
}
