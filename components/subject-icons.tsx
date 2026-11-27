// Cut-out subject icons shared by the homepage banner and the mission cards. Colours follow the theme.
const icons: Record<string, React.ReactNode> = {
  english: <svg viewBox="0 0 52 52"><rect x="2" y="6" width="48" height="40" rx="12" fill="var(--z-shape-3)" /><path d="M12 36l7-20 7 20M14.5 30h9M31 24c2-3 9-3 9 2v10M40 30c-6-2-10 0-10 3s5 4 10 0" fill="none" stroke="var(--z-card)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  maths: <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" fill="var(--z-shape-2)" /><path d="M17 26h18M26 17v18" stroke="var(--z-card)" strokeWidth="4" strokeLinecap="round" /></svg>,
  science: <svg viewBox="0 0 52 52"><path d="M26 48c0-14 0-22 14-36-20 0-30 10-26 26" fill="var(--z-shape-2)" /><path d="M26 48V30" stroke="var(--z-ink)" strokeWidth="3" strokeLinecap="round" /><path d="M26 34c-8 0-16-6-18-16 10 0 18 6 18 16z" fill="var(--z-shape-1)" /></svg>,
  geography: <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="var(--z-shape-4)" /><path d="M14 18c6 0 8 4 6 8s2 8 6 6M30 10c-2 4 0 8 6 8s6 6 4 10M32 40c2-4 6-4 8-8" fill="none" stroke="var(--z-card)" strokeWidth="3" strokeLinecap="round" /></svg>,
  logic: <svg viewBox="0 0 52 52"><rect x="3" y="3" width="21" height="21" rx="5" fill="var(--z-shape-3)" /><rect x="28" y="3" width="21" height="21" rx="5" fill="var(--z-shape-1)" /><rect x="3" y="28" width="21" height="21" rx="5" fill="var(--z-shape-1)" /><rect x="28" y="28" width="21" height="21" rx="5" fill="none" stroke="var(--z-ink)" strokeWidth="3" strokeDasharray="5 4" /></svg>,
  'life-skills': <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="23" fill="var(--z-shape-1)" /><circle cx="26" cy="26" r="16" fill="var(--z-card)" /><path d="M26 16v10l7 5" fill="none" stroke="var(--z-ink)" strokeWidth="3" strokeLinecap="round" /></svg>,
};

const aliases: Record<string, string> = { mathematics: 'maths', math: 'maths', 'logic & brain games': 'logic', 'life skills': 'life-skills' };

export function subjectKey(subject: string) {
  const key = subject.trim().toLowerCase();
  return aliases[key] ?? key;
}

export function SubjectIcon({ subject, className }: { subject: string; className?: string }) {
  const icon = icons[subjectKey(subject)];
  if (!icon) return null;
  return <span className={`zalea-subject-icon ${className ?? ''}`} aria-hidden="true">{icon}</span>;
}

export function subjectIconNode(subject: string) {
  return icons[subjectKey(subject)];
}
