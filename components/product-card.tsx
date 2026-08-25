import Image from 'next/image';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ShopProduct } from '@/lib/shop-products';

type ProductCardProps = {
  product: ShopProduct;
  featured?: boolean;
};

export function ProductCard({ product, featured = false }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-md">
      <div className={featured ? 'grid lg:grid-cols-[0.8fr_1.2fr]' : ''}>
        <div className="flex min-h-64 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 sm:p-8">
          <Image
            src={product.image}
            alt={product.imageAlt}
            width={800}
            height={1132}
            priority={featured}
            className="h-auto max-h-[32rem] w-auto max-w-full rounded-2xl object-contain shadow-md"
            sizes={featured ? '(min-width: 1024px) 32vw, 90vw' : '(min-width: 768px) 672px, 90vw'}
          />
        </div>
        <div>
          <CardHeader>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Featured Product</p>
            <CardTitle className="text-2xl leading-tight sm:text-3xl">
              {product.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="leading-relaxed text-muted-foreground">{product.description}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-medium text-foreground">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
            <p className="text-xl font-bold text-foreground">{product.price}</p>
            <Button asChild size="lg">
              <a href={product.href} target={product.external ? '_blank' : undefined} rel={product.external ? 'noopener noreferrer' : undefined} data-ga-event="product_click" data-ga-label={product.title}>
                {product.cta}
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </a>
            </Button>
          </CardContent>
        </div>
      </div>
    </Card>
  );
}
