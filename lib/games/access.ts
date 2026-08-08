import type { GameAccess } from './types';

export function canAccessGame(access: GameAccess) {
  return access === 'free';
}

// Future premium access should replace this boundary with a server-validated
// entitlement. Never validate Payhip credentials or license keys in this client helper.
