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
    assumptions={[
      'Every person pays an equal share of the bill and tip.',
      'The tip percentage is calculated from the bill amount entered.',
      'The number of people is treated as a whole number with a minimum of one.',
    ]}
    limitations={[
      'The calculator does not assign individual menu items or different tip amounts to specific people.',
      'Tax and service charges are included only when they are already part of the bill amount entered.',
      'Cash payments may require a small adjustment because each displayed share is rounded to two decimal places.',
    ]}
    faqs={[
      { question: 'Can I split a bill without a tip?', answer: 'Yes. Enter 0 or leave the tip at zero and the original bill will be divided between the group.' },
      { question: 'Does the calculator round each person’s share?', answer: 'The displayed result is rounded to two decimal places. For cash payments, your group may need to adjust the smallest difference.' },
      { question: 'Can the number of people be zero?', answer: 'No. At least one person is required, preventing a divide-by-zero result.' },
      { question: 'How should I include a service charge?', answer: 'If the service charge is not already in the displayed bill, add it to the bill amount before splitting. Do not also enter it as a tip unless both charges apply.' },
      { question: 'Can this calculator split different amounts for each person?', answer: 'No. It divides the total equally. For an uneven split, total each person’s items first and divide only shared charges separately.' },
    ]} />;
}

