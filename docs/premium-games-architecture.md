# Future premium game access

Free games declare `access: "free"` in `lib/games/english-games.ts`. Academy cards
declare `access: "premium"` in `lib/games/academy-games.ts`, but that public catalog
contains metadata only—never premium questions. The shared entitlement boundary in
`lib/games/access.ts` returns `free` for free content and `unknown` for Academy content.

When premium access is introduced, keep Payhip validation on the server:

1. A buyer submits a Payhip-generated license key to a protected Zalea Studio
   server or Cloudflare endpoint.
2. That endpoint validates the key with Payhip using server-side credentials.
3. A valid response creates a signed, limited entitlement/session.
4. A protected route checks that entitlement before importing or returning premium
   question content.

Never place Payhip secrets in browser JavaScript, store raw unrestricted license
keys in localStorage, or ship premium question banks to an unauthorized client.
The current local progress adapter stores only best scores and completion counts;
it is not an entitlement system.

## Content storage decision

This repository is public and currently has no protected content store. Premium
question banks must therefore **not** be committed here, placed in public assets,
or referenced by a production client bundle. UI locks, hidden URLs, environment
checks, and localStorage flags are not security boundaries.

Before Academy gameplay is enabled:

1. Store premium question banks in a private server-side source or encrypted data
   store that is not part of the public repository or static deployment.
2. Validate the Payhip license through a protected Cloudflare/server endpoint.
3. Issue a signed, limited entitlement/session without exposing the raw Payhip key.
4. Load only the requested premium game data after checking the entitlement.
5. Mark protected gameplay responses as private/no-store and keep locked gameplay
   routes out of the public sitemap.

`AcademyGameSummary.interaction` already identifies multiple-choice, visual
multiple-choice, and word-order games. Implement the word-order renderer when the
protected question delivery contract is available; it should receive only the
authorized session's 10 questions, not the entire Academy library.

The Academy page and its 20 catalog cards are safe to publish now. Premium gameplay
routes and question banks intentionally remain absent until the steps above exist.
