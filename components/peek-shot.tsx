import Link from 'next/link';

export type Shot = { src: string; alt: string; width: number; height: number; caption: string; href: string };

/** A real screenshot pinned to the page like a printed photo: white border, a strip of tape, a slight tilt. */
export function PeekShot({ shot, tilt = -2, priority = false }: { shot: Shot; tilt?: number; priority?: boolean }) {
  return <figure className="zalea-shot" style={{ '--zs-tilt': `${tilt}deg` } as React.CSSProperties}>
    <Link href={shot.href} className="zalea-shot-frame" aria-label={`${shot.caption}: open it`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- small pre-sized WebP screenshots; no resizing service needed */}
      <img src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} loading={priority ? 'eager' : 'lazy'} decoding="async" />
    </Link>
    <figcaption className="zalea-shot-caption">{shot.caption}</figcaption>
  </figure>;
}

export const shots = {
  workHours: { src: '/images/previews/work-hours-calculator.webp', alt: 'The Work Hours Calculator with a weekly timesheet: start time, end time and unpaid break for each day, and the hours worked worked out on the right.', width: 1200, height: 760, caption: 'A week of shifts, added up', href: '/work-time/work-hours-calculator' },
  unitPrice: { src: '/images/previews/unit-price-calculator.webp', alt: 'The Unit Price Calculator comparing a 500 g pack for RM10 with a 1 kg pack for RM18. The 1 kg pack works out 10% cheaper per 100 g.', width: 1000, height: 760, caption: 'Which pack is cheaper? The big one, by 10%', href: '/finance/unit-price-calculator' },
  percentage: { src: '/images/previews/percentage-calculator.webp', alt: 'The Percentage Calculator working out 20% of 150: the answer is 30, with the calculation 20 ÷ 100 × 150 = 30 shown underneath.', width: 1200, height: 654, caption: '20% of 150, with the working shown', href: '/math/percentage-calculator' },
  grade: { src: '/images/previews/grade-calculator.webp', alt: 'The Grade Calculator with 42 points earned out of 50: a grade of 84.00%, an estimated B.', width: 1200, height: 637, caption: '42 out of 50? That’s 84%', href: '/education/grade-calculator' },
  worksheet: { src: '/images/previews/worksheet.webp', alt: 'A printable Addition within 10 worksheet made in the Worksheet Studio, with ten sums and lines for name and date.', width: 794, height: 640, caption: 'A worksheet, ready to print', href: '/worksheets' },
  memoryMatch: { src: '/images/previews/memory-match.webp', alt: 'Memory Match mid-game: two cards turned over showing a water drop and a bell, the other six still face down.', width: 1280, height: 760, caption: 'Memory Match, mid-game', href: '/games/logic/memory-match' },
} satisfies Record<string, Shot>;
