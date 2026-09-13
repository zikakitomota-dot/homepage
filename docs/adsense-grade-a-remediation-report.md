# AdSense Grade A Remediation Report

Date: 13 September 2026
Scope: all 81 indexable URLs in the Main and Health sitemaps
Source of truth: `docs/adsense-grade-a-gap-analysis.md`

## Outcome

The approved Top 15 remediation programme has been implemented without changing calculator formulas, game questions or answers, scoring, difficulty behaviour, prices, purchase destinations, routes, canonicals, sitemap membership, indexing rules, the AdSense allowlist, Analytics, Search Console verification, or IndexNow behaviour.

The post-implementation audit reaches the requested Grade A threshold:

| Rating | Before | After |
|---|---:|---:|
| Strong | 23 | 53 |
| Acceptable | 54 | 28 |
| Borderline | 4 | 0 |
| Low Value | 0 | 0 |
| Total | 81 | 81 |

“Acceptable” is retained for concise legal/contact pages and pages where genuine first-hand product or printable evidence would be needed to justify Strong. They are not padded merely to improve the score. No page remains Borderline or Low Value.

## What changed

1. Main and Health now identify Zalea Studio as the responsible publisher and explain source selection, review ownership, testing, limitations, and correction handling without inventing credentials or medical review.
2. The Main homepage and footer consistently describe three publishing pillars: explained calculators, learning activities, and guides/printables.
3. Health’s homepage is now a method-and-tool-selection destination. Privacy states the present advertising state clearly, and the relevant Health calculators distinguish estimates from measurements or prescriptions.
4. Finance pages now include distinct decision structures: final checkout comparisons, effective cashback and caps, resilient savings scenarios, label/measurement checks, and fair bill-splitting boundaries. The hub maps evidence to the question being asked.
5. Education, Work & Time, and Math now distinguish overlapping calculator intents through the evidence, conventions, and policy inputs a user actually has.
6. All ten free English game pages have topic-specific play/teaching guidance. The English hub adds a prerequisite/next-step sequence, and the Games hub routes from observed learner behaviour to a suitable activity and off-screen follow-up.
7. The Freebies hub now helps users select a resource by task. Study Planner, both observation trackers, First Phonics, Big Purchase Planner, and Emergency Fund Planner include concrete filled-use examples grounded in the existing files.
8. Little Money Master now shows a representative needs-versus-wants conversation flow. Academy now states the exact current free/paid library and access differences in a comparison table.

## Top 15 completion record

| Priority | Approved change | Completed implementation |
|---:|---|---|
| 1 | Publisher accountability | Main and Health About pages now state operator/publisher responsibility, non-clinical scope, source hierarchy, checks, review triggers, and correction handling. |
| 2 | Health homepage methodology | Added equation-versus-measurement framing and a choose-by-question list with limitations. |
| 3 | Health privacy current state | States that Health currently serves no advertising or AdSense and adds a reviewed date. |
| 4 | Three publishing pillars | Main homepage and footer now consistently connect calculators, learning activities, and guides/printables. |
| 5 | Finance editorial architecture | Added materially different decision structures to Discount, Cashback, Savings Goal, Unit Price, and Split Bill while retaining the calculator component. |
| 6 | Finance hub framework | Added an evidence-to-question table and explicit “does not answer” boundaries. |
| 7 | Ten English lessons | All ten slugs now have concept-specific teaching/play guidance; eight generic fallbacks were removed from actual use. |
| 8 | English progression hub | Added a four-step prerequisite sequence and retained the observed-clue routing. |
| 9 | Authentic freebie evidence | Added filled-use illustrations to the five priority types, including both observation trackers. |
| 10 | Freebies hub selection | Added task-based selection, use/preview expectations, and resource-type distinctions. |
| 11 | Health uncertainty | Added prediction/measurement, multiplier calibration, static-scenario, and historical-reference sections to the four named calculators. |
| 12 | Education overlap | Added collect-first evidence guidance, unequal-points failure mode, gradebook reconciliation, and final-grade feasibility bands. |
| 13 | Work & Time conventions | Time Duration now owns time-format boundaries; Overtime is explicitly a user-supplied policy worksheet. |
| 14 | Average selection | Added mean/median/mode selection examples centred on outliers and frequency. |
| 15 | Product/Academy specificity | Added a representative product activity flow and an exact free-versus-Lifetime-Access table without fabricating screenshots or promises. |

