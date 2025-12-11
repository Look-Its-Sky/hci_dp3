import type { Goal, ImpactItem, Scenario, Recommendation, UserFinancialProfile } from '../types';

// Valid login credentials
export const VALID_LOGINS = [
  { username: 'admin', password: 'admin', userId: 'user-001' },
  { username: 'demo', password: 'demo', userId: 'user-002' },
];

// User 1: Alex Johnson - Higher income, moderate risk
const USER_ALEX: UserFinancialProfile = {
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
  riskTolerance: 'moderate',
  goals: [
    { id: 'g1', name: 'House Loan', currentAmount: 31000, targetAmount: 500000 },
    { id: 'g2', name: 'Student Loan', currentAmount: 45000, targetAmount: 50000 },
    { id: 'g3', name: 'Car Down Payment', currentAmount: 4332, targetAmount: 4332 },
    { id: 'g4', name: 'Vacation Fund', currentAmount: 5700, targetAmount: 6000 },
    { id: 'g5', name: 'Emergency Fund', currentAmount: 9750, targetAmount: 15000 },
    { id: 'g6', name: 'Investments', currentAmount: 5000, targetAmount: 10000 },
  ],
  scenarioHistory: []
};

// User 2: Jamie Smith - Lower income, aggressive risk, different goals
const USER_JAMIE: UserFinancialProfile = {
  id: 'user-002',
  name: 'Jamie Smith',
  email: 'jamie.smith@email.com',
  createdAt: '2024-06-20',
  accounts: {
    checking: {
      id: 'acc-005',
      name: 'Checking Account',
      balance: 3250.75,
      institution: 'Bank of America',
      lastUpdated: '2025-12-10'
    },
    savings: {
      id: 'acc-006',
      name: 'Savings Account',
      balance: 8500.00,
      interestRate: 3.8,
      institution: 'Ally Bank',
      lastUpdated: '2025-12-10'
    },
    investment: {
      id: 'acc-007',
      name: 'Robinhood',
      balance: 12450.22,
      ytdReturn: 18.2,
      institution: 'Robinhood',
      lastUpdated: '2025-12-10'
    },
    retirement: {
      id: 'acc-008',
      name: 'Roth IRA',
      balance: 22340.00,
      ytdContribution: 6500,
      employerMatch: 0,
      institution: 'Charles Schwab',
      lastUpdated: '2025-12-10'
    }
  },
  monthlyIncome: 4800,
  monthlyExpenses: {
    housing: 1400,
    utilities: 120,
    groceries: 350,
    transportation: 280,
    subscriptions: 65.00,
    insurance: 180,
    dining: 200,
    entertainment: 150,
    other: 300
  },
  creditScore: 698,
  riskTolerance: 'aggressive',
  goals: [
    { id: 'g7', name: 'Emergency Fund', currentAmount: 3200, targetAmount: 10000 },
    { id: 'g8', name: 'New Laptop', currentAmount: 800, targetAmount: 2000 },
    { id: 'g9', name: 'Vacation Fund', currentAmount: 1500, targetAmount: 3000 },
    { id: 'g10', name: 'Student Loan', currentAmount: 18000, targetAmount: 25000 },
    { id: 'g11', name: 'Side Business', currentAmount: 2500, targetAmount: 5000 },
  ],
  scenarioHistory: []
};

