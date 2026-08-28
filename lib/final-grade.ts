export type FinalGradeState = 'achievable' | 'above-100' | 'secured';

export type FinalGradeResult = {
  currentGrade: number;
  finalWeightPercent: number;
  desiredGrade: number;
  requiredFinal: number;
  projectedAtZero: number;
  state: FinalGradeState;
};

export function projectCourseGrade(currentGrade: number, finalWeightPercent: number, finalExamScore: number) {
  if (![currentGrade, finalWeightPercent, finalExamScore].every(Number.isFinite) || finalWeightPercent < 0 || finalWeightPercent > 100) return null;
  const finalWeight = finalWeightPercent / 100;
  const result = currentGrade * (1 - finalWeight) + finalExamScore * finalWeight;
  return Number.isFinite(result) ? result : null;
}

export function calculateRequiredFinal(currentGrade: number, finalWeightPercent: number, desiredGrade: number): FinalGradeResult | null {
  if (![currentGrade, finalWeightPercent, desiredGrade].every(Number.isFinite) || currentGrade < 0 || desiredGrade < 0 || finalWeightPercent <= 0 || finalWeightPercent > 100) return null;
  const finalWeight = finalWeightPercent / 100;
  const requiredFinal = (desiredGrade - currentGrade * (1 - finalWeight)) / finalWeight;
  const projectedAtZero = projectCourseGrade(currentGrade, finalWeightPercent, 0);
  if (!Number.isFinite(requiredFinal) || projectedAtZero === null) return null;
  const state: FinalGradeState = requiredFinal <= 0 ? 'secured' : requiredFinal > 100 ? 'above-100' : 'achievable';
  return { currentGrade, finalWeightPercent, desiredGrade, requiredFinal, projectedAtZero, state };
}

