import { BookOpen, PencilRuler } from 'lucide-react';
import Image from 'next/image';
import type { Freebie } from '@/lib/freebies';
import { freebieCategories } from '@/lib/freebies';

export function FreebiePreview({ freebie, compact = false }: { freebie: Freebie; compact?: boolean }) {
  if (freebie.previewImage) {
    return (
      <div className={`relative bg-stone-100 ${compact ? 'aspect-[4/3]' : 'min-h-[360px] sm:min-h-[440px]'}`}>
        <Image
          src={freebie.previewImage}
          alt={`Preview of ${freebie.title}`}
          fill
          sizes={compact ? '(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 45vw, 100vw'}
          className="object-cover"
        />
      </div>
    );
  }

  const playful = freebie.category === 'kids-early-learning';
  const Icon = playful ? PencilRuler : BookOpen;

  return (
    <div
      className={`relative flex overflow-hidden bg-gradient-to-br ${
        playful ? 'from-amber-50 via-rose-50 to-emerald-50' : 'from-stone-50 via-emerald-50/70 to-sky-50'
      } ${compact ? 'aspect-[4/3] items-center justify-center p-6' : 'min-h-[360px] items-center justify-center p-8 sm:min-h-[440px]'}`}
      role="img"
      aria-label={`Preview illustration for ${freebie.title}`}
    >
      <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/60" aria-hidden="true" />
      <div className="absolute -bottom-8 -left-8 h-28 w-28 rounded-full bg-emerald-200/30" aria-hidden="true" />
      <div className={`relative w-full rounded-2xl border border-white/80 bg-white/90 shadow-lg ${compact ? 'max-w-[220px] p-5' : 'max-w-sm p-8'}`}>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">{freebieCategories[freebie.category].label}</p>
        <p className={`${compact ? 'mt-2 text-xl' : 'mt-3 text-3xl'} font-bold leading-tight text-slate-900`}>{freebie.shortTitle}</p>
        <div className="mt-5 space-y-2" aria-hidden="true">
          <span className="block h-2 rounded-full bg-slate-200" />
          <span className="block h-2 w-4/5 rounded-full bg-slate-200" />
          <span className="block h-2 w-3/5 rounded-full bg-emerald-200" />
        </div>
      </div>
    </div>
  );
}
