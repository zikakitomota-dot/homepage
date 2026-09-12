# AdSense Remediation — Round 2

**Implementation reviewed:** 12 September 2026

**Scope:** targeted changes authorised by the final adversarial content-quality audit. No deployment, commit, or push was performed.

## Outcome

The two previously Low Value pages no longer remain in that category. Health Contact now offers a real route to the working Zalea Studio contact form, and Water Intake is now a substantive, sourced explanation that labels its calculation as a rough planning heuristic rather than a medical requirement.

The seven main category hubs now contain distinct, category-specific guidance rather than relying mainly on their link cards. Select finance and English-game pages were differentiated where the repeated template was most conspicuous. The homepage now states a clearer editorial purpose: understand the task, see the method and limits, then use the appropriate tool or learning resource.

## Exact files changed

### Main Zalea Studio

- `app/page.tsx`
- `app/finance/page.tsx`
- `app/work-time/page.tsx`
- `app/education/page.tsx`
- `app/math/page.tsx`
- `app/games/page.tsx`
- `app/games/english/page.tsx`
- `app/guides/page.tsx`
- `app/finance/split-bill-calculator/page.tsx`
- `app/finance/unit-price-calculator/page.tsx`
- `app/games/english/[slug]/page.tsx`
- `components/games/academy-cta.tsx`
- `components/money/calculator-page.tsx`
- `docs/adsense-remediation-round-2.md`

The previously requested `docs/adsense-final-adversarial-audit.md` remains an untracked audit artifact from the preceding audit task; it was not modified during this remediation.

### Health Zalea Studio

- `src/layouts/CalculatorLayout.astro`
- `src/pages/contact.astro`
- `src/pages/calculators/bmi.astro`
- `src/pages/calculators/bmr.astro`
- `src/pages/calculators/tdee.astro`
- `src/pages/calculators/calorie-deficit.astro`
- `src/pages/calculators/ideal-weight.astro`
- `src/pages/calculators/walking-calories.astro`
- `src/pages/calculators/water-intake.astro`

No calculator scripts, formulas, game question banks, scoring code, routes, sitemap configuration, canonical configuration, indexing controls, or AdSense eligibility files changed.

## 1. Health trust fixes

The old Health Contact page displayed `hello@health-calculators.example` and a form that explicitly did not submit. Both were removed.

The page now:

- identifies Zalea Studio as the contact destination;
- links to the existing working `https://zaleastudio.com/contact` route;
- tells users what details help reproduce a calculator issue;
- asks users not to include medical records or sensitive health information;
- contains no invented email address, placeholder details, or simulated success message.

The Health About and footer can continue linking to `/contact/`; that local page now acts as a truthful bridge to the main working contact mechanism.

## 2. Sources added to each Health calculator

The shared Health calculator layout now accepts page-specific source records and an actual review date. Each page renders a visible “Methodology and sources” section explaining that references document the method or limitations but do not make the result medical advice.

All seven pages display **Content reviewed: 12 September 2026**, the date their formulas, claims, limitations, and linked references were reviewed during this implementation.

### BMI

- CDC Adult BMI Calculator — adult categories and screening limitations.
- CDC Calculating BMI — metric and US customary formulas.

### BMR

- Mifflin et al. (1990), PubMed — original Mifflin–St Jeor resting-energy equation.
- National Academies (2023) Dietary Reference Intakes for Energy — distinction between resting, food-related, activity, and total expenditure.

### TDEE

- Mifflin et al. (1990), PubMed — source for the resting-energy step.
- National Academies (2023) Dietary Reference Intakes for Energy — components of total energy expenditure.

The page now explicitly says the familiar 1.2–1.9 five-step activity ladder is a convenient estimation convention, is not part of the original Mifflin paper, and is not an individually measured activity level.

### Calorie Deficit

- NIDDK Research Behind the Body Weight Planner — dynamic body-weight modelling.
- Hall et al. (2011), PubMed — quantified dynamic response to energy imbalance.
- Mifflin et al. (1990), PubMed — resting-energy equation used within the calculator’s TDEE estimate.

The 7,700 kcal/kg conversion is now described as a static arithmetic rule that cannot predict exact weekly loss. Copy implying a kilogram of body fat simply equals a fixed calorie value was removed.

### Ideal Weight

- Robinson et al. (1983), PubMed — origin and drug-dosage context of the Robinson equation.
- Peterson et al. (2016), PubMed Central — comparison and origins of historical equations.
- Pai and Paloucek (2000), PubMed — historical review and distinction between ideal and lean body weight.

