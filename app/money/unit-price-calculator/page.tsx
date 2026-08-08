import { CalculatorPage } from '@/components/money/calculator-page';
import { UnitPriceCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Compare the unit price of two products across grams, kilograms, millilitres, litres, or individual items.';
export const metadata = createMoneyMetadata('Unit Price Calculator', description, '/money/unit-price-calculator');

export default function Page() {
  return <CalculatorPage title="Unit Price Calculator" description={description} calculator={<UnitPriceCalculator />}
    whatItDoes="This calculator normalizes compatible package sizes and shows which of two products costs less for the same base unit."
    howToUse={['Enter the price, quantity, and unit for Product A.', 'Enter the same details for Product B.', 'Use compatible measurement types and review the better-value result.']}
    formula="Unit price = product price ÷ normalized quantity. Kilograms convert to grams and litres convert to millilitres before comparison."
    example="RM10 for 500 g costs RM0.02 per g. RM18 for 1 kg costs RM0.018 per g, so Product B is 10% cheaper per gram."
    faqs={[
      { question: 'Can I compare grams with kilograms?', answer: 'Yes. The calculator converts kilograms to grams. It also converts litres to millilitres.' },
      { question: 'Why can’t I compare kilograms with litres?', answer: 'Mass and volume measure different things, so they do not provide a meaningful direct unit-price comparison.' },
      { question: 'Does cheaper always mean better?', answer: 'Not necessarily. Unit price helps compare cost, but quality, expiry dates, storage, and how much you will use can also matter.' },
    ]} />;
}
