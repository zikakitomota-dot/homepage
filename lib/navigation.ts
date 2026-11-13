import navigationData from './navigation.json';

export const navigation = navigationData;

function cleanPath(pathname: string) {
  const path = pathname.split(/[?#]/, 1)[0].replace(/\/+$/, '');
  return path || '/';
}

export function routeIsWithin(pathname: string, root: string) {
  const path = cleanPath(pathname);
  return path === root || root !== '/' && path.startsWith(root + '/');
}

// Guided paths are nested under /games, so their more specific group wins.
export function activeNavigationKey(pathname: string): string | null {
  if (routeIsWithin(pathname, '/learning')) return 'learning';
  if (navigation.learning.some(link => routeIsWithin(pathname, link.href))) return 'learning';
  if (navigation.tools.some(link => routeIsWithin(pathname, link.href))) return 'tools';
  return navigation.primary.find(item => item.href && routeIsWithin(pathname, item.href))?.href ?? null;
}

export function currentNavigationValue(pathname: string, href: string): 'page' | 'location' | undefined {
  if (cleanPath(pathname) === href) return 'page';
  return routeIsWithin(pathname, href) ? 'location' : undefined;
}

type MenuDecoration = { paths: string[]; description?: string };
export const navigationDecorations: Record<string, MenuDecoration> = {
  '/learning/malaysia/curriculum': { paths: ['M4 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H4V4Z', 'M13 7a3 3 0 0 1 3-3h5v15h-4a4 4 0 0 0-4 2'], description: 'Explore country-based learning' },
  '/health': { paths: ['M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z'] },
  '/finance': { paths: ['M20 8V5a2 2 0 0 0-2-2H6a3 3 0 0 0 0 6h14v11H6a3 3 0 0 1-3-3V6', 'M20 12h-4v4h4'] },
  '/work-time': { paths: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z', 'M12 7v5l3 2'] },
  '/education': { paths: ['m2 9 10-5 10 5-10 5L2 9Z', 'M6 11v6c4 3 8 3 12 0v-6', 'M22 9v6'] },
  '/math': { paths: ['M18 4H6l7 8-7 8h12'] },
  '/games/missions': { paths: ['m4 6 1 1 2-2', 'M10 6h10', 'm4 12 1 1 2-2', 'M10 12h10', 'm4 18 1 1 2-2', 'M10 18h10'], description: 'Follow a short activity sequence' },
  '/games/my-learning-journey': { paths: ['M4 4v16h16', 'M8 16v-4', 'M13 16V8', 'M18 16V5'], description: 'Continue progress on this device' },
};
