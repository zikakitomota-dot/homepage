import Link from 'next/link';
import { Calculator, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HEALTH_TOOLS_URL, navLinks, toolLinks } from '@/lib/site';

type NavigationLink =
  | (typeof navLinks)[number]
  | (typeof toolLinks)[number];

function NavItem({
  href,
  label,
  external,
}: NavigationLink) {
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

function DesktopToolsMenu() {
  return (
    <details className="group relative">
      <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        Tools
        <ChevronDown
          className="h-4 w-4 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="absolute left-1/2 top-full z-50 mt-3 w-44 -translate-x-1/2 rounded-xl border border-border/60 bg-background p-2 shadow-xl">
        {toolLinks.map((link) => (
          <div key={link.label} className="rounded-lg px-3 py-2 hover:bg-accent">
            <NavItem {...link} />
          </div>
        ))}
      </div>
    </details>
  );
}

function MobileToolsMenu() {
  return (
    <details>
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        Tools
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </summary>
      <div className="mt-3 flex flex-col gap-3 border-l border-border pl-4">
        {toolLinks.map((link) => (
          <NavItem key={link.label} {...link} />
        ))}
      </div>
    </details>
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

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          <NavItem {...navLinks[0]} />
          <DesktopToolsMenu />
          {navLinks.slice(1).map((link) => (
            <NavItem key={link.label} {...link} />
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild size="sm">
            <a href={HEALTH_TOOLS_URL} data-ga-event="cta_click" data-ga-label="header_explore_tools">Explore Health Calculators</a>
          </Button>
        </div>

        <details className="group relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg text-muted-foreground hover:bg-accent [&::-webkit-details-marker]:hidden">
            <span className="sr-only">Open navigation menu</span>
            <Menu className="h-5 w-5" aria-hidden="true" />
          </summary>
          <nav
            className="absolute right-0 top-12 flex w-52 flex-col gap-4 rounded-xl border border-border/60 bg-background p-5 shadow-xl"
            aria-label="Mobile navigation"
          >
            <NavItem {...navLinks[0]} />
            <MobileToolsMenu />
            {navLinks.slice(1).map((link) => (
              <NavItem key={link.label} {...link} />
            ))}
          </nav>
        </details>
      </div>
    </header>
  );
}
