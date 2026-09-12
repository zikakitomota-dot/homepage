# Zalea Studio AdSense Content Improvement Report

Date: 12 September 2026

## Scope completed

This implementation follows the approved Phase 1 audit in `docs/adsense-content-audit.md`. It strengthens the five weakest finance calculators, expands the Animal Habitats learning page, turns the grammar page into a standalone teaching guide, adds the approved four-guide collection, improves relevant internal links, and removes unsupported sitemap modification dates.

No calculator formulas, calculator components, game questions, answers, scoring, difficulty behaviour, product functionality, pricing, purchase destinations, analytics, AdSense IDs, Search Console verification, IndexNow code, routes, or Cloudflare/OpenNext configuration were changed.

## 1. Exact pages changed

### Finance calculators

- `/finance/savings-goal-calculator`
- `/finance/discount-calculator`
- `/finance/split-bill-calculator`
- `/finance/cashback-calculator`
- `/finance/unit-price-calculator`

### Educational pages

- `/games/science/animal-habitats`
- `/grammar-games-for-kids`
- `/math/percentage-calculator` (one contextual guide link only)

### Freebie pages affected through shared data

- `/freebies/pre-writing-pencil-control`
- `/freebies/fine-motor-activity-cards`
- `/freebies/scissor-skills-practice`

Each of these three freebie pages received one relevant link to the pre-writing guide. Their titles, descriptions, downloads, categories, page copy, metadata and layouts were otherwise unchanged.

### Shared surfaces

- The footer now includes a single `Guides` link.
- The sitemap includes the Guides landing page and four guide pages.

## 2. Content added to each page

### Savings Goal Calculator

Added guidance on when to use the calculator, how to interpret a rounded contribution timeline, realistic versus best-case contributions, separate purposes for savings, target-price reviews, common input/planning mistakes, and relevant calculators, guide and printable resources.

### Discount Calculator

Added sale-comparison use cases, an explanation of savings versus final price, consecutive discounts, checkout charges, misleading comparison prices, common calculation mistakes, practical offer checks and related percentage/unit-price resources.

### Split Bill Calculator

Added guidance on deciding whether equal splitting is suitable, interpreting rounded shares, service charges, shared versus individual items, group-agreement tips, common settlement mistakes and a direct path to the fuller equal-versus-unequal guide.

### Cashback Calculator

Added guidance on offer caps and effective cost, the difference between a later reward and an instant discount, eligibility and redemption restrictions, minimum-spend pitfalls, effective comparisons and related discount/percentage resources.

### Unit Price Calculator

Added package-comparison use cases, base-unit interpretation, the meaning of the reported percentage difference, incompatible measurement types, waste and storage considerations, promotional-price handling and related finance tools.

### Animal Habitats

Added a child-friendly explanation of habitats; forest, desert, ocean, and ice-and-snow summaries; an explanation of observation and classification clues; parent/teacher activity ideas; age-appropriate learning goals; guidance about habitat overlap and exceptions; and links to related learning resources. The game remains the first prominent activity and remains ad-free.

### Grammar guide

Repositioned the page as an informational teaching guide before its game catalogue. Added guidance on teaching meaning before terminology, using examples in context, moving from listening to recognition and independent use, early grammar concepts, common mistakes, a simple practice routine, and low-pressure correction. The existing Level 1 game links and Academy progression information remain, but now follow the standalone educational guidance. The title and description were rewritten to reflect the page's guide purpose.

## 3. New guide routes

- `/guides`
- `/guides/how-to-set-a-realistic-savings-goal`
- `/guides/pre-writing-skills-activities`
- `/guides/equal-vs-unequal-bill-splitting`
- `/guides/percentage-points-vs-percentage-change`

Each route has a unique title, unique meta description, self-referencing canonical, one H1, index/follow metadata inherited from the site, breadcrumb navigation and structured data where appropriate. The four articles use examples and decision guidance that go beyond the shorter calculator explanations.

## 4. Internal links added

- Savings Goal Calculator ↔ realistic savings goal guide.
- Split Bill Calculator ↔ equal-versus-unequal bill splitting guide.
- Percentage Calculator, Discount Calculator and Cashback Calculator ↔ percentage-points guide where contextually relevant.
- Pre-Writing & Pencil Control, Fine Motor Activity Cards and Scissor Skills Practice ↔ pre-writing activities guide.
- Grammar guide → every relevant Level 1 English game, with the existing game and Academy guide links retained.
- Guides landing page → all four approved guides.
- Footer → Guides landing page.

