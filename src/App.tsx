import React, { useState, FC, FormEvent } from 'react';

// --- Type Definitions ---
interface Contribution {
  id: string;
  date: string;
  amount: number;
}

interface Goal {
  id: number | string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  completed: boolean;
  contributions: Contribution[];
}

interface ImpactItem {
  id: string;
  name: string;
  value: number; // Represents a value 0-100 for the bar width
}

interface Scenario {
  id: string;
  name: string;
}

interface Recommendation {
  id: string;
  text: string;
  checked: boolean;
}

// New type for the create scenario form data
interface NewScenarioData {
  title: string;
  impactPeriod: string;
  totalCost: number;
  costEachPeriod: number;
  periodUnit: string;
}

type PageName = 'MY GOALS' | 'HOME' | 'SCENARIOS';

// --- Mock Data ---
const INITIAL_GOALS: Goal[] = [
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

const MOCK_IMPACT_DATA: ImpactItem[] = [
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

const MOCK_SAVED_SCENARIOS: Scenario[] = [
  { id: 's1', name: 'Aggressive Savings Plan' },
  { id: 's2', name: 'Early Retirement Study' },
  { id: 's3', name: 'New House Purchase' },
];

const MOCK_PRESET_SCENARIOS: Scenario[] = [
  { id: 'p1', name: 'Market Crash (30%)' },
  { id: 'p2', name: 'High Inflation (10%)' },
  { id: 'p3', name: 'Windfall (10k)' },
];

const MOCK_SCENARIO_RESULTS: ImpactItem[] = [
  { id: 'r1', name: 'Projected Balance', value: 85 },
  { id: 'r2', name: 'Retirement Goal', value: 60 },
  { id: 'r3', name: 'Emergency Fund', value: 75 },
];

const MOCK_RECOMMENDATIONS: Recommendation[] = [
  { id: 'rec1', text: 'Increase 401k contribution by 2%', checked: false },
  { id: 'rec2', text: 'Move $5,000 to high-yield savings', checked: true },
  { id: 'rec3', text: 'Delay vacation goal by 6 months', checked: false },
  { id: 'rec4', text: 'Rebalance investment portfolio', checked: false },
  { id: 'rec5', text: 'Consolidate student loans', checked: false },
];


// --- Helper Functions ---
/**
 * Formats a number as USD currency.
 * @param {number} amount - The number to format.
 * @returns {string} - The formatted currency string.
 */
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });
};

// --- SVG Icons ---
const PlusIcon: FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" style={{ width: '1.5rem', height: '1.5rem' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

interface ChevronDownIconProps {
  className?: string; // We'll use this for rotation
}

const ChevronDownIcon: FC<ChevronDownIconProps> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className} style={{ width: '1rem', height: '1rem', marginLeft: '0.375rem', transition: 'transform 0.3s' }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
  </svg>
);


// --- Global Styles Component ---
/**
 * This component injects all the application's styles into a <style> tag.
 * It contains MERGED styles from all application pages.
 */
