import { CalculatorPage } from '@/components/money/calculator-page';
import { CashbackCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Calculate cashback earned, apply an optional cashback cap, and see the effective final purchase cost.';
export const metadata = createMoneyMetadata('Cashback Calculator', description, '/finance/cashback-calculator');

export default function Page() {
  return <CalculatorPage title="Cashback Calculator" description={description} calculator={<CashbackCalculator />}
    whatItDoes="This calculator shows the cashback before any cap, the actual reward after a cap, and the effective cost after cashback."
    howToUse={['Enter the purchase amount.', 'Enter the cashback percentage.', 'If the offer has a maximum reward, enter the cap; otherwise leave it blank.']}
    formula="Raw cashback = purchase amount × cashback percentage ÷ 100. Cashback earned is the lower of raw cashback and the optional cap."
    example="A RM250 purchase with 5% cashback earns RM12.50. If the cap is RM10, the reward is RM10 and the effective cost is RM240."
    faqs={[
      { question: 'What is a cashback cap?', answer: 'It is the maximum reward an offer will pay, even when the percentage calculation produces a higher amount.' },
      { question: 'Should I enter a cap if the offer has none?', answer: 'No. Leave the field blank and the full percentage-based cashback will be used.' },
      { question: 'Is cashback the same as an instant discount?', answer: 'Not always. Cashback may be credited later or subject to offer terms, while a discount usually reduces the checkout price immediately.' },
    ]} />;
}
