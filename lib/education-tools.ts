export const educationTools = [
  {
    slug: 'grade-calculator',
    title: 'Grade Calculator',
    description: 'Calculate your overall grade from assignments, quizzes, tests and other scores.',
    icon: 'graduation-cap',
  },
  {
    slug: 'final-grade-calculator',
    title: 'Final Grade Calculator',
    description: 'Find out what score you need on your final exam to reach your target course grade.',
    icon: 'target',
  },
  {
    slug: 'weighted-grade-calculator',
    title: 'Weighted Grade Calculator',
    description: 'Calculate your overall grade when assignments, tests or course categories have different percentage weights.',
    icon: 'scale',
  },
  {
    slug: 'gpa-calculator',
    title: 'GPA Calculator',
    description: 'Calculate your semester or cumulative GPA using letter grades and credit hours on a standard 4.0 scale.',
    icon: 'school',
  },
  {
    slug: 'test-grade-calculator',
    title: 'Test Grade Calculator',
    description: 'Calculate a test or quiz score from correct or wrong answers and view a complete grade chart.',
    icon: 'clipboard-check',
  },
] as const;

export type GradeLetter = 'A+' | 'A' | 'A−' | 'B+' | 'B' | 'B−' | 'C+' | 'C' | 'C−' | 'D+' | 'D' | 'D−' | 'F';

export type GradeResult = {
  earned: number;
  possible: number;
  percentage: number;
  letter: GradeLetter;
  isExtraCredit: boolean;
};

export function letterGradeFor(percentage: number): GradeLetter {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A−';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B−';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C−';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D−';
  return 'F';
}

export function calculateGrade(earned: number, possible: number): GradeResult | null {
  if (!Number.isFinite(earned) || !Number.isFinite(possible) || earned < 0 || possible <= 0) return null;
  const percentage = (earned / possible) * 100;
  if (!Number.isFinite(percentage)) return null;
  return { earned, possible, percentage, letter: letterGradeFor(percentage), isExtraCredit: percentage > 100 };
}

export function calculateOverallGrade(rows: readonly { earned: number; possible: number }[]): GradeResult | null {
  if (rows.length === 0 || rows.some((row) => !Number.isFinite(row.earned) || !Number.isFinite(row.possible) || row.earned < 0 || row.possible <= 0)) return null;
  const earned = rows.reduce((total, row) => total + row.earned, 0);
  const possible = rows.reduce((total, row) => total + row.possible, 0);
  return calculateGrade(earned, possible);
}
