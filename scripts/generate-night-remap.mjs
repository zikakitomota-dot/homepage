// Generates components/zalea-night-remap.css.
// Older pages use fixed Tailwind colours (bg-white, text-slate-700, bg-amber-50 ...) that assume a light page.
// In the Night theme this remaps those fixed colours to dark-safe equivalents, so every page stays readable
// without rewriting each component. Run: node scripts/generate-night-remap.mjs
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const colors = require('tailwindcss/colors');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const neutrals = ['slate', 'gray', 'zinc', 'neutral', 'stone'];
const hues = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose'];
const N = ":root[data-theme='night']";
const esc = (cls) => cls.replace(/[:/[\]#]/g, (c) => `\\${c}`);
// Real-world objects drawn in colour (coins and notes in Money Match) keep their true colours.
const KEEP = ':not(:is([data-money-piece], [data-theme-keep]) *)';
// Matches the plain class, any opacity form (bg-white/80) and the hover: form.
const sel = (cls, { hover = true } = {}) => {
  const list = [`${N} .${esc(cls)}${KEEP}`, `${N} [class*="${cls}/"]${KEEP}`];
  if (hover) list.push(`${N} .${esc('hover:' + cls)}${KEEP}:hover`);
  return list.join(',\n');
};
const card = 'hsl(var(--card))';
const mix = (hex, pct) => `color-mix(in srgb, ${hex} ${pct}%, ${card})`;
const rules = [];
const add = (selector, body) => rules.push(`${selector} {\n  ${body}\n}`);

// Neutral surfaces and text.
add([sel('bg-white'), ...neutrals.flatMap((n) => [sel(`bg-${n}-50`), sel(`bg-${n}-100`)])].join(',\n'), 'background-color: hsl(var(--card)) !important;');
add(neutrals.map((n) => sel(`bg-${n}-200`)).join(',\n'), 'background-color: hsl(var(--muted)) !important;');
add([sel('text-black', { hover: false }), ...neutrals.flatMap((n) => [700, 800, 900, 950].map((s) => sel(`text-${n}-${s}`, { hover: false })))].join(',\n'), 'color: hsl(var(--foreground)) !important;');
add(neutrals.flatMap((n) => [400, 500, 600].map((s) => sel(`text-${n}-${s}`, { hover: false }))).join(',\n'), 'color: hsl(var(--muted-foreground)) !important;');
add([sel('border-white', { hover: false }), ...neutrals.flatMap((n) => [100, 200, 300].map((s) => sel(`border-${n}-${s}`, { hover: false })))].join(',\n'), 'border-color: hsl(var(--border)) !important;');
add(neutrals.flatMap((n) => [100, 200, 300].map((s) => `${N} .${esc(`ring-${n}-${s}`)}`)).join(',\n'), '--tw-ring-color: hsl(var(--border)) !important;');

// Tinted surfaces, text and borders for each hue.
for (const h of hues) {
  const c = colors[h];
  add([sel(`bg-${h}-50`), sel(`bg-${h}-100`)].join(',\n'), `background-color: ${mix(c[500], 16)} !important;`);
  add(sel(`bg-${h}-200`), `background-color: ${mix(c[500], 28)} !important;`);
  add([600, 700, 800, 900, 950].map((s) => sel(`text-${h}-${s}`, { hover: false })).join(',\n'), `color: ${c[300]} !important;`);
  add([100, 200, 300].map((s) => sel(`border-${h}-${s}`, { hover: false })).join(',\n'), `border-color: ${mix(c[500], 45)} !important;`);
  add([100, 200, 300].map((s) => `${N} .${esc(`ring-${h}-${s}`)}`).join(',\n'), `--tw-ring-color: ${mix(c[500], 45)} !important;`);
}

// Strong colour buttons and badges (bg-purple-700 ...) keep white text; 600 shades step to 700 so white text passes.
for (const h of hues) {
  const c = colors[h];
  add(sel(`bg-${h}-600`), `background-color: ${c[700]} !important;\n  color: #ffffff !important;`);
  add([700, 800, 900, 950].map((s) => sel(`bg-${h}-${s}`)).join(',\n'), 'color: #ffffff !important;');
}

// One-off light colours written as hex (bg-[#f5f1e7] ...), their borders, and dark hex text.
add(['e', 'f'].map((d) => `${N} [class*="bg-[#${d}"]${KEEP}`).join(',\n'), 'background-color: hsl(var(--card)) !important;');
add(['c', 'd', 'e', 'f'].map((d) => `${N} [class*="border-[#${d}"]${KEEP}`).join(',\n'), 'border-color: hsl(var(--border)) !important;');
add(['0', '1', '2', '3', '4', '5', '6'].map((d) => `${N} [class*="text-[#${d}"]${KEEP}`).join(',\n'), 'color: hsl(var(--muted-foreground)) !important;');
// Dark hex fills (bg-[#52704d] buttons) keep white text.
add(['0', '1', '2', '3', '4', '5', '6', '7'].map((d) => `${N} [class*=" bg-[#${d}"]${KEEP}, ${N} [class^="bg-[#${d}"]${KEEP}`).join(',\n'), 'color: #ffffff !important;');

// Game pages set their own darker --primary on a wrapper; in Night, lighten it for text and use white on it.
add(`${N} [style*="--primary"]`, '--primary-foreground: 0 0% 100%;');
add([`${N} [style*="--primary"] .text-primary`, `${N} [style*="--primary"] .hover\\:text-primary:hover`].join(',\n'), 'color: color-mix(in srgb, hsl(var(--primary)) 40%, #ffffff) !important;');

// Science green: the same token is used for text and for filled buttons, so split them in Night.
add([`${N} .text-sage`, `${N} .text-sage-foreground`].join(',\n'), 'color: hsl(145 32% 72%) !important;');
add(`${N} .bg-sage-foreground`, 'background-color: hsl(145 24% 29%) !important;\n  color: #ffffff !important;');

// Light gradient stops (from-blue-50, via-white, to-amber-100 ...).
const stopSel = (cls) => `${N} .${esc(cls)}, ${N} [class*="${cls}/"]`;
const stopBody = (kind, value) => {
  if (kind === 'from') return `--tw-gradient-from: ${value} var(--tw-gradient-from-position) !important;\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;`;
  if (kind === 'to') return `--tw-gradient-to: ${value} var(--tw-gradient-to-position) !important;`;
  return `--tw-gradient-stops: var(--tw-gradient-from), ${value} var(--tw-gradient-via-position), var(--tw-gradient-to) !important;`;
};
// Tailwind emits from-*, then via-*, then to-*; keeping that order here lets "via" read the remapped "from".
for (const kind of ['from', 'via', 'to']) {
  add(stopSel(`${kind}-white`), stopBody(kind, card));
  for (const n of neutrals) for (const s of [50, 100]) add(stopSel(`${kind}-${n}-${s}`), stopBody(kind, card));
  for (const h of hues) for (const s of [50, 100, 200]) add(stopSel(`${kind}-${h}-${s}`), stopBody(kind, mix(colors[h][500], s === 200 ? 28 : 16)));
  add(['e', 'f'].map((d) => `${N} [class*="${kind}-[#${d}"]`).join(',\n'), stopBody(kind, card));
}
// A filled gradient card that starts from the theme colour: keep it deep enough for its white text.
add(`${N} .from-primary`, `--tw-gradient-from: #b23c18 var(--tw-gradient-from-position) !important;\n  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to) !important;`);

const header = '/* Generated by scripts/generate-night-remap.mjs — do not edit by hand. Night theme only. */\n';
writeFileSync(path.join(root, 'components', 'zalea-night-remap.css'), header + rules.join('\n') + '\n');
console.log(`wrote ${rules.length} rules`);
