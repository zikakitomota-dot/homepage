import { CalculatorPage } from '@/components/money/calculator-page';
import { SavingsGoalCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Estimate how many months you need to reach a savings target based on your current savings and monthly contribution.';
export const metadata = createMoneyMetadata('Savings Goal Calculator', description, '/finance/savings-goal-calculator');

export default function Page() {
  return <CalculatorPage title="Savings Goal Calculator" description={description} calculator={<SavingsGoalCalculator />}
    whatItDoes="This calculator estimates the amount still needed, the number of monthly contributions required, and an approximate completion month."
    whenToUse="Use it when you have a specific target—such as an emergency buffer, course fee, trip, deposit or planned purchase—and want to test whether a monthly contribution fits your preferred timeline. It is also useful for comparing a cautious contribution with a more ambitious one before you commit to a plan."
    howToUse={['Enter your total savings goal.', 'Add the amount you have already saved.', 'Enter the amount you plan to contribute each month.']}
    formula="Remaining amount = savings goal − amount already saved. Months needed = remaining amount ÷ monthly contribution, rounded up."
    example="For a RM10,000 goal with RM2,000 saved and RM500 added monthly, RM8,000 remains and the estimate is 16 months."
    resultExplanation="The remaining amount is the gap between the target and current savings. The month estimate counts the full contributions needed to close that gap, so it rounds up when the final contribution would be smaller. The displayed completion month is a planning marker, not a guaranteed date."
    assumptions={[
      'The same contribution is added once every month.',
      'Current savings remain available for this goal and are not withdrawn.',
      'The estimate uses contributions only, with no interest, fees, or investment returns.',
    ]}
    limitations={[
      'The completion month is approximate because it is based on today’s date rather than a chosen contribution day.',
      'Changing income, irregular contributions, withdrawals, and emergencies are not modelled.',
      'Inflation and changes in the future cost of the goal are not included.',
    ]}
    commonMistakes={[
      'Entering the full goal as the remaining amount even though some money has already been saved.',
      'Using a best-case monthly contribution that leaves no room for irregular bills or lower-income months.',
      'Treating the estimated month as fixed without updating the plan after a skipped contribution or withdrawal.',
    ]}
    practicalTips={[
      'Start with a contribution you could maintain in an ordinary month, then compare a second scenario for months when more is available.',
      'Keep emergency savings separate from a planned-purchase goal so one purpose does not quietly consume the other.',
      'Review the target price occasionally; a goal for travel, study or a future purchase may change before you reach it.',
    ]}
    decisionContext={<div><h2 className="text-3xl font-bold tracking-tight">Stress-test the monthly contribution before adopting it</h2><p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">A timeline can look precise even when the contribution is optimistic. Compare three scenarios using the same target: a comfortable amount for ordinary months, a lower amount for difficult months, and a higher amount for occasional surplus months.</p><ol className="mt-6 grid gap-4 md:grid-cols-3"><li className="rounded-2xl border border-border/70 bg-white p-6"><strong className="block text-lg">1. Protect essentials</strong><span className="mt-2 block leading-relaxed text-muted-foreground">Do not count money already needed for bills or an emergency buffer as available for the goal.</span></li><li className="rounded-2xl border border-border/70 bg-white p-6"><strong className="block text-lg">2. Record actual progress</strong><span className="mt-2 block leading-relaxed text-muted-foreground">Compare planned and real contributions rather than interpreting one skipped month as failure.</span></li><li className="rounded-2xl border border-border/70 bg-white p-6"><strong className="block text-lg">3. Recheck the target</strong><span className="mt-2 block leading-relaxed text-muted-foreground">Update the total when the purchase price, deadline or priority changes.</span></li></ol></div>}
    faqs={[
      { question: 'Why are months rounded up?', answer: 'A partial month still requires another contribution, so rounding up gives a practical estimate for reaching the full goal.' },
      { question: 'What if I have already reached my goal?', answer: 'The calculator recognizes when current savings equal or exceed the goal and displays a goal-reached message.' },
      { question: 'Does this include savings interest?', answer: 'No. This is a simple contribution-based estimate and does not assume interest, investment returns, or changing contributions.' },
      { question: 'What should I enter if my monthly savings change?', answer: 'Use a realistic average monthly contribution and recalculate whenever your plan changes. A lower conservative average can give a more cautious timeline.' },
      { question: 'Why might the estimated completion month differ from my actual date?', answer: 'The calculator adds whole months from the current date. Your actual result depends on when each contribution arrives and whether every planned payment is made.' },
    ]}
    relatedLinks={[
      { label: 'How to Set a Realistic Savings Goal', href: '/guides/how-to-set-a-realistic-savings-goal', description: 'Choose a clear target, workable contribution and review routine before calculating the timeline.' },
      { label: 'Savings Goal Tracker', href: '/freebies/savings-goal-tracker', description: 'Record milestones and actual contributions with a free printable tracker.' },
      { label: 'Big Purchase Planner', href: '/freebies/big-purchase-planner', description: 'Estimate the full cost and compare options before setting a purchase goal.' },
    ]} />;
}

