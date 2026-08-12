import { CalculatorPage } from '@/components/money/calculator-page';
import { SplitBillCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Split a bill between friends or family and include an optional tip with this free split bill calculator.';
export const metadata = createMoneyMetadata('Split Bill Calculator', description, '/finance/split-bill-calculator');

export default function Page() {
  return <CalculatorPage title="Split Bill Calculator" description={description} calculator={<SplitBillCalculator />}
    whatItDoes="This calculator adds an optional tip to a bill and divides the total equally between the number of people you enter."
    howToUse={['Enter the total bill amount.', 'Enter how many people are sharing the bill.', 'Add a tip percentage if needed. The per-person amount updates automatically.']}
    formula="Tip = bill amount × tip percentage ÷ 100. Total bill = bill + tip. Amount per person = total bill ÷ number of people."
    example="A RM120 bill with a 10% tip totals RM132. Split between four people, each person pays RM33."
    faqs={[
      { question: 'Can I split a bill without a tip?', answer: 'Yes. Enter 0 or leave the tip at zero and the original bill will be divided between the group.' },
      { question: 'Does the calculator round each person’s share?', answer: 'The displayed result is rounded to two decimal places. For cash payments, your group may need to adjust the smallest difference.' },
      { question: 'Can the number of people be zero?', answer: 'No. At least one person is required, preventing a divide-by-zero result.' },
    ]} />;
}