## Exact files changed

Main project:

- `app/page.tsx`
- `app/about/page.tsx`
- `components/site-footer.tsx`
- `app/finance/page.tsx`
- `app/finance/discount-calculator/page.tsx`
- `app/finance/cashback-calculator/page.tsx`
- `app/finance/savings-goal-calculator/page.tsx`
- `app/education/page.tsx`
- `app/education/grade-calculator/page.tsx`
- `app/education/final-grade-calculator/page.tsx`
- `app/work-time/time-duration-calculator/page.tsx`
- `app/work-time/overtime-calculator/page.tsx`
- `app/math/page.tsx`
- `app/math/average-calculator/page.tsx`
- `app/games/page.tsx`
- `app/games/english/page.tsx`
- `app/games/english/[slug]/page.tsx`
- `app/games/english/academy/page.tsx`
- `app/freebies/page.tsx`
- `app/freebies/[slug]/page.tsx`
- `lib/freebies.ts`
- `app/shop/little-money-master-volume-1/page.tsx`
- `docs/adsense-grade-a-gap-analysis.md` (approved source document, previously created and still uncommitted)
- `docs/adsense-grade-a-remediation-report.md`

Health project:

- `src/pages/index.astro`
- `src/pages/about.astro`
- `src/pages/privacy.astro`
- `src/components/Header.astro`
- `src/components/Footer.astro`
- `src/data/calculators.ts`
- `src/layouts/CalculatorLayout.astro`
- `src/pages/calculators/bmr.astro`
- `src/pages/calculators/tdee.astro`
- `src/pages/calculators/calorie-deficit.astro`
- `src/pages/calculators/ideal-weight.astro`

## Residual cautions

- Little Money Master and Academy remain Acceptable rather than Strong because the repository has limited authentic in-product screenshots and does not expose enough verified delivery/update-policy evidence to support stronger claims.
- Several printable pages remain Acceptable because real page previews—not more paraphrased landing-page copy—would be the next defensible improvement.
- Health’s high-stakes pages remain Acceptable unless independently medically reviewed. The implementation now states that boundary clearly and does not imply a clinical review team.
- The Main browser console records the existing AdSense warning that the injected head tag does not support `data-nscript`. It is not a runtime error and was not introduced or altered by this remediation.

## QA evidence

- Main TypeScript check: passed.
- Main lint: passed with the one pre-existing intentional Animal Habitats `<img>` warning.
- Main production build: passed; 78 Next.js build routes generated.
- Health production build: passed; 12 Astro pages generated.
- Health standalone type checker: not configured (`@astrojs/check` is not installed); Astro’s build-time type generation passed.
- IndexNow tests: Main 11/11 passed; Health 11/11 passed.
- `git diff --check`: passed in both repositories.
- Sitemap crawl: 69 Main + 12 Health = 81 URLs; every URL returned 200 locally, had a canonical, and had no `noindex`.
- Internal links: 95 unique Main internal page links and 17 unique Health internal page links checked; no broken targets found.
- Desktop browser QA: representative changed pages at 1280 px had no document-level horizontal overflow and no broken images.
- Mobile browser QA: 20 representative changed pages were measured using Chrome device emulation at an exact 320 px CSS viewport; every page reported `scrollWidth = 320`, with no broken images.
- Runtime: no browser errors on representative changed pages. Health loaded zero AdSense scripts and displayed no advertisement placeholders.
- Source/reference destinations: all current calculator references were checked against their official CDC, National Academies, NIDDK, PubMed/PMC, and Compendium destinations. The destinations resolve; a few NCBI pages may present automated clients with a browser check.
- One-H1 check: rendered page templates retain one primary page heading where expected; no heading-level implementation change created a second H1.
- Unchanged systems: diffs contain no calculator implementation/formula modules, question banks, scoring code, AdSense eligibility code, Analytics/consent scripts, Search Console files, IndexNow scripts, sitemap code, robots files, route configuration, or purchase URL configuration.

