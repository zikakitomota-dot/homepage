'use client';

import { useMemo, useState, type ReactNode } from 'react';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  currencies,
  formatMoney,
  nonNegativeNumber,
  type CurrencyCode,
} from '@/lib/money-tools';

function NumberField({
  id,
  label,
  value,
  onChange,
  placeholder,
  min = 0,
  step = '0.01',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  step?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min={min}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 text-base"
      />
    </div>
  );
}

function CurrencySelect({ value, onChange }: { value: CurrencyCode; onChange: (value: CurrencyCode) => void }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="currency">Currency</Label>
      <select
        id="currency"
        value={value}
        onChange={(event) => onChange(event.target.value as CurrencyCode)}
        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {currencies.map((currency) => <option key={currency}>{currency}</option>)}
      </select>
    </div>
  );
}

function ResultRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className={`flex items-start justify-between gap-4 rounded-xl p-4 ${emphasis ? 'bg-primary text-primary-foreground' : 'bg-secondary/70'}`}>
      <span className="text-sm font-medium">{label}</span>
      <span className="text-right text-lg font-bold">{value}</span>
    </div>
  );
}

function CalculatorFrame({ inputs, results, onReset }: { inputs: ReactNode; results: ReactNode; onReset: () => void }) {
  return (
    <Card className="overflow-hidden border-border/60 shadow-lg">
      <div className="grid lg:grid-cols-2">
        <div>
          <CardHeader><CardTitle>Enter your details</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={(event) => event.preventDefault()}>
              {inputs}
              <Button type="button" variant="outline" onClick={onReset} className="w-full sm:w-auto">
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                Reset
              </Button>
            </form>
          </CardContent>
        </div>
        <div className="border-t border-border/60 bg-blue-50/50 lg:border-l lg:border-t-0">
          <CardHeader><CardTitle>Your results</CardTitle></CardHeader>
          <CardContent className="space-y-3" aria-live="polite">{results}</CardContent>
        </div>
      </div>
    </Card>
  );
}

export function DiscountCalculator() {
  const [price, setPrice] = useState('120');
  const [discount, setDiscount] = useState('20');
  const [currency, setCurrency] = useState<CurrencyCode>('RM');
  const originalPrice = nonNegativeNumber(price);
  const percentage = Math.min(100, nonNegativeNumber(discount));
  const discountAmount = originalPrice * percentage / 100;
  const finalPrice = originalPrice - discountAmount;

  return <CalculatorFrame onReset={() => { setPrice('120'); setDiscount('20'); setCurrency('RM'); }} inputs={<>
    <CurrencySelect value={currency} onChange={setCurrency} />
    <NumberField id="original-price" label="Original price" value={price} onChange={setPrice} placeholder="120.00" />
    <NumberField id="discount-percentage" label="Discount percentage (%)" value={discount} onChange={setDiscount} placeholder="20" />
  </>} results={<>
    <ResultRow label="Original price" value={formatMoney(originalPrice, currency)} />
    <ResultRow label="Discount amount" value={formatMoney(discountAmount, currency)} />
    <ResultRow label="Final price" value={formatMoney(finalPrice, currency)} emphasis />
    <ResultRow label="You save" value={formatMoney(discountAmount, currency)} />
  </>} />;
}

export function SplitBillCalculator() {
  const [bill, setBill] = useState('120');
  const [people, setPeople] = useState('4');
  const [tip, setTip] = useState('10');
  const [currency, setCurrency] = useState<CurrencyCode>('RM');
  const billAmount = nonNegativeNumber(bill);
  const personCount = Math.max(1, Math.floor(nonNegativeNumber(people)) || 1);
  const tipAmount = billAmount * nonNegativeNumber(tip) / 100;
  const total = billAmount + tipAmount;

  return <CalculatorFrame onReset={() => { setBill('120'); setPeople('4'); setTip('10'); setCurrency('RM'); }} inputs={<>
    <CurrencySelect value={currency} onChange={setCurrency} />
    <NumberField id="bill-amount" label="Bill amount" value={bill} onChange={setBill} />
    <NumberField id="number-of-people" label="Number of people" value={people} onChange={setPeople} min={1} step="1" />
    <NumberField id="tip-percentage" label="Tip percentage (optional)" value={tip} onChange={setTip} />
  </>} results={<>
    <ResultRow label="Bill amount" value={formatMoney(billAmount, currency)} />
    <ResultRow label="Tip amount" value={formatMoney(tipAmount, currency)} />
    <ResultRow label="Total bill" value={formatMoney(total, currency)} />
    <ResultRow label="Amount per person" value={formatMoney(total / personCount, currency)} emphasis />
  </>} />;
}

