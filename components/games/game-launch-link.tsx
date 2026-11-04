import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

const categoryColors = {
  english: 'bg-blue-700 hover:bg-blue-800 focus-visible:ring-blue-700',
  mathematics: 'bg-rose-700 hover:bg-rose-800 focus-visible:ring-rose-700',
  science: 'bg-sage-foreground hover:bg-sage-foreground/90 focus-visible:ring-sage-foreground',
  geography: 'bg-sky-700 hover:bg-sky-800 focus-visible:ring-sky-700',
  logic: 'bg-purple-800 hover:bg-purple-900 focus-visible:ring-purple-800',
  'life-skills': 'bg-orange-800 hover:bg-orange-900 focus-visible:ring-orange-800',
} as const;

type Props = ComponentProps<typeof Link> & { subject: keyof typeof categoryColors };

// Explicit height and shrink resistance keep play links usable inside flex cards.
export function GameLaunchLink({ subject, className, ...props }: Props) {
  return <Link {...props} className={cn(
    'mt-7 inline-flex min-h-[44px] max-w-full shrink-0 items-center justify-center self-start rounded-md px-6 py-3 text-center text-sm font-medium leading-5 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&>svg]:shrink-0',
    categoryColors[subject], className,
  )} />;
}