## Remaining template-risk assessment by cluster

| Cluster | Post-remediation risk |
|---|---|
| Finance calculators | **Low.** Shared UI remains consistent, but the five formerly repetitive pages now centre on different decision evidence and failure modes. |
| Math calculators | **Low.** The hub routes by wording/relationship and Average now owns summary selection; the four previously Strong tools remain distinct. |
| Education calculators | **Low.** Points, weighted categories, a remaining final, single-test questions, and GPA/credits are separated by the evidence the user has. |
| Work & Time calculators | **Low.** Time Duration and Overtime now own different conventions; the other three pages were already Strong. |
| Health calculators | **Moderate but acceptable.** A shared safety/method shell is appropriate for health tools; page-specific uncertainty sections now prevent it from being the only editorial value. Lack of medical review is disclosed rather than disguised. |
| English games | **Low to moderate.** The game engine and guide layout remain shared by design, while all ten lessons now have concept-specific teaching devices. Five shorter lessons remain Acceptable rather than being force-rated Strong. |
| Science games | **Low.** Animal Habitats remains an original, clearly scoped game and guide. |
| Freebies | **Moderate but acceptable.** The downloadable assets are original; priority pages now demonstrate use, while pages without authentic previews remain honestly Acceptable. |
| Guides | **Low page-level / moderate hub-level.** All four articles remain Strong; the hub stays Acceptable until the genuine library grows. |

## Page-by-page re-audit

The reason column records the decisive post-remediation evidence. “Retained” means the earlier rating remains appropriate.

