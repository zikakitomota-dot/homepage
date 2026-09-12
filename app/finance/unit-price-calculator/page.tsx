import { CalculatorPage } from '@/components/money/calculator-page';
import { UnitPriceCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Compare the unit price of two products across grams, kilograms, millilitres, litres, or individual items.';
export const metadata = createMoneyMetadata('Unit Price Calculator', description, '/finance/unit-price-calculator');

export default function Page() {
  return <CalculatorPage title="Unit Price Calculator" description={description} calculator={<UnitPriceCalculator />}
    whatItDoes="This calculator normalizes compatible package sizes and shows which of two products costs less for the same base unit."
    whenToUse="Use it when package sizes make shelf prices hard to compare—for example, 500 g versus 1 kg, 750 ml versus 2 litres, or packs containing different item counts. It works best for products that are genuinely comparable in quality, contents and intended use."
    howToUse={['Enter the price, quantity, and unit for Product A.', 'Enter the same details for Product B.', 'Use compatible measurement types and review the better-value result.']}
    formula="Unit price = product price ÷ normalized quantity. Kilograms convert to grams and litres convert to millilitres before comparison."
    example="RM10 for 500 g costs RM0.02 per g. RM18 for 1 kg costs RM0.018 per g, so Product B is 10% cheaper per gram."
    resultExplanation="Each package is converted to the same base unit before its price is divided by quantity. The lower unit price is cheaper for an equal amount, and the percentage difference describes the saving relative to the more expensive option—not the saving on the entire package."
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
    commonMistakes={[
      'Comparing the package prices alone and overlooking that one package contains much more product.',
      'Mixing mass, volume and item counts, which cannot be converted without additional product information.',
      'Choosing a bulk pack for its lower unit price even when part of it may expire or go unused.',
    ]}
    practicalTips={[
      'Use the net quantity on the label and include every item in a multipack rather than relying on package dimensions.',
      'Enter the price you will actually pay after an eligible promotion, along with the total quantity the promotion requires.',
      'Treat unit price as one decision factor alongside ingredients, quality, storage space and likely waste.',
    ]}
    decisionContext={<div><h2 className="text-3xl font-bold tracking-tight">Read the label before entering a package</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">Use net quantity</h3><p className="mt-3 leading-relaxed text-muted-foreground">For food or household products, use the net weight or volume printed on the label—not the package dimensions. For a multipack, enter the combined item count or combined net quantity covered by the full price.</p></div><div className="rounded-2xl border border-border/70 bg-white p-6"><h3 className="text-xl font-bold">Match the measurement type</h3><p className="mt-3 leading-relaxed text-muted-foreground">Compare mass with mass, volume with volume, or item count with item count. A 500 g powder and a 750 ml liquid cannot be normalised without knowing density, and two “items” may not be equivalent sizes.</p></div></div></div>}
    faqs={[
      { question: 'Can I compare grams with kilograms?', answer: 'Yes. The calculator converts kilograms to grams. It also converts litres to millilitres.' },
      { question: 'Why can’t I compare kilograms with litres?', answer: 'Mass and volume measure different things, so they do not provide a meaningful direct unit-price comparison.' },
      { question: 'Does cheaper always mean better?', answer: 'Not necessarily. Unit price helps compare cost, but quality, expiry dates, storage, and how much you will use can also matter.' },
      { question: 'How do I compare multipacks?', answer: 'Choose items and enter the total number of individual units in each pack. Use the full pack price, including any discount you will actually receive.' },
      { question: 'How should I enter a promotional price?', answer: 'Enter the amount you will pay for the stated quantity. If the promotion requires buying several packs, use the combined price and combined quantity.' },
    ]}
    relatedLinks={[
      { label: 'Discount Calculator', href: '/finance/discount-calculator', description: 'Find the promotional price to use in a unit-price comparison.' },
      { label: 'Percentage Calculator', href: '/math/percentage-calculator', description: 'Check percentage differences and price changes.' },
      { label: 'All Finance Tools', href: '/finance', description: 'Explore additional calculators for everyday purchase decisions.' },
    ]} />;
}

