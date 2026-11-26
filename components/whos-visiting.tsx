'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { HEALTH_TOOLS_URL } from '@/lib/site';
import './whos-visiting.css';

type Visitor = 'kid' | 'grown';
type Tile = { title: string; line: string; href: string; icon: React.ReactNode };

const kidTiles: Tile[] = [
  { title: 'English', line: 'A or an, is, am, are and more', href: '/games/english', icon: <svg viewBox="0 0 52 52"><rect x="2" y="6" width="48" height="40" rx="12" fill="var(--z-shape-3)" /><path d="M12 36l7-20 7 20M14.5 30h9M31 24c2-3 9-3 9 2v10M40 30c-6-2-10 0-10 3s5 4 10 0" fill="none" stroke="var(--z-card)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { title: 'Maths', line: 'Adding, taking away, shapes', href: '/games/math', icon: <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="var(--z-shape-2)" /><path d="M17 26h18M26 17v18" stroke="var(--z-card)" strokeWidth="4" strokeLinecap="round" /></svg> },
  { title: 'Science', line: 'Habitats and living things', href: '/games/science', icon: <svg viewBox="0 0 52 52"><path d="M26 48c0-14 0-22 14-36-20 0-30 10-26 26" fill="var(--z-shape-2)" /><path d="M26 48V30" stroke="var(--z-ink)" strokeWidth="3" strokeLinecap="round" /><path d="M26 34c-8 0-16-6-18-16 10 0 18 6 18 16z" fill="var(--z-shape-1)" /></svg> },
  { title: 'Geography', line: 'Continents, oceans, flags', href: '/games/geography', icon: <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="var(--z-shape-4)" /><path d="M14 18c6 0 8 4 6 8s2 8 6 6M30 10c-2 4 0 8 6 8s6 6 4 10M32 40c2-4 6-4 8-8" fill="none" stroke="var(--z-card)" strokeWidth="3" strokeLinecap="round" /></svg> },
  { title: 'Logic & brain', line: 'Patterns and memory', href: '/games/logic', icon: <svg viewBox="0 0 52 52"><rect x="3" y="3" width="21" height="21" rx="5" fill="var(--z-shape-3)" /><rect x="28" y="3" width="21" height="21" rx="5" fill="var(--z-shape-1)" /><rect x="3" y="28" width="21" height="21" rx="5" fill="var(--z-shape-1)" /><rect x="28" y="28" width="21" height="21" rx="5" fill="none" stroke="var(--z-ink)" strokeWidth="3" strokeDasharray="5 4" /></svg> },
  { title: 'Life skills', line: 'Telling time, using money', href: '/games/life-skills', icon: <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="var(--z-shape-1)" /><circle cx="26" cy="26" r="16" fill="var(--z-card)" /><path d="M26 16v10l7 5" fill="none" stroke="var(--z-ink)" strokeWidth="3" strokeLinecap="round" /></svg> },
];

const grownTiles: Tile[] = [
  { title: 'Work & time', line: 'Hours, overtime, working days', href: '/work-time', icon: <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="var(--z-shape-2)" /><circle cx="26" cy="26" r="16" fill="var(--z-card)" /><path d="M26 16v10l7 5" fill="none" stroke="var(--z-ink)" strokeWidth="3" strokeLinecap="round" /></svg> },
  { title: 'Money', line: 'Unit prices, bills, savings', href: '/finance', icon: <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="var(--z-shape-1)" /><circle cx="26" cy="26" r="15" fill="none" stroke="var(--z-ink)" strokeWidth="3" /><path d="M26 19v14M22 23h7a3 3 0 0 1 0 6h-7" fill="none" stroke="var(--z-ink)" strokeWidth="3" strokeLinecap="round" /></svg> },
  { title: 'School grades', line: 'GPA, test and final grades', href: '/education', icon: <svg viewBox="0 0 52 52"><path d="M4 20l22-12 22 12-22 12z" fill="var(--z-shape-4)" /><path d="M14 26v10c6 6 18 6 24 0V26" fill="none" stroke="var(--z-shape-4)" strokeWidth="4" strokeLinejoin="round" /><path d="M44 22v14" stroke="var(--z-ink)" strokeWidth="3" strokeLinecap="round" /></svg> },
  { title: 'Maths helpers', line: 'Percentages, fractions, ratios', href: '/math', icon: <svg viewBox="0 0 52 52"><rect x="6" y="2" width="40" height="48" rx="10" fill="var(--z-shape-3)" /><rect x="13" y="9" width="26" height="10" rx="3" fill="var(--z-card)" /><g fill="var(--z-card)"><circle cx="18" cy="28" r="3" /><circle cx="26" cy="28" r="3" /><circle cx="34" cy="28" r="3" /><circle cx="18" cy="38" r="3" /><circle cx="26" cy="38" r="3" /><circle cx="34" cy="38" r="3" /></g></svg> },
  { title: 'Health', line: 'BMI, calories, water intake', href: HEALTH_TOOLS_URL, icon: <svg viewBox="0 0 52 52"><path d="M26 46C12 36 4 28 4 18a11 11 0 0 1 22-3 11 11 0 0 1 22 3c0 10-8 18-22 28z" fill="var(--z-shape-3)" /><path d="M12 24h8l3-6 5 12 3-6h9" fill="none" stroke="var(--z-card)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg> },
  { title: 'Printables', line: 'Planners and worksheets', href: '/freebies', icon: <svg viewBox="0 0 52 52"><rect x="10" y="4" width="32" height="20" rx="3" fill="var(--z-card)" stroke="var(--z-ink)" strokeWidth="3" /><rect x="3" y="20" width="46" height="20" rx="8" fill="var(--z-shape-2)" /><rect x="12" y="34" width="28" height="16" rx="3" fill="var(--z-shape-1)" /></svg> },
];

function Tiles({ tiles, motion, group }: { tiles: Tile[]; motion: 'rise' | 'slide'; group: Visitor }) {
  return <ul className="zv-tiles">
    {tiles.map((tile, index) => <li key={tile.href} className={`zv-tile-wrap zv-${motion}`} style={{ animationDelay: `${0.1 + index * 0.08}s` }}>
      <Link href={tile.href} className="zv-tile" data-ga-event="cta_click" data-ga-label={`home_visitor_${group}_${tile.href.replace(/\W+/g, '_')}`}>
        <span className="zv-icon" aria-hidden="true">{tile.icon}</span>
        <span className="zv-tile-text"><span className="zv-tile-title">{tile.title}</span><span className="zv-tile-line">{tile.line}</span></span>
      </Link>
    </li>)}
  </ul>;
}

/** Homepage hero: one headline, then a kid / grown-up switch that opens the matching set of sections. */
export function WhosVisiting() {
  const [visitor, setVisitor] = useState<Visitor>('kid');
  return <section className="zv" aria-labelledby="zv-heading">
    <span className="zv-shape zv-shape-a" aria-hidden="true" />
    <span className="zv-shape zv-shape-b" aria-hidden="true" />
    <span className="zv-shape zv-shape-c" aria-hidden="true" />
    <div className="zv-inner">
      <h1 id="zv-heading" className="zv-title">Games for kids. Tools for <span className="zv-title-accent">grown-ups.</span></h1>
      <p className="zv-intro">One friendly, free place for the whole family: learning games and worksheets for little ones, and calculators and planners for the grown-ups.</p>
      <p className="zv-question" id="zv-question">Who’s visiting today?</p>
      <div className="zv-switch" role="group" aria-labelledby="zv-question">
        <button type="button" className="zv-switch-button" data-visitor="kid" aria-pressed={visitor === 'kid'} aria-controls="zv-panel-kid" onClick={() => setVisitor('kid')} data-ga-event="visitor_switch" data-ga-label="kid">I’m a kid</button>
        <button type="button" className="zv-switch-button" data-visitor="grown" aria-pressed={visitor === 'grown'} aria-controls="zv-panel-grown" onClick={() => setVisitor('grown')} data-ga-event="visitor_switch" data-ga-label="grown_up">I’m a grown-up</button>
      </div>

      <div id="zv-panel-kid" className="zv-panel zv-panel-kid" hidden={visitor !== 'kid'}>
        <div className="zv-panel-head">
          <h2 className="zv-panel-title">Games for kids.
            <svg className="zv-scissors" viewBox="0 0 36 36" aria-hidden="true"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" strokeWidth="3" /><circle cx="9" cy="27" r="5.5" fill="none" stroke="currentColor" strokeWidth="3" /><path d="M13 12l20 12M13 24l20-12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
          </h2>
          <Link href="/games" className="zv-panel-link" data-ga-event="cta_click" data-ga-label="home_visitor_all_games">See all games<ArrowRight aria-hidden="true" /></Link>
        </div>
        <Tiles tiles={kidTiles} motion="rise" group="kid" />
      </div>

      <div id="zv-panel-grown" className="zv-panel zv-panel-grown" hidden={visitor !== 'grown'}>
        <div className="zv-panel-head">
          <h2 className="zv-panel-title">Tools for grown-ups.</h2>
          <Link href="/resources" className="zv-panel-link" data-ga-event="cta_click" data-ga-label="home_visitor_find_tool">Find a tool<ArrowRight aria-hidden="true" /></Link>
        </div>
        <Tiles tiles={grownTiles} motion="slide" group="grown" />
      </div>
    </div>
  </section>;
}
