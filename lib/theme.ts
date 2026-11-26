export const THEMES = [
  { id: 'bright', label: 'Bright' },
  { id: 'soft', label: 'Soft' },
  { id: 'night', label: 'Night' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export const THEME_STORAGE_KEY = 'zalea-theme';
export const THEME_CHANGE_EVENT = 'zalea-theme-change';

/**
 * Runs before first paint (inline in <head>) so a returning visitor never sees the wrong theme flash.
 * Kept tiny and dependency-free; storage access can throw in private modes, so it is wrapped.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='soft'||t==='night'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export function isThemeId(value: unknown): value is ThemeId {
  return THEMES.some((theme) => theme.id === value);
}

export function readTheme(): ThemeId {
  if (typeof document === 'undefined') return 'bright';
  const current = document.documentElement.getAttribute('data-theme');
  return isThemeId(current) ? current : 'bright';
}

export function applyTheme(theme: ThemeId) {
  const root = document.documentElement;
  if (theme === 'bright') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the theme still applies for this page view.
  }
  window.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, { detail: theme }));
}
