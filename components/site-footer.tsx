import Link from 'next/link';
import { ABOUT_ROUTE, CONTACT_ROUTE, HEALTH_TOOLS_URL } from '@/lib/site';

// Keep in step with health/src/components/Footer.astro.
const footerGroups = [
  { title: 'Explore', links: [
    { label: 'Games', href: '/games' },
    { label: 'Health Calculators', href: HEALTH_TOOLS_URL },
    { label: 'Guides', href: '/guides' },
    { label: 'Shop', href: '/shop' },
  ] },
  { title: 'About Zalea', links: [
    { label: 'About', href: ABOUT_ROUTE },
    { label: 'Editorial Standards', href: '/editorial-standards' },
    { label: 'Contact', href: CONTACT_ROUTE },
  ] },
  { title: 'The fine print', links: [
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Use', href: '/terms-of-use' },
  ] },
] as const;

export function SiteFooter() {
  return (
    <footer id="contact" className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)]">
          <div className="max-w-sm"><Link href="/" className="inline-flex min-h-[44px] items-center">
            <span className="font-display text-2xl font-bold text-foreground">Zalea Studio</span>
          </Link><p className="mt-2 text-sm leading-6 text-muted-foreground">Explained calculators, learning activities, practical guides and original printables for everyday tasks.</p></div>
          <nav className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3" aria-label="Footer navigation">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h2 className="font-display text-base font-bold text-foreground">{group.title}</h2>
                <ul className="mt-1">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="inline-flex min-h-[44px] items-center text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="mt-8 border-t border-border/60 pt-6 text-center">
          <p className="mb-2 text-sm text-muted-foreground">Published and maintained by Zalea Studio · <Link href="/editorial-standards" className="font-semibold text-primary hover:underline">How content is prepared</Link> · <Link href="/contact" className="font-semibold text-primary hover:underline">Report an issue</Link></p>
          <p className="text-sm text-muted-foreground">© 2026 Zalea Studio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