No sitewide keyword lists or repeated in-paragraph promotional links were added.

## 5. Sitemap change

The sitemap now contains 69 canonical URLs: the prior 64 plus the Guides landing page and four guide articles. All entries remain crawlable.

The shared hardcoded `lastModified` value was removed from every entry because the repository has no reliable content-specific modification date source. No replacement dates were fabricated. Existing change frequencies and priorities remain, with sensible values added for the guide routes.

## 6. AdSense eligibility and exclusions

The strict centralized allowlist in `lib/adsense.ts` was not changed.

- The five improved finance calculators remain AdSense-eligible.
- The existing Percentage Calculator remains AdSense-eligible.
- Animal Habitats, the grammar guide, games, freebies, shop, Contact, About and legal pages remain ad-free.
- `/guides` and all four new guide routes are ad-free because no guide route was added to the allowlist.
- The child-focused pre-writing guide is therefore explicitly outside AdSense eligibility, as required.

The local rendered-HTML crawl found the expected script count on every sitemap page: one AdSense integration on allowlisted pages and zero on all excluded pages.

## 7. QA results

### Automated checks

- Type check: passed (`tsc --noEmit`).
- Lint: passed (`next lint`). The command reports only Next.js's existing deprecation and multiple-lockfile workspace-root notices.
- Production build: passed with Next.js 15.5.22; all 78 generated/static/dynamic build entries completed.
- `git diff --check`: passed.

### Route and metadata crawl

- Sitemap: HTTP 200, 69 URLs, no fabricated `<lastmod>` values.
- All 69 sitemap URLs: HTTP 200.
- H1: exactly one on every sitemap page.
- Canonicals: all match their canonical public path. The homepage serializes the equivalent `https://zaleastudio.com` form without a trailing slash.
- Robots metadata: every sitemap page is `index, follow`; no accidental `noindex` found.
- Metadata: no missing or duplicate page titles or descriptions found.
- Internal links: 89 distinct internal page destinations checked; no broken links found.
- `robots.txt`: HTTP 200 and still allows the site while disallowing `/api/`.
- Visible ad-placeholder text: none found.

### Calculator behaviour

The calculator implementation file was not modified. Browser checks confirmed the established example results:

- Savings: RM10,000 goal − RM2,000 saved at RM500/month = RM8,000 remaining and 16 months.
- Discount: RM120 at 20% = RM24 discount and RM96 final price.
- Split bill: RM120 plus 10% tip across four people = RM33 each.
- Cashback: RM250 at 5% with a RM10 cap = RM10 earned and RM240 effective cost.
- Unit price: RM10/500 g versus RM18/1 kg = Product B at RM1.80 per 100 g, 10% cheaper.

### Responsive and runtime checks

- 320 px: Guides landing, all four guide articles, Savings Goal Calculator, Animal Habitats and grammar guide checked with no horizontal overflow.
- 1280 px: Guides landing, representative guide, all five improved finance calculators, Animal Habitats and grammar guide checked with no horizontal overflow.
- Visual inspection at 320 px and 1280 px confirmed readable heading wrapping, natural spacing and intact navigation.
- No hydration errors or application runtime errors were recorded while navigating and testing the changed routes.
- The browser recorded an existing third-party AdSense warning that its script tag does not support Next.js's `data-nscript` attribute on eligible pages. This warning is produced by the unchanged AdSense integration and did not prevent loading or calculation; excluded pages load no AdSense script.

## 8. Remaining low-value-content risks

- AdSense approval remains Google's decision; these changes improve publisher value but cannot guarantee approval.
- The five finance pages intentionally retain one shared visual template. Their supporting content is now page-specific, but future calculator additions should avoid copying the same prose structure without a distinct user need.
- The new Guides section is deliberately small. It should grow only when a new guide answers a clearly distinct question rather than duplicating calculator content.
- No individual author/reviewer names were added because the repository does not provide verifiable identities or credentials. Existing Zalea Studio publisher and methodology information remains the truthful trust signal.
- Animal Habitats now has substantially stronger supporting learning content, but its final artwork remains a separate asset-integration task and is not part of this content implementation.

## Readiness assessment

The implementation resolves the highest-priority thin-content findings from the approved audit without expanding ads onto child-focused or non-commercial trust pages. Technical QA is clean apart from known non-blocking framework/third-party warnings. The site is technically ready for deployment and another AdSense review after the owner approves these uncommitted changes.
