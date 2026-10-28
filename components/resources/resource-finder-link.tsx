import Link from 'next/link';
import { Search } from 'lucide-react';

export function ResourceFinderLink() {
  return <div className="worksheet-screen-only mx-auto max-w-[1200px] px-4 py-4 sm:px-6 lg:px-8"><Link href="/resources" className="inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><Search className="h-4 w-4 shrink-0" aria-hidden="true" />Find a game, worksheet, printable or practical tool</Link></div>;
}
