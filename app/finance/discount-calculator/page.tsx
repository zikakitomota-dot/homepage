import { CalculatorPage } from '@/components/money/calculator-page';
import { DiscountCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Calculate a discount amount, final sale price, and how much you save with this free discount calculator.';
export const metadata = createMoneyMetadata('Discount Calculator', description, '/finance/discount-calculator');

export default function Page() {
  return <CalculatorPage title="Discount Calculator" description={description} calculator={<DiscountCalculator />}
    whatItDoes="This calculator turns a percentage discount into a clear saving amount and final price, helping you check sale offers before buying."
    howToUse={['Choose your preferred currency.', 'Enter the original price.', 'Enter the advertised discount percentage. Results update instantly.']}
    formula="Discount amount = original price × discount percentage ÷ 100. Final price = original price − discount amount."
    example="For an item priced at RM120 with a 20% discount, the saving is RM24 and the final price is RM96."
    faqs={[
      { question: 'Can I calculate discounts in different currencies?', answer: 'Yes. Choose RM, USD, SGD, GBP, EUR, or AUD. The calculation stays the same; only the displayed currency changes.' },
      { question: 'Does this include tax or delivery fees?', answer: 'No. It calculates the discount on the price entered. Add tax or delivery separately if they are not included in the original price.' },
      { question: 'Can a discount be more than 100%?', answer: 'The calculator limits discounts to 100% so the final price cannot become negative.' },
    ]} />;
}
