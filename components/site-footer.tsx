import Link from 'next/link';
import { Calculator } from 'lucide-react';
import { HEALTH_TOOLS_URL } from '@/lib/site';

const footerLinks = [
  { label: 'Home', href: '/', external: false },
  { label: 'Tools', href: HEALTH_TOOLS_URL, external: true },
  { label: 'Games', href: '/games', external: false },
  { label: 'Shop', href: '/shop', external: false },
  { label: 'About', href: '/#about', external: false },
  { label: 'Contact', href: '/#contact', external: false },
  { label: 'Privacy Policy', href: '/privacy', external: false },
  { label: 'Terms of Use', href: '/terms', external: false },
] as const;

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calculator className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold text-foreground">Zalea Studio</span>
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3" aria-label="Footer navigation">
            {footerLinks.map((link) =>
              link.external ? (
                <a key={link.label} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              )
            )}
          </nav>
        </div>
        <div className="mt-8 border-t border-border/60 pt-6 text-center">
          <p className="text-sm text-muted-foreground">© 2026 Zalea Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
