import type { Goal, ImpactItem, Scenario, Recommendation } from '../types';

export const INITIAL_GOALS: Goal[] = [
  {
    id: 1,
    name: "Car Downpayment",
    currentAmount: 4332,
    targetAmount: 4322,
    completed: true,
    contributions: [
      { id: 'c1', date: '2025-10-15', amount: 1500 },
      { id: 'c2', date: '2025-09-15', amount: 1500 },
      { id: 'c3', date: '2025-08-15', amount: 1332 },
    ]
  },
  {
    id: 2,
    name: "House Loan",
    currentAmount: 31000,
    targetAmount: 1000000,
    completed: false,
    contributions: [
      { id: 'c4', date: '2025-10-01', amount: 10000 },
      { id: 'c5', date: '2025-07-01', amount: 15000 },
      { id: 'c6', date: '2025-04-01', amount: 6000 },
    ]
  },
  {
    id: 3,
    name: "Student Loan",
    currentAmount: 45000,
    targetAmount: 50000,
    completed: false,
    contributions: [
      { id: 'c7', date: '2025-10-10', amount: 5000 },
    ]
  },
];

export const MOCK_IMPACT_DATA: ImpactItem[] = [
  { id: 'i1', name: 'House Loan', value: 90 },
  { id: 'i2', name: 'Student Loan', value: 65 },
  { id: 'i3', name: 'Car Downpayment', value: 70 },
  { id: 'i4', name: 'Utilities', value: 85 },
  { id: 'i5', name: 'Groceries', value: 68 },
  { id: 'i6', name: 'Subscriptions', value: 72 },
  { id: 'i7', name: 'Vacation Fund', value: 95 },
  { id: 'i8', name: 'Emergency Fund', value: 65 },
  { id: 'i9', name: 'Investments', value: 50 },
];

export const MOCK_SAVED_SCENARIOS: Scenario[] = [
  { id: 's1', name: 'Aggressive Savings Plan' },
  { id: 's2', name: 'Early Retirement Study' },
  { id: 's3', name: 'New House Purchase' },
];

export const MOCK_PRESET_SCENARIOS: Scenario[] = [
  { id: 'p1', name: 'Market Crash (30%)' },
  { id: 'p2', name: 'High Inflation (10%)' },
  { id: 'p3', name: 'Windfall (10k)' },
];

export const MOCK_SCENARIO_RESULTS: ImpactItem[] = [
  { id: 'r1', name: 'Projected Balance', value: 85 },
  { id: 'r2', name: 'Retirement Goal', value: 60 },
  { id: 'r3', name: 'Emergency Fund', value: 75 },
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 'rec1', text: 'Increase 401k contribution by 2% ($768.90)', checked: false },
  { id: 'rec2', text: 'Move 15% of your balance ($5,766.77) to high-yield savings', checked: true },
  { id: 'rec3', text: 'Delay vacation goal by 6 months', checked: false },
  { id: 'rec4', text: 'Rebalance investment portfolio', checked: false },
  { id: 'rec5', text: 'Consolidate student loans', checked: false },
];
