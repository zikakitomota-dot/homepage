import Link from 'next/link';
import { Calculator, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HEALTH_TOOLS_URL, navLinks } from '@/lib/site';

function NavItem({
  href,
  label,
  external,
}: (typeof navLinks)[number]) {
  const className =
    'text-sm font-medium text-muted-foreground transition-colors hover:text-foreground';

  return external ? (
    <a href={href} className={className}>
      {label}
    </a>
  ) : (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="Zalea Studio home">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Calculator className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Zalea Studio
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <NavItem key={link.label} {...link} />
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild size="sm">
            <a href={HEALTH_TOOLS_URL}>Explore Tools</a>
          </Button>
        </div>

        <details className="group relative md:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg text-muted-foreground hover:bg-accent [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open navigation menu</span>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <nav
            className="absolute right-0 top-12 flex w-52 flex-col gap-4 rounded-xl border border-border/60 bg-background p-5 shadow-xl"
            aria-label="Mobile navigation"
          >
            {navLinks.map((link) => (
              <NavItem key={link.label} {...link} />
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