const GlobalStyles: FC = () => (
  <style>{`
    /* --- Base & Body --- */
    :root {
      --indigo-600: #4f46e5;
      --indigo-700: #4338ca;
      --indigo-100: #e0e7ff;
      --blue-600: #2563eb;
      --gray-50: #f9fafb;
      --gray-100: #f3f4f6;
      --gray-200: #e5e7eb;
      --gray-300: #d1d5db;
      --gray-400: #9ca3af;
      --gray-500: #6b7280;
      --gray-600: #4b5563;
      --gray-700: #374151;
      --gray-800: #1f2937;
      --gray-900: #11182c;
      --green-500: #22c55e;
      --white: #ffffff;
      --black: #000000;

      /* Colors for the bar chart */
      --bar-color-1: #4f46e5;
      --bar-color-2: #3b82f6;
      --bar-color-3: #10b981;
      --bar-color-4: #f59e0b;
      --bar-color-5: #ec4899;
    }

    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      min-height: 100vh;
      background-color: var(--gray-50);
      color: var(--gray-900);
    }
    
    * {
      box-sizing: border-box;
    }

    /* --- App Layout --- */
    .app-main {
      max-width: 56rem; /* 896px */
      margin-left: auto;
      margin-right: auto;
      padding: 1.5rem; /* 24px */
    }

    @media (min-width: 640px) {
      .app-main {
        padding: 1.5rem;
      }
    }
    @media (min-width: 1024px) {
      .app-main {
        padding: 2rem;
      }
    }

    /* --- Header --- */
    .header-nav {
      background-color: var(--white);
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      width: 100%;
    }
    .header-container {
      max-width: 56rem;
      margin-left: auto;
      margin-right: auto;
      padding-left: 1rem;
      padding-right: 1rem;
    }
    .header-links {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 4rem; /* 64px */
      gap: 2rem; /* 32px */
    }
    .header-links a {
      font-family: Inter, sans-serif;
      font-weight: 500;
      font-size: 0.875rem; /* 14px */
      letter-spacing: 0.025em;
      text-decoration: none;
      color: var(--gray-500);
      padding: 1.4rem 0; /* Use padding for a larger click area */
      border-bottom: 2px solid transparent; /* Placeholder for active state */
      cursor: pointer;
    }
    .header-links a:hover {
      color: var(--gray-700);
    }
    .header-links a.active {
      color: var(--indigo-600);
      border-bottom: 2px solid var(--indigo-600);
    }

    /* --- Page Title Header --- */
    .title-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem; /* 24px */
    }
    .title-header h1 {
      font-size: 1.875rem; /* 30px */
      font-weight: 700;
      color: var(--gray-800);
      margin: 0;
    }
    /* Specific for centered HOME/SCENARIOS title */
    .title-header.centered {
      justify-content: center;
      text-align: center;
    }

    /* --- Add Goal Button (MY GOALS page) --- */
    .add-goal-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem; /* 8px */
      background-color: var(--indigo-600);
      color: var(--white);
      border: none;
      border-radius: 9999px; /* full */
      cursor: pointer;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      transition: background-color 0.3s;
    }
    .add-goal-btn:hover {
      background-color: var(--indigo-700);
    }

    /* --- Balance Card (MY GOALS page) --- */
    .balance-card-gradient {
      background-image: linear-gradient(to right, var(--indigo-700), var(--blue-600));
      color: var(--white);
      padding: 1.5rem; /* 24px */
      border-radius: 0.75rem; /* 12px */
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      margin-bottom: 2rem; /* 32px */
    }
    .balance-card-gradient h2 {
      font-size: 1.125rem; /* 18px */
      font-weight: 500;
      color: var(--indigo-100);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }
    .balance-card-gradient p {
      font-size: 2.25rem; /* 36px */
      font-weight: 800;
      margin: 0.5rem 0 0 0;
    }

    /* --- Balance Card (HOME/SCENARIOS page) --- */
    .balance-card-simple {
      text-align: center;
      margin-bottom: 2rem;
    }
    .balance-card-simple h2 {
      font-size: 1.125rem; /* 18px */
      font-weight: 500;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin: 0;
    }
    .balance-card-simple p {
      font-size: 2.75rem; /* 44px */
      font-weight: 800;
      color: var(--gray-900);
      margin: 0.5rem 0 0 0;
    }

    /* --- Goal Item (MY GOALS page) --- */
    .goal-item {
      background-color: var(--white);
      padding: 1.5rem;
      border-radius: 0.75rem; /* 12px */
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      margin-bottom: 1rem; /* 16px */
      transition: all 0.3s;
    }
    .goal-item-header {
      display: flex;
      align-items: center;
    }
    .goal-item-header input[type="checkbox"] {
      height: 1.5rem; /* 24px */
      width: 1.5rem; /* 24px */
      color: var(--indigo-600);
      border-color: var(--gray-300);
      border-radius: 0.25rem;
      cursor: pointer;
    }
    .goal-item-header h2 {
      font-size: 1.25rem; /* 20px */
      font-weight: 600;
      margin: 0 0 0 1rem; /* 16px */
      color: var(--gray-800);
    }
    .goal-item-header h2.completed {
      color: var(--gray-400);
      text-decoration: line-through;
    }
    .goal-progress {
      margin-top: 1.25rem; /* 20px */
    }
    .goal-progress-text {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem; /* 14px */
      font-weight: 500;
      color: var(--gray-600);
      margin-bottom: 0.25rem; /* 4px */
    }
    .goal-progress-text span:last-child {
      color: var(--gray-500);
    }
    .progress-bar-bg {
      width: 100%;
      background-color: var(--gray-200);
      border-radius: 9999px;
      height: 0.75rem; /* 12px */
      overflow: hidden;
    }
    .progress-bar-inner {
      height: 0.75rem;
      border-radius: 9999px;
      background-color: var(--indigo-600);
      transition: all 0.5s;
    }
    .progress-bar-inner.completed {
      background-color: var(--green-500);
    }
    .contributions-toggle {
      margin-top: 1.25rem; /* 20px */
      text-align: right;
    }
    .contributions-toggle button {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      width: 100%;
      font-size: 0.875rem; /* 14px */
      font-weight: 500;
      color: var(--indigo-600);
      background: none;
      border: none;
      cursor: pointer;
    }
    .contributions-toggle button:hover {
      color: var(--indigo-700);
    }
    .contributions-toggle .rotate-180 {
      transform: rotate(180deg);
    }
    .contributions-list {
      margin-top: 1rem; /* 16px */
      padding-top: 1rem; /* 16px */
      border-top: 1px solid var(--gray-200);
    }
    .contributions-list h4 {
      font-size: 0.875rem; /* 14px */
      font-weight: 600;
      color: var(--gray-700);
      margin: 0 0 0.75rem 0;
    }
    .contributions-list ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem; /* 8px */
    }
    .contributions-list li {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: var(--gray-600);
    }
    .contributions-list li span:last-child {
      font-weight: 500;
    }
    .contributions-list p {
      font-size: 0.875rem;
      color: var(--gray-500);
      margin: 0;
    }

    /* --- Modal (MY GOALS page) --- */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.6);
      z-index: 40;
    }
    .modal-panel {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: var(--white);
      border-radius: 0.75rem; /* 12px */
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 2rem;
      z-index: 50;
      width: 91.666667%; /* 11/12 */
      max-width: 28rem; /* 448px */
    }
    .modal-panel h2 {
      font-size: 1.5rem; /* 24px */
      font-weight: 700;
      color: var(--gray-900);
      margin: 0 0 1.5rem 0;
    }
    .modal-form .form-group {
      margin-bottom: 1.25rem; /* 20px */
    }
    .modal-form label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--gray-700);
      margin-bottom: 0.25rem; /* 4px */
    }
    .modal-form input[type="text"],
    .modal-form input[type="number"] {
      width: 100%;
      padding: 0.5rem 1rem; /* 8px 16px */
      border: 1px solid var(--gray-300);
      border-radius: 0.5rem; /* 8px */
    }
    .modal-form input[type="text"]:focus,
    .modal-form input[type="number"]:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      border-color: var(--indigo-500);
      box-shadow: 0 0 0 2px var(--indigo-500);
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem; /* 16px */
      margin-top: 2rem; /* 32px */
    }
    .modal-actions button {
      padding: 0.5rem 1.25rem; /* 8px 20px */
      font-size: 0.875rem;
      font-weight: 500;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
    }
    .modal-btn-cancel {
      color: var(--gray-700);
      background-color: var(--gray-100);
    }
    .modal-btn-cancel:hover {
      background-color: var(--gray-200);
    }
    .modal-btn-submit {
      color: var(--white);
      background-color: var(--indigo-600);
    }
    .modal-btn-submit:hover {
      background-color: var(--indigo-700);
    }
    
    /* --- Create Scenario Modal Form --- */
    /* Use existing modal styles but add support for select */
    .modal-form .scenario-select {
      font-size: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--gray-300);
      border-radius: 0.5rem;
      background-color: var(--gray-50);
      color: var(--gray-800);
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E');
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1.25em 1.25em;
      cursor: pointer;
      width: 100%; /* Make select full-width */
    }

    /* --- Impact Summary Card (HOME page) --- */
    .impact-card {
      background-color: var(--white);
      padding: 1.5rem;
      border-radius: 0.75rem; /* 12px */
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .impact-card h3 {
      font-size: 1.25rem; /* 20px */
      font-weight: 600;
      color: var(--gray-800);
      margin: 0 0 1.5rem 0;
    }
    .impact-list-container {
      max-height: 300px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--gray-300) var(--gray-100);
    }
    .impact-list-container::-webkit-scrollbar {
      width: 8px;
    }
    .impact-list-container::-webkit-scrollbar-track {
      background: var(--gray-100);
      border-radius: 4px;
    }
    .impact-list-container::-webkit-scrollbar-thumb {
      background-color: var(--gray-300);
      border-radius: 4px;
    }
    .impact-list-container::-webkit-scrollbar-thumb:hover {
      background-color: var(--gray-400);
    }
    .impact-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1.25rem; /* 20px */
      padding-right: 10px; /* Space for scrollbar */
    }
    .impact-item {
      display: flex;
      align-items: center;
      gap: 0.75rem; /* 12px */
    }
    .impact-item-bullet {
      font-size: 1.5rem;
      line-height: 1;
      color: var(--gray-400);
    }
    .impact-item-bar-container {
      flex: 1;
    }
    .impact-item-label {
      font-size: 0.875rem; /* 14px */
      font-weight: 500;
      color: var(--gray-600);
      margin-bottom: 0.25rem; /* 4px */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .impact-bar-bg {
      width: 100%;
      background-color: var(--gray-200);
      border-radius: 9999px;
      height: 0.75rem; /* 12px */
      overflow: hidden;
    }
    .impact-bar-inner {
      height: 100%;
      border-radius: 9999px;
      transition: width 0.5s ease-out;
    }
    .impact-bar-inner.color-1 { background-color: var(--bar-color-1); }
    .impact-bar-inner.color-2 { background-color: var(--bar-color-2); }
    .impact-bar-inner.color-3 { background-color: var(--bar-color-3); }
    .impact-bar-inner.color-4 { background-color: var(--bar-color-4); }
    .impact-bar-inner.color-5 { background-color: var(--bar-color-5); }
    
    /* --- Scenario Page (SCENARIOS page) --- */
    .scenario-container {
      background-color: var(--white);
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .scenario-select-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .scenario-select-group label {
      font-size: 1.125rem; /* 18px */
      font-weight: 500;
      color: var(--gray-700);
    }
    .scenario-select {
      font-size: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--gray-300);
      border-radius: 0.5rem;
      background-color: var(--gray-50);
      color: var(--gray-800);
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E');
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1.25em 1.25em;
      cursor: pointer;
    }
    .scenario-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    .scenario-button {
      font-size: 1rem;
      font-weight: 600;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.3s, box-shadow 0.3s;
      background-color: var(--gray-800);
      color: var(--white);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .scenario-button:hover {
      background-color: var(--gray-900);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }
    /* Button for secondary action */
    .scenario-button.secondary {
      background-color: var(--gray-200);
      color: var(--gray-800);
    }
    .scenario-button.secondary:hover {
      background-color: var(--gray-300);
    }

    /* Responsive layout for scenario buttons */
    @media (min-width: 640px) {
      .scenario-actions {
        flex-direction: row;
        justify-content: space-between;
      }
      .scenario-button {
        flex: 1;
      }
    }
    
    /* --- Recommendations List (SCENARIOS result page) --- */
    .recommendation-card {
      background-color: var(--white);
      padding: 1.5rem;
      border-radius: 0.75rem; /* 12px */
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      margin-top: 2rem;
    }
    .recommendation-card h3 {
      font-size: 1.25rem; /* 20px */
      font-weight: 600;
      color: var(--gray-800);
      margin: 0 0 1.5rem 0;
    }
    .recommendation-list-container {
      max-height: 250px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--gray-300) var(--gray-100);
    }
    .recommendation-list-container::-webkit-scrollbar {
      width: 8px;
    }
    .recommendation-list-container::-webkit-scrollbar-track {
      background: var(--gray-100);
      border-radius: 4px;
    }
    .recommendation-list-container::-webkit-scrollbar-thumb {
      background-color: var(--gray-300);
      border-radius: 4px;
    }
    .recommendation-list-container::-webkit-scrollbar-thumb:hover {
      background-color: var(--gray-400);
    }
    .recommendation-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem; /* 16px */
      padding-right: 10px; /* Space for scrollbar */
    }
    .recommendation-item {
      display: flex;
      align-items: center;
      gap: 0.75rem; /* 12px */
    }
    .recommendation-item input[type="checkbox"] {
      height: 1.25rem; /* 20px */
      width: 1.25rem; /* 20px */
      color: var(--indigo-600);
      border-color: var(--gray-300);
      border-radius: 0.25rem;
      cursor: pointer;
      flex-shrink: 0;
    }
    .recommendation-item label {
      font-size: 1rem; /* 16px */
      font-weight: 500;
      color: var(--gray-700);
      cursor: pointer;
    }
    .recommendation-actions {
      margin-top: 1.5rem; /* 24px */
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    /* Responsive layout for recommendation buttons */
    @media (min-width: 640px) {
      .recommendation-actions {
        flex-direction: row-reverse;
      }
    }
  `}</style>
);


