import { FC } from 'react';
import { formatCurrency } from '../utils';
import { MOCK_IMPACT_DATA, MOCK_USER_PROFILE, calculateNetWorth, calculateMonthlySavings, calculateSavingsRate } from '../data';

/**
 * Component for the "HOME" page content - Financial Dashboard
 */
const HomePage: FC = () => {
  const longTermGoals = MOCK_IMPACT_DATA.filter(item => 
    ['House Loan', 'Student Loan', 'Car Down Payment', 'Vacation Fund', 'Emergency Fund', 'Investments'].includes(item.name)
  );

  const totalBalance = longTermGoals.reduce((sum, goal) => {
    return sum + (goal.currentAmount || 0);
  }, 0);

  const monthlyExpenses = MOCK_IMPACT_DATA.filter(item =>
    ['Utilities', 'Groceries', 'Subscriptions'].includes(item.name)
  );

  const netWorth = calculateNetWorth();
  const monthlySavings = calculateMonthlySavings();
  const savingsRate = calculateSavingsRate();
  const totalMonthlyExpenses = Object.values(MOCK_USER_PROFILE.monthlyExpenses).reduce((a, b) => a + b, 0);

  // Calculate health metrics
  const emergencyFundMonths = MOCK_USER_PROFILE.accounts.savings.balance / totalMonthlyExpenses;
  const debtToIncomeRatio = (totalMonthlyExpenses / MOCK_USER_PROFILE.monthlyIncome) * 100;

  return (
    <>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <span className="welcome-label">Welcome back,</span>
          <span className="welcome-name">{MOCK_USER_PROFILE.name}</span>
        </div>
        <div className="last-updated">
          Last synced: {MOCK_USER_PROFILE.accounts.checking.lastUpdated}
        </div>
      </div>

      {/* Net Worth Card */}
      <div className="equity-display-card">
        <div className="equity-header">
          <h2>Total Net Worth</h2>
          <div className="trend-indicator positive">
            <span className="trend-arrow">↑</span>
            <span>+3.2% this month</span>
          </div>
        </div>
        <p className="equity-amount">{formatCurrency(netWorth)}</p>
        <div className="equity-breakdown">
          <div className="breakdown-item">
            <span className="breakdown-label">Checking</span>
            <span className="breakdown-value">{formatCurrency(MOCK_USER_PROFILE.accounts.checking.balance)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Savings</span>
            <span className="breakdown-value">{formatCurrency(MOCK_USER_PROFILE.accounts.savings.balance)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Investments</span>
            <span className="breakdown-value">{formatCurrency(MOCK_USER_PROFILE.accounts.investment.balance)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Retirement</span>
            <span className="breakdown-value">{formatCurrency(MOCK_USER_PROFILE.accounts.retirement.balance)}</span>
          </div>
        </div>
      </div>

      {/* Financial Health Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon savings-icon">💰</div>
          <div className="metric-content">
            <span className="metric-value">{formatCurrency(monthlySavings)}</span>
            <span className="metric-label">Monthly Savings</span>
            <div className="metric-bar-container">
              <div className="metric-bar" style={{ width: `${Math.min(savingsRate, 100)}%` }}></div>
            </div>
            <span className="metric-detail">{savingsRate.toFixed(1)}% savings rate</span>
          </div>
        </div>
        
        <div className="metric-card">
          <div className="metric-icon emergency-icon">🛡️</div>
          <div className="metric-content">
            <span className="metric-value">{emergencyFundMonths.toFixed(1)} mo</span>
            <span className="metric-label">Emergency Fund</span>
            <div className="metric-bar-container">
              <div 
                className={`metric-bar ${emergencyFundMonths >= 6 ? 'healthy' : emergencyFundMonths >= 3 ? 'warning' : 'danger'}`} 
                style={{ width: `${Math.min((emergencyFundMonths / 6) * 100, 100)}%` }}
              ></div>
            </div>
            <span className="metric-detail">{emergencyFundMonths >= 6 ? 'Healthy' : emergencyFundMonths >= 3 ? 'Building' : 'Needs attention'}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon score-icon">📊</div>
          <div className="metric-content">
            <span className="metric-value">{MOCK_USER_PROFILE.creditScore}</span>
            <span className="metric-label">Credit Score</span>
            <div className="metric-bar-container">
              <div 
                className={`metric-bar ${MOCK_USER_PROFILE.creditScore >= 740 ? 'excellent' : MOCK_USER_PROFILE.creditScore >= 670 ? 'good' : 'fair'}`}
                style={{ width: `${((MOCK_USER_PROFILE.creditScore - 300) / 550) * 100}%` }}
              ></div>
            </div>
            <span className="metric-detail">{MOCK_USER_PROFILE.creditScore >= 740 ? 'Excellent' : MOCK_USER_PROFILE.creditScore >= 670 ? 'Good' : 'Fair'}</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon expense-icon">📉</div>
          <div className="metric-content">
            <span className="metric-value">{debtToIncomeRatio.toFixed(0)}%</span>
            <span className="metric-label">Expense Ratio</span>
            <div className="metric-bar-container">
              <div 
                className={`metric-bar ${debtToIncomeRatio <= 50 ? 'healthy' : debtToIncomeRatio <= 70 ? 'warning' : 'danger'}`}
                style={{ width: `${Math.min(debtToIncomeRatio, 100)}%` }}
              ></div>
            </div>
            <span className="metric-detail">{debtToIncomeRatio <= 50 ? 'Excellent' : debtToIncomeRatio <= 70 ? 'Moderate' : 'High'}</span>
          </div>
        </div>
      </div>

      {/* Goals Progress Section */}
      <div className="impact-card" style={{ marginBottom: '1rem' }}>
        <div className="card-header-with-action">
          <h3>Long Term Goals</h3>
          <span className="card-subtitle">{longTermGoals.length} active goals</span>
        </div>
        <div className="impact-list-container">
          <ul className="impact-list">
            {longTermGoals.map((item, index) => {
              const progressPercent = item.value;
              const remaining = (item.targetAmount || 0) - (item.currentAmount || 0);
              return (
                <li key={item.id} className="impact-item enhanced">
                  <div className="impact-item-bar-container">
                    <div className="impact-item-header-row">
                      <span className="impact-item-name">{item.name}</span>
                      <span className="impact-item-percentage">{progressPercent.toFixed(1)}%</span>
                    </div>
                    <div className="impact-bar-bg enhanced">
                      <div
                        className={`impact-bar-inner color-${(index % 5) + 1}`}
                        style={{ width: `${progressPercent}%` }}
                      >
                        {progressPercent > 15 && (
                          <span className="bar-value-inside">{formatCurrency(item.currentAmount || 0)}</span>
                        )}
                      </div>
                    </div>
                    <div className="impact-item-footer-row">
                      <span className="impact-current">{formatCurrency(item.currentAmount || 0)} saved</span>
                      <span className="impact-target">Goal: {formatCurrency(item.targetAmount || 0)}</span>
                    </div>
                    {remaining > 0 && (
                      <span className="impact-remaining">{formatCurrency(remaining)} remaining</span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Monthly Budget Overview */}
      <div className="impact-card">
        <div className="card-header-with-action">
          <h3>Monthly Budget</h3>
          <span className="card-subtitle">Income: {formatCurrency(MOCK_USER_PROFILE.monthlyIncome)}</span>
        </div>
        <div className="budget-overview">
          <div className="budget-summary">
            <div className="budget-item expenses">
              <span className="budget-label">Total Expenses</span>
              <span className="budget-value">{formatCurrency(totalMonthlyExpenses)}</span>
            </div>
            <div className="budget-item savings">
              <span className="budget-label">Net Savings</span>
              <span className="budget-value positive">+{formatCurrency(monthlySavings)}</span>
            </div>
          </div>
        </div>
        <div className="impact-list-container">
          <ul className="impact-list">
            {Object.entries(MOCK_USER_PROFILE.monthlyExpenses).map(([key, value], index) => {
              const percentage = (value / MOCK_USER_PROFILE.monthlyIncome) * 100;
              const label = key.charAt(0).toUpperCase() + key.slice(1);
              return (
                <li key={key} className="impact-item enhanced">
                  <div className="impact-item-bar-container">
                    <div className="impact-item-header-row">
                      <span className="impact-item-name">{label}</span>
                      <span className="impact-item-amount">{formatCurrency(value)}</span>
                    </div>
                    <div className="impact-bar-bg enhanced">
                      <div
                        className={`impact-bar-inner color-${(index % 5) + 1}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="impact-item-footer-row">
                      <span className="impact-percentage-label">{percentage.toFixed(1)}% of income</span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
};

export default HomePage;
