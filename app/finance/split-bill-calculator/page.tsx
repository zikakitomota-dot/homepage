import { CalculatorPage } from '@/components/money/calculator-page';
import { SplitBillCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Calculate an equal bill split with an optional tip, and decide when item-based or proportional sharing is fairer.';
export const metadata = createMoneyMetadata('Split Bill Calculator', description, '/finance/split-bill-calculator');

export default function Page() {
  return <CalculatorPage title="Split Bill Calculator" description={description} calculator={<SplitBillCalculator />}
    whatItDoes="This calculator adds an optional tip to a bill and divides the total equally between the number of people you enter."
    whenToUse="Use it when a group has agreed to share a restaurant bill, household purchase or other common expense equally. Before calculating, check whether an equal split makes sense: individual ordering, children, non-drinkers or separately paid items can make a different method fairer."
    howToUse={['Enter the total bill amount.', 'Enter how many people are sharing the bill.', 'Add a tip percentage if needed. The per-person amount updates automatically.']}
    formula="Tip = bill amount × tip percentage ÷ 100. Total bill = bill + tip. Amount per person = total bill ÷ number of people."
    example="A RM120 bill with a 10% tip totals RM132. Split between four people, each person pays RM33."
    resultExplanation="The result shows an equal share of the bill plus tip for each person. Because money is displayed to two decimal places, the rounded shares can occasionally differ from the exact total by a cent or two. One person can adjust their share by that small remainder when settling the bill."
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
    commonMistakes={[
      'Adding a service charge as a tip even though it is already included in the bill total.',
      'Dividing shared costs equally while overlooking large individual items that the group did not agree to share.',
      'Rounding every share down, which leaves the final payment short of the amount owed.',
    ]}
    practicalTips={[
      'Agree on equal or item-based splitting before payment, especially when spending varies noticeably across the group.',
      'Separate personal items first, then divide only shared dishes, delivery charges or other common costs.',
      'Keep the receipt visible while settling so the group can confirm tax, service charges and any discounts.',
    ]}
    decisionContext={<div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 sm:p-8"><h2 className="text-2xl font-bold">Decide what is shared before dividing</h2><p className="mt-4 leading-relaxed text-muted-foreground">An equal split is simple when spending is similar. When one person ordered a much more expensive item, total personal items first, divide only genuinely shared dishes and charges, then add each person&apos;s share. The calculator intentionally handles only the equal-split case, so the group&apos;s agreement comes before the arithmetic.</p><div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-xl bg-white p-5"><h3 className="font-bold">Item-based example</h3><p className="mt-2 leading-relaxed text-muted-foreground">Four diners share a RM40 appetiser, so each adds RM10 to their own main-course price. A diner with a RM25 main pays RM35 before shared fees; a diner with a RM50 main pays RM60.</p></div><div className="rounded-xl bg-white p-5"><h3 className="font-bold">Proportional-charge example</h3><p className="mt-2 leading-relaxed text-muted-foreground">If three people&apos;s items are RM30, RM45 and RM75, their shares of a RM15 service charge can follow the same 20% / 30% / 50% proportions: RM3, RM4.50 and RM7.50.</p></div></div><p className="mt-5 leading-relaxed text-muted-foreground">If one person pays first, record the agreed shares from the receipt rather than treating the payer as owing nothing. For cash settlement, assign any one- or two-cent rounding remainder to one person so the repayments equal the actual total.</p></div>}
    faqs={[
      { question: 'Can I split a bill without a tip?', answer: 'Yes. Enter 0 or leave the tip at zero and the original bill will be divided between the group.' },
      { question: 'Does the calculator round each person’s share?', answer: 'The displayed result is rounded to two decimal places. For cash payments, your group may need to adjust the smallest difference.' },
      { question: 'Can the number of people be zero?', answer: 'No. At least one person is required, preventing a divide-by-zero result.' },
      { question: 'How should I include a service charge?', answer: 'If the service charge is not already in the displayed bill, add it to the bill amount before splitting. Do not also enter it as a tip unless both charges apply.' },
      { question: 'Can this calculator split different amounts for each person?', answer: 'No. It divides the total equally. For an uneven split, total each person’s items first and divide only shared charges separately.' },
    ]}
    relatedLinks={[
      { label: 'Equal vs Unequal Bill Splitting', href: '/guides/equal-vs-unequal-bill-splitting', description: 'Choose a fair method for equal shares, item-based payments and shared charges.' },
      { label: 'Percentage Calculator', href: '/math/percentage-calculator', description: 'Calculate a tip percentage or check how a rate changes the total.' },
      { label: 'All Finance Tools', href: '/finance', description: 'Explore practical calculators for purchases, savings and everyday costs.' },
    ]} />;
}

