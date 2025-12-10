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
}

export interface Recommendation {
  id: string;
  text: string;
  checked: boolean;
}

// New type for the create scenario form data
export interface NewScenarioData {
  title: string;
  impactPeriod: string;
  totalCost: number;
  costEachPeriod: number;
  periodUnit: string;
}

export type PageName = 'MY GOALS' | 'HOME' | 'SCENARIOS';
