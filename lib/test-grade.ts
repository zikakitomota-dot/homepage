import { letterGradeFor, type GradeLetter } from '@/lib/education-tools';

export const targetGradeThresholds = [
  ['A+', 97], ['A', 93], ['A−', 90], ['B+', 87], ['B', 83], ['B−', 80],
  ['C+', 77], ['C', 73], ['C−', 70], ['D+', 67], ['D', 63], ['D−', 60],
] as const;
export type TargetGrade = (typeof targetGradeThresholds)[number][0];
export type TestGradeResult = { total: number; correct: number; wrong: number; percentage: number; letter: GradeLetter };
export type TestChartRow = TestGradeResult & { isCurrent: boolean };

export function calculateTestGrade(total: number, answers: number, mode: 'correct' | 'wrong'): TestGradeResult | null {
  if (![total, answers].every(Number.isFinite) || !Number.isInteger(total) || !Number.isInteger(answers) || total <= 0 || answers < 0 || answers > total) return null;
  const correct = mode === 'correct' ? answers : total - answers;
  const wrong = total - correct;
  const percentage = correct / total * 100;
  return { total, correct, wrong, percentage, letter: letterGradeFor(percentage) };
}

export function targetScoreFor(total: number, target: TargetGrade) {
  const threshold = targetGradeThresholds.find(([grade]) => grade === target)?.[1];
  if (!Number.isInteger(total) || total <= 0 || threshold === undefined) return null;
  const minimumCorrect = Math.ceil(total * threshold / 100);
  return { target, threshold, minimumCorrect, maximumWrong: total - minimumCorrect };
}

export function createTestGradeChart(total: number, currentCorrect: number | null, full = false): TestChartRow[] {
  if (!Number.isInteger(total) || total <= 0) return [];
  let scores: number[];
  if (total <= 100 || full) scores = Array.from({ length: total + 1 }, (_, index) => total - index);
  else {
    const selected = new Set<number>([total, 0]);
    if (currentCorrect !== null) for (let offset = -3; offset <= 3; offset += 1) selected.add(currentCorrect + offset);
    for (const [, threshold] of targetGradeThresholds) {
      const minimum = Math.ceil(total * threshold / 100);
      selected.add(minimum); selected.add(minimum - 1);
    }
    scores = Array.from(selected).filter((score) => score >= 0 && score <= total).sort((a, b) => b - a);
  }
  return scores.map((correct) => ({ ...(calculateTestGrade(total, correct, 'correct') as TestGradeResult), isCurrent: correct === currentCorrect }));
}