export function SavingsGoalCalculator() {
  const [goal, setGoal] = useState('10000');
  const [saved, setSaved] = useState('2000');
  const [monthly, setMonthly] = useState('500');
  const [currency, setCurrency] = useState<CurrencyCode>('RM');
  const goalAmount = nonNegativeNumber(goal);
  const savedAmount = nonNegativeNumber(saved);
  const monthlyAmount = nonNegativeNumber(monthly);
  const remaining = Math.max(0, goalAmount - savedAmount);
  const reached = goalAmount > 0 && savedAmount >= goalAmount;
  const months = monthlyAmount > 0 ? Math.ceil(remaining / monthlyAmount) : null;
  const completionDate = useMemo(() => {
    if (months === null || reached) return null;
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date);
  }, [months, reached]);

  return <CalculatorFrame onReset={() => { setGoal('10000'); setSaved('2000'); setMonthly('500'); setCurrency('RM'); }} inputs={<>
    <CurrencySelect value={currency} onChange={setCurrency} />
    <NumberField id="savings-goal" label="Savings goal" value={goal} onChange={setGoal} />
    <NumberField id="already-saved" label="Amount already saved" value={saved} onChange={setSaved} />
    <NumberField id="monthly-contribution" label="Monthly contribution" value={monthly} onChange={setMonthly} />
  </>} results={<>
    <ResultRow label="Remaining amount" value={formatMoney(remaining, currency)} />
    {reached ? <ResultRow label="Status" value="Goal already reached!" emphasis /> : monthlyAmount === 0 ? <ResultRow label="Next step" value="Add a monthly contribution to estimate your timeline." emphasis /> : <>
      <ResultRow label="Estimated months needed" value={`${months ?? 0} months`} emphasis />
      <ResultRow label="Estimated completion" value={completionDate ?? '—'} />
    </>}
  </>} />;
}

type Unit = 'g' | 'kg' | 'ml' | 'L' | 'item';
const units: Unit[] = ['g', 'kg', 'ml', 'L', 'item'];

function unitFamily(unit: Unit) {
  if (unit === 'g' || unit === 'kg') return 'mass';
  if (unit === 'ml' || unit === 'L') return 'volume';
  return 'item';
}

function normalizedQuantity(quantity: number, unit: Unit) {
  return quantity * (unit === 'kg' || unit === 'L' ? 1000 : 1);
}

function UnitSelect({ id, value, onChange }: { id: string; value: Unit; onChange: (value: Unit) => void }) {
  return <div className="space-y-2"><Label htmlFor={id}>Unit</Label><select id={id} value={value} onChange={(event) => onChange(event.target.value as Unit)} className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{units.map((unit) => <option key={unit}>{unit}</option>)}</select></div>;
}

export function UnitPriceCalculator() {
  const [priceA, setPriceA] = useState('10');
  const [quantityA, setQuantityA] = useState('500');
  const [unitA, setUnitA] = useState<Unit>('g');
  const [priceB, setPriceB] = useState('18');
  const [quantityB, setQuantityB] = useState('1');
  const [unitB, setUnitB] = useState<Unit>('kg');
  const [currency, setCurrency] = useState<CurrencyCode>('RM');
  const quantityABase = normalizedQuantity(nonNegativeNumber(quantityA), unitA);
  const quantityBBase = normalizedQuantity(nonNegativeNumber(quantityB), unitB);
  const unitPriceA = quantityABase > 0 ? nonNegativeNumber(priceA) / quantityABase : 0;
  const unitPriceB = quantityBBase > 0 ? nonNegativeNumber(priceB) / quantityBBase : 0;
  const compatible = unitFamily(unitA) === unitFamily(unitB);
  const ready = compatible && quantityABase > 0 && quantityBBase > 0;
  const better = unitPriceA === unitPriceB ? 'Both products offer the same value.' : unitPriceA < unitPriceB ? 'Product A offers better value.' : 'Product B offers better value.';
  const higher = Math.max(unitPriceA, unitPriceB);
  const cheaperPercent = higher > 0 ? Math.abs(unitPriceA - unitPriceB) / higher * 100 : 0;
  const displayFactor = unitFamily(unitA) === 'item' ? 1 : 100;
  const baseLabel = unitFamily(unitA) === 'mass' ? '100 g' : unitFamily(unitA) === 'volume' ? '100 ml' : 'item';

  return <CalculatorFrame onReset={() => { setPriceA('10'); setQuantityA('500'); setUnitA('g'); setPriceB('18'); setQuantityB('1'); setUnitB('kg'); setCurrency('RM'); }} inputs={<>
    <CurrencySelect value={currency} onChange={setCurrency} />
    <fieldset className="space-y-4 rounded-xl border border-border p-4"><legend className="px-2 font-semibold">Product A</legend><NumberField id="price-a" label="Price" value={priceA} onChange={setPriceA} /><div className="grid grid-cols-2 gap-3"><NumberField id="quantity-a" label="Quantity" value={quantityA} onChange={setQuantityA} /><UnitSelect id="unit-a" value={unitA} onChange={setUnitA} /></div></fieldset>
    <fieldset className="space-y-4 rounded-xl border border-border p-4"><legend className="px-2 font-semibold">Product B</legend><NumberField id="price-b" label="Price" value={priceB} onChange={setPriceB} /><div className="grid grid-cols-2 gap-3"><NumberField id="quantity-b" label="Quantity" value={quantityB} onChange={setQuantityB} /><UnitSelect id="unit-b" value={unitB} onChange={setUnitB} /></div></fieldset>
  </>} results={!compatible ? <ResultRow label="Unable to compare" value="Choose compatible units such as g with kg, or ml with L." emphasis /> : !ready ? <ResultRow label="Add quantities" value="Both quantities must be greater than zero." emphasis /> : <>
    <ResultRow label={`Product A per ${baseLabel}`} value={formatMoney(unitPriceA * displayFactor, currency)} />
    <ResultRow label={`Product B per ${baseLabel}`} value={formatMoney(unitPriceB * displayFactor, currency)} />
    <ResultRow label="Better value" value={better} emphasis />
    <ResultRow label="Difference" value={`${cheaperPercent.toFixed(1)}% cheaper`} />
  </>} />;
}

