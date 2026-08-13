import { letterGradeFor, type GradeLetter } from '@/lib/education-tools';

export type WeightedGradeItem = { grade: number; weight: number };
export type WeightedGradeResult = {
  contributionTotal: number;
  totalWeight: number;
  currentGrade: number;
  letter: GradeLetter;
  state: 'partial' | 'complete' | 'overweight';
};

export function weightedContribution(grade: number, weight: number) {
  if (!Number.isFinite(grade) || !Number.isFinite(weight) || grade < 0 || weight < 0 || weight > 100) return null;
  const contribution = grade * weight / 100;
  return Number.isFinite(contribution) ? contribution : null;
}

export function calculateWeightedGrade(items: readonly WeightedGradeItem[]): WeightedGradeResult | null {
  if (items.length === 0) return null;
  let contributionTotal = 0;
  let totalWeight = 0;
  for (const item of items) {
    const contribution = weightedContribution(item.grade, item.weight);
    if (contribution === null) return null;
    contributionTotal += contribution;
    totalWeight += item.weight;
  }
  if (!Number.isFinite(contributionTotal) || !Number.isFinite(totalWeight) || totalWeight <= 0) return null;
  const currentGrade = contributionTotal / totalWeight * 100;
  if (!Number.isFinite(currentGrade)) return null;
  const state = totalWeight > 100 ? 'overweight' : Math.abs(totalWeight - 100) < 1e-9 ? 'complete' : 'partial';
  return { contributionTotal, totalWeight, currentGrade, letter: letterGradeFor(currentGrade), state };
}
