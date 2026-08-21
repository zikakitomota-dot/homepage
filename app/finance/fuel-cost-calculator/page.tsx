import { CalculatorPage } from '@/components/money/calculator-page';
import { FuelCostCalculator } from '@/components/money/calculators';
import { createMoneyMetadata } from '@/lib/money-tools';

const description = 'Estimate the fuel needed and fuel cost for a trip using distance, vehicle efficiency, and price per litre.';
export const metadata = createMoneyMetadata('Fuel Cost Calculator', description, '/finance/fuel-cost-calculator');

export default function Page() {
  return <CalculatorPage title="Fuel Cost Calculator" description={description} calculator={<FuelCostCalculator />}
    whatItDoes="This calculator estimates litres of fuel and trip cost using either L/100km or km/L fuel-efficiency figures."
    howToUse={['Enter the trip distance in kilometres.', 'Choose your vehicle’s efficiency format and enter its value.', 'Enter the current fuel price per litre.']}
    formula="For L/100km: fuel = distance × efficiency ÷ 100. For km/L: fuel = distance ÷ efficiency. Trip cost = fuel × price per litre."
    example="A 100 km trip at 7.5 L/100km needs about 7.5 L. At RM2.05 per litre, the estimated cost is RM15.38."
    assumptions={[
      'Distance is entered in kilometres and fuel price is entered per litre.',
      'The efficiency figure represents the vehicle’s average consumption for the trip.',
      'The same fuel price applies to all estimated litres used.',
    ]}
    limitations={[
      'Traffic, idling, detours, hills, weather, load, tyre pressure, and driving style can change actual consumption.',
      'The result covers fuel only and excludes tolls, parking, maintenance, and vehicle depreciation.',
      'Electricity use and plug-in hybrid operation require a different calculation.',
    ]}
    faqs={[
      { question: 'Where can I find my vehicle’s fuel efficiency?', answer: 'Check the dashboard average, owner’s manual, manufacturer specifications, or calculate it from recent fuel and distance records.' },
      { question: 'Will the actual trip cost be exactly the same?', answer: 'It is an estimate. Traffic, speed, weather, load, tyre pressure, and driving style can change actual fuel use.' },
      { question: 'Does this include tolls or parking?', answer: 'No. The result covers estimated fuel cost only.' },
      { question: 'Should I enter one-way or round-trip distance?', answer: 'Enter the total distance you expect to drive. For a return journey, include both directions plus any planned detours.' },
      { question: 'Can I enter miles per gallon?', answer: 'Not directly. Convert the trip distance to kilometres and use either L/100km or km/L for efficiency before calculating.' },
    ]} />;
}

