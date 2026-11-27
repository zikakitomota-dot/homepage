import Link from 'next/link';

type Cover = { slug: string; title: string };

/** Three real printable covers fanned out like sheets on a table. Each one opens its download page. */
export function PrintableFan({ covers, caption }: { covers: readonly [Cover, Cover, Cover]; caption: string }) {
  return <figure className="zalea-fan">
    <div className="zalea-fan-sheets">
      {covers.map((cover) => <Link key={cover.slug} href={`/freebies/${cover.slug}`} className="zalea-fan-sheet" aria-label={`${cover.title}: see what is inside`}>
        {/* eslint-disable-next-line @next/next/no-img-element -- small pre-sized WebP covers rendered from the PDFs */}
        <img src={`/images/printables/${cover.slug}.webp`} alt={`Cover page of the ${cover.title} printable`} width={612} height={866} loading="eager" decoding="async" />
      </Link>)}
    </div>
    <figcaption className="zalea-shot-caption">{caption}</figcaption>
  </figure>;
}
