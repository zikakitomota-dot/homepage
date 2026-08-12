import { CalculatorPage } from '@/components/money/calculator-page';
import { SavingsGoalCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Estimate how many months you need to reach a savings target based on your current savings and monthly contribution.';
export const metadata = createMoneyMetadata('Savings Goal Calculator', description, '/finance/savings-goal-calculator');

export default function Page() {
  return <CalculatorPage title="Savings Goal Calculator" description={description} calculator={<SavingsGoalCalculator />}
    whatItDoes="This calculator estimates the amount still needed, the number of monthly contributions required, and an approximate completion month."
    howToUse={['Enter your total savings goal.', 'Add the amount you have already saved.', 'Enter the amount you plan to contribute each month.']}
    formula="Remaining amount = savings goal − amount already saved. Months needed = remaining amount ÷ monthly contribution, rounded up."
    example="For a RM10,000 goal with RM2,000 saved and RM500 added monthly, RM8,000 remains and the estimate is 16 months."
    faqs={[
      { question: 'Why are months rounded up?', answer: 'A partial month still requires another contribution, so rounding up gives a practical estimate for reaching the full goal.' },
      { question: 'What if I have already reached my goal?', answer: 'The calculator recognizes when current savings equal or exceed the goal and displays a goal-reached message.' },
      { question: 'Does this include savings interest?', answer: 'No. This is a simple contribution-based estimate and does not assume interest, investment returns, or changing contributions.' },
    ]} />;
}
