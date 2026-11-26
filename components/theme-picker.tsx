'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { THEMES, THEME_CHANGE_EVENT, applyTheme, readTheme, type ThemeId } from '@/lib/theme';

/** Theme button plus a small list of Bright / Soft / Night. A disclosure with pressed buttons, so it needs no arrow-key handling. */
export function ThemePicker() {
  const [theme, setTheme] = useState<ThemeId>('bright');
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    setTheme(readTheme());
    const sync = () => setTheme(readTheme());
    window.addEventListener(THEME_CHANGE_EVENT, sync);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      setOpen(false);
      button.current?.focus();
    };
    document.addEventListener('pointerdown', outside);
    root.current?.addEventListener('keydown', escape);
    const node = root.current;
    return () => {
      document.removeEventListener('pointerdown', outside);
      node?.removeEventListener('keydown', escape);
    };
  }, [open]);

  const current = THEMES.find((item) => item.id === theme) ?? THEMES[0];

  return <div ref={root} className="zalea-theme" onBlur={(event) => { if (!root.current?.contains(event.relatedTarget as Node)) setOpen(false); }}>
    <button ref={button} type="button" className="zalea-theme-button" aria-expanded={open} aria-controls={listId} aria-label={`Theme: ${current.label}`} onClick={() => setOpen((value) => !value)}>
      <span className="zalea-theme-swatch" data-swatch={current.id} aria-hidden="true" />
      <span aria-hidden="true">{current.label}</span>
      <ChevronDown className="zalea-theme-chevron" aria-hidden="true" />
    </button>
    <ul id={listId} className="zalea-theme-menu" hidden={!open} aria-label="Choose a theme">
      {THEMES.map((item) => <li key={item.id}>
        <button type="button" className="zalea-theme-option" aria-pressed={item.id === theme} data-ga-event="theme_change" data-ga-label={item.id} onClick={() => { applyTheme(item.id); setTheme(item.id); setOpen(false); button.current?.focus(); }}>
          <span className="zalea-theme-swatch" data-swatch={item.id} aria-hidden="true" />
          <span className="zalea-theme-option-label">{item.label}</span>
          <Check className="zalea-theme-check" aria-hidden="true" />
        </button>
      </li>)}
    </ul>
  </div>;
}
