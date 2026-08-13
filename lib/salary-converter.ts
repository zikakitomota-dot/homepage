export type SalaryPeriod = 'annual' | 'monthly' | 'weekly';

export type WorkSchedule = {
  hoursPerDay: number;
  daysPerWeek: number;
  weeksPerYear: number;
};

export type PayEquivalents = {
  hourly: number;
  daily: number;
  weekly: number;
  monthly: number;
  annual: number;
  hoursPerWeek: number;
  hoursPerYear: number;
};

export function convertSalaryToHourly(salary: number, period: SalaryPeriod, schedule: WorkSchedule): PayEquivalents {
  const hoursPerWeek = schedule.hoursPerDay * schedule.daysPerWeek;
  const hoursPerYear = hoursPerWeek * schedule.weeksPerYear;
  const annual = period === 'annual' ? salary : period === 'monthly' ? salary * 12 : salary * schedule.weeksPerYear;
  const hourly = annual / hoursPerYear;
  return {
    hourly,
    daily: hourly * schedule.hoursPerDay,
    weekly: hourly * hoursPerWeek,
    monthly: annual / 12,
    annual,
    hoursPerWeek,
    hoursPerYear,
  };
}

export function convertHourlyToSalary(hourly: number, schedule: WorkSchedule): PayEquivalents {
  const hoursPerWeek = schedule.hoursPerDay * schedule.daysPerWeek;
  const hoursPerYear = hoursPerWeek * schedule.weeksPerYear;
  const daily = hourly * schedule.hoursPerDay;
  const weekly = daily * schedule.daysPerWeek;
  const annual = weekly * schedule.weeksPerYear;
  return { hourly, daily, weekly, monthly: annual / 12, annual, hoursPerWeek, hoursPerYear };
}
