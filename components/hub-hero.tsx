import { PeekShot, type Shot } from '@/components/peek-shot';

/** Hub page opener: a plain-spoken intro on one side, a real screenshot of the section's main tool on the other. */
export function HubHero({ title, intro, shot, tilt = 2 }: { title: string; intro: React.ReactNode; shot: Shot; tilt?: number }) {
  return <section className="zalea-hub-hero">
    <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14 lg:px-8 lg:py-20">
      <div>
        <h1 className="text-balance font-bold tracking-tight">{title}</h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{intro}</p>
      </div>
      <PeekShot shot={shot} tilt={tilt} priority />
    </div>
  </section>;
}
