import type { GameAccess } from './types';

export type EntitlementStatus = 'free' | 'premium' | 'unknown';

export function getEntitlementStatus(access: GameAccess): EntitlementStatus {
  return access === 'free' ? 'free' : 'unknown';
}

export function canAccessGame(access: GameAccess) {
  return getEntitlementStatus(access) === 'free';
}

// Future premium access must replace the unknown state with a server-validated,
// signed entitlement. Never validate Payhip credentials or license keys here.
