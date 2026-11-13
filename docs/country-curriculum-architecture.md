# Country-based curriculum learning

The authoritative MAIN checkout owns seven explicit App Router pages under /learning. Malaysia is the only published local collection. No future-country pages or obsolete /learning/malaysia-curriculum aliases are implemented.

Shared typed data lives in lib/learning/curriculum.ts. Country, school type, school-year wording and curriculum version are metadata, rather than global assumptions. Parent pages provide purpose, next actions, references and limitations. The canonical game path contains no curriculum version.

Detektif Bunyi has stable activity ID my-bm-sound-detective. It is intentionally absent from the general game registry and Mission definitions. Existing general games do not acquire curriculum alignment through reuse.

## Progress boundary

The first activity has independently assessed listening outcomes and self-reported speaking practice. The existing general-game score is unsuitable for representing both. A minimal additive browser-local namespace, zalea-curriculum-progress-v1, keeps at most 250 completed session summaries. No individual answer history or learner identity is retained.

The My Learning Journey dashboard displays this collection in a separate panel. Curriculum export/import/reset controls explicitly affect only curriculum progress; the existing general Journey format, import controls, achievements, recommendations and Mission evidence are unchanged. Imports merge stable session IDs, validate bounds and whitelist fields. Same-tab events and native storage events refresh the panel.

For another activity, extend the typed activity registry and supply a bounded activity-specific progress validator. For a later curriculum revision, explicitly permit/migrate historical version records before changing validation; do not silently relabel historical records. Country-specific grading rules belong with the activity, not generic game helpers.

## Future countries

Future approved collections can use /learning/singapore/curriculum, /learning/indonesia/curriculum, /learning/australia/curriculum or /learning/united-kingdom/curriculum. Add explicit meaningful App Router pages and country data only when content exists. Configure Primary 1, Kelas 1 or another school-year label in the relevant collection.

Reuse accessible buttons, audio handling, illustrations and browser-local progress utilities. Reusing a general-game component does not verify its alignment. Each activity needs its own standards, sources, alignment status and verification notes.

Supported alignment classifications are verified, provisional and enrichment. Detektif Bunyi remains provisional, based on the owner's training-source research; the exact wording and complete final Dokumen Kurikulum have not been independently verified. There is no official KPM endorsement or certification.

## Assets and maintenance

Ten locally hosted real sound excerpts use verified CC BY 3.0 or Public Domain source declarations. The full provenance register is in detektif-bunyi-audio-register.md and lib/learning/sounds.json. Human perceptual review remains required before release.

The PDF build script uses temporary QA-only Python dependencies (miniaudio for audio preparation; svglib for SVG embedding). These are not application dependencies. Preserve the final public audio, original SVGs, PDF, source records and visible attribution when preparing a future release. Exclude downloaded originals, Python packages, screenshots and local logs from application staging.
