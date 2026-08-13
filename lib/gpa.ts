export const gpaScale = [
  ['A+', 4], ['A', 4], ['A−', 3.7], ['B+', 3.3], ['B', 3], ['B−', 2.7],
  ['C+', 2.3], ['C', 2], ['C−', 1.7], ['D+', 1.3], ['D', 1], ['D−', 0.7], ['F', 0],
] as const;

export type GpaLetter = (typeof gpaScale)[number][0];
export type CourseGrade = { grade: GpaLetter; credits: number };
export type SemesterGpaResult = { gpa: number; totalCredits: number; totalQualityPoints: number };
export type CumulativeGpaResult = { gpa: number; totalCredits: number; previousQualityPoints: number; newQualityPoints: number };

export function gradePointsFor(letter: GpaLetter) { return gpaScale.find(([grade]) => grade === letter)?.[1] ?? null; }

export function calculateSemesterGpa(courses: readonly CourseGrade[]): SemesterGpaResult | null {
  if (courses.length === 0) return null;
  let totalCredits = 0; let totalQualityPoints = 0;
  for (const course of courses) {
    const gradePoints = gradePointsFor(course.grade);
    if (gradePoints === null || !Number.isFinite(course.credits) || course.credits <= 0) return null;
    totalCredits += course.credits;
    totalQualityPoints += gradePoints * course.credits;
  }
  if (!Number.isFinite(totalCredits) || !Number.isFinite(totalQualityPoints) || totalCredits <= 0) return null;
  const gpa = totalQualityPoints / totalCredits;
  return Number.isFinite(gpa) ? { gpa, totalCredits, totalQualityPoints } : null;
}

export function calculateCumulativeGpa(previousGpa: number, previousCredits: number, newGpa: number, newCredits: number): CumulativeGpaResult | null {
  if (![previousGpa, previousCredits, newGpa, newCredits].every(Number.isFinite) || previousGpa < 0 || previousGpa > 4 || newGpa < 0 || newGpa > 4 || previousCredits < 0 || newCredits <= 0) return null;
  const previousQualityPoints = previousGpa * previousCredits;
  const newQualityPoints = newGpa * newCredits;
  const totalCredits = previousCredits + newCredits;
  const gpa = (previousQualityPoints + newQualityPoints) / totalCredits;
  return Number.isFinite(gpa) ? { gpa, totalCredits, previousQualityPoints, newQualityPoints } : null;
}
