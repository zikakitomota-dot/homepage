import Link from 'next/link';
import { ArrowRight, BadgeDollarSign, Banknote, CalendarDays, Clock3, Timer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { workTimeTools } from '@/lib/work-time';

const icons = { clock: Clock3, calendar: CalendarDays, timer: Timer, overtime: BadgeDollarSign, salary: Banknote };

export function RelatedWorkTimeTools({ currentSlug }: { currentSlug: string }) {
  const relatedTools = workTimeTools.filter((tool) => tool.slug !== currentSlug);
  if (relatedTools.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1000px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20" aria-labelledby="related-work-time-tools">
      <h2 id="related-work-time-tools" className="text-3xl font-bold tracking-tight">Related Work &amp; Time Tools</h2>
      <div className="mt-7 grid gap-5 md:grid-cols-2">
        {relatedTools.map((tool) => {
          const Icon = icons[tool.icon];
          return <Link key={tool.slug} href={`/work-time/${tool.slug}`} className="group rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"><Card className="h-full border-border/60 shadow-sm transition-all group-hover:-translate-y-1 group-hover:shadow-md"><CardHeader><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" aria-hidden="true" /></span><CardTitle className="flex items-center justify-between gap-3 pt-2 text-xl">{tool.title}<ArrowRight className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" /></CardTitle></CardHeader><CardContent><p className="leading-relaxed text-muted-foreground">{tool.description}</p></CardContent></Card></Link>;
        })}
      </div>
    </section>
  );
}