The page now explains that these formulas arose from actuarial height–weight tables and drug-dosage work, not from a method that establishes one medically ideal weight for every adult.

### Walking Calories

- 2024 Adult Compendium of Physical Activities — current activity-specific MET reference.
- Herrmann et al. (2024), PubMed Central — methodology for the 2024 Compendium update.

The page now distinguishes its six simplified speed bands from the Compendium’s more specific activities and names terrain, incline, load, surface, and individual efficiency as omitted variables.

### Water Intake

- National Academies Dietary Reference Intakes for Water — adequate intake as total water from beverages and food, not an exact individual requirement.
- American College of Sports Medicine position stand on exercise and fluid replacement — individual variation in sweat loss and the need for individualised exercise replacement.

The linked source pages were independently checked during implementation. No citation or professional review credential was invented.

## 3. Water Intake decision

**Decision: keep indexable.** No `noindex` was applied.

The page was rebuilt from a short formula/example page into a standalone explanation covering:

- exactly what the 35 ml/kg plus 350 ml/30-minute calculation does;
- an explicit statement that both inputs are consumer-planning heuristics, not National Academies requirements;
- the National Academies’ adult total-water adequate-intake context;
- the difference between total water and plain drinking water;
- a worked example with a practical interpretation;
- climate, altitude, exercise, pregnancy, breastfeeding, illness, medication, and health-condition variation;
- why personal sweat loss is more informative for prolonged exercise;
- situations in which the calculator should not be relied upon;
- the risk of forcing water quickly to meet a displayed number;
- authoritative methodology and limitation references.

The visible result label changed from “Suggested daily water intake” to “Planning estimate for total daily water.” The JavaScript formula and calculator behaviour were not changed.

## 4. Category hub improvements

Each hub received a different, subject-specific addition rather than a shared generated section.

- `/finance`: a concrete three-stage purchase comparison showing why discount, unit price, and capped cashback answer different questions.
- `/work-time`: a timesheet workflow covering overnight dates, unpaid breaks, and comparison with employer records/rules.
- `/education`: a compact table mapping raw points, weighted categories, and final-exam targets to the correct calculator.
- `/math`: one set of numbers used to distinguish percentage, ratio, average, and percentage-change questions.
- `/games`: guidance for turning correct answers into spoken, physical, or explanatory follow-up away from the score screen.
- `/games/english`: a skill-progression map using number, distance, subject, position, and ownership clues to choose related games.
- `/guides`: an explanation of when a guide is more appropriate than a calculator, plus a four-step reading route.

All links added point to existing routes. No hub metadata, canonical, route, or indexing directive changed.

## 5. Template-sameness fixes

Changes were selective rather than a site-wide cosmetic rewrite.

### Finance calculators

The shared finance calculator component now supports an optional, genuinely page-specific decision section.

- Split Bill adds a worked equal-versus-itemised sharing method and explains what the calculator intentionally cannot decide.
- Unit Price adds a label-reading workflow covering net quantity, multipacks, and incompatible measurement types.

The other finance pages already contain subject-specific assumptions, edge cases, and examples and were left alone to avoid rewriting every page merely for variation.

### English games

The two pages previously rated Borderline now depart from the repeated conclusion:

- One or Many uses a count-first teaching sequence and a progression from number clues to sentence clues.
- Can or Can’t asks the learner to reason about the subject/action before selecting the modal and uses a page-specific Academy transition.

Game questions, difficulty selection, scoring, progress storage, and Academy access behaviour are unchanged.

### Health calculators

Every page now has page-specific methodology notes. Water Intake uses five subject-specific explanatory sections instead of the default formula/example sequence. TDEE, Calorie Deficit, Ideal Weight, and Walking Calories also gained method-specific caveats in their existing prose.

### Freebies

The cluster was reviewed but not changed. Repeated titles and descriptions are shared catalogue data describing the same downloadable item across hub, detail, and related-resource cards. The downloads themselves are original assets, and a cosmetic paraphrase would reduce consistency without adding user value.

## 6. Homepage and site identity

The hero now positions Zalea Studio as a practical learning and everyday-decision resource rather than a general directory:

- new proposition: **“Understand the Task, Then Use the Tool”**;
- names the editorial pattern—shown calculator methods, supported learning games, and task-based printables;
- clearly separates free resources from paid products kept in the shop;
- replaces the download-only secondary hero action with a direct route to the practical guides.

