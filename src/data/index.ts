import type { Goal, ImpactItem, Scenario, Recommendation, UserFinancialProfile } from '../types';

export const MOCK_USER_PROFILE: UserFinancialProfile = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  createdAt: '2024-03-15',
  accounts: {
    checking: {
      id: 'acc-001',
      name: 'Primary Checking',
      balance: 8450.32,
      institution: 'Chase Bank',
      lastUpdated: '2025-12-10'
    },
    savings: {
      id: 'acc-002',
      name: 'High-Yield Savings',
      balance: 24680.00,
      interestRate: 4.5,
      institution: 'Marcus by Goldman Sachs',
      lastUpdated: '2025-12-10'
    },
    investment: {
      id: 'acc-003',
      name: 'Brokerage Account',
      balance: 45230.88,
      ytdReturn: 12.4,
      institution: 'Fidelity',
      lastUpdated: '2025-12-10'
    },
    retirement: {
      id: 'acc-004',
      name: '401(k)',
      balance: 67890.50,
      ytdContribution: 15600,
      employerMatch: 4800,
      institution: 'Vanguard',
      lastUpdated: '2025-12-10'
    }
  },
  monthlyIncome: 7500,
  monthlyExpenses: {
    housing: 2100,
    utilities: 170,
    groceries: 425,
    transportation: 380,
    subscriptions: 25.20,
    insurance: 245,
    dining: 320,
    entertainment: 180,
    other: 420
  },
  creditScore: 742,
  riskTolerance: 'moderate'
};

export const INITIAL_GOALS: Goal[] = [
  {
    id: 1,
    name: "Car Down Payment",
    currentAmount: 4332,
    targetAmount: 4332,
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
    targetAmount: 500000,
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
  { id: 'i1', name: 'House Loan', value: (31000 / 500000) * 100, currentAmount: 31000, targetAmount: 500000 },
  { id: 'i2', name: 'Student Loan', value: (45000 / 50000) * 100, currentAmount: 45000, targetAmount: 50000 },
  { id: 'i3', name: 'Car Down Payment', value: (4332 / 4332) * 100, currentAmount: 4332, targetAmount: 4332 },
  { id: 'i4', name: 'Utilities', value: (170 / 200) * 100, currentAmount: 170, targetAmount: 200 },
  { id: 'i5', name: 'Groceries', value: (425 / 500) * 100, currentAmount: 425, targetAmount: 500 },
  { id: 'i6', name: 'Subscriptions', value: (25.2 / 35) * 100, currentAmount: 25.2, targetAmount: 35 },
  { id: 'i7', name: 'Vacation Fund', value: (5700 / 6000) * 100, currentAmount: 5700, targetAmount: 6000 },
  { id: 'i8', name: 'Emergency Fund', value: (9750 / 15000) * 100, currentAmount: 9750, targetAmount: 15000 },
  { id: 'i9', name: 'Investments', value: (5000 / 10000) * 100, currentAmount: 5000, targetAmount: 10000 },
];

export const MOCK_SAVED_SCENARIOS: Scenario[] = [
  { id: 's1', name: 'Aggressive Savings Plan', description: 'Increase monthly savings by cutting discretionary spending', category: 'savings' },
  { id: 's2', name: 'Early Retirement Study', description: 'Analyze path to retire 5 years early', category: 'investment' },
  { id: 's3', name: 'New House Purchase', description: 'Impact of purchasing a $450k home', category: 'expense' },
];

export const MOCK_PRESET_SCENARIOS: Scenario[] = [
  { id: 'p1', name: 'Market Crash (30%)', description: 'Simulate a 30% market downturn on investments', category: 'emergency' },
  { id: 'p2', name: 'High Inflation (10%)', description: 'Impact of sustained 10% inflation', category: 'emergency' },
  { id: 'p3', name: 'Windfall (10k)', description: 'Unexpected $10,000 bonus or inheritance', category: 'investment' },
  { id: 'p4', name: 'Job Loss (6 months)', description: 'Losing income for 6 months', category: 'emergency' },
  { id: 'p5', name: 'Medical Emergency ($15k)', description: 'Unexpected medical expense', category: 'emergency' },
];

export const MOCK_SCENARIO_RESULTS: ImpactItem[] = [
  { id: 'r1', name: 'Projected Balance', value: 85 },
  { id: 'r2', name: 'Retirement Goal', value: 60 },
  { id: 'r3', name: 'Emergency Fund', value: 75 },
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 'rec1', text: 'Increase 401k contribution by 2% ($768.90/month)', checked: false, impact: 9227, priority: 'high' },
  { id: 'rec2', text: 'Move 15% of balance ($5,766.77) to high-yield savings', checked: true, impact: 259, priority: 'medium' },
  { id: 'rec3', text: 'Delay vacation goal by 6 months', checked: false, impact: 3600, priority: 'low' },
  { id: 'rec4', text: 'Rebalance investment portfolio to match risk tolerance', checked: false, impact: 2100, priority: 'medium' },
  { id: 'rec5', text: 'Consolidate student loans for lower interest rate', checked: false, impact: 4200, priority: 'high' },
];

// Helper function to calculate total net worth
export const calculateNetWorth = (): number => {
  const accounts = MOCK_USER_PROFILE.accounts;
  return accounts.checking.balance + accounts.savings.balance + 
         accounts.investment.balance + accounts.retirement.balance;
};

// Helper function to calculate monthly savings potential
export const calculateMonthlySavings = (): number => {
  const totalExpenses = Object.values(MOCK_USER_PROFILE.monthlyExpenses).reduce((a, b) => a + b, 0);
  return MOCK_USER_PROFILE.monthlyIncome - totalExpenses;
};

// Helper function to calculate savings rate
export const calculateSavingsRate = (): number => {
  const savings = calculateMonthlySavings();
  return (savings / MOCK_USER_PROFILE.monthlyIncome) * 100;
};
