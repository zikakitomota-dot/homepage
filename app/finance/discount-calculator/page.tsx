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
    assumptions={[
      'The original price is the price before the advertised discount is applied.',
      'One percentage discount applies to the entire amount entered.',
      'The selected currency changes the display symbol, not the calculation.',
    ]}
    limitations={[
      'Tax, delivery charges, coupons, and membership offers are not added automatically.',
      'Retailers may round at a different stage, so the checkout total can differ by the smallest currency unit.',
      'The result compares price only and does not indicate whether the purchase is good value.',
    ]}
    faqs={[
      { question: 'Can I calculate discounts in different currencies?', answer: 'Yes. Choose RM, USD, SGD, GBP, EUR, or AUD. The calculation stays the same; only the displayed currency changes.' },
      { question: 'Does this include tax or delivery fees?', answer: 'No. It calculates the discount on the price entered. Add tax or delivery separately if they are not included in the original price.' },
      { question: 'Can a discount be more than 100%?', answer: 'The calculator limits discounts to 100% so the final price cannot become negative.' },
      { question: 'How do I calculate two discounts applied one after another?', answer: 'Apply the first discount, then use its final price as the original price for the second calculation. For example, 20% off followed by 10% off is a combined 28% reduction, not 30%.' },
      { question: 'Should I enter the price before or after tax?', answer: 'Enter the amount to which the retailer actually applies the discount. Whether that is before or after tax depends on the seller and local tax rules.' },
    ]} />;
}