// Export user profiles map
export const USER_PROFILES: Record<string, UserFinancialProfile> = {
  'user-001': USER_ALEX,
  'user-002': USER_JAMIE,
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
    id: 'g3',
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

// Helper functions that work with any user profile
export const calculateNetWorthForUser = (user: UserFinancialProfile): number => {
  const accounts = user.accounts;
  return accounts.checking.balance + accounts.savings.balance + 
         accounts.investment.balance + accounts.retirement.balance;
};

export const calculateMonthlySavingsForUser = (user: UserFinancialProfile): number => {
  const totalExpenses = Object.values(user.monthlyExpenses).reduce((a, b) => a + b, 0);
  return user.monthlyIncome - totalExpenses;
};

export const calculateSavingsRateForUser = (user: UserFinancialProfile): number => {
  const savings = calculateMonthlySavingsForUser(user);
  return (savings / user.monthlyIncome) * 100;
};

// Generate dynamic recommendations based on scenario, user profile, and goals
export const generateRecommendations = (
  user: UserFinancialProfile,
  scenarioTitle: string,
  scenarioCost: number,
  projectedBalance: number
): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const netWorth = calculateNetWorthForUser(user);
  const monthlySavings = calculateMonthlySavingsForUser(user);
  const savingsRate = calculateSavingsRateForUser(user);
  const totalExpenses = Object.values(user.monthlyExpenses).reduce((a, b) => a + b, 0);
  
  const emergencyFundMonths = user.accounts.savings.balance / totalExpenses;
  
  if (emergencyFundMonths < 6) {
    const targetEmergency = totalExpenses * 6;
    const needed = targetEmergency - user.accounts.savings.balance;
    recommendations.push({
      id: `rec-emergency-${Date.now()}`,
      text: `Build emergency fund to 6 months (add ${formatCurrencySimple(needed)} to savings)`,
      checked: false,
      impact: Math.round(needed * 0.045), // Interest earned
      priority: emergencyFundMonths < 3 ? 'high' : 'medium'
    });
  }

  // Scenario-specific recommendations
  if (scenarioTitle.toLowerCase().includes('market crash') || scenarioTitle.toLowerCase().includes('crash')) {
    recommendations.push({
      id: `rec-crash-1-${Date.now()}`,
      text: 'Hold investments and avoid panic selling during downturn',
      checked: false,
      impact: Math.round(user.accounts.investment.balance * 0.15),
      priority: 'high'
    });
    recommendations.push({
      id: `rec-crash-2-${Date.now()}`,
      text: 'Consider dollar-cost averaging into the market during dip',
      checked: false,
      impact: Math.round(monthlySavings * 3),
      priority: 'medium'
    });
  }

  if (scenarioTitle.toLowerCase().includes('inflation')) {
    recommendations.push({
      id: `rec-inflation-1-${Date.now()}`,
      text: 'Move excess cash to I-Bonds or TIPS for inflation protection',
      checked: false,
      impact: Math.round(user.accounts.savings.balance * 0.03),
      priority: 'high'
    });
    recommendations.push({
      id: `rec-inflation-2-${Date.now()}`,
      text: `Reduce discretionary spending by 10% (save ${formatCurrencySimple((user.monthlyExpenses.dining + user.monthlyExpenses.entertainment) * 0.1)}/mo)`,
      checked: false,
      impact: Math.round((user.monthlyExpenses.dining + user.monthlyExpenses.entertainment) * 0.1 * 12),
      priority: 'medium'
    });
  }

  if (scenarioTitle.toLowerCase().includes('job loss')) {
    recommendations.push({
      id: `rec-job-1-${Date.now()}`,
      text: 'Cut all non-essential subscriptions immediately',
      checked: false,
      impact: Math.round(user.monthlyExpenses.subscriptions * 6),
      priority: 'high'
    });
    recommendations.push({
      id: `rec-job-2-${Date.now()}`,
      text: 'Apply for unemployment benefits',
      checked: false,
      impact: Math.round(user.monthlyIncome * 0.4 * 6),
      priority: 'high'
    });
    recommendations.push({
      id: `rec-job-3-${Date.now()}`,
      text: 'Reduce dining out and entertainment by 75%',
      checked: false,
      impact: Math.round((user.monthlyExpenses.dining + user.monthlyExpenses.entertainment) * 0.75 * 6),
      priority: 'medium'
    });
  }

  if (scenarioTitle.toLowerCase().includes('windfall') || scenarioCost < 0) {
    const windfall = Math.abs(scenarioCost);
    recommendations.push({
      id: `rec-windfall-1-${Date.now()}`,
      text: `Put 50% (${formatCurrencySimple(windfall * 0.5)}) toward highest priority goal`,
      checked: false,
      impact: Math.round(windfall * 0.5 * 0.07),
      priority: 'high'
    });
    recommendations.push({
      id: `rec-windfall-2-${Date.now()}`,
      text: `Invest 30% (${formatCurrencySimple(windfall * 0.3)}) in diversified index funds`,
      checked: false,
      impact: Math.round(windfall * 0.3 * 0.1),
      priority: 'medium'
    });
    recommendations.push({
      id: `rec-windfall-3-${Date.now()}`,
      text: `Keep 20% (${formatCurrencySimple(windfall * 0.2)}) for enjoyment or short-term needs`,
      checked: false,
      impact: 0,
      priority: 'low'
    });
  }

  if (scenarioTitle.toLowerCase().includes('medical') || scenarioTitle.toLowerCase().includes('emergency')) {
    recommendations.push({
      id: `rec-medical-1-${Date.now()}`,
      text: 'Negotiate payment plan with medical provider',
      checked: false,
      impact: Math.round(scenarioCost * 0.1),
      priority: 'high'
    });
    recommendations.push({
      id: `rec-medical-2-${Date.now()}`,
      text: 'Review and potentially increase health insurance coverage',
      checked: false,
      impact: Math.round(scenarioCost * 0.5),
      priority: 'medium'
    });
  }

  if (scenarioTitle.toLowerCase().includes('house') || scenarioTitle.toLowerCase().includes('purchase')) {
    recommendations.push({
      id: `rec-house-1-${Date.now()}`,
      text: 'Ensure 20% down payment to avoid PMI',
      checked: false,
      impact: Math.round(scenarioCost * 0.01 * 30),
      priority: 'high'
    });
    recommendations.push({
      id: `rec-house-2-${Date.now()}`,
      text: 'Shop around for best mortgage rates (could save 0.5%)',
      checked: false,
      impact: Math.round(scenarioCost * 0.005 * 30),
      priority: 'high'
    });
  }

  // General financial health recommendations based on user profile
  if (savingsRate < 20) {
    recommendations.push({
      id: `rec-savings-${Date.now()}`,
      text: `Increase savings rate from ${savingsRate.toFixed(0)}% to 20% (+${formatCurrencySimple((0.20 - savingsRate/100) * user.monthlyIncome)}/mo)`,
      checked: false,
      impact: Math.round((0.20 - savingsRate/100) * user.monthlyIncome * 12),
      priority: savingsRate < 10 ? 'high' : 'medium'
    });
  }

  // Retirement contribution check
  if (user.accounts.retirement.ytdContribution && user.accounts.retirement.ytdContribution < 23000) {
    const canAdd = 23000 - user.accounts.retirement.ytdContribution;
    recommendations.push({
      id: `rec-401k-${Date.now()}`,
      text: `Max out 401(k) contribution (${formatCurrencySimple(canAdd)} remaining this year)`,
      checked: false,
      impact: Math.round(canAdd * 0.25), // Tax savings estimate
      priority: 'medium'
    });
  }

  // Risk tolerance based recommendations
  if (user.riskTolerance === 'conservative' && user.accounts.investment.balance > netWorth * 0.3) {
    recommendations.push({
      id: `rec-risk-${Date.now()}`,
      text: 'Rebalance portfolio to match conservative risk tolerance (more bonds)',
      checked: false,
      impact: Math.round(user.accounts.investment.balance * 0.02),
      priority: 'medium'
    });
  }

  if (user.riskTolerance === 'aggressive' && user.accounts.savings.balance > totalExpenses * 6) {
    const excess = user.accounts.savings.balance - (totalExpenses * 6);
    recommendations.push({
      id: `rec-invest-${Date.now()}`,
      text: `Move excess savings (${formatCurrencySimple(excess)}) to investments for higher returns`,
      checked: false,
      impact: Math.round(excess * 0.06),
      priority: 'medium'
    });
  }

  // Ensure we have at least 3 recommendations
  if (recommendations.length < 3) {
    if (user.creditScore < 750) {
      recommendations.push({
        id: `rec-credit-${Date.now()}`,
        text: 'Improve credit score to 750+ for better loan rates',
        checked: false,
        impact: Math.round(netWorth * 0.005),
        priority: 'low'
      });
    }
    recommendations.push({
      id: `rec-review-${Date.now()}`,
      text: 'Review and cancel unused subscriptions',
      checked: false,
      impact: Math.round(user.monthlyExpenses.subscriptions * 0.3 * 12),
      priority: 'low'
    });
  }

  return recommendations.slice(0, 6); // Return max 6 recommendations
};

// Simple currency formatter for recommendations
const formatCurrencySimple = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Legacy exports for backward compatibility
export const MOCK_USER_PROFILE = USER_ALEX;
export const calculateNetWorth = () => calculateNetWorthForUser(USER_ALEX);
export const calculateMonthlySavings = () => calculateMonthlySavingsForUser(USER_ALEX);
export const calculateSavingsRate = () => calculateSavingsRateForUser(USER_ALEX);

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 'rec1', text: 'Increase 401k contribution by 2% ($768.90/month)', checked: false, impact: 9227, priority: 'high' },
  { id: 'rec2', text: 'Move 15% of balance ($5,766.77) to high-yield savings', checked: true, impact: 259, priority: 'medium' },
  { id: 'rec3', text: 'Delay vacation goal by 6 months', checked: false, impact: 3600, priority: 'low' },
  { id: 'rec4', text: 'Rebalance investment portfolio to match risk tolerance', checked: false, impact: 2100, priority: 'medium' },
  { id: 'rec5', text: 'Consolidate student loans for lower interest rate', checked: false, impact: 4200, priority: 'high' },
];
