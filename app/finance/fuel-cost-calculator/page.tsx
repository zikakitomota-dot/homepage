import { CalculatorPage } from '@/components/money/calculator-page';
import { FuelCostCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Estimate trip fuel cost, fuel used, and cost per kilometre from distance, vehicle fuel economy, and price per litre.';
export const metadata = createMoneyMetadata('Fuel Cost Calculator', description, '/finance/fuel-cost-calculator');

export default function Page() {
  return <CalculatorPage title="Fuel Cost Calculator" description={description} calculator={<FuelCostCalculator />}
    whatItDoes="This metric fuel calculator estimates trip cost, litres used, and fuel cost per kilometre using either L/100 km or km/L."
    howToUse={['Enter the total trip distance in kilometres, including the return distance when needed.', 'Choose L/100 km or km/L and enter your vehicle’s average fuel economy.', 'Choose a currency and enter the fuel price per litre.']}
    formula="For L/100 km: fuel used = distance × fuel consumption ÷ 100. For km/L: fuel used = distance ÷ fuel efficiency. Trip cost = fuel used × price per litre. Cost per km = trip cost ÷ distance."
    example="For 120 km at 8 L/100 km and 2.50 per litre: fuel used = 120 × 8 ÷ 100 = 9.6 L; trip cost = 9.6 × 2.50 = 24.00; cost per km = 24.00 ÷ 120 = 0.20."
    assumptions={[
      'Distance is entered in kilometres and fuel price is entered per litre in the selected currency.',
      'The efficiency figure represents the vehicle’s average consumption for the trip.',
      'The same fuel price applies to all estimated litres used.',
    ]}
    limitations={[
      'Traffic, speed, terrain, idling, vehicle load, air conditioning, tyre pressure, and driving style can change actual consumption.',
      'The result covers fuel only and excludes tolls, parking, maintenance, and vehicle depreciation.',
      'Electricity use and plug-in hybrid operation require a different calculation.',
    ]}
    faqs={[
      { question: 'How do I calculate fuel cost for a trip?', answer: 'Estimate the fuel used from distance and fuel economy, then multiply the litres required by the price per litre. Enter the total round-trip distance when planning a return journey.' },
      { question: 'How much fuel does a 100 km trip use?', answer: 'It depends on the vehicle. At 7 L/100 km, a 100 km trip uses about 7 litres. At 2.50 per litre, that fuel costs 17.50 in the selected currency.' },
      { question: 'How much does it cost to drive 120 km?', answer: 'At 8 L/100 km, 120 km uses 9.6 litres. At 2.50 per litre, the estimated fuel cost is 24.00. Actual cost depends on fuel economy, price, and driving conditions.' },
      { question: 'How do I calculate fuel cost per kilometre?', answer: 'Divide the estimated trip fuel cost by the trip distance. For example, 24.00 ÷ 120 km equals 0.20 per km.' },
      { question: 'What does L/100 km mean?', answer: 'It is the litres of fuel used to travel 100 kilometres. Lower L/100 km means better fuel economy.' },
      { question: 'What does km/L mean?', answer: 'It is the kilometres travelled on one litre of fuel. Higher km/L means better fuel economy.' },
      { question: 'Where can I find my vehicle’s fuel efficiency?', answer: 'Check the dashboard average, owner’s manual, manufacturer specifications, or calculate it from recent fuel and distance records.' },
      { question: 'Will the actual trip cost be exactly the same?', answer: 'It is an estimate. Traffic, speed, weather, load, tyre pressure, and driving style can change actual fuel use.' },
      { question: 'Should I enter one-way or round-trip distance?', answer: 'Enter the total distance you expect to drive. For a return journey, include both directions plus any planned detours.' },
      { question: 'How much does one mile cost in fuel?', answer: 'This calculator does not accept miles or mpg directly. Convert the distance to kilometres and fuel economy to L/100 km or km/L before calculating, then convert the per-kilometre result if needed.' },
    ]} />;
}

