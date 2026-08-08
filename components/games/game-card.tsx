'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { readProgress } from '@/lib/games/progress';
import type { EnglishGame } from '@/lib/games/types';

export function GameCard({ game }: { game: EnglishGame }) {
  const [bestScore, setBestScore] = useState(0);
  useEffect(() => setBestScore(readProgress()[game.slug]?.bestScore ?? 0), [game.slug]);

  return (
    <Card className="flex h-full flex-col border-border/60 bg-white shadow-sm transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3"><span className="text-4xl" aria-hidden="true">{game.icon}</span><Badge className="bg-green-100 text-green-800 hover:bg-green-100">FREE</Badge></div>
        <CardTitle className="pt-3 text-xl">{game.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1"><p className="leading-relaxed text-muted-foreground">{game.shortDescription}</p>{bestScore > 0 && <p className="mt-4 text-sm font-semibold text-green-700">Best score: {bestScore}/10</p>}</CardContent>
      <CardFooter><Button asChild className="min-h-11 w-full"><Link href={`/games/english/${game.slug}`}>Play<ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button></CardFooter>
    </Card>
  );
}
