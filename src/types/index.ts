// --- Type Definitions ---
export interface Contribution {
  id: string;
  date: string;
  amount: number;
}

export interface Goal {
  id: number | string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  completed: boolean;
  contributions: Contribution[];
}

export interface ImpactItem {
  id: string;
  name: string;
  value: number; // Represents a value 0-100 for the bar width
  currentAmount?: number;
  targetAmount?: number;
}

export interface Scenario {
  id: string;
  name: string;
  description?: string;
  category?: 'savings' | 'investment' | 'expense' | 'emergency' | 'custom';
}

export interface Recommendation {
  id: string;
  text: string;
  checked: boolean;
  impact?: number; // Estimated impact amount
  priority: 'high' | 'medium' | 'low' | string;
}

// New type for the create scenario form data
export interface NewScenarioData {
  title: string;
  impactPeriod: string;
  totalCost: number;
  costEachPeriod: number;
  periodUnit: string;
}

// User financial profile types
export interface BankAccount {
  id: string;
  name: string;
  balance: number;
  institution: string;
  lastUpdated: string;
  interestRate?: number;
  ytdReturn?: number;
  ytdContribution?: number;
  employerMatch?: number;
}

export interface UserFinancialProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  accounts: {
    checking: BankAccount;
    savings: BankAccount;
    investment: BankAccount;
    retirement: BankAccount;
  };
  monthlyIncome: number;
  monthlyExpenses: {
    housing: number;
    utilities: number;
    groceries: number;
    transportation: number;
    subscriptions: number;
    insurance: number;
    dining: number;
    entertainment: number;
    other: number;
  };
  creditScore: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

// Scenario results with before/after comparison
export interface ScenarioResult {
  id: string;
  scenarioTitle: string;
  runDate: string;
  beforeState: {
    totalEquity: number;
    monthlyExpenses: number;
    savingsRate: number;
  };
  afterState: {
    totalEquity: number;
    monthlyExpenses: number;
    savingsRate: number;
    projectedEquity1Year: number;
    projectedEquity5Year: number;
  };
  recommendations: Recommendation[];
}

export type PageName = 'MY GOALS' | 'HOME' | 'SCENARIOS';
