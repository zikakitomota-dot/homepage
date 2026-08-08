import Link from 'next/link';
import { ArrowRight, Award, BookOpen, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { littleMoneyMaster } from '@/lib/site';

type ProductCardProps = {
  featured?: boolean;
};

export function ProductCard({ featured = false }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-md">
      <div className={featured ? 'grid lg:grid-cols-[0.8fr_1.2fr]' : ''}>
        <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-8" aria-label="Product image placeholder">
          <div className="flex aspect-[4/3] w-full max-w-sm flex-col items-center justify-center rounded-2xl border border-dashed border-primary/30 bg-white/70 p-6 text-center shadow-sm">
            <Gamepad2 className="h-12 w-12 text-primary" aria-hidden="true" />
            <p className="mt-4 font-semibold text-foreground">Little Money Master™</p>
            <p className="mt-1 text-sm text-muted-foreground">Product image coming soon</p>
          </div>
        </div>
        <div>
          <CardHeader>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Featured Product</p>
            <CardTitle className="text-2xl leading-tight sm:text-3xl">
              {littleMoneyMaster.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="leading-relaxed text-muted-foreground">{littleMoneyMaster.description}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {littleMoneyMaster.features.map((feature, index) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground">
                  {index === 1 ? <BookOpen className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> : index === 2 ? <Award className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> : <Gamepad2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />}
                  {feature}
                </li>
              ))}
            </ul>
            <Button asChild size="lg">
              <Link href={littleMoneyMaster.href}>
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
