import type { GameAccess } from './types';
import { hasAcademyAccess } from './academy-access';

export type EntitlementStatus = 'free' | 'premium' | 'unknown';

export function getEntitlementStatus(access: GameAccess): EntitlementStatus {
  return access === 'free' ? 'free' : 'unknown';
}

export async function canAccessGame(access: GameAccess) {
  return getEntitlementStatus(access) === 'free' || hasAcademyAccess();
}
