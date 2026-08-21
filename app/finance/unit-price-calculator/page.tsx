import { CalculatorPage } from '@/components/money/calculator-page';
import { UnitPriceCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Compare the unit price of two products across grams, kilograms, millilitres, litres, or individual items.';
export const metadata = createMoneyMetadata('Unit Price Calculator', description, '/finance/unit-price-calculator');

export default function Page() {
  return <CalculatorPage title="Unit Price Calculator" description={description} calculator={<UnitPriceCalculator />}
    whatItDoes="This calculator normalizes compatible package sizes and shows which of two products costs less for the same base unit."
    howToUse={['Enter the price, quantity, and unit for Product A.', 'Enter the same details for Product B.', 'Use compatible measurement types and review the better-value result.']}
    formula="Unit price = product price ÷ normalized quantity. Kilograms convert to grams and litres convert to millilitres before comparison."
    example="RM10 for 500 g costs RM0.02 per g. RM18 for 1 kg costs RM0.018 per g, so Product B is 10% cheaper per gram."
    assumptions={[
      'Each entered price applies to the full package quantity shown.',
      'Package quantities use net grams, kilograms, millilitres, litres, or item counts.',
      'The products are similar enough in quality and purpose for price-per-unit comparison to be useful.',
    ]}
    limitations={[
      'Coupons, membership prices, deposits, and taxes are reflected only if you include them in the entered price.',
      'Mass and volume cannot be compared directly because conversion would require the product’s density.',
      'A lower unit price does not account for quality, expiry dates, storage limits, or unused product waste.',
    ]}
    faqs={[
      { question: 'Can I compare grams with kilograms?', answer: 'Yes. The calculator converts kilograms to grams. It also converts litres to millilitres.' },
      { question: 'Why can’t I compare kilograms with litres?', answer: 'Mass and volume measure different things, so they do not provide a meaningful direct unit-price comparison.' },
      { question: 'Does cheaper always mean better?', answer: 'Not necessarily. Unit price helps compare cost, but quality, expiry dates, storage, and how much you will use can also matter.' },
      { question: 'How do I compare multipacks?', answer: 'Choose items and enter the total number of individual units in each pack. Use the full pack price, including any discount you will actually receive.' },
      { question: 'How should I enter a promotional price?', answer: 'Enter the amount you will pay for the stated quantity. If the promotion requires buying several packs, use the combined price and combined quantity.' },
    ]} />;
}

