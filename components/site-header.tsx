'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, Check, ChevronDown, Menu } from 'lucide-react';
import { activeNavigationKey, currentNavigationValue, navigation, navigationDecorations } from '@/lib/navigation';
import './site-navigation.css';

function MenuItems({ group, pathname }: { group: 'tools' | 'learning'; pathname: string }) {
  return <div className="zalea-menu-panel">
    <span className="zalea-menu-heading">{group === 'tools' ? 'Calculators' : 'Learning paths'}</span>
    {navigation[group].map(link => {
      const decoration = navigationDecorations[link.href];
      const current = currentNavigationValue(pathname, link.href);
      return <Link key={link.href} href={link.href} className="zalea-menu-link" aria-current={current}>
        <span className="zalea-menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{decoration.paths.map((d, i) => <path key={i} d={d} />)}</svg></span>
        <span><span className="zalea-menu-label">{link.label}</span>{decoration.description && <span className="zalea-menu-description">{decoration.description}</span>}</span>
        {current && <Check className="zalea-menu-current" aria-hidden="true" />}
      </Link>;
    })}
  </div>;
}

function NavigationItems({ pathname }: { pathname: string }) {
  const active = activeNavigationKey(pathname);
  return <>{navigation.primary.map(item => {
    const key = item.group ?? item.href;
    const className = 'zalea-nav-item' + (active === key ? ' is-active' : '');
    return item.href ? <Link key={key} href={item.href} aria-label={item.accessibleLabel} aria-current={currentNavigationValue(pathname, item.href)} className={className} data-navigation-key={key}>{item.label}</Link> :
      <details key={key} className="zalea-menu">
        <summary className={className} aria-current={active === key ? 'location' : undefined} data-navigation-key={key}>{item.label}<ChevronDown className="zalea-chevron" aria-hidden="true" /></summary>
        <MenuItems group={item.group as 'tools' | 'learning'} pathname={pathname} />
      </details>;
  })}</>;
}

export function SiteHeader() {
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const header = root.current;
    if (!header) return;
    header.querySelectorAll('details').forEach(details => {
      details.querySelector(':scope > summary')?.setAttribute('aria-expanded', String(details.open));
    });
    const setClosed = (details: Element) => {
      details.removeAttribute('open');
      details.querySelector(':scope > summary')?.setAttribute('aria-expanded', 'false');
    };
    const close = () => header.querySelectorAll('details[open]').forEach(setClosed);
    const outside = (event: PointerEvent) => { if (!header.contains(event.target as Node)) close(); };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const details = (event.target as Element).closest('details[open]') as HTMLDetailsElement | null;
      if (details && header.contains(details)) {
        event.preventDefault(); event.stopPropagation(); setClosed(details);
        details.querySelector<HTMLElement>(':scope > summary')?.focus();
      }
    };
    const click = (event: MouseEvent) => { if ((event.target as Element).closest('a')) close(); };
    const focus = (event: FocusEvent) => {
      header.querySelectorAll('details[open]').forEach(details => {
        if (!details.contains(event.relatedTarget as Node)) setClosed(details);
      });
    };
    const toggle = (event: Event) => {
      const opened = event.target as HTMLDetailsElement;
      opened.querySelector(':scope > summary')?.setAttribute('aria-expanded', String(opened.open));
      if (!opened.open) return;
      opened.parentElement?.querySelectorAll(':scope > details[open]').forEach(other => {
        if (other !== opened) setClosed(other);
      });
    };
    document.addEventListener('pointerdown', outside);
    header.addEventListener('keydown', escape);
    header.addEventListener('click', click);
    header.addEventListener('focusout', focus);
    header.addEventListener('toggle', toggle, true);
    return () => {
      document.removeEventListener('pointerdown', outside);
      header.removeEventListener('keydown', escape);
      header.removeEventListener('click', click);
      header.removeEventListener('focusout', focus);
      header.removeEventListener('toggle', toggle, true);
    };
  }, []);

  return <header ref={root} className="zalea-header">
    <div className="zalea-header-inner">
      <Link href="/" className="zalea-brand" aria-label="Zalea Studio home"><span className="zalea-brand-icon"><Calculator aria-hidden="true" /></span><span>Zalea Studio</span></Link>
      <nav className="zalea-desktop-nav" aria-label="Main navigation"><NavigationItems pathname={pathname} /></nav>
      <details className="zalea-mobile-navigation">
        <summary className="zalea-mobile-toggle" aria-label="Navigation menu"><Menu aria-hidden="true" /><span>Menu</span></summary>
        <nav className="zalea-mobile-panel" aria-label="Mobile navigation">
          <NavigationItems pathname={pathname} /><div className="zalea-nav-utility">{navigation.utility.map(link => <Link key={link.href} href={link.href} className="zalea-nav-item" aria-current={currentNavigationValue(pathname, link.href)}>{link.label}</Link>)}</div>
        </nav>
      </details>
    </div>
  </header>;
}