export function FuelCostCalculator() {
  const [distance, setDistance] = useState('100');
  const [efficiency, setEfficiency] = useState('7.5');
  const [fuelPrice, setFuelPrice] = useState('2.05');
  const [mode, setMode] = useState<'l100km' | 'kml'>('l100km');
  const [currency, setCurrency] = useState<CurrencyCode>('RM');
  const distanceValue = nonNegativeNumber(distance);
  const efficiencyValue = nonNegativeNumber(efficiency);
  const fuelNeeded = efficiencyValue > 0 ? mode === 'l100km' ? distanceValue * efficiencyValue / 100 : distanceValue / efficiencyValue : 0;
  const tripCost = fuelNeeded * nonNegativeNumber(fuelPrice);

  return <CalculatorFrame onReset={() => { setDistance('100'); setEfficiency('7.5'); setFuelPrice('2.05'); setMode('l100km'); setCurrency('RM'); }} inputs={<>
    <CurrencySelect value={currency} onChange={setCurrency} />
    <NumberField id="distance" label="Distance (km)" value={distance} onChange={setDistance} />
    <div className="space-y-2"><Label htmlFor="efficiency-mode">Fuel efficiency format</Label><select id="efficiency-mode" value={mode} onChange={(event) => setMode(event.target.value as 'l100km' | 'kml')} className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><option value="l100km">L/100km</option><option value="kml">km/L</option></select></div>
    <NumberField id="fuel-efficiency" label={`Fuel efficiency (${mode === 'l100km' ? 'L/100km' : 'km/L'})`} value={efficiency} onChange={setEfficiency} />
    <NumberField id="fuel-price" label="Fuel price per litre" value={fuelPrice} onChange={setFuelPrice} />
  </>} results={efficiencyValue === 0 ? <ResultRow label="Fuel efficiency needed" value="Enter a value greater than zero." emphasis /> : <>
    <ResultRow label="Estimated fuel needed" value={`${fuelNeeded.toFixed(2)} L`} />
    <ResultRow label="Estimated trip cost" value={formatMoney(tripCost, currency)} emphasis />
  </>} />;
}

export function CashbackCalculator() {
  const [purchase, setPurchase] = useState('250');
  const [percentage, setPercentage] = useState('5');
  const [cap, setCap] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('RM');
  const purchaseAmount = nonNegativeNumber(purchase);
  const rawCashback = purchaseAmount * Math.min(100, nonNegativeNumber(percentage)) / 100;
  const hasCap = cap.trim() !== '';
  const earned = hasCap ? Math.min(rawCashback, nonNegativeNumber(cap)) : rawCashback;

  return <CalculatorFrame onReset={() => { setPurchase('250'); setPercentage('5'); setCap(''); setCurrency('RM'); }} inputs={<>
    <CurrencySelect value={currency} onChange={setCurrency} />
    <NumberField id="purchase-amount" label="Purchase amount" value={purchase} onChange={setPurchase} />
    <NumberField id="cashback-percentage" label="Cashback percentage (%)" value={percentage} onChange={setPercentage} />
    <NumberField id="cashback-cap" label="Maximum cashback cap (optional)" value={cap} onChange={setCap} placeholder="Leave blank for no cap" />
  </>} results={<>
    <ResultRow label="Cashback before cap" value={formatMoney(rawCashback, currency)} />
    <ResultRow label="Cashback earned" value={formatMoney(earned, currency)} emphasis />
    <ResultRow label="Effective final cost" value={formatMoney(purchaseAmount - earned, currency)} />
  </>} />;
}