| # | URL | Before | After | Post-remediation finding |
|---:|---|---|---|---|
| 1 | `https://zaleastudio.com` | Acceptable | **Strong** | Three clear resource pillars, concrete method examples, limits, publisher path, and correction route make the homepage useful beyond navigation. |
| 2 | `/about` | Acceptable | **Strong** | Names the responsible publisher role and documents source selection, boundary testing, review triggers, reproducible error reports, and correction handling. |
| 3 | `/contact` | Acceptable | Acceptable | Retained as a concise, functional support and correction route; no artificial editorial padding. |
| 4 | `/shop` | Acceptable | Acceptable | Retained as a legitimate transactional catalogue rather than an article. |
| 5 | `/shop/little-money-master-volume-1` | Borderline | Acceptable | Adds a concrete three-step lesson conversation and contextual example; authentic screenshots/delivery evidence would still be needed for Strong. |
| 6 | `/freebies` | Acceptable | **Strong** | Adds task-based resource selection, format/use expectations, age/supervision cues, and links grounded in the actual collection. |
| 7 | `/freebies/shapes-and-colours-activity-pack` | Acceptable | Acceptable | Original 20-page asset remains useful; no new authentic page previews were invented. |
| 8 | `/freebies/numbers-1-10-activity-pack` | Acceptable | Acceptable | Original 20-page pack retained; stronger rating awaits genuine page-progression previews. |
| 9 | `/freebies/grade-tracker` | Acceptable | Acceptable | Useful original record set retained; no fabricated filled sheet added. |
| 10 | `/freebies/study-planner` | Acceptable | **Strong** | Adds a realistic filled session showing how a vague revision task becomes timed, reviewable work. |
| 11 | `/freebies/student-progress-tracker` | Acceptable | **Strong** | Demonstrates factual observation, strength, and next-step recording while preserving the non-diagnostic boundary. |
| 12 | `/freebies/early-learning-skills-observation-tracker` | Acceptable | **Strong** | Shows how one observed play behaviour becomes a gentle follow-up rather than a developmental judgement. |
| 13 | `/freebies/pre-writing-pencil-control` | Acceptable | Acceptable | Strong guide link and original printable remain; authentic line-progression previews are still the missing evidence. |
| 14 | `/freebies/fine-motor-activity-cards` | Acceptable | Acceptable | Genuine activity resource retained; stronger proof requires selected real card previews/material mapping. |
| 15 | `/freebies/first-phonics-activities` | Acceptable | **Strong** | States exact sound scope and adds a model spoken-sound/picture/letter routine with a clear stopping point. |
| 16 | `/freebies/scissor-skills-practice` | Acceptable | Acceptable | Original progression and supervision note remain; no fake worksheet preview added. |
| 17 | `/freebies/savings-goal-tracker` | Acceptable | Acceptable | Useful original tracker retained; richer general planning remains in the dedicated guide. |
| 18 | `/freebies/big-purchase-planner` | Acceptable | **Strong** | Adds a filled full-cost example that visibly changes the amount a user needs to plan for. |
| 19 | `/freebies/emergency-fund-planner` | Acceptable | **Strong** | Demonstrates a user-defined expense baseline and first milestone without asserting a universal target. |
| 20 | `/finance` | Acceptable | **Strong** | Evidence-to-question table distinguishes checkout price, unit cost, rewards, and future goals, including what each tool cannot decide. |
| 21 | `/finance/discount-calculator` | Acceptable | **Strong** | Centres on final amount paid with different starting prices, consecutive discounts, and extra-charge ordering. |
| 22 | `/finance/split-bill-calculator` | Acceptable | **Strong** | Distinguishes equal, personal, and shared amounts with a concrete appetiser example and a clear calculator boundary. |
| 23 | `/finance/savings-goal-calculator` | Acceptable | **Strong** | Adds a three-scenario resilience workflow covering essential funds, actual progress, and changing targets. |
| 24 | `/finance/unit-price-calculator` | Acceptable | **Strong** | Centres input quality on net quantity and compatible measurement types, preventing misleading comparisons. |
| 25 | `/finance/fuel-cost-calculator` | Strong | **Strong** | Retained: route-specific travel assumptions, unit handling, and worked decision context remain substantive. |
| 26 | `/finance/cashback-calculator` | Acceptable | **Strong** | Adds a nominal-versus-effective-rate table showing exactly where a reward cap changes the real percentage. |
| 27 | `/work-time` | Acceptable | **Strong** | Distinguishes recording, calendar planning, pay conversion, paid time, and employer-defined rules through an actionable task map. |
| 28 | `/work-time/work-hours-calculator` | Strong | **Strong** | Retained: shift, break, overnight, weekly and pay interpretation remain specific and useful. |
| 29 | `/work-time/business-days-calculator` | Strong | **Strong** | Retained: configurable workweeks, excluded dates, direction and date-counting conventions remain distinctive. |
| 30 | `/work-time/time-duration-calculator` | Acceptable | **Strong** | Now owns clock versus elapsed versus decimal conventions, overnight assumptions, and explicit time-zone/DST exclusions. |
| 31 | `/work-time/overtime-calculator` | Acceptable | **Strong** | Reframed as a policy-input worksheet covering threshold basis, counted hours, rate basis, special rules, and jurisdictional limits. |
| 32 | `/work-time/salary-to-hourly-calculator` | Strong | **Strong** | Retained: salary-period conversion, unpaid time, and comparison limitations remain substantive. |
| 33 | `/education` | Acceptable | **Strong** | Adds a collect-first syllabus/gradebook audit for points, weights, status, and institutional policy. |
| 34 | `/education/grade-calculator` | Acceptable | **Strong** | Adds a quantified unequal-assignment example plus reconciliation steps for missing work, extra credit, weights, and rounding. |
| 35 | `/education/final-grade-calculator` | Acceptable | **Strong** | Adds secured/possible/impossible feasibility bands and the critical check for whether the current grade already includes the final. |
| 36 | `/education/weighted-grade-calculator` | Strong | **Strong** | Retained: category weights, normalisation, incomplete totals, and worked interpretation remain distinctive. |
| 37 | `/education/gpa-calculator` | Strong | **Strong** | Retained: credit weighting, scale assumptions, and institutional-policy boundaries remain substantive. |
| 38 | `/education/test-grade-calculator` | Strong | **Strong** | Retained: full score chart and target-grade helper provide unique functional and explanatory value. |
| 39 | `/math` | Acceptable | **Strong** | Adds language-to-operation cues alongside same-number/different-relationship examples and checking guidance. |
| 40 | `/math/percentage-calculator` | Strong | **Strong** | Retained: multiple percentage intents, shown steps, and interpretation distinctions remain comprehensive. |
| 41 | `/math/fraction-calculator` | Strong | **Strong** | Retained: mixed-number parsing, simplification, operations, and steps remain substantial. |
| 42 | `/math/ratio-calculator` | Strong | **Strong** | Retained: simplification, equivalent ratios, proportions, and missing-value steps remain substantial. |
| 43 | `/math/average-calculator` | Acceptable | **Strong** | Reframed around selecting mean, median, or mode using outlier and frequency examples rather than another generic mean explanation. |
| 44 | `/math/standard-deviation-calculator` | Strong | **Strong** | Retained: sample/population distinction, variance, steps, and interpretation remain substantive. |
| 45 | `/guides` | Acceptable | Acceptable | Useful four-guide destination retained; a larger genuine editorial library is still needed before calling the hub Strong. |
| 46 | `/guides/how-to-set-a-realistic-savings-goal` | Strong | **Strong** | Retained: decision-led planning, worked scenarios, limitations, and source context remain strong. |
| 47 | `/guides/pre-writing-skills-activities` | Strong | **Strong** | Retained: activity selection, progression, safety, and parent/teacher guidance remain original and useful. |
| 48 | `/guides/equal-vs-unequal-bill-splitting` | Strong | **Strong** | Retained: fair-split methods, worked examples, and social decision boundaries remain substantive. |
| 49 | `/guides/percentage-points-vs-percentage-change` | Strong | **Strong** | Retained: precise distinction, calculations, examples, and misuse cautions remain strong. |
| 50 | `/games` | Acceptable | **Strong** | Adds observed-need routing and distinct off-screen follow-ups for grammar recognition, addition reasoning, and habitat classification. |
| 51 | `/games/english` | Acceptable | **Strong** | Adds a practical prerequisite sequence and next-step map while preserving the existing clue-based navigation. |
| 52 | `/games/english/academy` | Acceptable | Acceptable | Exact current library/access/payment comparison replaces vague scope language; authentic in-game evidence is still limited. |
| 53 | `/games/math/addition-level-1` | Strong | **Strong** | Retained: original question bank, three modes, reasoning prompts, and parent/teacher follow-up remain substantive. |
| 54 | `/games/science/animal-habitats` | Strong | **Strong** | Retained: original animal/habitat game, balanced presentation, learning guide, and fallback-safe artwork system remain strong. |
| 55 | `/english-games-for-kids` | Strong | **Strong** | Retained: standalone parent/teacher guidance, free activities, progression, and commercial balance remain strong. |
| 56 | `/grammar-games-for-kids` | Strong | **Strong** | Retained: lesson-specific grammar map and practical teaching guidance remain substantial. |
| 57 | `/vocabulary-games-for-kids` | Strong | **Strong** | Retained: recognition/recall, themed learning, home activities, and Academy scope remain standalone value. |
| 58 | `/games/english/a-or-an` | Acceptable | **Strong** | Sound-first routine and contrasting opening-sound examples make the lesson materially specific. |
| 59 | `/games/english/one-or-many` | Acceptable | **Strong** | Count-first, picture-to-phrase routine is distinct and connected to later number/distance practice. |
| 60 | `/games/english/he-she-it` | Acceptable | Acceptable | Noun-first replacement routine is useful; the shared guide shell still limits independent depth. |
| 61 | `/games/english/is-am-are` | Acceptable | **Strong** | Subject-group sorting and full spoken pairs create a clear diagnostic progression linked to pronouns. |
| 62 | `/games/english/can-or-cant` | Acceptable | Acceptable | Action-first reasoning is specific, but the narrow modal contrast remains readily substitutable. |
| 63 | `/games/english/who-is-it` | Acceptable | Acceptable | Speaker/reference questions improve the lesson, though the page remains comparatively brief. |
| 64 | `/games/english/whose-is-it` | Acceptable | Acceptable | Concrete owner/object mapping is useful; deeper question-versus-answer boundaries would support Strong. |
| 65 | `/games/english/where-is-it` | Acceptable | **Strong** | Physical-object movement and contrast practice make position language demonstrable off screen. |
| 66 | `/games/english/this-that-these-those` | Acceptable | **Strong** | The number-by-distance matrix becomes a distinctive teaching device rather than a generic conclusion. |
| 67 | `/games/english/has-or-have` | Acceptable | Acceptable | Pronoun replacement provides a real diagnostic, but the page remains close to the shared grammar structure. |
| 68 | `/privacy-policy` | Acceptable | Acceptable | Retained as necessary policy support, accurate to implementation. |
| 69 | `/terms-of-use` | Acceptable | Acceptable | Retained as concise governing terms, not padded for ranking. |
| 70 | `https://health.zaleastudio.com/` | Borderline | Acceptable | Now explains equation versus measurement, tool choice, adult scope, source hierarchy, review meaning, and responsible publisher. Kept below Strong because it is still a compact seven-tool directory. |
| 71 | `https://health.zaleastudio.com/about/` | Borderline | Acceptable | Names Zalea’s role and explicitly discloses no medical review/clinical team, with source, test, review, and correction practices. Independent medical review would be needed for Strong trust. |
| 72 | `https://health.zaleastudio.com/calculators/bmi/` | Strong | **Strong** | Retained: adult screening scope, category limitations, sources, and interpretation remain strong. |
| 73 | `https://health.zaleastudio.com/calculators/bmr/` | Acceptable | Acceptable | Adds a prediction-versus-measurement framework, input sensitivity, and explicit non-prescription boundary. Medical review is not claimed. |
| 74 | `https://health.zaleastudio.com/calculators/calorie-deficit/` | Acceptable | Acceptable | Clearly labels a compounded static scenario, not a diet recommendation, and defines important exclusions. High-stakes use keeps it below Strong without medical review. |
| 75 | `https://health.zaleastudio.com/calculators/ideal-weight/` | Acceptable | Acceptable | User-facing name becomes Reference Weight; historical purpose, formula disagreement, and non-target interpretation are foregrounded while the legacy route stays stable. |
| 76 | `https://health.zaleastudio.com/calculators/tdee/` | Acceptable | Acceptable | Activity multiplier is framed as a hypothesis with a multi-week calibration workflow and clear uncertainty. Medical review is not implied. |
| 77 | `https://health.zaleastudio.com/calculators/walking-calories/` | Strong | **Strong** | Retained: MET method, pace/duration boundaries, sources, and interpretation remain strong. |
| 78 | `https://health.zaleastudio.com/calculators/water-intake/` | Strong | **Strong** | Retained: total-water distinction, context, safety limitations, and sources remain strong. |
| 79 | `https://health.zaleastudio.com/contact/` | Acceptable | Acceptable | Retained as the functioning correction route with reproducibility guidance. |
| 80 | `https://health.zaleastudio.com/disclaimer/` | Acceptable | Acceptable | Retained as focused legal/medical support rather than inflated editorial content. |
| 81 | `https://health.zaleastudio.com/privacy/` | Borderline | Acceptable | States that no ads or AdSense are currently served, separates any future change, and adds a current review date while preserving consent disclosure. |

## Approval boundary

No commit, push, or deployment was performed. Both working trees remain available for review. Generated build output is ignored and is not part of the intended change set.

## Final recommendation

The aggregate now has a credible Strong majority, no Borderline pages, no Low Value pages, materially lower template risk, and clearer publisher accountability. The remaining Acceptable pages are legitimate support, product, health, or asset pages rather than thin doorway content. After the approved changes are committed and deployed, a live production spot-check should be completed before submitting the AdSense review request.

**GRADE A ACHIEVED: YES**

**ADSENSE RESUBMISSION RECOMMENDED: YES — after deployment and live verification**
