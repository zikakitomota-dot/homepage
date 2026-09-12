import { CalculatorPage } from '@/components/money/calculator-page';
import { DiscountCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Calculate a discount amount, final sale price, and how much you save with this free discount calculator.';
export const metadata = createMoneyMetadata('Discount Calculator', description, '/finance/discount-calculator');

export default function Page() {
  return <CalculatorPage title="Discount Calculator" description={description} calculator={<DiscountCalculator />}
    whatItDoes="This calculator turns a percentage discount into a clear saving amount and final price, helping you check sale offers before buying."
    whenToUse="Use it to check an advertised sale, compare a percentage offer with a fixed-price deal, or confirm the reduced price before checkout. It is especially helpful when two shops show the same product with different original prices or when a second discount is applied after the first."
    howToUse={['Choose your preferred currency.', 'Enter the original price.', 'Enter the advertised discount percentage. Results update instantly.']}
    formula="Discount amount = original price × discount percentage ÷ 100. Final price = original price − discount amount."
    example="For an item priced at RM120 with a 20% discount, the saving is RM24 and the final price is RM96."
    resultExplanation="The discount amount is the portion removed from the original price. The final price is what remains before any separate tax, delivery or service charge. A larger percentage does not automatically mean the lowest final price when sellers start from different original prices."
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
    commonMistakes={[
      'Subtracting the percentage number directly from the price—for example, treating 20% off RM120 as RM120 minus RM20.',
      'Adding consecutive discounts together even though the second discount normally applies to the already-reduced price.',
      'Comparing savings amounts without also comparing the final price, package size and extra checkout charges.',
    ]}
    practicalTips={[
      'Use the regular price you would genuinely have paid, not an inflated comparison price, when judging the value of an offer.',
      'For two consecutive discounts, calculate the first sale price and enter that result as the starting price for the second.',
      'Check whether a coupon excludes sale items or changes eligibility for free delivery before relying on the estimated total.',
    ]}
    faqs={[
      { question: 'Can I calculate discounts in different currencies?', answer: 'Yes. Choose RM, USD, SGD, GBP, EUR, or AUD. The calculation stays the same; only the displayed currency changes.' },
      { question: 'Does this include tax or delivery fees?', answer: 'No. It calculates the discount on the price entered. Add tax or delivery separately if they are not included in the original price.' },
      { question: 'Can a discount be more than 100%?', answer: 'The calculator limits discounts to 100% so the final price cannot become negative.' },
      { question: 'How do I calculate two discounts applied one after another?', answer: 'Apply the first discount, then use its final price as the original price for the second calculation. For example, 20% off followed by 10% off is a combined 28% reduction, not 30%.' },
      { question: 'Should I enter the price before or after tax?', answer: 'Enter the amount to which the retailer actually applies the discount. Whether that is before or after tax depends on the seller and local tax rules.' },
    ]}
    relatedLinks={[
      { label: 'Percentage Calculator', href: '/math/percentage-calculator', description: 'Work with percentage change, reverse percentages and other percentage questions.' },
      { label: 'Percentage Points vs Percentage Change', href: '/guides/percentage-points-vs-percentage-change', description: 'Learn why a change in a percentage rate is not always the same as a percentage change.' },
      { label: 'Unit Price Calculator', href: '/finance/unit-price-calculator', description: 'Compare package value after deciding which prices should be used.' },
    ]} />;
}

