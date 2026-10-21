import Link from 'next/link';

type ContentAccountabilityProps = { context?: 'calculator' | 'guide' | 'general' };

export function ContentAccountability({ context = 'general' }: ContentAccountabilityProps) {
  const methodLabel = context === 'calculator' ? 'Calculation method and limitations' : context === 'guide' ? 'Sources, examples and scope' : 'How this content is prepared';
  return (
    <aside className="border-y border-border/60 bg-blue-50/40" aria-label="Publishing and review information">
      <div className="mx-auto grid max-w-[1000px] gap-4 px-4 py-8 text-sm sm:px-6 md:grid-cols-3 lg:px-8">
        <div><p className="font-bold text-foreground">Published by Zalea Studio</p><p className="mt-1 leading-6 text-muted-foreground">Zalea Studio prepares and maintains this page under its own publisher name.</p></div>
        <div><p className="font-bold text-foreground">{methodLabel}</p><p className="mt-1 leading-6 text-muted-foreground">Methods, examples and important boundaries are explained on the page and governed by our <Link href="/editorial-standards" className="font-semibold text-primary hover:underline">Editorial Standards</Link>.</p></div>
        <div><p className="font-bold text-foreground">Found a problem?</p><p className="mt-1 leading-6 text-muted-foreground"><Link href="/contact" className="font-semibold text-primary hover:underline">Report an issue</Link> with the page URL, inputs or example used, and what appeared incorrect. Do not send sensitive information.</p></div>
      </div>
    </aside>
  );
}
