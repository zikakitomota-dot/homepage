import { PeekShot, type Shot } from '@/components/peek-shot';

/**
 * Hub page opener: a plain-spoken intro on one side and, on the other, something real from the
 * section — a screenshot of its main tool (`shot`) or any other piece of the page (`aside`).
 */
export function HubHero({ title, intro, shot, aside, tilt = 2, children }: { title: string; intro: React.ReactNode; shot?: Shot; aside?: React.ReactNode; tilt?: number; children?: React.ReactNode }) {
  return <section className="zalea-hub-hero">
    <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:px-8 lg:py-20">
      <div>
        <h1 className="text-balance font-bold tracking-tight">{title}</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
        {children}
      </div>
      {shot ? <PeekShot shot={shot} tilt={tilt} priority /> : aside}
    </div>
  </section>;
}
