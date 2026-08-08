# Future premium game access

Phase 1 games declare `access: "free"` in `lib/games/english-games.ts`. The shared
`canAccessGame` boundary in `lib/games/access.ts` currently permits free games and
rejects premium games.

When premium access is introduced, keep Payhip validation on the server:

1. A buyer submits a Payhip-generated license key to a protected Zalea Studio
   server or Cloudflare endpoint.
2. That endpoint validates the key with Payhip using server-side credentials.
3. A valid response creates a signed, limited entitlement/session.
4. The game route checks that entitlement through the access boundary before
   returning premium content.

Never place Payhip secrets in browser JavaScript, store raw unrestricted license
keys in localStorage, or ship premium question banks to an unauthorized client.
The current local progress adapter stores only best scores and completion counts;
it is not an entitlement system.

To add a premium game later, add its metadata and question bank with
`access: "premium"`, then connect `canAccessGame` to the server-validated
entitlement. The reusable engine and route do not need to be rewritten.