The category set and navigation were not removed or redesigned.

## 7. QA results

### Main Zalea Studio

- Type check: **pass** — `tsc --noEmit`.
- Lint: **pass** — one existing intentional warning for the Animal Habitats `<img>` element; no errors.
- Production build: **pass** — Next.js generated all routes successfully.
- Rendered HTTP checks: **pass** for the homepage, seven hubs, two changed finance calculators, and two changed English games.
- Indexing check: **pass** — none of the checked pages emitted `noindex`.
- AdSense allowlist: **unchanged**.
- Sitemap: **unchanged**.
- Calculator and game logic files: **unchanged**.

### Health Zalea Studio

- Production build: **pass** — Astro generated all 12 pages and its sitemap.
- Astro type generation during build: **pass**.
- Separate lint/typecheck commands: **not configured** in the Health package.
- Existing build warning: Tailwind reports an empty `content` option; the site’s authored global CSS remains present. This warning predates and is unrelated to the remediation.
- Rendered HTTP checks: **pass** for Contact, all seven calculators, and the sitemap.
- Contact check: **pass** — no `.example` address, demo form, or non-transmitting-form message remains.
- Sources: **13 distinct authoritative URLs** rendered across 16 source references.
- Indexing: **unchanged** — no calculator or Contact page emitted `noindex`.
- Sitemap: **12 URLs**, unchanged in membership.
- Advertising: **unchanged**; Health remains configured without AdSense.
- Calculator scripts: **unchanged**.

### Cross-project checks

- `git diff --check`: **pass** in both repositories.
- Internal links added by this remediation resolve to existing routes.
- Authoritative source destinations were opened and checked during the review.
- New sections use existing responsive grids, wrapping flex layouts, and horizontal table containment. No fixed-width content was introduced outside an overflow container.
- No accidental horizontal-overflow source pattern was found in the added mobile layouts.

## 8. Updated adversarial assessment

The same 81 indexable pages were reassessed after remediation.

| Rating | Before | After |
|---|---:|---:|
| Strong | 20 | 23 |
| Acceptable | 45 | 54 |
| Borderline | 14 | 4 |
| Low Value | 2 | 0 |
| **Total** | **81** | **81** |

### Pages still rated Borderline

- `/shop/little-money-master-volume-1` — legitimate transactional page, but limited independent informational value without the product.
- `https://health.zaleastudio.com/` — still primarily a calculator directory; methodology now exists on detail pages rather than the hub.
- `https://health.zaleastudio.com/about/` — useful limits and process description, but the operator identity remains general.
- `https://health.zaleastudio.com/privacy/` — necessary functional policy; future-facing AdSense language remains broader than Health’s currently disabled advertising configuration.

These pages have legitimate commercial, navigational, or trust purposes. None is now an unfinished or clearly empty page. They should not be noindexed solely to improve the rating count.

### Updated overall grade

**B — reasonably strong, with identifiable remaining weaknesses**

The portfolio now has no page assessed as Low Value. The most consequential trust defect is removed, Health methodology is visible and sourced, Water Intake has independent educational value, hubs no longer rely mainly on cards, and the site purpose is clearer. The site is not an A because authorship remains general, some common calculators still depend heavily on shared templates, and the editorial collection is broad.

### Remaining top five risks

1. Health’s operator identity is still expressed through the Zalea Studio brand rather than a named accountable person or legal entity.
2. Water Intake still calculates from a consumer heuristic; the page now discloses that limitation clearly, but the numerical result remains inherently rough.
3. TDEE’s familiar five activity multipliers do not have a clean primary-source lineage; the page now states this rather than implying otherwise.
4. Eight English-game pages and several finance/freebie pages still share substantial layout and conclusion patterns, even though their core examples and subject matter are specific.
5. The site remains broad across adult tools, children’s learning, downloads, and products; the revised homepage improves the rationale but cannot create narrow subject authority by itself.

## Resubmission recommendation

**Would I resubmit to AdSense now after two previous Low Value Content rejections?**

**YES**

The recommendation changes from No to Yes because the only concrete unfinished trust failure has been removed, the health claims now expose their provenance and limits, the weakest calculator page is materially useful beyond its form, and all major hubs contain distinct decision or teaching guidance. The remaining risks are normal portfolio-quality weaknesses to improve over time rather than clear reasons to hold the current submission.