// --- Shared Components ---

/**
 * Header Navigation Bar
 * This component is now controlled by App.tsx
 */
interface HeaderProps {
  activeLink: PageName;
  onNavigate: (page: PageName) => void;
}

const Header: FC<HeaderProps> = ({ activeLink, onNavigate }) => {
  const links: PageName[] = ["MY GOALS", "HOME", "SCENARIOS"];

  return (
    <nav className="header-nav">
      <div className="header-container">
        <div className="header-links">
            {links.map((link) => (
              <a
                key={link}
                // Use onClick to change the state in the parent App
                onClick={() => onNavigate(link)}
                className={link === activeLink ? 'active' : ''}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
    </nav>
  );
};

// --- Page-Specific Components ---

//
// --- 1. MY GOALS PAGE ---
//
const GoalItem: FC<{ goal: Goal, onToggleComplete: (id: number | string) => void }> = ({ goal, onToggleComplete }) => {
  const [showContributions, setShowContributions] = useState(false);
  const progressPercent = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  return (
    <div className="goal-item">
      <div className="goal-item-header">
        <input
          type="checkbox"
          checked={goal.completed}
          onChange={() => onToggleComplete(goal.id)}
          aria-label={`Mark ${goal.name} as complete`}
        />
        <h2 className={goal.completed ? 'completed' : ''}>
          {goal.name}
        </h2>
      </div>
      <div className="goal-progress">
        <div className="goal-progress-text">
          <span>{formatCurrency(goal.currentAmount)}</span>
          <span>{formatCurrency(goal.targetAmount)}</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className={`progress-bar-inner ${goal.completed ? 'completed' : ''}`}
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>
      <div className="contributions-toggle">
        <button onClick={() => setShowContributions(!showContributions)}>
          Contributions
          <ChevronDownIcon className={showContributions ? 'rotate-180' : ''} />
        </button>
      </div>
      {showContributions && (
        <div className="contributions-list">
          <h4>Contribution History</h4>
          {goal.contributions && goal.contributions.length > 0 ? (
            <ul>
              {goal.contributions.map((contrib) => (
                <li key={contrib.id}>
                  <span>{contrib.date}</span>
                  <span>{formatCurrency(contrib.amount)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No contributions recorded for this goal.</p>
          )}
        </div>
      )}
    </div>
  );
};

interface AddGoalModalProps {
  show: boolean;
  onClose: () => void;
  onAddGoal: (newGoal: Goal) => void;
}

const AddGoalModal: FC<AddGoalModalProps> = ({ show, onClose, onAddGoal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');

  if (!show) {
    return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !targetAmount) {
      console.warn("Please fill in at least 'Goal Name' and 'Target Amount'.");
      return;
    }
    const parsedCurrentAmount = parseFloat(currentAmount) || 0;
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parsedCurrentAmount,
      completed: false,
      contributions: parsedCurrentAmount > 0 ? [
        { id: crypto.randomUUID(), date: new Date().toISOString().split('T')[0], amount: parsedCurrentAmount }
      ] : []
    };
    onAddGoal(newGoal);
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    onClose();
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <h2 id="modal-title">Add New Financial Goal</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group-container">
            <div className="form-group">
              <label htmlFor="goalName">Goal Name</label>
              <input type="text" id="goalName" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Vacation Fund" />
            </div>
            <div className="form-group">
              <label htmlFor="targetAmount">Target Amount ($)</label>
              <input type="number" id="targetAmount" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="5000" min="0" />
            </div>
            <div className="form-group">
              <label htmlFor="currentAmount">Current Amount (Optional, $)</label>
              <input type="number" id="currentAmount" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} placeholder="0" min="0" />
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-btn-cancel">Cancel</button>
            <button type="submit" className="modal-btn-submit">Add Goal</button>
          </div>
        </form>
      </div>
    </>
  );
};

/**
 * Component for the "MY GOALS" page content
 */
const MyGoalsPage: FC = () => {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [showModal, setShowModal] = useState(false);
  const totalBalance = 38445.12; // This seems to be static in the wireframes

  const handleToggleComplete = (id: number | string) => {
    setGoals(goals.map(goal =>
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const handleAddGoal = (newGoal: Goal) => {
    setGoals([newGoal, ...goals]);
  };

  return (
    <>
      <div className="title-header">
        <h1>Financial Tracker</h1>
        <button onClick={() => setShowModal(true)} className="add-goal-btn" aria-label="Add new goal">
          <PlusIcon />
        </button>
      </div>
      <div className="balance-card-gradient">
        <h2>Total Balance</h2>
        <p>{formatCurrency(totalBalance)}</p>
      </div>
      <div>
        {goals.map((goal) => (
          <GoalItem key={goal.id} goal={goal} onToggleComplete={handleToggleComplete} />
        ))}
      </div>
      <AddGoalModal show={showModal} onClose={() => setShowModal(false)} onAddGoal={handleAddGoal} />
    </>
  );
};


//
// --- 2. HOME PAGE ---
//

/**
 * Component for the "HOME" page content
 */
const HomePage: FC = () => {
  const totalBalance = 38445.12;

  return (
    <>
      <div className="title-header centered">
        <h1>Financial Tracker</h1>
      </div>
      <div className="balance-card-simple">
        <h2>BALANCE:</h2>
        <p>{formatCurrency(totalBalance)}</p>
      </div>
      
      <div className="impact-card">
        <h3>Impact Summary:</h3>
        <div className="impact-list-container">
          <ul className="impact-list">
            {MOCK_IMPACT_DATA.map((item, index) => (
              <li key={item.id} className="impact-item">
                <span className="impact-item-bullet">•</span>
                <div className="impact-item-bar-container">
                  {/* --- THIS IS THE NEWLY ADDED LABEL --- */}
                  <div className="impact-item-label">{item.name}</div>
                  <div className="impact-bar-bg">
                    <div
                      className={`impact-bar-inner color-${(index % 5) + 1}`}
                      style={{ width: `${item.value}%` }}
                      title={`${item.name}: ${item.value}%`}
                    ></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

//
// --- 3. SCENARIOS PAGE ---
//

/**
 * Modal for creating a new scenario
 */
interface CreateScenarioModalProps {
  show: boolean;
  onClose: () => void;
  onRunScenario: (data: NewScenarioData) => void;
}

const CreateScenarioModal: FC<CreateScenarioModalProps> = ({ show, onClose, onRunScenario }) => {
  const [title, setTitle] = useState('');
  const [impactPeriod, setImpactPeriod] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [costEachPeriod, setCostEachPeriod] = useState('');
  const [periodUnit, setPeriodUnit] = useState('');
  
  if (!show) {
    return null;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title) {
      console.warn("Title is required.");
      return;
    }
    
    const formData: NewScenarioData = {
      title,
      impactPeriod,
      totalCost: parseFloat(totalCost) || 0,
      costEachPeriod: parseFloat(costEachPeriod) || 0,
      periodUnit
    };
    
    // Pass data up and close modal
    onRunScenario(formData);
    onClose();
    
    // Reset form
    setTitle('');
    setImpactPeriod('');
    setTotalCost('');
    setCostEachPeriod('');
    setPeriodUnit('');
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} aria-hidden="true"></div>
      <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="create-scenario-title">
        <h2 id="create-scenario-title">Create New Scenario</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="scenarioTitle">Title</label>
            <input type="text" id="scenarioTitle" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Buy a New Car" />
          </div>
          
          <div className="form-group">
            <label htmlFor="impactPeriod">Impact Period</label>
            <select id="impactPeriod" className="scenario-select" value={impactPeriod} onChange={(e) => setImpactPeriod(e.target.value)}>
              <option value="" disabled>Select impact period...</option>
              <option value="one-time">One-time</option>
              <option value="recurring">Recurring</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="totalCost">Total Cost ($)</label>
            <input type="number" id="totalCost" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} placeholder="15000" min="0" />
          </div>
          
          <div className="form-group">
            <label htmlFor="costEachPeriod">Cost each Period ($)</label>
            <input type="number" id="costEachPeriod" value={costEachPeriod} onChange={(e) => setCostEachPeriod(e.target.value)} placeholder="300" min="0" />
          </div>
          
          <div className="form-group">
            <label htmlFor="periodUnit">Period Unit</label>
            <select id="periodUnit" className="scenario-select" value={periodUnit} onChange={(e) => setPeriodUnit(e.target.value)}>
              <option value="" disabled>Select unit...</option>
              <option value="year">Year</option>
              <option value="month">Month</option>
              <option value="day">Day</option>
              <option value="hour">Hour</option>
            </select>
          </div>
          
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="modal-btn-cancel">Cancel</button>
            <button type="submit" className="modal-btn-submit">Run Scenario</button>
          </div>
        </form>
      </div>
    </>
  );
};


/**
 * Component for the "Scenario Results" screen.
 * This is shown after a scenario is run.
 */
interface ScenarioResultsProps {
  onRunNew: () => void; // Function to go back to the setup screen
}

const ScenarioResults: FC<ScenarioResultsProps> = ({ onRunNew }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(MOCK_RECOMMENDATIONS);

  const handleToggleRecommendation = (id: string) => {
    setRecommendations(recs => 
      recs.map(rec => 
        rec.id === id ? { ...rec, checked: !rec.checked } : rec
      )
    );
  };

  return (
    <>
      {/* Scenario Results Chart (re-using impact-card styles) */}
      <div className="impact-card">
        <h3>Scenario Results:</h3>
        <div className="impact-list-container" style={{ maxHeight: '150px' }}>
          <ul className="impact-list">
            {MOCK_SCENARIO_RESULTS.map((item, index) => (
              <li key={item.id} className="impact-item">
                <span className="impact-item-bullet">•</span>
                <div className="impact-item-bar-container">
                  {/* --- THIS IS THE LABEL YOU ADDED --- */}
                  <div className="impact-item-label">{item.name}</div>
                  
                  <div className="impact-bar-bg">
                    <div
                      className={`impact-bar-inner color-${(index % 5) + 1}`}
                      style={{ width: `${item.value}%` }}
                      title={`${item.name}: ${item.value}%`}
                    ></div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommendations Card */}
      <div className="recommendation-card">
        <h3>Recommendations:</h3>
        <div className="recommendation-list-container">
          <ul className="recommendation-list">
            {recommendations.map((rec) => (
              <li key={rec.id} className="recommendation-item">
                <input 
                  type="checkbox"
                  id={`rec-${rec.id}`}
                  checked={rec.checked}
                  onChange={() => handleToggleRecommendation(rec.id)}
                />
                <label htmlFor={`rec-${rec.id}`}>{rec.text}</label>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="recommendation-actions">
          <button className="scenario-button">
            Apply Recommendations
          </button>
          <button 
            className="scenario-button secondary"
            onClick={onRunNew}
          >
            Run New Scenario
          </button>
        </div>
      </div>
    </>
  );
};

/**
 * Main Component for the "SCENARIOS" page.
 * This component now manages two states:
 * 1. Scenario Setup (dropdowns)
 * 2. Scenario Results (charts and recommendations)
 */
const ScenariosPage: FC = () => {
  const totalBalance = 38445.12;
  const [savedScenario, setSavedScenario] = useState('');
  const [presetScenario, setPresetScenario] = useState('');
  const [hasRunScenario, setHasRunScenario] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false); // State for new modal

  // Handler for running a newly created scenario
  const handleCreateScenario = (data: NewScenarioData) => {
    // In a real app, you'd use this data to calculate results
    console.log("Running new scenario with data:", data);
    // For now, just close the modal and show the results page
    setShowCreateModal(false);
    setHasRunScenario(true);
  };

  // Show the Results page
  if (hasRunScenario) {
    return (
      <>
        <div className="title-header centered">
          <h1>Financial Tracker</h1>
        </div>
        <div className="balance-card-simple">
          <h2>BALANCE:</h2>
          <p>{formatCurrency(totalBalance)}</p>
        </div>
        <ScenarioResults onRunNew={() => setHasRunScenario(false)} />
      </>
    );
  }

  // Show the Setup page
  return (
    <>
      <div className="title-header centered">
        <h1>Financial Tracker</h1>
      </div>
      <div className="balance-card-simple">
        <h2>BALANCE:</h2>
        <p>{formatCurrency(totalBalance)}</p>
      </div>
      
      <div className="scenario-container">
        <div className="scenario-select-group">
          <label htmlFor="saved-scenarios">Saved Scenarios:</label>
          <select 
            id="saved-scenarios" 
            className="scenario-select"
            value={savedScenario}
            onChange={(e) => setSavedScenario(e.target.value)}
          >
            <option value="" disabled>Select a saved scenario...</option>
            {MOCK_SAVED_SCENARIOS.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>

        <div className="scenario-select-group">
          <label htmlFor="preset-scenarios">Preset Scenarios:</label>
          <select 
            id="preset-scenarios" 
            className="scenario-select"
            value={presetScenario}
            onChange={(e) => setPresetScenario(e.target.value)}
          >
            <option value="" disabled>Select a preset scenario...</option>
            {MOCK_PRESET_SCENARIOS.map((scenario) => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name}
              </option>
            ))}
          </select>
        </div>

        <div className="scenario-actions">
          <button 
            className="scenario-button"
            onClick={() => setHasRunScenario(true)}
          >
            Run Scenario
          </button>
          <button 
            className="scenario-button"
            onClick={() => setShowCreateModal(true)} // Open modal
          >
            Create New Scenario
          </button>
        </div>
      </div>
      
      {/* Render the new modal */}
      <CreateScenarioModal 
        show={showCreateModal} 
        onClose={() => setShowCreateModal(false)}
        onRunScenario={handleCreateScenario}
      />
    </>
  );
};


// --- Main Application Component ---
/**
 * This is the main "App" component.
 * It controls which page is currently visible.
 */
const App: FC = () => {
  // 'HOME' or 'MY GOALS' or 'SCENARIOS'
  const [currentPage, setCurrentPage] = useState<PageName>('HOME'); // Changed default to show the new page

  const handleNavigate = (page: PageName) => {
    setCurrentPage(page);
  };

  /**
   * This function renders the correct page based on the
   * currentPage state.
   */
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'HOME':
        return <HomePage />;
      case 'MY GOALS':
        return <MyGoalsPage />;
      case 'SCENARIOS':
        return <ScenariosPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app-container">
      <GlobalStyles /> {/* Injects all CSS */}
      <Header activeLink={currentPage} onNavigate={handleNavigate} />
      
      <main className="app-main">
        {renderCurrentPage()} {/* Renders the active page */}
      </main>
    </div>
  );
}

export default App;
