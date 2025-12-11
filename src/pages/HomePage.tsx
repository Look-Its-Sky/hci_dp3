import { FC } from 'react';
import { formatCurrency } from '../utils';
import { MOCK_IMPACT_DATA, calculateNetWorthForUser, calculateMonthlySavingsForUser, calculateSavingsRateForUser, USER_PROFILES } from '../data';
import { useAuth } from '../contexts/AuthContext';

const HomePage: FC = () => {
  const { currentUser } = useAuth();
  const userProfile = currentUser || USER_PROFILES['user-001'];

  const longTermGoals = userProfile.goals || MOCK_IMPACT_DATA.filter(item => 
    ['House Loan', 'Student Loan', 'Car Down Payment', 'Vacation Fund', 'Emergency Fund', 'Investments'].includes(item.name)
  );

  const longTermGoalsWithProgress = longTermGoals.map(goal => ({
    ...goal,
    value: ((goal.currentAmount || 0) / (goal.targetAmount || 1)) * 100
  }));

  const netWorth = calculateNetWorthForUser(userProfile);
  const monthlySavings = calculateMonthlySavingsForUser(userProfile);
  const savingsRate = calculateSavingsRateForUser(userProfile);
  const totalMonthlyExpenses = Object.values(userProfile.monthlyExpenses).reduce((a, b) => a + b, 0);

  const emergencyFundMonths = userProfile.accounts.savings.balance / totalMonthlyExpenses;
  const debtToIncomeRatio = (totalMonthlyExpenses / userProfile.monthlyIncome) * 100;

  return (
    <>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="welcome-text">
          <span className="welcome-label">Welcome back,</span>
          <span className="welcome-name">{userProfile.name}</span>
        </div>
        <div className="last-updated">
          Last synced: {userProfile.accounts.checking.lastUpdated}
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
            <span className="breakdown-value">{formatCurrency(userProfile.accounts.checking.balance)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Savings</span>
            <span className="breakdown-value">{formatCurrency(userProfile.accounts.savings.balance)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Investments</span>
            <span className="breakdown-value">{formatCurrency(userProfile.accounts.investment.balance)}</span>
          </div>
          <div className="breakdown-item">
            <span className="breakdown-label">Retirement</span>
            <span className="breakdown-value">{formatCurrency(userProfile.accounts.retirement.balance)}</span>
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
            <span className="metric-value">{userProfile.creditScore}</span>
            <span className="metric-label">Credit Score</span>
            <div className="metric-bar-container">
              <div 
                className={`metric-bar ${userProfile.creditScore >= 740 ? 'excellent' : userProfile.creditScore >= 670 ? 'good' : 'fair'}`}
                style={{ width: `${((userProfile.creditScore - 300) / 550) * 100}%` }}
              ></div>
            </div>
            <span className="metric-detail">{userProfile.creditScore >= 740 ? 'Excellent' : userProfile.creditScore >= 670 ? 'Good' : 'Fair'}</span>
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
          <span className="card-subtitle">{longTermGoalsWithProgress.length} active goals</span>
        </div>
        <div className="impact-list-container">
          <ul className="impact-list">
            {longTermGoalsWithProgress.map((item, index) => {
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
          <span className="card-subtitle">Income: {formatCurrency(userProfile.monthlyIncome)}</span>
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
            {Object.entries(userProfile.monthlyExpenses).map(([key, value], index) => {
              const percentage = (value / userProfile.monthlyIncome) * 100;
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
